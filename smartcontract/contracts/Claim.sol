// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./helper.sol";
import "./emitter.sol";

interface IERC20Extended is IERC20 {
    function decimals() external view returns (uint8);
}

contract Claim is AccessControl {
    using SafeERC20 for IERC20;

    address public emitterContract;

    ///@dev Counter to keep track of claimed token ids
    uint private counter;

    ///@dev Airdrop balance
    uint public claimBalance;

    ///@dev claim settings
    ClaimSettings public claimSettings;

    ///@dev mapping to check if user has already claimed
    mapping(address => bool) public hasClaimed;

    ///@dev mapping to keep track of amount to claim for a address
    mapping(address => uint) public claimAmount;

    ///@dev mapping to keep track tokenIds to claim for a address
    mapping(address => uint[]) public claimTokenIds;

    error InvalidAmount();
    error AlreadyClaimed();
    error ClaimNotStarted();
    error ClaimClosed();
    error ClaimLimitReached();

    constructor(
        address _admin,
        ClaimSettings memory _claimSettings,
        address _emitter
    ) {
        claimSettings = _claimSettings;
        claimBalance = _claimSettings.claimAmountDetails.totalClaimAmount;

        if (!claimSettings.hasAllowanceMechanism) {
            claimSettings.walletAddress = address(this);
        }

        emitterContract = _emitter;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    /// @notice This function is used to allocate particular amount of tokens
    /// @dev This function maps claim amount to a address based on settings
    /// @param _amount amount in decimals to claim
    /// @param _merkleProof merkle proof to check validity
    function claim(
        uint _amount,
        bytes32[] calldata _merkleProof,
        bytes memory _encodedData
    ) external {
        if (!claimSettings.isEnabled) revert ClaimNotStarted();
        if (claimSettings.startTime > block.timestamp) revert ClaimNotStarted();
        if (claimSettings.endTime < block.timestamp) revert ClaimClosed();

        uint _claimAmount;
        if (!hasClaimed[msg.sender]) {
            _claimAmount = checkAmount(msg.sender);

            //Checking permissions
            if (uint(claimSettings.permission) == 0) {
                require(
                    IERC20(claimSettings.daoToken).balanceOf(msg.sender) > 0,
                    "Token gated"
                );
            } else if (uint(claimSettings.permission) == 1) {
                require(
                    IERC721(claimSettings.daoToken).balanceOf(msg.sender) > 0,
                    "Token gated"
                );
            } else if (uint(claimSettings.permission) == 2) {
                bytes32 leaf = keccak256(_encodedData);
                (, uint256 _amt) = abi.decode(_encodedData, (address, uint256));
                require(
                    MerkleProof.verify(
                        _merkleProof,
                        claimSettings.merkleRoot,
                        leaf
                    ),
                    "Incorrect proof"
                );
                _claimAmount = _amt;
            } else {
                require((uint(claimSettings.permission) == 3));
            }

            //Setting claim amount
            if (claimSettings.isNFT) {
                for (uint i; i < _claimAmount; ) {
                    claimTokenIds[msg.sender].push(
                        claimSettings.claimAmountDetails.tokenIds[counter]
                    );

                    unchecked {
                        ++counter;
                        ++i;
                    }
                }
            } else {
                claimAmount[msg.sender] = _claimAmount;
            }

            hasClaimed[msg.sender] = true;
        }

        //Airdropping tokens if there is no cooldown period
        if (!claimSettings.cooldownDetails.hasCooldownPeriod) {
            airdropTokens(msg.sender, _amount);
        }

        ClaimEmitter(emitterContract).airdropClaimed(
            address(this),
            msg.sender,
            claimSettings.airdropToken,
            claimAmount[msg.sender],
            _amount
        );
    }

    ///@dev This function converts daoToken decimals to airdropToken decimals
    function decimalConversion(
        uint _amount
    ) private view returns (uint _conversion) {
        uint airdropTokenDecimals = IERC20Extended(claimSettings.airdropToken)
            .decimals();
        uint daoTokenDecimals = IERC20Extended(claimSettings.daoToken)
            .decimals();
        if (airdropTokenDecimals > daoTokenDecimals) {
            _conversion =
                _amount *
                (10 ** (airdropTokenDecimals - daoTokenDecimals));
        } else if (airdropTokenDecimals < daoTokenDecimals) {
            _conversion =
                _amount /
                (10 ** (daoTokenDecimals - airdropTokenDecimals));
        } else {
            _conversion = _amount;
        }
    }

    ///@dev This function checks if amount is valid and returns based on claim settings
    function checkAmount(
        address _user
    ) public view returns (uint _claimAmount) {
        if (claimSettings.claimAmountDetails.isMaxClaimable) {
            _claimAmount = claimSettings.claimAmountDetails.maxClaimable;
        } else {
            if (claimSettings.daoToken != address(0)) {
                //pro-rata based calculations
                //claimAmount = (totalClaimAmount * balanceOf(user)) / totalSupply
                if (claimSettings.isNFT) {
                    _claimAmount =
                        (claimSettings.claimAmountDetails.tokenIds.length *
                            IERC721(claimSettings.daoToken).balanceOf(_user)) /
                        claimSettings.nftTotalSupply;
                } else {
                    _claimAmount =
                        (claimSettings.claimAmountDetails.totalClaimAmount *
                            decimalConversion(
                                IERC20(claimSettings.daoToken).balanceOf(_user)
                            )) /
                        decimalConversion(
                            IERC20(claimSettings.daoToken).totalSupply()
                        );
                }
            } else {
                return 0;
            }
        }
    }

    /// @notice This function is used to disburse allocated tokens
    /// @dev This function gets mapped amount for a particular user and transfers it
    /// @dev User can make multiple calls to this function to withdraw tokens
    /// @param _user address of user to airdrop tokens
    function airdropTokens(address _user, uint _amount) private {
        if (claimSettings.cooldownDetails.hasCooldownPeriod) {
            require(
                block.timestamp >= claimSettings.cooldownDetails.cooldownPeriod,
                "Cooldown period not yet ended"
            );
        }

        //Transfering tokens
        if (claimSettings.isNFT) {
            for (uint i; i < claimTokenIds[_user].length; ) {
                IERC721(claimSettings.airdropToken).safeTransferFrom(
                    claimSettings.walletAddress,
                    _user,
                    claimTokenIds[_user][i]
                );
                unchecked {
                    ++i;
                }
            }
            claimBalance -= claimTokenIds[_user].length;
            delete claimTokenIds[_user];
        } else {
            require(
                claimAmount[_user] >= _amount,
                "Insufficient claimable amount"
            );
            require(claimBalance >= _amount, "Insufficient balance");
            if (claimSettings.hasAllowanceMechanism) {
                IERC20(claimSettings.airdropToken).safeTransferFrom(
                    claimSettings.walletAddress,
                    _user,
                    _amount
                );
            } else {
                IERC20(claimSettings.airdropToken).safeTransfer(_user, _amount);
            }
            //Updating remaining claim amount
            claimAmount[_user] -= _amount;
            claimBalance -= _amount;
        }
    }

    /// @dev This function is used to withdraw tokens deposited by the admin
    /// @dev Only admin can call this function
    /// @param _amount Amount of tokens to withdraw
    function rollbackTokens(
        uint _amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(claimBalance >= _amount, "Insufficien balance");

        IERC20(claimSettings.airdropToken).safeTransfer(
            claimSettings.rollbackAddress,
            _amount
        );

        claimSettings.claimAmountDetails.totalClaimAmount -= _amount;
        claimBalance -= _amount;

        ClaimEmitter(emitterContract).rollbackTokens(
            address(this),
            msg.sender,
            _amount
        );
    }

    /// @dev This function is used to change merkle root
    /// @dev Only admin can call this function
    /// @param _newRoot New merkle root
    function changeRoot(
        bytes32 _newRoot
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimSettings.merkleRoot = _newRoot;
        ClaimEmitter(emitterContract).changeRoot(address(this), _newRoot);
    }

    /// @dev This function is used to change claim amount details
    /// @dev Only admin can call this function
    /// @param _claimAmountDetails New claim amount details
    function changeClaimAmountDetails(
        ClaimAmountDetails memory _claimAmountDetails
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimSettings.claimAmountDetails = _claimAmountDetails;
        ClaimEmitter(emitterContract).changeClaimAmountDetails(
            address(this),
            _claimAmountDetails
        );
    }

    /// @dev This function is used to change cool down details
    /// @dev Only admin can call this function
    /// @param _cooldownDetails New cooldown details
    function changeCooldownDetails(
        CooldownDetails memory _cooldownDetails
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimSettings.cooldownDetails = _cooldownDetails;
        ClaimEmitter(emitterContract).changeCooldownDetails(
            address(this),
            _cooldownDetails
        );
    }

    /// @dev This function is used to toggle claim on/off
    /// @dev Only admin can call this function
    function toggleClaim() external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimSettings.isEnabled = !claimSettings.isEnabled;
        ClaimEmitter(emitterContract).toggleClaim(
            address(this),
            claimSettings.isEnabled
        );
    }

    /// @dev This function is used to change claim start and end time
    /// @dev Only admin can call this function
    /// @param _startTime New start time
    /// @param _endTime New end time
    function changeStartAndEndTime(
        uint _startTime,
        uint _endTime
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimSettings.startTime = _startTime;
        claimSettings.endTime = _endTime;
        ClaimEmitter(emitterContract).changeStartAndEndTime(
            address(this),
            _startTime,
            _endTime
        );
    }

    /// @dev This function is used to change rollback address
    /// @dev Only admin can call this function
    /// @param _newAddress New rollback address
    function changeRollbackAddress(
        address _newAddress
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimSettings.rollbackAddress = _newAddress;
        ClaimEmitter(emitterContract).changeRollbackAddress(
            address(this),
            _newAddress
        );
    }

    function encode(
        address _userAddress,
        uint256 _amount
    ) public pure returns (bytes memory) {
        return abi.encode(_userAddress, _amount);
    }
}

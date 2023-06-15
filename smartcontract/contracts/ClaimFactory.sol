// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Claim.sol";
import "./emitter.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ClaimFactory is AccessControl {
    using SafeERC20 for IERC20;

    address public emitterContract;

    error InvalidAddress();
    error InvalidTime();
    error InvalidAmount();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    event NewClaimContract(address _newClaimContract);

    function deployClaimContract(ClaimSettings memory _claimSettings) external {
        if (_claimSettings.airdropToken == address(0)) revert InvalidAddress();

        if (_claimSettings.walletAddress == address(0)) revert InvalidAddress();

        if (_claimSettings.startTime > _claimSettings.endTime)
            revert InvalidTime();

        if (
            _claimSettings.claimAmountDetails.isMaxClaimable == true &&
            _claimSettings.claimAmountDetails.maxClaimable == 0
        ) revert InvalidAmount();

        if (
            _claimSettings.cooldownDetails.hasCooldownPeriod == true &&
            _claimSettings.cooldownDetails.cooldownPeriod == 0
        ) revert InvalidTime();

        //To check if airdrop token is NFT
        try
            IERC165(_claimSettings.airdropToken).supportsInterface(0xd9b67a26)
        returns (bool _isNFT) {
            if (_isNFT) _claimSettings.isNFT = true;
        } catch (bytes memory) {}

        //Deploying new claim contract
        Claim newClaimContract = new Claim(
            msg.sender,
            _claimSettings,
            emitterContract
        );

        //Depositing tokens in claim contract if token is ERC20 and hasAllowanceMechanism = false
        if (!_claimSettings.hasAllowanceMechanism && !_claimSettings.isNFT) {
            IERC20(_claimSettings.airdropToken).safeTransferFrom(
                msg.sender,
                address(newClaimContract),
                _claimSettings.claimAmountDetails.totalClaimAmount
            );
        }

        emit NewClaimContract(address(newClaimContract));
        ClaimEmitter(emitterContract).claimContractDeployed(
            _claimSettings,
            msg.sender,
            address(newClaimContract)
        );
    }

    function setEmitter(
        address _emitter
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emitterContract = _emitter;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./helper.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title StationXFactory Emitter Contract
/// @dev Contract Emits events for Factory and Proxy
contract ClaimEmitter is AccessControl {
    address private _factoryAddress;
    bytes32 public constant EMITTER = keccak256("EMITTER");

    //FACTORY EVENTS
    event ClaimContractDeployed(
        ClaimSettings claimSettings,
        address admin,
        address claimContract
    );

    //Claim contract events

    event AirdropClaimed(
        address claimContract,
        address user,
        address token,
        uint claimableAmount,
        uint airdropAmount
    );

    event RollbackTokens(
        address claimContract,
        address rollbackAddress,
        uint amount
    );

    event ChangeRoot(address claimContract, bytes32 newRoot);

    event ChangeStartAndEndTime(
        address claimContract,
        uint newStartTime,
        uint newEndTime
    );

    event ChangeRollbackAddress(address claimContract, address newAddress);

    event ToggleClaim(address claimContract, bool status);

    event ChangeCooldownDetails(
        address claimContract,
        CooldownDetails cooldownDetails
    );

    event ChangeClaimAmountDetails(
        address claimContract,
        ClaimAmountDetails claimAmountDetails
    );

    modifier onlyFactory() {
        require(msg.sender == _factoryAddress);
        _;
    }

    constructor(address _factory) {
        _factoryAddress = _factory;
    }

    function claimContractDeployed(
        ClaimSettings memory _claimSettings,
        address _admin,
        address _claimContract
    ) external onlyFactory {
        _grantRole(EMITTER, _claimContract);
        emit ClaimContractDeployed(_claimSettings, _admin, _claimContract);
    }

    function airdropClaimed(
        address _claimContract,
        address _user,
        address _token,
        uint _claimableAmount,
        uint _airdropAmount
    ) external onlyRole(EMITTER) {
        emit AirdropClaimed(
            _claimContract,
            _user,
            _token,
            _claimableAmount,
            _airdropAmount
        );
    }

    function rollbackTokens(
        address _claimContract,
        address _rollbackAddress,
        uint _amount
    ) external onlyRole(EMITTER) {
        emit RollbackTokens(_claimContract, _rollbackAddress, _amount);
    }

    function changeRoot(
        address _claimContract,
        bytes32 _newRoot
    ) external onlyRole(EMITTER) {
        emit ChangeRoot(_claimContract, _newRoot);
    }

    function changeStartAndEndTime(
        address _claimContract,
        uint _newStartTime,
        uint _newEndTime
    ) external onlyRole(EMITTER) {
        emit ChangeStartAndEndTime(_claimContract, _newStartTime, _newEndTime);
    }

    function changeRollbackAddress(
        address _claimContract,
        address _newAddress
    ) external onlyRole(EMITTER) {
        emit ChangeRollbackAddress(_claimContract, _newAddress);
    }

    function toggleClaim(
        address _claimContract,
        bool _status
    ) external onlyRole(EMITTER) {
        emit ToggleClaim(_claimContract, _status);
    }

    function changeCooldownDetails(
        address _claimContract,
        CooldownDetails memory _cooldownDetails
    ) external onlyRole(EMITTER) {
        emit ChangeCooldownDetails(_claimContract, _cooldownDetails);
    }

    function changeClaimAmountDetails(
        address _claimContract,
        ClaimAmountDetails memory _claimAmountDetails
    ) external onlyRole(EMITTER) {
        emit ChangeClaimAmountDetails(_claimContract, _claimAmountDetails);
    }
}

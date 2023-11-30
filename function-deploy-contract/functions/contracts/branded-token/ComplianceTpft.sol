// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC4626.sol)

pragma solidity ^0.8.9;

import "../trex/compliance/legacy/features/CountryRestrictions.sol";
import "../trex/roles/AgentRole.sol";


/**
 */
contract ComplianceTpft is CountryRestrictions {

    constructor (uint16[] memory countries) {
       batchRestrictCountries(countries);
        // addCountryRestriction(643);
    }

    // function batchRestrictCountries(uint16[] calldata _countries) internal {
    //     require(_countries.length < 195, "maximum 195 can be restricted in one batch");
    //     for (uint256 i = 0; i < _countries.length; i++) {
    //         require((_restrictedCountries[msg.sender])[_countries[i]] == false, "country already restricted");
    //         (_restrictedCountries[msg.sender])[_countries[i]] = true;
    //         // emit AddedRestrictedCountry(msg.sender, _countries[i]);
    //     }
    // }
    
    /**
    *  @dev See {ICompliance-transferred}.
    */
    // solhint-disable-next-line no-empty-blocks
    function transferred(address _from, address _to, uint256 _value) external override {
    }

    /**
     *  @dev See {ICompliance-created}.
     */
    // solhint-disable-next-line no-empty-blocks
    function created(address _to, uint256 _value) external override {
    }

    /**
     *  @dev See {ICompliance-destroyed}.
     */
    // solhint-disable-next-line no-empty-blocks
    function destroyed(address _from, uint256 _value) external override {
    }

    /**
     *  @dev See {ICompliance-canTransfer}.
     */
    function canTransfer(address _from, address _to, uint256 _value) external view override returns (bool) {
        return complianceCheckOnCountryRestrictions(_from, _to, _value);
    }
}
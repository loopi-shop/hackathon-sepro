// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC4626.sol)

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../onchain-id/factory/IIdFactory.sol";
import "../onchain-id/Identity.sol";
import "../onchain-id/interface/IIdentity.sol";
import "../trex/registry/interface/IIdentityRegistry.sol";


/**
 */
contract KycManagerTpft is Ownable {

    IIdFactory internal _identityFactory;
    IIdentityRegistry internal _identityRegistry;

    constructor (
        address identityFactory_,
        address identityRegistry_
    ) {
        setIdentityFactory(identityFactory_);
        setIdentityRegistry(identityRegistry_);
    }
    
    function approveKyc(
        address _wallet,
        string memory _salt,
        bytes32[] memory _managementKeys,
        uint16 country,
        uint256 _topic,
        uint256 _scheme,
        address _issuer,
        bytes memory _signature,
        bytes memory _data,
        string memory _uri
    ) public onlyOwner {
        address identityAddress = _identityFactory.createIdentityWithManagementKeys(_wallet, _salt, _managementKeys);

        Identity identity = Identity(identityAddress);

        identity.addClaim(
            _topic,
            _scheme,
            _issuer,
            _signature,
            _data,
            _uri
        );

        addIdentityToIdentityRegistry(_wallet, identityAddress, country);
    }

    function addIdentityToIdentityRegistry(
        address _wallet,
        address _identityAddress,
        uint16 country
    ) public onlyOwner {
        Identity identity = Identity(_identityAddress);

        address[] memory wallets = new address[](1);
        wallets[0] = _wallet;

        IIdentity[] memory identities = new IIdentity[](1);
        identities[0] = identity;

        uint16[] memory countries = new uint16[](1);
        countries[0] = country;

        _identityRegistry.batchRegisterIdentity(wallets, identities, countries);

    }

    function setIdentityFactory(address identityFactory_) public onlyOwner {
        _identityFactory = IIdFactory(identityFactory_);
    }

    function setIdentityRegistry(address identityRegistry_) public onlyOwner {
        _identityRegistry = IIdentityRegistry(identityRegistry_);
    }

    function transferIdentityFactoryOwnership(address newOwner) public onlyOwner {
        Ownable(address(_identityFactory)).transferOwnership(newOwner);
    }
}
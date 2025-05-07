//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "../../registry/ENS.sol";
import "../../ethregistrar/IBaseRegistrar.sol";
import {NameCoder} from "../../utils/NameCoder.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TestUnwrap is Ownable {
    bytes32 private constant BEAM_NODE =
        0xf12f2b0e3f6bb77c8bc21dd142030369e9bbc442b72f35a03b64c26957806e91;

    ENS public immutable ens;
    IBaseRegistrar public immutable registrar;
    mapping(address => bool) public approvedWrapper;

    constructor(ENS _ens, IBaseRegistrar _registrar) {
        ens = _ens;
        registrar = _registrar;
    }

    function setWrapperApproval(
        address wrapper,
        bool approved
    ) public onlyOwner {
        approvedWrapper[wrapper] = approved;
    }

    function wrapETH2LD(
        string calldata label,
        address wrappedOwner,
        uint32 fuses,
        uint64 expiry,
        address resolver
    ) public {
        _unwrapETH2LD(keccak256(bytes(label)), wrappedOwner, msg.sender);
    }

    function setSubnodeRecord(
        bytes32 parentNode,
        string memory label,
        address newOwner,
        address resolver,
        uint64 ttl,
        uint32 fuses,
        uint64 expiry
    ) public {
        bytes32 node = _makeNode(parentNode, keccak256(bytes(label)));
        _unwrapSubnode(node, newOwner, msg.sender);
    }

    function wrapFromUpgrade(
        bytes calldata name,
        address wrappedOwner,
        uint32 fuses,
        uint64 expiry,
        address approved,
        bytes calldata extraData
    ) public {
        (bytes32 labelhash, uint256 offset) = NameCoder.readLabel(name, 0);
        bytes32 parentNode = NameCoder.namehash(name, offset);
        bytes32 node = _makeNode(parentNode, labelhash);

        if (parentNode == BEAM_NODE) {
            _unwrapETH2LD(labelhash, wrappedOwner, msg.sender);
        } else {
            _unwrapSubnode(node, wrappedOwner, msg.sender);
        }
    }

    function _unwrapETH2LD(
        bytes32 labelhash,
        address wrappedOwner,
        address sender
    ) private {
        uint256 tokenId = uint256(labelhash);
        address registrant = registrar.ownerOf(tokenId);

        require(
            approvedWrapper[sender] &&
                sender == registrant &&
                registrar.isApprovedForAll(registrant, address(this)),
            "Unauthorised"
        );

        registrar.reclaim(tokenId, wrappedOwner);
        registrar.transferFrom(registrant, wrappedOwner, tokenId);
    }

    function _unwrapSubnode(
        bytes32 node,
        address newOwner,
        address sender
    ) private {
        address owner = ens.owner(node);

        require(
            approvedWrapper[sender] &&
                owner == sender &&
                ens.isApprovedForAll(owner, address(this)),
            "Unauthorised"
        );

        ens.setOwner(node, newOwner);
    }

    function _makeNode(
        bytes32 node,
        bytes32 labelhash
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(node, labelhash));
    }
}

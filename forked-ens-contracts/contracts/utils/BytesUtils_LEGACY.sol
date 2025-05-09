//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// ********************************************************************************
/// @dev DO NOT USE THIS CONTRACT
/// This library is provided so NameWrapper can remain unmodified.
/// The rest of the repo can switch to NameCoder, w/hashed label support.
// ********************************************************************************

import {BytesUtils} from "./BytesUtils.sol";

library BytesUtils_LEGACY {
    /// @dev Returns the ENS namehash of a DNS-encoded name.
    /// @param self The DNS-encoded name to hash.
    /// @param offset The offset at which to start hashing.
    /// @return The namehash of the name.
    function namehash(
        bytes memory self,
        uint256 offset
    ) internal pure returns (bytes32) {
        (bytes32 labelhash, uint256 newOffset) = readLabel(self, offset);
        if (labelhash == bytes32(0)) {
            require(offset == self.length - 1, "namehash: Junk at end of name");
            return bytes32(0);
        }
        return
            keccak256(abi.encodePacked(namehash(self, newOffset), labelhash));
    }

    /// @dev Returns the keccak-256 hash of a DNS-encoded label, and the offset to the start of the next label.
    /// @param self The byte string to read a label from.
    /// @param idx The index to read a label at.
    /// @return labelhash The hash of the label at the specified index, or 0 if it is the last label.
    /// @return newIdx The index of the start of the next label.
    function readLabel(
        bytes memory self,
        uint256 idx
    ) internal pure returns (bytes32 labelhash, uint256 newIdx) {
        require(idx < self.length, "readLabel: Index out of bounds");
        uint256 len = uint256(uint8(self[idx]));
        if (len > 0) {
            labelhash = BytesUtils.keccak(self, idx + 1, len);
        } else {
            labelhash = bytes32(0);
        }
        newIdx = idx + len + 1;
    }
}

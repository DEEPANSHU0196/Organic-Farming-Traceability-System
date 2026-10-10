// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TraceabilityRegistry {
    struct TraceEvent {
        uint256 index;
        string productId;
        string eventType;
        string payloadHash;
        address actor;
        uint256 timestamp;
    }

    mapping(string => TraceEvent[]) private productEvents;

    event EventRecorded(
        string indexed productId,
        string eventType,
        string payloadHash,
        uint256 indexed index,
        address actor,
        uint256 timestamp
    );

    function appendTraceEvent(
        string calldata productId,
        string calldata eventType,
        string calldata payloadHash
    ) external {
        uint256 index = productEvents[productId].length;

        productEvents[productId].push(
            TraceEvent({
                index: index,
                productId: productId,
                eventType: eventType,
                payloadHash: payloadHash,
                actor: msg.sender,
                timestamp: block.timestamp
            })
        );

        emit EventRecorded(productId, eventType, payloadHash, index, msg.sender, block.timestamp);
    }

    function getTraceCount(string calldata productId) external view returns (uint256) {
        return productEvents[productId].length;
    }

    function getTraceEvent(string calldata productId, uint256 index) external view returns (TraceEvent memory) {
        require(index < productEvents[productId].length, "Trace event not found");
        return productEvents[productId][index];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TraceabilityRegistry {
    struct Product {
        bytes32 metadataHash;
        address registeredBy;
        uint64 registeredAt;
    }

    struct TraceEvent {
        string eventId;
        string eventType;
        bytes32 dataHash;
        address actor;
        uint64 timestamp;
    }

    struct EventReference {
        string productId;
        uint256 index;
    }

    address public immutable owner;
    mapping(address => bool) public authorizedWriters;
    mapping(string => Product) private products;
    mapping(string => TraceEvent[]) private productEvents;
    mapping(string => bool) public eventIdUsed;
    mapping(string => EventReference) private eventReferences;

    error Unauthorized();
    error InvalidAddress();
    error InvalidArrayLength();
    error EmptyProductId();
    error EmptyEventId();
    error EmptyEventType();
    error ProductAlreadyRegistered(string productId);
    error ProductNotRegistered(string productId);
    error EventIdAlreadyUsed(string eventId);
    error TraceEventNotFound(string productId, uint256 index);

    event WriterAuthorizationChanged(address indexed writer, bool authorized);
    event ProductRegistered(
        string indexed productId,
        bytes32 metadataHash,
        address indexed registeredBy,
        uint64 registeredAt
    );
    event TraceEventAppended(
        string indexed productId,
        string indexed eventId,
        string eventType,
        bytes32 dataHash,
        address actor,
        uint64 timestamp
    );

    constructor() {
        owner = msg.sender;
        authorizedWriters[msg.sender] = true;
        emit WriterAuthorizationChanged(msg.sender, true);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyWriter() {
        if (!authorizedWriters[msg.sender]) revert Unauthorized();
        _;
    }

    function setAuthorizedWriter(address writer, bool authorized) external onlyOwner {
        if (writer == address(0)) revert InvalidAddress();
        authorizedWriters[writer] = authorized;
        emit WriterAuthorizationChanged(writer, authorized);
    }

    function registerProducts(
        string[] calldata productIds,
        bytes32[] calldata metadataHashes
    ) external onlyWriter {
        if (productIds.length != metadataHashes.length) revert InvalidArrayLength();

        for (uint256 i = 0; i < productIds.length; i++) {
            string calldata productId = productIds[i];
            if (bytes(productId).length == 0) revert EmptyProductId();
            if (products[productId].registeredAt != 0) {
                revert ProductAlreadyRegistered(productId);
            }

            uint64 registeredAt = uint64(block.timestamp);
            products[productId] = Product({
                metadataHash: metadataHashes[i],
                registeredBy: msg.sender,
                registeredAt: registeredAt
            });
            emit ProductRegistered(productId, metadataHashes[i], msg.sender, registeredAt);
        }
    }

    function appendTraceEvent(
        string calldata productId,
        string calldata eventId,
        string calldata eventType,
        bytes32 dataHash
    ) external onlyWriter {
        if (bytes(productId).length == 0) revert EmptyProductId();
        if (bytes(eventId).length == 0) revert EmptyEventId();
        if (bytes(eventType).length == 0) revert EmptyEventType();
        if (products[productId].registeredAt == 0) {
            revert ProductNotRegistered(productId);
        }
        if (eventIdUsed[eventId]) revert EventIdAlreadyUsed(eventId);

        uint256 index = productEvents[productId].length;
        uint64 timestamp = uint64(block.timestamp);
        productEvents[productId].push(
            TraceEvent({
                eventId: eventId,
                eventType: eventType,
                dataHash: dataHash,
                actor: msg.sender,
                timestamp: timestamp
            })
        );
        eventIdUsed[eventId] = true;
        eventReferences[eventId] = EventReference({productId: productId, index: index});

        emit TraceEventAppended(productId, eventId, eventType, dataHash, msg.sender, timestamp);
    }

    function isProductRegistered(string calldata productId) external view returns (bool) {
        return products[productId].registeredAt != 0;
    }

    function getProduct(
        string calldata productId
    ) external view returns (bytes32 metadataHash, address registeredBy, uint64 registeredAt) {
        Product storage product = products[productId];
        if (product.registeredAt == 0) revert ProductNotRegistered(productId);
        return (product.metadataHash, product.registeredBy, product.registeredAt);
    }

    function getTraceCount(string calldata productId) external view returns (uint256) {
        return productEvents[productId].length;
    }

    function getTraceEvent(
        string calldata productId,
        uint256 index
    ) external view returns (TraceEvent memory) {
        if (index >= productEvents[productId].length) {
            revert TraceEventNotFound(productId, index);
        }
        return productEvents[productId][index];
    }

    function getTraceEventById(
        string calldata eventId
    ) external view returns (string memory productId, TraceEvent memory traceEvent) {
        if (!eventIdUsed[eventId]) revert EmptyEventId();
        EventReference storage eventReference = eventReferences[eventId];
        return (
            eventReference.productId,
            productEvents[eventReference.productId][eventReference.index]
        );
    }
}
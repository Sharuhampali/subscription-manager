// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionManager {
    // A struct to hold subscription details.
    struct Subscription {
        
        string serviceName;     // Name of the subscribed service (e.g., "Netflix")
        uint256 startTime;      // Timestamp of when the subscription began
        uint256 duration;       // Duration of one subscription period in seconds
        uint256 nextPaymentDue; // Timestamp for the next payment due
        bool active;            // Subscription active status
    }

    // Mapping from a subscriber address to a list of their subscriptions.
    mapping(address => Subscription[]) public subscriptions;

    // Events for logging actions on the blockchain.
    event Subscribed(
        address indexed subscriber,
        string serviceName,
        uint256 startTime,
        uint256 duration,
        uint256 nextPaymentDue
    );
    event SubscriptionCancelled(
        address indexed subscriber,
        string serviceName,
        uint256 cancelTime
    );
    event PaymentLogged(
        address indexed subscriber,
        string serviceName,
        uint256 paymentTime
    );

    /**
     * @notice Subscribe to a service.
     * @param _serviceName The name of the service.
     * @param _duration The subscription period in seconds.
     *
     * Note: This function is payable if you decide to integrate wallet-based
     * payments later. For now, we assume no payment requirement.
     */
    function subscribe(string memory _serviceName, uint256 _duration) public payable {
        uint256 startTime = block.timestamp;
        uint256 nextPaymentDue = startTime + _duration;

        subscriptions[msg.sender].push(Subscription({
            serviceName: _serviceName,
            startTime: startTime,
            duration: _duration,
            nextPaymentDue: nextPaymentDue,
            active: true
        }));

        emit Subscribed(msg.sender, _serviceName, startTime, _duration, nextPaymentDue);
    }

    /**
     * @notice Cancel an active subscription.
     * @param _serviceName The name of the service to cancel.
     */
    function cancelSubscription(string memory _serviceName) public {
        Subscription[] storage subs = subscriptions[msg.sender];
        bool found = false;

        for (uint256 i = 0; i < subs.length; i++) {
            // Compare strings using their keccak256 hashes.
            if (keccak256(bytes(subs[i].serviceName)) == keccak256(bytes(_serviceName)) && subs[i].active) {
                subs[i].active = false;
                emit SubscriptionCancelled(msg.sender, _serviceName, block.timestamp);
                found = true;
                break;
            }
        }
        require(found, "Active subscription not found.");
    }

    /**
     * @notice Log a payment for an active subscription.
     * This function simulates a payment by advancing the next payment due time.
     * In a future upgrade, this can handle actual wallet-based payments.
     * @param _serviceName The name of the service for which payment is made.
     */
    function logPayment(string memory _serviceName) public payable {
        Subscription[] storage subs = subscriptions[msg.sender];
        bool found = false;

        for (uint256 i = 0; i < subs.length; i++) {
            if (keccak256(bytes(subs[i].serviceName)) == keccak256(bytes(_serviceName)) && subs[i].active) {
                // Advance the next payment due by the subscription duration.
                subs[i].nextPaymentDue += subs[i].duration;
                emit PaymentLogged(msg.sender, _serviceName, block.timestamp);
                found = true;
                break;
            }
        }
        require(found, "Active subscription not found.");
    }

    /**
     * @notice Retrieve all subscriptions of the caller.
     * @return An array of Subscription structs.
     */
    function getMySubscriptions() public view returns (Subscription[] memory) {
        return subscriptions[msg.sender];
    }
}

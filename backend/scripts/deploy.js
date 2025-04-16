// scripts/deploy.js
async function main() {
    // Retrieve the deployer's account details using ethers.js.
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Display the deployer's account balance.
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());
  
    // Get the contract factory for SubscriptionManager.
    const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
  
    // Deploy the contract.
    const subscriptionManager = await SubscriptionManager.deploy();
  
    // In ethers v6, use waitForDeployment() to wait until the contract is deployed.
    await subscriptionManager.waitForDeployment();
  
    // Log the deployed contract address.
    console.log("SubscriptionManager deployed to:", subscriptionManager.target);
  }
  
  // Execute the main function and handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error deploying contract:", error);
      process.exit(1);
    });
  
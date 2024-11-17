const { task } = require("hardhat/config")
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

task("deploy-fundme").setAction(async (taskArgs, hre) => {
  const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log('deploying')
    const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();
    console.log('contract has been deployed successfully,contract address is ' + fundMe.target);
    

    if(hre.network.config.chainId == 11155111 && ETHERSCAN_API_KEY) {
        console.log('Waiting for 5 confirmations');
        await fundMe.deploymentTransaction().wait(5);
        await hre.run("verify:verify", {
            address: fundMe.target,
            constructorArguments: [
                10,
            ],
        });
    } else {
        console.log("verification skipped...");
    }
})

module.exports = {}
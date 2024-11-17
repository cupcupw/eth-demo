const { ethers } = require("hardhat");
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

async function main() {
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

    //task
    const [firstAccount, secondAccount] = await ethers.getSigners();
    const fundTx = await founMe.fund({value: ethers.parseEther("0.1")});
    await fundTx.wait();

    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContract}`)

    const fundTxWithSecondAccount = await founMe.connect(secondAccount).fund({value: ethers.parseEther("0.1")});
    await fundTxWithSecondAccount.wait();

    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)

    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
    console.log(`Balance of first account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)

}
main().catch((err) => {
    console.log('err =>' , err );
    process.exit(0);
})
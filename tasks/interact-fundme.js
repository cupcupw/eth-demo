const { task } = require("hardhat/config")

task("interact-fundme")
.addParam("addr", "fundme contract address")
.setAction(async (taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)

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
})

module.exports = {}
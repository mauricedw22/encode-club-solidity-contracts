const DeFi = artifacts.require("DeFi");
const DAIMock = artifacts.require("DAIMock"); 

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

const COINBASE = "0x503828976D22510aad0201ac7EC88293211D23Da"


contract("DeFi", accounts => {
let owner;
const INITIAL_AMOUNT = 9999;
    before(async function () {
        accounts = await web3.eth.getAccounts();
        owner = accounts[0];
        console.log("owner account is " , owner);
        
        // set up   DAI_TokenContract here from the DAI address   
        let DAI_TokenContract= await DAIMock.at(DAIAddress)
       // test that we have the correct contract
        const symbol = await DAI_TokenContract.symbol();
        console.log(symbol);
        // now transfer some DAI from the COINBASE account to the owner account
        const ownerBalance = await DAI_TokenContract.balanceOf.call(owner,{from:owner});
        await DAI_TokenContract.transfer(COINBASE, ownerBalance, { from: owner});
        await DAI_TokenContract.transfer(owner, 1000, { from: COINBASE});
    });


    it("should check transfer succeeded", async () => {
    // write test to show transfer succeeded    
    let DAI_TokenContract= await DAIMock.at(DAIAddress)
    const ownerBalance = await DAI_TokenContract.balanceOf.call(owner,{from:owner});
    console.log(ownerBalance);
    assert.equal(ownerBalance.toNumber(), 1000);

    });

 
});
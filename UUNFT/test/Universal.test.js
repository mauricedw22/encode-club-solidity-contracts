const assert = require("assert");
const UUNFT = artifacts.require("UUNFT");

contract("UniversaUpgradableNFT",accounts => {
    let instance, address;
    beforeEach(async() => {
        instance = await UUNFT.deployed();
        address = await web3.eth.getAccounts();
        
    })
    it("Should create a token",async () => {
        await instance.CreateToken(1);
        const hasId = await instance.tokens(1);
        assert(hasId.id,1)
    });
    it("Should update a token",async() => {
       
        const r = await instance.tokens(1)
        await instance.upgradeToken(1,{value: 1});
        const s = await instance.tokens(1);
        assert.strictEqual(r.tokenLevel.toNumber(),s.tokenLevel.toNumber()-1)
    })
    it("Shouldn't allow to mutate the token without sending at least 20% of contract balance as a payment", async() => {
        try {
            await instance.mutateToken(1,0);
            assert.fail();
        }catch {
            assert.ok(true);
        }
       
    });
    it("Can mutate token",async() => {
        await instance.mutateToken(1,0,{value: 2});
        const d = await instance.tokens(1);
        assert.notStrictEqual(d.tokenType.toNumber(),1);
    });
    it("It should allow to mutate a token if there is one with the designated token type",async() => {
        try {
            await instance.CreateToken(1);
            await instance.mutateToken(2,0,{value: 3});
            assert.fail();
        } catch (error) {
            assert.ok(true);
        }
    })
    
})
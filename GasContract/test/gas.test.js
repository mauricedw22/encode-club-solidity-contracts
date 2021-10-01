const truffleAssert = require('truffle-assertions');
const GasContract = artifacts.require("GasContract");
contract("Gas", accounts => {
 
    it("should check for admin", async () => {
    const instance = await GasContract.deployed();
    let adminFlag;
   for (ii = 0; ii< 5; ii++){ 
       adminFlag = await instance.checkForAdmin.call(accounts[ii]);
       assert.equal(
           adminFlag,
       true,
           "Incorrect admin");    
       }
     });

     it("should check for false admin", async () => {
        const instance = await GasContract.deployed();
        let adminFlag;
           adminFlag = await instance.checkForAdmin.call(accounts[8]);
           assert.equal(
               adminFlag,
           false,
               "Incorrect admin");    

         });
    
    it("should say hello", async () => {
        const instance = await GasContract.deployed();
        const welcome = await instance.welcome.call();
        assert.equal(
            welcome,
           "hello !",
            "Incorrect Welcome message",
            );            
        });

    it("should mint tokens", async () => {
        const instance = await GasContract.deployed();
        const totalSupply = await instance.totalSupply.call();
        assert.equal(
            totalSupply.toNumber(),
           10000,
            "Minting Failed",
            );            
        });

     it("should update total supply", async () => {
            const instance = await GasContract.deployed();
            const initialSupply = await instance.totalSupply.call();
            const tx = await instance.updateTotalSupply({from : accounts[0]});
            const finalSupply = await instance.totalSupply.call();
            assert.equal(finalSupply.toNumber(), initialSupply.toNumber() + 1000,
                "Update supply failed",
                );            
            });
    
        
    it("should send a basic payment", async () => {
            const instance = await GasContract.deployed();
            const tx = await instance.transfer(accounts[1],100, {from : accounts[0]});   
            const payments  = await instance.getPayments(accounts[0]);  
            const lastPayment = payments.length -1;  
            assert.equal(payments[lastPayment].paymentType,1);
            assert.equal(payments[lastPayment].recipient,accounts[1]);
            assert.equal(payments[lastPayment].recipientName,'');
            assert.equal(payments[lastPayment].amount,100);
       });  

       it("should send emit an event", async () => {
        const instance = await GasContract.deployed();
        const tx = await instance.transfer(accounts[1],100, {from : accounts[0]});   
        // truffleAssert.eventEmitted(result, 'TestEvent', { param1: 10, param2: 20 });
        await truffleAssert.eventEmitted(tx, 'Transfer');
  
    });  

       it("updates a payment", async () => {
        const instance = await GasContract.deployed();
        const tx1 = await instance.transfer(accounts[1],100, "account 1", {from : accounts[0]}); 
        const tx2 = await instance.transfer(accounts[2],13, "account 2", {from : accounts[1]});   
        let payments  = await instance.getPayments(accounts[1]); 
        const lastPayment = payments.length -1;
//        console.log("lastPayment is " + lastPayment)
        assert.equal(payments[lastPayment].paymentType,1);
        assert.equal(payments[lastPayment].recipient,accounts[2]);
        assert.equal(payments[lastPayment].recipientName,"account 2");
        assert.equal(payments[lastPayment].amount,13);
        const paymentID = payments[lastPayment].paymentID;

       // now update the payment
       const tx3 = await  instance.updatePayment(accounts[1], paymentID, 19, {from : accounts[0]});  
       payments  = await instance.getPayments(accounts[1]); 
       assert.equal(payments[lastPayment].paymentType,1);
       assert.equal(payments[lastPayment].recipient,accounts[2]);
       assert.equal(payments[lastPayment].recipientName,"account 2");
       assert.equal(payments[lastPayment].amount,19);
       await truffleAssert.eventEmitted(tx3, 'PaymentUpdated');

  });   

  it("Fails to transfer  - name too long", async () => {
    const instance = await GasContract.deployed();
   await truffleAssert.fails(instance.transfer(accounts[1],100, "1234567890123", {from : accounts[0]}) , truffleAssert.ErrorType.REVERT);  


});  
       it("Fails to update payment - non admin", async () => {
         const instance = await GasContract.deployed();
        await truffleAssert.fails(instance.updatePayment(accounts[1], 1, 13, {from : accounts[8]}),truffleAssert.ErrorType.REVERT);  

   });   

       it("GAS TEST -> => ***", async () => {
        const instance = await GasContract.deployed();
        const initialSupply = await instance.totalSupply.call();
        const tx = await instance.updateTotalSupply({from : accounts[0]});
        const finalSupply = await instance.totalSupply.call();
        assert.equal(finalSupply.toNumber(), initialSupply.toNumber() + 1000,"Update supply failed");  

        const welcome = await instance.welcome.call();
        assert.equal(welcome,"hello !","Incorrect Welcome message");  

        let adminFlag = await instance.checkForAdmin.call(accounts[8]);
        assert.equal(adminFlag,false,"Incorrect admin");    
        
        const tx1 = await instance.transfer(accounts[1],100, "account 1", {from : accounts[0]}); 
        const tx2 = await instance.transfer(accounts[2],1,"account 2", {from : accounts[1]});   
        const tx3 = await instance.transfer(accounts[2],2,"account 2", {from : accounts[1]});   
        const tx4 = await instance.transfer(accounts[2],3,"account 2", {from : accounts[1]});   

        let payments  = await instance.getPayments(accounts[1]); 
        const lastPayment = payments.length -1;
        assert.equal(payments[lastPayment].paymentType,1);
        assert.equal(payments[lastPayment].recipient,accounts[2]);
        assert.equal(payments[lastPayment].recipientName,"account 2");
        assert.equal(payments[lastPayment].amount,3);
        const paymentID = payments[lastPayment].paymentID;


       const tx5= await  instance.updatePayment(accounts[1], paymentID, 14, {from : accounts[0]});  
       payments  = await instance.getPayments(accounts[1]); 
       assert.equal(payments[lastPayment].paymentType,1);
       assert.equal(payments[lastPayment].recipient,accounts[2]);
       assert.equal(payments[lastPayment].recipientName,"account 2");
       assert.equal(payments[lastPayment].amount,14);


   });   

});
var HelloWorld = artifacts.require("HelloWorld");

contract('HelloWorld', async (accounts) => {

    it("addElement", async () => {

       let instance = await HelloWorld.deployed();
       
       let expectedId = 0;
       let expectedOwner = accounts[0];
       let expectedName = 'hello world';
       
       let tx = await instance.addElement(expectedName, {from: expectedOwner});
       assert.equal(tx.logs[0].event, 'ElementCreated');
       assert.equal(tx.logs[0].args.id, expectedId);
       assert.equal(tx.logs[0].args.owner, expectedOwner);
       assert.equal(tx.logs[0].args.name, expectedName);
       
       let result = await instance.myArray.call(expectedId);
       assert.equal(result[0], expectedId);
       assert.equal(result[1], expectedOwner);
       assert.equal(result[2], expectedName);

       let ownerId1 = await instance.ownerToElementId(expectedOwner);
       assert.equal(ownerId1, expectedId);

       let ownerId2 = await instance.getOwnerToElementId.call(expectedOwner);
       assert.equal(ownerId2, expectedId);

       try {
           await instance.addElement('throw owner exists', {from: expectedOwner})
           assert.fail('Expected throw owner exists');
       } catch (error) {
           assert.equal(error.message, 'VM Exception while processing transaction: revert');
       }
    });

    it("payment", async () => {

        let instance = await HelloWorld.deployed();

        let price = 10;
        let senderAddress = accounts[1];
        let receiverAddress = accounts[2];

        let senderInitalBalance = web3.fromWei(web3.eth.getBalance(senderAddress));
        let receiverInitalBalance = web3.fromWei(web3.eth.getBalance(receiverAddress));

        await instance.payment(receiverAddress, 
            { value: web3.toWei(price, "ether"), gasPrice: 0, from: senderAddress });

        let senderEndingBalance = web3.fromWei(web3.eth.getBalance(senderAddress));
        assert.equal(senderInitalBalance.minus(price).toNumber(), senderEndingBalance.toNumber());
        
        let receiverEndingBalance = web3.fromWei(web3.eth.getBalance(receiverAddress));
        assert.equal(receiverInitalBalance.add(price).toNumber(), receiverEndingBalance.toNumber());
    });
});
var Organisations = artifacts.require("Organisations");

contract('Organisations - Administrators', async (accounts) => {

    var organisation1 =  {
        id: 1,
        ownerAddress: accounts[0],
        name: 'Organisation 1',
        isActive: true
    }
    var administrator1 = {
        id: 1,
        organisationId: 1,
        administratorAddress: accounts[1],
        isActive: true
    }
    var administrator2 = {
        id: 2,
        organisationId: 1,
        administratorAddress: accounts[2],
        isActive: true
    }

    it("init", async () => {

        let instance = await Organisations.deployed();
        await instance.createOrganisation(organisation1.name, organisation1.isActive, {from: organisation1.ownerAddress});
    });

    it("createAdministrator 1", async () => {

        let instance = await Organisations.deployed();

        let lengthBefore = await instance.getAdministratorsLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createAdministrator(administrator1.organisationId, administrator1.administratorAddress, administrator1.isActive, 
            {from: organisation1.ownerAddress});
        
        let lengthAfter = await instance.getAdministratorsLength();
        assert.equal(2, lengthAfter);

        assert.equal("AdministratorCreated", tx.logs[0].event);
        assert.equal(administrator1.id, tx.logs[0].args.administratorId);
        assert.equal(administrator1.organisationId, tx.logs[0].args.organisationId);
        assert.equal(administrator1.administratorAddress, tx.logs[0].args.administratorAddress);
        assert.equal(administrator1.isActive, tx.logs[0].args.isActive);

        let administrator = await instance.administrators.call(administrator1.id);
        assert.equal(administrator1.id, administrator[0]);
        assert.equal(administrator1.organisationId, administrator[1]);
        assert.equal(administrator1.administratorAddress, administrator[2]);
        assert.equal(administrator1.isActive, administrator[3]);

        let administratorId = await instance.administratorToAdministratorId.call(administrator1.administratorAddress);
        assert.equal(administrator1.id, administratorId);

    });

    it("createAdministrator 1 - throw administrator exists", async () => {

        let instance = await Organisations.deployed();

        try {
            await instance.createAdministrator(administrator1.organisationId, administrator1.administratorAddress, administrator1.isActive, 
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw administrator exists');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createAdministrator 2", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});

        let lengthBefore = await instance.getAdministratorsLength();
        assert.equal(2, lengthBefore);

        let tx = await instance.createAdministrator(administrator2.organisationId, administrator2.administratorAddress, administrator2.isActive,
            {from: organisation1.ownerAddress});
        
        let lengthAfter = await instance.getAdministratorsLength();
        assert.equal(3, lengthAfter);

        assert.equal("AdministratorCreated", tx.logs[0].event);
        assert.equal(administrator2.id, tx.logs[0].args.administratorId);
        assert.equal(administrator2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(administrator2.administratorAddress, tx.logs[0].args.administratorAddress);
        assert.equal(administrator2.isActive, tx.logs[0].args.isActive);

        let administrator = await instance.administrators.call(administrator2.id);
        assert.equal(administrator2.id, administrator[0]);
        assert.equal(administrator2.organisationId, administrator[1]);
        assert.equal(administrator2.administratorAddress, administrator[2]);
        assert.equal(administrator2.isActive, administrator[3]);

        let administratorId = await instance.administratorToAdministratorId.call(administrator2.administratorAddress);
        assert.equal(administrator2.id, administratorId);
    });

    it("createAdministrator 2 - throw sender is not owner", async () => {

        let instance = await Organisations.deployed();

        try {
            await instance.createAdministrator(administrator2.organisationId, administrator2.administratorAddress, administrator2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw sender is not owner');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createAdministrator 2 - throw organisation is not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createAdministrator(administrator2.organisationId, administrator2.administratorAddress, administrator2.isActive,
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw organisation is not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});
    });

    it("updateAdministrator 2", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});

        let lengthBefore = await instance.getAdministratorsLength();
        assert.equal(3, lengthBefore);

        let tx = await instance.updateAdministrator(administrator2.id, !administrator2.isActive,
            {from: organisation1.ownerAddress});
        
        let lengthAfter = await instance.getAdministratorsLength();
        assert.equal(3, lengthAfter);

        assert.equal("AdministratorUpdated", tx.logs[0].event);
        assert.equal(administrator2.id, tx.logs[0].args.administratorId);
        assert.equal(administrator2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(administrator2.administratorAddress, tx.logs[0].args.administratorAddress);
        assert.equal(!administrator2.isActive, tx.logs[0].args.isActive);

        let administrator = await instance.administrators.call(administrator2.id);
        assert.equal(administrator2.id, administrator[0]);
        assert.equal(administrator2.organisationId, administrator[1]);
        assert.equal(administrator2.administratorAddress, administrator[2]);
        assert.equal(!administrator2.isActive, administrator[3]);

        let administratorId = await instance.administratorToAdministratorId.call(administrator2.administratorAddress);
        assert.equal(administrator2.id, administratorId);
    });

    it("updateAdministrator 2 - throw sender is not owner", async () => {

        let instance = await Organisations.deployed();

        try {
            await instance.updateAdministrator(administrator2.id, !administrator2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw sender is not owner');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateAdministrator 2 - throw organisation is not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.updateAdministrator(administrator2.id, !administrator2.isActive,
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw organisation is not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});
    });

});
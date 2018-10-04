var Organisations = artifacts.require("Organisations");

contract('Organisations - Organisations', async (accounts) => {

    it("createOrganisation 1", async () => {

        var instance = await Organisations.deployed();

        let expectedLength = 1;
        let expectedEvent = "OrganisationCreated";
        let expectedId = 1;
        let expectedOwner = accounts[0];
        let expectedName = 'Organisation 1';
        let expectedIsActive = true;
        
        let organisationsLengthBefore = await instance.getOrganisationsLength();
        assert.equal(expectedLength, organisationsLengthBefore);

        let tx = await instance.createOrganisation(expectedName, expectedIsActive, {from: expectedOwner});
        
        let organisationsLengthAfter = await instance.getOrganisationsLength();
        assert.equal(expectedLength+1, organisationsLengthAfter);

        assert.equal(expectedEvent, tx.logs[0].event);
        assert.equal(expectedId, tx.logs[0].args.organisationId);
        assert.equal(expectedOwner, tx.logs[0].args.owner);
        assert.equal(expectedName, tx.logs[0].args.name);
        assert.equal(expectedIsActive, tx.logs[0].args.isActive);
        
        let organisation = await instance.organisations.call(expectedId);
        assert.equal(expectedId, organisation[0]);
        assert.equal(expectedOwner, organisation[1]);
        assert.equal(expectedName, organisation[2]);
        assert.equal(expectedIsActive, organisation[3]);

        let organisationId = await instance.ownerToOrganizationId.call(expectedOwner);
        assert.equal(expectedId, organisationId);
    });


    it("createOrganisation 1 - throw owner exists", async () => {

        var instance = await Organisations.deployed();

        let expectedOwner = accounts[0];
        let expectedName = 'Organisation 1';
        let expectedIsActive = true;
        
        try {
            await instance.createOrganisation(expectedName, expectedIsActive, {from: expectedOwner});
            assert.fail('Expected throw owner exists');
        } catch (error) {
            assert.equal('VM Exception while processing transaction: revert', error.message);
        }
    });

    it("createOrganisation 2", async () => {

        var instance = await Organisations.deployed();

        let expectedLength = 2;
        let expectedEvent = "OrganisationCreated";
        let expectedId = 2;
        let expectedOwner = accounts[1];
        let expectedName = 'Organisation 2';
        let expectedIsActive = true;
                
        let organisationsLengthBefore = await instance.getOrganisationsLength();
        assert.equal(expectedLength, organisationsLengthBefore);

        let tx = await instance.createOrganisation(expectedName, expectedIsActive, {from: expectedOwner});
        
        let organisationsLengthAfter = await instance.getOrganisationsLength();
        assert.equal(expectedLength+1, organisationsLengthAfter);

        assert.equal(expectedEvent, tx.logs[0].event);
        assert.equal(expectedId, tx.logs[0].args.organisationId);
        assert.equal(expectedOwner, tx.logs[0].args.owner);
        assert.equal(expectedName, tx.logs[0].args.name);
        assert.equal(expectedIsActive, tx.logs[0].args.isActive);
        
        let organisation = await instance.organisations.call(expectedId);
        assert.equal(expectedId, organisation[0]);
        assert.equal(expectedOwner, organisation[1]);
        assert.equal(expectedName, organisation[2]);
        assert.equal(expectedIsActive, organisation[3]);

        let organisationId = await instance.ownerToOrganizationId.call(expectedOwner);
        assert.equal(expectedId, organisationId);
    });

    it("createOrganisation 2 - throw owner exists", async () => {

        var instance = await Organisations.deployed();

        let expectedOwner = accounts[1];
        let expectedName = 'Organisation 1';
        let expectedIsActive = true;
        
        try {
            await instance.createOrganisation(expectedName, expectedIsActive, {from: expectedOwner});
            assert.fail('Expected throw owner exists');
        } catch (error) {
            assert.equal('VM Exception while processing transaction: revert', error.message);
        }
    });

    it("updateOrganisationOwner 1", async () => {

        var instance = await Organisations.deployed();

        let expectedLength = 3;
        let expectedEvent = "OrganisationOwnerUpdated";
        let expectedId = 1;
        let expectedOwner = accounts[0];
        let expectedNewOwner = accounts[2];
        let expectedName = 'Organisation 1';
        let expectedIsActive = true;
                        
        let organisationsLengthBefore = await instance.getOrganisationsLength();
        assert.equal(expectedLength, organisationsLengthBefore);

        let tx = await instance.updateOrganisationOwner(expectedId, expectedNewOwner, {from: expectedOwner});
        
        let organisationsLengthAfter = await instance.getOrganisationsLength();
        assert.equal(expectedLength, organisationsLengthAfter);

        assert.equal(expectedEvent, tx.logs[0].event);
        assert.equal(expectedId, tx.logs[0].args.organisationId);
        assert.equal(expectedNewOwner, tx.logs[0].args.owner);
        assert.equal(expectedName, tx.logs[0].args.name);
        assert.equal(expectedIsActive, tx.logs[0].args.isActive);
        
        let organisation = await instance.organisations.call(expectedId);
        assert.equal(expectedId, organisation[0]);
        assert.equal(expectedNewOwner, organisation[1]);
        assert.equal(expectedName, organisation[2]);
        assert.equal(expectedIsActive, organisation[3]);

        let organisationId = await instance.ownerToOrganizationId.call(expectedNewOwner);
        assert.equal(expectedId, organisationId);
    });

    it("updateOrganisationOwner 1 - throw is not owner", async () => {

        var instance = await Organisations.deployed();

        let expectedId = 1;
        let expectedOwner = accounts[0];
        let expectedNewOwner = accounts[2];

        try {
            await instance.updateOrganisationOwner(expectedId, expectedNewOwner, {from: expectedOwner});
            assert.fail('Expected throw is not owner');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateOrganisationOwner 2 - throw owner exists", async () => {

        var instance = await Organisations.deployed();

        let expectedId = 2;
        let expectedOwner = accounts[1];
        let expectedNewOwner = accounts[2];

        try {
            await instance.updateOrganisationOwner(expectedId, expectedNewOwner, {from: expectedOwner});
            assert.fail('Expected throw owner exists');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateOrganisationState 2", async () => {

        var instance = await Organisations.deployed();

        let expectedLength = 3;
        let expectedEvent = "OrganisationStateUpdated";
        let expectedId = 2;
        let expectedOwner = accounts[1];
        let expectedName = 'Organisation 2';
        let expectedIsActive = false;
                        
        let organisationsLengthBefore = await instance.getOrganisationsLength();
        assert.equal(expectedLength, organisationsLengthBefore);

        let tx = await instance.updateOrganisationState(expectedId, expectedIsActive, {from: expectedOwner});
        
        let organisationsLengthAfter = await instance.getOrganisationsLength();
        assert.equal(expectedLength, organisationsLengthAfter);

        assert.equal(expectedEvent, tx.logs[0].event);
        assert.equal(expectedId, tx.logs[0].args.organisationId);
        assert.equal(expectedOwner, tx.logs[0].args.owner);
        assert.equal(expectedName, tx.logs[0].args.name);
        assert.equal(expectedIsActive, tx.logs[0].args.isActive);
        
        let organisation = await instance.organisations.call(expectedId);
        assert.equal(expectedId, organisation[0]);
        assert.equal(expectedOwner, organisation[1]);
        assert.equal(expectedName, organisation[2]);
        assert.equal(expectedIsActive, organisation[3]);

        let organisationId = await instance.ownerToOrganizationId.call(expectedOwner);
        assert.equal(expectedId, organisationId);
    });

    it("updateOrganisationState 2 - throw is not owner", async () => {

        var instance = await Organisations.deployed();

        let expectedId = 2;
        let expectedNewOwner = accounts[2];
        let expectedIsActive = false;

        try {
            await instance.updateOrganisationState(expectedId, expectedIsActive, {from: expectedNewOwner});
            assert.fail('Expected throw is not owner');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });
});
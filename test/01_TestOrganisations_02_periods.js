var Organisations = artifacts.require("Organisations");

contract('Organisations - Periods', async (accounts) => {

    var organisation1 = {
        id: 1,
        ownerAddress: accounts[0],
        name: 'Organisation 1',
        isActive: true
    }
    var organisation2 = {
        id: 2,
        ownerAddress: accounts[1],
        name: 'Organisation 2',
        isActive: true
    }
    var administrator1 = {
        id: 1,
        organisationId: 1,
        administratorAddress: accounts[2],
        isActive: true
    }
    var administrator2 = {
        id: 2,
        organisationId: 2,
        administratorAddress: accounts[3],
        isActive: true
    }
    var period1 = {
        id: 1,
        organisationId: 1,
        name: 'Period 1',
        isActive: true
    }
    var period2 = {
        id: 2,
        organisationId: 2,
        name: 'Period 2',
        isActive: true
    }

    it("init", async () => {

        let instance = await Organisations.deployed();

        //console.log(organisation1.name + ", " + organisation1.isActive + ", " + organisation1.ownerAddress);
        await instance.createOrganisation(organisation1.name, organisation1.isActive, { from: organisation1.ownerAddress });
        //console.log(organisation2.name + ", " + organisation2.isActive + ", " + organisation2.ownerAddress);
        await instance.createOrganisation(organisation2.name, organisation2.isActive, { from: organisation2.ownerAddress });
        //console.log(administrator1.organisationId + ", " + administrator1.administratorAddress + ", " + administrator1.isActive + ", " + organisation1.ownerAddress);
        await instance.createAdministrator(administrator1.organisationId, administrator1.administratorAddress, administrator1.isActive, { from: organisation1.ownerAddress });
        //console.log(administrator2.organisationId + ", " + administrator2.administratorAddress + ", " + administrator2.isActive + ", " + organisation2.ownerAddress);
        await instance.createAdministrator(administrator2.organisationId, administrator2.administratorAddress, administrator2.isActive, { from: organisation2.ownerAddress });
    });

    it("createPeriod 1", async () => {

        let instance = await Organisations.deployed();

        let lengthBefore = await instance.getPeriodsLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createPeriod(period1.organisationId, period1.name, period1.isActive,
            {from: administrator1.administratorAddress});
        
        let lengthAfter = await instance.getPeriodsLength();
        assert.equal(2, lengthAfter);

        assert.equal("PeriodCreated", tx.logs[0].event);
        assert.equal(period1.id, tx.logs[0].args.periodId);
        assert.equal(period1.organisationId, tx.logs[0].args.organisationId);
        assert.equal(period1.name, tx.logs[0].args.name);
        assert.equal(period1.isActive, tx.logs[0].args.isActive);

        let period = await instance.periods.call(period1.id);
        assert.equal(period1.id, period[0]);
        assert.equal(period1.organisationId, period[1]);
        assert.equal(period1.name, period[2]);
        assert.equal(period1.isActive, period[3]);
    });

    it("createPeriod 1 - throw not administrator", async () => {

        let instance = await Organisations.deployed();

        try {
            await instance.createPeriod(period1.organisationId, period1.name, period1.isActive,
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createPeriod 1 - throw administrator not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateAdministrator(administrator1.id, !administrator1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createPeriod(period1.organisationId, period1.name, period1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator1.id, administrator1.isActive, {from: organisation1.ownerAddress});
    });

    it("createPeriod 1 - throw organisation not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createPeriod(period1.organisationId, period1.name, period1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});
    });

    it("createPeriod 2", async () => {

        let instance = await Organisations.deployed();

        let lengthBefore = await instance.getPeriodsLength();
        assert.equal(2, lengthBefore);

        let tx = await instance.createPeriod(period2.organisationId, period2.name, period2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getPeriodsLength();
        assert.equal(3, lengthAfter);

        assert.equal("PeriodCreated", tx.logs[0].event);
        assert.equal(period2.id, tx.logs[0].args.periodId);
        assert.equal(period2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(period2.name, tx.logs[0].args.name);
        assert.equal(period2.isActive, tx.logs[0].args.isActive);

        let period = await instance.periods.call(period2.id);
        assert.equal(period2.id, period[0]);
        assert.equal(period2.organisationId, period[1]);
        assert.equal(period2.name, period[2]);
        assert.equal(period2.isActive, period[3]);
    });

    it("createPeriod 2 - throw not administrator", async () => {

        let instance = await Organisations.deployed();

        try {
            await instance.createPeriod(period2.organisationId, period2.name, period2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createPeriod 2 - throw administrator not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createPeriod(period2.organisationId, period2.name, period2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("createPeriod 2 - throw organisation not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createPeriod(period2.organisationId, period2.name, period2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });

    it("updatePeriod 2", async () => {

        let instance = await Organisations.deployed();

        let lengthBefore = await instance.getPeriodsLength();
        assert.equal(3, lengthBefore);

        let tx = await instance.updatePeriod(period2.id, !period2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getPeriodsLength();
        assert.equal(3, lengthAfter);

        assert.equal("PeriodUpdated", tx.logs[0].event);
        assert.equal(period2.id, tx.logs[0].args.periodId);
        assert.equal(period2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(period2.name, tx.logs[0].args.name);
        assert.equal(!period2.isActive, tx.logs[0].args.isActive);

        let period = await instance.periods.call(period2.id);
        assert.equal(period2.id, period[0]);
        assert.equal(period2.organisationId, period[1]);
        assert.equal(period2.name, period[2]);
        assert.equal(!period2.isActive, period[3]);
    });

    it("updatePeriod 2 - throw not administrator", async () => {

        let instance = await Organisations.deployed();

        try {
            await instance.updatePeriod(period2.id, !period2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updatePeriod 2 - throw administrator not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updatePeriod(period2.id, !period2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("updatePeriod 2 - throw organisation not active", async () => {

        let instance = await Organisations.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updatePeriod(period2.id, !period2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });
});
var AcademicRecords = artifacts.require("AcademicRecords");

contract('AcademicRecords - Subjects', async (accounts) => {

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
    var subject1 = {
        id: 1,
        periodId: 1,
        name: 'Subject 1',
        price: web3.toWei(10, "ether"),
        isActive: true
    }
    var subject2 = {
        id: 2,
        periodId: 2,
        name: 'Subject 2',
        price: web3.toWei(11, "ether"),
        isActive: true
    }

    it("init", async () => {

        let instance = await AcademicRecords.deployed();

        //console.log(organisation1.name + ", " + organisation1.isActive + ", " + organisation1.ownerAddress);
        await instance.createOrganisation(organisation1.name, organisation1.isActive, { from: organisation1.ownerAddress });
        //console.log(organisation2.name + ", " + organisation2.isActive + ", " + organisation2.ownerAddress);
        await instance.createOrganisation(organisation2.name, organisation2.isActive, { from: organisation2.ownerAddress });
        //console.log(administrator1.organisationId + ", " + administrator1.administratorAddress + ", " + administrator1.isActive + ", " + organisation1.ownerAddress);
        await instance.createAdministrator(administrator1.organisationId, administrator1.administratorAddress, administrator1.isActive, { from: organisation1.ownerAddress });
        //console.log(administrator2.organisationId + ", " + administrator2.administratorAddress + ", " + administrator2.isActive + ", " + organisation2.ownerAddress);
        await instance.createAdministrator(administrator2.organisationId, administrator2.administratorAddress, administrator2.isActive, { from: organisation2.ownerAddress });
        //console.log(period1.organisationId + ", " + period1.name + ", " + period1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createPeriod(period1.organisationId, period1.name, period1.isActive, { from: administrator1.administratorAddress });
        //console.log(period2.organisationId + ", " + period2.name + ", " + period2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createPeriod(period2.organisationId, period2.name, period2.isActive, { from: administrator2.administratorAddress });
    });

    it("createSubject 0", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getSubjectsLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive,
            {from: administrator1.administratorAddress});

        let lengthAfter = await instance.getSubjectsLength();
        assert.equal(2, lengthAfter);

        assert.equal("SubjectCreated", tx.logs[0].event);
        assert.equal(subject1.id, tx.logs[0].args.subjectId);
        assert.equal(subject1.periodId, tx.logs[0].args.periodId);
        assert.equal(subject1.name, tx.logs[0].args.name);
        assert.equal(subject1.price, tx.logs[0].args.price);
        assert.equal(subject1.isActive, tx.logs[0].args.isActive);

        let subject = await instance.subjects.call(subject1.id);
        assert.equal(subject1.id, subject[0]);
        assert.equal(subject1.periodId, subject[1]);
        assert.equal(subject1.name, subject[2]);
        assert.equal(subject1.price, subject[3]);
        assert.equal(subject1.isActive, subject[4]);
    });

    it("createSubject 0 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive,
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createSubject 0 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator1.id, !administrator1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive, 
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator1.id, administrator1.isActive, {from: organisation1.ownerAddress});
    });

    it("createSubject 0 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});
    });

    it("createSubject 0 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period1.id, !period1.isActive, {from: administrator1.administratorAddress});

        try {
            await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw period not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period1.id, period1.isActive, {from: administrator1.administratorAddress});
    });

    it("createSubject 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getSubjectsLength();
        assert.equal(2, lengthBefore);

        let tx = await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getSubjectsLength();
        assert.equal(3, lengthAfter);

        assert.equal("SubjectCreated", tx.logs[0].event);
        assert.equal(subject2.id, tx.logs[0].args.subjectId);
        assert.equal(subject2.periodId, tx.logs[0].args.periodId);
        assert.equal(subject2.name, tx.logs[0].args.name);
        assert.equal(subject2.price, tx.logs[0].args.price);
        assert.equal(subject2.isActive, tx.logs[0].args.isActive);

        let subject = await instance.subjects.call(subject2.id);
        assert.equal(subject2.id, subject[0]);
        assert.equal(subject2.periodId, subject[1]);
        assert.equal(subject2.name, subject[2]);
        assert.equal(subject2.price, subject[3]);
        assert.equal(subject2.isActive, subject[4]);
    });

    it("createSubject 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createSubject 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("createSubject 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });

    it("createSubject 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, {from: administrator2.administratorAddress});

        try {
            await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw period not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, period2.isActive, {from: administrator2.administratorAddress});
    });
    
    it("updateSubject 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getSubjectsLength();
        assert.equal(3, lengthBefore);

        let tx = await instance.updateSubject(subject2.id, !subject2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getSubjectsLength();
        assert.equal(3, lengthAfter);

        assert.equal("SubjectUpdated", tx.logs[0].event);
        assert.equal(subject2.id, tx.logs[0].args.subjectId);
        assert.equal(subject2.periodId, tx.logs[0].args.periodId);
        assert.equal(subject2.name, tx.logs[0].args.name);
        assert.equal(subject2.price, tx.logs[0].args.price);
        assert.equal(!subject2.isActive, tx.logs[0].args.isActive);

        let subject = await instance.subjects.call(subject2.id);
        assert.equal(subject2.id, subject[0]);
        assert.equal(subject2.periodId, subject[1]);
        assert.equal(subject2.name, subject[2]);
        assert.equal(subject2.price, subject[3]);
        assert.equal(!subject2.isActive, subject[4]);
    });

    it("updateSubject 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.updateSubject(subject2.id, !subject2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateSubject 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updateSubject(subject2.id, !subject2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("updateSubject 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updateSubject(subject2.id, !subject2.isActive, 
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });

    it("updateSubject 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, {from: administrator2.administratorAddress});

        try {
            await instance.updateSubject(subject2.id, !subject2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw period not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, period2.isActive, {from: administrator2.administratorAddress});
    });
});
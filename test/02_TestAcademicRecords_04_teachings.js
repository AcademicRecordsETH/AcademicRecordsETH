var AcademicRecords = artifacts.require("AcademicRecords");

async function printOrganisation(instance, organisationId) {
    let organisation = await instance.organisations.call(organisationId);
    console.log('organisation.id', organisation[0]);
    console.log('organisation.owner', organisation[1]);
    console.log('organisation.name', organisation[2]);
    console.log('organisation.isActive', organisation[3]);
};

async function printAdministrator(instance, administratorId) {
    let administrator = await instance.administrators.call(administratorId);
    console.log('administrator.id', administrator[0]);
    console.log('administrator.organisationId', administrator[1]);
    console.log('administrator.administratorAddress', administrator[2]);
    console.log('administrator.isActive', administrator[3]);
};

async function printPeriod(instance, periodId) {
    let period = await instance.periods.call(periodId);
    console.log('period.id', period[0]);
    console.log('period.organisationId', period[1]);
    console.log('period.name', period[2]);
    console.log('period.isActive', period[3]);
};

async function printSubject(instance, subjectId) {
    let subject = await instance.subjects.call(subjectId);
    console.log('subject.id', subject[0]);
    console.log('subject.periodId', subject[1]);
    console.log('subject.name', subject[2]);
    console.log('subject.price', subject[3]);
    console.log('subject.isActive', subject[4]);
}

async function printProfessor(instance, professorId) {
    let professor = await instance.professors.call(professorId);
    console.log('professor.id', professor[0]);
    console.log('professor.organisationId', professor[1]);
    console.log('professor.professorAddress', professor[2]);
    console.log('professor.isActive', professor[3]);
}

contract('AcademicRecords - Teachings', async (accounts) => {

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
    var professor1 = {
        id: 1,
        organisationId: 1,
        professorAddress: accounts[4],
        isActive: true
    }
    var professor2 = {
        id: 2,
        organisationId: 2,
        professorAddress:  accounts[5],
        isActive: true
    }
    var teaching1 = {
        id: 1,
        subjectId: 1,
        professorId: 1,
        isActive: true
    }
    var teaching2 = {
        id: 2,
        subjectId: 2,
        professorId: 2,
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
        //console.log(subject1.periodId + ", " + subject1.name + ", " + subject1.price + ", " + subject1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive, { from: administrator1.administratorAddress });
        //console.log(subject2.periodId + ", " + subject2.name + ", " + subject2.price + ", " + subject2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive, { from: administrator2.administratorAddress });
        //console.log(professor1.organisationId + ", " + professor1.professorAddress + ", " + professor1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive, { from: administrator1.administratorAddress });
        //console.log(professor2.organisationId + ", " + professor2.professorAddress + ", " + professor2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive, { from: administrator2.administratorAddress });

    });

    it("createTeaching 0", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getTeachingsLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
            { from: administrator1.administratorAddress });

        let lengthAfter = await instance.getTeachingsLength();
        assert.equal(2, lengthAfter);

        assert.equal("TeachingCreated", tx.logs[0].event);
        assert.equal(teaching1.id, tx.logs[0].args.teachingId);
        assert.equal(teaching1.subjectId, tx.logs[0].args.subjectId);
        assert.equal(teaching1.professorId, tx.logs[0].args.professorId);
        assert.equal(teaching1.isActive, tx.logs[0].args.isActive);

        let teachingA = await instance.teachings.call(teaching1.id);
        assert.equal(teaching1.id, teachingA[0]);
        assert.equal(teaching1.subjectId, teachingA[1]);
        assert.equal(teaching1.professorId, teachingA[2]);
        assert.equal(teaching1.isActive, teachingA[3]);

        let teachingB = await instance.getTeachingIdByProfessorAddress(professor1.professorAddress, teaching1.subjectId);
        assert.equal(teaching1.id, teachingB[0]);
        assert.equal(teaching1.subjectId, teachingB[1]);
        assert.equal(teaching1.professorId, teachingB[2]);
        assert.equal(teaching1.isActive, teachingB[3]);
    });

    it("createTeaching 0 - throw not administrator", async () => {
        let instance = await AcademicRecords.deployed();

        try {
            await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
                { from: organisation1.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createTeaching 0 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator1.id, !administrator1.isActive, { from: organisation1.ownerAddress });

        try {

            await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator1.id, administrator1.isActive, { from: organisation1.ownerAddress });
    });

    it("createTeaching 0 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject1.id, !subject1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject1.id, subject1.isActive, { from: administrator1.administratorAddress });
    });

    it("createTeaching 0 - throw professor not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateProfessor(professor1.id, !professor1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateProfessor(professor1.id, professor1.isActive, { from: administrator1.administratorAddress });
    });

    it("createTeaching 0 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period1.id, !period1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period1.id, !period1.isActive, { from: administrator1.administratorAddress });
    });

    it("createTeaching 0 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, { from: organisation1.ownerAddress });

        try {
            await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, { from: organisation1.ownerAddress });
    });

    it("createTeaching 0 - throw organisation not equals", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createTeaching(teaching2.subjectId, teaching1.professorId, teaching1.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });


    it("createTeaching 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getTeachingsLength();
        assert.equal(2, lengthBefore);
        
        let tx = await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
            { gasPrice: 0, from: administrator2.administratorAddress });

        let lengthAfter = await instance.getTeachingsLength();
        assert.equal(3, lengthAfter);

        assert.equal("TeachingCreated", tx.logs[0].event);
        assert.equal(teaching2.id, tx.logs[0].args.teachingId);
        assert.equal(teaching2.subjectId, tx.logs[0].args.subjectId);
        assert.equal(teaching2.professorId, tx.logs[0].args.professorId);
        assert.equal(teaching2.isActive, tx.logs[0].args.isActive);

        let teachingA = await instance.teachings.call(teaching2.id);
        assert.equal(teaching2.id, teachingA[0]);
        assert.equal(teaching2.subjectId, teachingA[1]);
        assert.equal(teaching2.professorId, teachingA[2]);
        assert.equal(teaching2.isActive, teachingA[3]);

        let teachingB = await instance.getTeachingIdByProfessorAddress(professor2.professorAddress, teaching2.subjectId);
        assert.equal(teaching2.id, teachingB[0]);
        assert.equal(teaching2.subjectId, teachingB[1]);
        assert.equal(teaching2.professorId, teachingB[2]);
        assert.equal(teaching2.isActive, teachingB[3]);

    });

    it("createTeaching 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
                { from: organisation2.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createTeaching 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, { from: organisation2.ownerAddress });
    });

    it("createTeaching 1 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject2.id, !subject2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject2.id, subject2.isActive, { from: administrator2.administratorAddress });
    });

    it("createTeaching 1 - throw professor not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateProfessor(professor2.id, !professor2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateProfessor(professor2.id, professor2.isActive, { from: administrator2.administratorAddress });
    });

    it("createTeaching 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, period2.isActive, { from: administrator2.administratorAddress });
    });

    it("createTeaching 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, { from: organisation2.ownerAddress });
    });

    it("createTeaching 1 - throw organisation not equals", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createTeaching(teaching1.subjectId, teaching2.professorId, teaching2.isActive,
                { from: administrator1.administratorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateTeaching 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getTeachingsLength();
        assert.equal(3, lengthBefore);

        //printOrganisation(instance, organisation2.id);
        //printAdministrator(instance, administrator2.id);
        //printPeriod(instance, period2.id);
        //printSubject(instance, subject2.id);
        //printProfessor(instance, professor2.id);

        let tx = await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });

        let lengthAfter = await instance.getTeachingsLength();
        assert.equal(3, lengthAfter);

        assert.equal("TeachingUpdated", tx.logs[0].event);
        assert.equal(teaching2.id, tx.logs[0].args.teachingId);
        assert.equal(teaching2.subjectId, tx.logs[0].args.subjectId);
        assert.equal(teaching2.professorId, tx.logs[0].args.professorId);
        assert.equal(!teaching2.isActive, tx.logs[0].args.isActive);

        let teachingA = await instance.teachings.call(teaching2.id);
        assert.equal(teaching2.id, teachingA[0]);
        assert.equal(teaching2.subjectId, teachingA[1]);
        assert.equal(teaching2.professorId, teachingA[2]);
        assert.equal(!teaching2.isActive, teachingA[3]);

        let teachingB = await instance.getTeachingIdByProfessorAddress(professor2.professorAddress, teaching2.subjectId);
        assert.equal(teaching2.id, teachingB[0]);
        assert.equal(teaching2.subjectId, teachingB[1]);
        assert.equal(teaching2.professorId, teachingB[2]);
        assert.equal(teaching2.isActive, teachingB[3]);
    });

    it("updateTeaching 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.updateTeaching(teaching2.id, !teaching2.isActive,
                { from: organisation2.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateTeaching 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator1.isActive, { from: organisation2.ownerAddress });
    });

    it("updateTeaching 1 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject2.id, !subject2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject2.id, subject2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateTeaching 1 - throw professor not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateProfessor(professor2.id, !professor2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateProfessor(professor2.id, professor2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateTeaching 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateTeaching 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, { from: organisation2.ownerAddress });
    });

});
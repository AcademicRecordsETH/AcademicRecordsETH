var AcademicRecords = artifacts.require("AcademicRecords");

contract('AcademicRecords - Students', async (accounts) => {

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
        administratorAddress: accounts[3],
        isActive: true
    }
    var administrator2 = {
        id: 2,
        organisationId: 2,
        administratorAddress: accounts[4],
        isActive: true
    }
    var student1 = {
        id: 1,
        organisationId: 1,
        studentCode: 'Student 1',
        isActive: true
    }
    var student2 = {
        id: 2,
        organisationId: 2,
        studentCode: 'Student 2',
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
    });

    it("createStudent 0", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getStudentsLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createStudent(student1.organisationId, student1.studentCode, student1.isActive,
            {from: administrator1.administratorAddress});

        let lengthAfter = await instance.getStudentsLength();
        assert.equal(2, lengthAfter);

        assert.equal("StudentCreated", tx.logs[0].event);
        assert.equal(student1.id, tx.logs[0].args.studentId);
        assert.equal(student1.organisationId, tx.logs[0].args.organisationId);
        assert.equal(student1.studentCode, tx.logs[0].args.studentCode);
        assert.equal(student1.isActive, tx.logs[0].args.isActive);

        let student = await instance.students.call(student1.id);
        assert.equal(student1.id, student[0]);
        assert.equal(student1.organisationId, student[1]);
        assert.equal(student1.studentCode, student[2]);
        assert.equal(student1.isActive, student[3]);
    });

    it("createStudent 0 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createStudent(student1.organisationId, student1.studentCode, student1.isActive,
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createStudent 0 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator1.id, !administrator1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createStudent(student1.organisationId, student1.studentCode, student1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator1.id, administrator1.isActive, {from: organisation1.ownerAddress});
    });

    it("createStudent 0 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createStudent(student1.organisationId, student1.studentCode, student1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});
    });

    it("createStudent 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getStudentsLength();
        assert.equal(2, lengthBefore);

        let tx = await instance.createStudent(student2.organisationId, student2.studentCode, student2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getStudentsLength();
        assert.equal(3, lengthAfter);

        assert.equal("StudentCreated", tx.logs[0].event);
        assert.equal(student2.id, tx.logs[0].args.studentId);
        assert.equal(student2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(student2.studentCode, tx.logs[0].args.studentCode);
        assert.equal(student2.isActive, tx.logs[0].args.isActive);

        let student = await instance.students.call(student2.id);
        assert.equal(student2.id, student[0]);
        assert.equal(student2.organisationId, student[1]);
        assert.equal(student2.studentCode, student[2]);
        assert.equal(student2.isActive, student[3]);
    });

    it("createStudent 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createStudent(student2.organisationId, student2.studentCode, student2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createStudent 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createStudent(student2.organisationId, student2.studentCode, student2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("createStudent 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createStudent(student2.organisationId, student2.studentCode, student2.isActive, 
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });
    
    it("updateStudent 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getStudentsLength();
        assert.equal(3, lengthBefore);

        let tx = await instance.updateStudent(student2.id, !student2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getStudentsLength();
        assert.equal(3, lengthAfter);

        assert.equal("StudentUpdated", tx.logs[0].event);
        assert.equal(student2.id, tx.logs[0].args.studentId);
        assert.equal(student2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(student2.studentCode, tx.logs[0].args.studentCode);
        assert.equal(!student2.isActive, tx.logs[0].args.isActive);

        let student = await instance.students.call(student2.id);
        assert.equal(student2.id, student[0]);
        assert.equal(student2.organisationId, student[1]);
        assert.equal(student2.studentCode, student[2]);
        assert.equal(!student2.isActive, student[3]);
    });

    it("updateStudent 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.updateStudent(student2.id, !student2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateStudent 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updateStudent(student2.id, !student2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("updateStudent 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updateStudent(student2.id, !student2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });

});
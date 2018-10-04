var AcademicRecords = artifacts.require("AcademicRecords");

contract('AcademicRecords - Professors', async (accounts) => {

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

    it("createProfessor 0", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getProfessorsLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive,
            {from: administrator1.administratorAddress});

        let lengthAfter = await instance.getProfessorsLength();
        assert.equal(2, lengthAfter);

        assert.equal("ProfessorCreated", tx.logs[0].event);
        assert.equal(professor1.id, tx.logs[0].args.professorId);
        assert.equal(professor1.organisationId, tx.logs[0].args.organisationId);
        assert.equal(professor1.professorAddress, tx.logs[0].args.professorAddress);
        assert.equal(professor1.isActive, tx.logs[0].args.isActive);

        let professor = await instance.professors.call(professor1.id);
        assert.equal(professor1.id, professor[0]);
        assert.equal(professor1.organisationId, professor[1]);
        assert.equal(professor1.professorAddress, professor[2]);
        assert.equal(professor1.isActive, professor[3]);

        let professorId = await instance.professorToProfessorId.call(professor1.professorAddress);
        assert.equal(professor1.id, professorId);
    });

    it("createProfessor 0 - throw professor exits", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw professor exits');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createProfessor 0 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive,
                {from: organisation1.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createProfessor 0 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator1.id, !administrator1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator1.id, administrator1.isActive, {from: organisation1.ownerAddress});
    });

    it("createProfessor 0 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, {from: organisation1.ownerAddress});

        try {
            await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive,
                {from: administrator1.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, {from: organisation1.ownerAddress});
    });

    it("createProfessor 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getProfessorsLength();
        assert.equal(2, lengthBefore);

        let tx = await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getProfessorsLength();
        assert.equal(3, lengthAfter);

        assert.equal("ProfessorCreated", tx.logs[0].event);
        assert.equal(professor2.id, tx.logs[0].args.professorId);
        assert.equal(professor2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(professor2.professorAddress, tx.logs[0].args.professorAddress);
        assert.equal(professor2.isActive, tx.logs[0].args.isActive);

        let professor = await instance.professors.call(professor2.id);
        assert.equal(professor2.id, professor[0]);
        assert.equal(professor2.organisationId, professor[1]);
        assert.equal(professor2.professorAddress, professor[2]);
        assert.equal(professor2.isActive, professor[3]);

        let professorId = await instance.professorToProfessorId.call(professor2.professorAddress);
        assert.equal(professor2.id, professorId);
    });

    it("createProfessor 1 - throw professor exits", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw professor exits');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createProfessor 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createProfessor 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("createProfessor 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });
    
    it("updateProfessor 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getProfessorsLength();
        assert.equal(3, lengthBefore);

        let tx = await instance.updateProfessor(professor2.id, !professor2.isActive,
            {from: administrator2.administratorAddress});
        
        let lengthAfter = await instance.getProfessorsLength();
        assert.equal(3, lengthAfter);

        assert.equal("ProfessorUpdated", tx.logs[0].event);
        assert.equal(professor2.id, tx.logs[0].args.professorId);
        assert.equal(professor2.organisationId, tx.logs[0].args.organisationId);
        assert.equal(professor2.professorAddress, tx.logs[0].args.professorAddress);
        assert.equal(!professor2.isActive, tx.logs[0].args.isActive);

        let professor = await instance.professors.call(professor2.id);
        assert.equal(professor2.id, professor[0]);
        assert.equal(professor2.organisationId, professor[1]);
        assert.equal(professor2.professorAddress, professor[2]);
        assert.equal(!professor2.isActive, professor[3]);

        let professorId = await instance.professorToProfessorId.call(professor2.professorAddress);
        assert.equal(professor2.id, professorId);
    });

    it("updateProfessor 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.updateProfessor(professor2.id, !professor2.isActive,
                {from: organisation2.ownerAddress});
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateProfessor 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updateProfessor(professor2.id, !professor2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, {from: organisation2.ownerAddress});
    });

    it("updateProfessor 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, {from: organisation2.ownerAddress});

        try {
            await instance.updateProfessor(professor2.id, !professor2.isActive,
                {from: administrator2.administratorAddress});
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, {from: organisation2.ownerAddress});
    });

});
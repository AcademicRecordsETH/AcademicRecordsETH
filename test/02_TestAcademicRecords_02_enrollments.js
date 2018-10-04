var AcademicRecords = artifacts.require("AcademicRecords");

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

async function printStudent(instance, studentId) {
    let student = await instance.students.call(studentId);
    console.log('student.id', student[0]);
    console.log('student.organisationId', student[1]);
    console.log('student.studentCode', student[2]);
    console.log('student.isActive', student[3]);
}

contract('AcademicRecords - Enrollments', async (accounts) => {

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
    var payer = {
        payerAddress: accounts[2]
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
    var enrollment1 = {
        id: 1,
        subjectId: 1,
        studentId: 1,
        isActive: true
    }
    var enrollment2 = {
        id: 2,
        subjectId: 2,
        studentId: 2,
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
        //console.log(student1.organisationId + ", " + student1.studentCode + ", " + student1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createStudent(student1.organisationId, student1.studentCode, student1.isActive, { from: administrator1.administratorAddress });
        //console.log(student2.organisationId + ", " + student2.studentCode + ", " + student2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createStudent(student2.organisationId, student2.studentCode, student2.isActive, { from: administrator2.administratorAddress });

    });

    it("createEnrollment 0", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getEnrollmentsLength();
        assert.equal(1, lengthBefore);

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        //console.log('ownerBallenceBefore.toNumber()', ownerBallenceBefore.toNumber());
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);
        //console.log('payerBallenceBefore.toNumber()', payerBallenceBefore.toNumber());

        let tx = await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive,
            { value: subject1.price, gasPrice: 0, from: payer.payerAddress });

        let lengthAfter = await instance.getEnrollmentsLength();
        assert.equal(2, lengthAfter);

        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        //console.log('ownerBallenceAfter.toNumber()', ownerBallenceAfter.toNumber());
        assert.equal(ownerBallenceBefore.add(subject1.price).toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        //console.log('payerBallenceAfter.toNumber()', payerBallenceAfter.toNumber());
        assert.equal(payerBallenceBefore.minus(subject1.price).toNumber(), payerBallenceAfter.toNumber());

        assert.equal("EnrollmentCreated", tx.logs[0].event);
        assert.equal(enrollment1.id, tx.logs[0].args.enrollmentId);
        assert.equal(enrollment1.subjectId, tx.logs[0].args.subjectId);
        assert.equal(enrollment1.studentId, tx.logs[0].args.studentId);
        assert.equal(enrollment1.isActive, tx.logs[0].args.isActive);

        let enrollment = await instance.enrollments.call(enrollment1.id);
        assert.equal(enrollment1.id, enrollment[0]);
        assert.equal(enrollment1.subjectId, enrollment[1]);
        assert.equal(enrollment1.studentId, enrollment[2]);
        assert.equal(enrollment1.isActive, enrollment[3]);
    });

    it("createEnrollment 0 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject1.id, !subject1.isActive, { from: administrator1.administratorAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {
            
            await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive,
                { value: subject1.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updateSubject(subject1.id, subject1.isActive, { from: administrator1.administratorAddress });
    });

    it("createEnrollment 0 - throw student not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateStudent(student1.id, !student1.isActive, { from: administrator1.administratorAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive,
                { value: subject1.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw student not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updateStudent(student1.id, student1.isActive, { from: administrator1.administratorAddress });
    });

    it("createEnrollment 0 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period1.id, !period1.isActive, { from: administrator1.administratorAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive,
                { value: subject1.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw student not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    
        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());
        
        await instance.updatePeriod(period1.id, !period1.isActive, { from: administrator1.administratorAddress });
    });

    it("createEnrollment 0 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, { from: organisation1.ownerAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive,
                { value: subject1.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    
        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, { from: organisation1.ownerAddress });
    });

    it("createEnrollment 0 - throw organisation not equals", async () => {

        let instance = await AcademicRecords.deployed();

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment2.subjectId, enrollment1.studentId, enrollment1.isActive,
                { value: subject1.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());
    });

    it("createEnrollment 0 - throw price not equals", async () => {

        let instance = await AcademicRecords.deployed();

        let ownerBallenceBefore = web3.eth.getBalance(organisation1.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive,
                { value: subject2.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    
        let ownerBallenceAfter = web3.eth.getBalance(organisation1.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());
    });

    it("createEnrollment 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getEnrollmentsLength();
        assert.equal(2, lengthBefore);

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        //console.log('ownerBallenceBefore.toNumber()', ownerBallenceBefore.toNumber());
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);
        //console.log('payerBallenceBefore.toNumber()', payerBallenceBefore.toNumber());

        let tx = await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive,
            { value: subject2.price, gasPrice: 0, from: payer.payerAddress });

        let lengthAfter = await instance.getEnrollmentsLength();
        assert.equal(3, lengthAfter);

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        //console.log('ownerBallenceAfter.toNumber()', ownerBallenceAfter.toNumber());
        assert.equal(ownerBallenceBefore.add(subject2.price).toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        //console.log('payerBallenceAfter.toNumber()', payerBallenceAfter.toNumber());
        assert.equal(payerBallenceBefore.minus(subject2.price).toNumber(), payerBallenceAfter.toNumber());

        assert.equal("EnrollmentCreated", tx.logs[0].event);
        assert.equal(enrollment2.id, tx.logs[0].args.enrollmentId);
        assert.equal(enrollment2.subjectId, tx.logs[0].args.subjectId);
        assert.equal(enrollment2.studentId, tx.logs[0].args.studentId);
        assert.equal(enrollment2.isActive, tx.logs[0].args.isActive);

        let enrollment = await instance.enrollments.call(enrollment2.id);
        assert.equal(enrollment2.id, enrollment[0]);
        assert.equal(enrollment2.subjectId, enrollment[1]);
        assert.equal(enrollment2.studentId, enrollment[2]);
        assert.equal(enrollment2.isActive, enrollment[3]);
    });

    it("createEnrollment 1 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject2.id, !subject2.isActive, { from: administrator2.administratorAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive,
                { value: subject2.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updateSubject(subject2.id, subject2.isActive, { from: administrator2.administratorAddress });
    });

    it("createEnrollment 1 - throw student not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateStudent(student2.id, !student2.isActive, { from: administrator2.administratorAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive,
                { value: subject2.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw student not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updateStudent(student2.id, student2.isActive, { from: administrator2.administratorAddress });
    });

    it("createEnrollment 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive,
                { value: subject2.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw student not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updatePeriod(period2.id, period2.isActive, { from: administrator2.administratorAddress });
    });

    it("createEnrollment 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, { from: organisation2.ownerAddress });

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive,
                { value: subject2.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, { from: organisation2.ownerAddress });
    });

    it("createEnrollment 1 - throw organisation not equals", async () => {

        let instance = await AcademicRecords.deployed();

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {

            await instance.createEnrollment(enrollment1.subjectId, enrollment2.studentId, enrollment2.isActive,
                { value: subject2.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());
    });

    it("createEnrollment 1 - throw price not equals", async () => {

        let instance = await AcademicRecords.deployed();

        let ownerBallenceBefore = web3.eth.getBalance(organisation2.ownerAddress);
        let payerBallenceBefore = web3.eth.getBalance(payer.payerAddress);

        try {
            
            await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive,
                { value: subject1.price, gasPrice: 0, from: payer.payerAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        let ownerBallenceAfter = web3.eth.getBalance(organisation2.ownerAddress);
        assert.equal(ownerBallenceBefore.toNumber(), ownerBallenceAfter.toNumber());
        let payerBallenceAfter = web3.eth.getBalance(payer.payerAddress);
        assert.equal(payerBallenceBefore.toNumber(), payerBallenceAfter.toNumber());
    });

    it("updateEnrollment 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getEnrollmentsLength();
        assert.equal(3, lengthBefore);

        //printPeriod(instance, period2.id);
        //printSubject(instance, subject2.id);
        //printStudent(instance, student2.id);

        let tx = await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive, { from: administrator2.administratorAddress });

        let lengthAfter = await instance.getEnrollmentsLength();
        assert.equal(3, lengthAfter);

        assert.equal("EnrollmentUpdated", tx.logs[0].event);
        assert.equal(enrollment2.id, tx.logs[0].args.enrollmentId);
        assert.equal(enrollment2.subjectId, tx.logs[0].args.subjectId);
        assert.equal(enrollment2.studentId, tx.logs[0].args.studentId);
        assert.equal(!enrollment2.isActive, tx.logs[0].args.isActive);

        let enrollment = await instance.enrollments.call(enrollment2.id);
        assert.equal(enrollment2.id, enrollment[0]);
        assert.equal(enrollment2.subjectId, enrollment[1]);
        assert.equal(enrollment2.studentId, enrollment[2]);
        assert.equal(!enrollment2.isActive, enrollment[3]);
    });

    it("updateEnrollment 1 - throw not administrator", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive,
                { from: organisation2.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateEnrollment 1 - throw administrator not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateAdministrator(administrator2.id, !administrator2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateAdministrator(administrator2.id, administrator2.isActive, { from: organisation2.ownerAddress });
    });

    it("updateEnrollment 1 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject2.id, !subject2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject2.id, subject2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateEnrollment 1 - throw student not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateStudent(student2.id, !student2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw student not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateStudent(student2.id, student2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateEnrollment 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw student not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateEnrollment 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive,
                { from: administrator2.administratorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, { from: organisation2.ownerAddress });
    });

});
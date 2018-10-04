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

async function printStudent(instance, studentId) {
    let student = await instance.students.call(studentId);
    console.log('student.id', student[0]);
    console.log('student.organisationId', student[1]);
    console.log('student.studentCode', student[2]);
    console.log('student.isActive', student[3]);
}

async function printEnrollment(instance, enrollmentId) {
    let enrollment = await instance.enrollments.call(enrollmentId);
    console.log('enrollment.id', enrollment[0]);
    console.log('enrollment.organisationId', enrollment[1]);
    console.log('enrollment.enrollmentCode', enrollment[2]);
    console.log('enrollment.isActive', enrollment[3]);
}

async function printProfessor(instance, professorId) {
    let professor = await instance.professors.call(professorId);
    console.log('professor.id', professor[0]);
    console.log('professor.organisationId', professor[1]);
    console.log('professor.professorAddress', professor[2]);
    console.log('professor.isActive', professor[3]);
}

async function printTeaching(instance, teachingId) {
    let teaching = await instance.teachings.call(teachingId);
    console.log('teaching.id', teaching[0]);
    console.log('teaching.subjectId', teaching[1]);
    console.log('teaching.professorId', teaching[2]);
    console.log('teaching.isActive', teaching[3]);
}

contract('AcademicRecords - Grades', async (accounts) => {

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
    var professor1 = {
        id: 1,
        organisationId: 1,
        professorAddress: accounts[5],
        isActive: true
    }
    var professor2 = {
        id: 2,
        organisationId: 2,
        professorAddress:  accounts[6],
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
    var grade1 = {
        id: 1,
        professorId: 1,
        enrollmentId: 1,
        grade: 1,
        isActive: true
    }
    var grade2 = {
        id: 2,
        professorId: 2,
        enrollmentId: 2,
        grade: 10,
        isActive: true
    }
    it("init", async () => {

        let instance = await AcademicRecords.deployed();

        //console.log('createOrganisation ' + organisation1.name + ", " + organisation1.isActive + ", " + organisation1.ownerAddress);
        await instance.createOrganisation(organisation1.name, organisation1.isActive, { from: organisation1.ownerAddress });
        //console.log('createOrganisation ' + organisation2.name + ", " + organisation2.isActive + ", " + organisation2.ownerAddress);
        await instance.createOrganisation(organisation2.name, organisation2.isActive, { from: organisation2.ownerAddress });
        //console.log('createAdministrator ' + administrator1.organisationId + ", " + administrator1.administratorAddress + ", " + administrator1.isActive + ", " + organisation1.ownerAddress);
        await instance.createAdministrator(administrator1.organisationId, administrator1.administratorAddress, administrator1.isActive, { from: organisation1.ownerAddress });
        //console.log('createAdministrator ' + administrator2.organisationId + ", " + administrator2.administratorAddress + ", " + administrator2.isActive + ", " + organisation2.ownerAddress);
        await instance.createAdministrator(administrator2.organisationId, administrator2.administratorAddress, administrator2.isActive, { from: organisation2.ownerAddress });
        //console.log('createPeriod ' + period1.organisationId + ", " + period1.name + ", " + period1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createPeriod(period1.organisationId, period1.name, period1.isActive, { from: administrator1.administratorAddress });
        //console.log('createPeriod ' + period2.organisationId + ", " + period2.name + ", " + period2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createPeriod(period2.organisationId, period2.name, period2.isActive, { from: administrator2.administratorAddress });
        //console.log('createSubject ' + subject1.periodId + ", " + subject1.name + ", " + subject1.price + ", " + subject1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createSubject(subject1.periodId, subject1.name, subject1.price, subject1.isActive, { from: administrator1.administratorAddress });
        //console.log('createSubject ' + subject2.periodId + ", " + subject2.name + ", " + subject2.price + ", " + subject2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createSubject(subject2.periodId, subject2.name, subject2.price, subject2.isActive, { from: administrator2.administratorAddress });
        //console.log('createProfessor ' + professor1.organisationId + ", " + professor1.professorAddress + ", " + professor1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createProfessor(professor1.organisationId, professor1.professorAddress, professor1.isActive, { from: administrator1.administratorAddress });
        //console.log('createProfessor ' + professor2.organisationId + ", " + professor2.professorAddress + ", " + professor2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createProfessor(professor2.organisationId, professor2.professorAddress, professor2.isActive, { from: administrator2.administratorAddress });
        //console.log('createTeaching ' + teaching1.subjectId + ", " + teaching1.professorId + ", " + teaching1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createTeaching(teaching1.subjectId, teaching1.professorId, teaching1.isActive, { from: administrator1.administratorAddress });
        //console.log('createTeaching ' + teaching2.subjectId + ", " + teaching2.professorId + ", " + teaching2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createTeaching(teaching2.subjectId, teaching2.professorId, teaching2.isActive, { from: administrator2.administratorAddress });
        //console.log('createStudent ' + student1.organisationId + ", " + student1.studentCode + ", " + student1.isActive + ", "  + administrator1.administratorAddress);
        await instance.createStudent(student1.organisationId, student1.studentCode, student1.isActive, { from: administrator1.administratorAddress });
        //console.log('createStudent ' + student2.organisationId + ", " + student2.studentCode + ", " + student2.isActive + ", "  + administrator2.administratorAddress);
        await instance.createStudent(student2.organisationId, student2.studentCode, student2.isActive, { from: administrator2.administratorAddress });
        //console.log('createEnrollment ' + enrollment1.subjectId + ", " + enrollment1.studentId + ", " + enrollment1.isActive + ", " + subject1.price + ", " + payer.payerAddress );
        await instance.createEnrollment(enrollment1.subjectId, enrollment1.studentId, enrollment1.isActive, { value: subject1.price, from: payer.payerAddress });
        //console.log('createEnrollment ' + enrollment2.subjectId + ", " + enrollment2.studentId + ", " + enrollment2.isActive + ", " + subject2.price + ", " + payer.payerAddress );
        await instance.createEnrollment(enrollment2.subjectId, enrollment2.studentId, enrollment2.isActive, { value: subject2.price, from: payer.payerAddress });
    });

    it("createGrade 0", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getGradesLength();
        assert.equal(1, lengthBefore);

        let tx = await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
            { from: professor1.professorAddress });

        let lengthAfter = await instance.getGradesLength();
        assert.equal(2, lengthAfter);

        assert.equal("GradeCreated", tx.logs[0].event);
        assert.equal(grade1.id, tx.logs[0].args.gradeId);
        assert.equal(grade1.professorId, tx.logs[0].args.professorId);
        assert.equal(grade1.enrollmentId, tx.logs[0].args.enrollmentId);
        assert.equal(grade1.grade, tx.logs[0].args.grade);
        assert.equal(grade1.isActive, tx.logs[0].args.isActive);

        let grade = await instance.grades.call(grade1.id);
        assert.equal(grade1.id, grade[0]);
        assert.equal(grade1.professorId, grade[1]);
        assert.equal(grade1.enrollmentId, grade[2]);
        assert.equal(grade1.grade, grade[3]);
        assert.equal(grade1.isActive, grade[4]);
    });

    it("createGrade 0 - throw not professor", async () => {

        let instance = await AcademicRecords.deployed();

        try {

            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: organisation1.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createGrade 0 - throw professor not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateProfessor(professor1.id, !professor1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateProfessor(professor1.id, professor1.isActive, { from: administrator1.administratorAddress });
    });

    it("createGrade 0 - throw teaching not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateTeaching(teaching1.id, !teaching1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateTeaching(teaching1.id, teaching1.isActive, { from: administrator1.administratorAddress });
    });

    it("createGrade 0 - throw enrollment not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateEnrollment(enrollment1.id, !enrollment1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateEnrollment(enrollment1.id, enrollment1.isActive, { from: administrator1.administratorAddress });
    });

    it("createGrade 0 - throw student not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateStudent(student1.id, !student1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateStudent(student1.id, student1.isActive, { from: administrator1.administratorAddress });
    });

    it("createGrade 0 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject1.id, !subject1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject1.id, subject1.isActive, { from: administrator1.administratorAddress });
    });

    it("createGrade 0 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period1.id, !period1.isActive, { from: administrator1.administratorAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period1.id, period1.isActive, { from: administrator1.administratorAddress });
    });

    it("createGrade 0 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation1.id, !organisation1.isActive, { from: organisation1.ownerAddress });

        try {
            await instance.createGrade(grade1.enrollmentId, grade1.grade, grade1.isActive,
                { from: professor1.professorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation1.id, organisation1.isActive, { from: organisation1.ownerAddress });
    });

    it("createGrade 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getGradesLength();
        assert.equal(2, lengthBefore);
        
        let tx = await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
            { from: professor2.professorAddress });

        let lengthAfter = await instance.getGradesLength();
        assert.equal(3, lengthAfter);

        assert.equal("GradeCreated", tx.logs[0].event);
        assert.equal(grade2.id, tx.logs[0].args.gradeId);
        assert.equal(grade2.subjectId, tx.logs[0].args.subjectId);
        assert.equal(grade2.enrollmentId, tx.logs[0].args.enrollmentId);
        assert.equal(grade2.grade, tx.logs[0].args.grade);
        assert.equal(grade2.isActive, tx.logs[0].args.isActive);

        let grade = await instance.grades.call(grade2.id);
        assert.equal(grade2.id, grade[0]);
        assert.equal(grade2.professorId, grade[1]);
        assert.equal(grade2.enrollmentId, grade[2]);
        assert.equal(grade2.grade, grade[3]);
        assert.equal(grade2.isActive, grade[4]);
    });

    it("createGrade 1 - throw not professor", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: organisation2.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("createGrade 1 - throw professor not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateProfessor(professor2.id, !professor2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateProfessor(professor2.id, professor2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw teaching not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateTeaching(teaching2.id, teaching2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw enrollment not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateEnrollment(enrollment2.id, enrollment2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw student not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateStudent(student2.id, !student2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateStudent(student2.id, student2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject2.id, !subject2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject2.id, subject2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, period2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.createGrade(grade2.enrollmentId, grade2.grade, grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, { from: organisation2.ownerAddress });
    });

    it("updateGrade 1", async () => {

        let instance = await AcademicRecords.deployed();

        let lengthBefore = await instance.getGradesLength();
        assert.equal(3, lengthBefore);

        /*
        printOrganisation(instance, organisation2.id);
        printAdministrator(instance, administrator2.id);
        printPeriod(instance, period2.id);
        printSubject(instance, subject2.id);
        printStudent(instance, student2.id);
        printEnrollment(instance, enrollment2.id);
        printProfessor(instance, professor2.id);
        printTeaching(instance, teaching2.id);

        let teaching = await instance.getTeachingIdByProfessorAddress(professor2.professorAddress, teaching2.subjectId);
        console.log('teaching.id', teaching[0]);
        console.log('teaching.subjectId', teaching[1]);
        console.log('teaching.professorId', teaching[2]);
        console.log('teaching.isActive', teaching[3]);
        */

        let tx = await instance.updateGrade(grade2.id, !grade2.isActive,
            { from: professor2.professorAddress });

        let lengthAfter = await instance.getGradesLength();
        assert.equal(3, lengthAfter);

        assert.equal("GradeUpdated", tx.logs[0].event);
        assert.equal(grade2.id, tx.logs[0].args.gradeId);
        assert.equal(grade2.subjectId, tx.logs[0].args.subjectId);
        assert.equal(grade2.enrollmentId, tx.logs[0].args.enrollmentId);
        assert.equal(grade2.grade, tx.logs[0].args.grade);
        assert.equal(!grade2.isActive, tx.logs[0].args.isActive);

        let grade = await instance.grades.call(grade2.id);
        assert.equal(grade2.id, grade[0]);
        assert.equal(grade2.professorId, grade[1]);
        assert.equal(grade2.enrollmentId, grade[2]);
        assert.equal(grade2.grade, grade[3]);
        assert.equal(!grade2.isActive, grade[4]);
    });

    it("updateGrade 1 - throw not professor", async () => {

        let instance = await AcademicRecords.deployed();

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: organisation2.ownerAddress });
            assert.fail('Expected throw not administrator');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }
    });

    it("updateGrade 1 - throw professor not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateProfessor(professor2.id, !professor2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateProfessor(professor2.id, professor2.isActive, { from: administrator2.administratorAddress });
    });

    it("createGrade 1 - throw teaching not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateTeaching(teaching2.id, !teaching2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw administrator not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateTeaching(teaching2.id, teaching2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateGrade 1 - throw enrollment not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateEnrollment(enrollment2.id, !enrollment2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateEnrollment(enrollment2.id, enrollment2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateGrade 1 - throw student not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateStudent(student2.id, !student2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateStudent(student2.id, student2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateGrade 1 - throw subject not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateSubject(subject2.id, !subject2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw subject not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateSubject(subject2.id, subject2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateGrade 1 - throw period not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw professor not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updatePeriod(period2.id, !period2.isActive, { from: administrator2.administratorAddress });
    });

    it("updateGrade 1 - throw organisation not active", async () => {

        let instance = await AcademicRecords.deployed();

        await instance.updateOrganisationState(organisation2.id, !organisation2.isActive, { from: organisation2.ownerAddress });

        try {
            await instance.updateGrade(grade2.id, !grade2.isActive,
                { from: professor2.professorAddress });
            assert.fail('Expected throw organisation not active');
        } catch (error) {
            assert.equal(error.message, 'VM Exception while processing transaction: revert');
        }

        await instance.updateOrganisationState(organisation2.id, organisation2.isActive, { from: organisation2.ownerAddress });
    });

});
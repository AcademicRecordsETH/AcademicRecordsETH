pragma solidity ^0.4.23;
import "./Organisations.sol";
contract AcademicRecords is Organisations {

    struct Subject {
        uint id;
        uint periodId;
        string name;
        uint price;
        bool isActive;
    }

    struct Student {
        uint id;
        uint organisationId;
        string studentCode;
        bool isActive;
    }

    struct Enrollment {
        uint id;
        uint subjectId;
        uint studentId;
        bool isActive;
    }

    struct Professor {
        uint id;
        uint organisationId;
        address professorAddress;
        bool isActive;
    }

    struct Teaching {
        uint id;
        uint subjectId;
        uint professorId;
        bool isActive;
    }

    struct Grade {
        uint id;
        uint professorId;
        uint enrollmentId;
        int8 grade;
        bool isActive;
    }

    Subject[] public subjects;
    Student[] public students;
    Enrollment[] public enrollments;
    Professor[] public professors;
    Teaching[] public teachings;
    Grade[] public grades;

    mapping(address => uint) public professorToProfessorId;
    mapping(address => mapping(uint => Teaching)) public professorAndSubjectIdToTeachingId;

    modifier professorNotExists(address _professorAddress) {

        require(professorToProfessorId[_professorAddress] == 0);
        _;
    }

    modifier subjectAndStudentActive(uint _subjectId, uint _studentId) {
        require(subjects[_subjectId].isActive);
        require(periods[subjects[_subjectId].periodId].isActive);
        require(students[_studentId].isActive);
        _;
    }

    modifier subjectAndProfessorActive(uint _subjectId, uint _professorId) {
        require(subjects[_subjectId].isActive);
        require(periods[subjects[_subjectId].periodId].isActive);
        require(professors[_professorId].isActive);
        _;
    }

    modifier professorCanGrade(uint _enrollmentId) {

        Enrollment memory enrollment = enrollments[_enrollmentId];
        require(enrollment.isActive);

        require(students[enrollment.studentId].isActive);

        require(subjects[enrollment.subjectId].isActive);

        require(periods[subjects[enrollment.subjectId].periodId].isActive);

        uint organisationId = periods[subjects[enrollment.subjectId].periodId].organisationId;
        require(organisations[organisationId].isActive);

        Professor memory professor = professors[professorToProfessorId[msg.sender]];
        require(professor.isActive);

        require(periods[subjects[enrollment.subjectId].periodId].organisationId == professor.organisationId);
        require(students[enrollment.studentId].organisationId == professor.organisationId);

        Teaching memory teaching = professorAndSubjectIdToTeachingId[msg.sender][enrollment.subjectId];
        require(teaching.isActive);
        require(teachings[teaching.id].isActive);
        require(teaching.professorId == professorToProfessorId[msg.sender]);
        _;
    }

    constructor() public {

        subjects.push(Subject(0, 0, '0', 0, false));
        students.push(Student(0, 0, '0', false));
        enrollments.push(Enrollment(0, 0, 0, false));
        professors.push(Professor(0, 0, 0, false));
        teachings.push(Teaching(0, 0, 0, false));
        grades.push(Grade(0, 0, 0, 0, false));       
    }

    function createSubject(uint _periodId, string _name, uint _price, bool _isActive) external
        organisationAdministratorAndActive(periods[_periodId].organisationId)
        periodActive(_periodId) {

        uint id = subjects.push(Subject(subjects.length, _periodId, _name, _price, _isActive)) - 1;
        emit SubjectCreated(id, _periodId, _name, _price, _isActive);
    }

    function updateSubject(uint _subjectId, bool _isActive) external
        organisationAdministratorAndActive(periods[subjects[_subjectId].periodId].organisationId)
        periodActive(subjects[_subjectId].periodId) {

        subjects[_subjectId].isActive = _isActive;
        emit SubjectUpdated(_subjectId, subjects[_subjectId].periodId, subjects[_subjectId].name, subjects[_subjectId].price, _isActive);
    }

    function createStudent(uint _organisationId, string _studentCode, bool _isActive) external
        organisationAdministratorAndActive(_organisationId) {

        uint id = students.push(Student(students.length, _organisationId, _studentCode, _isActive)) - 1;
        emit StudentCreated(id, _organisationId, _studentCode, _isActive);
    }

    function updateStudent(uint _studentId, bool _isActive) external
        organisationAdministratorAndActive(students[_studentId].organisationId) {

        students[_studentId].isActive = _isActive;
        emit StudentUpdated(_studentId, students[_studentId].organisationId, students[_studentId].studentCode, _isActive);
    }

    function createEnrollment(uint _subjectId, uint _studentId, bool _isActive) external
        subjectAndStudentActive(_subjectId, _studentId) payable {

        require(organisations[students[_studentId].organisationId].isActive);
        require(periods[subjects[_subjectId].periodId].organisationId == students[_studentId].organisationId);
        require(subjects[_subjectId].price == msg.value);

        organisations[students[_studentId].organisationId].ownerAddress.transfer(msg.value);

        uint id = enrollments.push(Enrollment(enrollments.length, _subjectId, _studentId, _isActive)) - 1;
        emit EnrollmentCreated(id, _subjectId, _studentId, _isActive);
    }

    function updateEnrollment(uint _enrollmentId, bool _isActive) external
        organisationAdministratorAndActive(students[enrollments[_enrollmentId].studentId].organisationId)
        subjectAndStudentActive(enrollments[_enrollmentId].subjectId, enrollments[_enrollmentId].studentId) {

        enrollments[_enrollmentId].isActive = _isActive;
        emit EnrollmentUpdated(_enrollmentId, enrollments[_enrollmentId].subjectId, enrollments[_enrollmentId].studentId, _isActive);
    }

    function createProfessor(uint _organisationId, address _professorAddress, bool _isActive) external
        organisationAdministratorAndActive(_organisationId)
        professorNotExists(_professorAddress) {

        uint id = professors.push(Professor(professors.length, _organisationId, _professorAddress, _isActive)) - 1;
        professorToProfessorId[_professorAddress] = id;
        emit ProfessorCreated(id, _organisationId, _professorAddress, _isActive);
    }

    function updateProfessor(uint _professorId, bool _isActive) external
        organisationAdministratorAndActive(professors[_professorId].organisationId) {

        professors[_professorId].isActive = _isActive;
        emit ProfessorUpdated(_professorId, professors[_professorId].organisationId, professors[_professorId].professorAddress, _isActive);
    }

    function createTeaching(uint _subjectId, uint _professorId, bool _isActive) external
        organisationAdministratorAndActive(professors[_professorId].organisationId)
        subjectAndProfessorActive(_subjectId, _professorId) {

        require(periods[subjects[_subjectId].periodId].organisationId == professors[_professorId].organisationId);

        uint id = teachings.push(Teaching(teachings.length, _subjectId, _professorId, _isActive)) - 1;
        professorAndSubjectIdToTeachingId[professors[_professorId].professorAddress][_subjectId] = teachings[id];
        professorAndSubjectIdToTeachingId[professors[_professorId].professorAddress][_subjectId].isActive = true;
        emit TeachingCreated(id, _subjectId, _professorId, _isActive);
    }

    function updateTeaching(uint _teachingId, bool _isActive) external
        organisationAdministratorAndActive(professors[teachings[_teachingId].professorId].organisationId)
        subjectAndProfessorActive(teachings[_teachingId].subjectId, teachings[_teachingId].professorId) {

        teachings[_teachingId].isActive = _isActive;
        emit TeachingUpdated(_teachingId, teachings[_teachingId].subjectId, teachings[_teachingId].professorId, _isActive);
    }

    function createGrade(uint _enrollmentId, int8 _grade, bool _isActive) external
        professorCanGrade(_enrollmentId) {

        uint id = grades.push(Grade(grades.length, professorToProfessorId[msg.sender], _enrollmentId, _grade, _isActive)) - 1;
        emit GradeCreated(id, professorToProfessorId[msg.sender], _enrollmentId, _grade, _isActive);
    }

    function updateGrade(uint _gradeId, bool _isActive) external
        professorCanGrade(grades[_gradeId].enrollmentId) {

        grades[_gradeId].isActive = _isActive;
        emit GradeUpdated(_gradeId, professorToProfessorId[msg.sender], grades[_gradeId].enrollmentId, grades[_gradeId].grade, _isActive);
    }

    function getTeachingIdByProfessorAddress(address _professorAddress, uint _subjectId) external view 
        returns(uint teachingId, uint subjectId, uint professorId, bool isActive) {

        Teaching memory teaching = professorAndSubjectIdToTeachingId[_professorAddress][_subjectId];
        teachingId = teaching.id;
        subjectId = teaching.subjectId;
        professorId = teaching.professorId;
        isActive = teaching.isActive;
    }

    function getSubjectsLength() external view returns(uint) {

        return subjects.length;
    }

    function getStudentsLength() external view returns(uint) {

        return students.length;
    }

    function getEnrollmentsLength() external view returns(uint) {

        return enrollments.length;
    }

    function getProfessorsLength() external view returns(uint) {

        return professors.length;
    }

    function getTeachingsLength() external view returns(uint) {

        return teachings.length;
    }

    function getGradesLength() external view returns(uint) {

        return grades.length;
    }

    event SubjectCreated(uint indexed subjectId, uint indexed periodId, string name, uint price, bool indexed isActive);
    event SubjectUpdated(uint indexed subjectId, uint indexed periodId, string name, uint price, bool indexed isActive);

    event StudentCreated(uint indexed studentId, uint indexed organisationId, string studentCode, bool indexed isActive);
    event StudentUpdated(uint indexed studentId, uint indexed organisationId, string studentCode, bool indexed isActive);

    event EnrollmentCreated(uint indexed enrollmentId, uint indexed subjectId, uint indexed studentId, bool isActive);
    event EnrollmentUpdated(uint indexed enrollmentId, uint indexed subjectId, uint indexed studentId, bool isActive);

    event ProfessorCreated(uint indexed professorId, uint indexed organisationId, address indexed professorAddress, bool isActive);
    event ProfessorUpdated(uint indexed professorId, uint indexed organisationId, address indexed professorAddress, bool isActive);

    event TeachingCreated(uint indexed teachingId, uint indexed subjectId, uint indexed professorId, bool isActive);
    event TeachingUpdated(uint indexed teachingId, uint indexed subjectId, uint indexed professorId, bool isActive);

    event GradeCreated(uint indexed gradeId, uint indexed professorId, uint indexed enrollmentId, int8 grade, bool isActive);
    event GradeUpdated(uint indexed gradeId, uint indexed professorId, uint indexed enrollmentId, int8 grade, bool isActive);

    /*
    event SubjectEvent(uint indexed subjectId, uint indexed periodId, string name, uint price, bool isActive);
    event StudentEvent(uint indexed studentId, uint indexed organisationId, string studentCode, bool indexed isActive);
    event EnrollmentEvent(uint indexed enrollmentId, uint indexed subjectId, uint indexed studentId, bool isActive);
    event ProfessorEvent(uint indexed professorId, uint indexed organisationId, address indexed professorAddress, bool isActive);
    event TeachingEvent(uint indexed teachingId, uint indexed subjectId, uint indexed professorId, bool isActive);
    event GradeEvent(uint indexed gradeId, uint indexed professorId, uint indexed enrollmentId, int8 grade, bool isActive);
    */
}
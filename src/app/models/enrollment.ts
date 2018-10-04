import { Student } from './student';
import { Subject } from './subject';

export class Enrollment {

    id: number;
    subject: Subject;
    student: Student;
    isActive: boolean;
    string: string;

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Enrollment[ID=' + this.id + ''
            + ', subject=' + this.subject.getString() + ''
            + ', student=' + this.student.getString() + ''
            + ', isActive=' + this.isActive + ']';
    }
}

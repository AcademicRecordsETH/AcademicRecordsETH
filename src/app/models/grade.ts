import { Professor } from './professor';
import { Enrollment } from './enrollment';

export class Grade {

    id: number;
    professor: Professor;
    enrollment: Enrollment;
    grade: number;
    isActive: boolean;
    string: string;

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Grade[ID=' + this.id + ''
            + ', professor=' + this.professor.getString() + ''
            + ', enrollment=' + this.enrollment.getString() + ''
            + ', grade=' + this.grade + ''
            + ', isActive=' + this.isActive + ']';
    }
}

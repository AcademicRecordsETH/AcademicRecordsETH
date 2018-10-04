
import { Subject } from './subject';
import { Professor } from './professor';

export class Teaching {

    id: number;
    subject: Subject;
    professor: Professor;
    isActive: boolean;
    string: string;

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Teaching[ID=' + this.id + ''
            + ', subject=' + this.subject.getString() + ''
            + ', professor=' + this.professor.getString() + ''
            + ', isActive=' + this.isActive + ']';
    }
}

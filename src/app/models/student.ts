import { Organisation } from './organisation';
export class Student {

    id: number;
    organisation: Organisation;
    studentCode: string;
    isActive: boolean;
    string: string;

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Student[ID=' + this.id + ''
            + ', organisation=' + this.organisation.getString() + ''
            + ', studentCode=' + this.studentCode + ''
            + ', isActive=' + this.isActive + ']';
    }
}

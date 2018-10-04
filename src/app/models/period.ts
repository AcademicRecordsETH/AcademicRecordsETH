import { Organisation } from './organisation';
export class Period {

    id: number;
    organisation: Organisation;
    name: string;
    isActive: boolean;
    string: string;

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Period[ID=' + this.id + ''
            + ', organisation=' + this.organisation.getString() + ''
            + ', name=' + this.name + ''
            + ', isActive=' + this.isActive + ']';
    }
}

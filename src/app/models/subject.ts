import { Period } from './period';

export class Subject {

    id: number;
    period: Period;
    name: string;
    price: string;
    isActive: boolean;
    string: string;

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Subject[ID=' + this.id + ''
            + ', period=' + this.period.getString() + ''
            + ', name=' + this.name + ''
            + ', price=' + this.price + ''
            + ', isActive=' + this.isActive + ']';
    }
}

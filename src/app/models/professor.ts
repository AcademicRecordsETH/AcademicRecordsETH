import { Organisation } from './organisation';
import { AddressUtil } from '../util/address.util';
export class Professor {

    id: number;
    organisation: Organisation;
    professorAddress: string;
    isActive: boolean;
    string: string;

    professorAddressTruncated(): string {

        return AddressUtil.truncateAddress(this.professorAddress);
    }

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Professor[ID=' + this.id + ''
            + ', organisation=' + this.organisation.getString() + ''
            + ', professorAddress=' + this.professorAddress + ''
            + ', isActive=' + this.isActive + ']';
    }
}

import { Organisation } from './organisation';
import { AddressUtil } from '../util/address.util';

export class Administrator {

    id: number;
    organisation: Organisation;
    administratorAddress: string;
    isActive: boolean;
    string: string;

    administratorAddressTruncated(): string {

        return AddressUtil.truncateAddress(this.administratorAddress);
    }

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Administrator[ID=' + this.id + ''
            + ', organisation=' + this.organisation.getString() + ''
            + ', administratorAddress=' + this.administratorAddress + ''
            + ', isActive=' + this.isActive + ']';
    }
}

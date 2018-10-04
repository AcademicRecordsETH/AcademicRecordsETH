import { AddressUtil } from '../util/address.util';

export class Organisation {

    id: number;
    ownerAddress: string;
    name: string;
    isActive: boolean;
    string: string;

    ownerAddressTruncated(): string {

        return AddressUtil.truncateAddress(this.ownerAddress);
    }

    getString() {
        this.setString();
        return this.string;
    }

    setString() {
        this.string = 'Organisation[ID=' + this.id + ''
            + ', ownerAddress=' + this.ownerAddress + ''
            + ', name=' + this.name + ''
            + ', isActive=' + this.isActive + ']';
    }
}

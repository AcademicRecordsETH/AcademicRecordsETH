import { Injectable } from '@angular/core';
import { Period } from '../models/period';
import { Web3Service } from './web3.service';
import { OrganisationsService } from './organisations.service';
import { AdministratorsService } from './administrators.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class PeriodsService {

  private elements: Period[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service,
    private organisationsService: OrganisationsService,
    private administratorsService: AdministratorsService) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getAll(): Promise<Period[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getPeriodsLength();
    const elementLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementLength) {
      console.log('PeriodService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('PeriodService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Period> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const periodArray = await contractInstance.periods.call(id);
    const element = await this._getPeriodFromArray(periodArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The period ID is not correct.');
    }
    return element;
  }

  async create(element: Period): Promise<Period> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.createPeriod(
      element.organisation.id, element.name, element.isActive, { from: this.senderAddress });
    const elementCreated = await this._getPeriodFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The period ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('PeriodService->create', elementCreated);
    return elementCreated;
  }

  async update(element: Period): Promise<Period> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.updatePeriod(element.id, element.isActive, { from: this.senderAddress });
    const elementUpdated = await this._getPeriodFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The period ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('PeriodService->update', elementUpdated);
    return elementUpdated;
  }

  private async _checkCanDo(element: Period): Promise<any> {

    const contractInstance = await this.web3Service.getContractInstance();
    const administratorId = await contractInstance.administratorToAdministratorId.call(this.senderAddress);
    if (!administratorId || administratorId.toString() === '0') {
      throw new Error('The user is not an administrator of the organisation with ID "' + element.organisation.id + '".');
    }
    const administrator = await this.administratorsService.getOne(administratorId);
    if (!administrator || !administrator.isActive) {
      throw new Error('The administrator with ID "' + administrator.id + '" is not active.');
    }
    const administratorOrganisation = await this.organisationsService.getOne(administrator.organisation.id);
    if (!administratorOrganisation
      || administratorOrganisation.id.toString() !== element.organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + element.organisation.id + '".');
    }
    if (!administratorOrganisation.isActive) {
      throw new Error('The organisation with ID "' + element.organisation.id + '" is not active.');
    }
    return contractInstance;
  }

  private async _getPeriodFromArray(array: any): Promise<Period> {

    const element = new Period();
    element.id = array[0];
    element.organisation = await this.organisationsService.getOne(array[1]);
    element.name = array[2];
    element.isActive = array[3];
    element.setString();
    return element;
  }

  private async _getPeriodFromTransaction(transaction: any): Promise<Period> {

    const element = new Period();
    element.id = transaction.logs[0].args.periodId;
    element.organisation = await this.organisationsService.getOne(transaction.logs[0].args.organisationId);
    element.name = transaction.logs[0].args.name;
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

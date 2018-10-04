import { Injectable } from '@angular/core';
import { Subject } from '../models/subject';
import { Web3Service } from './web3.service';
import { OrganisationsService } from './organisations.service';
import { AdministratorsService } from './administrators.service';
import { PeriodsService } from './periods.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class SubjectsService {

  private elements: Subject[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service,
    private administratorsService: AdministratorsService,
    private organisationsService: OrganisationsService,
    private periodsService: PeriodsService) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getAll(): Promise<Subject[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getSubjectsLength();
    const elementLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementLength) {
      console.log('SubjectService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('SubjectService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Subject> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const subjectArray = await contractInstance.subjects.call(id);
    const element = await this._getSubjectFromArray(subjectArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The subject ID is not correct.');
    }
    return element;
  }

  async create(element: Subject): Promise<Subject> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.createSubject(
      element.period.id, element.name, this.web3Service.etherToWei('' + element.price), element.isActive,
        { from: this.senderAddress });
    const elementCreated = await this._getSubjectFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The subject ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('SubjectService->create', elementCreated);
    return elementCreated;
  }

  async update(element: Subject): Promise<Subject> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.updateSubject(element.id, element.isActive, { from: this.senderAddress });
    const elementUpdated = await this._getSubjectFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The subject ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('SubjectService->update', elementUpdated);
    return elementUpdated;
  }

  private async _checkCanDo(element: Subject): Promise<any> {

    const contractInstance = await this.web3Service.getContractInstance();
    const period = await this.periodsService.getOne(element.period.id);
    if (!period || !period.isActive) {
      throw new Error('The period with ID "' + element.period.id + '" is not active.');
    }
    const administratorId = await contractInstance.administratorToAdministratorId.call(this.senderAddress);
    if (!administratorId || administratorId.toString() === '0') {
      throw new Error('The user is not an administrator.');
    }
    const administrator = await this.administratorsService.getOne(administratorId);
    if (!administrator || !administrator.isActive) {
      throw new Error('The administrator with ID "' + administratorId + '" is not active.');
    }
    const administratorOrganisation = await this.organisationsService.getOne(administrator.organisation.id);
    if (!administratorOrganisation
      || administratorOrganisation.id.toString() !== period.organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + period.organisation.id + '".');
    }
    if (!administratorOrganisation.isActive) {
      throw new Error('The organisation with ID "' + period.organisation.id + '" is not active.');
    }
    return contractInstance;
  }

  private async _getSubjectFromArray(array: any): Promise<Subject> {

    const element = new Subject();
    element.id = array[0];
    element.period = await this.periodsService.getOne(array[1]);
    element.name = array[2];
    element.price = this.web3Service.weiToEther('' + array[3]);
    element.isActive = array[4];
    element.setString();
    return element;
  }

  private async _getSubjectFromTransaction(transaction: any): Promise<Subject> {

    const element = new Subject();
    element.id = transaction.logs[0].args.subjectId;
    element.period = await this.periodsService.getOne(transaction.logs[0].args.periodId);
    element.name = transaction.logs[0].args.name;
    element.price = this.web3Service.weiToEther('' + transaction.logs[0].args.price);
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

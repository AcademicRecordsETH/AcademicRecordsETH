import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { Web3Service } from './web3.service';
import { OrganisationsService } from './organisations.service';
import { AdministratorsService } from './administrators.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class StudentsService {

  private elements: Student[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service,
    private organisationsService: OrganisationsService,
    private administratorsService: AdministratorsService) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getAll(): Promise<Student[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getStudentsLength();
    const elementLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementLength) {
      console.log('StudentService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('StudentService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Student> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const studentArray = await contractInstance.students.call(id);
    const element = await this._getStudentFromArray(studentArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The student ID is not correct.');
    }
    return element;
  }

  async create(element: Student): Promise<Student> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.createStudent(
      element.organisation.id, element.studentCode, element.isActive, { from: this.senderAddress });
    const elementCreated = await this._getStudentFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The student ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('StudentService->create', elementCreated);
    return elementCreated;
  }

  async update(element: Student): Promise<Student> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.updateStudent(element.id, element.isActive, { from: this.senderAddress });
    const elementUpdated = await this._getStudentFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The student ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('StudentService->update', elementUpdated);
    return elementUpdated;
  }

  private async _checkCanDo(element: Student): Promise<any> {

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

  private async _getStudentFromArray(array: any): Promise<Student> {

    const element = new Student();
    element.id = array[0];
    element.organisation = await this.organisationsService.getOne(array[1]);
    element.studentCode = array[2];
    element.isActive = array[3];
    element.setString();
    return element;
  }

  private async _getStudentFromTransaction(transaction: any): Promise<Student> {

    const element = new Student();
    element.id = transaction.logs[0].args.studentId;
    element.organisation = await this.organisationsService.getOne(transaction.logs[0].args.organisationId);
    element.studentCode = transaction.logs[0].args.studentCode;
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

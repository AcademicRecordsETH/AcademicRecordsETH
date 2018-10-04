import { Injectable } from '@angular/core';
import { Enrollment } from '../models/enrollment';
import { OrganisationsService } from './organisations.service';
import { StudentsService } from './students.service';
import { SubjectsService } from './subjects.service';
import { Web3Service } from './web3.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class EnrollmentsService {

  private elements: Enrollment[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service,
    private organisationsService: OrganisationsService,
    private studentsService: StudentsService,
    private subjectsService: SubjectsService) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getAll(): Promise<Enrollment[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getEnrollmentsLength();
    const elementLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementLength) {
      console.log('EnrollmentService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('EnrollmentService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Enrollment> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const enrollmentArray = await contractInstance.enrollments.call(id);
    const element = await this._getEnrollmentFromArray(enrollmentArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The enrollment ID is not correct.');
    }
    return element;
  }

  async create(element: Enrollment): Promise<Enrollment> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.createEnrollment(
      element.subject.id, element.student.id, element.isActive,
        { value: this.web3Service.etherToWei(element.subject.price.toString()), from: this.senderAddress });
    const elementCreated = await this._getEnrollmentFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The enrollment ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('EnrollmentService->create', elementCreated);
    return elementCreated;
  }

  async update(element: Enrollment): Promise<Enrollment> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.updateEnrollment(element.id, element.isActive, { from: this.senderAddress });
    const elementUpdated = await this._getEnrollmentFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The enrollment ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('EnrollmentService->update', elementUpdated);
    return elementUpdated;
  }

  private async _checkCanDo(element: Enrollment): Promise<any> {

    const contractInstance = await this.web3Service.getContractInstance();
    const subject = await this.subjectsService.getOne(element.subject.id);
    if (!subject || !subject.isActive) {
      throw new Error('The subject with ID "' + element.subject.id + '" is not active.');
    }
    if (!subject.period || !subject.period.isActive) {
      throw new Error('The period with ID "' + element.subject.period.id + '" is not active.');
    }
    const student = await this.studentsService.getOne(element.student.id);
    if (!student || !student.isActive) {
      throw new Error('The student with ID "' + element.student.id + '" is not active.');
    }
    if (subject.period.organisation.id.toString() !== student.organisation.id.toString()) {
      throw new Error('The student with ID "' + element.student.id
      + '" and the period with ID "' + element.subject.period.id + '" don\'t belongs to the same organisation.');
    }
    const studentOrganisation = await this.organisationsService.getOne(student.organisation.id);
    if (!studentOrganisation || !studentOrganisation.isActive) {
      throw new Error('The organisation with ID "' + student.organisation.id + '" is not active.');
    }
    return contractInstance;
  }

  private async _getEnrollmentFromArray(array: any): Promise<Enrollment> {

    const element = new Enrollment();
    element.id = array[0];
    element.subject = await this.subjectsService.getOne(array[1]);
    element.student = await this.studentsService.getOne(array[2]);
    element.isActive = array[3];
    element.setString();
    return element;
  }

  private async _getEnrollmentFromTransaction(transaction: any): Promise<Enrollment> {

    const element = new Enrollment();
    element.id = transaction.logs[0].args.enrollmentId;
    element.subject = await this.subjectsService.getOne(transaction.logs[0].args.subjectId);
    element.student = await this.studentsService.getOne(transaction.logs[0].args.studentId);
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

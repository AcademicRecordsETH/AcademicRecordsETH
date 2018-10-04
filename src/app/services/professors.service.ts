import { Injectable } from '@angular/core';
import { Professor } from '../models/professor';
import { Organisation } from '../models/organisation';
import { Web3Service } from './web3.service';
import { OrganisationsService } from './organisations.service';
import { AdministratorsService } from './administrators.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class ProfessorsService {

  private elements: Professor[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service,
    private organisationsService: OrganisationsService,
    private administratorsService: AdministratorsService) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getCurrentUserOrganisationAsProfessor(): Promise<Organisation> {

    return await this.getUserOrganisationAsProfessor(this.senderAddress);
  }

  async getUserOrganisationAsProfessor(userAddress: string): Promise<Organisation> {

    const professor = await this.getUserAsProfessor(userAddress);
    if (!professor || !professor.isActive) {
      console.log('OrganisationService->getUserOrganisationAsProfessor->professor', professor);
      return;
    }
    const organisation = await this.organisationsService.getOne(professor.organisation.id);
    console.log('OrganisationService->getUserOrganisationAsProfessor', organisation);
    return organisation;
  }

  async getCurrentUserAsProfessor(): Promise<Professor> {

    return await this.getUserAsProfessor(this.senderAddress);
  }

  async getUserAsProfessor(userAddress: string): Promise<Professor> {

    const contractInstance = await this.web3Service.getContractInstance();
    const professorId = await contractInstance.professorToProfessorId.call(userAddress);
    if (!professorId || professorId.toString() === '0') {
      console.log('ProfessorsService->getUserAsProfessor->professorId', professorId);
      return;
    }
    const professor = await this.getOne(professorId);
    console.log('ProfessorsService->getUserAsProfessor', professor);
    return professor;
  }

  async getAll(): Promise<Professor[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getProfessorsLength();
    const elementLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementLength) {
      console.log('ProfessorService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('ProfessorService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Professor> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const professorArray = await contractInstance.professors.call(id);
    const element = await this._getProfessorFromArray(professorArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The element ID is not correct.');
    }
    return element;
  }

  async create(element: Professor): Promise<Professor> {

    const contractInstance = await this._checkCanDo(element);
    const newProfessor = await this.getUserAsProfessor(element.professorAddress);
    if (newProfessor) {
      throw new Error('The new professor is already professor of the organisation with ID "' + newProfessor.organisation.id + '".');
    }
    const transaction = await contractInstance.createProfessor(
      element.organisation.id, element.professorAddress, element.isActive, { from: this.senderAddress });
      const elementCreated = await this._getProfessorFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The professor ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('ProfessorService->create', elementCreated);
    return elementCreated;
  }

  async update(element: Professor): Promise<Professor> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.updateProfessor(element.id, element.isActive, { from: this.senderAddress });
    const elementUpdated = await this._getProfessorFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The professor ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('ProfessorService->update', elementUpdated);
    return elementUpdated;
  }

  private async _checkCanDo(element: Professor): Promise<any> {

    if (!this.web3Service.isAddress(element.professorAddress)) {
      throw new Error('The professor address "' + element.professorAddress + '" is not a valid address.');
    }
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

  private async _getProfessorFromArray(array: any): Promise<Professor> {

    const element = new Professor();
    element.id = array[0];
    element.organisation = await this.organisationsService.getOne(array[1]);
    element.professorAddress = array[2];
    element.isActive = array[3];
    element.setString();
    return element;
  }

  private async _getProfessorFromTransaction(transaction: any): Promise<Professor> {

    const element = new Professor();
    element.id = transaction.logs[0].args.professorId;
    element.organisation = await this.organisationsService.getOne(transaction.logs[0].args.organisationId);
    element.professorAddress = transaction.logs[0].args.professorAddress;
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

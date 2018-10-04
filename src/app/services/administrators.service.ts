import { Injectable } from '@angular/core';
import { Administrator } from '../models/administrator';
import { Organisation } from '../models/organisation';
import { Web3Service } from './web3.service';
import { OrganisationsService } from './organisations.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class AdministratorsService {

  private elements: Administrator[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service,
    private organisationsService: OrganisationsService) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getCurrentUserOrganisationAsAdministrator(): Promise<Organisation> {

    return await this.getUserOrganisationAsAdministrator(this.senderAddress);
  }

  async getUserOrganisationAsAdministrator(userAddress: string): Promise<Organisation> {

    const administrator = await this.getUserAsAdministrator(userAddress);
    if (!administrator || !administrator.isActive) {
      console.log('OrganisationService->getUserOrganisationAsAdministrator->administrator', administrator);
      return;
    }
    const organisation = await this.organisationsService.getOne(administrator.organisation.id);
    console.log('OrganisationService->getUserOrganisationAsAdministrator', organisation);
    return organisation;
  }

  async getCurrentUserAsAdministrator(): Promise<Administrator> {

    return await this.getUserAsAdministrator(this.senderAddress);
  }

  async getUserAsAdministrator(userAddress: string): Promise<Administrator> {

    const contractInstance = await this.web3Service.getContractInstance();
    const administratorId = await contractInstance.administratorToAdministratorId.call(userAddress);
    if (!administratorId || administratorId.toString() === '0') {
      console.log('AdministratorsService->getUserAsAdministrator->administratorId', administratorId);
      return;
    }
    const administrator = await this.getOne(administratorId);
    console.log('AdministratorsService->getUserAsAdministrator', administrator);
    return administrator;
  }

  async getAll(): Promise<Administrator[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getAdministratorsLength();
    const elementsLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementsLength) {
      console.log('AdministratorService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementsLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('AdministratorService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Administrator> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const administratorArray = await contractInstance.administrators.call(id);
    const element = await this._getAdministratorFromArray(administratorArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The administrator ID is not correct.');
    }
    return element;
  }

  async create(element: Administrator): Promise<Administrator> {

    const contractInstance = await this._checkCanDo(element);
    const newAdministrator = await this.getUserAsAdministrator(element.administratorAddress);
    if (newAdministrator) {
      throw new Error('The new administrator is already administrator of the organisation with ID '
      + newAdministrator.organisation.id + '".');
    }
    const transaction = await contractInstance.createAdministrator(
      element.organisation.id, element.administratorAddress, element.isActive, { from: this.senderAddress });
    const elementCreated = await this._getAdministratorFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The administrator ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('AdministratorService->create', elementCreated);
    return elementCreated;
  }

  async update(element: Administrator): Promise<Administrator> {

    const contractInstance = await this._checkCanDo(element);
    const transaction = await contractInstance.updateAdministrator(element.id, element.isActive, { from: this.senderAddress });
    const elementUpdated = await this._getAdministratorFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The administrator ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('AdministratorService->update', elementUpdated);
    return elementUpdated;
  }

  private async _checkCanDo(element: Administrator): Promise<any> {

    if (!this.web3Service.isAddress(element.administratorAddress)) {
      throw new Error('The administrator address "' + element.administratorAddress + '" is not a valid address.');
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const ownerOrganisation = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    if (!ownerOrganisation
      || ownerOrganisation.ownerAddress.toLowerCase() !== this.senderAddress.toLowerCase()
      || ownerOrganisation.id.toString() !== element.organisation.id.toString()) {
      throw new Error('The user is not the owner of the organisation with ID "' + element.organisation.id + '".');
    }
    if (!ownerOrganisation.isActive) {
      throw new Error('The organisation with ID "' + element.organisation.id + '" is not active.');
    }
    return contractInstance;
  }

  private async _getAdministratorFromArray(array: any): Promise<Administrator> {

    const element = new Administrator();
    element.id = array[0];
    element.organisation = await this.organisationsService.getOne(array[1]);
    element.administratorAddress = array[2];
    element.isActive = array[3];
    element.setString();
    return element;
  }

  private async _getAdministratorFromTransaction(transaction: any): Promise<Administrator> {

    const element = new Administrator();
    element.id = transaction.logs[0].args.administratorId;
    element.organisation = await this.organisationsService.getOne(transaction.logs[0].args.organisationId);
    element.administratorAddress = transaction.logs[0].args.administratorAddress;
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

import { Injectable } from '@angular/core';
import { Organisation } from '../models/organisation';
import { Web3Service } from './web3.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class OrganisationsService {

  private elements: Organisation[] = [];
  private senderAddress: string;

  constructor(
    private web3Service: Web3Service) {

    this.senderAddress = StorageUtil.getUserAddress();
  }

  async getCurrentUserOrganisationAsOwner(): Promise<Organisation> {

    return await this.getUserOrganisationAsOwner(this.senderAddress);
  }

  async getUserOrganisationAsOwner(userAddress: string): Promise<Organisation> {

    const contractInstance = await this.web3Service.getContractInstance();
    const organisationId = await contractInstance.ownerToOrganizationId.call(userAddress);
    if (!organisationId || organisationId.toString() === '0') {
      console.log('OrganisationService->getUserOrganisationAsOwner->organisationId', organisationId);
      return;
    }
    const organisation = await this.getOne(organisationId);
    console.log('OrganisationService->getUserOrganisationAsOwner', organisation);
    return organisation;
  }

  async getAll(): Promise<Organisation[]> {

    const contractInstance = await this.web3Service.getContractInstance();
    const lengthBigNumber = await contractInstance.getOrganisationsLength();
    const elementLength = lengthBigNumber.toString() * 1;
    if (this.elements.length + 1 === elementLength) {
      console.log('OrganisationService->getAll->old', this.elements);
      return this.elements;
    }
    const elements = [];
    for (let index = 1; index < elementLength; index++) {
      const element = await this.getOne(index);
      elements.push(element);
    }
    this.elements = elements;
    console.log('OrganisationService->getAll->new', this.elements);
    return this.elements;
  }

  async getOne(id: number): Promise<Organisation> {

    const oldElement = this.elements[id - 1];
    if (oldElement) {
      return oldElement;
    }
    const contractInstance = await this.web3Service.getContractInstance();
    const organisationArray = await contractInstance.organisations.call(id);
    const element = this._getOrganisationFromArray(organisationArray);
    if (!element.id
      || element.id.toString() === '0'
      || element.id.toString() !== id.toString()) {
      throw new Error('The organisation ID is not correct.');
    }
    return element;
  }

  async create(element: Organisation): Promise<Organisation> {

    const contractInstance = await this.web3Service.getContractInstance();
    const ownerOrganisation = await this.getCurrentUserOrganisationAsOwner();
    if (ownerOrganisation) {
      throw new Error('The user is already the owner of the organisation with ID "' + ownerOrganisation.id + '".');
    }
    const transaction = await contractInstance.createOrganisation(element.name, element.isActive, { from: this.senderAddress });
    const elementCreated = this._getOrganisationFromTransaction(transaction);
    if (!elementCreated.id
      || elementCreated.id.toString() === '0') {
      throw new Error('The organisation ID is not correct.');
    }
    this.elements.push(elementCreated);
    console.log('OrganisationService->create', elementCreated);
    return elementCreated;
  }

  async updateOwner(element: Organisation): Promise<Organisation> {

    const contractInstance = await this.web3Service.getContractInstance();
    const ownerOrganisation = await this.getCurrentUserOrganisationAsOwner();
    if (!ownerOrganisation
      || ownerOrganisation.id.toString() !== element.id.toString()) {
      throw new Error('The user is not the owner of the organisation with ID "' + element.id + '".');
    }
    if (!this.web3Service.isAddress(element.ownerAddress)) {
      throw new Error('The new owner address "' + element.ownerAddress + '" is not a valid address.');
    }
    const newOwnerOrganisation = await this.getUserOrganisationAsOwner(element.ownerAddress);
    if (newOwnerOrganisation
      && newOwnerOrganisation.ownerAddress === element.ownerAddress) {
      throw new Error('The new owner is already the owner of the organisation with ID "' + newOwnerOrganisation.id + '".');
    }
    const transaction = await contractInstance.updateOrganisationOwner(element.id, element.ownerAddress,
      { from: this.senderAddress });
    const elementUpdated = this._getOrganisationFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The organisation ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('OrganisationService->updateOwner', elementUpdated);
    return elementUpdated;
  }

  async updateState(element: Organisation): Promise<Organisation> {

    const contractInstance = await this.web3Service.getContractInstance();
    const ownerOrganisation = await this.getCurrentUserOrganisationAsOwner();
    if (!ownerOrganisation
      || ownerOrganisation.ownerAddress.toLowerCase() !== element.ownerAddress.toLowerCase()
      || ownerOrganisation.id.toString() !== element.id.toString()) {
      throw new Error('The user is not the owner of the organisation with ID "' + element.id + '".');
    }
    const transaction = await contractInstance.updateOrganisationState(element.id, element.isActive,
      { from: this.senderAddress });
    const elementUpdated = this._getOrganisationFromTransaction(transaction);
    if (!elementUpdated.id
      || elementUpdated.id.toString() === '0'
      || elementUpdated.id.toString() !== element.id.toString()) {
      throw new Error('The organisation ID is not correct.');
    }
    this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
    console.log('OrganisationService->updateState', elementUpdated);
    return elementUpdated;
  }

  private _getOrganisationFromArray(array: any): Organisation {

    const element = new Organisation();
    element.id = array[0];
    element.ownerAddress = array[1];
    element.name = array[2];
    element.isActive = array[3];
    element.setString();
    return element;
  }

  private _getOrganisationFromTransaction(transaction: any): Organisation {

    const element = new Organisation();
    element.id = transaction.logs[0].args.organisationId;
    element.ownerAddress = transaction.logs[0].args.owner;
    element.name = transaction.logs[0].args.name;
    element.isActive = transaction.logs[0].args.isActive;
    element.setString();
    return element;
  }
}

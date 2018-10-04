import { Injectable } from '@angular/core';
import { Teaching } from '../models/teaching';
import { AdministratorsService } from './administrators.service';
import { OrganisationsService } from './organisations.service';
import { ProfessorsService } from './professors.service';
import { SubjectsService } from './subjects.service';
import { Web3Service } from './web3.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class TeachingsService {

    private elements: Teaching[] = [];
    private senderAddress: string;

    constructor(
        private web3Service: Web3Service,
        private administratorsService: AdministratorsService,
        private organisationsService: OrganisationsService,
        private professorsService: ProfessorsService,
        private subjectsService: SubjectsService) {

        this.senderAddress = StorageUtil.getUserAddress();
    }

    async getAll(): Promise<Teaching[]> {

        const contractInstance = await this.web3Service.getContractInstance();
        const lengthBigNumber = await contractInstance.getTeachingsLength();
        const elementLength = lengthBigNumber.toString() * 1;
        if (this.elements.length + 1 === elementLength) {
            console.log('TeachingService->getAll->old', this.elements);
            return this.elements;
        }
        const elements = [];
        for (let index = 1; index < elementLength; index++) {
            const element = await this.getOne(index);
            elements.push(element);
        }
        this.elements = elements;
        console.log('TeachingService->getAll->new', this.elements);
        return this.elements;
    }

    async getOne(id: number): Promise<Teaching> {

        const oldElement = this.elements[id - 1];
        if (oldElement) {
            return oldElement;
        }
        const contractInstance = await this.web3Service.getContractInstance();
        const teachingArray = await contractInstance.teachings.call(id);
        const element = await this._getTeachingFromArray(teachingArray);
        if (!element.id
            || element.id.toString() === '0'
            || element.id.toString() !== id.toString()) {
            throw new Error('The teaching ID is not correct.');
        }
        return element;
    }

    async create(element: Teaching): Promise<Teaching> {

        const contractInstance = await this._checkCanDo(element);
        const transaction = await contractInstance.createTeaching(
            element.subject.id, element.professor.id, element.isActive, { from: this.senderAddress });
        const elementCreated = await this._getTeachingFromTransaction(transaction);
        if (!elementCreated.id
            || elementCreated.id.toString() === '0') {
            throw new Error('The teaching ID is not correct.');
        }
        this.elements.push(elementCreated);
        console.log('TeachingService->create', elementCreated);
        return elementCreated;
    }

    async update(element: Teaching): Promise<Teaching> {

        const contractInstance = await this._checkCanDo(element);
        const transaction = await contractInstance.updateTeaching(element.id, element.isActive, { from: this.senderAddress });
        const elementUpdated = await this._getTeachingFromTransaction(transaction);
        if (!elementUpdated.id
            || elementUpdated.id.toString() === '0'
            || elementUpdated.id.toString() !== element.id.toString()) {
            throw new Error('The teaching ID is not correct.');
        }
        this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
        console.log('TeachingService->update', elementUpdated);
        return elementUpdated;
    }

    private async _checkCanDo(element: Teaching): Promise<any> {

        const contractInstance = await this.web3Service.getContractInstance();
        const subject = await this.subjectsService.getOne(element.subject.id);
        if (!subject || !subject.isActive) {
            throw new Error('The subject with ID "' + element.subject.id + '" is not active.');
        }
        if (!subject.period || !subject.period.isActive) {
            throw new Error('The period with ID "' + element.subject.period.id + '" is not active.');
        }
        const professor = await this.professorsService.getOne(element.professor.id);
        if (!professor || !professor.isActive) {
            throw new Error('The professor with ID "' + element.professor.id + '" is not active.');
        }
        if (subject.period.organisation.id.toString() !== professor.organisation.id.toString()) {
            throw new Error('The professor with ID "' + element.professor.id
                + '" and the period with ID "' + element.subject.period.id + '" don\'t belongs to the same organisation.');
        }

        const administratorId = await contractInstance.administratorToAdministratorId.call(this.senderAddress);
        if (!administratorId || administratorId.toString() === '0') {
            throw new Error('The user is not an administrator of the organisation with ID "' + professor.organisation.id + '".');
        }
        const administrator = await this.administratorsService.getOne(administratorId);
        if (!administrator || !administrator.isActive) {
            throw new Error('The administrator with ID "' + administrator.id + '" is not active.');
        }
        const administratorOrganisation = await this.organisationsService.getOne(administrator.organisation.id);
        if (!administratorOrganisation
            || administratorOrganisation.id.toString() !== professor.organisation.id.toString()) {
            throw new Error('The user is not an administrator of the organisation with ID "' + professor.organisation.id + '".');
        }
        if (!administratorOrganisation.isActive) {
            throw new Error('The organisation with ID "' + professor.organisation.id + '" is not active.');
        }
        return contractInstance;
    }

    private async _getTeachingFromArray(array: any): Promise<Teaching> {

        const element = new Teaching();
        element.id = array[0];
        element.subject = await this.subjectsService.getOne(array[1]);
        element.professor = await this.professorsService.getOne(array[2]);
        element.isActive = array[3];
        element.setString();
        return element;
    }

    private async _getTeachingFromTransaction(transaction: any): Promise<Teaching> {

        const element = new Teaching();
        element.id = transaction.logs[0].args.teachingId;
        element.subject = await this.subjectsService.getOne(transaction.logs[0].args.subjectId);
        element.professor = await this.professorsService.getOne(transaction.logs[0].args.professorId);
        element.isActive = transaction.logs[0].args.isActive;
        element.setString();
        return element;
    }
}

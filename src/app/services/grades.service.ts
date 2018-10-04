import { Injectable } from '@angular/core';
import { Grade } from '../models/grade';
import { AdministratorsService } from './administrators.service';
import { EnrollmentsService } from './enrollments.service';
import { OrganisationsService } from './organisations.service';
import { ProfessorsService } from './professors.service';
import { SubjectsService } from './subjects.service';
import { Web3Service } from './web3.service';
import { ArrayUtil } from '../util/array.util';
import { StorageUtil } from '../util/storage.util';

@Injectable()
export class GradesService {

    private elements: Grade[] = [];
    private senderAddress: string;

    constructor(
        private web3Service: Web3Service,
        private administratorsService: AdministratorsService,
        private enrollmentsService: EnrollmentsService,
        private organisationsService: OrganisationsService,
        private professorsService: ProfessorsService,
        private subjectsService: SubjectsService) {

        this.senderAddress = StorageUtil.getUserAddress();
    }

    async getAll(): Promise<Grade[]> {

        const contractInstance = await this.web3Service.getContractInstance();
        const lengthBigNumber = await contractInstance.getGradesLength();
        const elementLength = lengthBigNumber.toString() * 1;
        if (this.elements.length + 1 === elementLength) {
            console.log('GradeService->getAll->old', this.elements);
            return this.elements;
        }
        const elements = [];
        for (let index = 1; index < elementLength; index++) {
            const element = await this.getOne(index);
            elements.push(element);
        }
        this.elements = elements;
        console.log('GradeService->getAll->new', this.elements);
        return this.elements;
    }

    async getOne(id: number): Promise<Grade> {

        const oldElement = this.elements[id - 1];
        if (oldElement) {
            return oldElement;
        }
        const contractInstance = await this.web3Service.getContractInstance();
        const gradeArray = await contractInstance.grades.call(id);
        const element = await this._getGradeFromArray(gradeArray);
        if (!element.id
            || element.id.toString() === '0'
            || element.id.toString() !== id.toString()) {
            throw new Error('The grade ID is not correct.');
        }
        return element;
    }

    async create(element: Grade): Promise<Grade> {

        const contractInstance = await this._checkCanDo(element);
        const transaction = await contractInstance.createGrade(
            element.enrollment.id, element.grade, element.isActive, { from: this.senderAddress });
        const elementCreated = await this._getGradeFromTransaction(transaction);
        if (!elementCreated.id
            || elementCreated.id.toString() === '0') {
            throw new Error('The grade ID is not correct.');
        }
        this.elements.push(elementCreated);
        console.log('GradeService->create', elementCreated);
        return elementCreated;
    }

    async update(element: Grade): Promise<Grade> {

        const contractInstance = await this._checkCanDo(element);
        const transaction = await contractInstance.updateGrade(element.id, element.isActive, { from: this.senderAddress });
        const elementUpdated = await this._getGradeFromTransaction(transaction);
        if (!elementUpdated.id
            || elementUpdated.id.toString() === '0'
            || elementUpdated.id.toString() !== element.id.toString()) {
            throw new Error('The grade ID is not correct.');
        }
        this.elements = ArrayUtil.updateArray(this.elements, elementUpdated);
        console.log('GradeService->update', elementUpdated);
        return elementUpdated;
    }

    private async _checkCanDo(element: Grade): Promise<any> {

        const contractInstance = await this.web3Service.getContractInstance();
        const enrollment = await this.enrollmentsService.getOne(element.enrollment.id);
        if (!enrollment || !enrollment.isActive) {
            throw new Error('The enrollment with ID "' + element.enrollment.id + '" is not active.');
        }
        if (!enrollment.subject || !enrollment.subject.isActive) {
            throw new Error('The subject with ID "' + element.enrollment.subject.id + '" is not active.');
        }
        if (!enrollment.subject.period || !enrollment.subject.period.isActive) {
            throw new Error('The period with ID "' + element.enrollment.subject.period.id + '" is not active.');
        }
        const professor = await this.professorsService.getOne(element.professor.id);
        if (!professor || !professor.isActive) {
            throw new Error('The professor with ID "' + element.professor.id + '" is not active.');
        }
        if (enrollment.subject.period.organisation.id.toString() !== professor.organisation.id.toString()) {
            throw new Error('The professor with ID "' + element.professor.id
                + '" and the period with ID "' + element.enrollment.subject.period.id + '" don\'t belongs to the same organisation.');
        }
        const professorId = await contractInstance.professorToProfessorId.call(this.senderAddress);
        if (!professorId || professorId.toString() === '0' || professorId.toString() !== professor.id.toString()) {
            throw new Error('The user is not a professor of the organisation with ID "' + professor.organisation.id + '".');
        }
        if (!professor.organisation
            || professor.organisation.id.toString() !== element.professor.organisation.id.toString()) {
            throw new Error('The user is not an professor of the organisation with ID "' + professor.organisation.id + '".');
        }
        if (!professor.organisation.isActive) {
            throw new Error('The organisation with ID "' + professor.organisation.id + '" is not active.');
        }
        return contractInstance;
    }

    private async _getGradeFromArray(array: any): Promise<Grade> {

        const element = new Grade();
        element.id = array[0];
        element.professor = await this.professorsService.getOne(array[1]);
        element.enrollment = await this.enrollmentsService.getOne(array[2]);
        element.grade = array[3];
        element.isActive = array[4];
        element.setString();
        return element;
    }

    private async _getGradeFromTransaction(transaction: any): Promise<Grade> {

        const element = new Grade();
        element.id = transaction.logs[0].args.gradeId;
        element.professor = await this.professorsService.getOne(transaction.logs[0].args.professorId);
        element.enrollment = await this.enrollmentsService.getOne(transaction.logs[0].args.enrollmentId);
        element.grade = transaction.logs[0].args.grade;
        element.isActive = transaction.logs[0].args.isActive;
        element.setString();
        return element;
    }
}

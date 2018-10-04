import { Component, OnInit } from '@angular/core';
import { Enrollment } from '../../models/enrollment';
import { Organisation } from '../../models/organisation';
import { Period } from '../../models/period';
import { Subject } from '../../models/subject';
import { Student } from '../../models/student';
import { EnrollmentsService } from '../../services/enrollments.service';
import { OrganisationsService } from '../../services/organisations.service';
import { PeriodsService } from '../../services/periods.service';
import { SubjectsService } from '../../services/subjects.service';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-enrollment-new',
  templateUrl: './enrollment-new.component.html'
})
export class EnrollmentNewComponent implements OnInit {

  enrollment = new Enrollment();
  organisations: Organisation[] = [];
  organisationSelected: Organisation;
  periodsAll: Period[] = [];
  periodSelected: Period;
  periods: Period[] = [];
  subjectsAll: Subject[] = [];
  subjects: Subject[] = [];
  studentsAll: Student[] = [];
  students: Student[] = [];
  isLoadingOrganisations = true;
  isLoadingPeriods = true;
  isLoadingSubjects = true;
  isLoadingStudents = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private organisationsService: OrganisationsService,
    private periodsService: PeriodsService,
    private subjectsService: SubjectsService,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService) {

  }

  isLoading(): boolean {
    return this.isLoadingOrganisations
      || this.isLoadingPeriods
      || this.isLoadingSubjects
      || this.isLoadingStudents;
  }

  ngOnInit() {

    this._loadOrganisations().catch(error => this.error = error);
    this._loadPeriods().catch(error => this.error = error);
    this._loadSubjects().catch(error => this.error = error);
    this._loadStudents().catch(error => this.error = error);
    this.enrollment.isActive = true;
  }

  private async _loadOrganisations(): Promise<void> {

    const organisations = await this.organisationsService.getAll();
    for (let index = 0; index < organisations.length; index++) {
      if (organisations[index].isActive) {
        this.organisations.push(organisations[index]);
      }
    }
    this.isLoadingOrganisations = false;
  }

  private async _loadPeriods(): Promise<void> {

    const periods = await this.periodsService.getAll();
    for (let index = 0; index < periods.length; index++) {
      if (periods[index].isActive) {
        this.periods.push(periods[index]);
      }
    }
    this.periodsAll = this.periods;
    this.isLoadingPeriods = false;
  }

  private async _loadSubjects(): Promise<void> {

    const subjects = await this.subjectsService.getAll();
    for (let index = 0; index < subjects.length; index++) {
      if (subjects[index].isActive) {
        this.subjects.push(subjects[index]);
      }
    }
    this.subjectsAll = this.subjects;
    this.isLoadingSubjects = false;
  }

  private async _loadStudents(): Promise<void> {

    const students = await this.studentsService.getAll();
    for (let index = 0; index < students.length; index++) {
      if (students[index].isActive) {
        this.students.push(students[index]);
      }
    }
    this.studentsAll = this.students;
    this.isLoadingStudents = false;
  }

  reloadArrays() {

    console.log('reloadArrays');

    let organisationSelectedId: number;
    if (this.organisationSelected) {
      organisationSelectedId = this.organisationSelected.id;
    }
    if (this.periodSelected) {
      organisationSelectedId = this.periodSelected.organisation.id;
    }

    if (!organisationSelectedId) {

      this.periods = this.periodsAll;
      this.subjects = this.subjectsAll;
      this.students = this.studentsAll;

    } else {

      const periods: Period[] = [];
      for (let index = 0; index < this.periodsAll.length; index++) {
        if (organisationSelectedId.toString() === this.periodsAll[index].organisation.id.toString()) {
          periods.push(this.periodsAll[index]);
        }
      }
      this.periods = periods;

      const subjects: Subject[] = [];
      for (let index = 0; index < this.subjectsAll.length; index++) {
        if ( (this.periodSelected && this.periodSelected.id.toString() === this.subjectsAll[index].period.id.toString())
          || (!this.periodSelected && organisationSelectedId.toString() === this.subjectsAll[index].period.organisation.id.toString()) ) {
            subjects.push(this.subjectsAll[index]);
        }
      }
      this.subjects = subjects;

      const students: Student[] = [];
      for (let index = 0; index < this.studentsAll.length; index++) {
        if (organisationSelectedId.toString() === this.studentsAll[index].organisation.id.toString()) {
          students.push(this.studentsAll[index]);
        }
      }
      this.students = students;
    }
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.enrollment.subject && this.enrollment.student && !this.isCreating) {
      this.isCreating = true;
      this.enrollment = await this.enrollmentsService.create(this.enrollment);
      this.message = 'Created enrollment with ID "' + this.enrollment.id + '".';
      this.isCreating = false;
    }
  }
}

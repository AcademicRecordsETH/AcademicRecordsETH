import { Component, OnInit } from '@angular/core';
import { Enrollment } from '../../models/enrollment';
import { Grade } from '../../models/grade';
import { Organisation } from '../../models/organisation';
import { Period } from '../../models/period';
import { Professor } from '../../models/professor';
import { Subject } from '../../models/subject';
import { Teaching } from '../../models/teaching';
import { GradesService } from '../../services/grades.service';
import { PeriodsService } from '../../services/periods.service';
import { ProfessorsService } from '../../services/professors.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { TeachingsService } from '../../services/teachings.service';

@Component({
  selector: 'app-grade-new',
  templateUrl: './grade-new.component.html'
})
export class GradeNewComponent implements OnInit {

  grade = new Grade();
  organisation: Organisation;
  periodsAll: Period[] = [];
  periodSelected: Period;
  periods: Period[] = [];
  teachingsAll: Teaching[] = [];
  teachingSelected: Teaching;
  teachings: Teaching[] = [];
  enrollmentsAll: Enrollment[] = [];
  enrollments: Enrollment[] = [];
  isLoadingPeriods = true;
  isLoadingTeachings = true;
  isLoadingEnrollments = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private erollmentsService: EnrollmentsService,
    private gradesService: GradesService,
    private periodsService: PeriodsService,
    private professorsService: ProfessorsService,
    private teachingsService: TeachingsService) {

  }

  isLoading(): boolean {
    return this.isLoadingPeriods
      || this.isLoadingTeachings
      || this.isLoadingEnrollments;
  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.professorsService.getCurrentUserOrganisationAsProfessor();
    if (!this.organisation) {
      throw new Error('The user is not a professor or is not active.');
    }
    if (!this.organisation.isActive) {
      throw new Error('The organisation with ID "' + this.organisation.id + '" is not active.');
    }
    const professor: Professor = await this.professorsService.getCurrentUserAsProfessor();
    this.grade.professor = professor;
    this.grade.isActive = true;
    this._loadPeriods().catch(error => this.error = error);
    this._loadTeachings().catch(error => this.error = error);
    this._loadEnrollments().catch(error => this.error = error);
  }

  private async _loadPeriods(): Promise<void> {

    const periods = await this.periodsService.getAll();
    for (let index = 0; index < periods.length; index++) {
      if (this.organisation
        && this.organisation.id.toString() === periods[index].organisation.id.toString()
        && periods[index].isActive) {
        this.periods.push(periods[index]);
      }
    }
    this.periodsAll = this.periods;
    this.isLoadingPeriods = false;
  }

  private async _loadTeachings(): Promise<void> {

    const teachings = await this.teachingsService.getAll();
    for (let index = 0; index < teachings.length; index++) {
      if (this.grade.professor
        && this.grade.professor.id.toString() === teachings[index].professor.id.toString()
        && teachings[index].isActive
        && teachings[index].subject.isActive
        && teachings[index].subject.period.isActive) {
        this.teachings.push(teachings[index]);
      }
    }
    this.teachingsAll = this.teachings;
    this.isLoadingTeachings = false;
  }

  private async _loadEnrollments(): Promise<void> {

    const enrollments = await this.erollmentsService.getAll();
    for (let index = 0; index < enrollments.length; index++) {
      if (this.organisation
        && this.organisation.id.toString() === enrollments[index].student.organisation.id.toString()
        && enrollments[index].isActive
        && enrollments[index].student.isActive
        && enrollments[index].subject.isActive
        && enrollments[index].subject.period.isActive) {
        this.enrollments.push(enrollments[index]);
      }
    }
    this.enrollmentsAll = this.enrollments;
    this.isLoadingEnrollments = false;
  }

  reloadArrays() {

    console.log('reloadArrays');

    this.teachings = this.teachingsAll;
    this.enrollments = this.enrollmentsAll;

    if (this.periodSelected) {

      const teachings: Teaching[] = [];
      for (let index = 0; index < this.teachingsAll.length; index++) {
        if (this.periodSelected.id.toString() === this.teachingsAll[index].subject.period.id.toString()) {
          teachings.push(this.teachingsAll[index]);
        }
      }
      this.teachings = teachings;

      const enrollments: Enrollment[] = [];
      for (let index = 0; index < this.enrollmentsAll.length; index++) {
        if (this.periodSelected.id.toString() === this.enrollmentsAll[index].subject.period.id.toString()) {
          enrollments.push(this.enrollmentsAll[index]);
        }
      }
      this.enrollments = enrollments;
    }

    if (this.teachingSelected) {

      const enrollments: Enrollment[] = [];
      for (let index = 0; index < this.enrollments.length; index++) {
        if (this.teachingSelected.subject.id.toString() === this.enrollments[index].subject.id.toString()) {
          enrollments.push(this.enrollments[index]);
        }
      }
      this.enrollments = enrollments;
    }
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.grade.professor && this.grade.enrollment && this.grade.grade && !this.isCreating) {
      this.isCreating = true;
      this.grade = await this.gradesService.create(this.grade);
      this.message = 'Created grade with ID "' + this.grade.id + '".';
      this.isCreating = false;
    }
  }
}

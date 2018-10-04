import { Component, OnInit } from '@angular/core';
import { Teaching } from '../../models/teaching';
import { Organisation } from '../../models/organisation';
import { Period } from '../../models/period';
import { Professor } from '../../models/professor';
import { Subject } from '../../models/subject';
import { AdministratorsService } from '../../services/administrators.service';
import { TeachingsService } from '../../services/teachings.service';
import { PeriodsService } from '../../services/periods.service';
import { ProfessorsService } from '../../services/professors.service';
import { SubjectsService } from '../../services/subjects.service';

@Component({
  selector: 'app-teaching-new',
  templateUrl: './teaching-new.component.html'
})
export class TeachingNewComponent implements OnInit {

  teaching = new Teaching();
  organisation: Organisation;
  periodsAll: Period[] = [];
  periodSelected: Period;
  periods: Period[] = [];
  subjectsAll: Subject[] = [];
  subjects: Subject[] = [];
  professorsAll: Professor[] = [];
  professors: Professor[] = [];
  isLoadingPeriods = true;
  isLoadingSubjects = true;
  isLoadingProfessors = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private administratorsService: AdministratorsService,
    private periodsService: PeriodsService,
    private subjectsService: SubjectsService,
    private professorsService: ProfessorsService,
    private teachingsService: TeachingsService) {

  }

  isLoading(): boolean {
    return this.isLoadingPeriods
      || this.isLoadingSubjects
      || this.isLoadingProfessors;
  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!this.organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    if (!this.organisation.isActive) {
      throw new Error('The organisation with ID "' + this.organisation.id + '" is not active.');
    }
    this._loadPeriods().catch(error => this.error = error);
    this._loadSubjects().catch(error => this.error = error);
    this._loadProfessors().catch(error => this.error = error);
    this.teaching.isActive = true;
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

  private async _loadSubjects(): Promise<void> {

    const subjects = await this.subjectsService.getAll();
    for (let index = 0; index < subjects.length; index++) {
      if (this.organisation
        && this.organisation.id.toString() === subjects[index].period.organisation.id.toString()
        && subjects[index].isActive) {
        this.subjects.push(subjects[index]);
      }
    }
    this.subjectsAll = this.subjects;
    this.isLoadingSubjects = false;
  }

  private async _loadProfessors(): Promise<void> {

    const professors = await this.professorsService.getAll();
    for (let index = 0; index < professors.length; index++) {
      if (this.organisation
        && this.organisation.id.toString() === professors[index].organisation.id.toString()
        && professors[index].isActive) {
        this.professors.push(professors[index]);
      }
    }
    this.professorsAll = this.professors;
    this.isLoadingProfessors = false;
  }

  reloadArrays() {

    console.log('reloadArrays');

    if (!this.periodSelected) {

      this.subjects = this.subjectsAll;

    } else {

      const subjects: Subject[] = [];
      for (let index = 0; index < this.subjectsAll.length; index++) {
        if (this.periodSelected.id.toString() === this.subjectsAll[index].period.id.toString()) {
          subjects.push(this.subjectsAll[index]);
        }
      }
      this.subjects = subjects;
    }
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.teaching.subject && this.teaching.professor && !this.isCreating) {
      this.isCreating = true;
      this.teaching = await this.teachingsService.create(this.teaching);
      this.message = 'Created teaching with ID "' + this.teaching.id + '".';
      this.isCreating = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Period } from '../../models/period';
import { PeriodsService } from '../../services/periods.service';
import { Subject } from '../../models/subject';
import { SubjectsService } from '../../services/subjects.service';

@Component({
  selector: 'app-subject-new',
  templateUrl: './subject-new.component.html'
})
export class SubjectNewComponent implements OnInit {

  organisation: Organisation;
  subject = new Subject();
  periods: Period[] = [];
  isLoading = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private administratorsService: AdministratorsService,
    private periodsService: PeriodsService,
    private subjectsService: SubjectsService) {

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
    const periods: Period[] = await this.periodsService.getAll();
    for (let index = 0; index < periods.length; index++) {
      if (this.organisation.id.toString() === periods[index].organisation.id.toString()
        && periods[index].isActive) {
        this.periods.push(periods[index]);
      }
    }
    this.subject.isActive = true;
    this.isLoading = false;
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.subject.period && this.subject.name && this.subject.price && !this.isCreating) {
      this.isCreating = true;
      this.subject = await this.subjectsService.create(this.subject);
      this.message = 'Created subject with ID "' + this.subject.id + '".';
      this.isCreating = false;
    }
  }
}

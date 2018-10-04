import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Subject } from '../../models/subject';
import { SubjectsService } from '../../services/subjects.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html'
})
export class SubjectsComponent implements OnInit {

  organisation: Organisation;
  organisationSubjects: Subject[] = [];
  otherSubjects: Subject[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingSubjects = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private subjectsService: SubjectsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (this.organisation && this.organisation.isActive) {
      this.canCreate = true;
    }
    this.isLoadingOrganisation = false;

    const subjects = await this.subjectsService.getAll();
    for (let index = 0; index < subjects.length; index++) {
      const subject = subjects[index];
      if (this.organisation && this.organisation.id.toString() === subject.period.organisation.id.toString()) {
        this.organisationSubjects.push(subject);
      } else {
        this.otherSubjects.push(subject);
      }
    }
    this.isLoadingSubjects = false;
  }
}

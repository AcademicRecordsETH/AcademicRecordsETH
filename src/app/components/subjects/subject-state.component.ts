import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Subject } from '../../models/subject';
import { SubjectsService } from '../../services/subjects.service';

@Component({
  selector: 'app-subject-state',
  templateUrl: './subject-state.component.html'
})
export class SubjectStateComponent implements OnInit {

  subject = new Subject();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private administratorsService: AdministratorsService,
    private subjectsService: SubjectsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    const subjectId: number = +this.route.snapshot.paramMap.get('subjectId');
    this.subject = await this.subjectsService.getOne(subjectId);
    if (this.subject.period.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.subject.period.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    this.originalState = this.subject.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.subject.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.subject.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.subject = await this.subjectsService.update(this.subject);
      this.message = 'Updated the state of the subject with ID "' + this.subject.id + '".';
      this.isUpdating = false;
    }
  }
}

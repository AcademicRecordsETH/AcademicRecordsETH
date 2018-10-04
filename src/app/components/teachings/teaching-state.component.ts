import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Teaching } from '../../models/teaching';
import { TeachingsService } from '../../services/teachings.service';

@Component({
  selector: 'app-teaching-state',
  templateUrl: './teaching-state.component.html'
})
export class TeachingStateComponent implements OnInit {

  teaching = new Teaching();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private administratorsService: AdministratorsService,
    private teachingsService: TeachingsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    const teachingId: number = +this.route.snapshot.paramMap.get('teachingId');
    this.teaching = await this.teachingsService.getOne(teachingId);
    if (this.teaching.professor.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.teaching.professor.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    if (!this.teaching.professor.isActive) {
      throw new Error('The professor with ID "' + this.teaching.professor.id + '" is not active.');
    }
    if (!this.teaching.subject.isActive) {
      throw new Error('The subject with ID "' + this.teaching.subject.id + '" is not active.');
    }
    if (!this.teaching.subject.period.isActive) {
      throw new Error('The period with ID "' + this.teaching.subject.period.id + '" is not active.');
    }
    this.originalState = this.teaching.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.teaching.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.teaching.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.teaching = await this.teachingsService.update(this.teaching);
      this.message = 'Updated the state of the teaching with ID "' + this.teaching.id + '".';
      this.isUpdating = false;
    }
  }
}

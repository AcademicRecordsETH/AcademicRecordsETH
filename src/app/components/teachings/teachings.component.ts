import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Teaching } from '../../models/teaching';
import { TeachingsService } from '../../services/teachings.service';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-teachings',
  templateUrl: './teachings.component.html'
})
export class TeachingsComponent implements OnInit {

  organisation: Organisation;
  organisationTeachings: Teaching[] = [];
  otherTeachings: Teaching[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingTeachings = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private teachingsService: TeachingsService) {

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

    const teachings = await this.teachingsService.getAll();
    for (let index = 0; index < teachings.length; index++) {
      const teaching = teachings[index];
      if (this.organisation && this.organisation.id.toString() === teaching.professor.organisation.id.toString()) {
        this.organisationTeachings.push(teaching);
      } else {
        this.otherTeachings.push(teaching);
      }
    }
    this.isLoadingTeachings = false;
  }
}

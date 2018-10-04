import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';
import { Period } from '../../models/period';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html'
})
export class PeriodsComponent implements OnInit {

  organisation: Organisation;
  organisationPeriods: Period[] = [];
  otherPeriods: Period[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingPeriods = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private organisationsService: OrganisationsService,
    private periodsService: PeriodsService) {

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

    const periods = await this.periodsService.getAll();
    for (let index = 0; index < periods.length; index++) {
      if (this.organisation && this.organisation.id.toString() === periods[index].organisation.id.toString()) {
        this.organisationPeriods.push(periods[index]);
      } else {
        this.otherPeriods.push(periods[index]);
      }
    }
    this.isLoadingPeriods = false;
  }
}

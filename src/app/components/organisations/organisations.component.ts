import { Component, OnInit, ViewChild } from '@angular/core';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html'
})
export class OrganisationsComponent implements OnInit {

  organisation: Organisation;
  organisations: Organisation[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingOrganisations = true;
  error = '';

  constructor(
    private organisationsService: OrganisationsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    if (!this.organisation) {
      this.canCreate = true;
    }
    this.isLoadingOrganisation = false;

    const organisations = await this.organisationsService.getAll();
    for (let index = 0; index < organisations.length; index++) {
      if (!this.organisation || this.organisation.id.toString() !== organisations[index].id.toString()) {
        this.organisations.push(organisations[index]);
      }
    }
    this.isLoadingOrganisations = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { Administrator } from '../../models/administrator';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html'
})
export class AdministratorsComponent implements OnInit {

  organisation: Organisation;
  organisationAdministrators: Administrator[] = [];
  otherAdministrators: Administrator[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingAdministrators = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private organisationsService: OrganisationsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    if (this.organisation && this.organisation.isActive) {
      this.canCreate = true;
    }
    this.isLoadingOrganisation = false;

    const administrators: Administrator[] = await this.administratorsService.getAll();
    for (let index = 0; index < administrators.length; index++) {
      if (this.organisation && this.organisation.id.toString() === administrators[index].organisation.id.toString()) {
        this.organisationAdministrators.push(administrators[index]);
      } else {
        this.otherAdministrators.push(administrators[index]);
      }
    }
    this.isLoadingAdministrators = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { Administrator } from '../../models/administrator';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-administrator-new',
  templateUrl: './administrator-new.component.html'
})
export class AdministratorNewComponent implements OnInit {

  administrator = new Administrator();
  isLoading = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private administratorsService: AdministratorsService,
    private organisationsService: OrganisationsService) { }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    if (!organisation) {
      throw new Error('The user is not an organisation owner.');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    this.administrator.organisation = organisation;
    this.administrator.isActive = true;
    this.isLoading = false;
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.administrator.organisation.id && this.administrator.administratorAddress && !this.isCreating) {
      this.isCreating = true;
      this.administrator = await this.administratorsService.create(this.administrator);
      this.message = 'Created administrator with ID "' + this.administrator.id + '".';
      this.isCreating = false;
    }
  }

}

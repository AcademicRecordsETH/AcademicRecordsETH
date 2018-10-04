import { Component, OnInit } from '@angular/core';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';
import { StorageUtil } from '../../util/storage.util';

@Component({
  selector: 'app-organisation-new',
  templateUrl: './organisation-new.component.html'
})
export class OrganisationNewComponent implements OnInit {

  organisation = new Organisation();
  isLoading = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(private organisationsService: OrganisationsService) { }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    if (organisation) {
      throw new Error('The user is already the owner of the organisation with ID "' + organisation.id + '".');
    }
    this.organisation.ownerAddress = StorageUtil.getUserAddress();
    this.organisation.isActive = true;
    this.isLoading = false;
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.organisation.ownerAddress && this.organisation.name && !this.isCreating) {
      this.isCreating = true;
      this.organisation = await this.organisationsService.create(this.organisation);
      this.message = 'Created organisation with ID "' + this.organisation.id + '".';
      this.isCreating = false;
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-organisation-owner',
  templateUrl: './organisation-owner.component.html'
})
export class OrganisationOwnerComponent implements OnInit {

  organisation = new Organisation();
  originalOwnerAddress: string;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private organisationsService: OrganisationsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    if (!this.organisation) {
      throw new Error('The user is not an organisation owner.');
    }
    const organisationId: number = +this.route.snapshot.paramMap.get('organisationId');
    if (this.organisation.id.toString() !== organisationId.toString()) {
      throw new Error('The user is not the owner of the organisation with ID "' + organisationId + '".');
    }
    this.isLoading = false;
    this.originalOwnerAddress = this.organisation.ownerAddress;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.organisation.ownerAddress = this.originalOwnerAddress;
    });
  }

  private async _update(): Promise<void> {

    if (this.originalOwnerAddress.toLowerCase() !== this.organisation.ownerAddress.toLowerCase() && !this.isUpdating) {
      this.isUpdating = true;
      this.organisation = await this.organisationsService.updateOwner(this.organisation);
      this.message = 'Updated the owner of the organisation with ID "' + this.organisation.id + '".';
      this.isUpdating = false;
    }
  }
}

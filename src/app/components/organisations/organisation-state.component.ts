import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-organisation-state',
  templateUrl: './organisation-state.component.html'
})
export class OrganisationStateComponent implements OnInit {

  organisation = new Organisation();
  originalState: boolean;
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
    this.originalState = this.organisation.isActive;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.organisation.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {

    if (this.originalState !== this.organisation.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.organisation = await this.organisationsService.updateState(this.organisation);
      this.message = 'Updated the state of the organisation with ID "' + this.organisation.id + '".';
      this.isUpdating = false;
    }
  }
}

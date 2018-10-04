import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Administrator } from '../../models/administrator';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-administrator-state',
  templateUrl: './administrator-state.component.html'
})
export class AdministratorStateComponent implements OnInit {

  administrator = new Administrator();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private administratorsService: AdministratorsService,
    private organisationsService: OrganisationsService) {

  }

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
    const administratorId: number = +this.route.snapshot.paramMap.get('administratorId');
    this.administrator = await this.administratorsService.getOne(administratorId);
    this.originalState = this.administrator.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.administrator.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {

    if (this.originalState !== this.administrator.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.administrator = await this.administratorsService.update(this.administrator);
      this.message = 'Updated the state of the administrator with ID "' + this.administrator.id + '".';
      this.isUpdating = false;
    }
  }
}

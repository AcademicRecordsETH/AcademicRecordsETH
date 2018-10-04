import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';

@Component({
  selector: 'app-organisation-view',
  templateUrl: './organisation-view.component.html'
})
export class OrganisationViewComponent implements OnInit {

  organisation = new Organisation();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private organisationsService: OrganisationsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisationId: number = +this.route.snapshot.paramMap.get('organisationId');
    this.organisation = await this.organisationsService.getOne(organisationId);
    if (!this.organisation) {
      throw new Error('Organisation with ID "' + organisationId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

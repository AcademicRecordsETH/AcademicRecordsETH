import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Period } from '../../models/period';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-period-new',
  templateUrl: './period-new.component.html'
})
export class PeriodNewComponent implements OnInit {

  period = new Period();
  isLoading = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private administratorsService: AdministratorsService,
    private periodsService: PeriodsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    this.period.organisation = organisation;
    this.period.isActive = true;
    this.isLoading = false;
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.period.organisation.id && this.period.name && !this.isCreating) {
      this.isCreating = true;
      this.period = await this.periodsService.create(this.period);
      this.message = 'Created period with ID "' + this.period.id + '".';
      this.isCreating = false;
    }
  }
}

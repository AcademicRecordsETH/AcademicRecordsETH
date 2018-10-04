import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Period } from '../../models/period';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-period-state',
  templateUrl: './period-state.component.html'
})
export class PeriodStateComponent implements OnInit {

  period = new Period();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
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
    const periodId: number = +this.route.snapshot.paramMap.get('periodId');
    this.period = await this.periodsService.getOne(periodId);
    if (this.period.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.period.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + this.period.organisation.id + '" is not active.');
    }
    this.originalState = this.period.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.period.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.period.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.period = await this.periodsService.update(this.period);
      this.message = 'Updated the state of the period with ID "' + this.period.id + '".';
      this.isUpdating = false;
    }
  }
}

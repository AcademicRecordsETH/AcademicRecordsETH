import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Period } from '../../models/period';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-period-view',
  templateUrl: './period-view.component.html'
})
export class PeriodViewComponent implements OnInit {

  period = new Period();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private periodsService: PeriodsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const periodId: number = +this.route.snapshot.paramMap.get('periodId');
    this.period = await this.periodsService.getOne(periodId);
    if (!this.period) {
      throw new Error('Period with ID "' + periodId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

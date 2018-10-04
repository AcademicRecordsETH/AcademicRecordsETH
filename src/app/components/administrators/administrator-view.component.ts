import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Administrator } from '../../models/administrator';
import { AdministratorsService } from '../../services/administrators.service';

@Component({
  selector: 'app-administrator-view',
  templateUrl: './administrator-view.component.html'
})
export class AdministratorViewComponent implements OnInit {

  administrator = new Administrator();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private administratorsService: AdministratorsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const administratorId: number = +this.route.snapshot.paramMap.get('administratorId');
    this.administrator = await this.administratorsService.getOne(administratorId);
    if (!this.administrator) {
      throw new Error('Administrator with ID "' + administratorId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

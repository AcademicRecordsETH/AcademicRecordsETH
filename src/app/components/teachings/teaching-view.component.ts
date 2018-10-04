import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Teaching } from '../../models/teaching';
import { TeachingsService } from '../../services/teachings.service';

@Component({
  selector: 'app-teaching-view',
  templateUrl: './teaching-view.component.html'
})
export class TeachingViewComponent implements OnInit {

  teaching = new Teaching();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private teachingsService: TeachingsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const teachingId: number = +this.route.snapshot.paramMap.get('teachingId');
    this.teaching = await this.teachingsService.getOne(teachingId);
    if (!this.teaching) {
      throw new Error('Teaching with ID "' + teachingId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

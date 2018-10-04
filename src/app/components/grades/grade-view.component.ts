import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grade } from '../../models/grade';
import { GradesService } from '../../services/grades.service';

@Component({
  selector: 'app-grade-view',
  templateUrl: './grade-view.component.html'
})
export class GradeViewComponent implements OnInit {

  grade = new Grade();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private gradesService: GradesService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const gradeId: number = +this.route.snapshot.paramMap.get('gradeId');
    this.grade = await this.gradesService.getOne(gradeId);
    if (!this.grade) {
      throw new Error('Grade with ID "' + gradeId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

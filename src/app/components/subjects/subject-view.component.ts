import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from '../../models/subject';
import { SubjectsService } from '../../services/subjects.service';

@Component({
  selector: 'app-subject-view',
  templateUrl: './subject-view.component.html'
})
export class SubjectViewComponent implements OnInit {

  subject = new Subject();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const subjectId: number = +this.route.snapshot.paramMap.get('subjectId');
    this.subject = await this.subjectsService.getOne(subjectId);
    if (!this.subject) {
      throw new Error('Subject with ID "' + subjectId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

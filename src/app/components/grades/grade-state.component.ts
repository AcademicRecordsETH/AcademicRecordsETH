import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../models/organisation';
import { Grade } from '../../models/grade';
import { GradesService } from '../../services/grades.service';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-grade-state',
  templateUrl: './grade-state.component.html'
})
export class GradeStateComponent implements OnInit {

  grade = new Grade();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private professorsService: ProfessorsService,
    private gradesService: GradesService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.professorsService.getCurrentUserOrganisationAsProfessor();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    const gradeId: number = +this.route.snapshot.paramMap.get('gradeId');
    this.grade = await this.gradesService.getOne(gradeId);
    if (this.grade.professor.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.grade.professor.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    if (!this.grade.professor.isActive) {
      throw new Error('The professor with ID "' + this.grade.professor.id + '" is not active.');
    }
    if (!this.grade.enrollment.isActive) {
      throw new Error('The enrollment with ID "' + this.grade.enrollment.id + '" is not active.');
    }
    if (!this.grade.enrollment.student.isActive) {
      throw new Error('The student with ID "' + this.grade.enrollment.student.id + '" is not active.');
    }
    if (!this.grade.enrollment.subject.isActive) {
      throw new Error('The subject with ID "' + this.grade.enrollment.subject.id + '" is not active.');
    }
    if (!this.grade.enrollment.subject.period.isActive) {
      throw new Error('The period with ID "' + this.grade.enrollment.subject.period.id + '" is not active.');
    }
    this.originalState = this.grade.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.grade.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.grade.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.grade = await this.gradesService.update(this.grade);
      this.message = 'Updated the state of the grade with ID "' + this.grade.id + '".';
      this.isUpdating = false;
    }
  }
}

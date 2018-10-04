import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Enrollment } from '../../models/enrollment';
import { EnrollmentsService } from '../../services/enrollments.service';

@Component({
  selector: 'app-enrollment-state',
  templateUrl: './enrollment-state.component.html'
})
export class EnrollmentStateComponent implements OnInit {

  enrollment = new Enrollment();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private administratorsService: AdministratorsService,
    private enrollmentsService: EnrollmentsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    const enrollmentId: number = +this.route.snapshot.paramMap.get('enrollmentId');
    this.enrollment = await this.enrollmentsService.getOne(enrollmentId);
    if (this.enrollment.student.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.enrollment.student.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    if (!this.enrollment.student.isActive) {
      throw new Error('The student with ID "' + this.enrollment.student.id + '" is not active.');
    }
    if (!this.enrollment.subject.isActive) {
      throw new Error('The subject with ID "' + this.enrollment.subject.id + '" is not active.');
    }
    if (!this.enrollment.subject.period.isActive) {
      throw new Error('The period with ID "' + this.enrollment.subject.period.id + '" is not active.');
    }
    this.originalState = this.enrollment.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.enrollment.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.enrollment.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.enrollment = await this.enrollmentsService.update(this.enrollment);
      this.message = 'Updated the state of the enrollment with ID "' + this.enrollment.id + '".';
      this.isUpdating = false;
    }
  }
}

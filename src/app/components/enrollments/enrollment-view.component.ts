import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Enrollment } from '../../models/enrollment';
import { EnrollmentsService } from '../../services/enrollments.service';

@Component({
  selector: 'app-enrollment-view',
  templateUrl: './enrollment-view.component.html'
})
export class EnrollmentViewComponent implements OnInit {

  enrollment = new Enrollment();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private enrollmentsService: EnrollmentsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const enrollmentId: number = +this.route.snapshot.paramMap.get('enrollmentId');
    this.enrollment = await this.enrollmentsService.getOne(enrollmentId);
    if (!this.enrollment) {
      throw new Error('Enrollment with ID "' + enrollmentId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

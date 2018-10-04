import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Enrollment } from '../../models/enrollment';
import { EnrollmentsService } from '../../services/enrollments.service';
import { PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html'
})
export class EnrollmentsComponent implements OnInit {

  organisation: Organisation;
  organisationEnrollments: Enrollment[] = [];
  otherEnrollments: Enrollment[] = [];
  isLoadingOrganisation = true;
  isLoadingEnrollments = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private enrollmentsService: EnrollmentsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    this.isLoadingOrganisation = false;

    const enrollments = await this.enrollmentsService.getAll();
    for (let index = 0; index < enrollments.length; index++) {
      const enrollment = enrollments[index];
      if (this.organisation && this.organisation.id.toString() === enrollment.student.organisation.id.toString()) {
        this.organisationEnrollments.push(enrollment);
      } else {
        this.otherEnrollments.push(enrollment);
      }
    }
    this.isLoadingEnrollments = false;
  }
}

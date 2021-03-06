import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Student } from '../../models/student';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-student-new',
  templateUrl: './student-new.component.html'
})
export class StudentNewComponent implements OnInit {

  student = new Student();
  isLoading = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
    private administratorsService: AdministratorsService,
    private studentsService: StudentsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    this.student.organisation = organisation;
    this.student.isActive = true;
    this.isLoading = false;
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.student.organisation.id && this.student.studentCode && !this.isCreating) {
      this.isCreating = true;
      this.student = await this.studentsService.create(this.student);
      this.message = 'Created student with ID "' + this.student.id + '".';
      this.isCreating = false;
    }
  }
}

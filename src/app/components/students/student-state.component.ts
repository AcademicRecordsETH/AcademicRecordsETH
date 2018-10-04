import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Student } from '../../models/student';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-student-state',
  templateUrl: './student-state.component.html'
})
export class StudentStateComponent implements OnInit {

  student = new Student();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
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
    const studentId: number = +this.route.snapshot.paramMap.get('studentId');
    this.student = await this.studentsService.getOne(studentId);
    if (this.student.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.student.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + this.student.organisation.id + '" is not active.');
    }
    this.originalState = this.student.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.student.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.student.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.student = await this.studentsService.update(this.student);
      this.message = 'Updated the state of the student with ID "' + this.student.id + '".';
      this.isUpdating = false;
    }
  }
}

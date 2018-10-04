import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Student } from '../../models/student';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {

  organisation: Organisation;
  organisationStudents: Student[] = [];
  otherStudents: Student[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingStudents = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private studentsService: StudentsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (this.organisation && this.organisation.isActive) {
      this.canCreate = true;
    }
    this.isLoadingOrganisation = false;

    const students = await this.studentsService.getAll();
    for (let index = 0; index < students.length; index++) {
      if (this.organisation && this.organisation.id.toString() === students[index].organisation.id.toString()) {
        this.organisationStudents.push(students[index]);
      } else {
        this.otherStudents.push(students[index]);
      }
    }
    this.isLoadingStudents = false;
  }
}

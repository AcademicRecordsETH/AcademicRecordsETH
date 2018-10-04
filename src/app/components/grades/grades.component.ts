import { Component, OnInit } from '@angular/core';
import { Organisation } from '../../models/organisation';
import { Grade } from '../../models/grade';
import { GradesService } from '../../services/grades.service';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html'
})
export class GradesComponent implements OnInit {

  organisation: Organisation;
  organisationGrades: Grade[] = [];
  otherGrades: Grade[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingGrades = true;
  error = '';

  constructor(
    private professorsService: ProfessorsService,
    private gradesService: GradesService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this.organisation = await this.professorsService.getCurrentUserOrganisationAsProfessor();
    if (this.organisation && this.organisation.isActive) {
      this.canCreate = true;
    }
    this.isLoadingOrganisation = false;

    const grades = await this.gradesService.getAll();
    for (let index = 0; index < grades.length; index++) {
      const grade = grades[index];
      if (this.organisation && this.organisation.id.toString() === grade.professor.organisation.id.toString()) {
        this.organisationGrades.push(grade);
      } else {
        this.otherGrades.push(grade);
      }
    }
    this.isLoadingGrades = false;
  }
}

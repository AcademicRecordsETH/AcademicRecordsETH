import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Professor } from '../../models/professor';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-professor-state',
  templateUrl: './professor-state.component.html'
})
export class ProfessorStateComponent implements OnInit {

  professor = new Professor();
  originalState: boolean;
  isLoading = true;
  isUpdating = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private administratorsService: AdministratorsService,
    private professorsService: ProfessorsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const organisation: Organisation = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    if (!organisation) {
      throw new Error('The user is not an organisation administrator or is not active.');
    }
    const professorId: number = +this.route.snapshot.paramMap.get('professorId');
    this.professor = await this.professorsService.getOne(professorId);
    if (this.professor.organisation.id.toString() !== organisation.id.toString()) {
      throw new Error('The user is not an administrator of the organisation with ID "' + this.professor.organisation.id + '".');
    }
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + this.professor.organisation.id + '" is not active.');
    }
    this.originalState = this.professor.isActive;
    this.isLoading = false;
  }

  update() {

    this._update().catch(error => {
      this.error = error;
      this.professor.isActive = this.originalState;
    });
  }

  private async _update(): Promise<void> {
    if (this.originalState !== this.professor.isActive && !this.isUpdating) {
      this.isUpdating = true;
      this.professor = await this.professorsService.update(this.professor);
      this.message = 'Updated the state of the professor with ID "' + this.professor.id + '".';
      this.isUpdating = false;
    }
  }
}

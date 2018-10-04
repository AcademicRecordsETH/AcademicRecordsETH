import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Professor } from '../../models/professor';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-professor-new',
  templateUrl: './professor-new.component.html'
})
export class ProfessorNewComponent implements OnInit {

  professor = new Professor();
  isLoading = true;
  isCreating = false;
  error = '';
  message = '';

  constructor(
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
    if (!organisation.isActive) {
      throw new Error('The organisation with ID "' + organisation.id + '" is not active.');
    }
    this.professor.organisation = organisation;
    this.professor.isActive = true;
    this.isLoading = false;
  }

  create() {

    this._create().catch(error => this.error = error);
  }

  private async _create(): Promise<void> {

    if (this.professor.organisation.id && this.professor.professorAddress && !this.isCreating) {
      this.isCreating = true;
      this.professor = await this.professorsService.create(this.professor);
      this.message = 'Created professor with ID "' + this.professor.id + '".';
      this.isCreating = false;
    }
  }
}

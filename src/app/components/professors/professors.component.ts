import { Component, OnInit } from '@angular/core';
import { AdministratorsService } from '../../services/administrators.service';
import { Organisation } from '../../models/organisation';
import { Professor } from '../../models/professor';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html'
})
export class ProfessorsComponent implements OnInit {

  organisation: Organisation;
  organisationProfessors: Professor[] = [];
  otherProfessors: Professor[] = [];
  canCreate = false;
  isLoadingOrganisation = true;
  isLoadingProfessors = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private professorsService: ProfessorsService) {

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

    const professors = await this.professorsService.getAll();
    for (let index = 0; index < professors.length; index++) {
      if (this.organisation && this.organisation.id.toString() === professors[index].organisation.id.toString()) {
        this.organisationProfessors.push(professors[index]);
      } else {
        this.otherProfessors.push(professors[index]);
      }
    }
    this.isLoadingProfessors = false;
  }
}

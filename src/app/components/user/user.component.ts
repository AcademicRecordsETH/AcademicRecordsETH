import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageUtil } from '../../util/storage.util';
import { Organisation } from '../../models/organisation';
import { OrganisationsService } from '../../services/organisations.service';
import { AdministratorsService } from '../../services/administrators.service';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  userAddress = '';
  organisationOwner: Organisation;
  organisationAdministrator: Organisation;
  organisationProfessor: Organisation;
  isLoadingOwner = true;
  isLoadingAdministrator = true;
  isLoadingProfessor = true;
  error = '';

  constructor(
    private administratorsService: AdministratorsService,
    private organisationsService: OrganisationsService,
    private professorsService: ProfessorsService) {

  }

  ngOnInit() {

    this.userAddress = StorageUtil.getUserAddress();

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    this._loadOrganisationOwner();
    this._loadOrganisationAdministrator();
    this._loadOrganisationProfessor();
  }

  private async _loadOrganisationOwner(): Promise<void> {

    this.organisationOwner = await this.organisationsService.getCurrentUserOrganisationAsOwner();
    this.isLoadingOwner = false;
  }

  private async _loadOrganisationAdministrator(): Promise<void> {
    
    this.organisationAdministrator = await this.administratorsService.getCurrentUserOrganisationAsAdministrator();
    this.isLoadingAdministrator = false;
  }

  private async _loadOrganisationProfessor(): Promise<void> {

    this.organisationProfessor = await this.professorsService.getCurrentUserOrganisationAsProfessor();
    this.isLoadingProfessor = false;
  }
}

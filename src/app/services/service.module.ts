import { NgModule } from '@angular/core';
import { AdministratorsService } from './administrators.service';
import { EnrollmentsService } from './enrollments.service';
import { GradesService } from './grades.service';
import { MessagesService } from './messages.service';
import { OrganisationsService } from './organisations.service';
import { PeriodsService } from './periods.service';
import { ProfessorsService } from './professors.service';
import { StudentsService } from './students.service';
import { SubjectsService } from './subjects.service';
import { TeachingsService } from './teachings.service';
import { Web3Service } from './web3.service';

@NgModule({
    providers: [
        AdministratorsService,
        EnrollmentsService,
        GradesService,
        MessagesService,
        OrganisationsService,
        PeriodsService,
        ProfessorsService,
        StudentsService,
        SubjectsService,
        TeachingsService,
        Web3Service,
    ]
})
export class ServicesModule {
    // nothing here
}

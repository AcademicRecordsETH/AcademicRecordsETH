import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from './services/service.module';

import { AdministratorsComponent } from './components/administrators/administrators.component';
import { AdministratorNewComponent } from './components/administrators/administrator-new.component';
import { AdministratorStateComponent } from './components/administrators/administrator-state.component';
import { AdministratorViewComponent } from './components/administrators/administrator-view.component';
import { AdministratorsTableComponent } from './components/administrators/administrators-table.component';
import { EnrollmentsComponent } from './components/enrollments/enrollments.component';
import { EnrollmentNewComponent } from './components/enrollments/enrollment-new.component';
import { EnrollmentStateComponent } from './components/enrollments/enrollment-state.component';
import { EnrollmentViewComponent } from './components/enrollments/enrollment-view.component';
import { EnrollmentsTableComponent } from './components/enrollments/enrollments-table.component';
import { GradesComponent } from './components/grades/grades.component';
import { GradeNewComponent } from './components/grades/grade-new.component';
import { GradeStateComponent } from './components/grades/grade-state.component';
import { GradeViewComponent } from './components/grades/grade-view.component';
import { GradesTableComponent } from './components/grades/grades-table.component';
import { OrganisationsComponent } from './components/organisations/organisations.component';
import { OrganisationsTableComponent } from './components/organisations/organisations-table.component';
import { OrganisationComponent } from './components/organisations/organisation.component';
import { OrganisationNewComponent } from './components/organisations/organisation-new.component';
import { OrganisationOwnerComponent } from './components/organisations/organisation-owner.component';
import { OrganisationStateComponent } from './components/organisations/organisation-state.component';
import { OrganisationViewComponent } from './components/organisations/organisation-view.component';
import { PeriodsComponent } from './components/periods/periods.component';
import { PeriodNewComponent } from './components/periods/period-new.component';
import { PeriodStateComponent } from './components/periods/period-state.component';
import { PeriodViewComponent } from './components/periods/period-view.component';
import { PeriodsTableComponent } from './components/periods/periods-table.component';
import { ProfessorsComponent } from './components/professors/professors.component';
import { ProfessorNewComponent } from './components/professors/professor-new.component';
import { ProfessorStateComponent } from './components/professors/professor-state.component';
import { ProfessorViewComponent } from './components/professors/professor-view.component';
import { ProfessorsTableComponent } from './components/professors/professors-table.component';
import { StudentsComponent } from './components/students/students.component';
import { StudentNewComponent } from './components/students/student-new.component';
import { StudentStateComponent } from './components/students/student-state.component';
import { StudentViewComponent } from './components/students/student-view.component';
import { StudentsTableComponent } from './components/students/students-table.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { SubjectNewComponent } from './components/subjects/subject-new.component';
import { SubjectStateComponent } from './components/subjects/subject-state.component';
import { SubjectViewComponent } from './components/subjects/subject-view.component';
import { SubjectsTableComponent } from './components/subjects/subjects-table.component';
import { TeachingsComponent } from './components/teachings/teachings.component';
import { TeachingNewComponent } from './components/teachings/teaching-new.component';
import { TeachingStateComponent } from './components/teachings/teaching-state.component';
import { TeachingViewComponent } from './components/teachings/teaching-view.component';
import { TeachingsTableComponent } from './components/teachings/teachings-table.component';
import { UserComponent } from './components/user/user.component';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSelectModule,
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    AdministratorsComponent,
    AdministratorNewComponent,
    AdministratorStateComponent,
    AdministratorViewComponent,
    AdministratorsTableComponent,
    EnrollmentsComponent,
    EnrollmentNewComponent,
    EnrollmentStateComponent,
    EnrollmentViewComponent,
    EnrollmentsTableComponent,
    GradesComponent,
    GradeNewComponent,
    GradeStateComponent,
    GradeViewComponent,
    GradesTableComponent,
    OrganisationComponent,
    OrganisationsComponent,
    OrganisationNewComponent,
    OrganisationOwnerComponent,
    OrganisationStateComponent,
    OrganisationViewComponent,
    OrganisationsTableComponent,
    PeriodsComponent,
    PeriodNewComponent,
    PeriodStateComponent,
    PeriodViewComponent,
    PeriodsTableComponent,
    ProfessorsComponent,
    ProfessorNewComponent,
    ProfessorStateComponent,
    ProfessorViewComponent,
    ProfessorsTableComponent,
    StudentsComponent,
    StudentNewComponent,
    StudentStateComponent,
    StudentViewComponent,
    StudentsTableComponent,
    SubjectsComponent,
    SubjectNewComponent,
    SubjectStateComponent,
    SubjectViewComponent,
    SubjectsTableComponent,
    TeachingsComponent,
    TeachingNewComponent,
    TeachingStateComponent,
    TeachingViewComponent,
    TeachingsTableComponent,
    UserComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

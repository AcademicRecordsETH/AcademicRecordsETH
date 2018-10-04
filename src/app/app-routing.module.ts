import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministratorsComponent } from './components/administrators/administrators.component';
import { AdministratorNewComponent } from './components/administrators/administrator-new.component';
import { AdministratorStateComponent } from './components/administrators/administrator-state.component';
import { AdministratorViewComponent } from './components/administrators/administrator-view.component';
import { EnrollmentsComponent } from './components/enrollments/enrollments.component';
import { EnrollmentNewComponent } from './components/enrollments/enrollment-new.component';
import { EnrollmentStateComponent } from './components/enrollments/enrollment-state.component';
import { EnrollmentViewComponent } from './components/enrollments/enrollment-view.component';
import { GradesComponent } from './components/grades/grades.component';
import { GradeNewComponent } from './components/grades/grade-new.component';
import { GradeStateComponent } from './components/grades/grade-state.component';
import { GradeViewComponent } from './components/grades/grade-view.component';
import { OrganisationsComponent } from './components/organisations/organisations.component';
import { OrganisationNewComponent } from './components/organisations/organisation-new.component';
import { OrganisationOwnerComponent } from './components/organisations/organisation-owner.component';
import { OrganisationStateComponent } from './components/organisations/organisation-state.component';
import { OrganisationViewComponent } from './components/organisations/organisation-view.component';
import { PeriodsComponent } from './components/periods/periods.component';
import { PeriodNewComponent } from './components/periods/period-new.component';
import { PeriodStateComponent } from './components/periods/period-state.component';
import { PeriodViewComponent } from './components/periods/period-view.component';
import { ProfessorsComponent } from './components/professors/professors.component';
import { ProfessorNewComponent } from './components/professors/professor-new.component';
import { ProfessorStateComponent } from './components/professors/professor-state.component';
import { ProfessorViewComponent } from './components/professors/professor-view.component';
import { StudentsComponent } from './components/students/students.component';
import { StudentNewComponent } from './components/students/student-new.component';
import { StudentStateComponent } from './components/students/student-state.component';
import { StudentViewComponent } from './components/students/student-view.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { SubjectNewComponent } from './components/subjects/subject-new.component';
import { SubjectStateComponent } from './components/subjects/subject-state.component';
import { SubjectViewComponent } from './components/subjects/subject-view.component';
import { TeachingsComponent } from './components/teachings/teachings.component';
import { TeachingNewComponent } from './components/teachings/teaching-new.component';
import { TeachingStateComponent } from './components/teachings/teaching-state.component';
import { TeachingViewComponent } from './components/teachings/teaching-view.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: 'administrators', component: AdministratorsComponent },
  { path: 'administrator-new', component: AdministratorNewComponent },
  { path: 'administrator-state/:administratorId', component: AdministratorStateComponent },
  { path: 'administrator-view/:administratorId', component: AdministratorViewComponent },
  { path: 'enrollments', component: EnrollmentsComponent },
  { path: 'enrollment-new', component: EnrollmentNewComponent },
  { path: 'enrollment-state/:enrollmentId', component: EnrollmentStateComponent },
  { path: 'enrollment-view/:enrollmentId', component: EnrollmentViewComponent },
  { path: 'grades', component: GradesComponent },
  { path: 'grade-new', component: GradeNewComponent },
  { path: 'grade-state/:gradeId', component: GradeStateComponent },
  { path: 'grade-view/:gradeId', component: GradeViewComponent },
  { path: 'organisations', component: OrganisationsComponent },
  { path: 'organisation-new', component: OrganisationNewComponent },
  { path: 'organisation-owner/:organisationId', component: OrganisationOwnerComponent },
  { path: 'organisation-state/:organisationId', component: OrganisationStateComponent },
  { path: 'organisation-view/:organisationId', component: OrganisationViewComponent },
  { path: 'periods', component: PeriodsComponent },
  { path: 'period-new', component: PeriodNewComponent },
  { path: 'period-state/:periodId', component: PeriodStateComponent },
  { path: 'period-view/:periodId', component: PeriodViewComponent },
  { path: 'professors', component: ProfessorsComponent },
  { path: 'professor-new', component: ProfessorNewComponent },
  { path: 'professor-state/:professorId', component: ProfessorStateComponent },
  { path: 'professor-view/:professorId', component: ProfessorViewComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'student-new', component: StudentNewComponent },
  { path: 'student-state/:studentId', component: StudentStateComponent },
  { path: 'student-view/:studentId', component: StudentViewComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'subject-new', component: SubjectNewComponent },
  { path: 'subject-state/:subjectId', component: SubjectStateComponent },
  { path: 'subject-view/:subjectId', component: SubjectViewComponent },
  { path: 'teachings', component: TeachingsComponent },
  { path: 'teaching-new', component: TeachingNewComponent },
  { path: 'teaching-state/:teachingId', component: TeachingStateComponent },
  { path: 'teaching-view/:teachingId', component: TeachingViewComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  // nothing here
}

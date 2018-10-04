import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html'
})
export class StudentViewComponent implements OnInit {

  student = new Student();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private studentsService: StudentsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {
    const studentId: number = +this.route.snapshot.paramMap.get('studentId');
    this.student = await this.studentsService.getOne(studentId);
    if (!this.student) {
      throw new Error('Student with ID "' + studentId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

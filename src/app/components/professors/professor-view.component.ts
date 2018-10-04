import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Professor } from '../../models/professor';
import { ProfessorsService } from '../../services/professors.service';

@Component({
  selector: 'app-professor-view',
  templateUrl: './professor-view.component.html'
})
export class ProfessorViewComponent implements OnInit {

  professor = new Professor();
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private professorsService: ProfessorsService) {

  }

  ngOnInit() {

    this._init().catch(error => this.error = error);
  }

  private async _init(): Promise<void> {

    const professorId: number = +this.route.snapshot.paramMap.get('professorId');
    this.professor = await this.professorsService.getOne(professorId);
    if (!this.professor) {
      throw new Error('Professor with ID "' + professorId + '" not found.');
    }
    this.isLoading = false;
  }

  goBack() {

    window.history.back();
  }
}

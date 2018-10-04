import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Grade } from '../../models/grade';

@Component({
  selector: 'app-grades-table',
  templateUrl: './grades-table.component.html'
})
export class GradesTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() grades: Grade[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Grade>;
  displayedColumns: string[] = ['id', 'viewGrade', 'enrollment', 'viewEnrollment', 'grade', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.grades);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

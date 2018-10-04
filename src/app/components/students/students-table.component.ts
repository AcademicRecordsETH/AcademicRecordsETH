import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Student } from '../../models/student';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html'
})
export class StudentsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() students: Student[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Student>;
  displayedColumns: string[] = ['id', 'organisation', 'viewOrganisation', 'studentCode', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.students);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

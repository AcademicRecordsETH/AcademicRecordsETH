import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Enrollment } from '../../models/enrollment';

@Component({
  selector: 'app-enrollments-table',
  templateUrl: './enrollments-table.component.html'
})
export class EnrollmentsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() enrollments: Enrollment[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Enrollment>;
  displayedColumns: string[] = ['id', 'subject', 'viewSubject', 'student', 'viewStudent', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.enrollments);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

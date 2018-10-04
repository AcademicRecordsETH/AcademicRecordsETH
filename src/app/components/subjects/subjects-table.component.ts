import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Subject } from '../../models/subject';

@Component({
  selector: 'app-subjects-table',
  templateUrl: './subjects-table.component.html'
})
export class SubjectsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() subjects: Subject[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Subject>;
  displayedColumns: string[] = ['id', 'period', 'viewPeriod', 'name', 'price', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.subjects);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

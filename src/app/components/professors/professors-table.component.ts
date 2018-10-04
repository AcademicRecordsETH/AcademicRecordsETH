import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Professor } from '../../models/professor';

@Component({
  selector: 'app-professors-table',
  templateUrl: './professors-table.component.html'
})
export class ProfessorsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() professors: Professor[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Professor>;
  displayedColumns: string[] = ['id', 'organisation', 'viewOrganisation', 'professorAddress', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.professors);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

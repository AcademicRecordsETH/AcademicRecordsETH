import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Teaching } from '../../models/teaching';

@Component({
  selector: 'app-teachings-table',
  templateUrl: './teachings-table.component.html'
})
export class TeachingsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() teachings: Teaching[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Teaching>;
  displayedColumns: string[] = ['id', 'subject', 'viewSubject', 'professor', 'viewProfessor', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.teachings);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

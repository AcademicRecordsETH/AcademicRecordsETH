import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Administrator } from '../../models/administrator';

@Component({
  selector: 'app-administrators-table',
  templateUrl: './administrators-table.component.html'
})
export class AdministratorsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() administrators: Administrator[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Administrator>;
  displayedColumns: string[] = ['id', 'organisation', 'viewOrganisation', 'administratorAddress', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.administrators);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

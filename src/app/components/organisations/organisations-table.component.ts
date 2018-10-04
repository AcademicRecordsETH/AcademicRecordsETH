import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Organisation } from '../../models/organisation';

@Component({
  selector: 'app-organisations-table',
  templateUrl: './organisations-table.component.html'
})
export class OrganisationsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() organisations: Organisation[];

  dataSource: MatTableDataSource<Organisation>;
  displayedColumns: string[] = ['id', 'ownerAddress', 'name', 'isActive'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.organisations);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

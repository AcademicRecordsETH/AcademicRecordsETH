import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Period } from '../../models/period';

@Component({
  selector: 'app-periods-table',
  templateUrl: './periods-table.component.html'
})
export class PeriodsTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  @Input() periods: Period[];
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Period>;
  displayedColumns: string[] = ['id', 'organisation', 'viewOrganisation', 'name', 'isActive', 'changeState'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.periods);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

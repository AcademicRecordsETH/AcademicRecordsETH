import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Organisation } from '../../models/organisation';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html'
})
export class OrganisationComponent implements OnInit {

  @Input() organisation: Organisation;
  @Input() canUpdate: boolean;

  dataSource: MatTableDataSource<Organisation>;
  displayedColumns: string[] = ['id', 'ownerAddress', 'name', 'isActive'];

  constructor() { }

  ngOnInit() {
    const organisations: Organisation[] = [];
    organisations.push(this.organisation);
    this.dataSource = new MatTableDataSource(organisations);
  }
}

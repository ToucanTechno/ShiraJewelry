import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-display-grid',
  templateUrl: './display-grid.component.html',
  styleUrls: ['./display-grid.component.scss']
})
export class DisplayGridComponent implements OnInit {
  @Input()
  categoryColumns: number;

  constructor() { }

  ngOnInit(): void {
  }

}

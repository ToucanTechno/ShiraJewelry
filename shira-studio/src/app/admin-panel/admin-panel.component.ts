import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  title = 'Admin Panel';

  constructor() { }

  ngOnInit(): void {
  }

}

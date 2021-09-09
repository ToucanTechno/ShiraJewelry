import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MatMenuTrigger} from '@angular/material/menu';

interface CategoryLink {
  name: string;
  link: string;
}

interface MenuLinks {
  selfLink: CategoryLink;
  menuName: string;
  childLinks: CategoryLink[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  triggersDict: {};

  title = 'Shira Studio';
  searchText = '';
  links: MenuLinks[] = [
    {selfLink: {name: 'Category1', link: 'example1'}, menuName: 'menu1', childLinks: [
        {name: 'Option1', link: 'option1'},
        {name: 'Option2', link: 'option2'}
      ]},
    {selfLink: {name: 'Category2', link: 'example2'}, menuName: 'menu2', childLinks: [
        {name: 'Option3', link: 'option3'},
        {name: 'Option4', link: 'option4'}
      ]}
  ];
  activeLink = 'Category1';
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.triggersDict = this.triggers.reduce((map, trigger) => { map[trigger.menuData.menuName] = trigger; return map; }, {});
    console.log(this.triggersDict);
  }
}

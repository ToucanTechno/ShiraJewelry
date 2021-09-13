import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MatMenuTrigger} from '@angular/material/menu';
import {HoverMenuService} from '../hover-menu.service';

interface CategoryLink {
  id: number;
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

  title = 'Shira Studio';
  searchText = '';
  links: MenuLinks[] = [
          {selfLink: {id: 1, name: 'Category1', link: 'example1'}, menuName: 'menu1', childLinks: [
        {id: 2, name: 'Option1', link: 'option1'},
        {id: 3, name: 'Option2', link: 'option2'}
      ]},
    {selfLink: {id: 4, name: 'Category2', link: 'example2'}, menuName: 'menu2', childLinks: [
        {id: 5, name: 'Option3', link: 'option3'},
        {id: 6, name: 'Option4', link: 'option4'}
      ]}
  ];

  constructor(public hoverMenuService: HoverMenuService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const triggersDict = this.triggers.reduce((map, trigger) => {
        map[trigger.menuData.menuName] = trigger;
        return map;
      },
      {});
    this.hoverMenuService.triggersDict = triggersDict;
  }
}

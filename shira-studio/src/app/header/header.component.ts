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

enum MenuState {
  Header,
  Body,
  Outside
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  triggersDict: {};
  menuStates: {} = {};

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
    this.triggersDict = this.triggers.reduce((map, trigger) => {
        map[trigger.menuData.menuName] = trigger;
        return map;
      },
      {});
    console.log(this.triggersDict);
  }

  enterMenuHeader(menuName): void {
    this.menuStates[menuName] = MenuState.Header;
    setTimeout(() => this.triggersDict[menuName].openMenu(), 100);
  }
  leaveMenuHeader(menuName): void {
    this.menuStates[menuName] = MenuState.Outside;
    setTimeout(this.leaveMenuCallback, 100, this, menuName);
  }
  enterMenuBody(menuName): void {
    this.menuStates[menuName] = MenuState.Body;
    this.triggersDict[menuName].openMenu();
  }
  leaveMenuBody(menuName): void {
    this.menuStates[menuName] = MenuState.Outside;
    setTimeout(this.leaveMenuCallback, 100, this, menuName);
  }

  leaveMenuCallback(self, menuName): void {
    if (self.menuStates[menuName] === MenuState.Outside) {
      self.triggersDict[menuName].closeMenu();
    }
  }
}

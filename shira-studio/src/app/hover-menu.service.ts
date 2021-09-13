import { Injectable } from '@angular/core';

enum MenuState {
  Header,
  Body,
  Outside
}

@Injectable({
  providedIn: 'root'
})
export class HoverMenuService {
  menuStates: {} = {};
  // tslint:disable-next-line:variable-name
  private _triggersDict: {};
  // tslint:disable-next-line:variable-name
  private _activeLink = 'Category1';

  constructor() { }

  get activeLink(): string {
    return this._activeLink;
  }

  set activeLink(value: string) {
    this._activeLink = value;
  }

  get triggersDict(): {} {
    return this._triggersDict;
  }

  set triggersDict(triggersDict: {}) {
    this._triggersDict = triggersDict;
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

import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {HoverMenuService} from '../hover-menu.service';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

  title = 'Admin Panel';
  links: {}[] = [
    { name: 'שונות', menuName: 'menu1', url: undefined, childLinks: [
        { name: 'עורך דף הבית', url: '/edit-homepage' },
        { name: 'כניסות', url: '/entry-statistics' },
        { name: 'משלוחים', url: '/deliveries' },
        { name: 'הודעות', url: '/messages' }
      ]},
    { name: 'הוסף', menuName: 'menu2', url: undefined, childLinks: [
        { name: 'הוסף קטגוריה', url: '/add-category' },
        { name: 'הוסף מוצר', url: '/add-item' }
      ]},
    { name: 'ערוך', menuName: 'menu3', url: undefined, childLinks: [
        { name: 'ערוך קטגוריות', url: '/edit-categories' },
        { name : 'ערוך מוצרים', url: '/edit-category/all' } // TODO: edit category
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

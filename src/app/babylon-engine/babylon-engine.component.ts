import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BabylonEngineService } from './babylon-engine.service';

@Component({
  selector: 'app-babylon-engine',
  templateUrl: './babylon-engine.component.html',
  styleUrls: ['./babylon-engine.component.css']
})
export class BabylonEngineComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private babylonEngineService: BabylonEngineService) { }

  ngOnInit() {
    this.babylonEngineService.createScene(this.rendererCanvas);
    this.babylonEngineService.animate();
  }

}

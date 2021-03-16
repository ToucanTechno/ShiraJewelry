import {ElementRef} from '@angular/core';
import * as BABYLON from 'babylonjs';
import {ProductsMouseInput} from './products-input';
import {BabylonEngineConfiguration} from './babylon-engine-configuration';

export class ProductsScene extends BABYLON.Scene {
  engine: BABYLON.Engine;
  private readonly canvas: HTMLCanvasElement;
  private camera: BABYLON.ArcRotateCamera;
  private light: BABYLON.HemisphericLight;
  private tiledGround: BABYLON.Mesh;

  static getCameraHeight(): number {
    return BabylonEngineConfiguration.SCALING.y * BabylonEngineConfiguration.ROWS_COUNT / 2
      + BabylonEngineConfiguration.MARGIN * (BabylonEngineConfiguration.ROWS_COUNT + 1);
  }

  constructor(canvas: ElementRef<HTMLCanvasElement>) {
    const engine = new BABYLON.Engine(canvas.nativeElement,  true);
    super(engine);
    // Create scene
    this.engine = engine;
    this.canvas = canvas.nativeElement;
    this.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.camera = this.createMainCamera();
    this.light = this.createLight();
    this.tiledGround = this.createGround();
  }

  createMainCamera(): BABYLON.ArcRotateCamera {
    const camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera(
      'MainCamera',
      Math.PI,
      Math.PI / 2,
      1,
      new BABYLON.Vector3(
        0,
        BabylonEngineConfiguration.SCALING.y * BabylonEngineConfiguration.ROWS_COUNT / 2 + BabylonEngineConfiguration.MARGIN,
        0),
      this);
    camera.inputs.add(new ProductsMouseInput(BabylonEngineConfiguration.BUTTONS_COUNT, this));
    camera.attachControl(this.canvas, true);
    camera.inputs.attached.mousewheel.detachControl(this.canvas);
    camera.inputs.attached.keyboard.detachControl(this.canvas);
    // camera.inputs.attached.pointers.detachControl(this.canvas);
    return camera;
  }

  createLight(): BABYLON.HemisphericLight {
    // create a basic light, aiming 0,1,0 - meaning, to the sky
    const light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight('LHemispheric', new BABYLON.Vector3(0, 10, 0), this);
    light.intensity = 1.0;
    return light;
  }

  createGround(): BABYLON.Mesh {
    const ground = BABYLON.MeshBuilder.CreateTiledGround(
      'MTiledGround',
      {
        xmin: -BabylonEngineConfiguration.GROUND_SIZE,
        zmin: -BabylonEngineConfiguration.GROUND_SIZE,
        xmax: BabylonEngineConfiguration.GROUND_SIZE,
        zmax: BabylonEngineConfiguration.GROUND_SIZE,
        subdivisions: {'h': BabylonEngineConfiguration.GROUND_SUBDIVISIONS, 'w': BabylonEngineConfiguration.GROUND_SUBDIVISIONS}},
      this);

    const borderMaterial = new BABYLON.StandardMaterial('MBorder', this);
    borderMaterial.diffuseTexture = new BABYLON.Texture('assets/textures/ground_tiles.png', this);
    ground.material = borderMaterial;
    return ground;
  }
}

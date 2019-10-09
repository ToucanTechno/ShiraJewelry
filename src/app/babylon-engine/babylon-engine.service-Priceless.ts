import { ElementRef, Injectable, NgZone } from '@angular/core';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-materials';


@Injectable({
  providedIn: 'root'
})
export class BabylonEngineService {
  static readonly BUTTONS_COUNT = 21;
  static readonly COLUMNS_COUNT = 7;
  static readonly SCALING = new BABYLON.Vector3(4, 4, 4);
  static readonly ROWS_COUNT = BabylonEngineService.BUTTONS_COUNT / BabylonEngineService.COLUMNS_COUNT;
  static readonly MARGIN = 0.3;
  static readonly RADIUS = 6;

  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private light: BABYLON.Light;
  private tiledGround: BABYLON.Mesh;

  private GUIManager: GUI.GUI3DManager;

  public constructor(private ngZone: NgZone) {
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas,  true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.createCamera();

    this.createGround();

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight('LHemispheric', new BABYLON.Vector3(0, 10, 0), this.scene);
    this.light.intensity = 1.0;

    this.createButtonsCylinder();

    // simple rotation along the y axis
    this.scene.registerAfterRender(() => {

    });
  }

  createCamera(): void {
    this.camera = new BABYLON.ArcRotateCamera('ArtRotateCamera',-Math.PI / 2,  Math.PI / 4, 2,
      new BABYLON.Vector3(0, BabylonEngineService.SCALING.y * BabylonEngineService.ROWS_COUNT / 2 + BabylonEngineService.MARGIN , 0), this.scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.inputs.attached.mousewheel.detachControl(this.canvas);
  }

  createGround(): void {
    this.tiledGround = BABYLON.MeshBuilder.CreateTiledGround(
      'MTiledGround',
      {xmin: -20, zmin: -20, xmax: 20, zmax: 20, subdivisions: {'h': 16, 'w': 16}},
      this.scene);
    const borderMaterial = new BABYLON.StandardMaterial('MBorder', this.scene);
    borderMaterial.diffuseTexture = new BABYLON.Texture('assets/textures/ground_tiles.png', this.scene);
    this.tiledGround.material = borderMaterial;
  }

  createButtonsCylinder(): void {
    this.GUIManager = new GUI.GUI3DManager(this.scene);
    const anchor = new BABYLON.TransformNode('');

    const panel = new GUI.CylinderPanel();
    panel.columns = BabylonEngineService.COLUMNS_COUNT;
    panel.margin = BabylonEngineService.MARGIN;
    panel.radius = BabylonEngineService.RADIUS;

    this.GUIManager.addControl(panel);
    panel.linkToTransformNode(anchor);
    panel.position.y = BabylonEngineService.SCALING.y * BabylonEngineService.ROWS_COUNT / 2
      + panel.margin * BabylonEngineService.ROWS_COUNT;

    // Let's add some buttons!
    const addButton = function() {
      const button = new GUI.HolographicButton('orientation');
      panel.addControl(button);

      button.text = 'Button #' + panel.children.length;
      button.scaling = BabylonEngineService.SCALING;
    };

    panel.blockLayout = true;
    for (let index = 0; index < BabylonEngineService.BUTTONS_COUNT; index++) {
      addButton();
    }
    panel.blockLayout = false;
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('DOMContentLoaded', () => {
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
      });

      window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }

  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
  showWorldAxis (size: number) {

    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
      const plane = BABYLON.Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new BABYLON.StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new BABYLON.Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = BABYLON.Mesh.CreateLines(
      'axisX',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ],
      this.scene
    );

    axisX.color = new BABYLON.Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = BABYLON.Mesh.CreateLines(
      'axisY',
      [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
      ],
      this.scene
    );

    axisY.color = new BABYLON.Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = BABYLON.Mesh.CreateLines(
      'axisZ',
      [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
      ],
      this.scene
    );

    axisZ.color = new BABYLON.Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  }
}

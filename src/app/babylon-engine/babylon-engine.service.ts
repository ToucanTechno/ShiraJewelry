import { ElementRef, Injectable, NgZone } from '@angular/core';
import 'babylonjs-materials';
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

import { ProductsMouseInput } from './products-input';

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
  static readonly GROUND_SIZE = 20;
  static readonly GROUND_SUBDIVISIONS = 16;

  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private light: BABYLON.Light;
  private tiledGround: BABYLON.Mesh;

  private GUIManager: GUI.GUI3DManager;
  private GUICamera: BABYLON.Camera;
  private advancedTexture: GUI.AdvancedDynamicTexture;

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

    // 3D GUI
    this.GUIManager = new GUI.GUI3DManager(this.scene);
    this.createButtonsCylinder();

    // 2D GUI
    this.GUICamera = new BABYLON.ArcRotateCamera('GUI2DCamera', 0, 0.8, 100, BABYLON.Vector3.Zero(), this.scene);
    this.GUICamera.layerMask = 2;
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    this.advancedTexture.layer.layerMask = 2;
    this.createNavigationButtons();

    // simple rotation along the y axis
    this.scene.activeCameras = [this.camera, this.GUICamera];
    this.scene.registerAfterRender(() => {

    });
  }

  createNavigationButtons(): void {
    const rightButton = GUI.Button.CreateImageOnlyButton('next', 'assets/images/next_arrow.png');
    rightButton.width = '200px';
    rightButton.height = '200px';
    rightButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    console.log(this.camera.inputs);
    if ('productsmouse' in this.camera.inputs.attached) {
      rightButton.onPointerClickObservable.add((eventData, eventState) => {
        (<ProductsMouseInput>this.camera.inputs.attached.productsmouse).onClickNext();
      });
    }
    this.advancedTexture.addControl(rightButton);

    const leftButton = GUI.Button.CreateImageOnlyButton('previous', 'assets/images/previous_arrow.png');
    leftButton.width = '200px';
    leftButton.height = '200px';
    leftButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    if ('productsmouse' in this.camera.inputs.attached) {
      leftButton.onPointerClickObservable.add((eventData, eventState) => {
        (<ProductsMouseInput>this.camera.inputs.attached.productsmouse).onClickPrevious();
      });
    }
    this.advancedTexture.addControl(leftButton);
  }

  createCamera(): void {
    this.camera = new BABYLON.ArcRotateCamera(
      'MainCamera',
      Math.PI,
      Math.PI / 2,
      1,
      new BABYLON.Vector3(
        0,
        BabylonEngineService.SCALING.y * BabylonEngineService.ROWS_COUNT / 2 + BabylonEngineService.MARGIN,
        0),
      this.scene);
    this.camera.layerMask = 1;
    this.camera.inputs.add(new ProductsMouseInput(BabylonEngineService.BUTTONS_COUNT, this.scene));
    this.camera.attachControl(this.canvas, true);
    this.camera.inputs.attached.mousewheel.detachControl(this.canvas);
    this.camera.inputs.attached.keyboard.detachControl(this.canvas);
    this.camera.inputs.attached.pointers.detachControl(this.canvas);
  }

  createGround(): void {
    this.tiledGround = BABYLON.MeshBuilder.CreateTiledGround(
      'MTiledGround',
      {
        xmin: -BabylonEngineService.GROUND_SIZE,
        zmin: -BabylonEngineService.GROUND_SIZE,
        xmax: BabylonEngineService.GROUND_SIZE,
        zmax: BabylonEngineService.GROUND_SIZE,
        subdivisions: {'h': BabylonEngineService.GROUND_SUBDIVISIONS, 'w': BabylonEngineService.GROUND_SUBDIVISIONS}},
      this.scene);
    this.tiledGround.layerMask = 1;

    const borderMaterial = new BABYLON.StandardMaterial('MBorder', this.scene);
    borderMaterial.diffuseTexture = new BABYLON.Texture('assets/textures/ground_tiles.png', this.scene);
    this.tiledGround.material = borderMaterial;
  }

  createButtonsCylinder(): void {
    const anchor = new BABYLON.TransformNode('');

    const panel = new GUI.CylinderPanel();
    panel.columns = BabylonEngineService.COLUMNS_COUNT;
    panel.margin = BabylonEngineService.MARGIN;
    panel.radius = BabylonEngineService.RADIUS;

    this.GUIManager.addControl(panel);
    panel.linkToTransformNode(anchor);
    panel.position.y = BabylonEngineService.SCALING.y * BabylonEngineService.ROWS_COUNT / 2
      + panel.margin * BabylonEngineService.ROWS_COUNT;

    panel.blockLayout = true;
    for (let index = 0; index < BabylonEngineService.BUTTONS_COUNT; index++) {
      this.addPanelButton(panel, index);
    }
    panel.blockLayout = false;
  }

  addPanelButton(panel, index): void {
    const faceUV = new Array(6);

    for (let i = 0; i < 6; i++) {
      faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
    }
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);
    const mesh = BABYLON.MeshBuilder.CreateBox(
      `3DButtonMesh${index}`,
      {
        height: 1,
        width: 1,
        depth: 0.08,
        faceUV: faceUV
      },
      this.scene);
    mesh.layerMask = 1;

    const material = new BABYLON.StandardMaterial('MButtonMaterial', this.scene);
    material.specularColor = BABYLON.Color3.Black();
    mesh.material = material;

    const buttonText = new GUI.TextBlock('TButtonText', 'Button #' + panel.children.length);
    buttonText.color = 'red';
    buttonText.outlineColor = 'white';
    buttonText.outlineWidth = 10;
    buttonText.top = 512 / 2 - 100 / 2; // 512/2 - 100/2 is botton baseline, reduce any amount of bottom padding needed
    buttonText.fontSize = 100;

    const buttonImage = new GUI.Image(`Button Image ${index}`,
      'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500');

    const facadeTexture = new GUI.AdvancedDynamicTexture(
      'Facade',
      512,
      512,
      this.scene,
      true,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    facadeTexture.rootContainer.scaleX = 1;
    facadeTexture.rootContainer.scaleY = 1;
    facadeTexture.premulAlpha = true;
    // facadeTexture.background = 'rgb(255, 255, 255)';
    facadeTexture.background = 'white';
    facadeTexture.addControl(buttonImage);
    facadeTexture.addControl(buttonText);

    material.emissiveTexture = facadeTexture;

    const button = new GUI.MeshButton3D(mesh, `3DButton${index}`);
    button.onPointerClickObservable.add(this.buttonClickHandler);
    panel.addControl(button);
    // Clone so that hover effect works correctly
    button.scaling = BabylonEngineService.SCALING.clone();
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

  buttonClickHandler(eventData: GUI.Vector3WithInfo, eventState: BABYLON.EventState): void {
    console.log(eventState.currentTarget.name);
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

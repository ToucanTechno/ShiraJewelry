import { ElementRef, Injectable, NgZone } from '@angular/core';
import 'babylonjs-materials';
import {EventState} from 'babylonjs/Misc/observable';
import {Mesh} from 'babylonjs/Meshes/mesh';
import {Light} from 'babylonjs/Lights/light';
import {Engine} from 'babylonjs/Engines/engine';
import {ArcRotateCamera} from 'babylonjs/Cameras/arcRotateCamera';
import {Scene} from 'babylonjs/scene';
import {Color3, Color4, Vector3, Vector4} from 'babylonjs/Maths/math';
import {HemisphericLight} from 'babylonjs/Lights/hemisphericLight';
import { MeshBuilder } from 'babylonjs';
import {StandardMaterial} from 'babylonjs/Materials/standardMaterial';
import {Texture} from 'babylonjs/Materials/Textures/texture';
import {TransformNode} from 'babylonjs/Meshes/transformNode';
import {DynamicTexture} from 'babylonjs/Materials/Textures/dynamicTexture';
import {Vector3WithInfo} from 'babylonjs-gui/3D/vector3WithInfo';
import {GUI3DManager} from 'babylonjs-gui/3D/gui3DManager';
import {CylinderPanel} from 'babylonjs-gui/3D/controls/cylinderPanel';
import {TextBlock} from 'babylonjs-gui/2D/controls/textBlock';
import {AdvancedDynamicTexture} from 'babylonjs-gui/2D/advancedDynamicTexture';
import {MeshButton3D} from 'babylonjs-gui/3D/controls/meshButton3D';

@Injectable({
  providedIn: 'root'
})
export class BabylonEngineService {
  static readonly BUTTONS_COUNT = 21;
  static readonly COLUMNS_COUNT = 7;
  static readonly SCALING = new Vector3(4, 4, 4);
  static readonly ROWS_COUNT = BabylonEngineService.BUTTONS_COUNT / BabylonEngineService.COLUMNS_COUNT;
  static readonly MARGIN = 0.3;
  static readonly RADIUS = 6;
  static readonly GROUND_SIZE = 20;
  static readonly GROUND_SUBDIVISIONS = 16;

  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private light: Light;
  private tiledGround: Mesh;

  private GUIManager: GUI3DManager;

  public constructor(private ngZone: NgZone) {
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas,  true);

    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 0);

    this.createCamera();

    this.createGround();

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new HemisphericLight('LHemispheric', new Vector3(0, 10, 0), this.scene);
    this.light.intensity = 1.0;

    this.createButtonsCylinder();

    // simple rotation along the y axis
    this.scene.registerAfterRender(() => {

    });
  }

  createCamera(): void {
    this.camera = new ArcRotateCamera(
      'ArtRotateCamera',
      -Math.PI / 2,
      Math.PI / 4,
      2,
      new Vector3(
        0,
        BabylonEngineService.SCALING.y * BabylonEngineService.ROWS_COUNT / 2 + BabylonEngineService.MARGIN,
        0),
      this.scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.inputs.attached.mousewheel.detachControl(this.canvas);
  }

  createGround(): void {
    this.tiledGround = MeshBuilder.CreateTiledGround(
      'MTiledGround',
      {
        xmin: -BabylonEngineService.GROUND_SIZE,
        zmin: -BabylonEngineService.GROUND_SIZE,
        xmax: BabylonEngineService.GROUND_SIZE,
        zmax: BabylonEngineService.GROUND_SIZE,
        subdivisions: {'h': BabylonEngineService.GROUND_SUBDIVISIONS, 'w': BabylonEngineService.GROUND_SUBDIVISIONS}},
      this.scene);
    const borderMaterial = new StandardMaterial('MBorder', this.scene);
    borderMaterial.diffuseTexture = new Texture('assets/textures/ground_tiles.png', this.scene);
    this.tiledGround.material = borderMaterial;
  }

  createButtonsCylinder(): void {
    this.GUIManager = new GUI3DManager(this.scene);
    const anchor = new TransformNode('');

    const panel = new CylinderPanel();
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
      faceUV[i] = new Vector4(0, 0, 0, 0);
    }
    faceUV[1] = new Vector4(0, 0, 1, 1);
    const mesh = MeshBuilder.CreateBox(
      'MButtonMesh',
      {
        height: 1,
        width: 1,
        depth: 0.08,
        faceUV: faceUV
      },
      this.scene);

    const material = new StandardMaterial('MButtonMaterial', mesh.getScene());
    material.specularColor = Color3.Black();
    mesh.material = material;

    const buttonText = new TextBlock('TButtonText', 'Button #' + panel.children.length);
    buttonText.color = 'red';
    buttonText.fontSize = 24;

    const facadeTexture = new AdvancedDynamicTexture(
      'Facade',
      512,
      512,
      this.scene,
      true,
      Texture.TRILINEAR_SAMPLINGMODE);
    facadeTexture.rootContainer.scaleX = 2;
    facadeTexture.rootContainer.scaleY = 2;
    facadeTexture.premulAlpha = true;
    // facadeTexture.background = 'rgb(255, 255, 255)';
    facadeTexture.background = 'white';
    facadeTexture.addControl(buttonText);

    material.emissiveTexture = facadeTexture;

    const button = new MeshButton3D(mesh, 'orientation' + index);
    button.onPointerClickObservable.add(this.buttonClickHandler);
    panel.addControl(button);
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

  buttonClickHandler(eventData: Vector3WithInfo, eventState: EventState): void {

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
      const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
      const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
      ],
      this.scene
    );

    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
      ],
      this.scene
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
        new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
      ],
      this.scene
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }
}

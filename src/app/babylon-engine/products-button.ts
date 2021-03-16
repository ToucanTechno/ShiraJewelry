import * as GUI from 'babylonjs-gui';
import * as BABYLON from 'babylonjs';
import {BabylonEngineConfiguration} from './babylon-engine-configuration';

export class ProductsButton extends GUI.MeshButton3D {
  private readonly scene: BABYLON.Scene;

  constructor(scene: BABYLON.Scene, index: number, buttonText: string, imageSource: string) {
    const faceUV: Array<BABYLON.Vector4> = new Array(6);

    for (let i = 0; i < 6; i++) {
      faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
    }
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);
    const scaling: BABYLON.Vector3 = BabylonEngineConfiguration.SCALING.clone();
    const mesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
      `3DButtonMesh${index}`,
      {
        height: 1 * scaling.y,
        width: 1 * scaling.x,
        depth: 0.08 * scaling.z,
        faceUV: faceUV
      },
      scene);

    const material = new BABYLON.StandardMaterial('MButtonMaterial', scene);
    material.specularColor = BABYLON.Color3.Black();
    mesh.material = material;

    const ButtonTextBlock: GUI.TextBlock = new GUI.TextBlock('TButtonText', buttonText);
    // TODO: add to configuration
    ButtonTextBlock.color = 'red';
    ButtonTextBlock.outlineColor = 'white';
    ButtonTextBlock.outlineWidth = 10;
    ButtonTextBlock.top = 512 / 2 - 100 / 2; // 512/2 - 100/2 is botton baseline, reduce any amount of bottom padding needed
    ButtonTextBlock.fontSize = 100;

    const buttonImage = new GUI.Image(`Button Image ${index}`,
      imageSource);

    const facadeTexture = new GUI.AdvancedDynamicTexture(
      'Facade',
      512,
      512,
      scene,
      true,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    facadeTexture.rootContainer.scaleX = 1;
    facadeTexture.rootContainer.scaleY = 1;
    facadeTexture.premulAlpha = true;
    // facadeTexture.background = 'rgb(255, 255, 255)';
    facadeTexture.background = 'white';
    facadeTexture.addControl(buttonImage);
    facadeTexture.addControl(ButtonTextBlock);

    material.emissiveTexture = facadeTexture;

    super(mesh, `3DButton${index}`);
    this.onPointerClickObservable.add(this.buttonClickHandler);
  }

  buttonClickHandler(eventData: GUI.Vector3WithInfo, eventState: BABYLON.EventState): void {
    console.log(eventState.currentTarget.name);
  }
}

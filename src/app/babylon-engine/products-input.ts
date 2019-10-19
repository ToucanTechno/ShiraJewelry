import {modulo} from '../utils/number-utils';
import * as BABYLON from 'babylonjs';

export class ProductsMouseInput {

  camera: BABYLON.Nullable<BABYLON.ArcRotateCamera>;
  ghostCamera: BABYLON.ArcRotateCamera;
  buttonIndex: number;
  buttonsCount: number;

  constructor(buttonsCount: number, scene: BABYLON.Scene) {
    this.buttonIndex = 0;
    this.buttonsCount = buttonsCount;
    this.ghostCamera = new BABYLON.ArcRotateCamera('GhostCamera',
      -Math.PI / 2 ,
      Math.PI / 4,
      5,
      new BABYLON.Vector3(0, 0, 0), scene);
  }

  getClassName(): string {
    return 'ProductsMouseInput';
  }

  getSimpleName(): string {
    return 'productsmouse';
  }

  attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
    element.addEventListener('onKeyDown', this.onKeyDown.bind(this));
  }

  detachControl (element: HTMLElement): void {
    element.removeEventListener('onKeyDown', )
  }

  onKeyDown(event: HTMLElementEventMap): void {
    console.log(event);
  }

  onClickNext(): void {
    this.buttonIndex = modulo((this.buttonIndex + 1), this.buttonsCount);
    this.updateTarget();
  }

  onClickPrevious(): void {
    this.buttonIndex = modulo((this.buttonIndex - 1), this.buttonsCount);
    this.updateTarget();
  }

  updateTarget(): void {
    const targetMesh = this.camera.getScene().getMeshByID(`3DButtonMesh${this.buttonIndex}`);
    const mainCamera: BABYLON.ArcRotateCamera = <BABYLON.ArcRotateCamera>this.camera.getScene().getCameraByID('MainCamera');
    const cameraTarget = mainCamera.getTarget();
    // look in radius 2 behind cameraTarget to see targetMesh
    const cameraTargetPosition = targetMesh.getAbsolutePosition().subtract(cameraTarget).normalize().scaleInPlace(-2);
    cameraTargetPosition.addInPlace(cameraTarget); // Translate from mainCamera axes to absolute axes
    this.animateCameraToTarget(mainCamera, cameraTargetPosition);
  }

  animateCameraToTarget(camera: BABYLON.ArcRotateCamera, cameraTargetPosition: BABYLON.Vector3, keysCount: number = 10) {
    if (!cameraTargetPosition) {
      return;
    }

    // const centerOfTransformation = new BABYLON.TransformNode('root');
    // centerOfTransformation.rotationQuaternion = new BABYLON.Quaternion(0,0,0,1);
    // camera.parent = centerOfTransformation;
    // centerOfTransformation.lookAt(camera.position);
    // const start = centerOfTransformation.rotationQuaternion;
    // const end = centerOfTransformation.clone('root', camera.position).lookAt(cameraTargetPosition);

    const distanceToTarget = camera.position.subtract(cameraTargetPosition).length();
    if (distanceToTarget > 0.1) {
      // set new camera - move camera in small steps based on the direction vector
      const animationBox = new BABYLON.Animation('ACameraMove',
        'position',
        10,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      const direction = cameraTargetPosition.subtract(camera.position);
      const keys = [];
      for (let i = 0; i < keysCount; i++) {
        const newPosition = camera.position.add(
          direction.scale(i / (keysCount - 1)));
        newPosition.normalize().scaleInPlace(cameraTargetPosition.length())
        keys.push({
          frame: i,
          // Walk on a great arc
          value: newPosition
        });
      }
      animationBox.setKeys(keys);
      camera.animations.push(animationBox);
      camera.getScene().beginAnimation(camera, 0, keysCount);
    }
  }
}

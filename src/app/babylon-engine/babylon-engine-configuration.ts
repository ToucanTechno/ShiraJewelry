import * as BABYLON from 'babylonjs';

export class BabylonEngineConfiguration {
  static readonly BUTTONS_COUNT = 21;
  static readonly COLUMNS_COUNT = 7;
  static readonly SCALING = new BABYLON.Vector3(4, 4, 4);
  static readonly ROWS_COUNT = BabylonEngineConfiguration.BUTTONS_COUNT / BabylonEngineConfiguration.COLUMNS_COUNT;
  static readonly MARGIN = 0.3;
  static readonly RADIUS = 6;
  static readonly GROUND_SIZE = 20;
  static readonly GROUND_SUBDIVISIONS = 16;
}

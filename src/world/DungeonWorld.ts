import { Vec3, Vec4 } from "../rooms/schema/Vector";
import { Managers } from "../core/managers/Managers";
import { DungeonRoomState } from "../rooms/schema/DungeonRoomState";
import * as Utils from "../utils/Utils";
import { Transform } from "../rooms/schema/Transform";

export class DungeonWorld {
  private roomState: DungeonRoomState;

  readonly tickLengthMs = 1000 / 20; // 1000 / 20 = 20 fps,  1000 / 60 = 60 fps
  private previousTick = Date.now();
  private actualTicks = 0;

  constructor(roomState: DungeonRoomState) {
    this.roomState = roomState;
    this.initWorld();
  }

  private async initWorld() {
    const dungeonGltf = await Utils.loadGLTFModel(
      `http://${process.env.ASSECTS_SERVER}/hausle/Dungeon.glb`
    );

    this.gameLoop();
  }

  private gameLoop() {
    const now = Date.now();

    this.actualTicks++;
    if (this.previousTick + this.tickLengthMs <= now) {
      const delta = (now - this.previousTick) / 1000;
      this.previousTick = now;

      this.update(delta);

      this.actualTicks = 0;
    }

    if (Date.now() - this.previousTick < this.tickLengthMs - 16) {
      setTimeout(this.gameLoop.bind(this));
    } else {
      setImmediate(this.gameLoop.bind(this));
    }
  }

  private update(delta: number): void {
    Managers.Instance.Update(delta);
  }

  ///
  /// Player
  ///
  public CreateCharacter(sessionId: string) {
    return new Transform();
  }

  public RemoveCharacter(sessionId: string) {}

  public UpdatePlayerPosition(sessionId: string, position: Vec3) {}

  public UpdatePlayerQuaternion(sessionId: string, quaternion: Vec4) {
    // TODO:
  }

  public UpdatePlayerScale(sessionId: string, scale: Vec3) {
    // TODO:
  }

  public UpdatePlayerState(sessionId: string, state: string) {
    // TODO:
  }
}

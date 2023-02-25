import { Vec3, Vec4 } from "../rooms/schema/Vector";
import { Managers } from "../core/managers/Managers";
import { DungeonRoomState } from "../rooms/schema/DungeonRoomState";
import { Transform } from "../rooms/schema/Transform";
import { MathUtils, Mesh, Vector3 } from "three";
import * as Utils from "../utils/Utils";
//import { TargetPointList } from "./TargetPoint";

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

    Managers.Pathfinder.Init(
      dungeonGltf.scene.getObjectByName("Navmesh") as Mesh
    );

    Managers.Npcs.Init(
      this.roomState,
      dungeonGltf.scene.getObjectByName("Target")
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
    const startPosition = this.getStartPosition();
    return new Transform(startPosition);
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

  private getStartPosition(): Vec3 {
    let newPosition = new Vector3(0, 0, 0);

    if (this.checkCharacterDistance(newPosition)) {
      return Utils.three2Vec3(newPosition);
    }

    let count = 0;
    while (true) {
      const lowNumber = Math.floor(count / 100);
      const randX = MathUtils.randFloat(lowNumber - 1, lowNumber + 1);
      const randZ = MathUtils.randFloat(lowNumber, lowNumber + 1);
      newPosition = new Vector3(randX, 0, randZ);

      if (this.checkCharacterDistance(newPosition)) {
        return Utils.three2Vec3(newPosition);
      }

      count++;
    }
  }

  private checkCharacterDistance(position: Vector3): boolean {
    for (const player of this.roomState.players.values()) {
      const playerPosition = Utils.vec32three(player.transform.position);
      if (playerPosition.distanceTo(position) < 1) {
        return false;
      }
    }

    return true;
  }
}

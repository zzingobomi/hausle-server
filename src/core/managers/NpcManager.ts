import { MathUtils, Object3D, Vector3 } from "three";
import { DungeonRoomState } from "../../rooms/schema/DungeonRoomState";
import { NonplayerCharacter } from "../../world/NonplayerCharacter";
import { Transform } from "../../rooms/schema/Transform";
import * as Utils from "../../utils/Utils";

export interface NpcInfo {
  networkId: string;
  character: NonplayerCharacter;
}

export class NpcManager {
  private roomState: DungeonRoomState;
  private npcs: NpcInfo[] = [];
  private targetList: Vector3[] = [];

  public Init(roomState: DungeonRoomState, targetParent: Object3D): void {
    this.roomState = roomState;

    targetParent.traverse((child) => {
      const targetWorldPosition = new Vector3();
      child.getWorldPosition(targetWorldPosition);
      this.targetList.push(targetWorldPosition);
    });

    // Npcs (임시로 5명 만들기)
    for (let i = 0; i < 5; i++) {
      this.CreateNpc(this.GetRandomTarget());
    }
  }

  public CreateNpc(position: Vector3): void {
    const npc = new NonplayerCharacter(position);
    this.roomState.CreateNpc(
      npc.uuid,
      "",
      new Transform(
        Utils.three2Vec3(npc.position),
        Utils.three2Vec4(npc.quaternion),
        Utils.three2Vec3(npc.scale)
      )
    );
    this.npcs.push({
      networkId: npc.uuid,
      character: npc,
    });
  }

  public RemoveNpc(networkId: string): void {
    const removeIndex = this.npcs.findIndex(
      (npc) => npc.networkId === networkId
    );
    if (removeIndex !== -1) {
      this.npcs.splice(removeIndex, 1);
    }
  }

  public Update(delta: number): void {
    for (const npc of this.npcs) {
      npc.character.Update(delta);
    }
  }

  public GetRandomTarget(): Vector3 {
    const randomIndex = MathUtils.randInt(0, this.targetList.length - 1);
    return new Vector3().copy(this.targetList[randomIndex]);
  }
}

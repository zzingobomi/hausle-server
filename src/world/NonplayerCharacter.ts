import { MathUtils, Object3D, Quaternion, Vector3 } from "three";
import { SignalType } from "../core/SignalType";
import { CharStateType } from "../shared/CharStateType";
import { Managers } from "../core/managers/Managers";
import * as Utils from "../utils/Utils";
import PubSub from "pubsub-js";

const SPEED = 2;
const CALIBRATION_VALUE = 0.8;

export class NonplayerCharacter extends Object3D {
  private oldPosition: Vector3 = new Vector3();
  private oldQuaternion: Quaternion = new Quaternion();
  private oldScale: Vector3 = new Vector3(1, 1, 1);

  public path: Vector3[];

  // TODO: 추후 FSM 으로 바꾸기
  private isWalking = false;

  constructor(position: Vector3) {
    super();
    this.position.set(position.x, position.y, position.z);
    this.quaternion.set(0, 0, 0, 1);
    this.scale.set(1, 1, 1);

    this.oldPosition.copy(this.position);
    this.oldQuaternion.copy(this.quaternion);
    this.oldScale.copy(this.scale);

    this.searchNextPosition();
  }

  public SetPath(path: Vector3[]) {
    this.path = path;
  }

  public Update(delta: number) {
    if (!(this.path || []).length) {
      if (this.isWalking === true) {
        this.searchNextPosition();
      }
      this.isWalking = false;
      return;
    }

    this.isWalking = true;

    let targetPosition = this.path[0];
    const velocity = targetPosition.clone().sub(this.position);

    if (velocity.lengthSq() > 0.05 * 0.05) {
      velocity.normalize();

      // quaternion
      this.lookAt(targetPosition);
      if (Utils.checkDiffQuat(this.oldQuaternion, this.quaternion)) {
        PubSub.publish(SignalType.UPDATE_NPC_QUATERNION, {
          networkId: this.uuid,
          quaternion: Utils.fixedQuat(this.quaternion),
        });
        this.oldQuaternion.copy(this.quaternion);
      }

      // position
      this.position.add(velocity.multiplyScalar(delta * SPEED));
      if (Utils.checkDiffVec(this.oldPosition, this.position)) {
        PubSub.publish(SignalType.UPDATE_NPC_POSITION, {
          networkId: this.uuid,
          position: Utils.fixedVec3(
            new Vector3(
              this.position.x,
              this.position.y + CALIBRATION_VALUE,
              this.position.z
            )
          ),
        });
        this.oldPosition.copy(this.position);
      }
    } else {
      this.path.shift();
    }
  }

  private searchNextPosition(): void {
    const searchTime = MathUtils.randFloat(0, 5);
    PubSub.publish(SignalType.UPDATE_NPC_STATE, {
      networkId: this.uuid,
      stateName: CharStateType.Idle,
    });

    setTimeout(() => {
      let count = 0;
      while (count < 10) {
        const targetPosition = Managers.Npcs.GetRandomTarget();
        const path = Managers.Pathfinder.GetPath(this.position, targetPosition);
        if (!path || path.length === 0) {
          count++;
        } else {
          this.SetPath(path);
          PubSub.publish(SignalType.UPDATE_NPC_STATE, {
            networkId: this.uuid,
            stateName: CharStateType.Walk,
          });
          return;
        }
      }
      console.log("randon target not found");
    }, searchTime * 1000);
  }
}

import { Schema, type } from "@colyseus/schema";
import { Transform } from "./Transform";
import { Vec3, Vec4 } from "./Vector";

export class PlayerState extends Schema {
  @type("string")
  stateName: string = "";

  get StateName() {
    return this.stateName;
  }
  set StateName(name: string) {
    this.stateName = name;
  }
}

export class Player extends Schema {
  @type(Transform)
  transform: Transform = new Transform();

  @type(PlayerState)
  state: PlayerState = new PlayerState();

  @type("string")
  nickname: string = "";

  constructor(nickname: string, transform: Transform) {
    super();
    this.nickname = nickname;
    this.transform = transform;
  }

  SetPosition(position: Vec3) {
    this.transform.SetPosition(position);
  }
  SetQuaternion(quaternion: Vec4) {
    this.transform.SetQuaternion(quaternion);
  }
  SetScale(scale: Vec3) {
    this.transform.SetScale(scale);
  }

  SetState(stateName: string) {
    this.state.StateName = stateName;
  }
}

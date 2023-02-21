import { Schema, type } from "@colyseus/schema";
import { Vec3, Vec4 } from "./Vector";

export class Transform extends Schema {
  @type(Vec3)
  position: Vec3 = new Vec3(0, 0, 0);

  @type(Vec4)
  quaternion: Vec4 = new Vec4(0, 0, 0, 1);

  @type(Vec3)
  scale: Vec3 = new Vec3(1, 1, 1);

  constructor(
    position: Vec3 = new Vec3(0, 0, 0),
    quaternion: Vec4 = new Vec4(0, 0, 0, 1),
    scale: Vec3 = new Vec3(0, 0, 0)
  ) {
    super();
    this.SetPosition(position);
    this.SetQuaternion(quaternion);
    this.SetScale(scale);
  }

  SetPosition(position: Vec3) {
    this.position.Set(position.x, position.y, position.z);
  }
  SetQuaternion(quaternion: Vec4) {
    this.quaternion.Set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }
  SetScale(scale: Vec3) {
    this.scale.Set(scale.x, scale.y, scale.z);
  }
}

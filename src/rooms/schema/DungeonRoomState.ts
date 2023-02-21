import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "./Player";
import { Transform } from "./Transform";
import { Vec3, Vec4 } from "./Vector";

export class DungeonRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  ///
  /// Player
  ///
  CreatePlayer(sessionId: string, nickname: string, transform: Transform) {
    this.players.set(sessionId, new Player(nickname, transform));
  }

  RemovePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  UpdatePlayerPosition(sessionId: string, position: Vec3) {
    const player = this.players.get(sessionId);
    if (player) player.SetPosition(position);
  }
  UpdatePlayerQuaternion(sessionId: string, quaternion: Vec4) {
    const player = this.players.get(sessionId);
    if (player) player.SetQuaternion(quaternion);
  }
  UpdatePlayerScale(sessionId: string, scale: Vec3) {
    const player = this.players.get(sessionId);
    if (player) player.SetScale(scale);
  }

  UpdatePlayerState(sessionId: string, stateName: string) {
    const player = this.players.get(sessionId);
    if (player) player.SetState(stateName);
  }
}

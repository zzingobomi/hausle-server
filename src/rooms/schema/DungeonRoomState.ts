import { Schema, MapSchema, type } from "@colyseus/schema";
import { Npc } from "./Npc";
import { Player } from "./Player";
import { Transform } from "./Transform";
import { Vec3, Vec4 } from "./Vector";

export class DungeonRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Npc })
  npcs = new MapSchema<Npc>();

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

  ///
  /// Npc (TODO: Player 와 같이 공통 schema 만들기)
  ///
  CreateNpc(networkId: string, nickname: string, transform: Transform) {
    console.log("createNpc: ", networkId);
    this.npcs.set(networkId, new Npc(nickname, transform));
  }

  RemoveNpc(networkId: string) {
    this.npcs.delete(networkId);
  }

  UpdateNpcPosition(networkId: string, position: Vec3) {
    const npc = this.npcs.get(networkId);
    if (npc) npc.SetPosition(position);
  }
  UpdateNpcQuaternion(networkId: string, quaternion: Vec4) {
    const npc = this.npcs.get(networkId);
    if (npc) npc.SetQuaternion(quaternion);
  }
  UpdateNpcScale(networkId: string, scale: Vec3) {
    const npc = this.npcs.get(networkId);
    if (npc) npc.SetScale(scale);
  }

  UpdateNpcState(networkId: string, stateName: string) {
    const npc = this.npcs.get(networkId);
    if (npc) npc.SetState(stateName);
  }
}

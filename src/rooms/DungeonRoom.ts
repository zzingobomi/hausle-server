import { Room, Client } from "colyseus";
import { SignalType } from "../core/SignalType";
import { EventPacket } from "../shared/EventPacket";
import { DungeonWorld } from "../world/DungeonWorld";
import { DungeonRoomState } from "./schema/DungeonRoomState";
import { Vec3, Vec4 } from "./schema/Vector";
import * as Utils from "../utils/Utils";
import PubSub from "pubsub-js";

export class DungeonRoom extends Room<DungeonRoomState> {
  autoDispose: boolean = false;
  world: DungeonWorld;

  onCreate(options: any) {
    console.log("DungeonRoom created!", options);

    const roomState = new DungeonRoomState();
    this.setState(roomState);

    this.world = new DungeonWorld(roomState);

    this.registOnMessages();
    this.registSubscribes();
  }

  onJoin(client: Client, options: any) {
    console.log("onJoin: ", client.sessionId, "/", options.nickname);
    const playerTransform = this.world.CreateCharacter(client.sessionId);
    this.state.CreatePlayer(
      client.sessionId,
      options.nickname,
      playerTransform
    );
  }

  onLeave(client: Client, consented: boolean) {
    this.world.RemoveCharacter(client.sessionId);
    this.state.RemovePlayer(client.sessionId);
    console.log("onLeave: ", client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  registOnMessages() {
    // Player
    this.onMessage(
      EventPacket.UpdatePlayerPosition,
      (client: Client, position: Vec3) => {
        //console.log("update.player.position: ", client.sessionId, position);
        this.state.UpdatePlayerPosition(client.sessionId, position);
      }
    );

    this.onMessage(
      EventPacket.UpdatePlayerQuaternion,
      (client: Client, quaternion: Vec4) => {
        //console.log("update.player.quaternion: ", client.sessionId, quaternion);
        this.state.UpdatePlayerQuaternion(client.sessionId, quaternion);
      }
    );

    this.onMessage(
      EventPacket.UpdatePlayerScale,
      (client: Client, scale: Vec3) => {
        //console.log("update.player.scale: ", client.sessionId, scale);
        this.state.UpdatePlayerScale(client.sessionId, scale);
      }
    );

    this.onMessage(
      EventPacket.UpdatePlayerState,
      (client: Client, state: string) => {
        //console.log("update.player.state: ", client.sessionId, state);
        this.state.UpdatePlayerState(client.sessionId, state);
      }
    );
  }

  registSubscribes() {
    // Npc
    PubSub.subscribe(SignalType.UPDATE_NPC_POSITION, (msg, data) => {
      this.state.UpdateNpcPosition(
        data.networkId,
        Utils.three2Vec3(data.position)
      );
    });
    PubSub.subscribe(SignalType.UPDATE_NPC_QUATERNION, (msg, data) => {
      this.state.UpdateNpcQuaternion(
        data.networkId,
        Utils.three2Vec4(data.quaternion)
      );
    });
    PubSub.subscribe(SignalType.UPDATE_NPC_SCALE, (msg, data) => {
      this.state.UpdateNpcScale(data.networkId, Utils.three2Vec3(data.scale));
    });
    PubSub.subscribe(SignalType.UPDATE_NPC_STATE, (msg, data) => {
      this.state.UpdateNpcState(data.networkId, data.stateName);
    });
  }
}

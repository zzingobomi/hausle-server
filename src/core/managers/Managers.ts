import { NpcManager } from "./NpcManager";
import { PathfinderManager } from "./PathfinderManager";

export class Managers {
  private static s_instance: Managers;
  static get Instance(): Managers {
    this.Init();
    return this.s_instance;
  }

  _pathfinder: PathfinderManager = new PathfinderManager();
  _npcs: NpcManager = new NpcManager();

  static get Pathfinder(): PathfinderManager {
    return Managers.Instance._pathfinder;
  }
  static get Npcs(): NpcManager {
    return Managers.Instance._npcs;
  }

  public Update(delta: number): void {
    this._npcs.Update(delta);
  }

  static Init(): void {
    if (!this.s_instance) {
      this.s_instance = new Managers();

      // TODO: 다른 매니저들 초기화
    }
  }

  public static Clear(): void {}
}

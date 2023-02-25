import { Mesh, Vector3 } from "three";
import { Pathfinding } from "../pathfinding";

export class PathfinderManager {
  readonly ZONE = "Dungeon";
  pathfinder: Pathfinding;
  navMesh: Mesh;

  public Init(navMesh: Mesh) {
    this.navMesh = navMesh;
    this.pathfinder = new Pathfinding();

    console.time("createZone");
    const zone = Pathfinding.createZone(this.navMesh.geometry);
    console.timeEnd("createZone");

    this.pathfinder.setZoneData(this.ZONE, zone);
  }

  public GetPath(startPosition: Vector3, targetPosition: Vector3): Vector3[] {
    const groupID = this.pathfinder.getGroup(this.ZONE, startPosition);
    const path = this.pathfinder.findPath(
      startPosition,
      targetPosition,
      this.ZONE,
      groupID
    );
    return path;
  }
}

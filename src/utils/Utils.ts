import { BufferGeometry, Quaternion, Vector3 } from "three";
import { GLTF } from "three-stdlib";
import { Vec3, Vec4 } from "../rooms/schema/Vector";
import { CustomGLTFLoader } from "./GLTFLoader";
const DracoLoader = require("./DRACOLoader");
const axios = require("axios");

export function vec32three(vec: Vec3): Vector3 {
  return new Vector3(vec.x, vec.y, vec.z);
}

export function vec42three(quat: Vec4): Quaternion {
  return new Quaternion(quat.x, quat.y, quat.z, quat.w);
}

export function three2Vec3(vec: Vector3): Vec3 {
  return new Vec3(vec.x, vec.y, vec.z);
}

export function three2Vec4(quat: Quaternion): Vec4 {
  return new Vec4(quat.x, quat.y, quat.z, quat.w);
}

export function flipBufferGeometryNormalsIndexed(geometry: BufferGeometry) {
  const index = geometry.index.array as Array<number>;
  for (let i = 0, il = index.length / 3; i < il; i++) {
    let x = index[i * 3];
    index[i * 3] = index[i * 3 + 2];
    index[i * 3 + 2] = x;
  }
  geometry.index.needsUpdate = true;
}

const gltfLoader = new CustomGLTFLoader();
// @ts-ignore
gltfLoader.setDRACOLoader(new DracoLoader());

export function toArrayBuffer(buf: any) {
  const arrayBuffer = new ArrayBuffer(buf.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return arrayBuffer;
}

export function loadGLTFModel(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    axios.get(url, { responseType: "arraybuffer" }).then((response: any) => {
      const arrayBuffer = toArrayBuffer(response.data);
      // @ts-ignore
      gltfLoader.parse(
        arrayBuffer,
        "",
        (gltf: any) => {
          //console.log(gltf);
          resolve(gltf);
        },
        (error: any) => {
          //console.log(error);
          reject("Loader failed");
        }
      );
    });
  });
}

// TODO: Math 부분은 shared 로 합치는건 어떨까?
export function fixedVec3(vec: Vector3) {
  return new Vector3(+vec.x.toFixed(2), +vec.y.toFixed(2), +vec.z.toFixed(2));
}
export function fixedQuat(quat: Quaternion) {
  return new Quaternion(
    +quat.x.toFixed(2),
    +quat.y.toFixed(2),
    +quat.z.toFixed(2),
    +quat.w.toFixed(2)
  );
}

export function checkDiffVec(vec1: Vector3, vec2: Vector3) {
  if (
    Math.abs(vec1.x - vec2.x) +
      Math.abs(vec1.y - vec2.y) +
      Math.abs(vec1.z - vec2.z) >
    0.005
  ) {
    return true;
  }
  return false;
}
export function checkDiffQuat(quat1: Quaternion, quat2: Quaternion) {
  if (
    Math.abs(quat1.x - quat2.x) +
      Math.abs(quat1.y - quat2.y) +
      Math.abs(quat1.z - quat2.z) +
      Math.abs(quat1.w - quat2.w) >
    0.005
  ) {
    return true;
  }
  return false;
}

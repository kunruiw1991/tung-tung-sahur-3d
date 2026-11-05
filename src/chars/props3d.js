// 3D Voxel Drum-Clubs, Sleepy Sahur Cottages / Golden Totems (Tiers 1-3), Hub Trophies, Gear & 2D Pixel Icons
// Zero CJK text, metalness <= 0.20 on all materials.

import * as THREE from '../../vendor/three.module.min.js';
import { WEAPONS, resolveBossId, resolveWeaponId } from '../data/catalog.js';

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const BASE_POS = UNIT_BOX.attributes.position;
const BASE_NORM = UNIT_BOX.attributes.normal;
const BASE_INDEX = UNIT_BOX.index;

const _mat4 = new THREE.Matrix4();
const _normMat = new THREE.Matrix3();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scale = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _color = new THREE.Color();

let sharedMatteMaterial = null;
let sharedFlashMaterial = null;
const glowMaterialCache = new Map();
const iconDataUrlCache = new Map();

export function getMatteVoxelMaterial() {
  if (!sharedMatteMaterial) {
    sharedMatteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.66,
      metalness: 0.08,
      emissive: new THREE.Color(0x181c26),
      emissiveIntensity: 0.16,
    });
  }
  return sharedMatteMaterial;
}

export function getGlowVoxelMaterial(emissiveHex = 0xffc940, intensity = 0.34) {
  const clampedIntensity = Math.max(0.15, Math.min(0.44, Number(intensity) || 0.34));
  const key = `${emissiveHex}:${clampedIntensity.toFixed(2)}`;
  let mat = glowMaterialCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.36,
      metalness: 0.16,
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: clampedIntensity,
    });
    glowMaterialCache.set(key, mat);
  }
  return mat;
}

export function getFlashVoxelMaterial() {
  if (!sharedFlashMaterial) {
    sharedFlashMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff9db,
      roughness: 0.32,
      metalness: 0.12,
      emissive: new THREE.Color(0xffe066),
      emissiveIntensity: 0.44,
    });
  }
  return sharedFlashMaterial;
}

export function createSafeSpriteMaterial(options = {}) {
  return new THREE.SpriteMaterial({
    transparent: true,
    depthWrite: false,
    ...options,
    toneMapped: false,
    fog: false,
  });
}

export function mergeVoxelBoxes(boxes) {
  const count = boxes.length;
  const vertCount = count * 24;
  const idxCount = count * 36;

  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const indices = vertCount > 65535 ? new Uint32Array(idxCount) : new Uint16Array(idxCount);

  for (let i = 0; i < count; i++) {
    const b = boxes[i];
    const [sx, sy, sz] = b.s;
    const [px, py, pz] = b.p;
    _pos.set(px, py, pz);
    if (b.r) {
      _euler.set(b.r[0] || 0, b.r[1] || 0, b.r[2] || 0);
      _quat.setFromEuler(_euler);
    } else {
      _quat.identity();
    }
    _scale.set(sx, sy, sz);
    _mat4.compose(_pos, _quat, _scale);
    _normMat.getNormalMatrix(_mat4);

    _color.set(b.c !== undefined ? b.c : 0xffffff);
    const boost = b.glow ? 1.62 : 1.0;
    const cr = _color.r * boost;
    const cg = _color.g * boost;
    const cb = _color.b * boost;

    const vBase = i * 24;
    for (let v = 0; v < 24; v++) {
      const outIdx = (vBase + v) * 3;
      _v3.fromBufferAttribute(BASE_POS, v).applyMatrix4(_mat4);
      positions[outIdx] = _v3.x;
      positions[outIdx + 1] = _v3.y;
      positions[outIdx + 2] = _v3.z;

      _v3.fromBufferAttribute(BASE_NORM, v).applyMatrix3(_normMat).normalize();
      normals[outIdx] = _v3.x;
      normals[outIdx + 1] = _v3.y;
      normals[outIdx + 2] = _v3.z;

      colors[outIdx] = cr;
      colors[outIdx + 1] = cg;
      colors[outIdx + 2] = cb;
    }

    const iBase = i * 36;
    for (let k = 0; k < 36; k++) {
      indices[iBase + k] = vBase + BASE_INDEX.getX(k);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

export function buildVoxelGroup(boxes, opts = {}) {
  const {
    name = 'voxel_group',
    glowEmissive = 0xffc940,
    glowIntensity = 0.34,
    castShadow = false,
    receiveShadow = false,
    singleMesh = true,
    userData = null,
  } = opts;

  const group = new THREE.Group();
  group.name = name;
  if (userData) Object.assign(group.userData, userData);

  const meshes = [];
  if (singleMesh && boxes.length > 0) {
    let glowCount = 0;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].glow) glowCount++;
    }
    const allGlow = glowCount === boxes.length;
    const geo = mergeVoxelBoxes(boxes);
    const mat = allGlow
      ? getGlowVoxelMaterial(glowEmissive, glowIntensity)
      : getMatteVoxelMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `${name}_mesh`;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    mesh.userData.baseMaterial = mat;
    if (userData) Object.assign(mesh.userData, userData);
    group.add(mesh);
    meshes.push(mesh);
    group.userData.voxelMeshes = meshes;
    return group;
  }

  const matteBoxes = [];
  const glowBoxes = [];
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].glow) glowBoxes.push(boxes[i]);
    else matteBoxes.push(boxes[i]);
  }

  if (matteBoxes.length > 0) {
    const matteGeo = mergeVoxelBoxes(matteBoxes);
    const matteMat = getMatteVoxelMaterial();
    const matteMesh = new THREE.Mesh(matteGeo, matteMat);
    matteMesh.name = `${name}_matte`;
    matteMesh.castShadow = castShadow;
    matteMesh.receiveShadow = receiveShadow;
    matteMesh.userData.baseMaterial = matteMat;
    if (userData) Object.assign(matteMesh.userData, userData);
    group.add(matteMesh);
    meshes.push(matteMesh);
  }

  if (glowBoxes.length > 0) {
    const glowGeo = mergeVoxelBoxes(glowBoxes);
    const glowMat = getGlowVoxelMaterial(glowEmissive, glowIntensity);
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.name = `${name}_glow`;
    glowMesh.castShadow = castShadow;
    glowMesh.receiveShadow = receiveShadow;
    glowMesh.userData.baseMaterial = glowMat;
    if (userData) Object.assign(glowMesh.userData, userData);
    group.add(glowMesh);
    meshes.push(glowMesh);
  }

  group.userData.voxelMeshes = meshes;
  return group;
}

// ---------------------------------------------------------------------------
// 1. 3D Voxel Sahur Drum-Clubs (all 5 canonical WEAPONS in catalog.js)
// Origin (0,0,0) sits cleanly in Tung Tung's right hand grip; club extends +Y
// ---------------------------------------------------------------------------

function getWeaponBoxes(rawWeaponId) {
  const weaponId = resolveWeaponId(rawWeaponId);
  switch (weaponId) {
    case 'wooden_kentungan_bat':
      return {
        glowEmissive: 0xffc038,
        glowIntensity: 0.28,
        boxes: [
          // Warm teakwood Kentungan drum-club grip & pommel
          { s: [0.13, 0.34, 0.13], p: [0, 0.02, 0], c: 0x7c4d25 },
          { s: [0.17, 0.10, 0.17], p: [0, -0.14, 0], c: 0xffd43b, glow: true },
          // Cylindrical carved kentungan barrel with dark resonance slit & golden rings
          { s: [0.22, 0.56, 0.22], p: [0, 0.48, 0], c: 0xb87c44 },
          { s: [0.24, 0.08, 0.24], p: [0, 0.24, 0], c: 0xffd43b, glow: true },
          { s: [0.24, 0.08, 0.24], p: [0, 0.72, 0], c: 0xffd43b, glow: true },
          { s: [0.06, 0.34, 0.24], p: [0, 0.48, 0], c: 0x3b230a },
          { s: [0.18, 0.10, 0.18], p: [0, 0.80, 0], c: 0xc98d52 },
        ],
      };

    case 'bronze_temple_gong':
      return {
        glowEmissive: 0xff922b,
        glowIntensity: 0.34,
        boxes: [
          // Red-lacquered temple grip + golden bands
          { s: [0.12, 0.54, 0.12], p: [0, 0.14, 0], c: 0xc92a2a },
          { s: [0.18, 0.12, 0.18], p: [0, -0.16, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.38, 0], c: 0xffd43b, glow: true },
          // Gleaming Bronze Temple Gong disc & raised boss center
          { s: [0.16, 0.48, 0.48], p: [0, 0.72, 0], c: 0xd97706, glow: true },
          { s: [0.20, 0.36, 0.36], p: [0, 0.72, 0], c: 0xf59f00, glow: true },
          { s: [0.26, 0.18, 0.18], p: [0, 0.72, 0], c: 0xfff3bf, glow: true },
          // Red silk tassel
          { s: [0.08, 0.18, 0.08], p: [0, 0.44, 0.22], c: 0xff4d6d, glow: true },
        ],
      };

    case 'golden_sahur_mallet':
      return {
        glowEmissive: 0xffb830,
        glowIntensity: 0.36,
        boxes: [
          // Royal shaft with golden rings
          { s: [0.12, 0.74, 0.12], p: [0, 0.24, 0], c: 0x6e421b },
          { s: [0.18, 0.10, 0.18], p: [0, -0.14, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.26, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.56, 0], c: 0xffd43b, glow: true },
          // Twin-headed Golden Sahur Mallet drumhead
          { s: [0.36, 0.36, 0.62], p: [0, 0.80, 0], c: 0xffd43b, glow: true },
          { s: [0.38, 0.28, 0.08], p: [0, 0.80, 0.32], c: 0xfff9db, glow: true },
          { s: [0.38, 0.28, 0.08], p: [0, 0.80, -0.32], c: 0xfff9db, glow: true },
          { s: [0.18, 0.16, 0.18], p: [0, 1.02, 0], c: 0xff922b, glow: true },
        ],
      };

    case 'neon_thunder_taiko':
      return {
        glowEmissive: 0x7950f2,
        glowIntensity: 0.36,
        boxes: [
          // Heavy runed handle
          { s: [0.13, 0.78, 0.13], p: [0, 0.22, 0], c: 0x3b384a },
          { s: [0.18, 0.12, 0.18], p: [0, -0.16, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.20, 0], c: 0x3bc9db, glow: true },
          { s: [0.16, 0.08, 0.16], p: [0, 0.48, 0], c: 0x3bc9db, glow: true },
          // Giant purple-cyan Neon Thunder Taiko War-Drum head
          { s: [0.42, 0.40, 0.68], p: [0, 0.82, 0], c: 0x6741d9, glow: true },
          { s: [0.45, 0.12, 0.72], p: [0, 0.82, 0], c: 0x9775fa, glow: true },
          // Glowing cyan taiko strike faces (+Z and -Z)
          { s: [0.34, 0.30, 0.08], p: [0, 0.82, 0.36], c: 0x3bc9db, glow: true },
          { s: [0.20, 0.18, 0.10], p: [0, 0.82, 0.38], c: 0xe3fafc, glow: true },
          { s: [0.34, 0.30, 0.08], p: [0, 0.82, -0.36], c: 0x3bc9db, glow: true },
          { s: [0.20, 0.18, 0.10], p: [0, 0.82, -0.38], c: 0xe3fafc, glow: true },
          // Blazing gold lightning crest on top & sides
          { s: [0.46, 0.14, 0.20], p: [0, 0.84, 0], c: 0xffd43b, glow: true },
          { s: [0.16, 0.14, 0.24], p: [0, 1.06, 0], c: 0xffd43b, glow: true },
        ],
      };

    case 'rainbow_mega_hammer':
    default:
      return {
        glowEmissive: 0xff99cc,
        glowIntensity: 0.38,
        boxes: [
          // White-gold shaft & star pommel
          { s: [0.13, 0.74, 0.13], p: [0, 0.22, 0], c: 0xf8f9fa },
          { s: [0.20, 0.14, 0.20], p: [0, -0.18, 0], c: 0xffd43b, glow: true },
          { s: [0.18, 0.10, 0.18], p: [0, 0.24, 0], c: 0x39d5ff, glow: true },
          { s: [0.18, 0.10, 0.18], p: [0, 0.50, 0], c: 0xff6b9d, glow: true },
          // Prismatic Rainbow Mega Sahur Drum-Hammer barrel
          { s: [0.44, 0.44, 0.14], p: [0, 0.84, -0.28], c: 0xff595e, glow: true },
          { s: [0.44, 0.44, 0.14], p: [0, 0.84, -0.14], c: 0xff922b, glow: true },
          { s: [0.46, 0.46, 0.14], p: [0, 0.84, 0.0], c: 0xffd43b, glow: true },
          { s: [0.44, 0.44, 0.14], p: [0, 0.84, 0.14], c: 0x51cf66, glow: true },
          { s: [0.44, 0.44, 0.14], p: [0, 0.84, 0.28], c: 0x39d5ff, glow: true },
          // Radiant white-gold drumheads & star crown topper
          { s: [0.36, 0.36, 0.08], p: [0, 0.84, 0.38], c: 0xfff9db, glow: true },
          { s: [0.36, 0.36, 0.08], p: [0, 0.84, -0.38], c: 0xfff9db, glow: true },
          { s: [0.22, 0.22, 0.22], p: [0, 1.14, 0], r: [0, 0, 0.785], c: 0xffffff, glow: true },
        ],
      };
  }
}

export function buildWeaponMesh(weaponId = 'wooden_kentungan_bat') {
  const validId = resolveWeaponId(weaponId);
  const spec = getWeaponBoxes(validId);
  return buildVoxelGroup(spec.boxes, {
    name: `weapon_${validId}`,
    glowEmissive: spec.glowEmissive,
    glowIntensity: spec.glowIntensity,
    castShadow: false,
    userData: { kind: 'weapon', weaponId: validId },
  });
}

// ---------------------------------------------------------------------------
// 2. 3D Sleepy Sahur Cottages / Golden Sahur Totems (Tier 1..3)
// Rooted at y = 0 so they sit flush on the 4 Hub Plaza Pads!
// ---------------------------------------------------------------------------

function normalizePotTier(tier) {
  if (tier === 1 || tier === 'glow_pot' || tier === 'totem_tier_1') return 1;
  if (tier === 2 || tier === 'crystal_pot' || tier === 'totem_tier_2') return 2;
  if (tier === 3 || tier === 'ultimate_pot' || tier === 'totem_tier_3') return 3;
  return 0;
}

export function buildFlowerpotMesh(tier = 1) {
  const t = normalizePotTier(tier);
  if (t <= 0) {
    const empty = new THREE.Group();
    empty.name = 'flowerpot_tier_0';
    empty.userData = { kind: 'flowerpot', tier: 0 };
    return empty;
  }

  if (t === 1) {
    // Tier 1: Wakeful Sahur Drum Totem — Warm Teakwood Kentungan Totem + Cappuccino Cup & Golden Lanterns
    const boxes = [
      // Golden stone base + warm teakwood drum pedestal
      { s: [0.84, 0.16, 0.84], p: [0, 0.08, 0], c: 0xd97348 },
      { s: [0.92, 0.12, 0.92], p: [0, 0.22, 0], c: 0xffd43b, glow: true },
      { s: [0.76, 0.10, 0.76], p: [0, 0.32, 0], c: 0x40c057 },
      // Carved kentungan totem body & happy helper face
      { s: [0.46, 0.64, 0.46], p: [0, 0.66, 0], c: 0xb87c44 },
      { s: [0.08, 0.36, 0.48], p: [0, 0.66, 0], c: 0x3b230a },
      // Cute Cappuccino roof cap + glowing golden drum stars
      { s: [0.68, 0.18, 0.68], p: [0, 1.06, 0], c: 0xffffff, glow: true },
      { s: [0.54, 0.14, 0.54], p: [0, 1.20, 0], c: 0xd99b66 },
      { s: [0.22, 0.22, 0.22], p: [0, 1.36, 0], c: 0xffd43b, glow: true },
      { s: [0.16, 0.18, 0.16], p: [-0.30, 0.92, 0.20], c: 0xffec99, glow: true },
      { s: [0.16, 0.18, 0.16], p: [0.30, 0.92, -0.20], c: 0xff922b, glow: true },
    ];
    return buildVoxelGroup(boxes, {
      name: 'flowerpot_tier_1',
      glowEmissive: 0xffb830,
      glowIntensity: 0.36,
      userData: { kind: 'flowerpot', tier: 1 },
    });
  }

  if (t === 2) {
    // Tier 2: Dancing Brainrot Band Stand — Gilded cobalt stage + twin Taiko drums + glowing star prism
    const boxes = [
      { s: [0.92, 0.14, 0.92], p: [0, 0.07, 0], c: 0xffd43b, glow: true },
      { s: [1.02, 0.24, 1.02], p: [0, 0.26, 0], c: 0x1971c2 },
      { s: [1.10, 0.12, 1.10], p: [0, 0.44, 0], c: 0xffd43b, glow: true },
      // Central golden totem pillar
      { s: [0.34, 0.62, 0.34], p: [0, 0.78, 0], c: 0xb87c44 },
      // Twin side Taiko drums (cyan & pink)
      { s: [0.32, 0.38, 0.32], p: [-0.34, 1.12, 0], r: [0, 0, 0.32], c: 0x39d5ff, glow: true },
      { s: [0.32, 0.38, 0.32], p: [0.34, 1.12, 0], r: [0, 0, -0.32], c: 0xff6b9d, glow: true },
      // Top golden gong & floating star crystal
      { s: [0.46, 0.46, 0.18], p: [0, 1.34, 0], c: 0xffd43b, glow: true },
      { s: [0.26, 0.26, 0.26], p: [0, 1.72, 0], r: [0.6, 0.6, 0.4], c: 0xffe066, glow: true },
    ];
    return buildVoxelGroup(boxes, {
      name: 'flowerpot_tier_2',
      glowEmissive: 0x4dabf7,
      glowIntensity: 0.35,
      userData: { kind: 'flowerpot', tier: 2 },
    });
  }

  // Tier 3: Ultimate Golden Sahur Tower!
  // Stepped golden Sahur drum pagoda with rainbow corner drums & apex Rainbow Star Topper!
  const baseBoxes = [
    { s: [0.24, 0.10, 0.24], p: [-0.52, 0.05, -0.52], c: 0xffd43b, glow: true },
    { s: [0.24, 0.10, 0.24], p: [0.52, 0.05, -0.52], c: 0xffd43b, glow: true },
    { s: [0.24, 0.10, 0.24], p: [-0.52, 0.05, 0.52], c: 0xffd43b, glow: true },
    { s: [0.24, 0.10, 0.24], p: [0.52, 0.05, 0.52], c: 0xffd43b, glow: true },
    { s: [1.34, 0.18, 1.34], p: [0, 0.18, 0], c: 0x0c8599 },
    { s: [1.48, 0.12, 1.48], p: [0, 0.32, 0], c: 0x15aabf },
    { s: [1.52, 0.06, 1.52], p: [0, 0.40, 0], c: 0xffd43b, glow: true },
    { s: [1.28, 0.10, 1.28], p: [0, 0.44, 0], c: 0x40c057 },

    // Pagoda Step 1
    { s: [1.08, 0.32, 1.08], p: [0, 0.64, 0], c: 0xffb830, glow: true },
    { s: [1.14, 0.18, 0.52], p: [0, 0.64, 0], c: 0xfff3bf, glow: true },
    { s: [0.52, 0.18, 1.14], p: [0, 0.64, 0], c: 0xfff3bf, glow: true },
    { s: [0.20, 0.20, 0.20], p: [-0.52, 0.68, 0.52], c: 0xff595e, glow: true },
    { s: [0.20, 0.20, 0.20], p: [0.52, 0.68, 0.52], c: 0x39d5ff, glow: true },
    { s: [0.20, 0.20, 0.20], p: [-0.52, 0.68, -0.52], c: 0x51cf66, glow: true },
    { s: [0.20, 0.20, 0.20], p: [0.52, 0.68, -0.52], c: 0xb197fc, glow: true },

    // Pagoda Step 2
    { s: [0.84, 0.32, 0.84], p: [0, 0.96, 0], c: 0xffd43b, glow: true },
    { s: [0.90, 0.16, 0.38], p: [0, 0.96, 0], c: 0xffffff, glow: true },
    { s: [0.38, 0.16, 0.90], p: [0, 0.96, 0], c: 0xffffff, glow: true },
    { s: [0.16, 0.16, 0.16], p: [-0.40, 1.00, 0.40], c: 0xff922b, glow: true },
    { s: [0.16, 0.16, 0.16], p: [0.40, 1.00, 0.40], c: 0xff6b9d, glow: true },
    { s: [0.16, 0.16, 0.16], p: [-0.40, 1.00, -0.40], c: 0x66d9e8, glow: true },
    { s: [0.16, 0.16, 0.16], p: [0.40, 1.00, -0.40], c: 0xffe066, glow: true },

    // Pagoda Step 3
    { s: [0.60, 0.30, 0.60], p: [0, 1.27, 0], c: 0xff922b, glow: true },
    { s: [0.66, 0.15, 0.28], p: [0, 1.27, 0], c: 0xfff9db, glow: true },
    { s: [0.28, 0.15, 0.66], p: [0, 1.27, 0], c: 0xfff9db, glow: true },

    // Pagoda Step 4
    { s: [0.38, 0.26, 0.38], p: [0, 1.55, 0], c: 0xffec99, glow: true },
    { s: [0.42, 0.12, 0.20], p: [0, 1.55, 0], c: 0xffffff, glow: true },
    { s: [0.20, 0.12, 0.42], p: [0, 1.55, 0], c: 0xffffff, glow: true },

    // Apex Rainbow Sahur Drum-Star Topper (y ~ 1.98, merged into 1 single draw call!)
    { s: [0.30, 0.30, 0.18], p: [0, 1.98, 0], c: 0xfff9db, glow: true },
    { s: [0.54, 0.16, 0.14], p: [0, 1.98, 0], c: 0xffd43b, glow: true },
    { s: [0.16, 0.54, 0.14], p: [0, 1.98, 0], c: 0xffd43b, glow: true },
    { s: [0.40, 0.14, 0.12], p: [0, 1.98, 0], r: [0, 0, 0.785], c: 0xff6b9d, glow: true },
    { s: [0.14, 0.40, 0.12], p: [0, 1.98, 0], r: [0, 0, 0.785], c: 0x39d5ff, glow: true },
  ];

  return buildVoxelGroup(baseBoxes, {
    name: 'flowerpot_tier_3',
    glowEmissive: 0xffc038,
    glowIntensity: 0.40,
    userData: { kind: 'flowerpot', tier: 3 },
  });
}

// ---------------------------------------------------------------------------
// 3. 3D Hub Golden Brainrot Trophies (for the 4 Trophy Stage Pedestals)
// ---------------------------------------------------------------------------

export function buildTrophyMesh(rawTitanId = 'tralalero_tralala') {
  const titanId = resolveBossId(rawTitanId);
  const accentMap = {
    tralalero_tralala: 0x39d5ff,
    bombardiro_crocodilo: 0x51cf66,
    brr_brr_patapim: 0x94d82d,
    golden_sahur_king: 0xff4d6d,
  };
  const accent = accentMap[titanId] || 0x39d5ff;

  const boxes = [
    { s: [0.76, 0.12, 0.76], p: [0, 0.06, 0], c: 0x3b384a },
    { s: [0.64, 0.10, 0.64], p: [0, 0.17, 0], c: 0xffd43b, glow: true },
    { s: [0.70, 0.08, 0.24], p: [0, 0.17, 0], c: 0xffec99, glow: true },
    { s: [0.24, 0.08, 0.70], p: [0, 0.17, 0], c: 0xffec99, glow: true },
    { s: [0.22, 0.28, 0.22], p: [0, 0.36, 0], c: 0xffb830, glow: true },
    { s: [0.30, 0.10, 0.30], p: [0, 0.52, 0], c: accent, glow: true },
    { s: [0.54, 0.38, 0.54], p: [0, 0.76, 0], c: 0xffd43b, glow: true },
    { s: [0.62, 0.10, 0.62], p: [0, 0.96, 0], c: 0xfff3bf, glow: true },
    { s: [0.10, 0.26, 0.12], p: [-0.36, 0.78, 0], c: 0xffec99, glow: true },
    { s: [0.10, 0.26, 0.12], p: [0.36, 0.78, 0], c: 0xffec99, glow: true },
    { s: [0.20, 0.20, 0.08], p: [0, 0.76, 0.28], c: accent, glow: true },
  ];

  if (titanId === 'tralalero_tralala') {
    // Blue Sneaker + Shark Fin topper
    boxes.push(
      { s: [0.34, 0.22, 0.42], p: [0, 1.12, 0.04], c: 0x228be6, glow: true },
      { s: [0.36, 0.08, 0.44], p: [0, 1.04, 0.04], c: 0xffffff, glow: true },
      { s: [0.12, 0.24, 0.22], p: [0, 1.30, -0.04], r: [-0.25, 0, 0], c: 0x39d5ff, glow: true }
    );
  } else if (titanId === 'bombardiro_crocodilo') {
    // Spinning Propeller + Crocodile Snout topper
    boxes.push(
      { s: [0.34, 0.24, 0.38], p: [0, 1.14, 0], c: 0x51cf66, glow: true },
      { s: [0.56, 0.08, 0.12], p: [0, 1.32, 0], c: 0xffd43b, glow: true },
      { s: [0.12, 0.08, 0.56], p: [0, 1.32, 0], c: 0xffd43b, glow: true }
    );
  } else if (titanId === 'brr_brr_patapim') {
    // Leafy Canopy + Treant Trunk topper
    boxes.push(
      { s: [0.22, 0.26, 0.22], p: [0, 1.14, 0], c: 0x8f5a2a },
      { s: [0.46, 0.22, 0.46], p: [0, 1.32, 0], c: 0x51cf66, glow: true },
      { s: [0.28, 0.16, 0.28], p: [0, 1.46, 0], c: 0x94d82d, glow: true }
    );
  } else {
    // Golden Sahur King Crown topper
    boxes.push(
      { s: [0.44, 0.18, 0.44], p: [0, 1.10, 0], c: 0xffd43b, glow: true },
      { s: [0.12, 0.18, 0.12], p: [-0.16, 1.26, 0.16], c: 0xfff3bf, glow: true },
      { s: [0.12, 0.22, 0.12], p: [0, 1.28, 0.16], c: 0xff4d6d, glow: true },
      { s: [0.12, 0.18, 0.12], p: [0.16, 1.26, 0.16], c: 0xfff3bf, glow: true },
      { s: [0.14, 0.22, 0.14], p: [0, 1.28, 0], c: 0xffffff, glow: true }
    );
  }

  return buildVoxelGroup(boxes, {
    name: `trophy_${titanId}`,
    glowEmissive: 0xffc038,
    glowIntensity: 0.38,
    userData: { kind: 'trophy', titanId },
  });
}

// ---------------------------------------------------------------------------
// 4. Reusable Hero Armor & Cappuccino Foam Spring Cloud Builders
// ---------------------------------------------------------------------------

export function buildBlazingHelmetMesh() {
  const boxes = [
    { s: [0.76, 0.18, 0.74], p: [0, 0.30, 0], c: 0xffd43b, glow: true },
    { s: [0.68, 0.10, 0.66], p: [0, 0.42, 0], c: 0xfff3bf, glow: true },
    { s: [0.78, 0.12, 0.16], p: [0, 0.20, 0.32], c: 0xffb830, glow: true },
    { s: [0.18, 0.18, 0.10], p: [0, 0.26, 0.39], c: 0x39d5ff, glow: true },
    { s: [0.10, 0.10, 0.08], p: [-0.18, 0.26, 0.38], c: 0xff6b9d, glow: true },
    { s: [0.10, 0.10, 0.08], p: [0.18, 0.26, 0.38], c: 0x51cf66, glow: true },
    { s: [0.76, 0.38, 0.14], p: [0, 0.06, -0.32], c: 0xffb830, glow: true },
    { s: [0.12, 0.34, 0.56], p: [-0.36, 0.06, -0.04], c: 0xffd43b, glow: true },
    { s: [0.12, 0.34, 0.56], p: [0.36, 0.06, -0.04], c: 0xffd43b, glow: true },
    { s: [0.16, 0.26, 0.16], p: [-0.46, 0.28, -0.02], r: [0, 0, 0.42], c: 0xffec99, glow: true },
    { s: [0.12, 0.22, 0.12], p: [-0.56, 0.46, -0.06], r: [-0.2, 0, 0.25], c: 0xffffff, glow: true },
    { s: [0.16, 0.26, 0.16], p: [0.46, 0.28, -0.02], r: [0, 0, -0.42], c: 0xffec99, glow: true },
    { s: [0.12, 0.22, 0.12], p: [0.56, 0.46, -0.06], r: [-0.2, 0, -0.25], c: 0xffffff, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'blazing_gold_helmet',
    glowEmissive: 0xffc038,
    glowIntensity: 0.40,
    userData: { kind: 'gear', gear: 'helmet' },
  });
}

export function buildKingCrownMesh() {
  const boxes = [
    { s: [0.58, 0.14, 0.58], p: [0, 0.07, 0], c: 0xffd43b, glow: true },
    { s: [0.12, 0.18, 0.12], p: [-0.22, 0.21, 0.22], c: 0xfff3bf, glow: true },
    { s: [0.14, 0.24, 0.12], p: [0, 0.24, 0.24], c: 0xffd43b, glow: true },
    { s: [0.12, 0.18, 0.12], p: [0.22, 0.21, 0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.18, 0.12], p: [-0.22, 0.21, -0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.18, 0.12], p: [0.22, 0.21, -0.22], c: 0xfff3bf, glow: true },
    { s: [0.12, 0.12, 0.08], p: [0, 0.10, 0.29], c: 0xff4d6d, glow: true },
    { s: [0.10, 0.10, 0.08], p: [-0.18, 0.09, 0.28], c: 0x39d5ff, glow: true },
    { s: [0.10, 0.10, 0.08], p: [0.18, 0.09, 0.28], c: 0x51cf66, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'king_crown',
    glowEmissive: 0xffc940,
    glowIntensity: 0.42,
    userData: { kind: 'gear', gear: 'crown' },
  });
}

export function buildStarCapeMesh() {
  const boxes = [
    { s: [0.56, 0.16, 0.07], p: [0, -0.08, 0], c: 0x9775fa, glow: true },
    { s: [0.60, 0.18, 0.07], p: [0, -0.25, -0.02], c: 0xf06595, glow: true },
    { s: [0.64, 0.18, 0.07], p: [0, -0.43, -0.04], c: 0xffd43b, glow: true },
    { s: [0.68, 0.18, 0.07], p: [0, -0.61, -0.06], c: 0x39d5ff, glow: true },
    { s: [0.22, 0.22, 0.09], p: [0, -0.34, -0.05], r: [0, 0, 0.785], c: 0xfff9db, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'royal_star_cape',
    glowEmissive: 0xd0bfff,
    glowIntensity: 0.32,
    userData: { kind: 'gear', gear: 'starCape' },
  });
}

export function buildWingedBootOverlay(side = 1) {
  // Complete leg + Tralalero Blue Sneaker Zoom Boot (swaps 1 mesh -> 1 mesh, 0 extra draw calls!)
  const boxes = [
    { s: [0.22, 0.30, 0.22], p: [0, -0.15, 0], c: 0x9c6644 },
    { s: [0.28, 0.20, 0.35], p: [0, -0.36, 0.04], c: 0x1c7ed6, glow: true },
    { s: [0.30, 0.07, 0.37], p: [0, -0.45, 0.04], c: 0xffffff, glow: true },
    { s: [0.08, 0.08, 0.22], p: [side * 0.14, -0.35, 0.05], c: 0xffffff, glow: true },
    // Crisp feathered zoom wing on outer ankle
    { s: [0.08, 0.18, 0.24], p: [side * 0.16, -0.26, -0.06], r: [0.25, side * 0.22, 0], c: 0x39d5ff, glow: true },
    { s: [0.07, 0.13, 0.18], p: [side * 0.20, -0.18, -0.15], r: [0.35, side * 0.28, 0], c: 0xffe066, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: `winged_boot_${side < 0 ? 'r' : 'l'}`,
    glowEmissive: 0x66d9e8,
    glowIntensity: 0.34,
    userData: { kind: 'gear', gear: 'speedBoots' },
  });
}

export function buildRainbowSpringCloudMesh() {
  // Fluffy 3D Cappuccino Foam Spring Cloud spawned under Tung Tung on Kid-Safe Boss boings!
  const boxes = [
    // Golden espresso spring coil underneath
    { s: [0.65, 0.12, 0.65], p: [0, 0.08, 0], c: 0xffd43b, glow: true },
    { s: [0.48, 0.18, 0.48], p: [0, 0.22, 0], c: 0xd99b66, glow: true },
    // Plush white cappuccino milk-foam center pillows + cinnamon swirl
    { s: [1.55, 0.42, 1.35], p: [0, 0.48, 0], c: 0xffffff, glow: true },
    { s: [1.10, 0.34, 1.00], p: [0, 0.68, 0], c: 0xfff9db, glow: true },
    { s: [0.64, 0.08, 0.64], p: [0, 0.86, 0], c: 0xd99b66, glow: true },
    // 6 Rainbow foam puffballs ringing the cloud cushion
    { s: [0.58, 0.36, 0.58], p: [-0.72, 0.46, 0.38], c: 0xff595e, glow: true },
    { s: [0.58, 0.36, 0.58], p: [-0.76, 0.46, -0.32], c: 0xff922b, glow: true },
    { s: [0.58, 0.36, 0.58], p: [0, 0.48, 0.68], c: 0xffd43b, glow: true },
    { s: [0.58, 0.36, 0.58], p: [0.72, 0.46, 0.38], c: 0x51cf66, glow: true },
    { s: [0.58, 0.36, 0.58], p: [0.76, 0.46, -0.32], c: 0x39d5ff, glow: true },
    { s: [0.58, 0.36, 0.58], p: [0, 0.48, -0.68], c: 0xb197fc, glow: true },
  ];
  return buildVoxelGroup(boxes, {
    name: 'rainbow_spring_cloud',
    glowEmissive: 0xfff0cc,
    glowIntensity: 0.36,
    castShadow: false,
    userData: { kind: 'spring_cloud' },
  });
}

// ---------------------------------------------------------------------------
// 5. Crisp 2D Pixel-Art Drum-Club Icons (for Roulette Wheel & HUD)
// Zero text calls so l10n_audit canvas hooks see 0 strings!
// ---------------------------------------------------------------------------

const PIXEL_ICON_SPECS = {
  wooden_kentungan_bat: {
    bgTop: '#fff3bf',
    bgBot: '#d97706',
    ring: '#7c4d25',
    palette: {
      O: '#3a2210',
      W: '#b87c44',
      D: '#8f5a2a',
      G: '#ffd43b',
      S: '#2b1708',
    },
    grid: [
      '................',
      '..........OOOO..',
      '.........OGGGGO.',
      '........OWWWWDWO',
      '.......OWWSSWWWO',
      '......OWWSSWWW..',
      '.....OWWSSWWO...',
      '....OGGGGGGO....',
      '....OOWWDOO.....',
      '...OOWDO........',
      '..OOWDO.........',
      '.OOGGO..........',
      '.OGGO...........',
      '..OO............',
      '................',
      '................',
    ],
  },
  bronze_temple_gong: {
    bgTop: '#fff9db',
    bgBot: '#f59f00',
    ring: '#d9480f',
    palette: {
      O: '#3b230a',
      G: '#ffd43b',
      Y: '#fff3bf',
      A: '#f08c00',
      R: '#e03131',
    },
    grid: [
      '.....OOOOOO.....',
      '...OOGYYYYGOO...',
      '..OGYAAAAAAYGO..',
      '..OGAOOOOOOAGO..',
      '..OGAOYYYYOAGO..',
      '..OGAOOOOOOAGO..',
      '...OOGAAAAGOO...',
      '.....OORRRO.....',
      '......ORRO......',
      '.....ORRO.......',
      '....ORRO........',
      '...OGGO.........',
      '..OGGO..........',
      '...OO...........',
      '................',
      '................',
    ],
  },
  golden_sahur_mallet: {
    bgTop: '#fff9db',
    bgBot: '#ffd43b',
    ring: '#e67700',
    palette: {
      O: '#3b230a',
      G: '#ffd43b',
      Y: '#fff9db',
      A: '#ff922b',
      W: '#8f5a2a',
    },
    grid: [
      '....OOOOOOOO....',
      '..OOYGGGGGGYOO..',
      '.OYGAAAAAAAAGYO.',
      '.OYGAGGGGGGAGYO.',
      '..OOYGGGGGGYOO..',
      '....OOOWWWOO....',
      '......OWWO......',
      '.....OOGGO......',
      '....OOWWO.......',
      '...OOWWO........',
      '..OOGGO.........',
      '.OOGGO..........',
      '..OOO...........',
      '................',
      '................',
      '................',
    ],
  },
  neon_thunder_taiko: {
    bgTop: '#f3f0ff',
    bgBot: '#9775fa',
    ring: '#5f3dc4',
    palette: {
      O: '#21183c',
      P: '#7950f2',
      V: '#b197fc',
      C: '#39d5ff',
      G: '#ffd43b',
      S: '#495057',
    },
    grid: [
      '......OOOOOO....',
      '.....OPVVVVPO...',
      '....OPCGGGGVPO..',
      '....OPCVVVVCPO..',
      '.....OPPPPPPO...',
      '......OOOSOOO...',
      '......OOSO......',
      '.....OOCO.......',
      '....OOSO........',
      '...OOCO.........',
      '..OOGO..........',
      '.OOGO...........',
      '..OO............',
      '................',
      '................',
      '................',
    ],
  },
  rainbow_mega_hammer: {
    bgTop: '#fff0f6',
    bgBot: '#ff85c0',
    ring: '#c2255c',
    palette: {
      O: '#2b193d',
      R: '#ff595e',
      A: '#ff922b',
      Y: '#ffd43b',
      E: '#51cf66',
      C: '#39d5ff',
      P: '#9775fa',
      W: '#ffffff',
    },
    grid: [
      '....OOOOOOOO....',
      '..OORAYECPWROO..',
      '.OWRAYECPWWYARO.',
      '.OWRAYECPWWYARO.',
      '..OORAYECPWROO..',
      '....OOOWWWOO....',
      '......OWWO......',
      '.....OOCWO......',
      '....OOYWO.......',
      '...OORWO........',
      '..OYYYO.........',
      '.OYYYO..........',
      '..OOO...........',
      '................',
      '................',
      '................',
    ],
  },
};

export function renderWeaponIconDataURL(weaponId = 'wooden_kentungan_bat', size = 128) {
  const validId = resolveWeaponId(weaponId);
  const pxSize = Math.max(32, Math.round(Number(size) || 128));
  const cacheKey = `${validId}:${pxSize}`;
  const cached = iconDataUrlCache.get(cacheKey);
  if (cached) return cached;

  const spec = PIXEL_ICON_SPECS[validId] || PIXEL_ICON_SPECS.wooden_kentungan_bat;

  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pxSize}" height="${pxSize}" viewBox="0 0 16 16"><rect width="16" height="16" rx="4" fill="${spec.bgBot}"/></svg>`;
    const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    iconDataUrlCache.set(cacheKey, fallback);
    return fallback;
  }

  const canvas = document.createElement('canvas');
  canvas.width = pxSize;
  canvas.height = pxSize;
  const ctx2d = canvas.getContext('2d');
  if (!ctx2d) return '';
  ctx2d.imageSmoothingEnabled = false;

  const r = pxSize * 0.46;
  const cx = pxSize * 0.5;
  const cy = pxSize * 0.5;
  const grad = ctx2d.createRadialGradient(cx, cy * 0.78, pxSize * 0.08, cx, cy, r);
  grad.addColorStop(0, spec.bgTop);
  grad.addColorStop(1, spec.bgBot);

  ctx2d.fillStyle = grad;
  ctx2d.beginPath();
  ctx2d.arc(cx, cy, r, 0, Math.PI * 2);
  ctx2d.fill();

  ctx2d.lineWidth = Math.max(3, Math.round(pxSize * 0.055));
  ctx2d.strokeStyle = spec.ring;
  ctx2d.stroke();

  const pad = Math.round(pxSize * 0.14);
  const cell = (pxSize - pad * 2) / 16;
  for (let row = 0; row < 16; row++) {
    const line = spec.grid[row];
    for (let col = 0; col < 16; col++) {
      const ch = line[col];
      if (!ch || ch === '.') continue;
      const fill = spec.palette[ch];
      if (!fill) continue;
      ctx2d.fillStyle = fill;
      const x0 = Math.floor(pad + col * cell);
      const y0 = Math.floor(pad + row * cell);
      const x1 = Math.floor(pad + (col + 1) * cell);
      const y1 = Math.floor(pad + (row + 1) * cell);
      ctx2d.fillRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0));
    }
  }

  ctx2d.fillStyle = '#ffffff';
  const sp = Math.max(3, Math.round(pxSize * 0.045));
  ctx2d.fillRect(Math.round(pxSize * 0.20), Math.round(pxSize * 0.22), sp, sp * 2.2);
  ctx2d.fillRect(Math.round(pxSize * 0.20 - sp * 0.6), Math.round(pxSize * 0.22 + sp * 0.6), sp * 2.2, sp);
  ctx2d.fillRect(Math.round(pxSize * 0.75), Math.round(pxSize * 0.72), sp, sp * 1.8);
  ctx2d.fillRect(Math.round(pxSize * 0.75 - sp * 0.4), Math.round(pxSize * 0.72 + sp * 0.4), sp * 1.8, sp);

  const url = canvas.toDataURL('image/png');
  iconDataUrlCache.set(cacheKey, url);
  return url;
}

export const buildWeaponPreviewDataURL = renderWeaponIconDataURL;

// Expressive 3D Warm-Teakwood Cylindrical Kentungan Log Hero: TUNG TUNG TUNG SAHUR!
// Features big googly cartoon eyes, wide cheerful smile, blue sneakers, and 5 swappable 3D Sahur Drum-Clubs.
// Zero CJK text, metalness <= 0.20, 100% deterministic.

import * as THREE from '../../vendor/three.module.min.js';
import { HUB_LAYOUT, WEAPON_ORDER, WEAPONS, resolveWeaponId } from '../data/catalog.js';
import {
  buildBlazingHelmetMesh,
  buildKingCrownMesh,
  buildStarCapeMesh,
  buildVoxelGroup,
  buildWeaponMesh,
  buildWingedBootOverlay,
  createSafeSpriteMaterial,
} from './props3d.js';

function createGroundShadowTexture() {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const c2d = canvas.getContext('2d');
  if (!c2d) return null;
  const grad = c2d.createRadialGradient(32, 32, 4, 32, 32, 30);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
  grad.addColorStop(0.65, 'rgba(15, 23, 42, 0.18)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
  c2d.fillStyle = grad;
  c2d.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHero(ctx = {}) {
  const group = new THREE.Group();
  group.name = 'hero_root';

  const spawn = HUB_LAYOUT.spawn;
  const initYaw = Math.atan2(spawn.facingX - spawn.x, spawn.facingZ - spawn.z);
  group.position.set(spawn.x, spawn.y, spawn.z);
  group.rotation.y = initYaw;

  const shadowTex = createGroundShadowTexture();
  let shadowDisc = null;
  if (shadowTex) {
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    });
    shadowDisc = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), shadowMat);
    shadowDisc.rotation.x = -Math.PI * 0.5;
    shadowDisc.position.y = 0.03;
    shadowDisc.renderOrder = 1;
    group.add(shadowDisc);
  }

  const bodyRig = new THREE.Group();
  bodyRig.name = 'hero_rig';
  group.add(bodyRig);

  // Teakwood legs in sporty bright blue sneakers with white soles!
  const legBoxes = [
    { s: [0.21, 0.30, 0.21], p: [0, -0.15, 0], c: 0x9c6644 },
    { s: [0.26, 0.17, 0.32], p: [0, -0.39, 0.04], c: 0x228be6 },
    { s: [0.28, 0.06, 0.34], p: [0, -0.46, 0.04], c: 0xffffff },
  ];

  const legL = new THREE.Group();
  legL.name = 'hero_leg_l';
  legL.position.set(0.16, 0.48, 0);
  bodyRig.add(legL);
  const baseLegL = buildVoxelGroup(legBoxes, { name: 'hero_base_leg_l' });
  legL.add(baseLegL);

  const legR = new THREE.Group();
  legR.name = 'hero_leg_r';
  legR.position.set(-0.16, 0.48, 0);
  bodyRig.add(legR);
  const baseLegR = buildVoxelGroup(legBoxes, { name: 'hero_base_leg_r' });
  legR.add(baseLegR);

  const speedBootL = buildWingedBootOverlay(1);
  speedBootL.visible = false;
  legL.add(speedBootL);

  const speedBootR = buildWingedBootOverlay(-1);
  speedBootR.visible = false;
  legR.add(speedBootR);

  // Cylindrical Warm-Teakwood Kentungan Log Torso with golden bands & carved slit
  const torsoPivot = new THREE.Group();
  torsoPivot.name = 'hero_torso_pivot';
  torsoPivot.position.set(0, 0.48, 0);
  bodyRig.add(torsoPivot);

  const torsoMesh = buildVoxelGroup(
    [
      // Rounded octagonal warm-teakwood kentungan drum log body
      { s: [0.58, 0.66, 0.48], p: [0, 0.34, 0], c: 0xb87c44 },
      { s: [0.48, 0.66, 0.58], p: [0, 0.34, 0], c: 0xa66a35 },
      // Golden Sahur drum rings at waist & chest
      { s: [0.62, 0.10, 0.62], p: [0, 0.08, 0], c: 0xffd43b, glow: true },
      { s: [0.60, 0.08, 0.60], p: [0, 0.60, 0], c: 0xffd43b, glow: true },
      // Vertical carved Kentungan acoustic slit + golden rhythm star emblem
      { s: [0.10, 0.36, 0.06], p: [0, 0.34, 0.28], c: 0x3b230a },
      { s: [0.18, 0.18, 0.07], p: [0, 0.36, 0.29], r: [0, 0, 0.785], c: 0xffd43b, glow: true },
    ],
    {
      name: 'hero_torso',
      glowEmissive: 0xffc940,
      glowIntensity: 0.34,
    }
  );
  torsoPivot.add(torsoMesh);

  // Rainbow Star Cape (hinged at shoulders on -Z)
  const capePivot = new THREE.Group();
  capePivot.name = 'hero_cape_pivot';
  capePivot.position.set(0, 0.62, -0.24);
  capePivot.rotation.x = 0.24;
  torsoPivot.add(capePivot);

  const starCapeMesh = buildStarCapeMesh();
  starCapeMesh.visible = false;
  capePivot.add(starCapeMesh);

  // Expressive Cylindrical Kentungan Log Head with big googly cartoon eyes & wide smile
  const headPivot = new THREE.Group();
  headPivot.name = 'hero_head_pivot';
  headPivot.position.set(0, 0.66, 0);
  torsoPivot.add(headPivot);

  const headMesh = buildVoxelGroup(
    [
      // Warm teakwood cylindrical log head + top grain ring
      { s: [0.64, 0.62, 0.56], p: [0, 0.31, 0], c: 0xc98d52 },
      { s: [0.56, 0.62, 0.64], p: [0, 0.31, 0], c: 0xb87c44 },
      { s: [0.52, 0.08, 0.52], p: [0, 0.63, 0], c: 0xdfc08a },
      { s: [0.30, 0.10, 0.30], p: [0, 0.65, 0], c: 0x8f5a2a },
      // Big expressive googly white cartoon eyes (+Z) + dark pupils + sparkle catchlights
      { s: [0.22, 0.22, 0.06], p: [-0.16, 0.36, 0.31], c: 0xffffff, glow: true },
      { s: [0.22, 0.22, 0.06], p: [0.16, 0.36, 0.31], c: 0xffffff, glow: true },
      { s: [0.11, 0.12, 0.07], p: [-0.15, 0.35, 0.32], c: 0x182232 },
      { s: [0.11, 0.12, 0.07], p: [0.15, 0.35, 0.32], c: 0x182232 },
      { s: [0.05, 0.05, 0.08], p: [-0.13, 0.39, 0.33], c: 0xffffff, glow: true },
      { s: [0.05, 0.05, 0.08], p: [0.17, 0.39, 0.33], c: 0xffffff, glow: true },
      // Expressive wooden eyebrows
      { s: [0.18, 0.06, 0.06], p: [-0.16, 0.50, 0.31], r: [0, 0, 0.10], c: 0x5c3412 },
      { s: [0.18, 0.06, 0.06], p: [0.16, 0.50, 0.31], r: [0, 0, -0.10], c: 0x5c3412 },
      // Rosy cheeks + wide cheerful Sahur grin
      { s: [0.11, 0.08, 0.05], p: [-0.26, 0.24, 0.31], c: 0xff8fab },
      { s: [0.11, 0.08, 0.05], p: [0.26, 0.24, 0.31], c: 0xff8fab },
      { s: [0.28, 0.10, 0.06], p: [0, 0.16, 0.31], c: 0x3b230a },
      { s: [0.22, 0.05, 0.07], p: [0, 0.19, 0.315], c: 0xffffff },
    ],
    {
      name: 'hero_head',
      glowEmissive: 0xffffff,
      glowIntensity: 0.26,
    }
  );
  headPivot.add(headMesh);

  const helmetMesh = buildBlazingHelmetMesh();
  helmetMesh.position.set(0, 0.30, 0);
  helmetMesh.visible = false;
  headPivot.add(helmetMesh);

  const crownMesh = buildKingCrownMesh();
  crownMesh.position.set(0, 0.64, 0);
  crownMesh.visible = false;
  headPivot.add(crownMesh);

  // Left Arm (+X) & Right Drum-Club Arm (-X)
  const armBoxes = [
    { s: [0.20, 0.34, 0.20], p: [0, -0.14, 0], c: 0xb87c44 },
    { s: [0.22, 0.07, 0.22], p: [0, -0.30, 0], c: 0xffd43b, glow: true },
    { s: [0.19, 0.14, 0.19], p: [0, -0.39, 0], c: 0x9c6644 },
  ];

  const armL = buildVoxelGroup(armBoxes, { name: 'hero_arm_l' });
  armL.position.set(0.39, 0.58, 0);
  armL.rotation.z = 0.10;
  torsoPivot.add(armL);

  const armR = buildVoxelGroup(armBoxes, { name: 'hero_arm_r' });
  armR.position.set(-0.39, 0.58, 0);
  armR.rotation.z = -0.10;
  torsoPivot.add(armR);

  // Right-hand Sahur Drum-Club Socket
  const weaponSocket = new THREE.Group();
  weaponSocket.name = 'hero_weapon_socket';
  weaponSocket.position.set(-0.06, -0.38, 0.12);
  weaponSocket.rotation.set(0.68, -0.22, -0.24);
  weaponSocket.scale.setScalar(1.18);
  armR.add(weaponSocket);

  // Pre-build & cache all 5 canonical Sahur Drum-Club models
  const weaponMeshes = new Map();
  for (let i = 0; i < WEAPON_ORDER.length; i++) {
    const wid = WEAPON_ORDER[i];
    const wMesh = buildWeaponMesh(wid);
    wMesh.visible = wid === 'wooden_kentungan_bat';
    weaponSocket.add(wMesh);
    weaponMeshes.set(wid, wMesh);
  }

  const cheerStarSprite = new THREE.Sprite(
    createSafeSpriteMaterial({ color: 0xffe066, opacity: 0.0 })
  );
  cheerStarSprite.scale.set(0.65, 0.65, 1);
  cheerStarSprite.position.set(0, 2.25, 0);
  cheerStarSprite.visible = false;
  group.add(cheerStarSprite);

  if (ctx && ctx.scene) {
    ctx.scene.add(group);
  }

  const equipment = {
    weaponId: 'wooden_kentungan_bat',
    helmet: false,
    speedBoots: false,
    starCape: false,
    crown: false,
  };

  let walkPhase = 0;
  let swingTimer = 0;
  const SWING_DURATION = 0.28;
  let boingTimer = 0;
  const BOING_DURATION = 1.05;
  let cheerTimer = 0;
  const CHEER_DURATION = 1.10;
  let shieldFlashTimer = 0;

  function applyEquipmentVisuals() {
    const canonicalWeapon = resolveWeaponId(equipment.weaponId);
    for (const [wid, mesh] of weaponMeshes.entries()) {
      mesh.visible = wid === canonicalWeapon;
    }
    helmetMesh.visible = Boolean(equipment.helmet);
    const hasBoots = Boolean(equipment.speedBoots);
    baseLegL.visible = !hasBoots;
    baseLegR.visible = !hasBoots;
    speedBootL.visible = hasBoots;
    speedBootR.visible = hasBoots;
    if (!hasBoots) {
      speedBootL.rotation.y = 0;
      speedBootR.rotation.y = 0;
    }
    starCapeMesh.visible = Boolean(equipment.starCape);
    crownMesh.visible = Boolean(equipment.crown);
    crownMesh.position.y = equipment.helmet ? 0.74 : 0.64;
  }

  function setEquipment(patch = {}) {
    if (!patch || typeof patch !== 'object') return { ...equipment };
    if (patch.weaponId !== undefined) {
      const resolved = resolveWeaponId(patch.weaponId);
      if (WEAPONS[resolved]) {
        equipment.weaponId = resolved;
      }
    }
    if (patch.helmet !== undefined) equipment.helmet = Boolean(patch.helmet);
    if (patch.speedBoots !== undefined) equipment.speedBoots = Boolean(patch.speedBoots);
    if (patch.starCape !== undefined) equipment.starCape = Boolean(patch.starCape);
    if (patch.crown !== undefined) equipment.crown = Boolean(patch.crown);
    applyEquipmentVisuals();
    return { ...equipment };
  }

  function getEquipment() {
    return { ...equipment };
  }

  function triggerSwing() {
    swingTimer = SWING_DURATION;
  }

  function triggerBoing() {
    boingTimer = BOING_DURATION;
  }

  function triggerCheer() {
    cheerTimer = CHEER_DURATION;
  }

  function flashShield() {
    shieldFlashTimer = 0.24;
  }

  function update(dt = 1 / 60, time = 0, moveState = {}) {
    const stepDt = Math.max(0, Math.min(0.1, Number(dt) || 0));
    const t = Number(time) || 0;

    const fallbackPlayer = ctx?.state?.player;
    const x = moveState.x ?? fallbackPlayer?.x ?? group.position.x;
    const y = moveState.y ?? fallbackPlayer?.y ?? group.position.y;
    const z = moveState.z ?? fallbackPlayer?.z ?? group.position.z;
    const yaw = moveState.yaw ?? fallbackPlayer?.yaw ?? group.rotation.y;
    const speedRatio = Math.max(0, Math.min(2.0, Number(moveState.speedRatio ?? 0)));
    const isSwinging = Boolean(moveState.swinging) || swingTimer > 0;
    const isBoinging = Boolean(moveState.boinging) || boingTimer > 0;

    group.position.set(x, y, z);
    group.rotation.set(0, yaw, 0);

    if (swingTimer > 0) swingTimer = Math.max(0, swingTimer - stepDt);
    if (boingTimer > 0) boingTimer = Math.max(0, boingTimer - stepDt);
    if (cheerTimer > 0) cheerTimer = Math.max(0, cheerTimer - stepDt);
    if (shieldFlashTimer > 0) {
      shieldFlashTimer = Math.max(0, shieldFlashTimer - stepDt);
      const pulse = 1 + Math.sin((shieldFlashTimer / 0.24) * Math.PI) * 0.14;
      helmetMesh.scale.setScalar(pulse);
    } else {
      helmetMesh.scale.setScalar(1);
    }

    if (speedRatio > 0.02) {
      const freq = 11.0 + speedRatio * 4.8;
      walkPhase += stepDt * freq;
    } else {
      walkPhase *= Math.max(0, 1 - stepDt * 10);
    }

    const stride = Math.min(1.25, speedRatio);
    const legSwing = Math.sin(walkPhase) * 0.78 * stride;
    const stepHop = speedRatio > 0.03 ? Math.abs(Math.sin(walkPhase)) * 0.11 * stride : 0;
    const idleBob = Math.sin(t * 3.8) * 0.028 * (1 - Math.min(1, stride));

    bodyRig.position.set(0, stepHop + idleBob, 0);
    bodyRig.rotation.set(stride * 0.09, 0, Math.cos(walkPhase) * 0.04 * stride);
    bodyRig.scale.set(1, 1, 1);

    legL.rotation.set(-legSwing, 0, 0);
    legR.rotation.set(legSwing, 0, 0);

    armL.rotation.set(legSwing * 0.85, 0, 0.12);
    armR.rotation.set(-0.30 - legSwing * 0.65, 0, -0.14);
    weaponSocket.rotation.set(0.68, -0.22, -0.24);

    torsoPivot.rotation.set(0, 0, 0);
    headPivot.rotation.set(
      Math.sin(t * 2.2) * 0.03,
      Math.sin(t * 1.5) * 0.05 * (1 - Math.min(1, stride)),
      0
    );

    if (equipment.starCape) {
      capePivot.rotation.x =
        0.24 +
        stride * 0.64 +
        (isBoinging ? 0.55 : 0) +
        Math.sin(t * (7 + stride * 9)) * (0.06 + stride * 0.14);
    }
    if (equipment.speedBoots) {
      const wingFlap = Math.sin(t * 16 + walkPhase * 1.5) * (0.06 + stride * 0.16);
      speedBootL.rotation.y = wingFlap;
      speedBootR.rotation.y = -wingFlap;
    }

    if (isSwinging) {
      const prog =
        swingTimer > 0
          ? 1 - swingTimer / SWING_DURATION
          : ((t * 3.4) % 1);
      if (prog < 0.28) {
        const u = prog / 0.28;
        armR.rotation.x = -0.30 - u * 1.85;
        armR.rotation.z = -0.12 - u * 0.22;
        weaponSocket.rotation.x = 0.96 - u * 0.25;
        torsoPivot.rotation.y = -u * 0.26;
      } else if (prog < 0.68) {
        const u = (prog - 0.28) / 0.40;
        const ease = 1 - Math.pow(1 - u, 3);
        armR.rotation.x = -2.15 + ease * 1.92;
        armR.rotation.z = -0.34 + ease * 0.26;
        weaponSocket.rotation.x = 0.71 + ease * 0.92;
        torsoPivot.rotation.y = -0.26 + ease * 0.52;
        bodyRig.scale.set(
          1 + Math.sin(u * Math.PI) * 0.08,
          1 - Math.sin(u * Math.PI) * 0.06,
          1 + Math.sin(u * Math.PI) * 0.08
        );
      } else {
        const u = (prog - 0.68) / 0.32;
        armR.rotation.x = -0.23 * (1 - u) + -0.30 * u;
        weaponSocket.rotation.x = 1.63 * (1 - u) + 0.96 * u;
        torsoPivot.rotation.y = 0.26 * (1 - u);
      }
    }

    if (isBoinging) {
      const bp = boingTimer > 0 ? 1 - boingTimer / BOING_DURATION : (t * 2) % 1;
      bodyRig.rotation.y = Math.sin(bp * Math.PI * 2) * 0.45;
      bodyRig.rotation.z = Math.sin(t * 14) * 0.14;
      armL.rotation.set(-2.35 + Math.sin(t * 18) * 0.25, 0, 0.35);
      armR.rotation.set(-2.20 - Math.sin(t * 18) * 0.25, 0, -0.35);
      legL.rotation.x = -0.55 + Math.sin(t * 20) * 0.45;
      legR.rotation.x = -0.55 - Math.sin(t * 20) * 0.45;
      headPivot.rotation.x = -0.18;
    } else if (cheerTimer > 0) {
      const cp = 1 - cheerTimer / CHEER_DURATION;
      const hop = Math.abs(Math.sin(cp * Math.PI * 2)) * 0.42;
      bodyRig.position.y += hop;
      bodyRig.rotation.y = Math.sin(cp * Math.PI * 4) * 0.25;
      armL.rotation.set(-2.55, 0, 0.32 + Math.sin(t * 18) * 0.20);
      armR.rotation.set(-2.45, 0, -0.32 - Math.sin(t * 18) * 0.20);
      weaponSocket.rotation.x = 0.55;
      headPivot.rotation.x = -0.16;
    }

    if (shadowDisc) {
      const hScale = Math.max(0.65, 1 - bodyRig.position.y * 0.35);
      shadowDisc.scale.set(hScale, hScale, 1);
    }
    cheerStarSprite.visible = false;
  }

  function reset() {
    walkPhase = 0;
    swingTimer = 0;
    boingTimer = 0;
    cheerTimer = 0;
    shieldFlashTimer = 0;
    equipment.weaponId = 'wooden_kentungan_bat';
    equipment.helmet = false;
    equipment.speedBoots = false;
    equipment.starCape = false;
    equipment.crown = false;
    applyEquipmentVisuals();
    group.position.set(spawn.x, spawn.y, spawn.z);
    group.rotation.set(0, initYaw, 0);
    bodyRig.position.set(0, 0, 0);
    bodyRig.rotation.set(0, 0, 0);
    bodyRig.scale.set(1, 1, 1);
  }

  applyEquipmentVisuals();

  return {
    group,
    weaponSocket,
    setEquipment,
    getEquipment,
    get equipment() {
      return { ...equipment };
    },
    triggerSwing,
    triggerBoing,
    triggerCheer,
    flashShield,
    update,
    reset,
  };
}

// Frozen deterministic automation & audit seam window.__SAHUR_ISLAND__ (plus alias window.__LUCKY_TITAN__) (owner: sahur-director).

export function installSeam(api) {
  const seam = Object.freeze({
    startGame(opts = {}) {
      return api.startGame(opts);
    },
    continueGame() {
      return api.continueGame ? api.continueGame() : api.startGame();
    },
    tapWorld(x, z) {
      return api.tapWorld(Number(x), Number(z));
    },
    swingDrum() {
      return api.swingDrum();
    },
    drumSwing() {
      return api.swingDrum();
    },
    breakBlock(x, y, z) {
      return api.breakBlock(x, y, z);
    },
    breakDrum(x, y, z) {
      return api.breakBlock(x, y, z);
    },
    plantPot(padIdx = 0) {
      return api.plantPot(padIdx);
    },
    upgradeTotem(padIdx = 0) {
      return api.plantPot(padIdx);
    },
    spinChest(forcedWeaponId = null) {
      return api.spinChest(forcedWeaponId);
    },
    spinWheel(forcedClubId = null) {
      return api.spinChest(forcedClubId);
    },
    spawnTitan(titanId) {
      return api.spawnTitan(titanId);
    },
    spawnBoss(bossId) {
      return api.spawnTitan(bossId);
    },
    bonkTitan(titanId) {
      return api.bonkTitan(titanId);
    },
    bonkBoss(bossId) {
      return api.bonkTitan(bossId);
    },
    replayVoice() {
      return api.replayVoice();
    },
    stepFrames(n = 1, dt = 1 / 60) {
      return api.stepFrames(Math.max(0, Math.floor(Number(n) || 0)), Number(dt) || 1 / 60);
    },
    getState() {
      return api.buildStateSnapshot();
    },
  });

  if (typeof window !== 'undefined') {
    window.__SAHUR_ISLAND__ = seam;
    window.__LUCKY_TITAN__ = seam;
  }
  return seam;
}

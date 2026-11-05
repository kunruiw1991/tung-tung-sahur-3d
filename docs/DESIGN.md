# Tung Tung Tung Sahur 3D: Brainrot Rhythm Island! — Architecture & Kid-UX Design Specification

## 1. Vision & 5-Year-Old Fun Requirements
**Tung Tung Tung Sahur 3D: Brainrot Rhythm Island!** is a joyful, laugh-out-loud, non-scary 3D Three.js (r170) WebGL toy-island adventure built specifically for a **5-year-old child** on an iPad or laptop, with **100% English UI** and **68 pre-recorded neural voiceover clips (`edge-tts`)**.

- **ZERO inventory grids, ZERO crafting menus, ZERO tiny stats, ZERO scary horror, and ZERO "You Died" / "Game Over" screens!**
- **Authority Rule**: `src/data/catalog.js` and `src/data/voice_catalog.js` are the single canonical source of truth and win on any conflict.

### 5 Core Gameplay Pillars:
1. **🥁 Hero Tung Tung Tung Sahur & Fast Movement (`8.5 -> 10.8 blocks/s`)**:
   - Expressive 3D warm-teakwood cylindrical kentungan log hero (`~1.85` blocks tall) with carved acoustic slit, big googly cartoon eyes, wide cheerful smile, bouncy legs in blue sneakers, and a 3D right-hand **Sahur Drum-Club socket**.
   - **Fast Walk Speed**: Base speed **`8.5 blocks/s`**, boosted to **`10.8 blocks/s`** with **Blue Sneaker Speed Boots**, **Ballerina Cappuccina's Latte Zoom**, or **Golden Crescent Crown**!
   - **Rhythmic 3-Beat `"TUNG! TUNG! TUNG! SAHUR!"` Combo & HUD Drum Button (`#btn-hud-drum`)**:
     - Every swing advances a 3-beat rhythm combo:
       - `Beat 1: "TUNG!"` gold ring (`r = 2.2` blocks)
       - `Beat 2: "TUNG! TUNG!"` double cyan-gold ring (`r = 2.8` blocks)
       - `Beat 3: "TUNG! TUNG! TUNG! SAHUR!"` giant rainbow shockwave hitting `r = 4.0` blocks + `+2` bonus Golden Drum Stars!
     - Tapping/holding a target or pressing the big bottom-right **`🥁 TUNG!` Drum Button (`#btn-hud-drum`, >= 76x76 px)** swings immediately on `pointerdown` and auto-swings every `300 ms` while held.
2. **4 Hub Sleepy Sahur Cottages / Drum Totems (`Tier 0 -> Tier 1 -> Tier 2 -> Tier 3 Ultimate Golden Sahur Tower`)**:
   - Around the central **Sunrise Sahur Plaza**, 4 sleepy cottages / drum totems (`Cappuccino Cafe`, `Banana Treehouse`, `Cactus Oasis Clock`, `Sneaker Beach Hut`) start at Tier 0.
   - Planting/upgrading them (`#btn-hud-totem` or tapping pad, `GARDEN_LINGER_RADIUS = 5.8` covering all 4 pads at `(±4.5, 1, 1.6)` and `(±4.5, 1, -2.6)`) wakes up friendly 3D Brainrot helpers (**☕🩰 Ballerina Cappuccina**, **🍌🐒 Chimpanzini Bananini**, **🌵🐘🩴 Lirili Larila**, **☕🥷 Cappuccino Assassino**) who dance beside their cottages and fountain **Golden Drum Stars** automatically every `3.3s / 2.9s / 2.5s` (`+2 / +4 / +8` Stars).
   - Once all 4 reach Tier 3 (`[3, 3, 3, 3]`), surplus Drum Seeds convert into a **Rainbow Sahur Star Fountain (`+6` Stars)** so nothing ever stalls.
3. **Golden Sahur Drum Roulette Wheel (`#btn-hud-spin` / `#roulette-modal`)**:
   - Strictly climbing, non-downgrading picture roulette progression across **5 wacky Drum-Clubs**:
     1. `wooden_kentungan_bat` — **Wooden Kentungan Bat** (`Tier 1`, starter)
     2. `bronze_temple_gong` — **Bronze Temple Gong** (`Tier 2`)
     3. `golden_sahur_mallet` — **Golden Sahur Mallet** (`Tier 3`)
     4. `neon_thunder_taiko` — **Neon Thunder Taiko Drum** (`Tier 4`)
     5. `rainbow_mega_hammer` — **Rainbow Mega Sahur Hammer** (`Tier 5`)
   - Plus **Blue Sneaker Speed Boots (`10.8 b/s`, `5` shield hearts)** & **Golden Crescent Crown (`10.8 b/s`, `5` shield hearts, `+25%` bonk power)**.
   - Gated smoothly with Totem fountain milestones (`ROULETTE_COSTS = [28, 88, 112, 120, 270, 290]`) so child-bots naturally engage all mechanics (`4.0 - 8.5 min` total run time).
4. **12 Wacky Sahur Mystery Drums (`Lucky Drum Blocks`) & 3 Pattable Brainrot Mini-Pets**:
   - Around the `72x72` island, glowing **Golden Sahur Mystery Drums** pop open in `3` `"TUNG! TUNG! TUNG!"` bonks (with the **Starter Mystery Drum** at `(0, 1, 2.0)` popping on the first swing to drop `+8` Golden Drum Stars, `+1` Totem Seed, and `+1` Free Spin Token in `<= 3.5 s`) into 12 comedy surprises (Star Showers, Croissant & Mango Smoothie Feast, Latte Speed Boost, Dancing Mini-Chimpanzini, Confetti Fireworks, Totem Seed Drops, Silly Cushion Toot, Blue Sneaker Speed Boots, Golden Crescent Crown, Ballerina Ribbon Cape, Surprise Boss Wake).
   - 3 pattable mini-buddies (**Mini Ballerina Cappuccina**, **Mini Chimpanzini Bananini**, **Mini Lirili Larila**) give hearts, giggles, and `+2..+4` Stars when tapped (prioritizing direct drum/block taps within `<= 1.25` blocks over pet radius).
5. **4 Sleeping `"Zzz"` Giant Brainrot Bosses (`Tralalero Tralala`, `Bombardiro Crocodilo`, `Brr Brr Patapim`, `Golden Sahur Titan King`)**:
   - 4 giant (`4.2x - 5.0x` scale) bespoke 3D Brainrot Bosses in the 4 island corners:
     1. **`tralalero_tralala` — 🦈👟 Tralalero Tralala** (`reqTier = 1`, SW *Sneaker Coral Beach* at `(-18, 1, 18)`): 3-legged blue shark wearing 3 bright blue sneakers with white swooshes!
     2. **`bombardiro_crocodilo` — 🐊✈️ Bombardiro Crocodilo** (`reqTier = 2`, NW *Cloud Runway Peak* at `(-18, 2, -18)`): Chubby green propeller-plane crocodile with twin spinning yellow propellers and aviator goggles!
     3. **`brr_brr_patapim` — 🌳🐒 Brr Brr Patapim** (`reqTier = 3` + Blue Sneaker Boots, SE *Banana Jungle Grove* at `(18, 1, 18)`): Giant nose-forest treant troll with leafy canopy crown and big goofy root-feet!
     4. **`golden_sahur_king` — 🥁👑 Golden Sahur Titan King** (`reqTier = 4`, NE *Golden Sahur Palace* at `(20, 2, -20)`): Giant golden crowned Kentungan King with twin royal taiko drums!
   - **Comedy Foam-Cloud `BOING!` (Zero Death / Zero Game-Over)**: Poking a sleeping `"Zzz"` Giant Boss (5 swings to wake) when under-geared triggers a hilarious comedy move (e.g., Tralalero sneaker-wave kick!) that bounces Tung Tung onto a **merged-geometry 3D Cappuccino Foam Spring Cloud (`BOING!`)** arc back to the Hub `(0, 1, 3.4)` with `+3` consolation Golden Drum Stars (`peakDrawCalls <= 65`, `maxMetalness <= 0.22`).
   - **Geared Boss Dance-Friend Victory**: When properly geared, `6-9` rhythmic `"TUNG! TUNG! TUNG! SAHUR!"` bonks turn the Giant Boss into a dancing parade friend, award their **Golden Brainrot Trophy (`1/4..4/4`)**, and trigger the **Grand Sunrise Sahur Parade & Fireworks Finale (`#victory-modal`)**!

---

## 2. Strict Global Technical & Localization Rules
1. **ZERO CJK Characters Anywhere**: Zero `[\u4e00-\u9fff]` characters in any file, DOM element, attribute, or 2D canvas draw (`tests/l10n_audit.py`).
2. **Zero-Build ES2022 Modules & Zero Browser TTS**: Relative imports only (`../../vendor/three.module.min.js`). Zero `window.speechSynthesis` calls or identifiers in runtime code.
3. **Three.js r170 Material, Draw-Call & Camera Guardrails (`Gate F12`)**:
   - `maxMetalness <= 0.20` (`<= 0.22` hard gate).
   - All `THREE.SpriteMaterial` / billboard / ring materials set `toneMapped: false` and `fog: false`.
   - `camera.rotation.z === 0` on every frame.
   - `peakDrawCalls <= 65` across all viewports and scenes (using merged Cappuccino Foam Spring Cloud geometry and single active Giant Boss visibility).
   - Live 3D world renders behind `#title-screen` and calls `renderer.compile(scene, camera)` on boot so tapping `▶ PLAY` transitions in `<= 50 ms` (`<= 80 ms` gate).
4. **5-Viewport Kid-UX & Docked Subtitle Contract (`Gate F11`)**:
   - Viewports: `1280x800`, `1024x768`, `768x1024` (iPad portrait), `844x390` (mobile landscape), `390x844` (mobile portrait).
   - `0` scrollbars, `0` clipped text, `0` pairwise bounding-box overlaps among buttons, status pills, `#boss-banner`, and `#voice-subtitle`.
   - `<= 5` visible clickable `<button>` controls during active play:
     1. `#btn-hud-spin` (`🎰 SPIN` — opens Golden Sahur Roulette Wheel; pulses gold when affordable or `freeSpins > 0`)
     2. `#btn-hud-totem` (`🥁 TOTEM` — wakes/upgrades next Hub Sleepy Sahur Cottage; pulses green when `potSeeds > 0` or affordable)
     3. `#btn-hud-voice` (`🔊 VOICE` — 1-tap replays last spoken voice clip and auto-unmutes if muted)
     4. `#btn-hud-menu` (`⏸ MENU` — opens Pause modal with live `ON/OFF` toggles for Music, Sound, Voice, Chaos Mode, and New Island)
     5. `#btn-hud-drum` (`🥁 TUNG!` — big bottom-right `>= 76x76 px` Drum Swing button: swings immediately on `pointerdown` and auto-swings every `300 ms` while held!)
   - Docked `#voice-subtitle` pill sits cleanly at `bottom: 112px` (`min-height: 72px`, compact single/double line on `844x390` with `height <= 76px`) and replays voice on tap.
   - Stationary canvas/button presses of any duration (`50ms`, `450ms`, `750ms`) with `< 10px` movement register as 1 crisp tap, while holding on canvas/target or `#btn-hud-drum` auto-bonks every `300 ms`.
5. **Disk Hygiene**: All scratch files and headless Chrome profiles live in `/tmp/tung_tung_sahur_3d/tmp_profiles/` and are cleaned up after tests.

---

## 3. Frozen Deterministic Seam (`window.__SAHUR_ISLAND__` + alias `window.__LUCKY_TITAN__`)
Exposed by `src/core/seam.js`:
- `startGame({ seed = 2026, chaosMode = false } = {})`
- `continueGame()`
- `tapWorld(x, z)`
- `swingDrum()`
- `breakBlock(x, y, z)` / `breakDrum(x, y, z)`
- `upgradeTotem(padIdx = 0)` / `plantPot(padIdx = 0)`
- `spinWheel(forcedClubId = null)` / `spinChest(forcedWeaponId = null)`
- `spawnBoss(bossId)` / `spawnTitan(titanId)`
- `bonkBoss(bossId)` / `bonkTitan(titanId)`
- `replayVoice()`
- `stepFrames(n = 1, dt = 1 / 60)`
- `getState()` -> deep-cloned plain JSON snapshot (`mode`, `seed`, `time`, `chaosMode`, `player` with `comboBeat`, `blocksBroken`, `drumsBroken`, `activeDrops`, `totems`, `flowerpots`, `pets`, `critters`, `bosses`, `titans`, `activeBoss`, `activeTitan`, `trophies`, `roulette`, `voice`, `audio`, `feedback`, `perf`).

---

## 4. Numeric Fun, Kid-UX, Visual & Voiceover Gates (`F1..F14`)
- **F1**: `▶ PLAY` transition `<= 80 ms`; `0` console/page/WebGL/HTTP errors.
- **F2**: Starter Mystery Drum break + 3-drop fountain + VO from spawn `<= 4.0 s`.
- **F3**: Base walk speed `8.5 blocks/s`; boosted walk speed with Blue Sneaker Speed Boots / Latte Zoom / Crescent Crown `10.8 blocks/s`.
- **F4**: `350+` mixed world/water/cliff/pad/wheel/pet/Boss taps -> `feedback.deadTaps === 0`.
- **F5**: `280ms` `pointerup` debounce on UI buttons; `#btn-hud-drum` immediate `pointerdown` swing + `300ms` hold-to-auto-bonk.
- **F6**: Waking & upgrading the 4 Hub Sahur Cottages (`Tier 1 -> Tier 2 -> Tier 3 Ultimate Golden Sahur Tower`) wakes 3D Brainrot helpers and fountains Golden Drum Stars within `<= 4.0 s`; surplus seeds at `[3,3,3,3]` pop `+6` Stars.
- **F7**: Golden Sahur Roulette Wheel spin lasts `2.0 - 3.2 s`, strictly climbs `weaponTier` (`1 -> 2 -> 3 -> 4 -> 5`) without downgrading.
- **F8**: Under-geared Boss poke triggers comedy move + merged 3D Cappuccino Foam Cloud `BOING!` back to Hub `(0, 1, 3.4)` with `+3` consolation Stars and `0` loss/death screens.
- **F9**: Geared bonks (`6 - 9` hits per Boss with 3-beat `"TUNG! TUNG! TUNG! SAHUR!"` shockwaves) befriend all 4 Giant Brainrot Bosses -> `4/4` Golden Trophies -> Grand Sunrise Sahur Parade (`#victory-modal`).
- **F10**: `20/20` (`100%`) 5-year-old child-bot seeds complete all 4 Bosses inside `4.0 - 8.5 min` (`240 - 510 s` / `<= 720 s` window) with `>= 50%` natural boing rate, `>= 25` median drums/blocks broken, `100%` pet rate, and bit-exact `seed=2026` determinism.
- **F11**: 5-viewport layout audit (`1280x800`, `1024x768`, `768x1024`, `844x390`, `390x844`): `0` scrollbars, `0` overlaps, `0` clipped text, `<= 5` active-play buttons (`>= 72x72 px`, `>= 68 px` on `844x390`), docked subtitle pill `bottom: 112px`.
- **F12**: `maxMetalness <= 0.22`, sprites `toneMapped: false && fog: false`, `camera.rotation.z === 0`, `peakDrawCalls <= 65`.
- **F13**: `0` CJK characters across source, DOM, attributes, and hooked 2D canvas `fillText`/`strokeText`.
- **F14**: `68` valid neural `edge-tts` MP3s (`<= 4.0 MB` total), `0` `speechSynthesis`, `-6.0 dB` WebAudio BGM ducking, and 1-tap `#btn-hud-voice` / `#voice-subtitle` replay + auto-unmute.

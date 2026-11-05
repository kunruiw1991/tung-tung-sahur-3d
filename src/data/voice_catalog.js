// Canonical 68-clip neural voiceover catalog for Tung Tung Tung Sahur 3D: Brainrot Rhythm Island! (owner: sahur-director).
// Synthesized via edge-tts (en-US-GuyNeural, en-US-ChristopherNeural, en-US-AnaNeural) into assets/voice/*.mp3.

export const VOICE_SPEAKERS = Object.freeze({
  narrator: Object.freeze({
    id: 'narrator',
    name: 'Island Guide',
    voice: 'en-US-AnaNeural',
    rate: '+6%',
    pitch: '+6Hz',
  }),
  cappuccina: Object.freeze({
    id: 'cappuccina',
    name: 'Ballerina Cappuccina',
    voice: 'en-US-AnaNeural',
    rate: '+8%',
    pitch: '+12Hz',
  }),
  bananini: Object.freeze({
    id: 'bananini',
    name: 'Chimpanzini Bananini',
    voice: 'en-US-AnaNeural',
    rate: '+12%',
    pitch: '+16Hz',
  }),
  lirili: Object.freeze({
    id: 'lirili',
    name: 'Lirili Larila',
    voice: 'en-US-AnaNeural',
    rate: '+5%',
    pitch: '+8Hz',
  }),
  sahur: Object.freeze({
    id: 'sahur',
    name: 'Tung Tung Tung Sahur',
    voice: 'en-US-GuyNeural',
    rate: '+8%',
    pitch: '+4Hz',
  }),
  tralalero: Object.freeze({
    id: 'tralalero',
    name: 'Tralalero Tralala',
    voice: 'en-US-GuyNeural',
    rate: '+6%',
    pitch: '-6Hz',
  }),
  bombardiro: Object.freeze({
    id: 'bombardiro',
    name: 'Bombardiro Crocodilo',
    voice: 'en-US-ChristopherNeural',
    rate: '+4%',
    pitch: '-10Hz',
  }),
  patapim: Object.freeze({
    id: 'patapim',
    name: 'Brr Brr Patapim',
    voice: 'en-US-ChristopherNeural',
    rate: '+2%',
    pitch: '-14Hz',
  }),
  sahur_king: Object.freeze({
    id: 'sahur_king',
    name: 'Golden Sahur King',
    voice: 'en-US-GuyNeural',
    rate: '+2%',
    pitch: '-16Hz',
  }),
});

export const VOICE_CATALOG = Object.freeze([
  // 1. Onboarding, Rhythm Combo & Kid Coaching (10)
  Object.freeze({
    id: 'guide_title',
    speaker: 'narrator',
    text: 'Welcome to Tung Tung Tung Sahur Island! Tap Play to start drumming!',
  }),
  Object.freeze({
    id: 'guide_welcome',
    speaker: 'sahur',
    text: 'Tung Tung Tung Sahur! Tap the glowing golden drum right in front of us!',
  }),
  Object.freeze({
    id: 'guide_starter_pop',
    speaker: 'narrator',
    text: "Awesome! Golden Drum Stars, a Totem Seed, and a Free Roulette Spin!",
  }),
  Object.freeze({
    id: 'guide_tap_block',
    speaker: 'narrator',
    text: 'Tap any glowing Mystery Drum to bonk it three times! Tung, Tung, Tung!',
  }),
  Object.freeze({
    id: 'guide_combo_sahur',
    speaker: 'sahur',
    text: 'Tung! Tung! Tung! Sahur! Rainbow shockwave combo!',
  }),
  Object.freeze({
    id: 'guide_boing_hint',
    speaker: 'narrator',
    text: "Boing! Cappuccino cloud bounce! Let's spin the wheel first!",
  }),
  Object.freeze({
    id: 'guide_ready_tralalero',
    speaker: 'narrator',
    text: "We're ready for Tralalero Tralala on Sneaker Coral Beach!",
  }),
  Object.freeze({
    id: 'guide_ready_bombardiro',
    speaker: 'narrator',
    text: "Awesome club! Let's wake Bombardiro Crocodilo on Cloud Peak!",
  }),
  Object.freeze({
    id: 'guide_ready_patapim',
    speaker: 'narrator',
    text: 'Zoom sneakers ready! Time to meet Brr Brr Patapim in the Jungle!',
  }),
  Object.freeze({
    id: 'guide_ready_king',
    speaker: 'narrator',
    text: "Super Taiko power! Let's challenge the Golden Sahur King!",
  }),

  // 2. Wacky Drum-Clubs (5)
  Object.freeze({
    id: 'vo_wpn_bat',
    speaker: 'sahur',
    text: 'Wooden Kentungan Bat! Time to drum!',
  }),
  Object.freeze({
    id: 'vo_wpn_gong',
    speaker: 'sahur',
    text: 'Whoa! The Bronze Temple Gong! Ring-a-ding!',
  }),
  Object.freeze({
    id: 'vo_wpn_mallet',
    speaker: 'sahur',
    text: 'Shiny! The Golden Sahur Mallet!',
  }),
  Object.freeze({
    id: 'vo_wpn_taiko',
    speaker: 'sahur',
    text: 'Boom boom! Neon Thunder Taiko Drum!',
  }),
  Object.freeze({
    id: 'vo_wpn_rainbow',
    speaker: 'sahur',
    text: 'Jackpot! The Rainbow Mega Sahur Hammer!',
  }),

  // 3. Hub Sahur Cottages, Totems & Brainrot Helpers (9)
  Object.freeze({
    id: 'vo_totem_tier1',
    speaker: 'cappuccina',
    text: 'Look! Our sleepy cottage woke up and started dancing!',
  }),
  Object.freeze({
    id: 'vo_totem_tier2',
    speaker: 'cappuccina',
    text: 'Hooray! The Sahur Rhythm Pavilion is fountaining stars!',
  }),
  Object.freeze({
    id: 'vo_totem_tier3',
    speaker: 'cappuccina',
    text: 'Amazing! The Ultimate Golden Sahur Tower is raining stars!',
  }),
  Object.freeze({
    id: 'helper_cappuccina_wake',
    speaker: 'cappuccina',
    text: 'Ballerina Cappuccina! Pirouette and latte stars for you!',
  }),
  Object.freeze({
    id: 'helper_bananini_wake',
    speaker: 'bananini',
    text: 'Chimpanzini Bananini! Ooh-ooh ah-ah, banana stars!',
  }),
  Object.freeze({
    id: 'helper_lirili_wake',
    speaker: 'lirili',
    text: 'Lirili Larila! Tick-tock cactus march, here come the stars!',
  }),
  Object.freeze({
    id: 'helper_assassino_wake',
    speaker: 'sahur',
    text: 'Cappuccino Assassino! Ninja drum roll, catch these stars!',
  }),
  Object.freeze({
    id: 'fairy_pot_max',
    speaker: 'cappuccina',
    text: 'All four Sahur Towers are maxed! Bonus Rainbow Star Fountain!',
  }),
  Object.freeze({
    id: 'fairy_need_stars',
    speaker: 'narrator',
    text: "Let's collect more Drum Stars or wake the earlier Boss first!",
  }),

  // 4. Golden Sahur Roulette Wheel (3)
  Object.freeze({
    id: 'wheel_open',
    speaker: 'cappuccina',
    text: 'Spin the Golden Sahur Roulette Wheel!',
  }),
  Object.freeze({
    id: 'wheel_spinning',
    speaker: 'sahur',
    text: 'Round and round the golden drum wheel goes!',
  }),
  Object.freeze({
    id: 'wheel_jackpot',
    speaker: 'cappuccina',
    text: 'Mega Sahur Jackpot! Bonus stars and a shield heart!',
  }),

  // 5. 12 Wacky Mystery Drum Drops & Gear (13)
  Object.freeze({
    id: 'vo_drop_stars',
    speaker: 'narrator',
    text: 'Shiny Golden Drum Stars!',
  }),
  Object.freeze({
    id: 'vo_drop_jackpot',
    speaker: 'sahur',
    text: 'Whoa! Giant Star Shower Jackpot!',
  }),
  Object.freeze({
    id: 'vo_drop_seed',
    speaker: 'cappuccina',
    text: 'A Magic Totem Seed! Tap Totem to wake a Brainrot buddy!',
  }),
  Object.freeze({
    id: 'vo_drop_wheel',
    speaker: 'cappuccina',
    text: "Free Spin Token! Let's spin the Golden Drum Wheel!",
  }),
  Object.freeze({
    id: 'vo_drop_mango',
    speaker: 'narrator',
    text: 'Yummy! Croissant and Mango Smoothie Feast!',
  }),
  Object.freeze({
    id: 'vo_drop_latte',
    speaker: 'cappuccina',
    text: 'Ballerina Latte Zoom! Super fast feet and a shield heart!',
  }),
  Object.freeze({
    id: 'vo_drop_bananini',
    speaker: 'bananini',
    text: 'Haha! A dancing Mini Chimpanzini Bananini popped out!',
  }),
  Object.freeze({
    id: 'vo_drop_confetti',
    speaker: 'cappuccina',
    text: 'Pop! Confetti fireworks and Mini Ballerina Cappuccina!',
  }),
  Object.freeze({
    id: 'vo_drop_toot',
    speaker: 'lirili',
    text: 'Pffft! Hehe, silly toot cushion and Mini Lirili Larila!',
  }),
  Object.freeze({
    id: 'vo_gear_boots',
    speaker: 'sahur',
    text: 'Blue Sneaker Speed Boots! Zoom zoom, super fast!',
  }),
  Object.freeze({
    id: 'vo_gear_crown',
    speaker: 'sahur',
    text: 'The Golden Crescent Crown! Five glowing shield hearts!',
  }),
  Object.freeze({
    id: 'vo_gear_cape',
    speaker: 'cappuccina',
    text: 'Ballerina Star Ribbon Cape! Super star magnet!',
  }),
  Object.freeze({
    id: 'vo_boss_alert',
    speaker: 'sahur',
    text: 'Uh-oh! That drum woke up a Giant Brainrot Boss!',
  }),

  // 6. 3 Pattable Brainrot Mini-Pets (3)
  Object.freeze({
    id: 'vo_pet_cappuccina',
    speaker: 'cappuccina',
    text: 'Hehe! Mini Cappuccina loves pats! Twirl twirl!',
  }),
  Object.freeze({
    id: 'vo_pet_bananini',
    speaker: 'bananini',
    text: 'Ooh-ooh! Happy Mini Bananini gives you bonus stars!',
  }),
  Object.freeze({
    id: 'vo_pet_lirili',
    speaker: 'lirili',
    text: 'Tick-tock giggle! Mini Lirili Larila is so happy!',
  }),

  // 7. 4 Giant Brainrot Bosses (20)
  Object.freeze({
    id: 'boss_tralalero_spawn',
    speaker: 'tralalero',
    text: 'Tralalero Tralala! Check out my three shiny blue sneakers!',
  }),
  Object.freeze({
    id: 'boss_tralalero_boing',
    speaker: 'tralalero',
    text: 'Haha! My sneaker wave is too splashy! Boing on a cappuccino cloud!',
  }),
  Object.freeze({
    id: 'boss_tralalero_ouch',
    speaker: 'tralalero',
    text: 'Whoa! Careful with my fresh blue sneakers!',
  }),
  Object.freeze({
    id: 'boss_tralalero_defeat',
    speaker: 'tralalero',
    text: "Awesome rhythm! Let's do the shark sneaker dance! Take my trophy!",
  }),
  Object.freeze({
    id: 'vo_win_tralalero',
    speaker: 'narrator',
    text: 'Hooray! Tralalero Tralala is our dancing friend! Trophy one!',
  }),

  Object.freeze({
    id: 'boss_bombardiro_spawn',
    speaker: 'bombardiro',
    text: 'Bombardiro Crocodilo! Vroom vroom, twin propellers spinning!',
  }),
  Object.freeze({
    id: 'boss_bombardiro_boing',
    speaker: 'bombardiro',
    text: 'Whoosh! My propeller breeze bounced you onto a foam cloud!',
  }),
  Object.freeze({
    id: 'boss_bombardiro_ouch',
    speaker: 'bombardiro',
    text: 'Bzzzt! My aviator goggles are wobbling!',
  }),
  Object.freeze({
    id: 'boss_bombardiro_defeat',
    speaker: 'bombardiro',
    text: "Mayday of fun! I love your drum beat! Here's my trophy!",
  }),
  Object.freeze({
    id: 'vo_win_bombardiro',
    speaker: 'narrator',
    text: 'Yeah! Bombardiro Crocodilo joined our parade! Two trophies won!',
  }),

  Object.freeze({
    id: 'boss_patapim_spawn',
    speaker: 'patapim',
    text: "Brr Brr Patapim! Who's drumming in my leafy nose forest?!",
  }),
  Object.freeze({
    id: 'boss_patapim_boing',
    speaker: 'patapim',
    text: 'Ho ho! My big root feet made a bouncy cloud! Grab Blue Sneakers first!',
  }),
  Object.freeze({
    id: 'boss_patapim_ouch',
    speaker: 'patapim',
    text: 'Brr brr! That tickles my giant forest nose!',
  }),
  Object.freeze({
    id: 'boss_patapim_defeat',
    speaker: 'patapim',
    text: 'Patapim party time! My big feet love this beat! Take my trophy!',
  }),
  Object.freeze({
    id: 'vo_win_patapim',
    speaker: 'narrator',
    text: 'Amazing! Brr Brr Patapim is dancing with us! Three trophies!',
  }),

  Object.freeze({
    id: 'boss_king_spawn',
    speaker: 'sahur_king',
    text: 'Tung Tung Tung Sahur! Behold the Golden Sahur Titan King!',
  }),
  Object.freeze({
    id: 'boss_king_boing',
    speaker: 'sahur_king',
    text: 'Boom boom! Bring a Neon Taiko or Mega Hammer to match my beat!',
  }),
  Object.freeze({
    id: 'boss_king_ouch',
    speaker: 'sahur_king',
    text: 'Clang! What a powerful Sahur drum combo!',
  }),
  Object.freeze({
    id: 'boss_king_defeat',
    speaker: 'sahur_king',
    text: 'Magnificent rhythm! You are the Grand Sahur Champion! Take the crown!',
  }),
  Object.freeze({
    id: 'vo_win_king',
    speaker: 'narrator',
    text: 'We did it! All four Brainrot Bosses are dancing in our Sunrise Parade!',
  }),

  // 8. Finale, Persistence & Modes (5)
  Object.freeze({
    id: 'vo_finale_parade',
    speaker: 'sahur',
    text: 'Grand Sunrise Sahur Parade! Everyone dance and celebrate!',
  }),
  Object.freeze({
    id: 'vo_keep_playing',
    speaker: 'narrator',
    text: "Welcome back to Sahur Island! Let's keep drumming and popping surprises!",
  }),
  Object.freeze({
    id: 'vo_chaos_on',
    speaker: 'sahur',
    text: 'Brainrot Chaos Mode on! Every Mystery Drum pops extra silly surprises!',
  }),
  Object.freeze({
    id: 'vo_chaos_off',
    speaker: 'narrator',
    text: 'Normal Island Mode! Sunny rhythm adventure!',
  }),
  Object.freeze({
    id: 'sahur_sleepy_zzz',
    speaker: 'narrator',
    text: "Shhh! That Giant Boss is still snoring! Let's win the earlier trophy first!",
  }),
]);

export const VOICE_BY_ID = Object.freeze(
  Object.fromEntries(VOICE_CATALOG.map((clip) => [clip.id, clip]))
);

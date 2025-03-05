export const characters = [
  {
    id: 1,
    name: "Warrior",
    hp: 150,
    maxHp: 150,
    type: "class",
    attack: 30,
    defense: 15,
    isAttacking: false,
    attacked: false,
    image: require('../assets/characters/warrior.gif'),
    attackImage: require('../assets/characters/warrior-attacking.gif'),
    currentEvolution: -1,
    upgrades: [],
    sound: 'fire',
    evolutions: [
      {
        name: "Burning Warrior",
        hp: 60,
        maxHp: 60,
        type: "class",
        attack: 20,
        defense: 15,
        image: require('../assets/characters/burning-warrior.gif'),
        attackImage: require('../assets/characters/burning-warrior-attacking.gif'),
      },
      {
        name: "Fire King Warrior",
        hp: 70,
        maxHp: 70,
        type: "class",
        attack: 25,
        defense: 20,
        image: require('../assets/characters/fire-king-warrior.gif'),
        attackImage: require('../assets/characters/fire-king-warrior-attacking.gif'),
      },
      {
        name: "Fire God Warrior",
        hp: 80,
        maxHp: 80,
        type: "class",
        attack: 30,
        defense: 25,
        image: require('../assets/characters/fire-god-warrior.gif'),
        attackImage: require('../assets/characters/fire-god-warrior-attacking.gif'),
      },
      {
        name: "Holy Flame Warrior",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 35,
        defense: 30,
        image: require('../assets/characters/holy-flame-warrior.gif'),
        attackImage: require('../assets/characters/holy-flame-warrior-attacking.gif'),
      },
      {
        name: "Flame Legend Warrior",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/flame-legend-warrior.gif'),
        attackImage: require('../assets/characters/flame-legend-warrior-attacking.gif'),
      },
      {
        name: "Ignis Halcyon Warrior",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/ignis-halcyon-warrior.gif'),
        attackImage: require('../assets/characters/ignis-halcyon-warrior-attacking.gif'),
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 2,
    name: "Mifune",
    hp: 160,
    maxHp: 160,
    type: "class",
    attack: 35,
    defense: 20,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/mifune.gif'),
    attackImage: require('../assets/characters/mifune.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'dark',
    evolutions: [
      {
        name: "Samurai Mifune",
        hp: 70,
        maxHp: 70,
        type: "class",
        attack: 25,
        defense: 20,
        image: require('../assets/characters/samurai-mifune.gif'),
        attackImage: require('../assets/characters/samurai-mifune.gif'),
      },
      {
        name: "God Blade Mifune",
        hp: 80,
        maxHp: 80,
        type: "class",
        attack: 30,
        defense: 25,
        image: require('../assets/characters/god-blade-mifune.gif'),
        attackImage: require('../assets/characters/god-blade-mifune.gif'),
      },
      {
        name: "Ryujin Mifune",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 35,
        defense: 30,
        image: require('../assets/characters/ryujin-mifune-mifune.gif'),
        attackImage: require('../assets/characters/ryujin-mifune-mifune.gif'),
      },
      {
        name: "Shadow Ronin Mifune",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/shadow-ronin-mifune.gif'),
        attackImage: require('../assets/characters/shadow-ronin-mifune-attacking.gif'),
      },
      {
        name: "Ultimate Mifune",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/ultimate-mifune.gif'),
        attackImage: require('../assets/characters/ultimate-mifune.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 3,
    name: "Ardent Monk Rengaku",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 25,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/ardent-monk-rengaku.gif'),
    attackImage: require('../assets/characters/ardent-monk-rengaku-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Dancing Flame Rengaku",
        hp: 130,
        maxHp: 100,
        type: "class",
        attack: 130,
        defense: 40,
        image: require('../assets/characters/dancing-flame-rengaku.gif'),
        attackImage: require('../assets/characters/dancing-flame-rengaku-attacking.gif'),
      }
    ],
    attackType: "multiTarget"
  },
  {
    id: 4,
    name: "Drake Armor Klaus",
    hp: 170,
    maxHp: 170,
    type: "class",
    attack: 35,
    defense: 20,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/drake-armor-klaus.gif'),
    attackImage: require('../assets/characters/drake-armor-klaus-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Dragon Shell Klaus",
        hp: 80,
        maxHp: 80,
        type: "class",
        attack: 30,
        defense: 25,
        image: require('../assets/characters/dragon-shell-klaus.gif'),
        attackImage: require('../assets/characters/dragon-shell-klaus-attacking.gif'),
      },
      {
        name: "Wyvern Wings Klaus",
        hp: 190,
        maxHp: 190,
        type: "class",
        attack: 135,
        defense: 30,
        image: require('../assets/characters/wyvern-wings-klaus.gif'),
        attackImage: require('../assets/characters/wyvern-wings-klaus-attacking.gif'),
      }
    ],
    attackType: "multiTarget"
  },
  {
    id: 5,
    name: "Iron Magress",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/iron-magress.gif'),
    attackImage: require('../assets/characters/iron-magress-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'dark',
    evolutions: [
      {
        name: "Death Magress",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/death-magress.gif'),
        attackImage: require('../assets/characters/death-magress-attacking.gif'),
      },
      {
        name: "Umbra Halcyon Magress",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 145,
        defense: 40,
        image: require('../assets/characters/umbra-halcyon-magress.gif'),
        attackImage: require('../assets/characters/umbra-halcyon-magress-attacking.gif'),
      }
    ],
    attackType: "multiTarget"
  },
  /*{
    id: 6,
    name: "Hallowed Dancer",
    hp: 200,
    maxHp: 200,
    type: "class",
    attack: 150,
    defense: 140,
    attacked: false,
    isAttacking: false,
    sound: 'dark',
    image: require('../assets/characters/hallowed-dancer.gif'),
    attackImage: require('../assets/characters/hallowed-dancer-attacking.gif'),
    upgrades: [],
    attackType: "multiTarget"
  },*/
  {
    id: 7,
    name: "Lasswell",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 140,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/lasswell.gif'),
    attackImage: require('../assets/characters/lasswell-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'water',
    evolutions: [
      {
        name: "Lasswell",
        hp: 120,
        maxHp: 100,
        type: "class",
        attack: 150,
        defense: 40,
        image: require('../assets/characters/lasswell-2.gif'),
        attackImage: require('../assets/characters/lasswell-2-attacking.gif'),
      }
    ],
    attackType: "multiTarget"
  },
  {
    id: 8,
    name: "Baelfyr",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/baelfyr.gif'),
    attackImage: require('../assets/characters/baelfyr-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Blacksteel Baelfyr",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 120,
        defense: 45,
        image: require('../assets/characters/blacksteel-baelfyr.gif'),
        attackImage: require('../assets/characters/blacksteel-baelfyr-attacking.gif'),
        attackType: "multiTarget"

      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 9,
    name: "Scarlet Archon Blaze",
    hp: 170,
    maxHp: 170,
    type: "class",
    attack: 35,
    defense: 25,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/scarlet-archon-blaze.gif'),
    attackImage: require('../assets/characters/scarlet-archon-blaze-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'saint',
    evolutions: [
      {
        name: "Immortal Firewing Blaze",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 110,
        defense: 35,
        image: require('../assets/characters/immortal-firewing-blaze.gif'),
        attackImage: require('../assets/characters/immortal-firewing-blaze-attacking.gif'),
        attackType: "multiTarget"

      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 10,
    name: "Artificer Ceulfan",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/artificer-ceulfan.gif'),
    attackImage: require('../assets/characters/artificer-ceulfan-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'saint',
    evolutions: [
      {
        name: "Grandmagos Ceulfan",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 130,
        defense: 40,
        image: require('../assets/characters/grandmagos-ceulfan.gif'),
        attackImage: require('../assets/characters/grandmagos-ceulfan-attacking.gif'),
        attackType: "multiTarget"

      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 11,
    name: "Beryl Edge Quaid",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Beryl-Edge-Quaid.gif'),
    attackImage: require('../assets/characters/Beryl-Edge-Quaid-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'saint',
    evolutions: [
      {
        name: "Valiant Edge Quaid",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Valiant-Edge-Quaid.gif'),
        attackImage: require('../assets/characters/Valiant-Edge-Quaid-attacking.gif'),
      },
      {
        name: "Sylvan Excalibur Quaid",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Sylvan-Excalibur-Quaid.gif'),
        attackImage: require('../assets/characters/Sylvan-Excalibur-Quaid-attacking.gif'),
      },
      {
        name: "Heroic Leader Quaid",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 150,
        defense: 45,
        image: require('../assets/characters/Heroic-Leader-Quaid.gif'),
        attackImage: require('../assets/characters/Heroic-Leader-Quaid-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 12,
    name: "Warrior Eze",
    hp: 200,
    maxHp: 200,
    type: "class",
    attack: 50,
    defense: 40,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Warrior-Eze.gif'),
    attackImage: require('../assets/characters/Warrior-Eze-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'thunder',
    evolutions: [
      {
        name: "Thunder Eze",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Thunder-Eze.gif'),
        attackImage: require('../assets/characters/Thunder-Eze-attacking.gif'),
      },
      {
        name: "Thunder King Eze",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Thunder-King-Eze.gif'),
        attackImage: require('../assets/characters/Thunder-King-Eze-attacking.gif'),
      },
      {
        name: "Thunder God Eze",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 50,
        defense: 45,
        image: require('../assets/characters/Thunder-God-Eze.gif'),
        attackImage: require('../assets/characters/Thunder-God-Eze-attacking.gif'),
      },
      {
        name: "Holy Thunder Eze",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 55,
        defense: 50,
        image: require('../assets/characters/Holy-Thunder-Eze.gif'),
        attackImage: require('../assets/characters/Holy-Thunder-Eze-attacking.gif'),
      },
      {
        name: "Thunder Legend Eze",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 60,
        defense: 55,
        image: require('../assets/characters/Thunder-Legend-Eze.gif'),
        attackImage: require('../assets/characters/Thunder-Legend-Eze-attacking.gif'),
      },
      {
        name: "Fulgur Halcyon Eze",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 125,
        defense: 60,
        image: require('../assets/characters/Fulgur-Halcyon-Eze.gif'),
        attackImage: require('../assets/characters/Fulgur-Halcyon-Eze-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 13,
    name: "Grahdens",
    hp: 200,
    maxHp: 200,
    type: "class",
    attack: 50,
    defense: 40,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Grahdens.gif'),
    attackImage: require('../assets/characters/Grahdens-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'saint',
    evolutions: [
      {
        name: "Twilight God Grahdens",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 55,
        defense: 50,
        image: require('../assets/characters/Twilight-God-Grahdens.gif'),
        attackImage: require('../assets/characters/Twilight-God-Grahdens-attacking.gif'),
      },
      {
        name: "Effulgent Dusk Grahdens",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 160,
        defense: 55,
        image: require('../assets/characters/Effulgent-Dusk-Grahdens.gif'),
        attackImage: require('../assets/characters/Effulgent-Dusk-Grahdens-attacking.gif'),
        attackType: "multiTarget"

      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 14,
    name: "Baiken",
    hp: 200,
    maxHp: 200,
    type: "class",
    attack: 160,
    defense: 50,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Baiken.gif'),
    attackImage: require('../assets/characters/Baiken-attacking.gif'),
    sound: 'dark',
    upgrades: [],
    attackType: "multiTarget"
  },
  {
    id: 15,
    name: "Great Thief Zelnite",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Great-Thief-Zelnite.gif'),
    attackImage: require('../assets/characters/Great-Thief-Zelnite-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'saint',
    evolutions: [
      {
        name: "Noble Thief Zelnite",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Noble-Thief-Zelnite.gif'),
        attackImage: require('../assets/characters/Noble-Thief-Zelnite-attacking.gif'),
      },
      {
        name: "Thief God Zelnite",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Thief-God-Zelnite.gif'),
        attackImage: require('../assets/characters/Thief-God-Zelnite-attacking.gif'),
      },
      {
        name: "Legendary Thief Zelnite",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 50,
        defense: 45,
        image: require('../assets/characters/Legendary-Thief-Zelnite.gif'),
        attackImage: require('../assets/characters/Legendary-Thief-Zelnite-attacking.gif'),
      },
      {
        name: "Chivalrous Thief Zelnite",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 155,
        defense: 50,
        image: require('../assets/characters/Chivalrous-Thief-Zelnite.gif'),
        attackImage: require('../assets/characters/Chivalrous-Thief-Zelnite-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 16,
    name: "Flame Demon Adel",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Flame-Demon-Adel.gif'),
    attackImage: require('../assets/characters/Flame-Demon-Adel-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Ember Hellion Adel",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 35,
        defense: 30,
        image: require('../assets/characters/Ember-Hellion-Adel.gif'),
        attackImage: require('../assets/characters/Ember-Hellion-Adel-attacking.gif'),
      },
      {
        name: "Pyro Archfiend Adel",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Pyro-Archfiend-Adel.gif'),
        attackImage: require('../assets/characters/Pyro-Archfiend-Adel-attacking.gif'),
      },
      {
        name: "Blazing Emperor Adel",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 150,
        defense: 40,
        image: require('../assets/characters/Blazing-Emperor-Adel.gif'),
        attackImage: require('../assets/characters/Blazing-Emperor-Adel-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 17,
    name: "Strong Flame Griff",
    hp: 170,
    maxHp: 170,
    type: "class",
    attack: 35,
    defense: 25,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Strong-Flame-Griff.gif'),
    attackImage: require('../assets/characters/Strong-Flame-Griff-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Mighty Blaze Griff",
        hp: 80,
        maxHp: 80,
        type: "class",
        attack: 30,
        defense: 25,
        image: require('../assets/characters/Mighty-Blaze-Griff.gif'),
        attackImage: require('../assets/characters/Mighty-Blaze-Griff-attacking.gif'),
      },
      {
        name: "Indomitable Flare Griff",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 35,
        defense: 30,
        image: require('../assets/characters/Indomitable-Flare-Griff.gif'),
        attackImage: require('../assets/characters/Indomitable-Flare-Griff-attacking.gif'),
      },
      {
        name: "Furious General Griff",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 140,
        defense: 35,
        image: require('../assets/characters/Furious-General-Griff.gif'),
        attackImage: require('../assets/characters/Furious-General-Griff-attacking.gif'),
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 18,
    name: "Wicked Warrior Shura",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Wicked-Warrior-Shura.gif'),
    attackImage: require('../assets/characters/Wicked-Warrior-Shura-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Heavenly Rift Shura",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 145,
        defense: 40,
        image: require('../assets/characters/Heavenly-Rift-Shura.gif'),
        attackImage: require('../assets/characters/Heavenly-Rift-Shura-attacking.gif'),
        attackType: "multiTarget"

      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 19,
    name: "Loch",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Loch.gif'),
    attackImage: require('../assets/characters/Loch-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'shot',
    evolutions: [
      {
        name: "Shock Bow Loch",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Shock-Bow-Loch.gif'),
        attackImage: require('../assets/characters/Shock-Bow-Loch-attacking.gif'),
      },
      {
        name: "Zeus Bow Loch",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Zeus-Bow-Loch.gif'),
        attackImage: require('../assets/characters/Zeus-Bow-Loch-attacking.gif'),
      },
      {
        name: "Heaven's Bow Loch",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 50,
        defense: 45,
        image: require('../assets/characters/Heavens-Bow-Loch.gif'),
        attackImage: require('../assets/characters/Heavens-Bow-Loch-attacking.gif'),
      },
      {
        name: "Celestial Archer Loch",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 155,
        defense: 50,
        image: require('../assets/characters/Celestial-Archer-Loch.gif'),
        attackImage: require('../assets/characters/Celestial-Archer-Loch.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 20,
    name: "Xenon",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Xenon.gif'),
    attackImage: require('../assets/characters/Xenon-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'water',
    evolutions: [
      {
        name: "Royal Guard Xenon",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 35,
        defense: 30,
        image: require('../assets/characters/Royal-Guard-Xenon.gif'),
        attackImage: require('../assets/characters/Royal-Guard-Xenon.gif'),
      },
      {
        name: "Sir Sancus Xenon",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 100,
        defense: 35,
        image: require('../assets/characters/Sir-Sancus-Xenon.gif'),
        attackImage: require('../assets/characters/Sir-Sancus-Xenon.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 21,
    name: "Crimson Fist Glenn",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Crimson-Fist-Glenn.gif'),
    attackImage: require('../assets/characters/Crimson-Fist-Glenn-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Scorching Fang Glenn",
        hp: 150,
        maxHp: 150,
        type: "class",
        attack: 190,
        defense: 100,
        image: require('../assets/characters/Scorching-Fang-Glenn.gif'),
        attackImage: require('../assets/characters/Scorching-Fang-Glenn-attacking.gif'),
        attackType: "multiTarget"

      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 22,
    name: "Zeln",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Zeln.gif'),
    attackImage: require('../assets/characters/Zeln-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Spark Kick Zeln",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Spark-Kick-Zeln.gif'),
        attackImage: require('../assets/characters/Spark-Kick-Zeln-attacking.gif'),
      },
      {
        name: "Thunder Kick Zeln",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Thunder-Kick-Zeln.gif'),
        attackImage: require('../assets/characters/Thunder-Kick-Zeln-attacking.gif'),
      },
      {
        name: "Thunder Punt Zeln",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 50,
        defense: 45,
        image: require('../assets/characters/Thunder-Punt-Zeln.gif'),
        attackImage: require('../assets/characters/Thunder-Punt-Zeln-attacking.gif'),
      },
      {
        name: "Storm Roundhouse Zeln",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 155,
        defense: 50,
        image: require('../assets/characters/Storm-Roundhouse-Zeln.gif'),
        attackImage: require('../assets/characters/Storm-Roundhouse-Zeln-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 23,
    name: "Knight Sergio",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Knight-Sergio.gif'),
    attackImage: require('../assets/characters/Knight-Sergio-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'water',
    evolutions: [
      {
        name: "Ice Ruler Sergio",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Ice-Ruler-Sergio.gif'),
        attackImage: require('../assets/characters/Ice-Ruler-Sergio-attacking.gif'),
      },
      {
        name: "Ice Knight Sergio",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Ice-Knight-Sergio.gif'),
        attackImage: require('../assets/characters/Ice-Knight-Sergio-attacking.gif'),
      },
      {
        name: "Ice Angel Sergio",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 50,
        defense: 45,
        image: require('../assets/characters/Ice-Angel-Sergio.gif'),
        attackImage: require('../assets/characters/Ice-Angel-Sergio-attacking.gif'),
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 24,
    name: "Blue Purity Vern",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 40,
    defense: 30,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Blue-Purity-Vern.gif'),
    attackImage: require('../assets/characters/Blue-Purity-Vern-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'water',
    evolutions: [
      {
        name: "Absolute Zero Vern",
        hp: 150,
        maxHp: 150,
        type: "class",
        attack: 190,
        defense: 100,
        image: require('../assets/characters/Absolute-Zer-Vern.gif'),
        attackImage: require('../assets/characters/Absolute-Zer-Vern-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 25,
    name: "Ember Elder Fiora",
    hp: 180,
    maxHp: 180,
    type: "class",
    attack: 90,
    defense: 50,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Ember-Elder-Fiora.gif'),
    attackImage: require('../assets/characters/Ember-Elder-Fiora-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'fire',
    evolutions: [
      {
        name: "Ember Sage Fiora",
        hp: 50,
        maxHp: 50,
        type: "class",
        attack: 50,
        defense: 50,
        image: require('../assets/characters/Ember-Sage-Fiora.gif'),
        attackImage: require('../assets/characters/Ember-Sage-Fiora-attacking.gif'),
      },
      {
        name: "Ember Charm Fiora",
        hp: 200,
        maxHp: 200,
        type: "class",
        attack: 200,
        defense: 200,
        image: require('../assets/characters/Ember-Charm-Fiora.gif'),
        attackImage: require('../assets/characters/Ember-Charm-Fiora-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 26,
    name: "Semira",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Semira.gif'),
    attackImage: require('../assets/characters/Semira.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'dark',
    evolutions: [
      {
        name: "Pumqueen Semira",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Pumqueen-Semira.gif'),
        attackImage: require('../assets/characters/Pumqueen-Semira.gif'),
      },
      {
        name: "Pumpress Semira",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 45,
        defense: 40,
        image: require('../assets/characters/Pumpress-Semira.gif'),
        attackImage: require('../assets/characters/Pumpress-Semira.gif'),
      },
      {
        name: "Pumleficent Semira",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 50,
        defense: 45,
        image: require('../assets/characters/Pumleficent-Semira.gif'),
        attackImage: require('../assets/characters/Pumleficent-Semira.gif'),
      },
      {
        name: "Headpumtress Semira",
        hp: 100,
        maxHp: 100,
        type: "class",
        attack: 155,
        defense: 50,
        image: require('../assets/characters/Headpumtress-Semira.gif'),
        attackImage: require('../assets/characters/Headpumtress-Semira.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  },
  {
    id: 27,
    name: "Dual Blade Eru",
    hp: 190,
    maxHp: 190,
    type: "class",
    attack: 45,
    defense: 35,
    attacked: false,
    isAttacking: false,
    image: require('../assets/characters/Dual-Blade-Eru.gif'),
    attackImage: require('../assets/characters/Dual-Blade-Eru-attacking.gif'),
    upgrades: [],
    currentEvolution: -1,
    sound: 'dark',
    evolutions: [
      {
        name: "Dual Blade God Eru",
        hp: 90,
        maxHp: 90,
        type: "class",
        attack: 40,
        defense: 35,
        image: require('../assets/characters/Dual-Blade-God-Eru.gif'),
        attackImage: require('../assets/characters/Dual-Blade-God-Eru-attacking.gif'),
      },
      {
        name: "Twin Dragons Eru",
        hp: 120,
        maxHp: 120,
        type: "class",
        attack: 80,
        defense: 40,
        image: require('../assets/characters/Twin-Dragons-Eru.gif'),
        attackImage: require('../assets/characters/Twin-Dragons-Eru-attacking.gif'),
        attackType: "multiTarget"
      }
    ],
    attackType: "singleTarget"
  }
];
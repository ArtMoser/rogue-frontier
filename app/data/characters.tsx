export const characters = [
    {
      id: 1,
      name: "Guerreiro",
      hp: 100,
      maxHp: 100,
      type: "class",
      attack: 15,
      defense: 10,
      isAttacking: false,
      attacked: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif'),
      currentEvolution: -1,
      evolutions:[
        {
          name: "Cavaleiro",
          hp: 100,
          maxHp: 100,
          type: "class",
          attack: 15,
          defense: 10,
          image: require('../assets/monsters/monster_yggdrasil_idle.gif'),
          attackImage: require('../assets/characters/rogue.png'),
        }
      ]
    },
    {
      id: 2,
      name: "Mago",
      hp: 80,
      maxHp: 80,
      type: "class",
      attack: 25,
      defense: 5,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 3,
      name: "Arqueiro",
      hp: 90,
      maxHp: 90,
      type: "class",
      attack: 20,
      defense: 8,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 4,
      name: "Paladino",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 5,
      name: "Paladino6",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 6,
      name: "Paladino7",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 7,
      name: "Paladino8",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 8,
      name: "Paladino2",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 9,
      name: "Paladino3",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    },
    {
      id: 10,
      name: "Paladino4",
      hp: 120,
      maxHp: 120,
      type: "class",
      attack: 12,
      defense: 15,
      attacked: false,
      isAttacking: false,
      image: require('../assets/characters/rogue.png'),
      attackImage: require('../assets/monsters/monster_yggdrasil_idle.gif')
    }
  ];

export const charactersLevelTwo = [
    {
      name: "Artas o Cramunhão",
      nextEvolution: 11,
      hp: 30,
      maxHp: 20,
      attack: 10,
      defense: 5,
    }
]; 
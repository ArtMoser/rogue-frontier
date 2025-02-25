export const upgrades = [
    {
      label: "Increase HP",
      attribute: "maxHp",
      coAttribute: "hp",
      type: "literal",
      value: 10,
      image: require('../assets/misc/hp-buff.png')
    },
    {
      label: "Increase Attack",
      attribute: "attack",
      type: "literal",
      value: 10,
      image: require('../assets/misc/atk-buff.png')
    },
    {
      label: "Increase defense",
      attribute: "defense",
      type: "literal",
      value: 3,
      image: require('../assets/misc/def-buff.png')
    },
    {
      label: "Increase Attack",
      attribute: "attack",
      type: "percentage",
      value: 0.3
      ,
      image: require('../assets/misc/atk-buff.png')
    },
    {
      label: "Increase HP", 
      attribute: "hp",
      coAttribute: "maxHp",
      type: "percentage",
      value: 0.3,
      image: require('../assets/misc/hp-buff.png')
    },
    {
      label: "Increase Defense",
      attribute: "defense",
      type: "percentage",
      value: 0.3,
      image: require('../assets/misc/def-buff.png')
    },
  ];
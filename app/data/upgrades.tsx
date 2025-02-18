export const upgrades = [
    {
      attribute: "maxHp",
      coAttribute: "hp",
      type: "literal",
      value: 10
    },
    {
      attribute: "attack",
      type: "literal",
      value: 10
    },
    {
      attribute: "defense",
      type: "literal",
      value: 3
    },
    {
      attribute: "attack",
      type: "percentage",
      value: 0.3
    },
    {
      attribute: "hp",
      coAttribute: "maxHp",
      type: "percentage",
      value: 0.3
    },
    {
      attribute: "defense",
      type: "percentage",
      value: 0.3
    },
  ];
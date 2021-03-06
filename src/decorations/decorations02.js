export function decorationsBackground02(levelWidth, levelHeight) {
  return [
    {
      name: "wallpaper",
      size: { x: levelWidth, y: levelHeight },
      backgroundColor: "#1d1d1d",
      status: [{ pos: { x: 0, y: 0 } }]
    },
    {
      name: "wallpaper-accent",
      size: { x: levelWidth, y: 3 },
      status: [
        { pos: { x: 0, y: 124 } },
        { pos: { x: 0, y: 147 } },
        { pos: { x: 0, y: 95 } },
        { pos: { x: 0, y: 118 } },
        { pos: { x: 0, y: 66 } },
        { pos: { x: 0, y: 89 } },
        { pos: { x: 0, y: 37 } },
        { pos: { x: 0, y: 60 } },
        { pos: { x: 0, y: 8 } },
        { pos: { x: 0, y: 31 } }
      ]
    },
    {
      name: "inner-mansion-window",
      size: { x: 6.8, y: 10.65 },
      status: [
        { pos: { x: 10, y: 131 } },
        { pos: { x: 20, y: 131 } },
        { pos: { x: 75, y: 131 } },
        { pos: { x: 85, y: 131 } },
        { pos: { x: 10, y: 74 } },
        { pos: { x: 20, y: 74 } },
        { pos: { x: 75, y: 74 } },
        { pos: { x: 85, y: 74 } },
        { pos: { x: 10, y: 15 } },
        { pos: { x: 20, y: 15 } },
        { pos: { x: 75, y: 15 } },
        { pos: { x: 85, y: 15 } }
      ]
    },
    {
      name: "phoney-ladder",
      size: { x: 2, y: 4 },
      status: [
        { pos: { x: 93.1, y: -1.2 } },
        { pos: { x: 93.1, y: 32 } },
        { pos: { x: 7.1, y: 61 } },
        { pos: { x: 93.1, y: 90 } },
        { pos: { x: 7.1, y: 119 } },
        { pos: { x: 93.1, y: 148 } }
      ]
    },
    {
      name: "phoney-wall",
      size: { x: 1, y: 1 },
      status: [
        { pos: { x: 92, y: 122 } },
        { pos: { x: 95.2, y: 122 } },
        { pos: { x: 6, y: 93 } },
        { pos: { x: 9.2, y: 93 } },
        { pos: { x: 92, y: 64 } },
        { pos: { x: 95.2, y: 64 } },
        { pos: { x: 6, y: 35 } },
        { pos: { x: 9.2, y: 35 } },
        { pos: { x: 92, y: 0 }, customSize: { x: 1, y: 7 } },
        { pos: { x: 95.2, y: 0 }, customSize: { x: 1, y: 7 } }
      ]
    },
    {
      name: "spider-web",
      size: { x: 6.8, y: 6.1 },
      status: [
        { pos: { x: 20, y: 131 } },
        { pos: { x: 20, y: 74 } },
        { pos: { x: 85, y: 74 } },
        { pos: { x: 85, y: 15 } }
      ]
    },
    {
      name: "spider-thread",
      size: { x: 0.05, y: 28 },
      status: [
        { pos: { x: 40.25, y: 123 } },
        { pos: { x: 65.25, y: 123 } },
        { pos: { x: 73.25, y: 123 } },
        { pos: { x: 64.25, y: 94 } },
        { pos: { x: 76.25, y: 94 } },
        { pos: { x: 20.25, y: 94 } },
        { pos: { x: 16.25, y: 94 } },
        { pos: { x: 26.25, y: 94 } },
        { pos: { x: 40.25, y: 65 } },
        { pos: { x: 65.25, y: 65 } },
        { pos: { x: 26.25, y: 36 } },
        { pos: { x: 76.25, y: 7 } },
        { pos: { x: 20.25, y: 7 } }
      ]
    }
  ];
}

export function decorationsForeground02(levelWidth, levelHeight) {
  return [];
}

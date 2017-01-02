export function sublevel01Bg(levelWidth, levelHeight) {
  return [
    { name: 'wallpaper',
      size: { x: levelWidth, y: levelHeight},
      status: [{pos: {x: 0, y: 0}}]
    },
    { name: 'mansion',
      size: { x: 57, y: 26 },
      status: [{pos: {x: 345, y: 0}}]
    },
    { name: 'tree-small',
      size: { x: 10, y: 15 },
      status: [
        {pos: {x: 45, y: 40}},
        {pos: {x: 1, y: 40}},
        {pos: {x: 172, y: 38}},
        {pos: {x: 205, y: 38}},
        {pos: {x: 220, y: 38}},
        {pos: {x: 240, y: 38}},
        {pos: {x: 278, y: 38}},
      ]
    },
    { name: 'tree',
      size: { x: 15, y: 25 },
      status: [
        {pos: {x: 9, y: 30}},
        {pos: {x: 189, y: 30}},
        {pos: {x: 215, y: 30}},
        {pos: {x: 265, y: 30}}
      ]
    },
    { name: 'tree-large',
      size: { x: 15, y: 28 },
      status: [
        {pos: {x: 177, y: 25}},
        {pos: {x: 286, y: 25}},
        {pos: {x: 246, y: 25}}
      ]
    },
    { name: 'tombstone',
      size: { x: 2.9, y: 3.7 },
      status: [
        {pos: {x: 155, y: 49}},
        {pos: {x: 162, y: 49}},
        {pos: {x: 182, y: 49}},
        {pos: {x: 205, y: 49}},
        {pos: {x: 211, y: 49}},
        {pos: {x: 216, y: 49}},
        {pos: {x: 254, y: 49}},
      ]
    },
    { name: 'tombstone-cross',
      size: { x: 3.2, y: 4 },
      status: [
        {pos: {x: 167, y: 49.5}},
        {pos: {x: 177, y: 49.5}},
        {pos: {x: 199, y: 49.5}},
        {pos: {x: 259, y: 49.5}},
      ]
    },
    { name: 'soil',
      size: { x: 61, y: 30 },
      status: [{pos: {x: 341, y: 26}}]
    },
    { name: 'cliff',
      status: [
        {
          pos: {x: 339.5, y: 25},
          customSize: { x: 2, y: 21 }
        },
        {
          pos: {x: 340, y: 40},
          customSize: { x: 2, y: 13 }
        },
      ]
    },
    { name: 'black-grass',
      status: [
        {pos: {x: 0, y: 52}, customSize: {x: 60, y: 3 }},
        {pos: {x: 140, y: 52}, customSize: {x: 220, y: 3 }},
        {pos: {x: 160, y: 51.5}, customSize: {x: 50, y: 3 }},
        {pos: {x: 341, y: 24.5}, customSize: {x: 30, y: 3 }},
      ]
    },
    { name: 'house',
      size: { x: 22, y: 25 },
      status: [{pos: {x: 22, y: 29}}]
    },
    { name: 'house-window',
      size: { x: 3.5, y: 6.5 },
      status: [
        {pos: {x: 27, y: 41}},
        {pos: {x: 36, y: 41}},
      ]
    },
    { name: 'mansion-window',
      size: { x: 3.5, y:6.5 },
      status: [
        {pos: {x: 350, y: 15}},
        {pos: {x: 358, y: 15}},
        {pos: {x: 366, y: 15}},
        {pos: {x: 374, y: 15}},
        {pos: {x: 382, y: 15}},
        {pos: {x: 398, y: 15}},
        {pos: {x: 350, y: 6}},
        {pos: {x: 358, y: 6}},
        {pos: {x: 366, y: 6}},
        {pos: {x: 374, y: 6}},
        {pos: {x: 382, y: 6}},
        {pos: {x: 390, y: 6}},
        {pos: {x: 398, y: 6}},
        {pos: {x: 350, y: -3}},
        {pos: {x: 358, y: -3}},
        {pos: {x: 366, y: -3}},
        {pos: {x: 374, y: -3}},
        {pos: {x: 382, y: -3}},
        {pos: {x: 390, y: -3}},
        {pos: {x: 398, y: -3}},
      ]
    },
    { name: 'mansion-door-open',
      size: { x: 5.2, y:10.3},
      status: [
        {pos: {x: 389.3, y: 15}},
      ]
    },
    { name: 'spider-web',
      size: { x: 6.8, y:6.1 },
      status: [
        {pos: {x: 345, y: 0}},
      ]
    },
    { name: 'spider-thread',
      size: { x: .05, y: 26 },
      status: [{pos: {x: 373.65, y: 0}}]
    },
  ];
}

export function sublevel01Fg(levelWidth, levelHeight) {
  return [
    { name: 'black-grass',
      status: [
        {pos: {x: 0, y: 53}, customSize: {x: 60, y: 3 }},
        {pos: {x: 59, y: 53.1}, customSize: {x: 5, y: 3 }},
        {pos: {x: 64, y: 53.6}, customSize: {x: 5, y: 3 }},
        {pos: {x: 135, y: 53.1}, customSize: {x: 5, y: 3 }},
        {pos: {x: 130, y: 53.6}, customSize: {x: 5, y: 3 }},
        {pos: {x: 140, y: 53}, customSize: {x: 262, y: 3 }},
        {pos: {x: 341, y: 25.2}, customSize: {x: 41, y: 3 }},
        {pos: {x: 385.5, y: 25.2}, customSize: {x: 16.5, y: 3 }},
      ]
    },
    { name: 'water-top',
      size: { x: 81, y: 2 },
      status: [{pos: {x: 60, y: 54.5}}]
    },
    { name: 'fence-01',
      status: [
        {pos: {x: 392, y: 22}, customSize: { x: 10, y: 4 }},
        {pos: {x: 362, y: 22}, customSize: { x: 20, y: 4 }},
      ]
    },
    { name: 'fence-02',
      size: { x: 4, y: 4 },
      status: [
        {pos: {x: 393, y: 22}},
        {pos: {x: 389, y: 22}},
      ]
    },
  ]
}
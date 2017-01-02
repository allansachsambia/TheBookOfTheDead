import Player from './actors/player/player';
import Coin from './actors/items/coin';
import Flag from './actors/items/flag';
import Door from './actors/items/door';
import Pizza from './actors/items/pizza';
import Ladder from './actors/items/ladder';
import Spider from './actors/enemies/spider';
import Ghost from './actors/enemies/ghost';
import Zombie from './actors/enemies/zombie';
import Skeleton from './actors/enemies/skeleton';

import { jamjar } from './jamjar';

export let settings = {
  maxStep: 0.05,
  wobbleSpeed: 10,
  wobbleDist: 0.05,
  speed: 20,
  gravity: 100,
  jumpSpeed: 45
};

export let scale = 30;

export let actorChars = {
  '@': Player,
  'o': Coin,
  'F': Flag,
  'L': Ladder,
  '^': Door,
  'p': Pizza,
  '*': Spider,
  '#': Spider,
  '$': Ghost,
  '%': Zombie,
  'S': Skeleton
};

export let obstacleChars = {
  'x': 'wall',
  '~': 'water',
  'i': 'web',
  '&': 'pseudo-wall',
  '!': 'lava',
  '/': 'grass',
  'w': 'wood'
}

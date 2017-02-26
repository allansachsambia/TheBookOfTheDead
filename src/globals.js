import Player from './actors/player/player';
import Coin from './actors/items/coin';
import Flag from './actors/items/flag';
import Door from './actors/items/door';
import Pizza from './actors/items/pizza';
import Ladder from './actors/items/ladder';
import Spider from './actors/enemies/spider';
import Zombie from './actors/enemies/zombie';

import { jamjar } from './jamjar';

export const settings = {
  maxStep: 0.05,
  wobbleSpeed: 10,
  wobbleDist: 0.05,
  speed: 20,
  gravity: 100,
  jumpSpeed: 45,
};

export const scale = 30;

export const actorChars = {
  '@': Player,
  o: Coin,
  F: Flag,
  L: Ladder,
  '^': Door,
  p: Pizza,
  '*': Spider,
  '#': Spider,
  '%': Zombie,
};

export const obstacleChars = {
  x: 'wall',
  '~': 'water',
  i: 'web',
  '&': 'pseudo-wall',
  '!': 'lava',
  '/': 'grass',
  w: 'wood',
};

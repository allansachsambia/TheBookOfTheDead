import Player from './actors/player';
import Flag from './actors/flag';
import Door from './actors/door';
import Pizza from './actors/pizza';
import Soda from './actors/soda';
import Ladder from './actors/ladder';
import Spider from './actors/spider';
import Zombie from './actors/zombie';

import helpers from './helpers';

export const settings = {
  maxStep: 0.05,
  wobbleSpeed: 10,
  wobbleDist: 0.05,
  speed: 20,
  gravity: 100,
  jumpSpeed: 45,
  climbSpeed: 0.4,
};

export const scale = 30;

export const actorChars = {
  '@': Player,
  F: Flag,
  L: Ladder,
  '^': Door,
  P: Pizza,
  S: Soda,
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
  h: 'grassyhill',
  w: 'wood',
};

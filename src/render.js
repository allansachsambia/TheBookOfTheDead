import helpers from './helpers';
import { scale } from './globals';
import maps from './maps';
import { decorationsBackground01, decorationsForeground01 } from './decorations/decorations01';
import { decorationsBackground02, decorationsForeground02 } from './decorations/decorations02';

class Render {

  constructor(level, status) {
    const game = helpers.el('div', `game level${level.status.mapNumber}`);
    this.wrap = document.body.appendChild(game);
    this.level = level;
    this.status = status;
    this.actorLayer = null;
    this.daggerLayer = null;
    this.swordLayer = null;
    this.statusLayer = null;
    this.drawPosteriorStaticLayers();
    this.drawAnteriorStaticLayers();
    this.drawAnimatedLayers();
  }

  clearGame() {
    this.wrap.parentNode.removeChild(this.wrap);
  }

  clearAnimatedLayers() {
    const animatedLayers = [this.actorLayer, this.daggerLayer, this.swordLayer, this.statusLayer];
    animatedLayers.forEach((animatedLayer) => {
      if (animatedLayer) { this.wrap.removeChild(animatedLayer); }
    });
  }

  drawPosteriorStaticLayers() {
    this.wrap.appendChild(this.drawBackground());
    this.wrap.appendChild(this.drawObstacle());
  }

  drawAnteriorStaticLayers() {
    this.wrap.appendChild(this.drawForeground());
  }

  drawAnimatedLayers() {
    this.clearAnimatedLayers();
    const foreground = document.getElementsByClassName('foreground')[0];
    this.daggerLayer = this.wrap.insertBefore(this.drawDagger(), foreground);
    this.swordLayer = this.wrap.insertBefore(this.drawSword(), foreground);
    this.actorLayer = this.wrap.insertBefore(this.drawActors(), foreground);
    this.statusLayer = this.wrap.appendChild(this.drawStatus());
    this.scrollPlayerIntoView();
  }

  reorderActors() {
    const playerIndex = this.level.actors.findIndex(actor => actor.type === 'player');
    helpers.move(this.level.actors, playerIndex, this.level.actors.length - 1);
  }

  drawActors() {
    const wrap = helpers.el('div', 'actors');
    this.reorderActors();
    this.level.actors.forEach((actor) => {
      const el = wrap.appendChild(helpers.el('div', `actor ${actor.type}`));
      const style = el.style;
      style.width = `${actor.size.x * scale}px`;
      style.height = `${actor.size.y * scale}px`;
      style.left = `${actor.pos.x * scale}px`;
      style.top = `${actor.pos.y * scale}px`;
      if (actor.direction === 'left') { el.className += ' x-flip'; }
      if (actor.type === 'player') {
        if (!actor.actionSubtype) {
          el.className = `actor ${actor.type} ${actor.type}-${actor.actionType}-${actor.spriteNumber}`;
        } else if (actor.actionSubtype) {
          el.className = `actor ${actor.type} ${actor.type}-${actor.actionType}-${actor.actionSubtype}-${actor.spriteNumber}`;
        }
        if (actor.direction === 'left') { el.classList.add('x-flip'); }
        if (actor.damaged) { el.classList.add('damaged'); }
      }

      if (actor.type === 'zombie') {
        el.className = `actor ${actor.type} ${actor.type}-${helpers.pad(actor.variant, 3)}-${actor.actionType}-${actor.spriteNumber}`;
        if (actor.direction === 'left') { el.classList.add('x-flip'); }
      }

      if (actor.type === 'spider') {
        el.className = `actor ${actor.type} ${actor.type}-${actor.actionType}-${actor.spriteNumber}`;
      }
    });
    return wrap;
  }

  draw(layer, cb) {
    const wrap = helpers.el('div', layer);
    const arr = cb(this.level.width, this.level.height);
    arr.forEach((itemType) => {
      const name = itemType.name;
      let size = itemType.size;
      itemType.status.forEach((status) => {
        if (status.customSize) { size = status.customSize; }
        const el = wrap.appendChild(helpers.el('div', name));
        const style = el.style;
        style.width = `${size.x * scale}px`;
        style.height = `${size.y * scale}px`;
        style.left = `${status.pos.x * scale}px`;
        style.top = `${status.pos.y * scale}px`;
        el.style.position = 'absolute';
      });
    });
    return wrap;
  }

  drawBackground() {
    let wrap;
    const layer = 'background';
    switch (this.level.mapNumber) {
      case 0:
        wrap = this.draw(layer, decorationsBackground01);
        break;
      case 1:
        wrap = this.draw(layer, decorationsBackground02);
        break;
      default:
    }
    return wrap;
  }

  drawForeground() {
    let wrap;
    const layer = 'foreground';
    switch (this.level.mapNumber) {
      case 0:
        wrap = this.draw(layer, decorationsForeground01);
        break;
      case 1:
        wrap = this.draw(layer, decorationsForeground02);
        break;
      default:
    }
    return wrap;
  }

  drawObstacle() {
    const table = helpers.el('table', 'non-actors');
    const style = table.style;
    style.width = `${this.level.width * scale}px`;
    style.backgroundRepeat = 'repeat';
    style.borderSpacing = '0';
    style.borderCollapse = 'collapse';
    style.position = 'relative';
    this.level.typeMap.forEach((line) => {
      const row = table.appendChild(helpers.el('tr'));
      row.style.height = `${scale}px`;
      line.forEach((type) => {
        row.appendChild(helpers.el('td', type));
      });
    });
    return table;
  }

  drawDagger() {
    const self = this;
    const wrap = helpers.el('div', 'dagger');
    this.level.player.daggers.forEach((dagger) => {
      const daggerEl = wrap.appendChild(helpers.el('div', 'dagger'));
      const style = daggerEl.style;
      if (dagger.direction === 'right') { daggerEl.className += ' right'; }
      if (dagger.direction === 'left') { daggerEl.className += ' left'; }
      style.width = `${dagger.size.x * scale}px`;
      style.height = `${dagger.size.y * scale}px`;
      style.left = `${dagger.pos.x * scale}px`;
      style.top = `${dagger.pos.y * scale}px`;
      style.position = 'absolute';
    });
    return wrap;
  }

  drawSword() {
    const self = this;
    const wrap = helpers.el('div', 'sword');
    this.level.player.swords.forEach((sword) => {
      const swordEl = wrap.appendChild(helpers.el('div', 'sword'));
      const style = swordEl.style;
      if (sword.direction === 'right') { swordEl.className += ' right'; }
      if (sword.direction === 'left') { swordEl.className += ' left'; }
      style.width = `${sword.size.x * scale}px`;
      style.height = `${sword.size.y * scale}px`;
      style.left = `${sword.pos.x * scale}px`;
      style.top = `${sword.pos.y * scale}px`;
      style.position = 'absolute';
    });
    return wrap;
  }

  drawStatus() {
    const wrap = helpers.el('div', 'status');
    const statusElem = wrap.appendChild(helpers.el('div', 'status-life-meter'));

    for (let i = 0; i < this.status.lifeMeter; i += 1) {
      statusElem.appendChild(helpers.el('div', 'status-life-meter-partition'));
    }

    if (this.status.lifeMeter < 10) {
      const emptyElem = 10 - this.status.lifeMeter;
      for (let i = 0; i < emptyElem; i += 1) {
        statusElem.appendChild(helpers.el('div', 'status-life-meter-partition-empty'));
      }
    }

    const scoreElem = wrap.appendChild(helpers.el('div', 'status-score'));
    const scoreTitle = scoreElem.appendChild(helpers.el('div', 'status-score-title'));
    const scoreScore = scoreElem.appendChild(helpers.el('div', 'status-score-score'));
    scoreTitle.innerHTML = this.status.name;
    scoreScore.innerHTML = this.status.score;
    const levelElem = wrap.appendChild(helpers.el('div', 'status-level'));
    const levelTitle = levelElem.appendChild(helpers.el('div', 'status-level-title'));
    const levelLevel = levelElem.appendChild(helpers.el('div', 'status-level-level'));
    levelTitle.innerHTML = 'Level'.toUpperCase();
    levelLevel.innerHTML = `${this.level.status.levelNumber} - ${this.level.status.sublevelNumber}`;
    const timerElem = wrap.appendChild(helpers.el('div', 'status-timer'));
    const timerTitle = timerElem.appendChild(helpers.el('div', 'status-timer-title'));
    const timerTimer = timerElem.appendChild(helpers.el('div', 'status-timer-timer'));
    timerTitle.innerHTML = 'Time'.toUpperCase();
    const time = this.status.time.toString();
    const shortTime = time.slice(0, time.length - 2);
    timerTimer.innerHTML = shortTime;
    return wrap;
  }

  scrollPlayerIntoView() {
    const player = this.level.player;
    const center = player.pos.plus(player.size.times(0.5)).times(scale);
    if (center.x < this.wrap.scrollLeft + (this.wrap.clientWidth / 3)) {
      this.wrap.scrollLeft = center.x - (this.wrap.clientWidth / 3);
    } else if (center.x > (this.wrap.scrollLeft + this.wrap.clientWidth) - (this.wrap.clientWidth / 3)) {
      this.wrap.scrollLeft = center.x + ((this.wrap.clientWidth / 3) - this.wrap.clientWidth);
    }
    if (center.y < this.wrap.scrollTop + (this.wrap.clientHeight / 1.25)) {
      this.wrap.scrollTop = center.y - (this.wrap.clientHeight / 1.25);
    } else if (center.y > (this.wrap.scrollTop + this.wrap.clientHeight) - (this.wrap.clientHeight / 5)) {
      this.wrap.scrollTop = center.y + ((this.wrap.clientHeight / 5) - this.wrap.clientHeight);
    }
  }
}

export default Render;

import { jamjar } from '../jamjar';
import { scale } from '../globals';
import { maps } from '../maps/maps'
import { sublevel01Bg, sublevel01Fg } from './sublevels/sublevel01';
import { sublevel02Bg, sublevel02Fg } from './sublevels/sublevel02';

class Render {

  constructor(level, status) {
    let game = jamjar.el(`div`, `game level${level.status.sublevelNumber}`);
    this.wrap = document.body.appendChild(game);
    this.level = level;
    this.status = status;
    this.actorLayer = null;
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
    let animatedLayers = [this.actorLayer, this.swordLayer, this.statusLayer];
    animatedLayers.forEach((animatedLayer) => {
      if (animatedLayer) { this.wrap.removeChild(animatedLayer) }
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
    let foreground = document.getElementsByClassName('foreground')[0];
    this.swordLayer = this.wrap.insertBefore(this.drawSword(), foreground);
    this.actorLayer = this.wrap.insertBefore(this.drawActors(), foreground);
    this.statusLayer = this.wrap.appendChild(this.drawStatus());
    this.scrollPlayerIntoView();
  }

  reorderActors() {
    // Make player the most anterior actor.
    let playerIndex = this.level.actors.findIndex(function(actor) {
      return actor.type === 'player';
    });


    jamjar.move(this.level.actors, playerIndex, this.level.actors.length - 1);

  }

  drawActors() {
    let wrap = jamjar.el('div', 'actors');
    this.reorderActors();

    this.level.actors.forEach((actor) => {
      let el = wrap.appendChild(jamjar.el(`div`, `actor ${actor.type}`));
      let style = el.style;
      let actions, damageFilters;
      switch (actor.type) {
        case 'player':
          actions = ['standing', 'running', 'squatting', 'crawling', 'climbing'];
          damageFilters = ['invert(100%)', 'saturate(100)'];
          break;
        case 'zombie':
          actions = ['walking'];
          break;
        case 'skeleton':
          actions = ['walking'];
          break;
        case 'ghost':
          actions = ['gliding'];
          style.opacity = actor.opacity;
          damageFilters = ['invert(100%)', 'saturate(100)', 'hue(100)']
          break;
      }
      style.width  = `${actor.size.x * scale}px`;
      style.height = `${actor.size.y * scale}px`;
      style.left   = `${actor.pos.x  * scale}px`;
      style.top    = `${actor.pos.y  * scale}px`;
      if (actor.direction === 'left') { el.className += ' x-flip' }
      if (actions) {
        actions.forEach((action) => {
          if (actor.action[action]) {
            style.backgroundImage = `url('${actor.images[action]}')`;
          }
        });
      }
      if (damageFilters && actor.damaged) {
        damageFilters.forEach((damageFilter) => {
          style.WebkitFilter = damageFilter;
        });
      }
    });
    return wrap;
  }

  draw(layer, cb){
    let wrap = jamjar.el('div', layer);
    let arr = cb(this.level.width, this.level.height);
    arr.forEach((itemType) => {
      let name = itemType.name;
      let size = itemType.size;
      itemType.status.forEach((status) => {
        if (status.customSize) {size = status.customSize}
        let el = wrap.appendChild(jamjar.el('div', name));
        let style = el.style;
        style.width  = `${size.x * scale}px`;
        style.height = `${size.y * scale}px`;
        style.left   = `${status.pos.x * scale}px`;
        style.top    = `${status.pos.y * scale}px`;
        el.style.position = 'absolute';
      });
    });
    return wrap;
  }

  drawBackground() {
    let wrap;
    let layer = 'background';
    switch(this.level.sublevelNumber) {
      case 0:
        wrap = this.draw(layer, sublevel01Bg);
        break;
      case 1:
        wrap = this.draw(layer, sublevel02Bg);
        break;
    }
    return wrap;
  }

  drawForeground() {
    let wrap;
    let layer = 'foreground';
    switch(this.level.sublevelNumber) {
      case 0:
        wrap = this.draw(layer, sublevel01Fg);
        break;
      case 1:
        wrap = this.draw(layer, sublevel02Fg);
        break;
    }
    return wrap;
  }

  drawObstacle() {
    let table = jamjar.el('table', 'non-actors');
    let style = table.style;
    style.width = this.level.width * scale + 'px';
    style.backgroundRepeat = 'repeat';
    style.borderSpacing = '0';
    style.borderCollapse = 'collapse';
    style.position = 'relative';
    this.level.typeMap.forEach((line) => {
      let row = table.appendChild(jamjar.el('tr'));
      row.style.height = scale + 'px';
      line.forEach((type) => {
        row.appendChild(jamjar.el('td', type))
      });
    });
    return table;
  }

  drawSword() {
    let self = this
    let wrap = jamjar.el('div', 'sword');
    this.level.player.swords.forEach((sword) => {
      let swordEl = wrap.appendChild(jamjar.el('div', 'sword'));
      let style = swordEl.style;
      if (sword.direction === 'right') { swordEl.className += " right"; }
      if (sword.direction === 'left') { swordEl.className += " left"; }
      style.width = sword.size.x * scale + 'px';
      style.height = sword.size.y * scale + 'px';
      style.left = sword.pos.x  * scale + 'px';
      style.top = sword.pos.y  * scale + 'px';
      style.position = 'absolute';
    });
    return wrap;
  }

  drawStatus() {
    let self = this;
    let wrap = jamjar.el('div', 'status');
    let statusElem = wrap.appendChild(jamjar.el('div', 'status-life-meter'));
    for (let i = 0; i < this.level.player.lifeMeter; i += 1) {
      statusElem.appendChild(jamjar.el('div', 'status-life-meter-partition'));
    }
    if (this.level.player.lifeMeter < 10) {
      let emptyElem = 10 - this.level.player.lifeMeter;
      for (let i = 0; i < emptyElem; i += 1) {
        statusElem.appendChild(jamjar.el('div', 'status-life-meter-partition-empty'));
      }
    }
    let scoreElem = wrap.appendChild(jamjar.el('div', 'status-score'));
    let scoreTitle = scoreElem.appendChild(jamjar.el('div', 'status-score-title'));
    let scoreScore = scoreElem.appendChild(jamjar.el('div', 'status-score-score'));
    scoreTitle.innerHTML = self.status.name;
    scoreScore.innerHTML = self.status.score;
    let levelElem = wrap.appendChild(jamjar.el('div', 'status-level'));
    let levelTitle = levelElem.appendChild(jamjar.el('div', 'status-level-title'));
    let levelLevel = levelElem.appendChild(jamjar.el('div', 'status-level-level'));
    levelTitle.innerHTML = 'Level'.toUpperCase();
    levelLevel.innerHTML = `${self.level.status.levelNumber} - ${maps.length}`;
    let timerElem = wrap.appendChild(jamjar.el('div', 'status-timer'));
    let timerTitle = timerElem.appendChild(jamjar.el('div', 'status-timer-title'));
    let timerTimer = timerElem.appendChild(jamjar.el('div', 'status-timer-timer'));
    timerTitle.innerHTML = 'Time'.toUpperCase();
    let time = self.status.time.toString();
    let shortTime = time.slice(0, time.length - 2);
    timerTimer.innerHTML = shortTime;
    return wrap;
  }

  scrollPlayerIntoView() {
    let width = this.wrap.clientWidth;
    let height = this.wrap.clientHeight;
    let xMargin = width / 3;
    let yMargin = height / 3;
    let left = this.wrap.scrollLeft;
    let top = this.wrap.scrollTop;
    let right = left + width;
    let bottom = top + height;
    let player = this.level.player;
    let center = player.pos.plus(player.size.times(0.5)).times(scale);
    if (center.x < left + xMargin) {
      this.wrap.scrollLeft = center.x - xMargin;
    } else if (center.x > right - xMargin) {
      this.wrap.scrollLeft = center.x + xMargin - width;
    }
    if (center.y < top + yMargin) {
      this.wrap.scrollTop = center.y - yMargin;
    } else if (center.y > bottom - yMargin) {
      this.wrap.scrollTop = center.y + yMargin - height;
    }
  }

}

export default Render

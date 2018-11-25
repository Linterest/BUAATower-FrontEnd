import { Engine, Instance } from 'cooljs'
import { touchEventHandler } from './utils'
import { background } from './background'
import { lineAction, linePainter } from './line'
import { cloudAction, cloudPainter } from './cloud'
import { hookAction, hookPainter } from './hook'
import { tutorialAction, tutorialPainter } from './tutorial'
import * as constant from './constant'
import { startAnimate, endAnimate } from './animateFuncs'

window.TowerGame = (option = {}) => {
  const {
    width,
    height,
    canvasId,
    soundOn
  } = option
  const game = new Engine({
    canvasId,
    highResolution: true,
    width,
    height,
    soundOn
  })
  const pathGenerator = (path) => `./assets/${path}`

  var url = new Array();
  url[0] = "block1.png";
  url[1] = "block2.png";
  url[2] = "block3.png";
  url[3] = "block4.png";
  url[4] = "block5.png";
  url[5] = "block6.png";
  url[6] = "block7.png";

  var x = Math.random() * url.length;
  x = Math.floor(x);

  game.addImg('background', pathGenerator('background.png'))
  game.addImg('hook', pathGenerator('hook.png'))
  game.addImg('blockRope', pathGenerator('rope-'+url[x]))
  game.addImg('block', pathGenerator(url[x]))
  game.addImg('block-perfect', pathGenerator('perfect-'+url[x]))
  for (let i = 1; i <= 8; i += 1) {
    game.addImg(`c${i}`, pathGenerator(`c${i}.png`))
  }
  game.addLayer(constant.flightLayer)
  for (let i = 1; i <= 7; i += 1) {
    game.addImg(`f${i}`, pathGenerator(`f${i}.png`))
  }
  game.swapLayer(0, 1)
  game.addImg('tutorial', pathGenerator('tutorial.png'))
  game.addImg('tutorial-arrow', pathGenerator('tutorial-arrow.png'))
  game.addImg('heart', pathGenerator('heart.png'))
  game.addImg('score', pathGenerator('score.png'))
  game.addAudio('drop-perfect', pathGenerator('drop-perfect.mp3'))
  game.addAudio('drop', pathGenerator('drop.mp3'))
  game.addAudio('game-over', pathGenerator('game-over.mp3'))
  game.addAudio('rotate', pathGenerator('rotate.mp3'))
  game.addAudio('bgm', pathGenerator('bgm.mp3'))
  game.setVariable(constant.blockWidth, game.width * 0.25)
  game.setVariable(constant.blockHeight, game.getVariable(constant.blockWidth) * 0.71)
  game.setVariable(constant.cloudSize, game.width * 0.3)
  game.setVariable(constant.ropeHeight, game.height * 0.4)
  game.setVariable(constant.blockCount, 0)
  game.setVariable(constant.successCount, 0)
  game.setVariable(constant.failedCount, 0)
  game.setVariable(constant.gameScore, 0)
  game.setVariable(constant.hardMode, false)
  game.setVariable(constant.gameUserOption, option)
  for (let i = 1; i <= 4; i += 1) {
    const cloud = new Instance({
      name: `cloud_${i}`,
      action: cloudAction,
      painter: cloudPainter
    })
    cloud.index = i
    cloud.count = 5 - i
    game.addInstance(cloud)
  }
  const line = new Instance({
    name: 'line',
    action: lineAction,
    painter: linePainter
  })
  game.addInstance(line)
  const hook = new Instance({
    name: 'hook',
    action: hookAction,
    painter: hookPainter
  })
  game.addInstance(hook)

  game.startAnimate = startAnimate
  game.endAnimate = endAnimate
  game.paintUnderInstance = background
  game.addKeyDownListener('enter', () => {
    if (game.debug) game.togglePaused()
  })
  game.touchStartListener = () => {
    touchEventHandler(game)
  }

  game.playBgm = () => {
    game.playAudio('bgm', true)
  }

  game.pauseBgm = () => {
    game.pauseAudio('bgm')
  }

  game.start = () => {
    const tutorial = new Instance({
      name: 'tutorial',
      action: tutorialAction,
      painter: tutorialPainter
    })
    game.addInstance(tutorial)
    const tutorialArrow = new Instance({
      name: 'tutorial-arrow',
      action: tutorialAction,
      painter: tutorialPainter
    })
    game.addInstance(tutorialArrow)
    game.setTimeMovement(constant.bgInitMovement, 500)
    game.setTimeMovement(constant.tutorialMovement, 500)
    game.setVariable(constant.gameStartNow, true)
  }

  return game
}

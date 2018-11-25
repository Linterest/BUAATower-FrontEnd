import * as constant from './constant'

export const checkMoveDown = engine =>
  (engine.checkTimeMovement(constant.moveDownMovement))

export const getMoveDownValue = (engine, store) => {
  const pixelsPerFrame = store ? store.pixelsPerFrame : engine.pixelsPerFrame.bind(engine)
  const successCount = engine.getVariable(constant.successCount)
  const calHeight = engine.getVariable(constant.blockHeight) * 2
  if (successCount <= 4) {
    return pixelsPerFrame(calHeight * 1.25)
  }
  return pixelsPerFrame(calHeight)
}

export const getAngleBase = (engine) => {
  const successCount = engine.getVariable(constant.successCount)
  const gameScore = engine.getVariable(constant.gameScore)
  const { hookAngle } = engine.getVariable(constant.gameUserOption)
  if (hookAngle) {
    return hookAngle(successCount, gameScore)
  }
  if (engine.getVariable(constant.hardMode)) {
    return 90
  }
  switch (true) {
    case successCount < 10:
      return 30
    case successCount < 20:
      return 60
    default:
      return 80
  }
}

export const getSwingBlockVelocity = (engine, time) => {
  const successCount = engine.getVariable(constant.successCount)
  const gameScore = engine.getVariable(constant.gameScore)
  const { hookSpeed } = engine.getVariable(constant.gameUserOption)
  if (hookSpeed) {
    return hookSpeed(successCount, gameScore)
  }
  let hard
  switch (true) {
    case successCount < 1:
      hard = 0
      break
    case successCount < 10:
      hard = 1
      break
    case successCount < 20:
      hard = 0.8
      break
    case successCount < 30:
      hard = 0.7
      break
    default:
      hard = 0.74
      break
  }
  if (engine.getVariable(constant.hardMode)) {
    hard = 1.1
  }
  return Math.sin(time / (200 / hard))
}

export const getLandBlockVelocity = (engine, time) => {
  const successCount = engine.getVariable(constant.successCount)
  const gameScore = engine.getVariable(constant.gameScore)
  const { landBlockSpeed } = engine.getVariable(constant.gameUserOption)
  if (landBlockSpeed) {
    return landBlockSpeed(successCount, gameScore)
  }
  const { width } = engine
  let hard
  switch (true) {
    case successCount < 5:
      hard = 0
      break
    case successCount < 13:
      hard = 0.001
      break
    case successCount < 23:
      hard = 0.002
      break
    default:
      hard = 0.003
      break
  }
  return Math.cos(time / 200) * hard * width
}

export const getHookStatus = (engine) => {
  if (engine.checkTimeMovement(constant.hookDownMovement)) {
    return constant.hookDown
  }
  if (engine.checkTimeMovement(constant.hookUpMovement)) {
    return constant.hookUp
  }
  return constant.hookNormal
}

export const touchEventHandler = (engine) => {
  if (!engine.getVariable(constant.gameStartNow)) return
  if (engine.debug && engine.paused) {
    return
  }
  if (getHookStatus(engine) !== constant.hookNormal) {
    return
  }
  engine.removeInstance('tutorial')
  engine.removeInstance('tutorial-arrow')
  const b = engine.getInstance(`block_${engine.getVariable(constant.blockCount)}`)
  if (b && b.status === constant.swing) {
    engine.setTimeMovement(constant.hookUpMovement, 500)
    b.status = constant.beforeDrop
  }
}

export const addSuccessCount = (engine) => {
  const { setGameSuccess } = engine.getVariable(constant.gameUserOption)
  const lastSuccessCount = engine.getVariable(constant.successCount)
  const success = lastSuccessCount + 1
  engine.setVariable(constant.successCount, success)
  if (engine.getVariable(constant.hardMode)) {
    engine.setVariable(constant.ropeHeight, engine.height * engine.utils.random(0.35, 0.55))
  }
  if (setGameSuccess) setGameSuccess(success)
}

export const addFailedCount = (engine) => {
  const { setGameFailed } = engine.getVariable(constant.gameUserOption)
  const lastFailedCount = engine.getVariable(constant.failedCount)
  const failed = lastFailedCount + 1
  engine.setVariable(constant.failedCount, failed)
  engine.setVariable(constant.perfectCount, 0)
  if (setGameFailed) setGameFailed(failed)
  if (failed >= 3) {
    //失败

    console.log("失败开始画图");
    engine.pauseAudio('bgm')
    engine.playAudio('game-over')
    engine.setVariable(constant.gameStartNow, false)

    //
    var bg = document.getElementById("bg");
    var qrc = document.getElementById("qrc");
    console.log("bg==>>>", bg);

    var eleImgX = document.getElementById("imgX");
    console.log("eleImgX==>>>", eleImgX);
    //选择背景
    // var bg1s = "./assets/main-picture-bg-1.png";
    // switch (true) {
    //   case score < 1960:
    //     bg1s = "./assets/main-picture-bg-1.png";
    //     break
    //   case score < 1968:
    //     bg1s = "./assets/main-picture-bg-2.png";
    //     break
    //   case score < 1976:
    //     bg1s = "./assets/main-picture-bg-3.png";
    //     break
    //   case score < 1984:
    //     bg1s = "./assets/main-picture-bg-4.png";
    //     break
    //   case score < 1992:
    //     bg1s = "./assets/main-picture-bg-5.png";
    //     break
    //   case score < 2000:
    //     bg1s = "./assets/main-picture-bg-6.png";
    //     break
    //   case score < 2008:
    //     bg1s = "./assets/main-picture-bg-7.png";
    //     break
    //   case score < 2016:
    //     bg1s = "./assets/main-picture-bg-8.png";
    //     break
    //   case score = 2018:
    //     bg1s = "./assets/main-picture-bg-red-last.png";
    //     break
    //   default:
    //     bg1s = "./assets/main-picture-bg-red-last.png";
    //     break
    // }
    var bg1s
    if (score<1960){
      var bg = document.getElementById("bg1");
    }else if(score<1968 && score>=1960){
      var bg = document.getElementById("bg2");
    }else if(score<1976 && score>=1968){
      var bg = document.getElementById("bg3");
    }else if(score<1984 && score>=1976){
      var bg = document.getElementById("bg4");
    }else if(score<1992 && score>=1984){
      var bg = document.getElementById("bg5");
    }else if(score<2000 && score>=1992){
      var bg = document.getElementById("bg6");
    }else if(score<2008 && score>=2000){
      var bg = document.getElementById("bg7");
    }else if(score<2018 && score>=2008){
      var bg = document.getElementById("bg8");
    }else{
      var bg = document.getElementById("bg9");
    }
    // eleImgX.innerHTML =
    //   '<img src="' +
    //   bg1s +
    //   '" id="bg">';
    console.log("eleImgX", eleImgX);
    console.log("bg==>>>", bg);
    var canvas = document.createElement("canvas");
    canvas.height = 1920;
    canvas.width = 1080;
    var context = canvas.getContext("2d");
    //绘制背景
    context.drawImage(bg, 0, 0, 1080, 1920);
    //绘制二维码
    context.drawImage(qrc, 885, 1641, 150, 150);
    //参与总人数
    context.font = "bold 50px wenxue";
    context.fillStyle = "#c4191f";
    //         //设置描边颜色
    //     context.strokeStyle = "#c4191f";
    //     //设置描边宽度
    //     context.lineWidth= 3;
    // context.strokeText(len, 882, 160);
    context.fillText(len, 882, 160);
    console.log("number===>>len");
    //if(len==undefined){
    //  len == 66 + random(1,800)
    //}

    //昵称数
    context.font = "bold 50px wenxue";
    context.fillStyle = "#797477";
    //     //设置描边颜色
    //     context.strokeStyle = "#797477";
    //     //设置描边宽度
    //     context.lineWidth= 3;
    // context.strokeText(nickname, 150, 560);
    context.fillText(nickname, 150, 560);
    console.log("nickname===>>nickname");

    //单人层数
    context.font = "270px bold";
    context.fillStyle = "#f5cc46";
    //设置描边颜色
    context.strokeStyle = "white";
    //设置描边宽度
    context.lineWidth= 30;
    if (successCount > 9) {
      context.strokeText(successCount, 370, 1030);
      context.fillText(successCount, 370, 1030);
    }
    else {
      context.strokeText(successCount, 460, 1030);
      context.fillText(successCount, 460, 1030);
    }
    console.log("successCount===>>66");

    //累计层数
    context.fillStyle = "white";
    context.font = "bold 50px wenxue";
    context.translate(770, 1105);
    context.rotate(-Math.PI / 10);
    //             //设置描边颜色
    //             context.strokeStyle = "white";
    //             //设置描边宽度
    //             context.lineWidth= 3;
    // context.strokeText(amount, 0, 0);
    context.fillText(amount, 0, 0);
    //if(amount==undefined){
    //  amount == 666 + random(1,8000)
    //}
    console.log("总层数=======>amount");

    var finalResult = canvas.toDataURL("image/png", 0.8);
    eleImgX.innerHTML =
    '<img src="' +
    finalResult +
    '"width="' +
    "70%" +
    '" height="' +
    "100%" +
    '"box-shadow="' +
    " 0 0 1px #000" +
    '">';
    console.log("eleImgX", eleImgX);

    //
  }
}

export const addScore = (engine, isPerfect) => {
  const { setGameScore, successScore, perfectScore } = engine.getVariable(constant.gameUserOption)
  const lastPerfectCount = engine.getVariable(constant.perfectCount, 0)
  const lastGameScore = engine.getVariable(constant.gameScore, 1950)
  const perfect = isPerfect ? lastPerfectCount + 1 : 0
  const score = ((parseInt(lastGameScore + 0.08 * ((successScore || 25) + ((perfectScore || 25) * perfect)))) >= 2018) ? ("2018") : (parseInt(lastGameScore + 0.08 * ((successScore || 25) + ((perfectScore || 25) * perfect))))
  engine.setVariable(constant.gameScore, score)
  engine.setVariable(constant.perfectCount, perfect)
  if (setGameScore) setGameScore(score)
}

export const drawYellowString = (engine, option) => {
  const {
    string, size, x, y, textAlign
  } = option
  const { ctx } = engine
  const fontName = 'wenxue'
  const fontSize = size
  const lineSize = fontSize * 0.1
  ctx.save()
  ctx.beginPath()
  const gradient = ctx.createLinearGradient(0, 0, 0, y)
  gradient.addColorStop(0, '#FAD961')
  gradient.addColorStop(1, '#F76B1C')
  ctx.fillStyle = gradient
  ctx.lineWidth = lineSize
  ctx.strokeStyle = '#FFF'
  ctx.textAlign = textAlign || 'center'
  ctx.font = `${fontSize}px ${fontName}`
  ctx.strokeText(string, x, y)
  ctx.fillText(string, x, y)
  ctx.restore()
}

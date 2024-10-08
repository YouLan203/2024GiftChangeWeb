let getEle = document.getElementsByClassName.bind(document);
let pointer = getEle('pointer')[0];
let result = getEle('result')[0];
let lights = Array.prototype.slice.call(getEle('light'));

let onRotation = false; // 记录当前是否正在旋转，如果正在旋转，就不能继续点击了
let reward = ['谢谢参与', '50积分', '谢谢参与', '100元话费', '50积分',
  '谢谢参与', '100元话费', '谢谢参与', '50积分', '10元话费'];

// 根据随机角度获取奖励
let getReward = (function () {
  currentDeg = 0;
  return function () {
    // 转三圈到四圈
    let rotateDeg = Math.random() * 360 + 1080;
    currentDeg += rotateDeg;
    let rewardText = reward[Math.floor((currentDeg + 18) % 360 / 36)]
    return {
      deg: currentDeg,
      text: rewardText === '谢谢参与' ? '很遗憾，您没有获得奖品。' : '恭喜获得: ' + rewardText
    }
  }
})();

pointer.addEventListener('click', () => {
  if (onRotation) return;
  console.log('开始抽奖');
  onRotation = true;
  lights.forEach(light => { light.className += ' light-twinkling'; });
  let nextStatus = getReward();
  console.log(nextStatus)
  result.innerText = nextStatus.text;
  result.style.display = 'none';
  pointer.style.transform = `rotateZ(${nextStatus.deg}deg)`;
})
pointer.addEventListener('transitionend', () => {
  console.log('抽奖结束');
  setTimeout(() => { // 等闪烁三下结束
    onRotation = false;
    lights.forEach(light => { light.className = 'light'; });
    result.style.display = 'block';
  }, 300);
})
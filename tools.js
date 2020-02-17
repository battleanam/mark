function drawDemo() {
  repaint();
}

/**
 * 初始化画布
 * @param width 画布宽度
 * @param height 画布高度
 */
function initMarker(width = 600, height = 400) {
  const {marker} = this;
  marker.setAttribute('width', width);
  marker.setAttribute('height', height);
  marker.style.width = width + 'px';
  marker.style.height = height + 'px';

}

function repaint() {
  requestAnimationFrame(() => {
    marks.forEach(mark => {
      drawRectWithMark(mark)
    });
  });
}

/**
 * 清空画布
 */
function clearMarker() {
  const {brush: {canvas: {width, height}}} = this;
  brush.clearRect(0, 0, width, height);
}

/**
 * 设置画笔样式
 * @param color 颜色 string | {fill, stroke} fill代表填充颜色 stroke线条颜色
 * @param width 粗细
 */
function setBrushStyle(color, width) {
  const {brush} = this;
  if (typeof color === 'object') {
    const {stroke, fill} = color;
    brush.strokeStyle = stroke;
    brush.fillStyle = fill;
  } else {
    brush.strokeStyle = color;
    brush.fillStyle = color;
  }
  if (typeof width === 'number') {
    brush.lineWidth = width;
  }
}

/**
 * 绘制矩形
 * @param x
 * @param y
 * @param w
 * @param h
 */
function drawRect(x, y, w, h) {
  brush.beginPath();
  brush.moveTo(x, y);
  brush.rect(x + 0.5, y + 0.5, w, h);
  brush.stroke();
}

/**
 * 根据标注对象
 * @param x
 * @param y
 * @param w
 * @param h
 * @param imgData
 */
function drawRectWithMark({x, y, imgData}) {
  brush.putImageData(imgData, x, y)
}

/**
 * 保存标注
 */
function saveMark(fn) {
  const id = '' + new Date().getTime(),
    imgData = brush.getImageData(x, y, w + 1, h + 1);
  const mark = {
    id, x, y, w, h, color: {
      stroke: brush.strokeStyle,
      fill: brush.fillStyle
    },
    width: brush.lineWidth,
    imgData,
  };
  marks.push(mark);
  fn && fn(mark)
}

/**
 * 将上次绘制的canvas作为图片保存到内存
 */
function storeImgData() {
  const {canvas: {width, height}} = brush;
  this.imgData = brush.getImageData(0, 0, width, height);
}

/**
 * 加载上次绘制的canvas
 */
function restoreImgData() {
  brush.putImageData(this.imgData, 0, 0);
}

/**
 * 某一点是否在矩形里
 * @param X 点横坐标
 * @param Y 点纵坐标
 * @param x 矩形起点横坐标
 * @param y 矩形起点纵坐标
 * @param w 矩形宽度
 * @param h 矩形高度
 * @returns {boolean}
 */
function isPointInRect(X, Y, {x, y, w, h}) {
  const x1 = x + w, y1 = y + h;
  return x <= X && X <= x1 && y <= Y && Y <= y1;
}

/**
 * 添加事件处理器
 * @param type 事件类型
 * @param fn 事件处理函数
 */
function addEventHandler(type, fn) {
  if (typeof fn === 'function') {
    const handlers = this.handlerDic[type];
    if (handlers) {
      handlers[fn.name] = fn;
    } else {
      this.handlerDic[type] = {[fn.name]: fn};
    }
  } else {
    console.error('添加事件处理器失败，不支持该数据类型：' + typeof fn);
  }
}

/**
 * 触发某个事件
 * @param type
 * @param args
 */
function fireEvent(type, ...args) {
  const handlers = this.handlerDic[type];
  if (handlers) {
    for (const key in handlers) {
      if (handlers.hasOwnProperty(key)) {
        handlers[key](...args);
      }
    }
  }
}

/**
 * 移除一个事件监听器
 * @param type 事件类型
 * @param name 处理函数的名称 匿名函数无法移除
 */
function removeEventHandler(type, name) {
  const handlers = this.handlerDic[type];
  if (handlers && handlers[name]) {
    delete handlers[name];
  }
}
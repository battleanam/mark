var drawing = false; // 拖拽绘图状态
var x = 0, w = 0, y = 0, h = 0; // 起点、终点坐标

var marker = document.getElementById('marker'); // 画布
var brush = marker.getContext('2d'); // 画笔
var marks = []; // 已保存的标注

initMarker(600, 400);

function onmousedown() {
  return (e) => {
    // 进入拖拽绘图状态
    fireEvent('beforeDrawRect');

    drawing = true;

    // 记录起点位置
    const {offsetX, offsetY} = e;
    x = offsetX;
    y = offsetY;

  };
}

function onmouseover() {
  return (e) => {
    console.log('mouseover', e)
  };
}

function onmousemove() {
  let currentMarkIndex = 0; // 当前鼠标移入的标注框
  let counts = [];

  return (e) => {

    const {offsetX, offsetY} = e;
    if (drawing) {
      this.mousemoved = true;
      requestAnimationFrame(() => {
        clearMarker();
        this.imgData && restoreImgData();
        w = offsetX - x;
        h = offsetY - y;
        drawRect(x, y, w, h);
      })
    } else {
      for (let i = marks.length - 1; i >= 0; i--) {
        const mark = marks[i];
        if (isPointInRect(offsetX, offsetY, mark)) {
          if (counts[i] === 1) {
            break;
          } else {
            if (counts[currentMarkIndex] === 1) {
              console.log('mouseout', currentMarkIndex);
              fireEvent('itemMouseout', marks[currentMarkIndex]);
              counts[currentMarkIndex] = 0;
            }
            currentMarkIndex = i;
            counts[i] = 1;
            fireEvent('itemMouseout', mark);
            console.log('mouseover', i);
            break;
          }
        } else if (counts[i] === 1) {
          counts[i] = 0;
          fireEvent('itemMouseout', mark);
          console.log('mouseout', i)
        }
      }
    }

  }
}

function onmouseup() {
  return (e) => {
    // 退出拖拽绘图状态
    drawing = false;
    if (this.mousemoved) {
      requestAnimationFrame(() => {
        saveMark(mark => {
          fireEvent('markSaved', mark);
        });
        storeImgData();
      });
      this.mousemoved = false;
    }
    console.log('mouseup', e)
  }
}

marker.addEventListener('mousedown', onmousedown());

marker.addEventListener('mouseover', onmouseover());

marker.addEventListener('mousemove', onmousemove());

marker.addEventListener('mouseup', onmouseup());
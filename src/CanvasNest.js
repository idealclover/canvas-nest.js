/**
 * Created by hustcc on 18/6/23.
 * Contract: i@hust.cc
 */

// import { bind, clear } from 'size-sensor';
import { requestAnimationFrame, cancelAnimationFrame, range, canvasStyle } from './utils';

export default class CanvasNest {

  static version = __VERSION__;

  constructor(el, config) {
    this.el = el;
    console.log(config);
    this.c = {
      zIndex: -1,           // z-index
      opacity: 0.5,         // opacity
      color: '0,0,0',       // color of lines
      pointColor: '0,0,0',  // color of points
      count: 99,            // count
      ...config,
    };

    this.canvas = this.newCanvas();
    this.context = this.canvas.getContext('2d');

    this.points = this.randomPoints();
    this.current = {
      x: null, // 当前鼠标x
      y: null, // 当前鼠标y
      max: 20000 // 圈半径的平方
    };
    this.all = this.points.concat([this.current]);

    this.bindEvent();

    this.requestFrame(this.drawCanvas);
  }

  bindEvent() {
    // bind(this.el, () => {
    //   this.canvas.width = this.el.clientWidth;
    //   this.canvas.height = this.el.clientHeight;
    //   // this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //   // this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // });
    this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.onmousemove = window.onmousemove;
    window.onmousemove = e => {
      // this.current.x = e.clientX - this.el.offsetLeft + document.scrollingElement.scrollLeft; // 当存在横向滚动条时，x坐标再往右移动滚动条拉动的距离
      // this.current.y = e.clientY - this.el.offsetTop + document.scrollingElement.scrollTop; // 当存在纵向滚动条时，y坐标再往下移动滚动条拉动的距离
      this.current.x = e.clientX; // 当存在横向滚动条时，x坐标再往右移动滚动条拉动的距离
      this.current.y = e.clientY; // 当存在纵向滚动条时，y坐标再往下移动滚动条拉动的距离

      this.onmousemove && this.onmousemove(e);
    };

    // this.onmouseout = window.onmouseout;
    // window.onmouseout = () => {
    //   this.current.x = null;
    //   this.current.y = null;
    //   this.onmouseout && this.onmouseout();
    // };
  }

  randomPoints = () => {
    return range(Math.ceil(this.c.count * this.canvas.width * this.canvas.height / 400000)).map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      xa: 2 * Math.random() - 1, // 随机运动返现
      ya: 2 * Math.random() - 1,
      xd: 0,
      yd: 0,
      max: 6000 // 沾附距离
    }));
  };

  newCanvas() {
    // if (getComputedStyle(this.el).position === 'static') {
    //   this.el.style.position = 'relative'
    // }
    const canvas = document.createElement('canvas'); // 画布
      console.log(this.c);
    canvas.style.cssText = canvasStyle(this.c);

    // canvas.width = this.el.clientWidth;
    // canvas.height = this.el.clientHeight;
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.el.appendChild(canvas);
    return canvas;
  }

  requestFrame(func) {
    this.tid = requestAnimationFrame(() => func.call(this));
  }

  drawCanvas() {
    const context = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const current = this.current;
    const points = this.points;
    const all = this.all;

    context.clearRect(0, 0, width, height);
    // 随机的线条和当前位置联合数组
    let e, i, d, x_dist, y_dist, dist, prex, prey; // 临时节点
    // 遍历处理每一个点
    points.forEach((r, idx) => {
        context.fillStyle = `rgba(${this.c.pointColor})`;

      // 从下一个点开始
      for (i = idx + 1; i < all.length; i ++) {
        e = all[i];
        // 当前点存在
        if (null !== e.x && null !== e.y) {
          x_dist = r.x - e.x; // x轴距离 l
          y_dist = r.y - e.y; // y轴距离 n
          prex = r.x + r.xa - e.x;  // 预算下一个x,y的位置，以判断是加速还是减速
          prey = r.y + r.ya - e.y;
          dist = x_dist * x_dist + y_dist * y_dist; // 总距离, m

          if (e === current) {
            if (dist < e.max) { // 加速度大小
                r.xd = (Math.abs(prex) > Math.abs(x_dist) && Math.abs(prex) * Math.abs(x_dist) > 0 ? -1 : 1) * dist / e.max * 2 * r.xa;
                r.yd = (Math.abs(prey) > Math.abs(y_dist) && Math.abs(prey) * Math.abs(y_dist) > 0 ? -1 : 1) * dist / e.max * 2 * r.ya;
            } else {
              r.xd = 0;
              r.yd = 0;
            }
          }
          dist < e.max && (
            d = (e.max - dist) / e.max,
            context.beginPath(),
            context.lineWidth = d / 2,
            context.strokeStyle = `rgba(${this.c.color},${d + 0.2})`,
            context.moveTo(r.x, r.y),
            context.lineTo(e.x, e.y),
            context.stroke());
        }
      }
      r.x += r.xa + r.xd;
      r.y += r.ya + r.yd; // 移动
      r.xa *= r.x > width || r.x < 0 ? -1 : 1;
      r.ya *= r.y > height || r.y < 0 ? -1 : 1; // 碰到边界，反向反弹
      context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1); // 绘制一个宽高为1的点
    });
    this.requestFrame(this.drawCanvas);
  }

  destroy() {
    // 清除事件
    // clear(this.el);

    // mouse 事件清除
    window.onmousemove = this.onmousemove; // 回滚方法
    window.onmouseout = this.onmouseout;

    // 删除轮询
    cancelAnimationFrame(this.tid);

    // 删除 dom
    this.canvas.parentNode.removeChild(this.canvas);
  }
}

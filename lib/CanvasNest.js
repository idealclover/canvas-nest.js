'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by hustcc on 18/6/23.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Contract: i@hust.cc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// import { bind, clear } from 'size-sensor';


var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasNest = function () {
  function CanvasNest(el, config) {
    var _this = this;

    _classCallCheck(this, CanvasNest);

    this.randomPoints = function () {
      return (0, _utils.range)(Math.ceil(_this.c.count * _this.canvas.width * _this.canvas.height / 400000)).map(function () {
        return {
          x: Math.random() * _this.canvas.width,
          y: Math.random() * _this.canvas.height,
          xa: 2 * Math.random() - 1, // 随机运动返现
          ya: 2 * Math.random() - 1,
          xd: 0,
          yd: 0,
          max: 6000 // 沾附距离
        };
      });
    };

    this.el = el;
    console.log(config);
    this.c = _extends({
      zIndex: -1, // z-index
      opacity: 0.5, // opacity
      color: '0,0,0', // color of lines
      pointColor: '0,0,0', // color of points
      count: 99 }, config);

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

  _createClass(CanvasNest, [{
    key: 'bindEvent',
    value: function bindEvent() {
      var _this2 = this;

      // bind(this.el, () => {
      //   this.canvas.width = this.el.clientWidth;
      //   this.canvas.height = this.el.clientHeight;
      //   // this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      //   // this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // });
      this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      this.onmousemove = window.onmousemove;
      window.onmousemove = function (e) {
        // this.current.x = e.clientX - this.el.offsetLeft + document.scrollingElement.scrollLeft; // 当存在横向滚动条时，x坐标再往右移动滚动条拉动的距离
        // this.current.y = e.clientY - this.el.offsetTop + document.scrollingElement.scrollTop; // 当存在纵向滚动条时，y坐标再往下移动滚动条拉动的距离
        _this2.current.x = e.clientX; // 当存在横向滚动条时，x坐标再往右移动滚动条拉动的距离
        _this2.current.y = e.clientY; // 当存在纵向滚动条时，y坐标再往下移动滚动条拉动的距离

        _this2.onmousemove && _this2.onmousemove(e);
      };

      // this.onmouseout = window.onmouseout;
      // window.onmouseout = () => {
      //   this.current.x = null;
      //   this.current.y = null;
      //   this.onmouseout && this.onmouseout();
      // };
    }
  }, {
    key: 'newCanvas',
    value: function newCanvas() {
      // if (getComputedStyle(this.el).position === 'static') {
      //   this.el.style.position = 'relative'
      // }
      var canvas = document.createElement('canvas'); // 画布
      console.log(this.c);
      canvas.style.cssText = (0, _utils.canvasStyle)(this.c);

      // canvas.width = this.el.clientWidth;
      // canvas.height = this.el.clientHeight;
      canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      this.el.appendChild(canvas);
      return canvas;
    }
  }, {
    key: 'requestFrame',
    value: function requestFrame(func) {
      var _this3 = this;

      this.tid = (0, _utils.requestAnimationFrame)(function () {
        return func.call(_this3);
      });
    }
  }, {
    key: 'drawCanvas',
    value: function drawCanvas() {
      var _this4 = this;

      var context = this.context;
      var width = this.canvas.width;
      var height = this.canvas.height;
      var current = this.current;
      var points = this.points;
      var all = this.all;

      context.clearRect(0, 0, width, height);
      // 随机的线条和当前位置联合数组
      var e = void 0,
          i = void 0,
          d = void 0,
          x_dist = void 0,
          y_dist = void 0,
          dist = void 0,
          prex = void 0,
          prey = void 0; // 临时节点
      // 遍历处理每一个点
      points.forEach(function (r, idx) {
        context.fillStyle = 'rgba(' + _this4.c.pointColor + ')';

        // 从下一个点开始
        for (i = idx + 1; i < all.length; i++) {
          e = all[i];
          // 当前点存在
          if (null !== e.x && null !== e.y) {
            x_dist = r.x - e.x; // x轴距离 l
            y_dist = r.y - e.y; // y轴距离 n
            prex = r.x + r.xa - e.x; // 预算下一个x,y的位置，以判断是加速还是减速
            prey = r.y + r.ya - e.y;
            dist = x_dist * x_dist + y_dist * y_dist; // 总距离, m

            if (e === current) {
              if (dist < e.max) {
                // 加速度大小
                r.xd = (Math.abs(prex) > Math.abs(x_dist) && Math.abs(prex) * Math.abs(x_dist) > 0 ? -1 : 1) * dist / e.max * 2 * r.xa;
                r.yd = (Math.abs(prey) > Math.abs(y_dist) && Math.abs(prey) * Math.abs(y_dist) > 0 ? -1 : 1) * dist / e.max * 2 * r.ya;
              } else {
                r.xd = 0;
                r.yd = 0;
              }
            }
            dist < e.max && (d = (e.max - dist) / e.max, context.beginPath(), context.lineWidth = d / 2, context.strokeStyle = 'rgba(' + _this4.c.color + ',' + (d + 0.2) + ')', context.moveTo(r.x, r.y), context.lineTo(e.x, e.y), context.stroke());
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
  }, {
    key: 'destroy',
    value: function destroy() {
      // 清除事件
      // clear(this.el);

      // mouse 事件清除
      window.onmousemove = this.onmousemove; // 回滚方法
      window.onmouseout = this.onmouseout;

      // 删除轮询
      (0, _utils.cancelAnimationFrame)(this.tid);

      // 删除 dom
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }]);

  return CanvasNest;
}();

CanvasNest.version = '2.0.4';
exports.default = CanvasNest;
module.exports = exports['default'];
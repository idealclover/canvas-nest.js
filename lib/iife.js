'use strict';

var _CanvasNest = require('./CanvasNest');

var _CanvasNest2 = _interopRequireDefault(_CanvasNest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getScriptConfig = function getScriptConfig() {
  var scripts = document.getElementsByTagName('script');
  var len = scripts.length;
  var script = scripts[len - 1]; // 当前加载的script
  return {
    zIndex: script.getAttribute('zIndex') || -1,
    opacity: script.getAttribute('opacity') || 0.5,
    color: script.getAttribute('color') || '0,0,0',
    pointColor: script.getAttribute('pointColor') || '0,0,0',
    count: Number(script.getAttribute('count')) || 99
  };
}; /**
    * Created by hustcc on 18/6/23.
    * Contract: i@hust.cc
    */

new _CanvasNest2.default(document.body, getScriptConfig());
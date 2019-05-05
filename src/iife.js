/**
 * Created by hustcc on 18/6/23.
 * Contract: i@hust.cc
 */

import CanvasNest from './CanvasNest';

const getScriptConfig = () => {
  const scripts = document.getElementsByTagName('script');
  const len = scripts.length;
  const script = scripts[len - 1]; // 当前加载的script
  return {
    zIndex: script.getAttribute('zIndex') || -1,
    opacity: script.getAttribute('opacity') || 0.5,
    color: script.getAttribute('color') || '0,0,0',
    pointColor: script.getAttribute('pointColor') || '0,0,0',
    count: Number(script.getAttribute('count')) || 99,
  };
};

new CanvasNest(document.body, getScriptConfig());

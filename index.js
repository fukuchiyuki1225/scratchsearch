'use strict';

const canvas = $('#canvas');
const canvasDom = canvas[0];
const ctx = canvasDom.getContext('2d');

canvasDom.width = 482;
canvasDom.height = 362;

let drawingFlag = false;

canvas.mousemove(function () {
  if (!drawingFlag) return;
  console.log('drawing');
});

canvas.mousedown(function () {
  drawingFlag = true;
  console.log('mousedown');
});

canvas.mouseup(function () {
  drawingFlag = false;
  console.log('mouseup');
});

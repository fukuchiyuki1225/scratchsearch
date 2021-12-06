'use strict';

const canvas = $('#canvas');
const canvasDom = canvas[0];
const ctx = canvasDom.getContext('2d');
let drawingFlag = false;

canvasDom.width = 482;
canvasDom.height = 362;

ctx.lineCap = 'round';
ctx.strokeDtyle = 'lightskyblue';
ctx.lineWidth = '20px';

canvas.mousemove(function () {
  console.log('drawing');
  if (!drawingFlag) return;
});

canvas.mousedown(function () {
  console.log('mousedown');
  drawingFlag = true;
});

canvas.mouseup(function () {
  console.log('mouseup');
  drawingFlag = false;
});

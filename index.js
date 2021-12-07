'use strict';

const canvas = $('#canvas');
const canvasDom = canvas[0];
const ctx = canvasDom.getContext('2d');
let drawingFlag = false;
let startX = 0;
let startY = 0;
const offsetX = canvasDom.getBoundingClientRect().left;
const offsetY = canvasDom.getBoundingClientRect().top;

canvasDom.width = 482;
canvasDom.height = 362;

ctx.lineCap = 'round';
ctx.strokeStyle = 'lightskyblue';
ctx.lineWidth = 20;

canvas.mousemove(function (e) {
  console.log('drawing');
  if (!drawingFlag) return;
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();
  startX = x;
  startY = y;
});

canvas.mousedown(function (e) {
  console.log('mousedown');
  ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);
  drawingFlag = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

canvas.mouseup(function () {
  console.log('mouseup');
  drawingFlag = false;
});

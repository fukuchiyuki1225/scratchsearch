'use strict';

const canvas = $('#canvas');
const canvasDom = canvas[0];
const ctx = canvasDom.getContext('2d');
const offsetX = canvasDom.getBoundingClientRect().left;
const offsetY = canvasDom.getBoundingClientRect().top;
let drawFlag = false;
let startX = 0;
let startY = 0;
let x = 0;
let y = 0;
let recordFlag = false;
let recordTimer;

canvasDom.width = 482;
canvasDom.height = 362;
ctx.lineCap = 'round';
ctx.strokeStyle = 'lightskyblue';
ctx.lineWidth = 20;

canvas.mousemove(function (e) {
  if (!drawFlag) return;
  x = e.clientX - offsetX;
  y = e.clientY - offsetY;
  drawPath(x, y);
  if (!recordFlag) {
    recordTimer = setInterval(recordCoordinate, 200);
    recordFlag = true;
  }
});

canvas.mousedown(function (e) {
  ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);
  drawFlag = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

canvas.mouseup(function () {
  drawFlag = false;
  recordFlag = false;
  clearInterval(recordTimer);
  console.log(inputX);
});

function drawPath(endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
  startX = endX;
  startY = endY;
}

let inputX = [];
let inputY = [];

let recordCoordinate = function () {
  console.log('record');
  inputX.push(x);
  inputY.push(y);
};

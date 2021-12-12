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
let inputX = [];
let inputY = [];
const resultEl = $('#result');

canvasDom.width = 482;
canvasDom.height = 362;
ctx.lineCap = 'round';
ctx.strokeStyle = 'lightskyblue';
ctx.lineWidth = 20;

const url = 'http://192.168.3.15:5000';

$('#search').click(function () {
  postFunc(url + '/post', url + '/get');
});

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
  inputX = [];
  inputY = [];
});

canvas.mouseup(function () {
  drawFlag = false;
  recordFlag = false;
  clearInterval(recordTimer);
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

let recordCoordinate = function () {
  inputX.push(Math.round(x));
  inputY.push(Math.round(y));
};

function postFunc(postUrl, getUrl) {
  if (!inputX.length | !inputY.length) return;
  let postData = inputX.concat(inputY);
  let formData = new FormData();
  formData.append('data', JSON.stringify(postData));
  fetch(postUrl, {
    method: 'POST',
    body: formData,
  }).then(function () {
    resultEl.html(`<h3>検索中...</h3>`);
    getFunc(getUrl);
  });
}

function getFunc(getUrl) {
  fetch(getUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      resultEl.html(json);
      console.log(json);
    });
}

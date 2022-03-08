'use strict';

const canvas = $('#canvas');
const canvasDom = canvas[0];
const ctx = canvasDom.getContext('2d');
let drawFlag = false;
let startX = 0;
let startY = 0;
let x = 0;
let y = 0;
let recordFlag = false;
let recordTimer;
let inputX = [];
let inputY = [];
const searching = $('#searching');
const resultEl = $('#result');
const beforesearch = $('#beforesearch');

canvasDom.width = 482;
canvasDom.height = 362;
ctx.lineCap = 'round';
ctx.strokeStyle = '#33373f';
ctx.lineWidth = 20;

const url = 'http://0.0.0.0:49513';

$('#search').click(function () {
  postFunc(url + '/post', url + '/get');
});

canvas.mousemove(function (e) {
  if (!drawFlag) return;
  let rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  drawPath(x, y);
  if (!recordFlag) {
    recordTimer = setInterval(recordCoordinate, 200);
    recordFlag = true;
  }
});

canvas.mousedown(function (e) {
  ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);
  drawFlag = true;
  let rect = e.target.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
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
    resetResult();
    beforesearch.addClass('hidden');
    searching.removeClass('hidden');
    getFunc(getUrl);
  });
}

function getFunc(getUrl) {
  fetch(getUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      searching.addClass('hidden');

      // for (let i = 0; i < json.length; i++) {
      for (let i = 0; i < 5; i++) {
        addResult(
          json[i]['moveNum'],
          `https://scratch.mit.edu/projects/${json[i]['prjId']}/`,
          json[i]['sprite'],
          json[i]['dtw']
        );
      }
    });
}

const resetResult = () => {
  result.innerHTML = '';
};

const addResult = (actionID, url, sprite, dtw) => {
  const element = `<div class="result"><iframe class="frame" src="${url}embed" allowtransparency="true" width="320" height="200" frameborder="0" scrolling="no" allowfullscreen></iframe><span>動作番号：${actionID}</span><span>URL：<a href=${url} target="_blank" rel="noopener noreferrer">${url}</a></span><span>スプライト：${sprite}</span><span>DTW距離：${dtw}</span></div>`;
  result.insertAdjacentHTML('beforeend', element);
};

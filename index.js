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
const statusEl = $('#status');
const resultEl = $('#result');

canvasDom.width = 482;
canvasDom.height = 362;
ctx.lineCap = 'round';
ctx.strokeStyle = 'lightskyblue';
ctx.lineWidth = 20;

const url = 'http://0.0.0.0:5000';

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
    statusEl.html(`<h3>検索中...</h3>`);
    resultEl.empty();
    getFunc(getUrl);
  });
}

function getFunc(getUrl) {
  fetch(getUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      statusEl.html(`<h3>検索結果</h3>`);
      let a = ``;
      for (let i = 0; i < json.length; i++) {
        a += `<div>
        <hr>
        <b>　${i + 1}</b>
        <p>　動作番号:
          <a href="file:///Users/yuki-f/scratchsearch/splitted/${
            json[i]['moveNum']
          }.csv">${json[i]['moveNum']}
          </a>
        </p>
        <p>　URL:  
          <a href="https://scratch.mit.edu/projects/${
            json[i]['prjId']
          }/" target="_blank" rel="noopener noreferrer">
              https://scratch.mit.edu/projects/${json[i]['prjId']}/
          </a>
        </p> 
        <p>　スプライト: ${json[i]['sprite']}</p>
        <p>　DTW距離: ${json[i]['dtw']}</p> 
        </div>`;
      }
      resultEl.html(a);
    });
}

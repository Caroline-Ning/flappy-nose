let faceapi;
let detections = [];

let video;
let canvas;
let nx, ny; //nose_x,nose_y

let nose;
let pipes = [];
let d = 30; //width of nose
let r = d / 2;
let flipX;//fix the flipped pipe


let score;

const S_PRE = 0;
const S_PLAY = 1;
const S_BOARD = 2;
const N_MAXTIME = 5; //countdown time
let hit = false;
let show = false; //show pipe


let curStage = -1
const interval = 65 //framecount/interval create new Pipe

function setup() {

  canvas = createCanvas(640, 480);
  canvas.parent('canvas');
  video = createCapture(VIDEO);// Creat the video
  video.size(width, height);
  video.hide();
  const faceOptions = {
    withLandmarks: true,
    minConfidence: 0.5
  };
  //Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
  pipes.push(new Pipe());
  enterStage(S_PLAY)
}

function draw() {
  clear()
  push();
  translate(video.width, 0);
  scale(-1, 1);
  tint(255, 100)
  image(video, 0, 0);
  noFill()
  stroke(255, 241, 230)
  strokeWeight(2)
  ellipse(nx, ny, d)
  pop();
  flipX = width - nx;
  gamePlay();
}

function enterStage(stage) {
  switch (stage) {
    // case S_PRE: //prepare
    //   break;
    case S_PLAY:
      break;
    case S_BOARD:
      // show = false;
      break;
  }
  startTime = Math.floor(Date.now()); //prepare countdown start
  curStage = stage;
}


function gamePlay() {
  switch (curStage) {
    // case S_PRE:
    //   pre(); //prepare-countdown
    case S_PLAY:
      play();
      break;
    case S_BOARD:
      board();
      break;
  }
}

function pre() {
  var eclapse;
  //time from prepare start to now, to do countdown
  eclapse = (Math.floor(Date.now()) - startTime) / 1000;  //sec
  console.log('eclapse' + eclapse)

  //show countdown num, maxtime: first countdown number
  if (eclapse <= N_MAXTIME) {
    textSize(40)
    textAlign(CENTER)
    fill(250, 210, 225) //pink
    text(Math.floor(N_MAXTIME - eclapse), 37, 50);
  } 
  else { //if countdown finish, go to play stage
    // show = true
    enterStage(S_PLAY);
  }
}



function play() {
  // if (show) {
    score = Math.floor(frameCount / interval)
    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].show();
      pipes[i].update();

      if (pipes[i].hits(nose)) {
        hit = true
        enterStage(S_BOARD);
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    if (frameCount % interval == 0) {
      pipes.push(new Pipe());
    }

    noStroke()
    fill(255)
    rect(width - 105, 10, 100, 30, 15)
    fill(254, 200, 154)
    textSize(16)
    text("🏆score: " + score, width - 92, 30)
  // }
}

function board() {
  rectMode(CENTER)
  noStroke()
  fill(255)
  rect(video.width / 2, 163, 125, 40, 15)
  textSize(20)
  textAlign(CENTER)
  fill(254, 200, 154)
  text('🏆score:  ' + score, video.width / 2, 170);
}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces
}

// Got faces
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  detections = result;　//Now all the data in this detections
  clear();//Draw transparent background;
  drawLandmarks(detections);//// Draw all the face points
  faceapi.detect(gotFaces);// Call the function again at here
}

function drawLandmarks(detections) {
  if (detections.length > 0) {//If at least 1 face is detected
    for (f = 0; f < detections.length; f++) {
      let points = detections[f].landmarks.positions;
      noStroke()
      //draw nose
      nx = points[30]._x;
      ny = points[30]._y
    }
  }
}

function Nose() {
  this.x = nx;
  this.y = ny;
}



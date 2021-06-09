var canvas = document.getElementById("myCanvas");
canvas.addEventListener('keydown', doKeyDown, true);
ctx = canvas.getContext("2d");

var left1 = document.getElementById("left1");
var left2 = document.getElementById("left2");
var right1 = document.getElementById("right1");
var right2 = document.getElementById("right2");
var d = 1; // 1 == left; 2 == right
var eat = false;

// var beach = document.getElementById("beach");
// ctx.drawImage(beach, 0 , 0);

var x = 200;
var y = 100;
var w = 115;
var h = 115;
ctx.drawImage(left1, x, y);

var x1 = -20;
var y1 = 50;
var x2 = -20;
var y2 = 150;
var x3 = -20;
var y3 = 250;


var box1=[x1, y1, 40, 40];
var box2=[x2, y2, 40, 40];
var box3=[x3, y3, 40, 40];
var sc=0;

var boxs = [];
boxs.push(box1);
boxs.push(box2);
boxs.push(box3);


function doKeyDown(e){
    switch(event.keyCode) {
        case 37: { // Left Arrow
            updateCanvas();
            if (x >= 10) {
                x -= 10;
            }
            d = 37;
            drawPlayer(x, y,1);
            break;
        }
        case 38: { // Up Arrow
            updateCanvas();
            if (y >= 10) {
                y -= 10;
            }
            if (d === 37) {
                drawPlayer(x, y, 1);
            }else {
                drawPlayer(x, y, 2);
            }
            break;
        }
        case 39: { // Right Arrow
            updateCanvas();
            if (x <= canvas.width - w - 10) {
                x += 10;
            }
            d = 39;
            drawPlayer(x, y, 2);
            break;
        }
        case 40: { // Down Arrow
            updateCanvas();
            if (y <= canvas.height - h - 10) {
                y += 10;
            }
            if (d === 37) {
                drawPlayer(x, y, 1);
            }else {
                drawPlayer(x, y, 2);
            }
            break;
        }
        case 32: { // Space
            updateCanvas();
            if (d === 37) {
                drawPlayer(x, y, 3);
            }else {
                drawPlayer(x, y, 4);
            }
            break;
        }
    }
    check(x, y, w, h);

}
function drawPlayer(x, y, getD) {
    switch(getD) {
        case 1: {
            ctx.drawImage(left1, x, y);
            break;
        }
        case 2: {
            ctx.drawImage(right1, x, y);
            break;
        }
        case 3: {
            ctx.drawImage(left2, x, y);
            eat = true;
            break;
        }
        case 4: {
            ctx.drawImage(right2, x, y);
            eat = true;
            break;
        }
    }
    return eat;
}

function check(x, y, w, h) {
    for (i = 0; i < boxs.length; i++) {
        var x1=boxs[i][0];
        var y1=boxs[i][1];
        var w1=boxs[i][2];
        var h1=boxs[i][3];
        if (intersects(x, y, w, h, x1, y1, w1, h1))
        {
            // alert (" x=" +x1 +" y=" +y1 +" w=" +w1 +" h=" + h1);
            if (drawPlayer()) {
                playSound('sound/laugh.mp3');
                sc+=1;
                boxs.splice(i, 1);
                eat = false;
            } else { playSound('sound/sad.mp3'); }
        }
    }
}

function intersects(xp, yp, wp, hp, xo, yo, wo, ho) {
    wo += xo;
    wp += xp;
    if (xo > wp || xp > wo) return false;
    ho += yo;
    hp += yp;
    if (yo > hp || yp > ho) return false;
    return true; // returns true if there is any overlap
}

function updateCanvas() {
    ctx.clearRect(0,0, canvas.width,canvas.height); //Clear Canvas

    //Check if we should generate a new object
    if (Math.random() < 0.03) {
        xu = -20;
        yu = Math.floor(Math.random() * canvas.height);
        boxs.push([xu, yu, 40, 40]);
    }

    //Update the position of objects
    for (var i = boxs.length - 1; i >= 0; i--) {
        if (boxs[i][0] < canvas.width / 4) { // stage 1
            boxs[i][0] = boxs[i][0] + (Math.random() * 8 + 2); // moving in different speeds
            ctx.beginPath();
            ctx.arc(boxs[i][0], boxs[i][1], 20, Math.PI * 2, 0, true);
            ctx.closePath();
            ctx.fillStyle = "rgba(255,60,20,0.60)";
            ctx.fill();
        }
        else if (boxs[i][0] < canvas.width / 2) { // stage 2
            boxs[i][0] = boxs[i][0] + (Math.random() * 4);
            ctx.beginPath();
            ctx.arc(boxs[i][0], boxs[i][1], 30, Math.PI * 2, 0, true);
            ctx.closePath();
            ctx.fillStyle = "rgba(255,60,20,1)";
            ctx.fill();
        }
        else if (boxs[i][0] < canvas.width * 3 / 4) { // stage 3
            boxs[i][0] = boxs[i][0] + (Math.random() * 3 + 1);
            ctx.beginPath();
            ctx.arc(boxs[i][0], boxs[i][1], 20, Math.PI * 2, 0, true);
            ctx.closePath();
            ctx.fillStyle = "rgba(255,60,20,1)";
            ctx.fill();
        }
        else { // stage 4
            boxs.splice(i, 1);
        }
    }
    writeScore(sc); // update score
}

function playSound(soundfile)
{
    document.getElementById("dummy").innerHTML=
        "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
}

function writeScore(sc) {
    // Transparent black text
    ctx.font = '25px "MS UI Gothic"';
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillText("SCORE: " +sc, 0, 30);
}
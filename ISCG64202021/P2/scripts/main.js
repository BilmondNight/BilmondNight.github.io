$(document).ready(function () {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var dino = new Image();
    dino.src = "image/dino.png"; // sprite sheet

    var title = new Audio('sound/title.mp3');
    var bgm = new Audio('sound/bgm.mp3');
    var finish = new Audio('sound/finish.mp3');
    var laugh = new Audio('sound/laugh.mp3');
    var sad = new Audio('sound/sad.mp3');

    var sheet = { // sprite sheet
        width: 372,
        height: 480
    };

    var player = { // init player
        x: canvas.width / 2, // position in canvas
        y: canvas.height / 2,
        sx: 0, // position in sprite sheet
        sy: 0,
        width: sheet.width / 4 - 3,
        height: sheet.height / 4
    };

    var frame = 0; // sx of sprite sheet
    var direction = 0; // sy of sprite sheet
    var keys = [];
    var eat = false;

    canvas.addEventListener("keydown", function(event) {
        if (event.preventDefaulted) {
            return; // Do nothing if event already handled
        }

        switch(event.code) {
            case "KeyS": case "ArrowDown":
                if (player.y <= canvas.height - player.height - 10) { // check wall
                    player.y += 10;
                    direction = 0; // 0 = face down
                }
                break;

            case "KeyA": case "ArrowLeft":
                if (player.x >= 10) {
                    player.x -= 10;
                    direction = 1; // 1 = face left
                }
                break;

            case "KeyD": case "ArrowRight":
                if (player.x <= canvas.width - player.width - 10) {
                    player.x += 10;
                    direction = 2; // 2 = face right
                }
                break;

            case "KeyW": case "ArrowUp":
                if (player.y >= 10) {
                    player.y -= 10;
                    direction = 3; // 3 = face up
                }
                break;

            case "Space":
                eat = true;
                break;
        }

        event.preventDefault(); // Consume the event so it doesn't get handled twice
    }, true);

    canvas.addEventListener("keyup", function(event) {
        if (event.code === "Space") {
            eat = false;
        }
    }, true);

//
// var x1 = -20;
// var y1 = 50;
// var x2 = -20;
// var y2 = 150;
// var x3 = -20;
// var y3 = 250;
//
//
// var box1=[x1, y1, 40, 40];
// var box2=[x2, y2, 40, 40];
// var box3=[x3, y3, 40, 40];
// var sc=0;
//
// var boxs = [];
// boxs.push(box1);
// boxs.push(box2);
// boxs.push(box3);
//
    var worm = { // init worm
        x: getRandomInRange(canvas.width - 10),
        y: getRandomInRange(canvas.height -10),
        vx: getRandomInRange(5),
        vy: getRandomInRange(5),
        r: 5,
        lc: 0
    };

    // start the first frame request
    window.requestAnimationFrame(gameLoop);

    function gameLoop() {
        update();
        draw();
        window.requestAnimationFrame(gameLoop);
    }

    function update() {
        // player
        frame = ++ frame % 4;
        player.sx = frame * (player.width + 3);
        player.sy = direction * player.height;

        // worms
        switch (worm.lc) {
            case 0:
                worm.x += worm.vx;
                worm.y += worm.vy;
                worm.lc = 1;
                break;

            case 1:
                worm.x += worm.vx;
                worm.y += worm.vy;
                worm.r += 1;
                if (worm.r > 25) {
                    worm.lc = 2
                }
                break;

            case 2:
                worm.x += worm.vx;
                worm.y += worm.vy;
                worm.r -= 1;
                if (worm.r < 2) {
                    worm.lc = 3
                }
                break;

            case 3:
                worm.x = getRandomInRange(canvas.width - 10);
                worm.y = getRandomInRange(canvas.height - 10);
                worm.lc = 0;
                break;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(dino, player.sx, player.sy, player.width, player.height, player.x, player.y, player.width, player.height);

        var gradient = ctx.createRadialGradient(worm.x, worm.y, worm.r, Math.PI, 0, 300);
        gradient.addColorStop(0, 'rgb(255,100,0)');
        gradient.addColorStop(0.5, 'rgb(255,255,0)');
        gradient.addColorStop(1, 'rgb(255,255,255)');
        ctx.beginPath();
        ctx.arc(worm.x, worm.y, worm.r, Math.PI, 0, false);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.closePath();
        ctx.stroke();
    }


// function check(x, y, w, h) {
//     for (i = 0; i < boxs.length; i++) {
//         var x1=boxs[i][0];
//         var y1=boxs[i][1];
//         var w1=boxs[i][2];
//         var h1=boxs[i][3];
//         if (intersects(x, y, w, h, x1, y1, w1, h1))
//         {
//             // alert (" x=" +x1 +" y=" +y1 +" w=" +w1 +" h=" + h1);
//             if (drawPlayer()) {
//                 playSound('sound/laugh.mp3');
//                 sc+=1;
//                 boxs.splice(i, 1);
//                 eat = false;
//             } else { playSound('sound/sad.mp3'); }
//         }
//     }
// }
//
// function intersects(xp, yp, wp, hp, xo, yo, wo, ho) {
//     wo += xo;
//     wp += xp;
//     if (xo > wp || xp > wo) return false;
//     ho += yo;
//     hp += yp;
//     if (yo > hp || yp > ho) return false;
//     return true; // returns true if there is any overlap
// }
//
// function updateCanvas() {
//     ctx.clearRect(0,0, canvas.width,canvas.height); //Clear Canvas
//
//     //Check if we should generate a new object
//     if (Math.random() < 0.03) {
//         xu = -20;
//         yu = Math.floor(Math.random() * canvas.height);
//         boxs.push([xu, yu, 40, 40]);
//     }
//
//     //Update the position of objects
//     for (var i = boxs.length - 1; i >= 0; i--) {
//         if (boxs[i][0] < canvas.width / 4) { // stage 1
//             boxs[i][0] = boxs[i][0] + (Math.random() * 8 + 2); // moving in different speeds
//             ctx.beginPath();
//             ctx.arc(boxs[i][0], boxs[i][1], 20, Math.PI * 2, 0, true);
//             ctx.closePath();
//             ctx.fillStyle = "rgba(255,60,20,0.60)";
//             ctx.fill();
//         }
//         else if (boxs[i][0] < canvas.width / 2) { // stage 2
//             boxs[i][0] = boxs[i][0] + (Math.random() * 4);
//             ctx.beginPath();
//             ctx.arc(boxs[i][0], boxs[i][1], 30, Math.PI * 2, 0, true);
//             ctx.closePath();
//             ctx.fillStyle = "rgba(255,60,20,1)";
//             ctx.fill();
//         }
//         else if (boxs[i][0] < canvas.width * 3 / 4) { // stage 3
//             boxs[i][0] = boxs[i][0] + (Math.random() * 3 + 1);
//             ctx.beginPath();
//             ctx.arc(boxs[i][0], boxs[i][1], 20, Math.PI * 2, 0, true);
//             ctx.closePath();
//             ctx.fillStyle = "rgba(255,60,20,1)";
//             ctx.fill();
//         }
//         else { // stage 4
//             boxs.splice(i, 1);
//         }
//     }
//     writeScore(sc); // update score
// }
//
// function playSound(soundfile)
// {
//     document.getElementById("dummy").innerHTML=
//         "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
// }
//
// function writeScore(sc) {
//     // Transparent black text
//     ctx.font = '25px "MS UI Gothic"';
//     ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
//     ctx.fillText("SCORE: " +sc, 0, 30);
// }

    function getRandomInRange(max) {
        return Math.random() * max + 2; // min = 5, max = max + 5
    }
});
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
    var score = 0;

    canvas.addEventListener("keydown", function(event) {
        if (event.preventDefaulted) {
            return; // Do nothing if event already handled
        }

        switch(event.code) {
            case "KeyS": case "ArrowDown":
                if (player.y <= canvas.height - player.height - 10) { // check wall
                    player.y += 7;
                    direction = 0; // 0 = face down
                }
                break;

            case "KeyA": case "ArrowLeft":
                if (player.x >= 10) {
                    player.x -= 7;
                    direction = 1; // 1 = face left
                }
                break;

            case "KeyD": case "ArrowRight":
                if (player.x <= canvas.width - player.width - 10) {
                    player.x += 7;
                    direction = 2; // 2 = face right
                }
                break;

            case "KeyW": case "ArrowUp":
                if (player.y >= 10) {
                    player.y -= 7;
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

    var worm1 = { // init worm
        x: getRandomInRange(0, canvas.width * 3/4),
        y: getRandomInRange(0, canvas.height -10),
        vx: getRandomInRange(-20, 20),
        vy: getRandomInRange(-10, 10),
        r: 5,
        lc: 0
    };
    var worm2 = { // init worm
        x: getRandomInRange(0, canvas.width * 3/4),
        y: getRandomInRange(0, canvas.height -10),
        vx: getRandomInRange(-25, 25),
        vy: getRandomInRange(-10, 10),
        r: 5,
        lc: 0
    };
    var worms = [];
    worms.push(worm1);
    worms.push(worm2);

    window.requestAnimationFrame(gameLoop); // start the first frame request
    var fps = 10;
    function gameLoop() {
        setTimeout(function () {
            window.requestAnimationFrame(gameLoop);
            update();
        }, 1000 / fps);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // player
        frame = ++ frame % 4;
        player.sx = frame * (player.width + 3);
        player.sy = direction * player.height;
        ctx.drawImage(dino, player.sx, player.sy, player.width, player.height, player.x, player.y, player.width, player.height);

        // worms
        if (Math.random() < 0.05 && worms.length < 8) { // randomly generate a new object, no more than 8 at same time
            worms.push({
                x: getRandomInRange(0, canvas.width * 3/4),
                y: getRandomInRange(0, canvas.height -10),
                vx: getRandomInRange(-40, 40),
                vy: getRandomInRange(-20, 20),
                r: 5,
                lc: 0
            });
        }

        for (let i = 0; i < worms.length; i++) {
            checkWall(worms[i]);
            checkObject(worms[i], i);
            switch (worms[i].lc) {
                case 0:
                    worms[i].x += worms[i].vx;
                    worms[i].y += worms[i].vy;
                    worms[i].lc = 1;
                    break;

                case 1:
                    worms[i].x += worms[i].vx;
                    worms[i].y += worms[i].vy;
                    worms[i].r += 0.5;
                    if (worms[i].r > 25) {
                        worms[i].lc = 2
                    }
                    break;

                case 2:
                    worms[i].x += worms[i].vx;
                    worms[i].y += worms[i].vy;
                    worms[i].r -= 0.5;
                    if (worms[i].r < 2) {
                        worms[i].lc = 3
                    }
                    break;

                case 3:
                    worms[i].x = getRandomInRange(0, canvas.width * 3/4);
                    worms[i].y = getRandomInRange(0, canvas.height - 10);
                    worms[i].lc = 0;
                    break;
            }

            var gradient = ctx.createRadialGradient(worms[i].x, worms[i].y, worms[i].r, worms[i].x, worms[i].y, worms[i].r/2);
            gradient.addColorStop(0, 'rgb(255,255,255)');
            gradient.addColorStop(0.5, 'rgb(255,255,0)');
            gradient.addColorStop(1, 'rgb(255,100,0)');
            ctx.beginPath();
            ctx.arc(worms[i].x, worms[i].y, worms[i].r, Math.PI, 0, false);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            ctx.closePath();
            ctx.stroke();
        }
    }

    function checkWall(worm) {
        if ((worm.x >= canvas.width * 3/4) || (worm.x <= worm.r)) { // reach right or left
            worm.vx = -worm.vx; // inverse direction x
        }
        if ((worm.y >= canvas.clientHeight) || (worm.y <= worm.r)) { // reach bottom or top
            worm.vy = -worm.vy; // inverse direction y
        }
    }

    function checkObject(worm, index) {
        var wx = worm.x;
        var wy = worm.y;
        var ww = worm.r * 2;
        var wh = worm.r;
        var px = player.x;
        var py = player.y;
        var pw = player.width;
        var ph = player.height;

        if (intersect(wx, wy, ww, wh, px, py, pw, ph))
        {
            if (eat) {
                score += 1;
                laugh.play();
                worms.splice(index, 1);
            } else {
                sad.play();
                worms.splice(index, 1);
            }
        }
    }

    function intersect(wx, wy, ww, wh, px, py, pw, ph) {
        return !(px > ww + wx || wx > pw + px || py > wh + wy || wy > ph + py);
    }

    function writeScore(score) {
        ctx.font = '25px "MS UI Gothic"';
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fillText("SCORE: " +sc, 0, 30);
}

    function getRandomInRange(min, max) {
        return Math.random() * (Math.abs(min) + max) + min;
    }
});
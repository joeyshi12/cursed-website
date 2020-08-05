const width = 600;
const height = 400;
const padding = 40;
const paddle_width = 10;
const paddle_height = 70;
const paddle_speed = 6;
const ball_diameter = 10;
const ball_speed = 10;
const buffer = 5;


class Paddle {
    constructor(x) {
        this.x = x;
        this.y = (height - paddle_height) / 2;
        this.dy = 0;
    }

    update() {
        if (0 < this.y + this.dy && this.y + this.dy < height - paddle_height) {
            this.y += this.dy;
        }
    }

    draw() {
        rect(this.x, this.y, paddle_width, paddle_height);
    }
}


class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.dx = -ball_speed;
        this.dy = 0;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.y <= 0 || this.y + ball_diameter >= height) {
            this.dy = Math.abs(this.dy);
        }

        if (this.y + ball_diameter >= height) {
            this.dy = -Math.abs(this.dy);
        }
    }

    draw() {
        circle(this.x, this.y, ball_diameter);
    }
}


let player = new Paddle(padding);
let opponent = new Paddle(width - padding - paddle_width);
let balls = [new Ball()];
let tallyPlayer = 0;
let tallyOpponent = 0;
let bounceSound;

function preload() {
    bounceSound = loadSound('assets/bounce_sound.wav');
}

function setup() {
    createCanvas(width, height);
}


function keyPressed() {
    if (keyCode === 87) {
        player.dy -= paddle_speed;
    } else if (keyCode === 83) {
        player.dy += paddle_speed;
    } else if (keyCode === 74) {
        balls.push(new Ball())
    }
}


function keyReleased() {
    if (keyCode === 87) {
        player.dy += paddle_speed;
    } else if (keyCode === 83) {
        player.dy -= paddle_speed;
    }
}

function draw() {
    background(0);
    fill(255, 255, 255);
    textSize(32);
    text(tallyPlayer, 160, 40);
    text(tallyOpponent, 420, 40);
    stroke(255);
    line(width / 2, 0, width / 2, height);

    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
    }
    player.draw();
    opponent.draw();

    player.update();
    opponent.update();
    for (i = 0; i < balls.length; i++) {
        balls[i].update();
    }

    if (balls.length !== 0) {
        const n = balls.length;
        var closestBall = balls[0];
        var smallestDist = opponent.x - balls[0].x;
        for (i = 1; i < balls.length; i++) {
            dist = opponent.x - balls[i].x;
            if (dist < smallestDist) {
                closestBall = balls[i];
                smallestDist = dist;
            }
        }

        let dy = opponent.y - closestBall.y + paddle_height / 2;
        if (dy > 30) {
            opponent.dy = -paddle_speed;
        } else if (dy < 30) {
            opponent.dy = paddle_speed;
        } else {
            opponent.dy = 0;
        }
    } else {
        opponent.dy = 0;
    }

    for (i = 0; i < balls.length; i++) {
        let ball = balls[i];

        if (player.x - buffer <= ball.x && ball.x <= player.x + paddle_width + buffer) {
            if (player.y < ball.y && ball.y < player.y + paddle_height) {

                const t = 2 * (ball.y - player.y - paddle_height / 2) / paddle_height;
                const angle = Math.atan(t * Math.PI / 3);

                ball.dx = ball_speed * Math.cos(angle);
                ball.dy = ball_speed * Math.sin(angle);
                bounceSound.play();
            }
        }

        if ((opponent.x - buffer <= ball.x && ball.x <= opponent.x + paddle_width + buffer)) {
            if ((opponent.y < ball.y && ball.y < opponent.y + paddle_height) ||
                (opponent.y < ball.y + ball_diameter && ball.y + ball_diameter < opponent.y + paddle_height)) {
                const t = 2 * (ball.y - opponent.y - paddle_height / 2) / paddle_height;
                const angle = Math.atan(t * Math.PI / 3);

                ball.dx = -ball_speed * Math.cos(angle);
                ball.dy = ball_speed * Math.sin(angle);
                bounceSound.play();
            }
        }

        if (ball.x < 0 || ball.x + ball_diameter > width) {
                if (ball.x < 0) {
                    ball.dx = -ball_speed;
                    tallyOpponent += 1;
                } else {
                    ball.dx = ball_speed;
                    tallyPlayer += 1;
                }

                balls.splice(i, 1);
            }
    }


    // if (ball.x < 0 || ball.x + ball_diameter > width) {
    //     if (ball.x < 0) {
    //         ball.dx = -ball_speed;
    //         tallyOpponent += 1;
    //     } else {
    //         ball.dx = ball_speed;
    //         tallyPlayer += 1;
    //     }
    //     ball.dy = 0;
    //     ball.x = width / 2;
    //     ball.y = height / 2;
    // }
}
const width = 600;
const height = 400;
const padding = 40;
const paddle_width = 10;
const paddle_height = 70;
const paddle_speed = 8;
const ball_diameter = 10;
const ball_speed = 12;
const buffer = 12;

class Paddle {
    constructor(x) {
        this.x = x;
        this.y = (height - paddle_height) / 2;
        this.dy = 0;
    }

    update() {
        throw new Error('update not implemented');
    }

    draw() {
        rect(this.x, this.y, paddle_width, paddle_height);
    }
}

class Player extends Paddle {
    constructor() {
        super(padding);
        this.moveUp = false;
        this.moveDown = false;
    }

    update() {
        this.dy = this.moveUp ? -paddle_speed : 0;
        this.dy += this.moveDown ? paddle_speed : 0;

        if (0 < this.y + this.dy && this.y + this.dy < height - paddle_height) {
            this.y += this.dy;
        }
    }

    keyPressed(key) {
        if (keyCode === 87) {
            this.moveUp = true;
        } else if (keyCode === 83) {
            this.moveDown = true;
        }
    }

    keyReleased(key) {
        if (keyCode === 87) {
            this.moveUp = false;
        } else if (keyCode === 83) {
            this.moveDown = false;
        }
    }
}

class Opponent extends Paddle {
    constructor() {
        super(width - padding - paddle_width);
    }

    update(ball) {
        this.follow(ball);
        if (0 < this.y + this.dy && this.y + this.dy < height - paddle_height) {
            this.y += this.dy;
        }
    }

    follow(ball) {
        let dy = this.y - ball.y + paddle_height / 2;
        if (dy > 5) {
            this.dy = -paddle_speed;
        } else if (dy < 5) {
            this.dy = paddle_speed;
        } else {
            this.dy = 0;
        }
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

        if (this.y <= 0) {
            this.dy = Math.abs(this.dy);
        } else if (this.y + ball_diameter >= height) {
            this.dy = -Math.abs(this.dy);
        }
    }

    draw() {
        circle(this.x, this.y, ball_diameter);
    }
}

class GameRun {
    constructor() {
        this.player = new Player();
        this.opponent = new Opponent();
        this.ball = new Ball();
        this.tallyPlayer = 0;
        this.tallyOpponent = 0;
        this.bounceSound = null;
    }

    update() {
        if (this.checkGameOver()) {
            this.reset();
        }

        if (this.player.x <= this.ball.x && this.ball.x <= this.player.x + paddle_width + buffer) {
            if (this.player.y < this.ball.y && this.ball.y < this.player.y + paddle_height) {
                const t = 2 * (this.ball.y - this.player.y - paddle_height / 2) / paddle_height;
                const angle = Math.atan(t * Math.PI / 3);

                this.ball.dx = ball_speed * Math.cos(angle);
                this.ball.dy = ball_speed * Math.sin(angle);
                this.bounceSound.play();
            }
        } else if (this.opponent.x - buffer <= this.ball.x && this.ball.x <= this.opponent.x + paddle_width) {
            if (this.opponent.y < this.ball.y && this.ball.y < this.opponent.y + paddle_height) {
                const t = 2 * (this.ball.y - this.opponent.y - paddle_height / 2) / paddle_height;
                const angle = Math.atan(t * Math.PI / 3);

                this.ball.dx = -ball_speed * Math.cos(angle);
                this.ball.dy = ball_speed * Math.sin(angle);
                this.bounceSound.play();
            }
        }

        this.player.update();
        this.opponent.update(this.ball);
        this.ball.update();
    }

    reset() {
        if (this.ball.x < 0) {
            this.ball.dx = ball_speed;
            this.tallyOpponent += 1;
        } else {
            this.ball.dx = -ball_speed;
            this.tallyPlayer += 1;
        }

        this.ball.dy = 0;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
    }

    checkGameOver() {
        return this.ball.x < 0 || this.ball.x + ball_diameter > width;
    }

    keyPressed() {
        this.player.keyPressed(keyCode);
    }

    keyReleased() {
        this.player.keyReleased(keyCode);
    }

    draw() {
        textSize(32);
        text(this.tallyPlayer, 160, 40);
        text(this.tallyOpponent, 420, 40);
        this.player.draw();
        this.opponent.draw();
        this.ball.draw();
    }
}

let gameRun = new GameRun();

function preload() {
    gameRun.bounceSound = loadSound('pong/bounce_sound.wav');
}

function setup() {
    createCanvas(width, height);
}

function keyPressed() {
    gameRun.keyPressed(keyCode);
}

function keyReleased() {
    gameRun.keyReleased(keyCode);
}

function draw() {
    background(0);
    fill(255, 255, 255);
    stroke(255, 255, 255);
    line(width / 2, 0, width / 2, height);
    gameRun.draw();
    gameRun.update();
}
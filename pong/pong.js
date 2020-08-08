const width = 600;
const height = 400;
const padding = 40;
const paddleWidth = 10;
const paddleHeight = 70;
const paddleSpeed = 8;
const ballDiameter = 10;
const ballSpeed = 12;
const maxBounceAngle = 5 * Math.PI / 12;
const buffer = 12;

class Paddle {
    constructor(x) {
        this.x = x;
        this.y = (height - paddleHeight) / 2;
        this.dy = 0;
    }

    update() {
        throw new Error('update not implemented');
    }

    draw() {
        rect(this.x, this.y, paddleWidth, paddleHeight);
    }
}

class Player extends Paddle {
    constructor() {
        super(padding);
        this.moveUp = false;
        this.moveDown = false;
    }

    update() {
        this.dy = this.moveUp ? -paddleSpeed : 0;
        this.dy += this.moveDown ? paddleSpeed : 0;

        if (0 < this.y + this.dy && this.y + this.dy < height - paddleHeight) {
            this.y += this.dy;
        }
    }
}

class Opponent extends Paddle {
    constructor() {
        super(width - padding - paddleWidth);
    }

    update(ball) {
        this.follow(ball);
        if (0 < this.y + this.dy && this.y + this.dy < height - paddleHeight) {
            this.y += this.dy;
        }
    }

    follow(ball) {
        let dy = this.y - ball.y + paddleHeight / 2;
        if (dy > 5) {
            this.dy = -paddleSpeed;
        } else if (dy < 5) {
            this.dy = paddleSpeed;
        } else {
            this.dy = 0;
        }
    }
}

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.dx = -ballSpeed;
        this.dy = 0;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.y <= 0) {
            this.dy = Math.abs(this.dy);
        } else if (this.y + ballDiameter >= height) {
            this.dy = -Math.abs(this.dy);
        }
    }

    draw() {
        circle(this.x, this.y, ballDiameter);
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

        if (this.player.x <= this.ball.x && this.ball.x <= this.player.x + paddleWidth + buffer) {
            if (this.player.y < this.ball.y && this.ball.y < this.player.y + paddleHeight) {
                const t = 2 * (this.ball.y - this.player.y - paddleHeight / 2) / paddleHeight;
                const angle = Math.atan(t * maxBounceAngle);

                this.ball.dx = ballSpeed * Math.cos(angle);
                this.ball.dy = ballSpeed * Math.sin(angle);
                this.bounceSound.play();
            }
        } else if (this.opponent.x - buffer <= this.ball.x && this.ball.x <= this.opponent.x + paddleWidth) {
            if (this.opponent.y < this.ball.y && this.ball.y < this.opponent.y + paddleHeight) {
                const t = 2 * (this.ball.y - this.opponent.y - paddleHeight / 2) / paddleHeight;
                const angle = Math.atan(t * maxBounceAngle);

                this.ball.dx = -ballSpeed * Math.cos(angle);
                this.ball.dy = ballSpeed * Math.sin(angle);
                this.bounceSound.play();
            }
        }

        this.player.update();
        this.opponent.update(this.ball);
        this.ball.update();
    }

    reset() {
        if (this.ball.x < 0) {
            this.ball.dx = ballSpeed;
            this.tallyOpponent += 1;
        } else {
            this.ball.dx = -ballSpeed;
            this.tallyPlayer += 1;
        }

        this.ball.dy = 0;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
    }

    checkGameOver() {
        return this.ball.x < 0 || this.ball.x + ballDiameter > width;
    }

    keyPressed() {
        if (keyCode === 87) {
            this.player.moveUp = true;
        } else if (keyCode === 83) {
            this.player.moveDown = true;
        }
    }

    keyReleased() {
        if (keyCode === 87) {
            this.player.moveUp = false;
        } else if (keyCode === 83) {
            this.player.moveDown = false;
        }
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
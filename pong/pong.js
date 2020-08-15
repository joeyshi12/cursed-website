const width = 600;
const height = 400;
const padding = 40;
const paddleWidth = 10;
const paddleHeight = 70;
const paddleSpeed = 6;
const ballDiameter = 12;
const ballSpeed = 10;
const maxBounceAngle = Math.PI / 3;
const buffer = 12;

class Paddle {
    constructor(x) {
        this.x = x;
        this.y = (height - paddleHeight) / 2;
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
        let dy = 0;

        if (0 < this.y && this.moveUp) {
            dy -= paddleSpeed;
        }

        if (this.y < height - paddleHeight && this.moveDown) {
            dy += paddleSpeed;
        }

        this.y += dy;
    }
}

class Opponent extends Paddle {
    constructor() {
        super(width - padding - paddleWidth);
    }

    update(ball) {
        let dy = this.getVelocity(ball);


        if (0 < this.y && dy < 0) {
            this.y += dy;
        }

        if (this.y < height - paddleHeight && dy > 0) {
            this.y += dy;
        }
    }

    getVelocity(ball) {
        let dy = this.y - ball.y + paddleHeight / 2;
        if (dy > 5) {
            return -paddleSpeed;
        } else if (dy < 5) {
            return paddleSpeed;
        } else {
            return 0;
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
        this.countDown = 0;
    }

    update() {
        if (this.checkGameOver()) {
            this.reset();
        }

        if (this.ball.dx < 0) {
            if (this.player.x <= this.ball.x && this.ball.x <= this.player.x + paddleWidth + buffer) {
                if (this.player.y < this.ball.y && this.ball.y < this.player.y + paddleHeight) {
                    const t = 2 * (this.ball.y - this.player.y - paddleHeight / 2) / paddleHeight;
                    const angle = Math.atan(t * maxBounceAngle);

                    this.ball.dx = ballSpeed * Math.cos(angle);
                    this.ball.dy = ballSpeed * Math.sin(angle);
                    if (this.bounceSound) {
                        this.bounceSound.play();
                    }
                }
            }
        } else if (this.ball.dx > 0) {
            if (this.opponent.x - buffer <= this.ball.x && this.ball.x <= this.opponent.x + paddleWidth) {
                if (this.opponent.y < this.ball.y && this.ball.y < this.opponent.y + paddleHeight) {
                    const t = 2 * (this.ball.y - this.opponent.y - paddleHeight / 2) / paddleHeight;
                    const angle = Math.atan(t * maxBounceAngle);

                    this.ball.dx = -ballSpeed * Math.cos(angle);
                    this.ball.dy = ballSpeed * Math.sin(angle);
                    if (this.bounceSound) {
                        this.bounceSound.play();
                    }
                }
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

        const next_dx = this.ball.dx;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.ball.x = width / 2;
        this.ball.y = height / 2;

        this.countDown = 3;
        setTimeout(() => {
            this.countDown--;
            setTimeout(() => {
                this.countDown--;
                setTimeout(() => {
                    this.countDown--;
                    this.ball.dx = next_dx;
                }, 600)
            }, 600);
        }, 600)
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
        this.ball.draw();
        this.player.draw();
        this.opponent.draw();

        if (this.countDown > 0) {
            textSize(32);
            text(this.countDown, width / 2 - 10, height / 2 - 20);
        }
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
    line(width / 2, 0, width / 2, height);
    gameRun.draw();
    gameRun.update();
}
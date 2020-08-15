const width = 500;
const height = 500;
let x = 200;
let y = 200;
let dx = 0;
let dy = 0;

function setup() {
    createCanvas(width, height);
}

function keyPressed() {
    if (keyCode === 87) {
        dy = -6;
    } else if (keyCode === 83) {
        dy = 6;
    } else if (keyCode === 65) {
        dx = -6;
    } else if (keyCode === 68) {
        dx = 6;
    }
}

function keyReleased() {
    if (keyCode === 87) {
        dy = 0;
    } else if (keyCode === 83) {
        dy = 0;
    } else if (keyCode === 65) {
        dx = 0;
    } else if (keyCode === 68) {
        dx = 0;
    }
}

function draw() {
    background(0);
    fill(255, 255, 255);
    square(x, y, 40);
    x += dx;
    y += dy;
}
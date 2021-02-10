var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||         window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback,     1000/60) };
var canvas = document.createElement('canvas');
var width = 900;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
}

var step = function() {
    update();
    render();
    render2();
    animate(step);
    renderBlocks();
}

var update = function() {
}

var render = function() {
    context.fillStyle = "#ff9ab9";
    context.fillRect(0, 0, width, height);
}

var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var blocks = ["l", "t", "z", "s", "o", "i", "j"];

//19x20 per block!!!
//var img = new Image();
//img.src="https://i.postimg.cc/LsY034Ts/green.png";
//var pattern = context.createPattern(img, "repeat");
var render2 = function() {
    context.fillStyle = "#000000";
    context.fillRect(290, 0, 320, 600);
    var bg = new Image();
    bg.src = "https://i.postimg.cc/dQ4mDP2N/empty.png";
    context.drawImage(bg, 305, 10)
}

function Block(x, y, color) {
    this.x = x;
    this.y = y;
    this.image = new Image()
    if ( color === 1 ) {
        this.image.src = "https://i.postimg.cc/63VcM8GB/blue.png"
    }
    else if ( color === 2) {
        this.image.src = "https://i.postimg.cc/LsY034Ts/green.png";
    }
}

Block.prototype.render = function() {
    context.drawImage(this.image, 305+(this.x*29),10+(this.y*29));
}

var renderBlocks = function() {
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            this.block = new Block(j,i,board[i][j]);
            this.block.render();
        }
    }
}

var refill = function() {
    blocks = ["l", "t", "z", "s", "o", "i", "j"];
}

Block.prototype.
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||         window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback,     1000/60) };
var canvas = document.createElement('canvas');
var width = 900;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var left = false;
var right = false;
var currentLevel = 0;
var linesCleared = 0;
var linesNeeded = 0;
var level = 2;

var flash = 0;

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
}

var frames = 0;
var score = 0;

var step = function() {
    update();
    if ( level == 1 ) {
        render();
        renderBlocks();
    }
    if ( level == 2 ) {
        renderTitle();
    }
    if ( level == 3 ) {
        renderGameOver();
    }
    animate(step);
}

var animationArray = [];

// smooth controls? i hope
var AnimPic;
var AnimX;
var AnimY;
var AnimW;
var AnimH;
var AnimFrames;
var spaceFall = 0;
var spaceLeft = 0;
var spaceRight = 0;
var spaceHardDrop = 0;
var spaceClockwise = 0;
var stupid = new Image();
var frameThing = 0;
stupid.src = "https://i.postimg.cc/wMk6YNqN/hold-Block.png";
var funky = new Image()
funky.src = "https://i.ibb.co/FJHmk6H/fuynky-1.png";
var dkBang = new Image();
dkBang.src = "https://i.ibb.co/Kh6TbpQ/ouhouhmonkey.png";
funkyKong = new Animation(funky, 11, 0, 0, 107, 107, 0, 5, 0);
var eyesMonkey = new Image();
eyesMonkey.src = "https://i.ibb.co/wgvnkkS/woweemonkey.png"
var tetrisMonkey = new Image();
tetrisMonkey.src = "https://i.imgur.com/62RTka4.png";

var tetrisClear = new Audio();
tetrisClear.src = "http://66.90.93.122/soundfiles/nintendo-64-usf/donkey-kong-64/s14%20Collect%20Golden%20Banana.mp3";

var doubleClear = new Audio();
doubleClear.src = "http://66.90.93.122/soundfiles/nintendo-64-usf/donkey-kong-64/s09%20Find%20Melon%20Piece.mp3";

var tripleClear = new Audio();
tripleClear.src = "http://66.90.93.122/soundfiles/nintendo-64-usf/donkey-kong-64/s13%20Find%20Golden%20Banana.mp3";

var singleClear = new Audio();
singleClear.src = "http://66.90.93.122/soundfiles/nintendo-64-usf/donkey-kong-64/999%20unknown%203.mp3";


var render = function() {
    var donkey = new Image();
    donkey.src = "https://i.postimg.cc/j2gJcV2w/domkeykong.png";
    context.fillStyle = "#ff9ab9";
    context.drawImage(donkey, 0, 0);
//    context.fillStyle = "#99fc88";
//    context.fillRect(290, 0, 320, 600);
//    context.fillStyle = "#f4f9c0";
    context.font = "30px Arial";
    context.fillText( "Score:", 650, 40);
    context.fillText( score, 650, 100);
    context.fillText( currentLevel, 650, 130 );
    context.fillText( linesCleared, 650, 160 );
    context.font = "20px Comic Sans MS";
    context.fillText("Controls:", 650, 430 );
    context.fillText("Hold: Q", 650, 455 );
    context.fillText("Left/Right: <- & ->", 650, 480);
    context.fillText("Clockwise: S", 650, 505);
    context.fillText("C-Clockwise: W", 650, 530);
    var bg = new Image();
    bg.src = "https://i.postimg.cc/dQ4mDP2N/empty.png";
    context.drawImage(bg, 305, 10)
    renderBlocks();
    if ( start === false ) {
        start = true;
    }
    drawWhereLanding();
    currentBlock.render();
    if ( frames > 29-(currentLevel*3) ) {
        frames = 0;
        fall();
    }
    frames++;
    spaceClockwise++;
    spaceLeft++;
    spaceRight++;
    spaceHardDrop++;
    animateQueue();
    drawHeldBlock();
    drawNextBlock();
//    funkyKong.renderFrame();
}


var SRS = [
    ["0,0", "-1,0", "-1,1", "0,-2", "-1,-2"], //O to 1
    ["0,0", "1,0", "1,-1", "0,2", "1,2"], // 1 to 0
    ["0,0", "1,0", "1,-1", "0,2", "1,2"], // 1 to 2
    ["0,0", "-1,0", "-1,1", "0,-2", "-1,-2"], // 2 to 1
    ["0,0", "1,0", "1,1", "0,-2", "1,-2"], // 2 to 3
    ["0,0", "-1,0", "-1,-1", "0,2", "-1,2"], // 3 to 2
    ["0,0", "-1,0", "-1,-1", "0,2", "-1,2"], // 3 to 0
    ["0,0", "1,0", "1,1", "0,-2", "1,-2"], // 0 to 3
]

var SRSLBLOCK = [
    ["0,0", "-2,0", "1,0", "-2,-1", "1,2"],
    ["0,0", "2,0", "-1,0", "2,1", "-1,-2"],
    ["0,0", "-1,0", "2,0", "-1,2", "2,-1"],
    ["0,0", "1,0", "-2,0", "1,-2", "-2,1"],
    ["0,0", "2,0", "-1,0", "2,1", "-1,-2"],
    ["0,0", "-2,0", "1,0", "-2,-1", "1,2"],
    ["0,0", "1,0", "-2,0", "1,-2", "-2,1"],
    ["0,0", "-1,0", "2,0", "-1,2", "2,-1"]
]

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

var oBlock = [
    [6, 6],
    [6, 6]
]


var jBlock = [
    [4, 0, 0],
    [4, 4, 4],
    [0, 0, 0]
]
var jBlock2 = [
    [0, 4, 4],
    [0, 4, 0],
    [0, 4, 0]
]
var jBlock3 = [
    [0, 0, 0],
    [4, 4, 4],
    [0, 0, 4]
]
var jBlock4 = [
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0]
]


var lBlock = [
    [0, 0, 5],
    [5, 5, 5],
    [0, 0, 0],
]
var lBlock2 = [
    [0, 5, 0],
    [0, 5, 0],
    [0, 5, 5],
]
var lBlock3 = [
    [0, 0, 0],
    [5, 5, 5],
    [5, 0, 0],
]
var lBlock4 = [
    [5, 5, 0],
    [0, 5, 0],
    [0, 5, 0],
]


var iBlock = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]
var iBlock2 = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0]
]
var iBlock3 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0]
]
var iBlock4 = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
]


var sBlock = [
    [0, 2, 2],
    [2, 2, 0],
    [0, 0, 0]
]
var sBlock2 = [
    [0, 2, 0],
    [0, 2, 2],
    [0, 0, 2]
]
var sBlock3 = [
    [0, 0, 0],
    [0, 2, 2],
    [2, 2, 0]
]
var sBlock4 = [
    [2, 0, 0],
    [2, 2, 0],
    [0, 2, 0]
]


var zBlock = [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
]
var zBlock2 = [
    [0, 0, 7],
    [0, 7, 7],
    [0, 7, 0]
]
var zBlock3 = [
    [0, 0, 0],
    [7, 7, 0],
    [0, 7, 7]
]
var zBlock4 = [
    [0, 7, 0],
    [7, 7, 0],
    [7, 0, 0]
]


var tBlock = [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0]
]
var tBlock2 = [
    [0, 3, 0],
    [0, 3, 3],
    [0, 3, 0]
]
var tBlock3 = [
    [0, 0, 0],
    [3, 3, 3],
    [0, 3, 0]
]
var tBlock4 = [
    [0, 3, 0],
    [3, 3, 0],
    [0, 3, 0]
]


var lBlockRotations = [lBlock, lBlock2, lBlock3, lBlock4];
var jBlockRotations = [jBlock, jBlock2, jBlock3, jBlock4];
var iBlockRotations = [iBlock, iBlock2, iBlock3, iBlock4];
var sBlockRotations = [sBlock, sBlock2, sBlock3, sBlock4];
var zBlockRotations = [zBlock, zBlock2, zBlock3, zBlock4];
var tBlockRotations = [tBlock, tBlock2, tBlock3, tBlock4];
var oBlockRotations = [];
var placeInArray = 0;
var blockHoldTemp = null;
var blockHoldTemp2 = null;
var clearImg = new Image();
clearImg.src = "https://i.postimg.cc/KjNdtyGv/clear.png";

// SPLIT SPLIT REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
// BLAH BLAH BLAH LOOKS NICE OKAY OTHER CODE


var blocks = [oBlock, jBlock, lBlock, iBlock, tBlock, zBlock, sBlock];

function Block(y, x, color) {
    this.x = x;
    this.y = y;
    this.image = new Image()
    if ( color === 1 ) {
        this.image.src = "https://i.postimg.cc/63VcM8GB/blue.png"
    }
    else if ( color === 2 ) {
        this.image.src = "https://i.postimg.cc/LsY034Ts/green.png";
    }
    else if ( color == 3 ) {
        this.image.src = "https://i.postimg.cc/ZqrrLnjM/purple.png";
    }
    else if ( color == 4 ) {
        this.image.src = "https://i.postimg.cc/4yKyBFsx/dblue.png";
    }
    else if ( color == 5 ) {
        this.image.src = "https://i.postimg.cc/W1Vr1Tsm/orange.png";
    }
    else if ( color == 6 ) {
        this.image.src = "https://i.postimg.cc/tT8nQHrx/yellow.png";
    }
    else if ( color == 7 ) {
        this.image.src = "https://i.postimg.cc/m2jZ7sQy/red.png";
    }
}


//var currentBlock = new Tetrimino(0, 3, iBlock, iBlockRotations );

var hold = new Tetrimino(null,null,null,null);

var canHold = true;

function Tetrimino(x, y, type, array) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.array = array;
}

Tetrimino.prototype.render = function() {
    for ( var r = 0; r < this.type.length; r++ ) {
        for ( var c = 0; c < this.type[0].length; c++ ) {
            if ( this.type[r][c] != 0 ) {
                var block = new Block(r+currentBlock.x, c+currentBlock.y, this.type[r][c]);
                block.render();
            }
        }
    }
}

Block.prototype.render = function() {
    context.drawImage(this.image, 305+(this.x*29),10+(this.y*29));
}

var renderBlocks = function() {
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            this.block = new Block(i,j,board[i][j]);
            this.block.render();
        }
    }
}

var SRSNumber = -1;

var clockwise = function( blockType ) {
    var newNum = -1;
    var firstNum = 0;
    var secondNum = 0;
    var tempy = SRS;
    if ( iBlockRotations.includes(currentBlock.type) ) {
        tempy = SRSLBLOCK;
    }
    if ( placeInArray-1 < 0 ) {
        newNum = 3;
    }
    else {
        newNum = placeInArray-1;
    }
    // SRS
    if ( currentBlock.array == oBlockRotations ) {
        return;
    }
    if ( checkRotation(currentBlock.array[newNum], currentBlock.x, currentBlock.y) ) {
        currentBlock = new Tetrimino(currentBlock.x, currentBlock.y, currentBlock.array[newNum], currentBlock.array);
        placeInArray = newNum;
        return;
    }
    else if ( ( findLast2(currentBlock.array[newNum])+currentBlock.y > 9 )) {
        for ( var j = 1; j < 4; j++ ) {
            if ( checkRotation(currentBlock.array[newNum], currentBlock.x-j,   currentBlock.y ) ) {
                currentBlock = new Tetrimino(currentBlock.array[newNum], currentBlock.x-j, currentBlock.y);
                placeInArray = newNum;
                console.log(j);
                return;
            }
        }
    }
    else if ( findFirst2(currentBlock.array[newNum])+currentBlock.y  < 0 ) {
        for ( var j = 1; j < 4; j++ ) {
            if ( checkRotation(currentBlock.array[newNum], currentBlock.x+j,   currentBlock.y ) ) {
                currentBlock = new Tetrimino(currentBlock.array[newNum], currentBlock.x+j, currentBlock.y);
                placeInArray = newNum;
                console.log(j);
                return;
            }
        }
    }
    else {
            if ( newNum = 3 ) { // 0 to 3 case
                SRSNumber = 7;
            }
            else if ( newNum == 2 ) { // 3 to 2 case
                SRSNumber = 5;
            }
            else if ( newNum == 1 ) { //2 to 1 case
                SRSNumber = 3;
            }
            else { // 1 to 0 case
                SRSNumber = 1;
            }
            for ( var i = 0; i < 3; i++ ) {
                    var string = SRS[SRSNumber][i+1];
                    var firstNum = 0-parseInt(string.split(",")[0]);
                    var secondNum = parseInt(string.split(",")[1]);
                    console.log(firstNum);
                    console.log(secondNum);
//                    if ( currentBlock.array[newNum] )
                    if ( checkRotation(currentBlock.array[newNum], currentBlock.x+secondNum, currentBlock.y+firstNum) ) {
                        currentBlock = new Tetrimino(currentBlock.x+secondNum, currentBlock.y+firstNum, currentBlock.array[newNum], currentBlock.array);
                        return;
                    }
            }
    }
}

var counterClockwise = function( blockType ) {
    var newPos = -1;
    var tempy = SRS;
    var firstNum = 0;
    var secondNum = 0;
    if ( iBlockRotations.includes(currentBlock.type) ) {
        tempy = SRSLBLOCK;
    }
    if ( placeInArray+1 > 3 ) {
        newPos = 0;
    }
    else {
        newPos = placeInArray+1;
    }
    // SRS
    if ( currentBlock.array == oBlockRotations ) {
        return;
    }
        if ( checkRotation(currentBlock.array[newPos], currentBlock.x, currentBlock.y) ) {
            currentBlock = new Tetrimino(currentBlock.x, currentBlock.y, currentBlock.array[newPos], currentBlock.array);
            placeInArray = newPos;
            return;
        }
        else if ( findLast2(currentBlock.array[newPos]+currentBlock.y ) == 7 ) {
            currentBlock = new Tetrimino(currentBlock.x+findLast2(currentBlock.array[newPos++]), currentBlock.y-1, currentBlock.array[newPos], currentBlock.array);
            placeInArray = newPos;
            return;
        }
        else {
            if ( newPos = 3 ) { // 2 to 3 case
                SRSNumber = 4;
            }
            else if ( newPos == 2 ) { // 1 to 2 case
                SRSNumber = 2;
            }
            else if ( newPos == 1 ) { //0 to 1 case
                SRSNumber = 0;
            }
            else { // 3 to 0 case
                SRSNumber = 6;
            }
            for ( var i = 0; i < 3; i++ ) {
                    var string = SRS[SRSNumber][i+1];
                    var firstNum = 0-parseInt(string.split(",")[0]);
                    var secondNum = parseInt(string.split(",")[1]);
                    console.log(firstNum);
                    console.log(secondNum);
                    if ( currentBlock.array[newPos] )
                    if ( checkRotation(currentBlock.array[newPos], currentBlock.x+secondNum, currentBlock.y+firstNum) ) {
                        currentBlock = new Tetrimino(currentBlock.x+secondNum, currentBlock.y+firstNum, currentBlock.array[newPos], currentBlock.array);
                        placeInArray = newPos;
                        return;
                    }
            }
        }
    
}

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var update = function() {
    for ( var key in keysDown ) {
        var value = Number(key);
        if ( value == 40 ) {
            fall();
        }
        if ( value == 37 ) {
            if ( spaceLeft > 2 ) {
                currentBlock.left();
                spaceLeft = 0;
            }
        }
        if (value == 39 ) {
            if ( spaceRight > 2 ) {
                currentBlock.right();
                spaceRight = 0;
            }
        }
        if ( value == 38 ) {
            if ( spaceHardDrop > 10 ) {
                fastDrop();
                spaceHardDrop = 0;
                delete keysDown[38];
            }
        }
        if ( value == 87 ) {
            if ( spaceClockwise > 7 ) {
                clockwise();
                spaceClockwise = 0;
                delete keysDown[87];
            }
        }
        if ( value == 83 ) {
            if ( spaceClockwise > 7 ) {
                counterClockwise();
                spaceClockwise = 0;
                delete keysDown[83];
            }
        }
        if ( value == 81 ) {
            holdBlock();
        }
        if ( value == 71 ) {
            animationArray.push(new Animation(dkBang, 33, 50, 250, 200, 200, 0, 3, 0, 1));
        }
        if ( value == 13 && level == 2 ) {
            level = 1;
        }
        if ( value == 82 && level == 3 ) {
            level = 1;
            blocks = [oBlock, jBlock, lBlock, iBlock, tBlock, zBlock, sBlock];
            score = 0;
            currentLevel = 0;
            linesCleared = 0;
            CurrentBlock = getRandomBlock();
//            blockHold
            for( var r = 0; r < board.length; r++){
                for( var c = 0; c < board[r].length; c++){
                    board[r][c] = 0;
                }
            }
        }
    }
}

var start = false;

function Throw( block ) {
    blockHoldTemp = block;
    if ( block === jBlock ) {
        if ( checkRotation(jBlock, 0, 3) ) {
            currentBlock = new Tetrimino(0,3,jBlock,jBlockRotations);
            blockHoldTemp2 = jBlockRotations;
        }
        else{
            gameOver();
        }
        
    }
    else if ( block === oBlock ) {
        if ( checkRotation(oBlock, 0, 4) ) {
            currentBlock = new Tetrimino(0,4,oBlock,oBlockRotations);
            blockHoldTemp2 = oBlockRotations;
        }
        else{
            gameOver();
        }
    }
    else if ( block === lBlock ) {
        if ( checkRotation(lBlock, 0,3 ) ) {
            currentBlock = new Tetrimino(0,3,lBlock,lBlockRotations);
            blockHoldTemp2 = lBlockRotations;
        }
        else{
            gameOver();
        }
    }
    else if ( block === iBlock ) {
        if ( checkRotation(iBlock, 0, 3) ) {
            currentBlock = new Tetrimino(0,3,iBlock,iBlockRotations);
            blockHoldTemp2 = iBlockRotations;
        }
        else{
            gameOver();
        }
    }
    else if ( block === sBlock ) {
        if ( checkRotation(sBlock, 0, 3) ) {
            currentBlock = new Tetrimino(0,3,sBlock,sBlockRotations);
            blockHoldTemp2 = sBlockRotations;
        }
        else{
            gameOver();
        }
    }
    else if ( block === zBlock ) {
        if ( checkRotation(zBlock, 0,4) ) {
            currentBlock = new Tetrimino(0,4,zBlock,zBlockRotations);
            blockHoldTemp2 = zBlockRotations;
        }
        else{
            gameOver();
        }
    }
    else if ( block === tBlock ) {
        if ( checkRotation(zBlock, 0,4) ) {
            currentBlock = new Tetrimino(0,4,tBlock,tBlockRotations);
            blockHoldTemp2 = tBlockRotations;
        }
        else{
            gameOver();
        }
    }
    placeInArray = 0;
}

Tetrimino.prototype.left = function() {
    var first = findFirst();
    if ( currentBlock.y + first  > 0 ) {
        if ( checkMovement(currentBlock.x, currentBlock.y-1) ) {
            currentBlock.y = currentBlock.y-1; 
        }
    }
}

Tetrimino.prototype.right = function() {
    var last = findLast();
    if ( currentBlock.y + 1+last < 10 ) {
        if ( checkMovement(currentBlock.x, currentBlock.y+1) ) {
            currentBlock.y = currentBlock.y+1; 
        }
    }
}

var fall = function() {
    if ( ( currentBlock.x+findBottom()+1 < 20 ) ) {
            if ( checkMovement(currentBlock.x+1,currentBlock.y) ) {
                currentBlock.x++;
                score+=1;
            }
            else {
                insertBlock();
                Throw(nextBlock[0]);
                next();
                
            }
    }
    else {
        insertBlock();
        Throw(nextBlock[0]);
        next();
        
    }
}

var insertBlock = function() {
    for ( var r = 0; r < currentBlock.type.length; r++ ) {
        for ( var c = 0; c < currentBlock.type[0].length; c++ ) {
            if ( currentBlock.type[r][c] == 1 || currentBlock.type[r][c] == 2 || currentBlock.type[r][c] == 3 ||  currentBlock.type[r][c] == 4 || currentBlock.type[r][c] == 5 || currentBlock.type[r][c] == 6 || currentBlock.type[r][c] == 7 ) {
                board[currentBlock.x+r][currentBlock.y+c] = currentBlock.type[r][c];
            }
        }
    }
    canHold = true;
    clearLines();
}

var clearLines = function() {
    console.log("bruh");
    var temp = linesCleared;
    var cntline = 0;
    for ( var r = 0; r < board.length; r++ ) {
        if ( ! board[r].includes(0) ) {
            cntline++;
            board[r] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            console.log(r);
            fallDown(r);
        }
    }
    if( cntline === 4) {
        score += (1200*(currentLevel+1));
        animationArray.push(new Animation(tetrisMonkey, 46, 20, 200, 225, 300, 0, 2, 0, 1.5));
        linesCleared+=4;
        tetrisClear.play();
    } else if( cntline === 3 ){
        score += (300*(currentLevel+1));
        linesCleared+=3;
        animationArray.push(new Animation(dkBang, 33, 20, 250, 200, 200, 0, 3, 0, 1.25));
        tripleClear.play();
    }else if( cntline === 2 ){
        score += (100*(currentLevel+1));
        linesCleared+=2;
        animationArray.push(new Animation(eyesMonkey, 33, 10, 250, 225, 189, 0, 3, 0, 1.5));
        doubleClear.play();
    }else if( cntline === 1 ){
        animationArray.push(new Animation(funky, 11, 10, 250, 630, 600, 0, 5, 0, 0.5));
        score += (40*(currentLevel+1));
        linesCleared++;
        singleClear.play();
    }  
    changeLevel();
    noGlitchPlz(linesCleared-temp);
}

var findFirst = function() {
    var temporary = 5;
    for ( var row2 = 0; row2 < currentBlock.type.length; row2++ ) {
        for ( var col2 = 0; col2 < currentBlock.type[row2].length; col2++ ) {
            if ( currentBlock.type[row2][col2] != 0 ) {
                if ( col2 < temporary ) {
                    temporary = col2;
                }
                col2 = currentBlock.type[row2].length;
            }
        }
    }
    return temporary;
}

var findFirst2 = function( array ) {
    var temporary = 5;
    for ( var row2 = 0; row2 < array.length; row2++ ) {
        for ( var col2 = 0; col2 < array[row2].length; col2++ ) {
            if ( array[row2][col2] != 0 ) {
                if ( col2 < temporary ) {
                    temporary = col2;
                }
                col2 = array[row2].length;
            }
        }
    }
    return temporary;
}

var findLast = function() {
    var temporary = -1;
    for ( var row2 = 0; row2 < currentBlock.type.length; row2++ ) {
        for ( var col2 = currentBlock.type[row2].length; col2 > -1; col2-- ) {
            if ( currentBlock.type[row2][col2] == 1 || currentBlock.type[row2][col2] == 2 || currentBlock.type[row2][col2] == 3 ||  currentBlock.type[row2][col2] == 4 || currentBlock.type[row2][col2] == 5 || currentBlock.type[row2][col2] == 6 || currentBlock.type[row2][col2] == 7 ) {
                if ( col2 > temporary ) {
                    temporary = col2;
                }
                col2 = -1;
            }
        }
    }
    return temporary;
}

var findLast2 = function( array ) {
    var temporary = -1;
    for ( var row2 = 0; row2 < array.length; row2++ ) {
        for ( var col2 = array[row2].length; col2 > -1; col2-- ) {
            if ( array[row2][col2] != 0 ) {
                if ( col2 > temporary ) {
                    temporary = col2;
                }
                col2 = -1;
            }
        }
    }
    return temporary;
}

var findBottom = function() {
    var temporary = -1;
    for ( var row2 = currentBlock.type.length-1; row2 > -1; row2-- ) {
        if ( currentBlock.type[row2].includes(1) || currentBlock.type[row2].includes(2) || currentBlock.type[row2].includes(3) || currentBlock.type[row2].includes(4) || currentBlock.type[row2].includes(5) || currentBlock.type[row2].includes(6) || currentBlock.type[row2].includes(7)) {
            temporary = row2;
            row2 = -1;
        }
    }
    return temporary;
}

var getRandomBlock = function() {
    if ( blocks.length < 1 ) {
        blocks = [oBlock, jBlock, lBlock, iBlock, tBlock, zBlock, sBlock];
    }
    var randomNum = Math.floor(Math.random()*(blocks.length));
    var temporary = blocks[randomNum, randomNum];
    blocks.splice(randomNum, 1);
    return temporary;
}

var fallDown = function(row) {
    console.log("FALLDOWN");
    for ( var r = row; r > 0; r-- ) {
        board[r] = board[r-1];
    }
}

var checkMovement = function(r,c) {
    var ableTo = true;
    for ( var row2 = 0; row2 < currentBlock.type.length; row2++ ) {
        for ( var col2 = 0; col2 < currentBlock.type[row2].length; col2++ ) {
            if ( row2+r < 20 && col2+c < 10 ) {
                if ( board[row2+r][col2+c] != 0 && currentBlock.type[row2][col2] != 0 ) {
                    ableTo = false;
                }
            }
        }
    }
    return ableTo;
}

var checkRotation = function(tet, r,c) {
    var ableTo = true;
    for ( var row2 = 0; row2 < tet.length; row2++ ) {
        for ( var col2 = 0; col2 < tet[row2].length; col2++ ) {
            if ( row2+r < 20 && col2+c < 10 && col2+c > -1 && row2+r > -1 ) {
                if ( board[row2+r][col2+c] != 0 && tet[row2][col2] != 0 ) {
                    ableTo = false;
                }
            }
            else {
                ableTo = false;
            }
        }
    }
    return ableTo;
}

var fastDrop = function() {
    canHold = false;
    var scoring = 0;
    var temporary = false;
    for ( var row2 = 1; row2+currentBlock.x+findBottom() < 20; row2++ ) {
        if ( ! checkMovement(currentBlock.x+row2, currentBlock.y) ) {
            currentBlock.x = currentBlock.x+row2-1;
            row2 = 20;
            temporary = true;
        }
        else {
            scoring++;
        }
    }
    if ( temporary == false ) {
        currentBlock.x = 19-findBottom();
        fall();
    }
    score+=(scoring*2);
    
}

var gameOver = function() {
    level = 3;
    var hold = new Tetrimino(null,null,null,null);
}

var changeLevel = function() {
    if ( linesCleared > ((currentLevel+1)*(5) ) ) {
        currentLevel++;
    }
}

var holdBlock = function() { 
    if ( canHold ) {
        if ( hold.type == null ) {
            console.log(blockHoldTemp);
            console.log(blockHoldTemp2);
            hold = new Tetrimino(null,null,blockHoldTemp, blockHoldTemp2);
            canHold = false;
            Throw(getRandomBlock());
        }
        else {
            var temp = hold.type;
            hold = new Tetrimino(null,null,blockHoldTemp, blockHoldTemp2);
            canHold = false;
            Throw(temp);
        }
    }
}

var drawHeldBlock = function() {
    context.drawImage(stupid, 65, 90);
    context.font = "30px Arial";
    context.fillText("Hold:", 60, 70);
    if ( hold.type != null ) {
        for ( var r = 0; r < hold.type.length; r++ ) {
            for ( var c = 0; c < hold.type[r].length; c++ ) {
                if ( hold.type[r][c] != 0 ) {
                    var block = new Block(r+currentBlock.x, c+currentBlock.y, hold.type[r][c]);
                    context.drawImage(block.image, 70+((hold.x+c)*29),124+((hold.y+r)*29));
                }
            }
        }
    }
}

var nextBlock = [getRandomBlock(), getRandomBlock(), getRandomBlock()]

var next = function() {
    nextBlock.splice(0,1);
    nextBlock.push(getRandomBlock());
}



var drawNextBlock = function() {
    context.drawImage(stupid, 65, 270);
    context.fillText("Next:", 60, 250);
    
    var temp = Throw2(nextBlock[0]);
    if ( temp.type != null ) {
        for ( var r = 0; r < temp.type.length; r++ ) {
            for ( var c = 0; c < temp.type[r].length; c++ ) {
                if ( temp.type[r][c] != 0 ) {
                    var block = new Block(r, c, temp.type[r][c]);
                    context.drawImage(block.image,70+((temp.x+c)*29),189+((temp.y+r)*29));
                }
            }
        }
    }
    context.drawImage(stupid, 65, 362);
    context.drawImage(stupid, 65, 454);
    var temp2 = Throw2(nextBlock[1]);
    if ( temp2.type != null ) {
        for ( var r2 = 0; r2 < temp2.type.length; r2++ ) {
            for ( var c2 = 0; c2 < temp2.type[r2].length; c2++ ) {
                if ( temp2.type[r2][c2] != 0 ) {
                    var block2 = new Block(r2, c2, temp2.type[r2][c2]);
                    context.drawImage(block2.image,70+((temp2.x+c2)*29),280+((temp2.y+r2)*29));
                }
            }
        }
    }
    var temp3 = Throw2(nextBlock[2]);
    if ( temp3.type != null ) {
        for ( var r3 = 0; r3 < temp3.type.length; r3++ ) {
            for ( var c3 = 0; c3 < temp3.type[r3].length; c3++ ) {
                if ( temp3.type[r3][c3] != 0 ) {
                    var block3 = new Block(r3, c3, temp3.type[r3][c3]);
                    context.drawImage(block3.image,70+((temp3.x+c3)*29),372+((temp3.y+r3)*29));
                }
            }
        }
    }
}



function Throw2( block ) {
    var temp = new Tetrimino(null, null, null, null);
    if ( block === jBlock ) {
        temp = new Tetrimino(0,3,jBlock,jBlockRotations);
    }
    else if ( block === oBlock ) {
        temp = new Tetrimino(0,4,oBlock,oBlockRotations);
    }
    else if ( block === lBlock ) {
        temp = new Tetrimino(0,3,lBlock,lBlockRotations);
    }
    else if ( block === iBlock ) {
        temp = new Tetrimino(0,3,iBlock,iBlockRotations);
    }
    else if ( block === sBlock ) {
        temp = new Tetrimino(0,3,sBlock,sBlockRotations);
    }
    else if ( block === zBlock ) {
        temp = new Tetrimino(0,4,zBlock,zBlockRotations);
    }
    else if ( block === tBlock ) {
        temp = new Tetrimino(0,4,tBlock,tBlockRotations);
    }
    return temp;
}

var currentBlock = new Tetrimino(null, null, null, null );
Throw(getRandomBlock());

var drawWhereLanding = function() {
    var temporary = false;
    for ( var row2 = 1; row2+currentBlock.x+findBottom() < 20; row2++ ) {
        if ( ! checkMovement(currentBlock.x+row2, currentBlock.y) ) {
            for ( var r = 0; r < currentBlock.type.length; r++ ) {
                for ( var c = 0; c < currentBlock.type[r].length; c++ ) {
                    if ( currentBlock.type[r][c] != 0 ) {
                        var block = new Block(r+row2+currentBlock.x, c+currentBlock.y, null);
                        context.drawImage(clearImg, 305+(block.x*29), 10+((block.y-1)*29));
                    }
                }
            }
            row2 = 20;
            temporary = true;
        }
    }
    if ( temporary == false ) {
        for ( var r = 0; r < currentBlock.type.length; r++ ) {
                for ( var c = 0; c < currentBlock.type[r].length; c++ ) {
                    if ( currentBlock.type[r][c] != 0 ) {
                        var block = new Block(r+(20-findBottom()), c+currentBlock.y, null);
                        context.drawImage(clearImg, 305+(block.x*29), 10+((block.y-1)*29));
                    }
                }
        }
    }
}

var noGlitchPlz = function(cleared) {
    if ( cleared == 1 ) {
        board[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    else if ( cleared == 2 ) {
        board[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    else if ( cleared == 3 ) {
        board[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    else if ( cleared == 4 ) {
        board[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}


function Animation(image, frames, x, y, w, h, currentFrame, wait, waitNum, size ) {
    this.image = image;
    this.frames = frames;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.currentFrame = currentFrame;
    this.wait = wait;
    this.waitNum = wait;
    this.size = size;
}

Animation.prototype.renderFrame = function() {
    if ( this.waitNum > this.wait ) {
        this.waitNum = 0;
        this.currentFrame++;
    }
    context.drawImage(this.image, this.w*this.currentFrame, 0, this.w,this.h, this.x, this.y, this.w*this.size, this.h*this.size);
    if ( this.currentFrame > this.frames ) {
        animationArray.splice(animationArray.indexOf(this), 1);
        return;
    }
    this.waitNum++;
}

function animateQueue() {
    for ( var i = 0; i < animationArray.length; i++ ) {
        animationArray[i].renderFrame();
    }
}
function renderTitle() {
    var titleScreen = new Image();
    titleScreen.src = "https://i.imgur.com/PNb31lg.png";
    context.drawImage(titleScreen, 0, 0);
    
}

function renderGameOver() {
    context.fillStyle = "#000000"
    context.fillRect(300, 150, 300, 300)
    context.fillStyle = "#FFFFFF";
    context.fillText("GAME OVER :(", 310, 200);
    context.fillText("Score:", 310, 260);
    context.fillText(score, 400, 260);
    if ( flash > 29 ) {
        context.fillText("Press R to Restart!!", 310, 400)
    }
    if ( flash > 59 ) {
        flash = 0;
    }
    flash++;
}
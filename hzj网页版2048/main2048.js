/**
 * Created by dokac on 2017/5/4.hzj
 */
var board = [];
var hasConflicted = [];
var score = 0;

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;
$(document).ready(function () {
    prepareForMobile();
    newgame();
});
function prepareForMobile() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }
    $('#grid-container').css('width', gridContainerWidth);
    $('#grid-container').css('height', gridContainerWidth);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('boder-radius', 0.02 * cellSideLength);
}
function newgame() {
    //初始化棋盘格
    init();
    //在随机的两个格子里生成数字
    generateOneNumber();
    generateOneNumber();
}
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicted[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
    updateScore(score);
}
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.3 * cellSideLength + 'px');
}
function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 15) {
        if (board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 15) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
    }
    //随机一个数
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}
$(document).keydown(function (event) {
    if (event.keyCode == 38 || event.keyCode == 40) {
        event.preventDefault();
    }
    switch (event.keyCode) {
        case 37:
            if (moveLeft()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
            break;
        case 38:
            if (moveUp()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
            break;
        case 39:
            if (moveRight()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
            break;
        case 40:
            if (moveDown()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
            break;
        default:
            break;
    }
});
document.addEventListener('touchstart', function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
document.addEventListener('touchmove', function (event) {
    event.preventDefault();
});
document.addEventListener('touchend', function (event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;
    if(Math.abs(deltax)<documentWidth*0.2&&Math.abs(deltay)<documentWidth*0.2){
        return;
    }
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if (deltax>0){
            if (moveRight()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
        }else {
            if (moveLeft()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
        }
    }else {
        if(deltay>0){
            if (moveDown()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
        }else {
            if (moveUp()) {
                setTimeout(generateOneNumber, 200);
                setTimeout(isgameover, 260);
            }
        }
    }
});
function isgameover() {
    if (nospace(board) && nomove()) {
        gameOver();
    }
}
function gameOver() {
    alert('gameOver');
}
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][j] == board[i][k] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout(updateBoardView, 200);
    return true;
}
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    //moveUp
    for (var i = 1; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout(updateBoardView, 200);
    return true;
}
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][j] == board[i][k] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout(updateBoardView, 200);
    return true;
}
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    //moveDown
    for (var i = 2; i >= 0; i--)
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout(updateBoardView, 200);
    return true;
}

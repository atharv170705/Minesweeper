document.addEventListener("DOMContentLoaded", () => {
    let board = [];
    let rows = 8;
    let cols = 8;
    let minesCount = 10;
    let flagEnabeled = false;
    let gameOver = false;

    const gameBoard = document.getElementById("board");
    const minesCountDisplay = document.getElementById("mines-count");
    const gameStatus = document.getElementById("status");

    initializeBoard();
    placeMines();
    countNeighbours();
    renderBoard();


    function initializeBoard() {
        for(let i = 0; i < rows; i++) {
            board[i] = [];
            for(let j = 0; j < cols; j++) {
                board[i][j] = {
                    isMine : false,
                    isRevealed : false,
                    isFlagged : false,
                    count : 0
                };
            }
        }
    }

    function placeMines() {
        let mines = 0;
        while(mines < minesCount) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);

            if(!board[r][c].isMine) {
                board[r][c].isMine = true;
                mines++;
            }
        }
        minesCountDisplay.textContent = minesCount;
    }

    function countNeighbours() {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                if(!board[i][j].isMine) {
                    for(let x = -1; x <= 1; x++) {
                        for(let y = -1; y <= 1; y++) {
                            let newR = i + x;
                            let newC = j + y;
                            if(newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                                if (board[newR][newC].isMine) {
                                    board[i][j].count++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function renderBoard() {
        gameBoard.innerHTML = "";
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("id", `cell-${i}-${j}`);

                if(board[i][j].isRevealed) {
                    cell.classList.add("cell-revealed");
                    if(board[i][j].isMine) {
                        cell.classList.add("mine");
                        cell.textContent = "💣";
                    }
                    else if (board[i][j].count > 0) {
                        cell.textContent = board[i][j].count;
                        cell.classList.add(`x${board[i][j].count}`);
                    }
                }
                else if (board[i][j].isFlagged) {
                    cell.textContent = "🚩";
                }

                cell.addEventListener("click", () => {
                    if(gameOver) {
                        return;
                    }
                    revealCell(i, j);
                    renderBoard();
                });
                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if(gameOver || board[i][j].isRevealed) {
                        return;
                    }
                    board[i][j].isFlagged = !board[i][j].isFlagged;
                    renderBoard();
                    checkWin()
                });

                gameBoard.appendChild(cell);
            }
        }
    }

    function revealCell(i, j) {
        if(i < 0 || i >= rows || j < 0 || j >= cols) {
            return;
        }
        if(board[i][j].isRevealed || board[i][j].isFlagged) {
            return ;
        }

        if(flagEnabeled) {
            board[i][j].isFlagged = !board[i][j].isFlagged;
            renderBoard();
            return;
        }
        board[i][j].isRevealed = true;

        if(board[i][j].isMine) {
            gameOver = true;
            revealAllMines();
            renderBoard();
            gameStatus.textContent = "Game Over"
            gameStatus.classList.remove("hidden");
            return;
        }
        checkWin();
        if(board[i][j].count > 0) {
            return;
        }
        for(let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                let newR = i + x;
                let newC = j + y;
                if(newR >= 0 && newR < rows && newC >= 0 && newC < cols && !board[newR][newC].isRevealed) {
                    revealCell(newR, newC);
                }
            }
        }
    }
    function revealAllMines() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j].isMine) {
                    board[i][j].isRevealed = true;
                }
            }
        }
        renderBoard();
    }


    function checkWin() {
        let correctlyFlagged = 0;
        let revealedTiles = 0;
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = board[i][j];
                if (cell.isMine && cell.isFlagged) {
                    correctlyFlagged++;
                }
                if (!cell.isMine && cell.isRevealed) {
                    revealedTiles++;
                }
            }
        }
    
        if (correctlyFlagged === minesCount && revealedTiles === (rows * cols - minesCount)) {
            gameOver = true;
            gameStatus.textContent = "You Win"
            gameStatus.classList.remove("hidden");
        }
    }
    
});
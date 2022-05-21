document.addEventListener('DOMContentLoaded', (e) => {
    let elements = {
        desk: document.querySelector('.desk'),
        game: document.querySelector('.game'),
        wallContainer: document.querySelector('.walls'),
        ball: document.querySelector('.ball'),
        walls: [],
        topWall: document.querySelector('.top-wall'),
        leftWall: document.querySelector('.left-wall'),
        rightWall: document.querySelector('.right-wall'),
        bottomWall: document.querySelector('.bottom-wall'),
        score: document.querySelector('.score'),
        gameOverText: document.querySelector('.over')
    }
    let styleRoot = document.querySelector(':root')
    let gameWidth = document.querySelector('.game').getBoundingClientRect().width
    let gameHeight = document.querySelector('.game').getBoundingClientRect().height
    let updateEnable = true
    let stepBreak = true;
    let score = 0;
    let wallLength = 40
    let ballPhisics = {
        x: getStyleProperty('--ballLeft'),
        y: getStyleProperty('--ballTop'),
        w: elements.ball.getBoundingClientRect().width,
        h: elements.ball.getBoundingClientRect().height,
        vx: 3,
        vy: 3,
        speed: 1.5
    }
    defData()
    mouseMovement()
    requestAnimationFrame(update);

    // Game Loop!
    function update() {
        if (!updateEnable) {
            return
        }
        checkGameIsOver()
        ballCatchDesk()
        requestAnimationFrame(update);
    }

    // Function expression
    function defData() {
        createWalls()
        setStyleProperty('--deskLeft', `${(gameWidth / 2) - (elements.desk.getBoundingClientRect().width / 2)}px`)
        setStyleProperty('--deskTop', `${gameHeight - 20}px`)
        setStyleProperty('--ballLeft', `${(gameWidth / 2) - (elements.ball.getBoundingClientRect().width / 2)}px`)
        setStyleProperty('--ballTop', `${gameHeight - 70}px`)
    }
    function setStyleProperty(variable, value) {
        styleRoot.style.setProperty(variable, value)
    }
    function getStyleProperty(variable) {
        return parseFloat(getComputedStyle(styleRoot).getPropertyValue(variable))
    }
    function mouseMovement() {
        // Controll desk
            elements.game.addEventListener('mousemove', (e) => {
                if (!updateEnable) {return}
                setStyleProperty('--deskLeft', `${e.offsetX - (elements.desk.getBoundingClientRect().width / 2)}px`)
            })
    }
    function createWalls() {
        // Create Walls in grid
        for (let i = 0; i < wallLength; i++) {
            let elem = document.createElement('div')
            elem.classList.add('wall')
            elem.setAttribute('data', i)
            elements.walls.push(elem)
            elements.wallContainer.appendChild(elem)
        }
    }
    function crashWall(id) {
        // When wall is crash
        elements.walls.forEach((item) => {
            if (parseInt(item.getAttribute('data')) == id) {
                if (item.classList.contains('disable')) {return}
                item.classList.add('disable')
                if (score % 5 === 0) {
                    ballPhisics.speed = ballPhisics.speed + 1
                    ballPhisics.vx = ballPhisics.speed 
                    ballPhisics.vy = ballPhisics.speed 
                }
                score++
                elements.score.textContent = `Score ${score}`
                ballPhisics.direction++
                stepBreak = false
                ballPhisics.vx *= 1
                ballPhisics.vy *= -1
                if (score === elements.walls.length) {
                    gameWin()
                }
            }
        })
    }
    function checkGameIsOver() {
        if (collision(elements.ball.getBoundingClientRect(), elements.bottomWall.getBoundingClientRect())) {
            gameOver()
        }
    }
    function ballCatchDesk() {
        // All collision detection events here
        elements.walls.forEach((item) => {
            if (collision(elements.ball.getBoundingClientRect(), item.getBoundingClientRect())) {
                crashWall(parseInt(item.getAttribute('data')))
            }
        })
        if (collision(elements.desk.getBoundingClientRect(), elements.ball.getBoundingClientRect()) 
        || collision(elements.topWall.getBoundingClientRect(), elements.ball.getBoundingClientRect()) 
        || collision(elements.leftWall.getBoundingClientRect(), elements.ball.getBoundingClientRect()) 
        || collision(elements.rightWall.getBoundingClientRect(), elements.ball.getBoundingClientRect())) {
            if (collision(elements.topWall.getBoundingClientRect(), elements.ball.getBoundingClientRect())) {
                ballPhisics.vx *= 1
                ballPhisics.vy *= -1
            } else if (collision(elements.leftWall.getBoundingClientRect(), elements.ball.getBoundingClientRect())) {
                ballPhisics.vx *= -1
                ballPhisics.vy *= 1
            } 
            else if (collision(elements.desk.getBoundingClientRect(), elements.ball.getBoundingClientRect())) {
                let rand = getRandomNumber()
                if (rand == 1) {
                    ballPhisics.vx *= -1
                    ballPhisics.vy *= -1
                } else {
                    ballPhisics.vx *= 1
                    ballPhisics.vy *= -1
                }
            } else if (collision(elements.rightWall.getBoundingClientRect(), elements.ball.getBoundingClientRect())) {
                ballPhisics.vx *= -1
                ballPhisics.vy *= 1
            }
            else {
                ballPhisics.vx *= -1
                ballPhisics.vy *= -1
            }
    } else {

    }
    setStyleProperty('--ballLeft', `${ballPhisics.x += ballPhisics.vx}px`)
    setStyleProperty('--ballTop', `${ballPhisics.y -= ballPhisics.vy}px`)
}
    function collision(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
            return true
        } else {
            return false
        }
    }
    function gameOver() {
        updateEnable = false
        elements.gameOverText.textContent = 'Game Over'
        elements.gameOverText.style.display = 'block'
    }
    function gameWin() {
        updateEnable = false
        elements.gameOverText.textContent = 'You Win'
        elements.gameOverText.style.display = 'block'
    }
    function getRandomNumber() {
        return Math.floor(Math.random() * 2)
    }
})
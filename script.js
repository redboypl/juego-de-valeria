let score = 0;
let streak = 0;
let currentQuestion = {};
let timer;
let timeLeft = 10;
let currentQuestionNumber = 0;
const maxQuestions = 10;
const questionEl = document.getElementById('question');
const questionCounterEl = document.getElementById('question-counter');
const optionsEl = document.getElementById('options');
const optionButtons = document.querySelectorAll('.option');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const timerFillEl = document.getElementById('timer-fill');
const bodyEl = document.body;
const endScreenEl = document.getElementById('end-screen');
const endMessageEl = document.getElementById('end-message');
const restartEl = document.getElementById('restart');

function generateQuestion() {
    currentQuestionNumber++;
    if (currentQuestionNumber > maxQuestions) {
        showEndScreen('¡Felicidades! Has completado el juego con éxito.', true);
        return;
    }
    questionCounterEl.textContent = `Pregunta ${currentQuestionNumber}/${maxQuestions}`;
    clearInterval(timer);
    timeLeft = 10;
    timerFillEl.style.width = '100%';
    const ratios = ['sin', 'cos', 'tan'];
    const ratio = ratios[Math.floor(Math.random() * ratios.length)];
    const angles = [30, 45, 60];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const rad = angle * Math.PI / 180;
    let correctAnswer;
    switch (ratio) {
        case 'sin':
            correctAnswer = Math.sin(rad);
            break;
        case 'cos':
            correctAnswer = Math.cos(rad);
            break;
        case 'tan':
            correctAnswer = Math.tan(rad);
            break;
    }
    correctAnswer = Math.round(correctAnswer * 1000) / 1000;
    currentQuestion = { ratio, angle, correctAnswer };

    // Generate wrong answers
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
        let wrong = Math.round((correctAnswer + (Math.random() - 0.5) * 1.5) * 1000) / 1000;
        if (wrong !== correctAnswer && wrong >= 0 && wrong <= 2 && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
        }
    }

    const options = [correctAnswer, ...wrongAnswers];
    shuffleArray(options);

    optionButtons.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.dataset.value = options[index];
        btn.classList.remove('correct', 'wrong', 'disabled');
        btn.style.pointerEvents = 'auto';
    });

    questionEl.textContent = `¿Cuál es ${ratio}(${angle}°)?`;
    questionEl.style.animation = 'none';
    setTimeout(() => questionEl.style.animation = 'fadeIn 0.5s', 10);
    startTimer();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft -= 0.1;
        timerFillEl.style.width = (timeLeft / 10) * 100 + '%';
        if (timeLeft <= 0) {
            clearInterval(timer);
            showEndScreen('¡Tiempo agotado! Has perdido el juego.', false);
        }
    }, 100);
}

function showFeedback(message, color, isCorrect) {
    feedbackEl.textContent = message;
    feedbackEl.style.color = color;
    feedbackEl.style.animation = 'none';
    setTimeout(() => feedbackEl.style.animation = 'fadeIn 0.5s', 10);
    if (!isCorrect) {
        document.getElementById('game-container').classList.add('shake');
        bodyEl.classList.add('wrong-bg');
        setTimeout(() => {
            document.getElementById('game-container').classList.remove('shake');
            bodyEl.classList.remove('wrong-bg');
        }, 500);
    } else {
        bodyEl.classList.add('correct-bg');
        setTimeout(() => bodyEl.classList.remove('correct-bg'), 1000);
    }
    setTimeout(generateQuestion, 2000);
}

function highlightCorrect() {
    optionButtons.forEach(btn => {
        if (parseFloat(btn.dataset.value) === currentQuestion.correctAnswer) {
            btn.classList.add('correct');
        }
        btn.classList.add('disabled');
        btn.style.pointerEvents = 'none';
    });
}

function showEndScreen(message, isWin) {
    endMessageEl.textContent = message;
    endScreenEl.classList.remove('hidden');
}

function restartGame() {
    score = 0;
    streak = 0;
    currentQuestionNumber = 0;
    scoreEl.textContent = `Puntuación: 0`;
    streakEl.textContent = `Racha: 0`;
    endScreenEl.classList.add('hidden');
    generateQuestion();
}

restartEl.addEventListener('click', restartGame);

function checkAnswer(selectedValue) {
    clearInterval(timer);
    const isCorrect = parseFloat(selectedValue) === currentQuestion.correctAnswer;
    if (isCorrect) {
        showFeedback('¡Correcto!', 'green', true);
        score++;
        streak++;
        setTimeout(generateQuestion, 2000);
    } else {
        showEndScreen('¡Incorrecto! Has perdido el juego.', false);
    }
    scoreEl.textContent = `Puntuación: ${score}`;
    streakEl.textContent = `Racha: ${streak}`;
    highlightCorrect();
}

optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        checkAnswer(btn.dataset.value);
    });
});

generateQuestion();
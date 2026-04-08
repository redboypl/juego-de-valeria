let score = 0;
let streak = 0;
let currentQuestion = {};
let timer;
let timeLeft = 10;
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const submitEl = document.getElementById('submit');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const timerFillEl = document.getElementById('timer-fill');
const bodyEl = document.body;

function generateQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    timerFillEl.style.width = '100%';
    const ratios = ['sin', 'cos', 'tan'];
    const ratio = ratios[Math.floor(Math.random() * ratios.length)];
    const angle = Math.floor(Math.random() * 90) + 1;
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
    correctAnswer = Math.round(correctAnswer * 100) / 100;
    currentQuestion = { ratio, angle, correctAnswer };
    questionEl.textContent = `¿Cuál es ${ratio}(${angle}°)?`;
    questionEl.style.animation = 'none';
    setTimeout(() => questionEl.style.animation = 'fadeIn 0.5s', 10);
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft -= 0.1;
        timerFillEl.style.width = (timeLeft / 10) * 100 + '%';
        if (timeLeft <= 0) {
            clearInterval(timer);
            showFeedback(`¡Tiempo agotado! La respuesta correcta es ${currentQuestion.correctAnswer}`, 'red', false);
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

function checkAnswer() {
    clearInterval(timer);
    const userAnswer = parseFloat(answerEl.value);
    if (Math.abs(userAnswer - currentQuestion.correctAnswer) < 0.01) {
        showFeedback('¡Correcto!', 'green', true);
        score++;
        streak++;
    } else {
        showFeedback(`¡Incorrecto! La respuesta correcta es ${currentQuestion.correctAnswer}`, 'red', false);
        streak = 0;
    }
    scoreEl.textContent = `Puntuación: ${score}`;
    streakEl.textContent = `Racha: ${streak}`;
    answerEl.value = '';
}

submitEl.addEventListener('click', checkAnswer);
answerEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

generateQuestion();
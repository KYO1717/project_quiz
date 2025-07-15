const quizDataOriginal = [
  {
    type: "ox",
    question: "원핵생물은 막으로 둘러싸인 핵이 있다.",
    correct: "X"
  },
  {
    type: "ox",
    question: "세균의 분열법은 유전적 다양성이 낮다.",
    correct: "O"
  },
  {
    type: "ox",
    question: "바이러스의 병원체는 보통 세포 밖에서 증식한다.",
    correct: "X"
  },
  {
    type: "ox",
    question: "세균은 체액성 면역이 중심이다.",
    correct: "O"
  },
  {
    type: "ox",
    question: "세균의 분열법은 무성생식이다.",
    correct: "O"
  },
  {
    type: "ox",
    question: "바이러스는 혼자 증식 가능하다.",
    correct: "X"
  },
  {
    type: "ox",
    question: "바이러스는 DNA, RNA 모두를 동시에 보유할 수 있다.",
    correct: "O"
  },
  {
    type: "ox",
    question: "세균은 항생제로 치료할 수 있다.",
    correct: "O"
  },
  {
    type: "ox",
    question: "세균의 분열법은 유전적 다양성이 높다.",
    correct: "X"
  },
  {
    type: "ox",
    question: "비특이적 면역은 태어날 때부터 가지는 면역 반응이다.",
    correct: "O"
  }
];

// Fisher-Yates 셔플로 문제 랜덤 섞기
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const quizData = shuffleArray(quizDataOriginal);

const quiz = document.getElementById("quiz");
const buttonsDiv = document.getElementById("buttons");
const result = document.getElementById("result");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const studentInfoInput = document.getElementById("student-info");
const timer = document.getElementById("timer");
const scoreIndicator = document.getElementById("score-indicator"); // 진행 상황 영역

let currentQuiz = 0;
let score = 0;
let countdown;
let totalTime = 60;
let selectedButton = null;
let studentId;
let studentName;

startButton.onclick = () => {
  const studentInfo = studentInfoInput.value.trim().replace(/\s+/g, '');
  const inputRegex = /^(\d{5})([가-힣]+)$/;
  const match = studentInfo.match(inputRegex);

  if (match) {
    studentId = match[1];
    studentName = match[2];
    startScreen.style.display = "none";
    startTimer(totalTime);
    loadQuiz();
  } else {
    alert("학번은 5자리 숫자, 이름은 한글로 입력해야 합니다 (예: 10101홍길동)");
  }
};

function loadQuiz() {
  const currentQuizData = quizData[currentQuiz];
  document.getElementById("question").innerHTML = `<h2>${currentQuizData.question}</h2>`;
  scoreIndicator.textContent = `맞힌 개수: ${score / 100} / ${quizData.length}`; // 진행 상황 표시

  buttonsDiv.innerHTML = "";
  selectedButton = null;
  buttonsDiv.style.display = "grid";

  const buttonO = document.createElement("button");
  buttonO.textContent = "O";
  buttonO.style.padding = "10px 20px";
  buttonO.onclick = () => handleOXClick(buttonO, "O");
  buttonsDiv.appendChild(buttonO);

  const buttonX = document.createElement("button");
  buttonX.textContent = "X";
  buttonX.style.padding = "10px 20px";
  buttonX.onclick = () => handleOXClick(buttonX, "X");
  buttonsDiv.appendChild(buttonX);

  quiz.style.display = "block";
  buttonsDiv.style.display = "block";
}

function startTimer(duration) {
  let timeLeft = duration;
  timer.style.display = "block";
  timer.textContent = `남은 시간: ${timeLeft}초`;

  countdown = setInterval(() => {
    timeLeft--;
    timer.textContent = `남은 시간: ${timeLeft}초`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      showResults();
    }
  }, 1000);
}

function handleOXClick(button, answer) {
  if (selectedButton) {
    selectedButton.style.backgroundColor = "";
  }

  button.style.backgroundColor = "#45a049"; // 초록색으로 변경
  selectedButton = button;

  setTimeout(() => {
    checkOXAnswer(answer);
  }, 200); // 0.2초 후 다음 문제로 넘어감
}

function checkOXAnswer(selectedAnswer) {
  const correctAnswer = quizData[currentQuiz].correct;

  if (selectedAnswer === correctAnswer) {
    score += 100;
  }

  currentQuiz++;

  if (currentQuiz < quizData.length) {
    loadQuiz();
  } else {
    showResults();
  }
}

function showResults() {
  clearInterval(countdown);
  quiz.innerHTML = `<h2>${studentId} ${studentName}님</h2><h2>총 ${quizData.length}문제 중 ${score / 100}문제 정답!</h2>`;
  buttonsDiv.innerHTML = "";
  result.innerHTML = `
    <h3>최종 점수: ${score}점</h3>
    <p style="color: blue; font-weight: bold; text-decoration: underline;">
      <a href="https://naver.me/GypwZVfb" target="_blank" style="color: blue; text-decoration: underline;">
        점수 스크린샷 후 설문조사에 참여해주세요!
      </a>
    </p>
  `;
  result.style.display = "block";

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });

}

let questions = new Array();
let currentQuestion = 0;
let correctAnswers = 0;

function fetchQuestions() {
  location.hash = "loader";
  fetch(
    "https://opentdb.com/api.php?amount=20&category=12&difficulty=easy&type=multiple"
  )
    .then((res) => {
      return res.json();
    })
    .then((loadedQuestions) => {
      questions = loadedQuestions.results.map((question) => {
        const q = {
          formattedQuestion: question.question,
          correctAnswer: question.correct_answer,
          answers: [question.correct_answer, ...question.incorrect_answers],
        };
        return q;
      });
    })
    .catch((err) => {
      console.error(err);
    });

  location.hash = "home";
}

function startQuiz() {
  location.hash = "question";
  setQuestion();
}

function startQuizOver() {
  currentQuestion = 0;
  correctAnswers = 0;
  fetchQuestions();
  location.hash = "home";
}

function setQuestion() {
  const question = questions[currentQuestion];
  location.hash = "question-" + currentQuestion;

  const questionMarkup =
    `<h1>${question.formattedQuestion}</h1>` +
    question.answers.map(
      (x) =>
        `<button class="btn btn-danger mx-2 my-2 c8 fw-bolder" onclick="answerQuestion(event)" value="${x}">${x}</button>`
    );

  document.getElementById("question-and-answers").innerHTML = questionMarkup;
}

function answerQuestion(e) {
  const answer = e.target.value;
  const question = questions[currentQuestion];

  if (answer == question.correctAnswer) {
    correctAnswers++;
  }

  if (currentQuestion == 19) {
    location.hash = "quiz-finished";
    return;
  }

  currentQuestion++;

  document.getElementById(
    "completed"
  ).innerHTML = `Completed ${currentQuestion}/20`;

  setQuestion();
}

function quizFinished() {
  document.getElementById(
    "correct-answers"
  ).innerHTML = `Total correct answered ${correctAnswers}/20`;
  currentQuestion = 0;
  correctAnswers = 0;
  location.hash = "quiz-finished";
}

window.addEventListener("hashchange", (e) => {
  if (location.hash == "#home") {
    document.getElementById("start-quiz").style.display = "block";
    document.getElementById("loader").style.display = "none";
    document.getElementById("question-window").style.display = "none";
    document.getElementById("quiz-finished").style.display = "none";
  }

  if (location.hash == "#quiz-finished") {
    document.getElementById("start-quiz").style.display = "none";
    document.getElementById("loader").style.display = "none";
    document.getElementById("question-window").style.display = "none";
    document.getElementById("quiz-finished").style.display = "block";
    quizFinished();
  }

  if (location.hash.includes("#question")) {
    document.getElementById("start-quiz").style.display = "none";
    document.getElementById("loader").style.display = "none";
    document.getElementById("question-window").style.display = "block";
    document.getElementById("quiz-finished").style.display = "none";
  }

  if (location.hash == "#loader") {
    document.getElementById("start-quiz").style.display = "none";
    document.getElementById("loader").style.display = "block";
    document.getElementById("question-window").style.display = "none";
    document.getElementById("quiz-finished").style.display = "none";
  }
});

fetchQuestions();
location.hash = "home";

let questionsArray = [];
let currentQuestionIndex = 0;
let score = 0;
const question = document.getElementById("question");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const apiUrl =
  "https://opentdb.com/api.php?amount=10&category=27&difficulty=medium&type=multiple";

//Fetch the quiz data from the api
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    //Store the fetched api data in a global variable
    questionsArray = data.results;
    loadQuestion();
  } catch (error) {
    console.error("Error in fetchData: ", error);
    throw error;
  }
}

// To shuffle the array using Fisher-Yates algorithm so the correct answers will be randomly assigned
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//Function to load each question and set the answer to random options
function loadQuestion() {
  if (currentQuestionIndex < questionsArray.length) {
    const questionData = questionsArray[currentQuestionIndex];
    const questionText = questionData.question;
    const correctOption = questionData.correct_answer;
    const incorrectOptionsArray = questionData.incorrect_answers;

    let allOptions = [...incorrectOptionsArray, correctOption];
    const randomAllOptions = shuffleArray(allOptions);

    question.innerHTML = questionText;
    option1.innerHTML = randomAllOptions[0];
    option2.innerHTML = randomAllOptions[1];
    option3.innerHTML = randomAllOptions[2];
    option4.innerHTML = randomAllOptions[3];

    handleOptionClick(correctOption);
  }
}

//To compare users' options with correct answer and track the score
function handleOptionClick(correctOption) {
  const optionButtons = document.querySelectorAll(".option-btn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const buttonText = button.textContent;

      // Remove the classes before applying new ones
      button.classList.remove("correct", "wrong");

      if (buttonText === correctOption) {
        score += 1;
        scoreDisplay.textContent = `Score: ${score}/10`;
        feedback.innerHTML = "Correct!";
        button.classList.add("correct");
      } else {
        feedback.innerHTML = `Wrong! The correct answer is ${correctOption}.`;
        button.classList.add("wrong");
      }
      optionButtons.forEach((button) => {
        button.disabled = true;
      });
      //Enable the next button only after users click an option
      nextBtn.disabled = false;
    });
  });
}

//When users click the 'next' button, a new qestion will be loaded
function renderNextQuestion() {
  nextBtn.disabled = true;

  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questionsArray.length - 1) {
      currentQuestionIndex += 1;
      loadQuestion();
      resetButtons();
    } else {
      resultsDisplay();
    }
  });
}

//Make each question start with all option buttons enabled and remove the previous feedback text and classes
function resetButtons() {
  const optionButtons = document.querySelectorAll(".option-btn");
  optionButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
  nextBtn.disabled = true;
  feedback.innerHTML = "";
}

//After 10 questions, show the score results to users and the restart button
function resultsDisplay() {
  const questionsContainer = document.querySelector(".questions-container");
  const answersContainer = document.querySelector(".answers-container");
  questionsContainer.classList.add("hidden");
  answersContainer.classList.add("hidden");
  nextBtn.classList.add("hidden");
  feedback.innerHTML = `Quiz finished! Your final score is  ${score}.`;

  restartBtn.style.display = "block";
}

function restartQuiz() {
//Reset variables and UI elements
  score = 0;
  currentQuestionIndex = 0;
  questionsArray = [];
  scoreDisplay.textContent = `Score: ${score}/10`;
  feedback.innerHTML = "";
  restartBtn.style.display = "none";

  resetButtons();

//Show the questions and answers containers,and the next button
  const questionsContainer = document.querySelector(".questions-container");
  const answersContainer = document.querySelector(".answers-container");
  questionsContainer.classList.remove("hidden");
  answersContainer.classList.remove("hidden");
  nextBtn.classList.remove("hidden");

  fetchData();
}

restartBtn.addEventListener("click", restartQuiz);

//Initialize the game
fetchData();
renderNextQuestion();

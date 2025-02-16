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

// either use the string directly in the fetch call or store it in a variable, best practice to store a url is in capital letters
const API_URL =
  "https://opentdb.com/api.php?amount=10&category=27&difficulty=medium&type=multiple";

//Fetch the quiz data from the api
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    //Store the fetched api data in a global variable
    questionsArray = data.results;
    loadQuestion();
  } catch (error) {
    console.error("Error in fetchData: ", error);
    // this will propagate the error, which means you need to handle a rejected promise where fetchData is called
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
    // simplify the code by destructuring the object, rename question variable since it already exists
    const {
      question: questionText,
      correct_answer,
      incorrect_answers,
    } = questionsArray[currentQuestionIndex];

    // shuffle array of options and save directly to a variable
    const allOptions = shuffleArray([...incorrect_answers, correct_answer]);

    // textContent is better than innerHTML for security reasons
    question.textContent = questionText;
    // use an array to loop through the options for readability
    [option1, option2, option3, option4].forEach((option, index) => {
      option.textContent = allOptions[index];
    });

    handleOptionClick(correct_answer);
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
        // can increment the score directly
        score++;
        scoreDisplay.textContent = `Score: ${score}/10`;
        // textContent is better than innerHTML for security reasons
        feedback.textContent = "Correct!";
        button.classList.add("correct");
      } else {
        // textContent is better than innerHTML for security reasons
        feedback.textContent = `Wrong! The correct answer is ${correctOption}.`;
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
    // can be simplified for readability with ternary operator and refactored
    currentQuestionIndex < questionsArray.length - 1
      ? // increments the currenctQuestionIndex and then calls the loadQuestion function with the new value
        loadQuestion(++currentQuestionIndex)
      : resultsDisplay();
    resetButtons();
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
  // textContent is better than innerHTML for security reasons
  feedback.textContent = "";
}

//After 10 questions, show the score results to users and the restart button
function resultsDisplay() {
  // can be simplified with
  document.querySelector(".questions-container").classList.add("hidden");
  document.querySelector(".answers-container").classList.add("hidden");
  nextBtn.classList.add("hidden");
  // textContent is better than innerHTML for security reasons
  feedback.textContent = `Quiz finished! Your final score is  ${score}.`;
  restartBtn.style.display = "block";
}

function restartQuiz() {
  //Reset variables and UI elements
  score = 0;
  currentQuestionIndex = 0;
  questionsArray = [];
  scoreDisplay.textContent = `Score: ${score}/10`;
  // textContent is better than innerHTML for security reasons
  feedback.textContent = "";
  restartBtn.style.display = "none";

  resetButtons();

  //Show the questions and answers containers,and the next button
  // can be simplified with
  document.querySelector(".questions-container").classList.remove("hidden");
  document.querySelector(".answers-container").classList.remove("hidden");
  nextBtn.classList.remove("hidden");

  fetchData();
}

restartBtn.addEventListener("click", restartQuiz);

//Initialize the game
fetchData();
renderNextQuestion();

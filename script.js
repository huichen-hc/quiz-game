const question = document.getElementById("question");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");
const nextBtn = document.getElementById("next-btn");

const apiUrl =
  "https://opentdb.com/api.php?amount=10&category=27&difficulty=medium&type=multiple";

let currentQuestionIndex = 0;
let score = 0;
let correctOption = "";
let incorrectOptionsArray = [];

//Fetch the quiz data from the api
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
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
async function loadQuestions() {
  try {
    const quizData = await fetchData();
    const quizDataArray = quizData.results;
    const questionText = quizDataArray[currentQuestionIndex].question;
    correctOption = quizDataArray[currentQuestionIndex].correct_answer;
    incorrectOptionsArray =
      quizDataArray[currentQuestionIndex].incorrect_answers;

    let allTheOptionsArray = [...incorrectOptionsArray, correctOption];
    const randomAllTheOptionsArray = shuffleArray(allTheOptionsArray);
    console.log(randomAllTheOptionsArray);

    question.innerHTML = questionText;
    option1.innerHTML = randomAllTheOptionsArray[0];
    option2.innerHTML = randomAllTheOptionsArray[1];
    option3.innerHTML = randomAllTheOptionsArray[2];
    option4.innerHTML = randomAllTheOptionsArray[3];

  } catch (error) {
    console.error("Error loading questions: ", error);
  }
}

//To compare users' options with correct answer and track the score
function handleOptionClick() {
  const optionButtons = document.querySelectorAll(".option-btn");
  optionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const buttonText = button.textContent;
      if (!incorrectOptionsArray.includes(buttonText)) {
        score += 1;
      }
      optionButtons.forEach((button) => {
        button.disabled = true; 
      });
    });
  });
}

//When users click the 'next' button, a new qestion will be loaded and show the final score 
function renderNextQuestion() {
  nextBtn.addEventListener("click",() => {
    if (currentQuestionIndex < 9){
      currentQuestionIndex += 1;
      loadQuestions();
    } else {
      alert ("Quiz finished! Your final score is: " + score);
    }
  });
}

loadQuestions();
handleOptionClick();
renderNextQuestion();




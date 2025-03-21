// LOADING ...
const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("words-container").classList.add("hidden");
  };
  const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("words-container").classList.remove("hidden");
  };


//   Smooth scroll
document.querySelector("#lessons-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default anchor jump
    document.querySelector("#Lessons").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#faq-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default anchor jump
    document.querySelector("#FAQ").scrollIntoView({ behavior: "smooth" });
});


// Verify log in 

document
  .getElementById("btn-submit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    verify();
  });

function verify() {
  const name = document.getElementById("hero-name").value.trim();
  const password = document.getElementById("hero-password").value.trim();

  if (name === "" || password === "") {
    alert("Please fill the name and password .");
    return false;
  }

  if (password === "123456") {
    
    HandleShowCards();
    Swal.fire({
      title: "অভিনন্দন",
      text: "চলো আজ নতুন কিছু শিখি",
      icon: "success",
      draggable: true
    });
  } else {
    alert("Incorrect password.Please Contact with admin");
    return false;
  }
}

// Show Cards

function HandleShowCards() {
    document.getElementById("header").classList.remove("hidden");
    document.getElementById("details").classList.remove("hidden");
    document.getElementById("hero").classList.add("hidden");
}
// Hide Cards
function HandleHideCards() {
    document.getElementById("header").classList.add("hidden");
    document.getElementById("details").classList.add("hidden");
    document.getElementById("hero").classList.remove("hidden");  
}



// Logout 
document.getElementById("logout-btn").addEventListener("click",function(){
    HandleHideCards();

});

// Load all the lessons
function loadLevels() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((res) => displayLevels(res.data));
}

// Display Lessons

function displayLevels(levels) {
    const LessonsContainer = document.getElementById("Lessons-container");
  
    for (let lev of levels) {
      const lessonsDiv = document.createElement("div");
  
      lessonsDiv.innerHTML = `
        <button  
          onclick="handleButtonClick(this, ${lev.level_no})"
          class="lesson-button bg-transparent text-[#422AD5] hover:bg-[#422AD5] hover:text-white border-[#422AD5] border-2 font-semibold rounded-md flex items-center justify-center py-2 px-3 gap-2"
        >
          <i class="fa-solid fa-book-open"></i>
          <p class="flex items-center justify-center">Lesson - ${lev.level_no}</p>
        </button>
      `;
  
      LessonsContainer.appendChild(lessonsDiv);
    }
  }
  
  function handleButtonClick(button, levelNo) {
    // Remove the active class from all buttons
    document.querySelectorAll(".lesson-button").forEach(btn => {
      btn.classList.remove("bg-[#422AD5]", "text-white");
      btn.classList.add("bg-transparent", "text-[#422AD5]");
    });
  
    // Add active class to the clicked button
    button.classList.remove("bg-transparent", "text-[#422AD5]");
    button.classList.add("bg-[#422AD5]", "text-white");

    loadWordbyID(levelNo);
  }
  






  function toggleAccordion(index) {
    const content = document.getElementById(`content-${index}`);
    const icon = document.getElementById(`icon-${index}`);

    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      icon.textContent = "-";
    } else {
      content.classList.add("hidden");
      icon.textContent = "+";
    }
  }












function loadWordbyID(Id) {
    showLoader();
  

  const url = `https://openapi.programming-hero.com/api/level/${Id}`;
  fetch(url)
    .then((response) => response.json())
    .then((res) => DisplayWords(res.data));
}

function DisplayWords(Words){
    const wordsContainer = document.getElementById('words-container');
    wordsContainer.innerHTML = ''; 

    if (Words.length == 0) {
        wordsContainer.innerHTML = `
         <div class="font-sil flex items-center justify-center col-span-full">
            <div class="">
                <img  class="mx-auto my-4" src="./assets/alert.svg" alt="">
            <p class="text-center my-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h1 class="text-center font-bold text-3xl mt-2 mb-6">নেক্সট Lesson এ যান</h1>
            </div>
         </div>
        `;
        hideLoader();
        return;
      }
   
    Words.forEach(w => {
        const wordCard = document.createElement('div');
        wordCard.innerHTML = `
  <div class="bg-white hover:bg-indigo-200 shadow-lg rounded-lg p-6 text-center max-w-[530px] h-[310px] font-sil">
    <h2 class="text-[28px] font-bold text-black my-3">${w.word}</h2>
    <p class="text-gray-500 font-bold">Meaning / Pronunciation</p>
    <p class="text-[23px] my-4 font-semibold">
    <span> "${w.meaning ? `${w.meaning}` : 'অর্থো নেই'}</span>
    <span>  /  ${w.pronunciation ? `${w.pronunciation}` : 'অর্থো নেই'}"</span>
      
    </p>
    <div class="flex justify-between mx-4 mt-10">
      <button class="bg-gray-200 rounded-lg w-10 h-10"  onclick="OpenWordDetails(${w.id})" >
        <i class="fa-solid fa-circle-info text-lg"></i>
      </button>
      <button class="bg-gray-200 rounded-lg w-10 h-10" onclick="OpenWordDetailsForVoice(${w.id})">
        <i class="fa-solid fa-volume-high"></i>
      </button>
    </div>
  </div>
`;

        wordsContainer.appendChild(wordCard);

        
        
    });
    hideLoader();
}



function OpenWordDetails(wordId){
    
    const url = `https://openapi.programming-hero.com/api/word/${wordId}`;
    fetch(url).then((response) => response.json())
   .then((r) => DisplayWordDetails(r.data));



}
function OpenWordDetailsForVoice(wordId){
    
  const url = `https://openapi.programming-hero.com/api/word/${wordId}`;
  fetch(url).then((response) => response.json())
 .then((r) => pronounceWord(r.data));



}
function DisplayWordDetails(wordsDetails) {
  document.getElementById("wordsDetails").showModal();
  const detailsContainer = document.getElementById("modal-container");

  
  const synonymsHTML = wordsDetails.synonyms
      ? wordsDetails.synonyms.map(word => `<span class="bg-gray-200 px-2 py-1 rounded">${word}</span>`).join("  ")
      : "No synonyms available";

  detailsContainer.innerHTML = `
      <h1 class="font-bold text-2xl">
          <span>${wordsDetails.word}</span>
          <span>(<i class="fa-solid fa-microphone"></i> ${wordsDetails.pronunciation})</span>
      </h1>
      <p class="mt-3 font-bold">Meaning</p>
      <p class="font-medium">${wordsDetails.meaning ? wordsDetails.meaning : "অর্থো নেই"}</p>
      <p class="mt-5 font-bold">Example</p>
      <p>${wordsDetails.sentence}</p>
      <p class="mt-4 font-semibold">সমার্থক শব্দ গুলো</p>
      <p class="mt-2">${synonymsHTML}</p>
  `;
}


// Voice
function pronounceWord(w) {
  const utterance = new SpeechSynthesisUtterance(w.word);
  utterance.lang = 'en-EN'; // English
  window.speechSynthesis.speak(utterance);
}

loadLevels();

// loadWordbylessonsnumber(1);

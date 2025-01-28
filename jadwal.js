console.log("jadwal.js loaded"); // Debugging untuk memastikan file dimuat

let userAnswers = {};
let currentCategory = "";

function toggleTable(tableId) {
  const table = document.getElementById(tableId);
  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "table";
  } else {
    table.style.display = "none";
  }
}

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Gagal memuat soal:", error);
    alert("Gagal memuat soal. Periksa apakah file questions.json tersedia.");
    return {};
  }
}

async function handleCategoryClick(event) {
  const category = event.target.getAttribute('data-category');
  console.log(`Kategori yang diklik: ${category}`);

  const questions = await loadQuestions();
  if (questions[category]) {
    openModal(category, questions[category]);
  } else {
    console.error(`Kategori "${category}" tidak ditemukan dalam questions.json`);
    alert(`Kategori "${category}" tidak ditemukan.`);
  }
}

function openModal(title, questions) {
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');
  const modalTitle = document.getElementById('question-title');
  const modalQuestions = document.getElementById('modal-questions');

  if (!modalTitle) {
    console.error("Elemen #question-title tidak ditemukan!");
    return;
  }

  modalTitle.textContent = `Soal untuk: ${title}`;
  modalQuestions.innerHTML = '';

  questions.forEach((question, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${index + 1}. ${question.title}</strong>
      <ul>
        ${question.options.map((option, i) => `
          <li>
            <label>
              <input type="radio" name="question-${index}" value="${i}" onchange="recordAnswer(${index}, ${i})">
              ${String.fromCharCode(65 + i)}. ${option}
            </label>
          </li>
        `).join('')}
      </ul>
    `;
    modalQuestions.appendChild(li);
  });

  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function recordAnswer(questionIndex, answerIndex) {
  userAnswers[questionIndex] = answerIndex;
}

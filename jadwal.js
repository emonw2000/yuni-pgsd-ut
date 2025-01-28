let userAnswers = {}; // Menyimpan jawaban pengguna
let currentCategory = ""; // Menyimpan kategori soal saat ini

// Fungsi untuk toggle (menampilkan/menyembunyikan) tabel
function toggleTable(tableId) {
  const table = document.getElementById(tableId);
  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "table"; // Tampilkan tabel
  } else {
    table.style.display = "none"; // Sembunyikan tabel
  }
}

// Fungsi untuk memuat soal dari file JSON
async function loadQuestions() {
  try {
    const response = await fetch('questions.json'); // Muat file JSON soal
    const questions = await response.json(); // Parse JSON menjadi objek
    return questions;
  } catch (error) {
    console.error("Gagal memuat soal:", error);
    return {};
  }
}

// Fungsi untuk menangani klik kategori soal
async function handleCategoryClick(event) {
  const category = event.target.getAttribute('data-category'); // Ambil kategori
  const questions = await loadQuestions(); // Muat soal dari file JSON
  currentCategory = category; // Simpan kategori aktif

  if (questions[category]) {
    // Ambil container untuk menampilkan soal
    const questionContainer = document.getElementById('question-container');
    const questionList = document.getElementById('question-list');
    const questionTitle = document.getElementById('question-title');

    // Tampilkan soal terkait kategori
    questionTitle.textContent = `Soal untuk: ${category}`;
    questionList.innerHTML = ''; // Kosongkan soal sebelumnya
    userAnswers = {}; // Reset jawaban pengguna

    questions[category].forEach((question, index) => {
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
      questionList.appendChild(li);
    });

    questionContainer.style.display = 'block'; // Tampilkan container soal
  } else {
    console.error(`Kategori "${category}" tidak ditemukan.`);
  }
}

// Fungsi untuk mencatat jawaban pengguna
function recordAnswer(questionIndex, answerIndex) {
  userAnswers[questionIndex] = answerIndex;
}

// Fungsi untuk memeriksa jawaban
async function checkAnswers() {
  const questions = 

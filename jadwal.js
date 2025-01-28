console.log("jadwal.js loaded"); // Debugging untuk memastikan file dimuat

document.addEventListener("DOMContentLoaded", function () {
  console.log("Dokumen sudah dimuat.");
  console.log(document.querySelector('.result-body')); // Cek apakah ditemukan

  // Jika .result-body tidak ada, buat secara otomatis
  if (!document.querySelector('.result-body')) {
    console.warn("Elemen .result-body belum ada! Membuat elemen...");
    
    const resultContainer = document.getElementById('modal-result');
    if (resultContainer) {
      const resultBody = document.createElement('div');
      resultBody.classList.add('result-body');
      resultContainer.appendChild(resultBody);
      console.log("Elemen .result-body berhasil dibuat!");
    } else {
      console.error("Elemen #modal-result juga tidak ditemukan!");
    }
  }
});

let userAnswers = {}; // Menyimpan jawaban pengguna
let currentCategory = ""; // Menyimpan kategori soal yang sedang aktif

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
    currentCategory = category; // Simpan kategori soal yang sedang dibuka
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
  userAnswers = {}; // Reset jawaban pengguna

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
  console.log(`Jawaban untuk soal ${questionIndex + 1}: ${answerIndex}`);
}

async function checkAnswers() {
  console.log("checkAnswers() dipanggil"); // Debugging untuk memastikan fungsi dipanggil

  const questions = await loadQuestions();
  const categoryQuestions = questions[currentCategory];

  if (!categoryQuestions) {
    console.error("Soal tidak ditemukan untuk kategori:", currentCategory);
    return;
  }

  let score = 0; // Inisialisasi skor
  const totalQuestions = categoryQuestions.length;

  const modalResult = document.getElementById('modal-result');
  let resultBody = document.querySelector('.result-body');

  if (!resultBody) {
    console.warn("Elemen .result-body tidak ditemukan! Membuat ulang...");
    resultBody = document.createElement('div');
    resultBody.classList.add('result-body');
    modalResult.appendChild(resultBody);
  }

  resultBody.innerHTML = ''; // Kosongkan hasil sebelumnya

  // Periksa jawaban pengguna
  categoryQuestions.forEach((question, index) => {
    const correctAnswer = question.correct; // Jawaban benar dari file JSON
    const userAnswer = userAnswers[index]; // Jawaban pengguna

    if (userAnswer === correctAnswer) {
      score++; // Tambah skor jika jawaban benar
      resultBody.innerHTML += `<p>Soal ${index + 1}: <span style="color: green;">Benar ✅</span></p>`;
    } else {
      resultBody.innerHTML += `<p>Soal ${index + 1}: <span style="color: red;">Salah ❌</span> (Jawaban benar: ${String.fromCharCode(65 + correctAnswer)})</p>`;
    }
  });

  // Tampilkan skor akhir
  resultBody.innerHTML += `<p><strong>Skor Anda: ${score} / ${totalQuestions}</strong></p>`;
  modalResult.style.display = 'block'; // Tampilkan hasil
}

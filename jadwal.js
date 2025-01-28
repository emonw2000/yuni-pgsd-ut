let userAnswers = {}; // Menyimpan jawaban pengguna
let currentCategory = ""; // Menyimpan kategori soal saat ini

// Fungsi untuk membuka modal popup
function openModal(title, questions) {
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalQuestions = document.getElementById('modal-questions');

  modalTitle.textContent = `Soal untuk: ${title}`;
  modalQuestions.innerHTML = ''; // Kosongkan soal sebelumnya

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

// Fungsi untuk menutup modal popup
function closeModal() {
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');

  modal.style.display = 'none';
  overlay.style.display = 'none';
}


// Fungsi untuk toggle (menampilkan/menyembunyikan) tabel
function toggleTable(tableId) {
  const table = document.getElementById(tableId);
  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "table"; // Tampilkan tabel
  } else {
    table.style.display = "none"; // Sembunyikan tabel
  }
}

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Gagal memuat soal:", error);
    alert("Gagal memuat soal. Periksa apakah file questions.json tersedia.");
    return {};
  }
}


async function handleCategoryClick(event) {
  const category = event.target.getAttribute('data-category'); // Ambil kategori soal
  console.log(`Kategori yang dipilih: ${category}`); // Debugging
  const questions = await loadQuestions(); // Muat soal dari file JSON

  if (questions[category]) {
    openModal(category, questions[category]); // Tampilkan soal dalam modal
  } else {
    console.error(`Kategori "${category}" tidak ditemukan.`);
    alert(`Kategori "${category}" tidak ditemukan.`);
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
  const questions = await loadQuestions(); // Muat soal dari file JSON
  const categoryQuestions = questions[currentCategory]; // Ambil soal untuk kategori aktif
  const resultContainer = document.getElementById('result'); // Kontainer hasil
  let correctCount = 0;

  if (!categoryQuestions) {
    console.error("Tidak ada soal untuk kategori ini.");
    return;
  }

  // Periksa semua jawaban
  const totalQuestions = categoryQuestions.length;
  for (let i = 0; i < totalQuestions; i++) {
    if (userAnswers[i] === categoryQuestions[i].correct) {
      correctCount++;
    }
  }

  // Tampilkan hasil
  resultContainer.style.display = 'block';
  resultContainer.innerHTML = `
    <p>Anda menjawab ${correctCount} dari ${totalQuestions} soal dengan benar.</p>
  `;
}

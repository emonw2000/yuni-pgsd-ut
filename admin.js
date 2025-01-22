document.addEventListener('DOMContentLoaded', () => {
  const coursesUrl = 'course.json'; // URL untuk file JSON
  let coursesData = {}; // Data kursus akan disimpan di sini

  // Form dan elemen DOM
  const courseForm = document.getElementById('add-course-form');
  const moduleForm = document.getElementById('add-module-form');
  const courseNameInput = document.getElementById('course-name');
  const courseSksInput = document.getElementById('course-sks');
  const moduleNameInput = document.getElementById('module-name');
  const moduleIframeInput = document.getElementById('module-iframe');
  const coursesList = document.getElementById('courses');
  const saveJsonButton = document.getElementById('save-json');

  const githubConfig = {
    owner: 'emonw2000', // Ganti dengan username GitHub Anda
    repo: 'yuni-pgsd-ut',      // Nama repositori
    path: 'course.json',    // Jalur file JSON
    token: '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',
  };

  // Fetch data kursus dari JSON
  async function fetchCourses() {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${githubConfig.owner}/${githubConfig.repo}/main/${githubConfig.path}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      coursesData = await response.json();
      renderCourses();
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Gagal memuat data kursus dari server.');
    }
  }

  // Render daftar kursus dan modul
  function renderCourses() {
    coursesList.innerHTML = ''; // Bersihkan daftar sebelum menampilkan ulang
    for (const course in coursesData) {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${course} (${coursesData[course].sks} SKS)</strong>
        <button class="edit-course" data-course="${course}">Edit</button>
        <button class="add-module" data-course="${course}">Tambah Modul</button>
        <ul>
          ${coursesData[course].modul
            .map(
              (modul, index) => `
              <li>
                <span>${modul.name}</span>
                <a href="${modul.iframe}" target="_blank">[Link]</a>
                <button class="edit-module" data-course="${course}" data-index="${index}">Edit</button>
              </li>`
            )
            .join('')}
        </ul>
      `;
      coursesList.appendChild(li);
    }
    attachEventListeners(); // Tambahkan event listener untuk tombol-tombol baru
  }

  // Tambahkan event listener ke elemen dinamis
  function attachEventListeners() {
    // Edit kursus
    document.querySelectorAll('.edit-course').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        courseNameInput.value = course;
        courseSksInput.value = coursesData[course].sks;
      })
    );

    // Tambah modul
    document.querySelectorAll('.add-module').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        moduleForm.dataset.currentCourse = course;
        moduleForm.dataset.currentIndex = undefined; // Reset index untuk modul baru
        moduleForm.classList.remove('hidden');
        moduleNameInput.value = '';
        moduleIframeInput.value = '';
      })
    );

    // Edit modul
    document.querySelectorAll('.edit-module').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        const index = e.target.dataset.index;
        const modul = coursesData[course].modul[index];
        moduleForm.dataset.currentCourse = course;
        moduleForm.dataset.currentIndex = index;
        moduleForm.classList.remove('hidden');
        moduleNameInput.value = modul.name;
        moduleIframeInput.value = modul.iframe;
      })
    );
  }

  // Tambah atau perbarui kursus
  courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseName = courseNameInput.value.trim();
    const courseSks = parseInt(courseSksInput.value.trim(), 10);

    if (!courseName || isNaN(courseSks)) {
      alert('Nama kursus dan SKS wajib diisi!');
      return;
    }

    coursesData[courseName] = coursesData[courseName] || { sks: courseSks, modul: [] };
    coursesData[courseName].sks = courseSks;
    courseForm.reset();
    renderCourses();
  });

  // Tambah atau perbarui modul
  moduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const course = moduleForm.dataset.currentCourse;
    const index = moduleForm.dataset.currentIndex;
    const moduleName = moduleNameInput.value.trim();
    const moduleIframe = moduleIframeInput.value.trim();

    if (!moduleName || !moduleIframe) {
      alert('Nama modul dan link wajib diisi!');
      return;
    }

    if (index !== undefined) {
      // Perbarui modul yang ada
      coursesData[course].modul[index] = { name: moduleName, iframe: moduleIframe };
    } else {
      // Tambah modul baru
      coursesData[course].modul.push({ name: moduleName, iframe: moduleIframe });
    }

    moduleForm.reset();
    moduleForm.classList.add('hidden');
    renderCourses();
  });

  // Simpan data ke GitHub
  saveJsonButton.addEventListener('click', () => {
    const content = JSON.stringify(coursesData, null, 2);
    updateFileOnGitHub(content);
  });

  // Fungsi untuk memperbarui file JSON di GitHub
  async function updateFileOnGitHub(content) {
    try {
      const sha = await getFileSHA();
      const response = await fetch(
        `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${githubConfig.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Update course.json via admin panel',
            content: btoa(unescape(encodeURIComponent(content))), // Encode ke Base64
            sha,
          }),
        }
      );

      if (response.ok) {
        alert('File berhasil diperbarui di GitHub!');
      } else {
        console.error('Failed to update file:', await response.json());
        alert('Gagal memperbarui file di GitHub.');
      }
    } catch (error) {
      console.error('Error updating file on GitHub:', error);
      alert('Gagal memperbarui file di GitHub.');
    }
  }

  // Dapatkan SHA file dari GitHub
  async function getFileSHA() {
    const response = await fetch(
      `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.path}`,
      {
        headers: { Authorization: `token ${githubConfig.token}` },
      }
    );
    const data = await response.json();
    return data.sha;
  }

  // Mulai dengan mem-fetch data kursus
  fetchCourses();
});

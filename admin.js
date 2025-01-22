document.addEventListener('DOMContentLoaded', () => {
  const coursesUrl = 'courses.json'; // URL JSON
  let coursesData = {};

  const courseForm = document.getElementById('add-course-form');
  const moduleForm = document.getElementById('add-module-form');
  const courseNameInput = document.getElementById('course-name');
  const courseSksInput = document.getElementById('course-sks');
  const moduleNameInput = document.getElementById('module-name');
  const moduleIframeInput = document.getElementById('module-iframe');
  const coursesList = document.getElementById('courses');
  const downloadJsonButton = document.getElementById('download-json');

  // GitHub API Config
  const githubConfig = {
    owner: 'your-username', // Ganti dengan username GitHub Anda
    repo: 'your-repo',      // Ganti dengan nama repositori
    path: 'courses.json',   // Path ke file JSON di repo
    token: 'your-personal-access-token', // Masukkan Personal Access Token
  };

  // Fetch existing courses data
  async function fetchCourses() {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/${githubConfig.owner}/${githubConfig.repo}/main/${githubConfig.path}`);
      coursesData = await response.json();
      renderCourses();
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  // Render courses in the list
  function renderCourses() {
    coursesList.innerHTML = '';
    for (const course in coursesData) {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${course} (${coursesData[course].sks} SKS)</strong>
        <button class="edit-course" data-course="${course}">Edit</button>
        <button class="add-module" data-course="${course}">Tambah Modul</button>
        <button class="delete-course" data-course="${course}">Hapus</button>
        <ul>
          ${coursesData[course].modul
            .map(
              (modul, index) => `
              <li>
                ${modul.name} - <a href="${modul.iframe}" target="_blank">Link</a>
                <button class="edit-module" data-course="${course}" data-index="${index}">Edit</button>
                <button class="delete-module" data-course="${course}" data-index="${index}">Hapus</button>
              </li>`
            )
            .join('')}
        </ul>
      `;
      coursesList.appendChild(li);
    }

    attachEventListeners();
  }

  // Attach event listeners
  function attachEventListeners() {
    document.querySelectorAll('.edit-course').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        courseNameInput.value = course;
        courseSksInput.value = coursesData[course].sks;
      })
    );

    document.querySelectorAll('.add-module').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        moduleForm.dataset.currentCourse = course;
        moduleForm.classList.remove('hidden');
      })
    );

    document.querySelectorAll('.delete-course').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        delete coursesData[course];
        renderCourses();
      })
    );

    document.querySelectorAll('.edit-module').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        const index = e.target.dataset.index;
        const modul = coursesData[course].modul[index];
        moduleForm.dataset.currentCourse = course;
        moduleNameInput.value = modul.name;
        moduleIframeInput.value = modul.iframe;
        moduleForm.classList.remove('hidden');
      })
    );

    document.querySelectorAll('.delete-module').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        const index = e.target.dataset.index;
        coursesData[course].modul.splice(index, 1);
        renderCourses();
      })
    );
  }

  // Save or update course
  courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseName = courseNameInput.value.trim();
    const courseSks = parseInt(courseSksInput.value.trim(), 10);

    if (courseName && courseSks) {
      coursesData[courseName] = coursesData[courseName] || { sks: courseSks, modul: [] };
      coursesData[courseName].sks = courseSks;
      courseForm.reset();
      renderCourses();
    }
  });

  // Save or update module
  moduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const course = moduleForm.dataset.currentCourse;
    const moduleName = moduleNameInput.value.trim();
    const moduleIframe = moduleIframeInput.value.trim();

    if (course && moduleName && moduleIframe) {
      coursesData[course].modul.push({ name: moduleName, iframe: moduleIframe });
      moduleForm.reset();
      moduleForm.classList.add('hidden');
      renderCourses();
    }
  });

  // Update file on GitHub
  async function updateFileOnGitHub(content) {
    try {
      const sha = await getFileSHA();
      const response = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.path}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update courses.json via admin panel',
          content: btoa(unescape(encodeURIComponent(content))), // Base64 encode content
          sha,
        }),
      });

      if (response.ok) {
        alert('File berhasil diperbarui di GitHub!');
      } else {
        console.error('Failed to update file:', await response.json());
      }
    } catch (error) {
      console.error('Error updating file on GitHub:', error);
    }
  }

  // Get current SHA of the file
  async function getFileSHA() {
    const response = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.path}`, {
      headers: { Authorization: `token ${githubConfig.token}` },
    });
    const data = await response.json();
    return data.sha;
  }

  // Download JSON and update GitHub
  downloadJsonButton.addEventListener('click', () => {
    const content = JSON.stringify(coursesData, null, 2);
    updateFileOnGitHub(content);
  });

  fetchCourses();
});

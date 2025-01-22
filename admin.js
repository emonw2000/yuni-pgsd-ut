document.addEventListener('DOMContentLoaded', () => {
  const coursesUrl = 'course.json';
  let coursesData = {};

  const courseForm = document.getElementById('add-course-form');
  const moduleForm = document.getElementById('add-module-form');
  const courseNameInput = document.getElementById('course-name');
  const courseSksInput = document.getElementById('course-sks');
  const moduleNameInput = document.getElementById('module-name');
  const moduleIframeInput = document.getElementById('module-iframe');
  const coursesList = document.getElementById('courses');

  // Fetch existing courses data
  async function fetchCourses() {
    try {
      const response = await fetch(coursesUrl);
      coursesData = await response.json();
      renderCourses();
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  // Render courses and modules
  function renderCourses() {
    coursesList.innerHTML = '';
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
    attachEventListeners();
  }

  // Attach event listeners
  function attachEventListeners() {
    // Edit course
    document.querySelectorAll('.edit-course').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        courseNameInput.value = course;
        courseSksInput.value = coursesData[course].sks;
      })
    );

    // Add module
    document.querySelectorAll('.add-module').forEach((button) =>
      button.addEventListener('click', (e) => {
        const course = e.target.dataset.course;
        moduleForm.dataset.currentCourse = course;
        moduleForm.classList.remove('hidden');
        moduleNameInput.value = '';
        moduleIframeInput.value = '';
      })
    );

    // Edit module
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
    const index = moduleForm.dataset.currentIndex;
    const moduleName = moduleNameInput.value.trim();
    const moduleIframe = moduleIframeInput.value.trim();

    if (!moduleName || !moduleIframe) {
      alert('Nama modul dan link wajib diisi!');
      return;
    }

    if (index !== undefined) {
      // Update existing module
      coursesData[course].modul[index] = { name: moduleName, iframe: moduleIframe };
    } else {
      // Add new module
      coursesData[course].modul.push({ name: moduleName, iframe: moduleIframe });
    }

    moduleForm.reset();
    moduleForm.classList.add('hidden');
    renderCourses();
  });

  fetchCourses();
});

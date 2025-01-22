// admin.js
document.addEventListener('DOMContentLoaded', () => {
  const coursesUrl = 'courses.json'; // URL to courses.json
  let coursesData = {};

  const courseForm = document.getElementById('add-course-form');
  const moduleForm = document.getElementById('add-module-form');
  const courseNameInput = document.getElementById('course-name');
  const courseSksInput = document.getElementById('course-sks');
  const moduleNameInput = document.getElementById('module-name');
  const moduleIframeInput = document.getElementById('module-iframe');
  const coursesList = document.getElementById('courses');

  // Fetch existing courses
  async function fetchCourses() {
    const response = await fetch(coursesUrl);
    coursesData = await response.json();
    renderCourses();
  }

  // Render courses in the list
  function renderCourses() {
    coursesList.innerHTML = '';
    for (const course in coursesData) {
      const li = document.createElement('li');
      li.textContent = `${course} (${coursesData[course].sks} SKS)`;
      const button = document.createElement('button');
      button.textContent = 'Tambah Modul';
      button.addEventListener('click', () => openModuleForm(course));
      li.appendChild(button);
      coursesList.appendChild(li);
    }
  }

  // Open module form
  function openModuleForm(course) {
    moduleForm.classList.remove('hidden');
    moduleForm.dataset.currentCourse = course;
  }

  // Add or update course
  courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseName = courseNameInput.value.trim();
    const sks = parseInt(courseSksInput.value.trim(), 10);

    if (courseName && sks) {
      coursesData[courseName] = coursesData[courseName] || { sks, modul: [] };
      coursesData[courseName].sks = sks;
      saveCourses();
      courseForm.reset();
    }
  });

  // Add module to course
  moduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const course = moduleForm.dataset.currentCourse;
    const moduleName = moduleNameInput.value.trim();
    const iframe = moduleIframeInput.value.trim();

    if (course && moduleName && iframe) {
      coursesData[course].modul.push({ name: moduleName, iframe });
      saveCourses();
      moduleForm.reset();
      moduleForm.classList.add('hidden');
    }
  });

  // Save courses data to server
  async function saveCourses() {
    // Simulate saving with console.log
    console.log('Saving to server...', coursesData);
    // Implement server-side API for saving if needed
    renderCourses();
  }

  fetchCourses();
});

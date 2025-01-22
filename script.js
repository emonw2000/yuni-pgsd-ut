document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const modulList = document.getElementById('modul-list');
  const iframeContainer = document.getElementById('iframe-container');
  const courseTitle = document.getElementById('course-title');
  const courseDesc = document.getElementById('course-desc');
  const modulItems = document.getElementById('modul-items');
  const iframeContent = document.getElementById('iframe-content');
  const modulNumber = document.getElementById('modul-number');
  const iframeError = document.getElementById('iframe-error');

  let courses = {};

  // Load courses from JSON
  fetch('course.json')
    .then((response) => response.json())
    .then((data) => {
      courses = data;
      initializeNavLinks();
    })
    .catch((error) => console.error('Error loading course data:', error));

  function initializeNavLinks() {
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach((nav) => nav.classList.remove('active'));
        link.classList.add('active');

        const courseName = link.textContent.trim();
        if (courses[courseName]) {
          modulItems.innerHTML = '';
          modulList.classList.remove('hidden');
          iframeContainer.classList.add('hidden');
          courseTitle.textContent = courseName;
          courseDesc.textContent = `${courseName} (${courses[courseName].sks} SKS)`;

          courses[courseName].modul.forEach((modul, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = modul.name;
            a.href = '#';
            a.dataset.index = index;
            li.appendChild(a);
            modulItems.appendChild(li);
          });
        }
      });
    });

    modulItems.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const courseName = courseTitle.textContent;
        const modulIndex = e.target.dataset.index;
        const modul = courses[courseName].modul[modulIndex];

        if (modul) {
          iframeContent.src = modul.iframe || `https://example.com/modul${+modulIndex + 1}`;
          modulNumber.textContent = modul.name;
          iframeContainer.classList.remove('hidden');
          modulList.classList.add('hidden');

          iframeContent.onerror = () => {
            iframeContent.classList.add('hidden');
            iframeError.classList.remove('hidden');
          };
        }
      }
    });
  }
});

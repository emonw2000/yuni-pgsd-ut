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
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log('Data loaded from course.json:', data); // Debug data JSON
      courses = data;
      initializeNavLinks();
    })
    .catch((error) => console.error('Error loading course data:', error));

  function initializeNavLinks() {
    console.log('Initializing nav links...');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const courseName = link.textContent.trim();
        console.log('Selected course:', courseName);

        if (courses[courseName]) {
          console.log('Modules:', courses[courseName].modul);
          modulItems.innerHTML = ''; // Reset modul list
          modulList.classList.remove('hidden');
          iframeContainer.classList.add('hidden');
          courseTitle.textContent = courseName;
          courseDesc.textContent = `${courseName} (${courses[courseName].sks} SKS)`;

          courses[courseName].modul.forEach((modul, index) => {
            console.log('Adding module:', modul.name);
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = modul.name;
            a.href = '#';
            a.dataset.index = index;
            li.appendChild(a);
            modulItems.appendChild(li);
          });
        } else {
          console.warn('Course not found in course.json:', courseName);
          modulItems.innerHTML = '<li>Modul tidak tersedia.</li>';
        }
      });
    });

    modulItems.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const courseName = courseTitle.textContent;
        const modulIndex = e.target.dataset.index;
        const modul = courses[courseName]?.modul[modulIndex];

        if (modul) {
          console.log('Displaying module:', modul.name);
          iframeContent.src = modul.iframe || `https://example.com/modul${+modulIndex + 1}`;
          modulNumber.textContent = modul.name;
          iframeContainer.classList.remove('hidden');
          modulList.classList.add('hidden');

          iframeContent.onerror = () => {
            console.error('Error loading iframe content.');
            iframeContent.classList.add('hidden');
            iframeError.classList.remove('hidden');
          };
        }
      }
    });
  }
});
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
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log('Data loaded from course.json:', data); // Debug data JSON
      courses = data;
      initializeNavLinks();
    })
    .catch((error) => console.error('Error loading course data:', error));

  function initializeNavLinks() {
    console.log('Initializing nav links...');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const courseName = link.textContent.trim();
        console.log('Selected course:', courseName);

        if (courses[courseName]) {
          console.log('Modules:', courses[courseName].modul);
          modulItems.innerHTML = ''; // Reset modul list
          modulList.classList.remove('hidden');
          iframeContainer.classList.add('hidden');
          courseTitle.textContent = courseName;
          courseDesc.textContent = `${courseName} (${courses[courseName].sks} SKS)`;

          courses[courseName].modul.forEach((modul, index) => {
            console.log('Adding module:', modul.name);
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = modul.name;
            a.href = '#';
            a.dataset.index = index;
            li.appendChild(a);
            modulItems.appendChild(li);
          });
        } else {
          console.warn('Course not found in course.json:', courseName);
          modulItems.innerHTML = '<li>Modul tidak tersedia.</li>';
        }
      });
    });

    modulItems.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const courseName = courseTitle.textContent;
        const modulIndex = e.target.dataset.index;
        const modul = courses[courseName]?.modul[modulIndex];

        if (modul) {
          console.log('Displaying module:', modul.name);
          iframeContent.src = modul.iframe || `https://example.com/modul${+modulIndex + 1}`;
          modulNumber.textContent = modul.name;
          iframeContainer.classList.remove('hidden');
          modulList.classList.add('hidden');

          iframeContent.onerror = () => {
            console.error('Error loading iframe content.');
            iframeContent.classList.add('hidden');
            iframeError.classList.remove('hidden');
          };
        }
      }
    });
  }
});

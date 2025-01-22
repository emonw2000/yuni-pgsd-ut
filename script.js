document.addEventListener('DOMContentLoaded', () => {
  const courses = {
    "Pengantar Pendidikan": {
      sks: 3,
      modul: [
        "Modul 1 Hakikat Manusia dan Pendidikan",
        "Modul 2 Landasan Pendidikan",
        "Modul 3 Lingkungan Pendidikan",
        "Modul 4 Gerakan-gerakan Pendidikan",
        "Modul 5 Kondisi Pendidikan di Indonesia",
        "Modul 6 Antropologi Pendidikan",
        "Modul 7 Perubahan Sosial Hubungannya dengan Pendidikan Formal, Non Formal, dan Informal",
        "Modul 8 Sistem Pendidikan Nasional",
        "Modul 9 Inovasi Pendidikan"
      ]
    },
    "Pendidikan Seni di SD": {
      sks: 4,
      modul: [
        "Modul 1 Wawasan Seni",
        "Modul 2 Pengetahuan Dasar Seni",
        "Modul 3 Kemampuan Dasar dan Karakteristik Seni Anak SD",
        "Modul 4 Pemanfaatan Teknologi dalam Berkarya Seni",
        "Modul 5 Olah Musik",
        "Modul 6 Penciptaan Karya Musik Anak SD",
        "Modul 7 Penciptaan Tari Anak SD",
        "Modul 8 Penciptaan Karya Seni Rupa Anak SD",
        "Modul 9 Apresiasi Musik dan Tari",
        "Modul 10 Apresiasi Seni Rupa Anak",
        "Modul 11 Konsep Pendidikan Seni",
        "Modul 12 Pembelajaran Seni Terpadu"
      ]
    }
  };

  const navLinks = document.querySelectorAll('nav ul li a');
  const modulList = document.getElementById('modul-list');
  const iframeContainer = document.getElementById('iframe-container');
  const courseTitle = document.getElementById('course-title');
  const courseDesc = document.getElementById('course-desc');
  const modulItems = document.getElementById('modul-items');
  const iframeContent = document.getElementById('iframe-content');
  const modulNumber = document.getElementById('modul-number');

  const defaultIframeURL = "https://docs.google.com/forms/d/e/1FAIpQLSfRrNGMd3wzskNwSwWpr9WEPGNNu4joE74RP4a-bPJgSXzP-A/viewform?embedded=true";

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = e.target.textContent;

      modulList.classList.remove('hidden');
      iframeContainer.classList.add('hidden');
      courseTitle.textContent = courseName;
      courseDesc.textContent = `${courseName} (${courses[courseName].sks} SKS)`;
      modulItems.innerHTML = '';

      courses[courseName].modul.forEach((modul, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = modul;
        a.href = '#';
        a.dataset.url = defaultIframeURL;
        li.appendChild(a);
        modulItems.appendChild(li);
      });
    });
  });

  modulItems.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const modul = e.target.textContent;
      const url = e.target.dataset.url;

      iframeContainer.classList.remove('hidden');
      modulList.classList.add('hidden');
      iframeContent.src = url;
      modulNumber.textContent = modul;
    }
  });
});

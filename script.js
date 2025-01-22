// script.js
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
    },
    "Perspektif Global": {
      sks: 2,
      modul: [
        "Modul 1 Hakikat dan Konsep Perspektif Global",
        "Modul 2 Perspektif Global dilihat dari sudut ilmu-ilmu sosial dan ilmu lain yang terkait",
        "Modul 3 Pentingnya Kesadaran dan Wawasan Perspektif Global",
        "Modul 4 Isu-isu dan Masalah Global dalam Kaitannya dengan Kepentingan Nasional",
        "Modul 5 Isu-isu dan Masalah Global dalam Kaitannya dengan Pembelajaran IPS SD",
        "Modul 6 Model Pembelajaran dan Evaluasi Pembelajaran Perspektif Global"
      ]
    },
    "Perkembangan Peserta Didik": {
      sks: 2,
      modul: [
        "Modul 1 Pengenalan Teori dan Prinsip Dasar Perkembangan",
        "Modul 2 Teori Perkembangan Kognitif dan Perspektif Sosial Budaya",
        "Modul 3 Tahap Perkembangan Bahasa dan Kemampuan Berpikir Matematis",
        "Modul 4 Pengenalan Teori dan Tahapan Perkembangan Sosial dan Emosional",
        "Modul 5 Perkembangan Fisik Peserta Didik"
      ]
    },
    "Pendidikan Anak di SD": {
      sks: 4,
      modul: [
        "Modul 1 Hakikat Pendidikan di Sekolah Dasar",
        "Modul 2 Perkembangan Kognitif Anak Usia Sekolah Dasar",
        "Modul 3 Perkembangan Moral dan Sosial pada Anak Usia Sekolah Dasar",
        "Modul 4 Kebutuhan Anak Sekolah Dasar",
        "Modul 5 Proses Belajar Anak SD",
        "Modul 6 Pendekatan Pembelajaran di Sekolah Dasar",
        "Modul 7 Pengembangan dan Inovasi Pendidikan di Sekolah Dasar",
        "Modul 8 Konvensi Hak Anak",
        "Modul 9 Konvensi Hak Anak dan Pendidikan",
        "Modul 10 Implikasi Hak Anak di Sekolah Dasar",
        "Modul 11 Konsep Dasar Bimbingan dan Konseling di Sekolah Dasar",
        "Modul 12 Prosedur Pengelolaan Program Bimbingan dan Konseling di SD"
      ]
    },
  };

  const navLinks = document.querySelectorAll('.nav-link');
  const modulList = document.getElementById('modul-list');
  const iframeContainer = document.getElementById('iframe-container');
  const courseTitle = document.getElementById('course-title');
  const courseDesc = document.getElementById('course-desc');
  const modulItems = document.getElementById('modul-items');
  const iframeContent = document.getElementById('iframe-content');
  const modulNumber = document.getElementById('modul-number');
  const iframeError = document.getElementById('iframe-error');
  const searchInput = document.getElementById('search-input');

  // Highlight active link
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');

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
        a.dataset.modul = index + 1;
        li.appendChild(a);
        modulItems.appendChild(li);
      });
    });
  });

  // Display module in iframe
  modulItems.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const modul = e.target.textContent;
      const modulIndex = e.target.dataset.modul;

      iframeContainer.classList.remove('hidden');
      modulList.classList.add('hidden');

      // Check specific module and course
      if (modul === "Modul 1 Hakikat Manusia dan Pendidikan" && courseTitle.textContent === "Pengantar Pendidikan") {
        iframeContent.src = "https://docs.google.com/forms/d/e/1FAIpQLSfRrNGMd3wzskNwSwWpr9WEPGNNu4joE74RP4a-bPJgSXzP-A/viewform?embedded=true";
      } else {
        iframeContent.src = `https://example.com/modul${modulIndex}`;
      }

      modulNumber.textContent = modul;

      // Fallback for iframe loading error
      iframeContent.onerror = () => {
        iframeContent.classList.add('hidden');
        iframeError.classList.remove('hidden');
      };
    }
  });

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filteredModules = [];

    Object.keys(courses).forEach(courseName => {
      const course = courses[courseName];
      course.modul.forEach((modul, index) => {
        if (modul.toLowerCase().includes(searchQuery)) {
          filteredModules.push({
            modul,
            courseName,
            index: index + 1
          });
        }
      });
    });

    modulItems.innerHTML = '';
    filteredModules.forEach(({ modul, courseName, index }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = `${modul} (${courseName})`;
      a.href = '#';
      a.dataset.modul = index;
      li.appendChild(a);
      modulItems.appendChild(li);
    });
  });
});

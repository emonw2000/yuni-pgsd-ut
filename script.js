document.addEventListener('DOMContentLoaded', () => {
  const courses = {
    "Pengantar Pendidikan": {
      modulCount: 9,
      urlPrefix: "https://example.com/pengantar-pendidikan"
    },
    "Perkembangan Peserta Didik": {
      modulCount: 5,
      urlPrefix: "https://example.com/perkembangan-peserta-didik"
    },
    "Pendidikan Seni di SD": {
      modulCount: 12,
      urlPrefix: "https://example.com/pendidikan-seni-di-sd"
    },
    "Perspektif Global": {
      modulCount: 6,
      urlPrefix: "https://example.com/perspektif-global"
    },
    "Pendidikan Anak di SD": {
      modulCount: 12,
      urlPrefix: "https://example.com/pendidikan-anak-di-sd"
    },
  };

  const navLinks = document.querySelectorAll('nav ul li a');
  const modulList = document.getElementById('modul-list');
  const iframeContainer = document.getElementById('iframe-container');
  const courseTitle = document.getElementById('course-title');
  const modulItems = document.getElementById('modul-items');
  const iframeContent = document.getElementById('iframe-content');
  const modulNumber = document.getElementById('modul-number');

  // Event untuk setiap menu mata kuliah
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = e.target.textContent;

      // Tampilkan daftar modul
      modulList.classList.remove('hidden');
      iframeContainer.classList.add('hidden');
      courseTitle.textContent = courseName;
      modulItems.innerHTML = ''; // Reset daftar modul

      // Tambahkan modul sesuai mata kuliah
      const { modulCount, urlPrefix } = courses[courseName];
      for (let i = 1; i <= modulCount; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = `Modul ${i}`;
        a.href = '#';
        a.dataset.url = `${urlPrefix}/modul${i}`;
        li.appendChild(a);
        modulItems.appendChild(li);
      }
    });
  });

  // Event untuk menampilkan iframe saat modul dipilih
  modulItems.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const url = e.target.dataset.url;
      const modul = e.target.textContent.split(' ')[1];

      iframeContainer.classList.remove('hidden');
      modulList.classList.add('hidden');
      iframeContent.src = url;
      modulNumber.textContent = modul;
    }
  });
});

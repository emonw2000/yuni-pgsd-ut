document.addEventListener('DOMContentLoaded', () => {
  const pengantarPendidikan = document.getElementById('pengantar-pendidikan');
  const modulList = document.getElementById('modul-list');
  const iframeContainer = document.getElementById('iframe-container');
  const modulLinks = modulList.querySelectorAll('a');
  const modulNumber = document.getElementById('modul-number');
  const iframeContent = document.getElementById('iframe-content');

  // URL untuk setiap modul
  const modulUrls = {
    1: "https://docs.google.com/forms/d/e/1FAIpQLSfRrNGMd3wzskNwSwWpr9WEPGNNu4joE74RP4a-bPJgSXzP-A/viewform?embedded=true",
    2: "https://example.com/modul2",
    3: "https://example.com/modul3",
    4: "https://example.com/modul4",
    5: "https://example.com/modul5",
    6: "https://example.com/modul6",
    7: "https://example.com/modul7",
    8: "https://example.com/modul8",
    9: "https://example.com/modul9",
  };

  // Event untuk membuka daftar modul
  pengantarPendidikan.addEventListener('click', (e) => {
    e.preventDefault();
    modulList.classList.remove('hidden');
    iframeContainer.classList.add('hidden');
  });

  // Event untuk memilih modul
  modulLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modul = e.target.getAttribute('data-modul');
      modulNumber.textContent = modul;
      iframeContent.src = modulUrls[modul];
      iframeContainer.classList.remove('hidden');
      modulList.classList.add('hidden');
    });
  });
});

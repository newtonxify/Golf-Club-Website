// gallery.js
// Enhanced gallery script with variable tile intervals and modal close on button and overlay click

document.addEventListener('DOMContentLoaded', async () => {
  // Load gallery data
  const resp = await fetch('data/gallery-data.json');
  const data = await resp.json();

  // Prepare filter values
  const years = Array.from(new Set(data.map(e => e.year))).sort((a,b) => b-a);
  const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  // Build filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'flex gap-4 mb-6 items-center';

  const yearSel = document.createElement('select');
  yearSel.className = 'p-2 border rounded';
  years.forEach(y => {
    const o = document.createElement('option'); o.value = y; o.textContent = y;
    yearSel.appendChild(o);
  });
  yearSel.value = years[0];

  const monthSel = document.createElement('select');
  monthSel.className = 'p-2 border rounded hidden';
  const allOpt = document.createElement('option'); allOpt.value=''; allOpt.textContent='All Months';
  monthSel.appendChild(allOpt);
  MONTH_NAMES.forEach((m,i)=>{
    const o=document.createElement('option'); o.value=i+1; o.textContent=m; monthSel.appendChild(o);
  });
  monthSel.value='';

  filterBar.append(yearSel, monthSel);
  document.querySelector('main.container').prepend(filterBar);

  // Modal and tile containers
  const tilesContainer = document.getElementById('event-tiles');
  const modal = document.getElementById('modal');
  const modalWrapper = modal.querySelector('.fixed'); // overlay container
  const modalContent = document.getElementById('modal-content');
  const titleEl = document.getElementById('event-title');
  const descEl = document.getElementById('event-desc');

  let modalIdx = 0;
  let modalMediaIdx = 0;
  let filteredData = [];

  // Show media in modal
  function showMedia() {
    const event = filteredData[modalIdx];
    const item = event.media[modalMediaIdx];
    modalContent.innerHTML = '';
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.className = 'w-full max-h-96 object-contain';
      modalContent.appendChild(img);
    } else {
      const vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.className = 'w-full max-h-96 object-contain';
      modalContent.appendChild(vid);
    }
    titleEl.textContent = event.title;
    descEl.textContent = event.description;
  }

  // Close modal function
  function closeModal() {
    modal.classList.add('hidden');
    const vid = modalContent.querySelector('video');
    if (vid) vid.pause();
  }

  // Attach close handlers
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    // if click on overlay (not dialog)
    if (e.target === modal) closeModal();
  });

  // Modal navigation
  document.getElementById('prevBtn').addEventListener('click', () => {
    modalMediaIdx = (modalMediaIdx - 1 + filteredData[modalIdx].media.length) % filteredData[modalIdx].media.length;
    showMedia();
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    modalMediaIdx = (modalMediaIdx + 1) % filteredData[modalIdx].media.length;
    showMedia();
  });

  // Tile creation with variable intervals
  function createTiles() {
    tilesContainer.innerHTML = '';
    filteredData.forEach((event, idx) => {
      let slideIdx = 0;
      const tile = document.createElement('div');
      tile.className = 'relative bg-green-950/50 rounded-lg shadow-lg overflow-hidden cursor-pointer';
      tile.dataset.idx = idx;

      const mediaWrapper = document.createElement('div');
      mediaWrapper.className = 'w-full h-96 overflow-hidden';

      // Generate a random interval between 3s and 8s
      const interval = Math.floor(Math.random() * 15000) + 20000;

      function updateMedia() {
        const item = event.media[slideIdx];
        mediaWrapper.innerHTML = '';
        if (item.type === 'image') {
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = event.title;
          img.className = 'object-cover';
          mediaWrapper.appendChild(img);
        } else {
          const vid = document.createElement('video');
          vid.src = item.src;
          vid.muted = true;
          vid.loop = true;
          vid.autoplay = true;
          vid.className = 'w-full h-full object-cover';
          mediaWrapper.appendChild(vid);
        }
        slideIdx = (slideIdx + 1) % event.media.length;
      }

      updateMedia();
      setInterval(updateMedia, interval);

      const info = document.createElement('div');
      info.className = 'p-4';
      info.innerHTML = `
        <h3 class="text-lg text-lime-500 font-semibold">${event.title}</h3>
        <p class="text-lime-200 mt-1">${event.description}</p>
      `;

      tile.append(mediaWrapper, info);
      tile.addEventListener('click', () => {
        modalIdx = idx;
        modalMediaIdx = 0;
        showMedia();
        modal.classList.remove('hidden');
      });
      tilesContainer.appendChild(tile);
    });
  }

  // Render based on filter
  function renderTiles() {
    const selYear = parseInt(yearSel.value, 10);
    const selMonth = monthSel.value ? parseInt(monthSel.value, 10) : null;
    filteredData = data.filter(e => e.year === selYear && (!selMonth || e.month === selMonth));
    createTiles();
  }

  yearSel.addEventListener('change', renderTiles);
  monthSel.addEventListener('change', renderTiles);
  renderTiles();
});

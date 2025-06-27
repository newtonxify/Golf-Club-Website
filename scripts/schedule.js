// scripts/schedule.js

// 1. Fetch external JSON data
fetch('data/tournaments.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load tournaments.json');
    return response.json();
  })
  .then(tournamentData => {
    // Utility: format “YYYY-MM-DD” → “Month Day, Year”
    function formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dt = new Date(dateStr + 'T00:00:00');
      return dt.toLocaleDateString(undefined, options);
    }

    // Render Upcoming Tournaments
    const upcomingList = document.getElementById('upcoming-list');
    tournamentData.upcomingTournaments.forEach(tourn => {
      const card = document.createElement('div');
      card.className = 'bg-white/50 rounded-lg shadow-md p-4 flex justify-between items-center';
      card.innerHTML = `
        <div>
          <h3 class="text-xl font-semibold text-green-700">${tourn.name}</h3>
          <p class="text-gray-600">${formatDate(tourn.date)}</p>
          <p class="text-gray-500 italic">${tourn.location}</p>
        </div>
      `;
      upcomingList.appendChild(card);
    });

    // Prepare Past Tournaments + IPS Winners + Filters
    const allPast = tournamentData.pastTournaments.slice();
    const ipsWinners = tournamentData.ipsWinners.slice();

    const pastList = document.getElementById('past-list');
    const selectYear = document.getElementById('filter-year');
    const selectMonth = document.getElementById('filter-month');
    const ipsWinnerContainer = document.getElementById('ips-winner');

    // Build sets of unique years and months
    const yearSet = new Set();
    const monthSet = new Set();
    allPast.forEach(t => {
      const dt = new Date(t.date + 'T00:00:00');
      yearSet.add(dt.getFullYear());
      monthSet.add(dt.getMonth() + 1);
    });

    // Month names lookup
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    // Populate Year dropdown (descending)
    Array.from(yearSet)
      .sort((a, b) => b - a)
      .forEach(year => {
        const opt = document.createElement('option');
        opt.value = year;
        opt.textContent = year;
        selectYear.appendChild(opt);
      });

    // Default Year filter to most recent year
    const mostRecentYear = Math.max(...Array.from(yearSet));
    selectYear.value = mostRecentYear.toString();

    // Populate Month dropdown (ascending)
    Array.from(monthSet)
      .sort((a, b) => a - b)
      .forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = monthNames[m - 1];
        selectMonth.appendChild(opt);
      });

    // Determine most recent IPS year
    const yearsInIPS = ipsWinners.map(w => w.year);
    const mostRecentIPSYear = Math.max(...yearsInIPS);

    // Render IPS Winner card
    function renderIPSWinner(yearFilter) {
      ipsWinnerContainer.innerHTML = '';

      let targetYear;
      if (yearFilter !== 'all') {
        const y = parseInt(yearFilter, 10);
        const found = ipsWinners.find(w => w.year === y);
        targetYear = found ? y : mostRecentIPSYear;
      } else {
        targetYear = mostRecentIPSYear;
      }

      const winnerObj = ipsWinners.find(w => w.year === targetYear);
      if (!winnerObj) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'bg-yellow-600/60 rounded-lg shadow-lg p-6 flex flex-col items-center text-center border-2 border-solid';
      wrapper.innerHTML = `
        <h3 class="text-2xl font-bold text-green-800">PMC GOLF Club</h3>
        <p class="text-lg text-gray-700 mb-4">IPS TOURNAMENT Winner (${winnerObj.year})</p>
        <img src="${winnerObj.imageUrl}" alt="${winnerObj.name}" 
             class="w-96 h-96 rounded-full object-cover border-4 border-green-200 mb-3" />
        <p class="text-xl font-medium text-gray-800">${winnerObj.name}</p>
      `;
      ipsWinnerContainer.appendChild(wrapper);
    }

    // Render Past Tournaments (with filters)
    function renderPastTournaments() {
      pastList.innerHTML = '';

      const yearFilter = selectYear.value;
      const monthFilter = selectMonth.value;

      renderIPSWinner(yearFilter);

      const filtered = allPast.filter(t => {
        const dt = new Date(t.date + 'T00:00:00');
        const y = dt.getFullYear().toString();
        const m = (dt.getMonth() + 1).toString();

        const yearOK = (yearFilter === 'all') || (y === yearFilter);
        const monthOK = (monthFilter === 'all') || (m === monthFilter);
        return yearOK && monthOK;
      });

      if (filtered.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'col-span-full text-center text-gray-600 italic';
        msg.textContent = 'No past tournaments match the selected filters.';
        pastList.appendChild(msg);
        return;
      }

      filtered.forEach(tourn => {
        const card = document.createElement('div');
        card.className = 'bg-white/60 rounded-lg shadow-md overflow-hidden';
        card.innerHTML = `
          <div class="p-4">
            <h3 class="text-lg font-semibold text-green-700">${tourn.name}</h3>
            <p class="text-gray-600 mb-3">${formatDate(tourn.date)}</p>
            <div class="flex items-center space-x-4">
              <img src="${tourn.winner.imageUrl}" 
                   alt="${tourn.winner.name}" 
                   class="w-80 h-80 rounded-full object-cover border-2 border-green-200" />
              <div>
                <p class="text-gray-800 font-medium">${tourn.winner.name}</p>
                <p class="text-sm text-gray-500">Winner</p>
              </div>
            </div>
          </div>
        `;
        pastList.appendChild(card);
      });
    }

    // Wire up filters
    selectYear.addEventListener('change', renderPastTournaments);
    selectMonth.addEventListener('change', renderPastTournaments);

    // Initial render
    renderPastTournaments();
  })
  .catch(error => {
    console.error('Error loading tournament data:', error);
  });

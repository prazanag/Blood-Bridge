// Simple client-side blood donation manager using localStorage
const STORAGE_KEY = 'bbms_donors_v1';

document.getElementById('year').textContent = new Date().getFullYear();

const donorForm = document.getElementById('donorForm');
const clearFormBtn = document.getElementById('clearForm');
const donorTableBody = document.querySelector('#donorTable tbody');
const searchName = document.getElementById('searchName');
const filterGroup = document.getElementById('filterGroup');
const filterCity = document.getElementById('filterCity');
const clearFilters = document.getElementById('clearFilters');
const requestForm = document.getElementById('requestForm');
const matchesEl = document.getElementById('matches');

let donors = loadDonors();
renderList();

// Load donors from localStorage
function loadDonors(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch(e){
    console.error('Failed to parse donors', e);
    return [];
  }
}

// Save donors
function saveDonors(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
}

// Create a donor object from form
function getFormData(){
  return {
    id: cryptoRandomId(),
    name: document.getElementById('name').value.trim(),
    age: Number(document.getElementById('age').value || 0),
    gender: document.getElementById('gender').value,
    bloodGroup: document.getElementById('bloodGroup').value,
    phone: document.getElementById('phone').value.trim(),
    city: document.getElementById('city').value.trim(),
    lastDonation: document.getElementById('lastDonation').value || null,
    createdAt: new Date().toISOString()
  };
}

// Basic client-side validation
function validateDonor(d){
  if(!d.name) return 'Name is required';
  if(!d.bloodGroup) return 'Blood group is required';
  if(!d.city) return 'City is required';
  if(!d.age || d.age < 18 || d.age > 75) return 'Age must be between 18 and 75';
  if(!/^[\d+\-\s()]{7,20}$/.test(d.phone)) return 'Phone looks invalid';
  return '';
}

donorForm.addEventListener('submit', e => {
  e.preventDefault();
  const donor = getFormData();
  const err = validateDonor(donor);
  if(err){ alert(err); return; }
  donors.push(donor);
  saveDonors();
  donorForm.reset();
  renderList();
});

clearFormBtn.addEventListener('click', () => donorForm.reset());

function renderList(){
  const qName = searchName.value.trim().toLowerCase();
  const qGroup = filterGroup.value;
  const qCity = filterCity.value.trim().toLowerCase();

  const filtered = donors.filter(d => {
    if(qName && !d.name.toLowerCase().includes(qName)) return false;
    if(qGroup && d.bloodGroup !== qGroup) return false;
    if(qCity && d.city.toLowerCase() !== qCity) return false;
    return true;
  });

  donorTableBody.innerHTML = filtered.map(d => `
    <tr>
      <td>${escapeHtml(d.name)}</td>
      <td>${d.age}</td>
      <td>${escapeHtml(d.gender)}</td>
      <td>${escapeHtml(d.bloodGroup)}</td>
      <td>${escapeHtml(d.phone)}</td>
      <td>${escapeHtml(d.city)}</td>
      <td>${d.lastDonation ? d.lastDonation : '—'}</td>
      <td>
        <button class="action-btn delete" data-id="${d.id}">Delete</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8" style="text-align:center;color:#777">No donors found</td></tr>`;

  // attach delete handlers
  donorTableBody.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if(!confirm('Delete this donor?')) return;
      donors = donors.filter(x => x.id !== btn.dataset.id);
      saveDonors();
      renderList();
    });
  });
}

// Search/filter handlers
[searchName, filterGroup, filterCity].forEach(el => el.addEventListener('input', renderList));
clearFilters.addEventListener('click', () => {
  searchName.value = ''; filterGroup.value = ''; filterCity.value = ''; renderList();
});

// Request blood: find compatible donors (simple match by same blood group; you can extend)
requestForm.addEventListener('submit', e => {
  e.preventDefault();
  const bg = document.getElementById('reqBlood').value;
  const city = document.getElementById('reqCity').value.trim().toLowerCase();

  if(!bg){ alert('Select a blood group'); return; }

  const results = donors.filter(d => d.bloodGroup === bg && (!city || d.city.toLowerCase() === city));
  matchesEl.innerHTML = results.length
    ? results.map(d => `
      <div class="match-card">
        <strong>${escapeHtml(d.name)}</strong> — ${escapeHtml(d.bloodGroup)} • ${d.city} • ${d.phone}
        <div style="font-size:.9rem;color:${'#555'}">Last donation: ${d.lastDonation || 'N/A'}</div>
      </div>
    `).join('')
    : `<div class="match-card">No matches found for ${bg}${city ? ' in ' + city : ''}.</div>`;
});

// small helpers
function escapeHtml(s=''){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
function cryptoRandomId(){ // compact unique id
  return 'd_' + (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2,9));
}
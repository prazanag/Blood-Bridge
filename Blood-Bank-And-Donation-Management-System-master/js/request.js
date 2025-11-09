(function(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const form = document.getElementById('reqForm'); const results = document.getElementById('results');
  form.addEventListener('submit', e=>{ e.preventDefault(); const need = document.getElementById('need').value; const city = (document.getElementById('needCity').value||'').toLowerCase(); if(!need){ alert('Select blood group'); return; } const donors = loadDonors(); const matches = donors.filter(d=> COMPAT[d.blood] && COMPAT[d.blood].includes(need) && (!city || d.city.toLowerCase()===city)); if(!matches.length){ results.innerHTML='<div class="muted">No matches found</div>'; return; } results.innerHTML = matches.map(m=>`<div class="match card"><strong>${esc(m.name)}</strong><div class="muted">${esc(m.blood)} • ${esc(m.city)} • ${esc(m.phone)}</div><div class="muted">Last donation: ${formatDate(m.lastDonation)}</div></div>`).join(''); });
})();

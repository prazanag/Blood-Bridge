(function(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const tbody = document.querySelector('#tbl tbody');
  const qName = document.getElementById('qName');
  const qGroup = document.getElementById('qGroup');
  const qCity = document.getElementById('qCity');
  const btnClear = document.getElementById('btnClear');
  const btnExport = document.getElementById('btnExport');

  let donors = loadDonors(); let sortState={key:'',dir:1};
  render();

  function render(){
    donors = loadDonors();
    const name = (qName.value||'').toLowerCase(); const g = qGroup.value; const city = (qCity.value||'').toLowerCase();
    let list = donors.filter(d=>{ if(name && !d.name.toLowerCase().includes(name)) return false; if(g && d.blood!==g) return false; if(city && d.city.toLowerCase()!==city) return false; return true; });
    if(sortState.key) list.sort((a,b)=> a[sortState.key] < b[sortState.key] ? -1*sortState.dir : a[sortState.key] > b[sortState.key] ? 1*sortState.dir : 0 );
    tbody.innerHTML = list.map(d=>{
      const eligible = eligibleForDonation(d.lastDonation);
      const badge = eligible ? '<span class="badge">Eligible</span>' : '<span class="small muted">Not eligible</span>';
      return `<tr data-id="${d.id}"><td><strong>${esc(d.name)}</strong><div class="muted">${esc(d.gender)} • ${d.age} yrs</div></td><td>${d.age}</td><td><span class="pill">${esc(d.blood)}</span></td><td>${esc(d.phone)}</td><td>${esc(d.city)}</td><td>${formatDate(d.lastDonation)} ${badge}</td><td><div class="table-actions"><a class="btn" href="add-donor.html?id=${d.id}">Edit</a><button class="btn" data-del="${d.id}">Delete</button><button class="btn" data-copy="${esc(d.phone)}">Copy</button></div></td></tr>`
    }).join('') || '<tr><td colspan="7" class="muted" style="text-align:center">No donors</td></tr>';
  }

  tbody.addEventListener('click', e=>{
    const del = e.target.closest('button[data-del]'); if(del){ const id = del.dataset.del; const d = donors.find(x=>x.id===id); if(!d) return; confirmDialog('Delete donor','Delete '+d.name+'?',()=>{ donors = donors.filter(x=>x.id!==id); saveDonors(donors); render(); showToast('Deleted'); }); return; }
    const copy = e.target.closest('button[data-copy]'); if(copy){ const val = copy.dataset.copy; copyToClipboard(val); return; }
  });

  document.querySelectorAll('th[data-sort]').forEach(th=> th.addEventListener('click', ()=>{ const key = th.dataset.sort; if(sortState.key===key) sortState.dir*=-1; else { sortState.key=key; sortState.dir=1 } render(); }));
  [qName,qGroup,qCity].forEach(el=>el && el.addEventListener('input', render));
  btnClear.addEventListener('click', ()=>{ qName.value=''; qGroup.value=''; qCity.value=''; render(); });
  btnExport.addEventListener('click', ()=> exportDonorsCSV(loadDonors()));
})();

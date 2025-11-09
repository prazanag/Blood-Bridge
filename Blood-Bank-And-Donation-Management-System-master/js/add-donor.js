(function(){
  const params = new URLSearchParams(location.search);
  const editId = params.get('id');
  document.getElementById('year').textContent = new Date().getFullYear();
  if(editId){
    const donors = loadDonors();
    const d = donors.find(x=>x.id===editId);
    if(d){ document.getElementById('id').value=d.id; document.getElementById('name').value=d.name; document.getElementById('age').value=d.age; document.getElementById('gender').value=d.gender; document.getElementById('blood').value=d.blood; document.getElementById('phone').value=d.phone; document.getElementById('city').value=d.city; document.getElementById('last').value=d.lastDonation||''; showToast('Loaded donor for edit'); }
  }

  document.getElementById('formAdd').addEventListener('submit', e=>{
    e.preventDefault();
    const id = document.getElementById('id').value || uid();
    const donor = { id, name: document.getElementById('name').value.trim(), age: parseInt(document.getElementById('age').value,10)||0, gender: document.getElementById('gender').value, blood: document.getElementById('blood').value, phone: document.getElementById('phone').value.trim(), city: document.getElementById('city').value.trim(), lastDonation: document.getElementById('last').value||null, updated: new Date().toISOString() };
    // simple validation
    if(!donor.name||!donor.blood||!donor.city||!donor.phone||donor.age<18||donor.age>75){ alert('Please complete the form correctly'); return; }
    const donors = loadDonors(); const idx = donors.findIndex(x=>x.id===id);
    if(idx>-1) donors[idx]=donor; else donors.unshift(donor);
    saveDonors(donors); showToast('Saved'); setTimeout(()=>location.href='donors.html',600);
  });

  document.getElementById('btnReset').addEventListener('click', ()=>document.getElementById('formAdd').reset());
})();

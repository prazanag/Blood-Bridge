// Shared helpers for localStorage and CSV
const STORAGE_KEY = 'bbms_donors_v5';
function loadDonors(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||[] }catch(e){return []} }
function saveDonors(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }
function uid(){ return 'd_' + Math.random().toString(36).slice(2,9) }
function exportDonorsCSV(list){ if(!list||!list.length){ alert('No donors to export'); return; } const headers=['id','name','age','gender','blood','phone','city','lastDonation','updated']; const rows = list.map(d=>headers.map(h=>`"${String(d[h]||'').replaceAll('"','""')}"`).join(',')); const csv = headers.join(',') + '\n' + rows.join('\n'); const blob = new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='donors.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
function importDonorsCSV(file, cb){ if(!file) return; const reader=new FileReader(); reader.onload = ev=>{ try{ const parsed = csvToArray(ev.target.result); cb(parsed); }catch(e){ alert('Invalid CSV') } }; reader.readAsText(file); }
function csvToArray(text){ const lines = text.split(/\r?\n/).filter(Boolean); if(!lines.length) return []; const headers = lines.shift().split(/,\s*/).map(h=>h.replace(/^"|"$/g,'')); return lines.map(l=>{ const values = l.match(/("[^"]*(""[^"]*)*"|[^,]+)/g) || []; const obj={}; headers.forEach((h,i)=>{ const v = values[i] ? values[i].trim().replace(/^"|"$/g,'').replaceAll('""','"') : ''; obj[h]=v; }); return obj; }); }

// Compatibility map
const COMPAT = { 'O-':['A+','A-','B+','B-','AB+','AB-','O+','O-'], 'O+':['A+','B+','AB+','O+'], 'A-':['A+','A-','AB+','AB-'], 'A+':['A+','AB+'], 'B-':['B+','B-','AB+','AB-'], 'B+':['B+','AB+'], 'AB-':['AB+','AB-'], 'AB+':['AB+'] };

// small helpers
function esc(s=''){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }
function formatDate(d){ if(!d) return '—'; const t=new Date(d); return isNaN(t)?'—':t.toLocaleDateString(); }

// Toast
function showToast(msg, t=1800){ let to=document.getElementById('_toast'); if(!to){ to=document.createElement('div'); to.id='_toast'; document.body.appendChild(to); } to.textContent=msg; to.classList.add('show'); setTimeout(()=>to.classList.remove('show'), t); }

// Copy to clipboard
function copyToClipboard(text){ if(!navigator.clipboard) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); showToast('Copied'); } catch(e){ alert('Copy failed'); } ta.remove(); return; } navigator.clipboard.writeText(text).then(()=> showToast('Copied to clipboard')).catch(()=> alert('Copy failed')); }

// Eligibility: last donation must be at least 90 days ago
function eligibleForDonation(lastDate){ if(!lastDate) return true; try{ const d = new Date(lastDate); if(isNaN(d)) return true; const diff = (Date.now() - d.getTime()) / (1000*60*60*24); return diff >= 90; }catch(e){return true} }

// Simple confirm using browser confirm or modal if present
function confirmDialog(title, text, ok){ const modal = document.getElementById('confirmModal'); if(modal){ const t = document.getElementById('confirmTitle'); const p = document.getElementById('confirmText'); t.textContent = title; p.textContent = text; modal.classList.add('open'); const onOk = ()=>{ modal.classList.remove('open'); ok && ok(); cleanup(); }; const onCancel = ()=>{ modal.classList.remove('open'); cleanup(); }; function cleanup(){ document.getElementById('confirmOk').removeEventListener('click', onOk); document.getElementById('confirmCancel').removeEventListener('click', onCancel); }
    document.getElementById('confirmOk').addEventListener('click', onOk); document.getElementById('confirmCancel').addEventListener('click', onCancel); return; }
  if(confirm(text)) ok && ok(); }

// Expose for pages
window.loadDonors = loadDonors; window.saveDonors = saveDonors; window.uid = uid; window.exportDonorsCSV = exportDonorsCSV; window.importDonorsCSV = importDonorsCSV; window.COMPAT = COMPAT; window.esc = esc; window.formatDate = formatDate; window.showToast = showToast; window.copyToClipboard = copyToClipboard; window.eligibleForDonation = eligibleForDonation; window.confirmDialog = confirmDialog;

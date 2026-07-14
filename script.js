/* ================= DATA: AGENDA ================= */
const CHARLAS = [
  {id:'MIE-1', day:'MIE', time:'09:00 AM - 10:00 AM', title:'Evaluación de gases arteriales en la práctica clínica: una herramienta clave para la toma de decisiones.', speaker:'Dr. Jorge Forero'},
  {id:'MIE-2', day:'MIE', time:'10:10 AM - 11:10 AM', title:'Abordaje ecográfico de las principales alteraciones de la vejiga: no todos son cálculos.', speaker:'Dr. Gino Pilco'},
  {id:'MIE-3', day:'MIE', time:'11:20 AM - 12:20 PM', title:'Ventilación mecánica en el paciente anestesiado: beneficios y aplicaciones en la práctica clínica.', speaker:'Dr. Jorge Forero'},
  {id:'MIE-4', day:'MIE', time:'01:20 PM - 02:20 PM', title:'Abordaje de las alteraciones renales más comunes detectadas por ultrasonido.', speaker:'Dr. Gino Pilco'},
  {id:'MIE-5', day:'MIE', time:'02:30 PM - 03:30 PM', title:'Fundamentos de Resonancia Magnética Veterinaria: Claves para el Diagnóstico por Imagen.', speaker:'Erick Leal'},
  {id:'MIE-6', day:'MIE', time:'03:40 PM - 04:40 PM', title:'Importancia de la revisión del sistema biliar mediante ultrasonido: lo que no te dicen los análisis de sangre.', speaker:'Dr. Gino Pilco'},
  {id:'MIE-7', day:'MIE', time:'04:50 PM - 05:50 PM', title:'Anestesia inhalatoria con sevoflurano: precisión, control y bienestar para el paciente.', speaker:'Dr. Jorge Forero'},
  {id:'JUE-1', day:'JUE', time:'08:10 AM - 09:10 AM', title:'Diagnóstico Clínico con IA: innovación para la morfología veterinaria.', speaker:'Ramón Ramos'},
  {id:'JUE-2', day:'JUE', time:'09:20 AM - 10:20 AM', title:'Revisando el ojo con ultrasonido: dando el primer paso antes de ir al oftalmólogo.', speaker:'Dr. Gino Pilco'},
  {id:'JUE-3', day:'JUE', time:'10:30 AM - 12:30 PM', title:'Cuando decides, lideras: El poder de asumir el control de tu vida, tu carrera y tus resultados.', speaker:'Julita Barreto'},
  {id:'JUE-4', day:'JUE', time:'01:10 PM - 02:10 PM', title:'Paciente braquicefálico: abordaje mediante rinoscopia, laringoscopia y broncoscopia a través de casos clínicos.', speaker:'Dr. Jorge Forero'},
  {id:'JUE-5', day:'JUE', time:'02:20 PM - 04:20 PM', title:'Liderazgo en la era de la IA: Lo que la inteligencia artificial nunca podrá reemplazar.', speaker:'Julita Barreto'},
  {id:'JUE-6', day:'JUE', time:'04:25 PM - 05:30 PM', title:'Ultrasonido como herramienta diagnóstica citológica: no puedo punzar lo que no veo.', speaker:'Dr. Gino Pilco'},
  {id:'VIE-1', day:'VIE', time:'08:10 AM - 09:10 AM', title:'Diagnóstico Clínico con IA: innovación para la morfología veterinaria.', speaker:'Ramón Ramos'},
  {id:'VIE-2', day:'VIE', time:'09:20 AM - 10:20 AM', title:'¿Cuándo la gastrocolonoscopia cambia el diagnóstico? Usos e indicaciones en perros y gatos a través de casos clínicos.', speaker:'Dr. Jorge Forero'},
  {id:'VIE-3', day:'VIE', time:'10:30 AM - 12:30 PM', title:'La ventaja invisible: Las habilidades humanas que hoy generan los mejores resultados.', speaker:'Julita Barreto'},
  {id:'VIE-4', day:'VIE', time:'01:10 PM - 02:10 PM', title:'Abordaje del ultrasonido en las patologías gástricas.', speaker:'Dr. Gino Pilco'},
  {id:'VIE-5', day:'VIE', time:'02:20 PM - 04:20 PM', title:'Reinventarse para crecer: Cómo evolucionar antes de que el mercado te obligue.', speaker:'Julita Barreto'},
  {id:'VIE-6', day:'VIE', time:'04:25 PM - 05:30 PM', title:'Ecografía de las patologías entéricas no obstructivas.', speaker:'Dr. Gino Pilco'},
];

const DAY_LABELS = { MIE:'Miércoles 05 de marzo', JUE:'Jueves 06 de marzo', VIE:'Viernes 07 de marzo' };

let selectedCharlaId = null;
let allRegistrations = [];
let refreshTimer = null;
let dashView = 'charla';

function findCharla(id){ return CHARLAS.find(c=>c.id===id); }
function countFor(charlaId){ return allRegistrations.filter(r=>r.charlaId===charlaId).length; }

/* ================= RENDER ================= */
function renderDayTabs(){
  const wrap = document.getElementById('dayTabs');
  wrap.innerHTML = '';
  Object.keys(DAY_LABELS).forEach(day=>{
    const btn = document.createElement('button');
    btn.textContent = DAY_LABELS[day];
    if(day==='MIE') btn.classList.add('active');
    btn.onclick = ()=>{ renderDayTabs(); renderCharlaList(); };
    wrap.appendChild(btn);
  });
}

function renderCharlaList(){
  const wrap = document.getElementById('charlaList');
  wrap.innerHTML = '';
  CHARLAS.forEach(c=>{
    const card = document.createElement('div');
    card.className = 'charla-card' + (c.id===selectedCharlaId ? ' selected' : '');
    card.onclick = ()=> selectCharla(c.id);
    card.innerHTML = `
      <div class="time">${c.time}</div>
      <div class="info">
        <div class="title">${c.title}</div>
        <div class="speaker"><i data-lucide="user" style="width:12px;height:12px;flex-shrink:0"></i> ${c.speaker}</div>
      </div>
      <div class="count-badge">${countFor(c.id)} inscritos</div>
    `;
    wrap.appendChild(card);
  });
}

function selectCharla(id){
  selectedCharlaId = id;
  const c = findCharla(id);
  document.getElementById('selectedCharlaLabel').textContent = c.time + ' · ' + c.title;
  document.getElementById('formCard').style.display = 'block';
  renderCharlaList();
  document.getElementById('formCard').scrollIntoView({behavior:'smooth', block:'start'});
}

function clearCharlaSelection(){
  selectedCharlaId = null;
  document.getElementById('formCard').style.display = 'none';
  renderCharlaList();
}

/* ================= STORAGE (Supabase) ================= */
function genId(){ return 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2,8); }

function storageOk(){
  if(!sb){ console.error('Supabase no configurado. Revisa SUPABASE_URL y SUPABASE_ANON_KEY en el <head>.'); return false; }
  return true;
}

async function saveRegistration(reg){
  if(!storageOk()) throw new Error('Sin backend');
  const { error } = await sb.from('inscripciones').insert([reg]);
  if(error) throw error;
}

async function loadAllRegistrations(){
  try{
    if(!storageOk()) return [];
    const { data, error } = await sb.from('inscripciones').select('*').order('timestamp', { ascending: false }).limit(100000);
    if(error){ console.error('Error cargando inscripciones', error); return []; }
    return data || [];
  }catch(e){ console.error('Error cargando inscripciones', e); return []; }
}

async function loadComerciales(){
  try{
    if(!storageOk()) return [];
    const { data, error } = await sb.from('comerciales').select('nombre');
    if(error){ console.error('Error cargando comerciales', error); return []; }
    return (data || []).map(r=>r.nombre);
  }catch(e){ return []; }
}

async function updateRegistration(reg){
  if(!storageOk()) throw new Error('Sin backend');
  const { error } = await sb.from('inscripciones').update(reg).eq('id', reg.id);
  if(error) throw error;
}

async function saveComercialIfNew(name){
  try{
    if(!storageOk()) return;
    const { data } = await sb.from('comerciales').select('nombre').eq('nombre', name);
    if(!data || data.length===0){
      const { error } = await sb.from('comerciales').insert([{ nombre: name }]);
      if(error) console.error('Error guardando comercial', error);
    }
  }catch(e){ console.error('Error guardando comercial', e); }
}

async function refreshComercialesDatalist(){
  const list = await loadComerciales();
  const sel = document.getElementById('fComercial');
  const current = sel.value;
  sel.innerHTML = '<option value="">Seleccionar comercial...</option>' +
    list.map(n=>`<option value="${n.replace(/"/g,'&quot;')}">${n}</option>`).join('');
  if(list.includes(current)) sel.value = current;
}

/* ================= SUBMIT ================= */
function showToast(msg, ok){
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.className = 'toast show ' + (ok ? 'ok' : 'err');
  setTimeout(()=>{ t.className = 'toast'; }, 4200);
}

function fireConfetti(){
  const wrap = document.createElement('div');
  wrap.className = 'confetti-burst';
  const colors = ['#3FC6CE','#FF6B4A','#FFC93C','#2FBE83','#7FDBE1','#0891B2','#EE5A3A','#F59E0B'];
  for(let i=0;i<40;i++){
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100+'%';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.width = (4+Math.random()*6)+'px';
    p.style.height = (4+Math.random()*6)+'px';
    p.style.borderRadius = Math.random()>.5 ? '50%' : '2px';
    p.style.animationDelay = (Math.random()*.8)+'s';
    p.style.animationDuration = (1.2+Math.random()*1)+'s';
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(()=> wrap.remove(), 3000);
}

async function submitRegistration(){
  const nombre = document.getElementById('fNombre').value.trim();
  const telefono = document.getElementById('fTelefono').value.trim();
  const correo = document.getElementById('fCorreo').value.trim();
  const empresa = document.getElementById('fEmpresa').value.trim();
  const comercial = document.getElementById('fComercial').value.trim();

  if(!selectedCharlaId){ showToast('Selecciona primero una charla.', false); return; }
  if(!nombre || !telefono || !comercial){
    showToast('Completa nombre, teléfono y comercial antes de enviar.', false);
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Guardando...';

  const c = findCharla(selectedCharlaId);
  const reg = {
    id: genId(),
    timestamp: new Date().toISOString(),
    nombre, telefono, correo, empresa, comercial,
    charlaId: c.id, charlaTitulo: c.title, charlaDia: c.day, charlaHora: c.time,
    asistio: false
  };

  try{
    await saveRegistration(reg);
    await saveComercialIfNew(comercial);
    allRegistrations.push(reg);
    await refreshComercialesDatalist();
    renderCharlaList();
    showToast('<i data-lucide="check-circle" style="width:16px;height:16px"></i> Inscripción registrada. Total en esta charla: ' + countFor(c.id), true);
    fireConfetti();
    document.getElementById('fNombre').value = '';
    document.getElementById('fTelefono').value = '';
    document.getElementById('fCorreo').value = '';
    document.getElementById('fEmpresa').value = '';
    document.getElementById('fNombre').focus();
  }catch(e){
    console.error(e);
    showToast('No se pudo guardar. Intenta de nuevo.', false);
  }finally{
    btn.disabled = false; btn.textContent = 'Registrar inscripción';
  }
}

/* ================= TABS ================= */
function switchTab(tab){
  document.getElementById('tab-registrar').hidden = tab!=='registrar';
  document.getElementById('tab-asistencia').hidden = tab!=='asistencia';
  document.getElementById('tab-seguimiento').hidden = tab!=='seguimiento';
  document.getElementById('tabBtnRegistrar').classList.toggle('active', tab==='registrar');
  document.getElementById('tabBtnAsistencia').classList.toggle('active', tab==='asistencia');
  document.getElementById('tabBtnSeguimiento').classList.toggle('active', tab==='seguimiento');

  if(refreshTimer){ clearInterval(refreshTimer); refreshTimer = null; }

  if(tab==='seguimiento'){
    loadDashboard();
    refreshTimer = setInterval(loadDashboard, 15000);
  } else if(tab==='asistencia'){
    initCheckinTab();
    refreshTimer = setInterval(refreshCheckinData, 15000);
  }
}

/* ================= ASISTENCIA (CHECK-IN) ================= */
let checkinDay = 'MIE';
let checkinCharlaId = null;
let checkinFilter = 'todos';

async function initCheckinTab(){
  allRegistrations = await loadAllRegistrations();
  renderCheckinDayTabs();
  renderCheckinCharlaList();
  if(checkinCharlaId){ renderCheckinList(); }
}

async function refreshCheckinData(){
  allRegistrations = await loadAllRegistrations();
  renderCheckinCharlaList();
  if(checkinCharlaId) renderCheckinList();
}

function renderCheckinDayTabs(){
  const wrap = document.getElementById('checkinDayTabs');
  wrap.innerHTML = '';
  Object.keys(DAY_LABELS).forEach(day=>{
    const btn = document.createElement('button');
    btn.textContent = DAY_LABELS[day].split(' de')[0];
    if(day===checkinDay) btn.classList.add('active');
    btn.onclick = ()=>{ checkinDay = day; renderCheckinDayTabs(); renderCheckinCharlaList(); };
    wrap.appendChild(btn);
  });
}

function renderCheckinCharlaList(){
  const wrap = document.getElementById('checkinCharlaList');
  wrap.innerHTML = '';
  CHARLAS.filter(c=>c.day===checkinDay).forEach(c=>{
    const total = countFor(c.id);
    const presentes = allRegistrations.filter(r=>r.charlaId===c.id && r.asistio).length;
    const card = document.createElement('div');
    card.className = 'charla-card';
    card.onclick = ()=> openCheckin(c.id);
    card.innerHTML = `
      <div class="time">${c.time}</div>
      <div class="info">
        <div class="title">${c.title}</div>
        <div class="speaker"><i data-lucide="user" style="width:12px;height:12px;flex-shrink:0"></i> ${c.speaker}</div>
      </div>
      <div class="count-badge">${presentes} / ${total} asistieron</div>
    `;
    wrap.appendChild(card);
  });
}

function openCheckin(charlaId){
  checkinCharlaId = charlaId;
  const c = findCharla(charlaId);
  document.getElementById('checkinCharlaLabel').textContent = c.time + ' · ' + c.title;
  document.getElementById('checkinListCard').style.display = 'block';
  document.getElementById('checkinSearch').value = '';
  checkinFilter = 'todos';
  document.getElementById('checkinFilterAll').classList.add('active');
  document.getElementById('checkinFilterPend').classList.remove('active');
  document.getElementById('checkinFilterOk').classList.remove('active');
  renderCheckinList();
  document.getElementById('checkinListCard').scrollIntoView({behavior:'smooth', block:'start'});
}

function closeCheckin(){
  checkinCharlaId = null;
  document.getElementById('checkinListCard').style.display = 'none';
}

function setCheckinFilter(f){
  checkinFilter = f;
  document.getElementById('checkinFilterAll').classList.toggle('active', f==='todos');
  document.getElementById('checkinFilterPend').classList.toggle('active', f==='pendiente');
  document.getElementById('checkinFilterOk').classList.toggle('active', f==='presente');
  renderCheckinList();
}

function renderCheckinList(){
  if(!checkinCharlaId) return;
  const search = document.getElementById('checkinSearch').value.trim().toLowerCase();
  let rows = allRegistrations.filter(r=>r.charlaId===checkinCharlaId);

  if(search){
    rows = rows.filter(r=>
      (r.nombre||'').toLowerCase().includes(search) ||
      (r.empresa||'').toLowerCase().includes(search)
    );
  }
  if(checkinFilter==='presente') rows = rows.filter(r=>r.asistio);
  if(checkinFilter==='pendiente') rows = rows.filter(r=>!r.asistio);

  rows = rows.slice().sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||''));

  const totalCharla = allRegistrations.filter(r=>r.charlaId===checkinCharlaId).length;
  const presentesCharla = allRegistrations.filter(r=>r.charlaId===checkinCharlaId && r.asistio).length;
  document.getElementById('checkinCounter').innerHTML =
    `<span class="checkin-counter-pill" style="color:#7FDBE1;">${presentesCharla} / ${totalCharla} presentes</span>`;

  const list = document.getElementById('checkinList');
  list.innerHTML = rows.map(r=>`
    <div class="attendee-row ${r.asistio ? 'is-present' : ''}">
      <div class="a-info">
        <div class="a-name">${r.nombre||''}</div>
        <div class="a-meta">${r.empresa ? r.empresa+' · ' : ''}${r.telefono||''}${r.comercial ? ' · registró: '+r.comercial : ''}</div>
      </div>
      <button class="a-toggle ${r.asistio ? 'to-absent' : 'to-present'}" onclick="toggleAsistencia('${r.id}')">
        ${r.asistio ? '<i data-lucide="check-circle" style="width:14px;height:14px"></i> Presente' : 'Marcar presente'}
      </button>
    </div>
  `).join('');

  document.getElementById('checkinEmpty').style.display = rows.length===0 ? 'block' : 'none';
}

async function toggleAsistencia(regId){
  const reg = allRegistrations.find(r=>r.id===regId);
  if(!reg) return;
  reg.asistio = !reg.asistio;
  renderCheckinList();
  renderCheckinCharlaList();
  try{
    await updateRegistration(reg);
  }catch(e){
    console.error('No se pudo guardar la asistencia', e);
    reg.asistio = !reg.asistio;
    renderCheckinList();
    renderCheckinCharlaList();
  }
}

/* ================= DASHBOARD ================= */
async function loadDashboard(){
  allRegistrations = await loadAllRegistrations();
  renderStats();
  renderAggTable();
  populateCharlaFilter();
  renderFullTable();
  renderCharlaList();
}

function renderStats(){
  const total = allRegistrations.length;
  const totalAsistio = allRegistrations.filter(r=>r.asistio).length;
  const pctAsistio = total>0 ? Math.round((totalAsistio/total)*100) : 0;
  const byCharla = {};
  const byComercial = {};
  allRegistrations.forEach(r=>{
    byCharla[r.charlaId] = (byCharla[r.charlaId]||0) + 1;
    byComercial[r.comercial] = (byComercial[r.comercial]||0) + 1;
  });
  let topCharlaId = null, topCharlaN = 0;
  Object.entries(byCharla).forEach(([k,v])=>{ if(v>topCharlaN){topCharlaN=v; topCharlaId=k;} });
  let topComercial = null, topComercialN = 0;
  Object.entries(byComercial).forEach(([k,v])=>{ if(v>topComercialN){topComercialN=v; topComercial=k;} });

  const topCharla = topCharlaId ? findCharla(topCharlaId) : null;

  document.getElementById('statGrid').innerHTML = `
    <div class="stat-card">
      <div class="label">Total inscritos</div>
      <div class="value">${total}</div>
      <div class="sub">en las 3 jornadas</div>
    </div>
    <div class="stat-card">
      <div class="label">Asistencia confirmada</div>
      <div class="value">${totalAsistio}</div>
      <div class="sub">${pctAsistio}% de los inscritos</div>
    </div>
    <div class="stat-card">
      <div class="label">Charla líder</div>
      <div class="value">${topCharlaN || 0}</div>
      <div class="sub">${topCharla ? (topCharla.time + ' · ' + topCharla.title.slice(0,32) + (topCharla.title.length>32?'…':'')) : 'Sin datos aún'}</div>
    </div>
    <div class="stat-card">
      <div class="label">Comercial líder</div>
      <div class="value">${topComercialN || 0}</div>
      <div class="sub">${topComercial || 'Sin datos aún'}</div>
    </div>
  `;
}

function setDashView(v){
  dashView = v;
  document.getElementById('viewByCharla').classList.toggle('active', v==='charla');
  document.getElementById('viewByComercial').classList.toggle('active', v==='comercial');
  renderAggTable();
}

function renderAggTable(){
  const thead = document.getElementById('aggThead');
  const tbody = document.getElementById('aggTbody');
  const empty = document.getElementById('aggEmpty');

  let rows = [];
  if(dashView==='charla'){
    thead.innerHTML = '<tr><th>Charla</th><th>Día</th><th>Inscritos</th><th>Asistieron</th></tr>';
    const counts = {};
    const present = {};
    allRegistrations.forEach(r=>{
      counts[r.charlaId] = (counts[r.charlaId]||0)+1;
      if(r.asistio) present[r.charlaId] = (present[r.charlaId]||0)+1;
    });
    rows = CHARLAS.map(c=>({label:c.time+' — '+c.title, day:DAY_LABELS[c.day].split(' de')[0], n:counts[c.id]||0, p:present[c.id]||0}))
                  .sort((a,b)=>b.n-a.n);
  } else {
    thead.innerHTML = '<tr><th>Comercial</th><th></th><th>Inscritos</th><th></th></tr>';
    const counts = {};
    allRegistrations.forEach(r=> counts[r.comercial] = (counts[r.comercial]||0)+1 );
    rows = Object.entries(counts).map(([name,n])=>({label:name, day:'', n, p:null})).sort((a,b)=>b.n-a.n);
  }

  const maxN = Math.max(1, ...rows.map(r=>r.n));
  tbody.innerHTML = rows.map(r=>`
    <tr>
      <td>${r.label}</td>
      <td>${r.day}</td>
      <td>
        <div class="bar-cell">
          <span class="count-strong">${r.n}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${(r.n/maxN*100).toFixed(0)}%"></div></div>
        </div>
      </td>
      <td>${r.p===null ? '' : `<span class="count-strong">${r.p}</span> <span class="hint">/ ${r.n}</span>`}</td>
    </tr>
  `).join('');

  empty.style.display = allRegistrations.length===0 ? 'block' : 'none';
  document.getElementById('aggTable').style.display = allRegistrations.length===0 ? 'none' : 'table';
}

function populateCharlaFilter(){
  const sel = document.getElementById('filterCharla');
  const dayFilter = document.getElementById('filterDay').value;
  const current = sel.value;
  const options = CHARLAS.filter(c=> !dayFilter || c.day===dayFilter);
  sel.innerHTML = '<option value="">Todas las charlas</option>' +
    options.map(c=>`<option value="${c.id}">${c.time} — ${c.title.slice(0,50)}${c.title.length>50?'…':''}</option>`).join('');
  if(options.some(c=>c.id===current)) sel.value = current;
}

function onFilterDayChange(){
  populateCharlaFilter();
  renderFullTable();
}

function renderFullTable(){
  const search = document.getElementById('searchInput').value.trim().toLowerCase();
  const dayFilter = document.getElementById('filterDay').value;
  const charlaFilter = document.getElementById('filterCharla').value;
  const asistioFilter = document.getElementById('filterAsistio').value;

  let rows = allRegistrations.slice().sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp));
  if(dayFilter) rows = rows.filter(r=>r.charlaDia===dayFilter);
  if(charlaFilter) rows = rows.filter(r=>r.charlaId===charlaFilter);
  if(asistioFilter==='si') rows = rows.filter(r=>r.asistio);
  if(asistioFilter==='no') rows = rows.filter(r=>!r.asistio);
  if(search){
    rows = rows.filter(r=>
      (r.nombre||'').toLowerCase().includes(search) ||
      (r.empresa||'').toLowerCase().includes(search) ||
      (r.comercial||'').toLowerCase().includes(search)
    );
  }

  const tbody = document.getElementById('fullTbody');
  tbody.innerHTML = rows.map(r=>{
    const d = new Date(r.timestamp);
    const fecha = isNaN(d) ? '' : d.toLocaleString('es-CO', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
    return `<tr>
      <td>${fecha}</td>
      <td>${r.nombre||''}</td>
      <td>${r.telefono||''}</td>
      <td>${r.correo||''}</td>
      <td>${r.empresa||''}</td>
      <td>${r.charlaHora||''} — ${(r.charlaTitulo||'').slice(0,40)}${(r.charlaTitulo||'').length>40?'…':''}</td>
      <td>${r.comercial||''}</td>
      <td>${r.asistio ? '<span style="color:var(--success-500);font-weight:700;"><i data-lucide="check-circle" style="width:14px;height:14px"></i> Sí</span>' : '<span class="hint">Pendiente</span>'}</td>
    </tr>`;
  }).join('');

  document.getElementById('fullEmpty').style.display = rows.length===0 ? 'block' : 'none';
  document.getElementById('fullTable').style.display = rows.length===0 ? 'none' : 'table';
}

/* ================= EXPORT ================= */
function csvEscape(v){
  const s = (v===undefined||v===null) ? '' : String(v);
  if(/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}
function exportCSV(){
  const header = ['Fecha registro','Nombre','Telefono','Correo','Empresa','Dia','Hora charla','Charla','Comercial','Asistio'];
  const lines = [header.join(',')];
  allRegistrations.slice().sort((a,b)=> new Date(a.timestamp)-new Date(b.timestamp)).forEach(r=>{
    lines.push([
      r.timestamp||'', r.nombre||'', r.telefono||'', r.correo||'', r.empresa||'',
      DAY_LABELS[r.charlaDia]||r.charlaDia||'', r.charlaHora||'', r.charlaTitulo||'', r.comercial||'',
      r.asistio ? 'Si' : 'No'
    ].map(csvEscape).join(','));
  });
  const blob = new Blob(['\uFEFF' + lines.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inscripciones_cvdc_2026.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ================= BOOT ================= */
(function boot(){
  document.getElementById('loader')?.classList.add('hidden');
  renderDayTabs();
  renderCharlaList();
  refreshComercialesDatalist().then(()=> loadAllRegistrations().then(r=>{
    allRegistrations = r;
    renderCharlaList();
  }));
  let _t;
  const obs = new MutationObserver(()=>{
    clearTimeout(_t);
    _t = setTimeout(()=> lucide && lucide.createIcons && lucide.createIcons(), 50);
  });
  obs.observe(document.getElementById('app'), { childList:true, subtree:true });
  if(lucide) lucide.createIcons();
})();

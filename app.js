// Tema: blanco por defecto; el docente puede activar el modo oscuro
const aplicarTema=t=>{document.documentElement.dataset.theme=t;const b=document.getElementById("tema");b.textContent=t=="dark"?"☀️ Modo claro":"🌙 Modo oscuro";b.setAttribute("aria-pressed",t=="dark")};
let tema="light";try{tema=localStorage.getItem("unt_tema")==="dark"?"dark":"light"}catch(e){}
const TABS=[["tesis","Mis tesis"],["avisos","Avisos"],["solicitar","Solicitar capacitación"],["mis","Mis solicitudes"]];
const DAY=864e5, today=new Date(); today.setHours(0,0,0,0);
const plus=n=>new Date(+today+n*DAY);
// Datos de ejemplo: reemplazar por la base de datos real de la UNT
const TESIS=[
 {t:"Participación política de las mujeres en los gobiernos locales de La Libertad",e:"María Fernanda Quispe R.",rol:"Asesor",d:plus(4),est:"Informe final aprobado",lugar:"Sala de grados, 10:00 a. m."},
 {t:"Transparencia y acceso a la información pública en municipalidades provinciales",e:"Luis Alberto Vargas C.",rol:"Jurado",d:plus(13),est:"En revisión por jurados",lugar:"Auditorio de la Facultad, 4:00 p. m."},
 {t:"Partidos políticos y crisis de representación en el Perú 2016-2024",e:"Daniela Rojas S.",rol:"Asesor",d:plus(27),est:"Corrección de observaciones",lugar:"Por definir"},
 {t:"Gobernanza digital y participación ciudadana en Trujillo",e:"Jorge Luis Paredes A.",rol:"Jurado",d:plus(58),est:"Proyecto aprobado",lugar:"Por definir"},
 {t:"Conflictos socioambientales y consulta previa en la sierra liberteña",e:"Carla Sofía Medina T.",rol:"Asesor",d:plus(96),est:"Desarrollo del proyecto",lugar:"Por definir"}
];
const dias=d=>Math.round((d-today)/DAY);
const nivel=n=>n<=7?"r":n<=30?"y":"g";
const fmt=d=>d.toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let sol=[],tab="tesis";
try{sol=JSON.parse(localStorage.getItem("unt_sol")||"[]")}catch(e){}
const guardar=()=>{try{localStorage.setItem("unt_sol",JSON.stringify(sol))}catch(e){}};

function avisos(){
 const a=TESIS.map(x=>({x,n:dias(x.d)})).filter(o=>o.n<=30).sort((p,q)=>p.n-q.n).map(({x,n})=>({lv:nivel(n),
  ti:n<=0?"La sustentación es hoy":`Sustentación en ${n} ${n==1?"día":"días"}`,
  tx:`${x.e} sustenta el ${fmt(x.d)}. Usted es ${x.rol.toLowerCase()}. ${x.n?"":""}Lugar: ${x.lugar}. Reserve ese horario en su agenda.`}));
 sol.slice(-3).forEach(s=>a.push({lv:"g",ti:"Solicitud registrada",tx:`Su solicitud «${s.prog}» fue enviada a ${s.dest}. Recibirá aquí la respuesta.`}));
 return a;
}
function nav(){
 const n=avisos().filter(a=>a.lv=="r"||a.lv=="y").length;
 document.getElementById("nav").innerHTML=TABS.map(([k,l])=>`<button role="tab" aria-selected="${k==tab}" data-k="${k}">${l}${k=="avisos"&&n?`<span class="badge">${n}</span>`:""}</button>`).join("");
 document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>{tab=b.dataset.k;render();scrollTo(0,0)});
}
function vTesis(){
 const legend=`<div class="legend"><span><i class="dot" style="background:var(--g)"></i>Más de 30 días</span><span><i class="dot" style="background:var(--y)"></i>8 a 30 días</span><span><i class="dot" style="background:var(--r)"></i>7 días o menos</span></div>`;
 return `<h2>Mis tesis asignadas</h2><p class="sub">Tesis que asesora o revisa como jurado, ordenadas por fecha de sustentación.</p>${legend}`+
 [...TESIS].sort((a,b)=>a.d-b.d).map(x=>{const n=dias(x.d),lv=nivel(n),p=Math.max(6,Math.min(100,100-n/90*100));
  const txt=n<=0?"Hoy":n==1?"Falta 1 día":`Faltan ${n} días`;
  return `<article class="card"><div class="row"><div style="flex:1;min-width:220px"><h3 style="font-size:18px">${esc(x.t)}</h3><div class="meta">Tesista: ${esc(x.e)}</div></div><span class="pill n">${x.rol}</span></div>
  <div class="bar ${lv}" role="progressbar" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100" aria-label="${txt}"><i style="width:${p}%"></i></div>
  <div class="row"><b style="color:var(--${lv})">${txt}</b><span class="meta">Sustentación: ${fmt(x.d)}</span></div>
  <div class="meta" style="margin-top:6px">Estado: ${x.est} · ${x.lugar}</div></article>`}).join("");
}
function vAvisos(){
 const a=avisos();
 return `<h2>Avisos</h2><p class="sub">Recordatorios de sustentaciones próximas y novedades de sus solicitudes.</p>`+
 (a.length?a.map(o=>`<div class="card note ${o.lv}"><div><h3 style="font-size:17px">${o.ti}</h3><p style="margin:4px 0 0">${esc(o.tx)}</p></div></div>`).join(""):`<div class="card empty">No tiene avisos. Le notificaremos cuando una sustentación esté a 30 días o menos.</div>`);
}
function vSolicitar(){
 const opt=a=>a.map(o=>`<option>${o}</option>`).join("");
 return `<h2>Solicitar capacitación</h2><p class="sub">Cuéntenos qué curso, diplomado o maestría desea seguir y si necesita apoyo económico. Demora unos 3 minutos.</p>
 <form id="f" class="card" novalidate><div class="grid">
  <div><label for="nom">Nombres y apellidos</label><input id="nom" required autocomplete="name"></div>
  <div><label for="mail">Correo institucional</label><input id="mail" type="email" required autocomplete="email" placeholder="usuario@unitru.edu.pe"></div>
  <div><label for="cat">Categoría docente</label><select id="cat">${opt(["Principal","Asociado","Auxiliar","Contratado"])}</select></div>
  <div><label for="dest">¿A quién va dirigida?</label><select id="dest">${opt(["Escuela de Ciencia Política","Facultad de Derecho y Ciencias Políticas","Rectorado","Otra entidad pertinente"])}</select></div>
  <div><label for="tipo">Tipo de capacitación</label><select id="tipo">${opt(["Curso","Diplomado","Maestría","Doctorado","Congreso o taller","Otro"])}</select></div>
  <div><label for="mod">Modalidad</label><select id="mod">${opt(["Presencial","Virtual","Semipresencial"])}</select></div>
  <div class="full"><label for="prog">Nombre del programa</label><input id="prog" required placeholder="Ej.: Maestría en Gestión Pública"></div>
  <div class="full"><label for="inst">Institución que lo dicta</label><input id="inst" required></div>
  <div><label for="ini">Fecha de inicio</label><input id="ini" type="date" required></div>
  <div><label for="fin">Fecha de término</label><input id="fin" type="date" required></div>
  <div><label for="cost">Costo total (S/)</label><input id="cost" type="number" min="0" step="0.01" inputmode="decimal"></div>
  <div><label for="apoyo">Apoyo económico solicitado (S/)</label><input id="apoyo" type="number" min="0" step="0.01" inputmode="decimal"><div class="hint">Déjelo en blanco si no requiere apoyo.</div></div>
  <div class="full"><label for="just">¿Por qué necesita esta capacitación?</label><textarea id="just" rows="4" required placeholder="Explique cómo mejorará su labor docente o de investigación."></textarea></div>
 </div><p id="err" style="color:var(--r);font-weight:600;min-height:22px"></p><button class="btn" type="submit">Enviar solicitud</button></form>`;
}
function vMis(){
 return `<h2>Mis solicitudes</h2><p class="sub">Seguimiento de las capacitaciones que ha solicitado.</p>`+
 (sol.length?[...sol].reverse().map(s=>`<article class="card"><div class="row"><h3 style="font-size:18px">${esc(s.prog)}</h3><span class="pill y">${s.estado}</span></div>
 <div class="meta">${s.tipo} · ${s.mod} · ${esc(s.inst)}</div><div class="meta">Dirigida a: ${esc(s.dest)} · Enviada el ${s.fecha}</div>
 <div style="margin-top:6px">Apoyo solicitado: <b>${s.apoyo?"S/ "+Number(s.apoyo).toFixed(2):"Ninguno"}</b></div></article>`).join("")
 :`<div class="card empty">Aún no ha enviado solicitudes.<br><br><button class="btn" style="width:auto" id="go">Solicitar capacitación</button></div>`);
}
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),3500)}
function render(){
 nav();
 const v={tesis:vTesis,avisos:vAvisos,solicitar:vSolicitar,mis:vMis}[tab];
 document.getElementById("app").innerHTML=v();
 const g=document.getElementById("go");if(g)g.onclick=()=>{tab="solicitar";render()};
 const f=document.getElementById("f");
 if(f)f.onsubmit=e=>{e.preventDefault();
  const v=id=>f.querySelector("#"+id).value.trim(),err=f.querySelector("#err");
  for(const id of ["nom","mail","prog","inst","ini","fin","just"])if(!v(id)){err.textContent="Complete todos los campos obligatorios.";f.querySelector("#"+id).focus();return}
  if(!/^\S+@\S+\.\S+$/.test(v("mail"))){err.textContent="Ingrese un correo válido.";return}
  if(v("fin")<v("ini")){err.textContent="La fecha de término debe ser posterior a la de inicio.";return}
  sol.push({nom:v("nom"),mail:v("mail"),prog:v("prog"),inst:v("inst"),tipo:v("tipo"),mod:v("mod"),dest:v("dest"),apoyo:v("apoyo"),estado:"Enviada",fecha:new Date().toLocaleDateString("es-PE")});
  guardar();tab="mis";render();scrollTo(0,0);toast("Solicitud enviada");
 };
}
render();
aplicarTema(tema);
document.getElementById("tema").onclick=()=>{tema=tema=="dark"?"light":"dark";try{localStorage.setItem("unt_tema",tema)}catch(e){}aplicarTema(tema)};

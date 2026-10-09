// ============================================================
// KONFIGURASI
// ============================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuHX4uIl2CYFOj_ggLUMtGry4twjJXzOObvXvkbnXYc-iea4e1Dd12MesDnjv3FlWfJQ/exec"; // ← GANTI

const DOMAIN_ORDER = [
  "Fine Motor Skills",
  "Focus & Attention",
  "Problem Solving & Logical Thinking",
  "Creativity",
  "Independence"
];

// ============================================================
// POPUP & TOAST
// ============================================================
function showPopup(type, title, message, btnText = "OK") {
  return new Promise((resolve) => {
    const icons = {
      success: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      warning: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info:    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
      <div class="popup-box">
        <div class="popup-icon popup-icon-${type}">${icons[type] || icons.info}</div>
        <h3 style="font-size:1rem;font-weight:800;color:#0f172a;margin-bottom:0.5rem">${title}</h3>
        <p style="font-size:0.75rem;color:#64748b;line-height:1.5;margin-bottom:1.25rem">${message}</p>
        <button id="popup-btn" class="gradient-purple" style="width:100%;color:white;font-weight:700;padding:0.85rem;border-radius:1rem;font-size:0.8rem;border:none;cursor:pointer;box-shadow:0 8px 20px -4px rgba(124,58,237,0.4)">${btnText}</button>
      </div>`;
    document.body.appendChild(overlay);
    const close = () => { overlay.style.animation = "overlayIn 0.2s ease-in reverse"; setTimeout(() => { overlay.remove(); resolve(); }, 180); };
    overlay.querySelector("#popup-btn").onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
  });
}

function showConfirm(title, message, btnYes = "Ya", btnNo = "Batal") {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
      <div class="popup-box">
        <div class="popup-icon popup-icon-warning">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h3 style="font-size:1rem;font-weight:800;color:#0f172a;margin-bottom:0.5rem">${title}</h3>
        <p style="font-size:0.75rem;color:#64748b;line-height:1.5;margin-bottom:1.25rem">${message}</p>
        <div style="display:flex;gap:0.5rem">
          <button id="popup-no" style="flex:1;background:#f1f5f9;color:#475569;font-weight:700;padding:0.85rem;border-radius:1rem;font-size:0.8rem;border:none;cursor:pointer">${btnNo}</button>
          <button id="popup-yes" class="gradient-purple" style="flex:1;color:white;font-weight:700;padding:0.85rem;border-radius:1rem;font-size:0.8rem;border:none;cursor:pointer;box-shadow:0 8px 20px -4px rgba(124,58,237,0.4)">${btnYes}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const done = (val) => { overlay.style.animation = "overlayIn 0.2s ease-in reverse"; setTimeout(() => { overlay.remove(); resolve(val); }, 180); };
    overlay.querySelector("#popup-yes").onclick = () => done(true);
    overlay.querySelector("#popup-no").onclick = () => done(false);
    overlay.onclick = (e) => { if (e.target === overlay) done(false); };
  });
}

function showLoading(message = "Memproses...") {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";
  overlay.innerHTML = `
    <div class="popup-box">
      <div class="popup-icon popup-icon-loading">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      </div>
      <h3 style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:0.35rem">Mohon Tunggu</h3>
      <p id="loading-msg" style="font-size:0.75rem;color:#64748b">${message}</p>
    </div>`;
  document.body.appendChild(overlay);
  return {
    close: () => { overlay.style.animation = "overlayIn 0.2s ease-in reverse"; setTimeout(() => overlay.remove(), 180); },
    update: (msg) => { const el = overlay.querySelector("#loading-msg"); if (el) el.innerText = msg; }
  };
}

function showToast(message, type = "success") {
  const colors = { success: { bg: "#10b981", icon: "✓" }, error: { bg: "#f43f5e", icon: "✕" }, warning: { bg: "#f59e0b", icon: "!" }, info: { bg: "#7c3aed", icon: "i" } };
  const c = colors[type] || colors.info;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<div style="width:1.5rem;height:1.5rem;background:${c.bg};color:white;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;margin-right:0.5rem">${c.icon}</div><span style="color:#0f172a">${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add("fade-out"); setTimeout(() => toast.remove(), 300); }, 2800);
}

// ============================================================
// STATE
// ============================================================
let globalSiswa = [];
let globalNilai = [];
let globalAkun = [];
let globalRubrik = [];
let globalMateri = [];
let globalLevel = [];
let currentLoggedInUser = null;
let myChartInstance = null;
let selectedSiswaId = "";
let selectedPertemuan = null;
let editingRubrikNo = null;
let editingRubrikUsia = null;
let editingMateriPertemuan = null;
let editingMateriUsia = null;
let pendingFotoBase64 = null;
let pendingFotoMime = null;
let laporanData = null;
let dataReady = false;

// ============================================================
// HELPER
// ============================================================
function getSkor(n) {
  const num = parseInt(n.skor);
  return isNaN(num) ? 0 : num;
}
function esc(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}
function fmtTanggal(ts) {
  try { return new Date(ts).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'}); }
  catch(e) { return "-"; }
}
function renderBintangHtml(skor) {
  const s = Math.max(0, Math.min(4, parseInt(skor) || 0));
  let html = '<span style="color:#f59e0b;font-size:1rem;letter-spacing:0.05rem">';
  for (let i = 1; i <= 4; i++) html += i <= s ? '★' : '<span style="color:#e2e8f0">★</span>';
  html += '</span>';
  return html;
}
function normalisasiUsia(usiaStr) {
  const m = String(usiaStr).match(/\d+/);
  return m ? m[0] : String(usiaStr);
}

function renderAvatar(siswa, size = 'md', shape = 'rounded') {
  const sizes = {
    sm: { w: '2.5rem', font: 'text-sm', radius: '0.75rem' },
    md: { w: '3rem', font: 'text-base', radius: '0.75rem' },
    lg: { w: '3.5rem', font: 'text-lg', radius: '1rem' },
    xl: { w: '5rem', font: 'text-2xl', radius: '1.5rem' }
  };
  const s = sizes[size] || sizes.md;
  const radius = shape === 'circle' ? '9999px' : s.radius;
  const foto = siswa && siswa.foto_url ? siswa.foto_url : '';
  const initial = (siswa && siswa.nama_siswa) ? esc(siswa.nama_siswa).charAt(0) : '?';
  if (foto) {
    return `<img src="${esc(foto)}" alt="" class="object-cover shrink-0" style="width:${s.w};height:${s.w};border-radius:${radius}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="gradient-purple text-white items-center justify-center font-bold shrink-0 ${s.font}" style="width:${s.w};height:${s.w};border-radius:${radius};display:none">${initial}</div>`;
  }
  return `<div class="gradient-purple text-white flex items-center justify-center font-bold shrink-0 ${s.font}" style="width:${s.w};height:${s.w};border-radius:${radius}">${initial}</div>`;
}

function getRubrikByUsia(usia) {
  const u = normalisasiUsia(usia);
  return globalRubrik.filter(r => normalisasiUsia(r.usia) === u);
}

// ============================================================
// LOAD DATA
// ============================================================
window.onload = function() {
  fetchDatabaseData().finally(() => {
    const splash = document.getElementById("splash");
    splash.style.transition = "opacity 0.4s";
    splash.style.opacity = "0";
    setTimeout(() => {
      splash.classList.add("hidden");
      document.getElementById("login-wrapper").classList.remove("hidden");
    }, 400);
  });
};

function fetchDatabaseData() {
  const statusEl = document.getElementById("login-status");
  const loginBtn = document.getElementById("login-btn");
  if (statusEl) statusEl.innerText = "Memuat data sistem...";
  if (loginBtn) { loginBtn.disabled = true; loginBtn.innerText = "Memuat data..."; }

  return fetch(`${SCRIPT_URL}?action=getAllData`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(res => {
      if (res.status !== "success") throw new Error(res.message || "Gagal memuat");
      const d = res.data || {};
      globalSiswa   = (d.siswa   || []).map(s => ({...s, siswa_id: String(s.siswa_id || "")}));
      globalNilai   = d.nilai    || [];
      globalAkun    = d.akun     || [];
      globalRubrik  = (d.rubrik  || []).sort((a,b) => parseInt(a.no) - parseInt(b.no));
      globalMateri  = (d.materi  || []).sort((a,b) => parseInt(a.pertemuan) - parseInt(b.pertemuan));
      globalLevel   = (d.level   || []).sort((a,b) => parseInt(a.pertemuan_min) - parseInt(b.pertemuan_min));
      dataReady = true;
      if (statusEl) statusEl.innerText = "✅ Sistem siap. Silakan login.";
      if (loginBtn) { loginBtn.disabled = false; loginBtn.innerText = "Masuk"; }
      populateAdminList();
      populateLevelDropdown();
    })
    .catch(err => {
      console.error("Fetch error:", err);
      if (statusEl) statusEl.innerText = "❌ Gagal memuat: " + err.message;
      if (loginBtn) { loginBtn.disabled = true; loginBtn.innerText = "Gagal memuat"; }
    });
}

function populateLevelDropdown() {
  const sel = document.getElementById("add-level");
  if (!sel) return;
  sel.innerHTML = globalLevel.map(l => `<option>${esc(l.level)}</option>`).join('') || '<option>Level 1</option>';
}

function refreshData(callback) {
  return fetch(`${SCRIPT_URL}?action=getAllData`)
    .then(r => r.json())
    .then(res => {
      if (res.status !== "success") throw new Error("Gagal refresh");
      const d = res.data || {};
      globalNilai    = d.nilai    || [];
      globalSiswa    = (d.siswa || []).map(s => ({...s, siswa_id: String(s.siswa_id || "")}));
      globalRubrik   = (d.rubrik  || []).sort((a,b) => parseInt(a.no) - parseInt(b.no));
      globalMateri   = (d.materi  || []).sort((a,b) => parseInt(a.pertemuan) - parseInt(b.pertemuan));
      globalLevel    = (d.level   || []).sort((a,b) => parseInt(a.pertemuan_min) - parseInt(b.pertemuan_min));
      if (callback) callback();
    })
    .catch(err => { console.error("Refresh error:", err); showToast("Gagal refresh data", "error"); });
}

// ============================================================
// LOGIN / LOGOUT
// ============================================================
async function handleLogin(e) {
  e.preventDefault();
  if (!dataReady) { await showPopup("warning", "Data Belum Siap", "Sistem masih memuat data."); return; }
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value.trim();
  const found = globalAkun.find(acc => String(acc.username).toLowerCase() === u.toLowerCase() && String(acc.password) === p);
  if (!found) { await showPopup("error", "Login Gagal", "Username atau Password salah."); return; }
  currentLoggedInUser = found;
  document.getElementById("login-wrapper").classList.add("hidden");
  document.getElementById("app-wrapper").classList.remove("hidden");
  document.getElementById("app-wrapper").classList.add("flex");
  document.getElementById("user-badge").innerText = found.nama_pemilik;
  const roleLabels = { superadmin: "Super Admin", admin: "Admin", guru: "Guru Pembimbing", ortu: "Orang Tua" };
  document.getElementById("header-role").innerText = roleLabels[found.role] || found.role;
  renderBottomNav(found.role);
  if (found.role === "superadmin") { switchTab('dashboard'); renderDashboard(); }
  else if (found.role === "admin") switchTab('admin');
  else if (found.role === "guru") { switchTab('guru'); populateDropdownSiswaGuru(); }
  else if (found.role === "ortu") { switchTab('ortu'); renderLaporanAnak(); }
  showToast(`Selamat datang, ${found.nama_pemilik}!`, "success");
}

async function handleLogout() {
  const ok = await showConfirm("Keluar Akun", "Yakin ingin keluar?", "Ya, Keluar", "Batal");
  if (!ok) return;
  currentLoggedInUser = null;
  document.getElementById("app-wrapper").classList.add("hidden");
  document.getElementById("app-wrapper").classList.remove("flex");
  document.getElementById("login-wrapper").classList.remove("hidden");
  document.getElementById("bottom-nav").innerHTML = "";
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
  showToast("Berhasil logout", "info");
}

// ============================================================
// BOTTOM NAV
// ============================================================
function renderBottomNav(role) {
  const nav = document.getElementById("bottom-nav");
  const icons = {
    dashboard: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
    admin: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
    guru: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    silabus: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
    materi: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
    ortu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    sertifikat: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    capaian: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>`
  };

  let items = [];
  if (role === "superadmin") items = [
    { key: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { key: 'materi', icon: icons.materi, label: 'Materi' },
    { key: 'silabus', icon: icons.silabus, label: 'Rubrik' },
    { key: 'admin', icon: icons.admin, label: 'Siswa' }
  ];
  else if (role === "admin") items = [
    { key: 'admin', icon: icons.admin, label: 'Siswa' },
    { key: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { key: 'materi', icon: icons.materi, label: 'Materi' },
    { key: 'silabus', icon: icons.silabus, label: 'Rubrik' }
  ];
  else if (role === "guru") items = [
    { key: 'guru', icon: icons.guru, label: 'Nilai' },
    { key: 'dashboard-guru', icon: icons.capaian, label: 'Capaian' },
    { key: 'materi', icon: icons.materi, label: 'Materi' },
    { key: 'silabus', icon: icons.silabus, label: 'Rubrik' }
  ];
  else if (role === "ortu") items = [
    { key: 'ortu', icon: icons.ortu, label: 'Rapor' },
    { key: 'sertifikat', icon: icons.sertifikat, label: 'Laporan' }
  ];

  nav.innerHTML = `<div class="flex justify-around items-center pt-3 pb-2">${items.map(it => `
    <button onclick="switchTab('${it.key}')" id="nav-${it.key}" class="nav-btn flex flex-col items-center space-y-1 px-4 py-1 rounded-xl transition-all text-slate-400">
      ${it.icon}
      <span class="text-[10px] font-bold">${it.label}</span>
    </button>`).join('')}</div>`;
}

function switchTab(key) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const tab = document.getElementById(`tab-${key}`);
  if (tab) { tab.classList.remove('hidden'); tab.classList.add('fade-in'); }
  document.querySelectorAll('.nav-btn').forEach(btn => { btn.classList.remove('nav-active'); btn.classList.add('text-slate-400'); });
  const btn = document.getElementById(`nav-${key}`);
  if (btn) { btn.classList.add('nav-active'); btn.classList.remove('text-slate-400'); }
  if (key === 'silabus') renderRubrikList();
  if (key === 'materi') renderMateriList();
  if (key === 'dashboard') renderDashboard();
  if (key === 'dashboard-guru') renderDashboardGuru();
  if (key === 'sertifikat') loadLaporanList();
}

// ============================================================
// ADMIN - Siswa
// ============================================================
function populateAdminList() {
  const list = document.getElementById("list-siswa-mobile");
  const total = document.getElementById("admin-total-siswa");
  if (total) total.innerText = globalSiswa.length;
  if (!list) return;
  if (globalSiswa.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Belum ada siswa terdaftar.</p>`;
    return;
  }
  list.innerHTML = globalSiswa.map(s => `
    <div class="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-2xl">
      ${renderAvatar(s, 'md')}
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-slate-800 truncate">${esc(s.nama_siswa)}</p>
        <p class="text-[10px] text-slate-500 truncate">${esc(s.siswa_id)} • ${s.usia} thn • ${esc(s.level_saat_ini)}</p>
      </div>
      ${s.foto_url ? '<div class="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold shrink-0">📷</div>' : ''}
    </div>`).join('');
}

async function tambahSiswa(e) {
  e.preventDefault();
  const loading = showLoading("Menyimpan siswa...");
  const payload = {
    action: "addSiswa",
    id: document.getElementById("add-id").value,
    nama: document.getElementById("add-nama").value,
    usia: document.getElementById("add-usia").value,
    level: document.getElementById("add-level").value,
    orangTua: document.getElementById("add-ortu").value,
    username: document.getElementById("add-username").value,
    password: document.getElementById("add-password").value
  };
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    await new Promise(r => setTimeout(r, 1200));
    loading.close();
    await showPopup("success", "Berhasil! 🎉", "Siswa baru berhasil ditambahkan.");
    await refreshData(populateAdminList);
    showToast("Siswa berhasil ditambahkan", "success");
    e.target.reset();
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

// ============================================================
// GURU - PENILAIAN 5 DOMAIN SEKALIGUS
// ============================================================
function populateDropdownSiswaGuru() {
  const sel = document.getElementById("guru-pilih-siswa");
  if (!sel) return;
  sel.innerHTML = `<option value="">-- Pilih Siswa --</option>` +
    globalSiswa.map(s => `<option value="${esc(s.siswa_id)}">${esc(s.nama_siswa)} • ${s.usia} thn (${esc(s.siswa_id)})</option>`).join('');
}

function onPilihSiswa() {
  selectedSiswaId = document.getElementById("guru-pilih-siswa").value;
  selectedPertemuan = null;
  const infoBox = document.getElementById("guru-info-siswa");
  const stepPertemuan = document.getElementById("guru-step-pertemuan");
  const formBox = document.getElementById("guru-form-penilaian");
  const riwayatBox = document.getElementById("guru-riwayat");

  if (!selectedSiswaId) {
    infoBox.classList.add("hidden"); stepPertemuan.classList.add("hidden");
    formBox.classList.add("hidden"); riwayatBox.classList.add("hidden");
    return;
  }

  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  if (!siswa) return;

  const nilaiSiswa = globalNilai.filter(n => String(n.siswa_id) === String(selectedSiswaId));
  
  // Set pertemuan yang sudah dinilai lengkap (min 1 domain dinilai = dianggap selesai)
  const pertemuanDinilai = new Set();
  nilaiSiswa.forEach(n => {
    const k = String(n.pertemuan).replace(/\D/g, "");
    if (k) pertemuanDinilai.add(k);
  });

  // Ambil daftar pertemuan dari level siswa
  const levelSiswa = globalLevel.find(l => l.level === siswa.level_saat_ini);
  let allPertemuan = [];
  if (levelSiswa) {
    for (let p = parseInt(levelSiswa.pertemuan_min); p <= parseInt(levelSiswa.pertemuan_max); p++) allPertemuan.push(p);
  } else {
    allPertemuan = Array.from({length: 12}, (_, i) => i + 1);
  }
  const totalPertemuan = allPertemuan.length;
  const totalDinilai = allPertemuan.filter(p => pertemuanDinilai.has(String(p))).length;

  infoBox.innerHTML = `
    <div class="flex items-center space-x-4">
      <div class="relative">${renderAvatar(siswa, 'xl', 'circle')}</div>
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold truncate">${esc(siswa.nama_siswa)}</h3>
        <p class="text-xs text-white/80 mt-1">${esc(siswa.level_saat_ini)}</p>
        <p class="text-[10px] text-white/60 mt-0.5">ID: ${esc(siswa.siswa_id)} • Usia: ${siswa.usia} tahun</p>
      </div>
    </div>
    <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-3 space-y-2">
      <div class="flex justify-between text-xs">
        <span class="text-white/80">Progress Penilaian</span>
        <span class="font-bold">${totalDinilai}/${totalPertemuan} pertemuan</span>
      </div>
      <div class="w-full bg-white/20 rounded-full h-2">
        <div class="bg-white rounded-full h-2 transition-all duration-500" style="width: ${totalPertemuan > 0 ? (totalDinilai/totalPertemuan)*100 : 0}%"></div>
      </div>
      <p class="text-[10px] text-white/70">📌 5 domain dinilai sekaligus per pertemuan</p>
    </div>`;
  infoBox.classList.remove("hidden");

  const available = allPertemuan.filter(p => !pertemuanDinilai.has(String(p)));

  stepPertemuan.innerHTML = `
    <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Pilih Pertemuan (Usia ${siswa.usia} Thn)</label>
    <select id="guru-pilih-pertemuan" onchange="onPilihPertemuan()" class="w-full mt-1.5 px-3 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:border-purple-500 focus:bg-white focus:outline-none font-medium">
      ${available.length === 0
        ? `<option value="">🎉 Semua pertemuan sudah dinilai!</option>`
        : `<option value="">-- Pilih Pertemuan --</option>` + available.map(p => {
            const materi = globalMateri.find(m => String(m.pertemuan) === String(p) && normalisasiUsia(m.usia) === normalisasiUsia(siswa.usia));
            return `<option value="${p}">P${p}${materi ? ' - ' + esc(materi.judul_materi) : ''}</option>`;
          }).join('')}
    </select>`;
  stepPertemuan.classList.remove("hidden");
  formBox.classList.add("hidden");
  formBox.innerHTML = "";
  renderRiwayatPenilaian(nilaiSiswa);
  riwayatBox.classList.remove("hidden");
}

function onPilihPertemuan() {
  const val = document.getElementById("guru-pilih-pertemuan").value;
  const formBox = document.getElementById("guru-form-penilaian");
  if (!val) { formBox.classList.add("hidden"); formBox.innerHTML = ""; selectedPertemuan = null; return; }
  selectedPertemuan = val;
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const materi = globalMateri.find(m => String(m.pertemuan) === String(val) && normalisasiUsia(m.usia) === normalisasiUsia(siswa.usia));
  renderFormPenilaian5Domain(siswa, val, materi);
  formBox.classList.remove("hidden");
  formBox.classList.add("fade-in");
}

function renderFormPenilaian5Domain(siswa, pertemuan, materi) {
  const formBox = document.getElementById("guru-form-penilaian");
  const rubrikUsia = getRubrikByUsia(siswa.usia);
  
  if (rubrikUsia.length === 0) {
    formBox.innerHTML = `<div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl">
      <p class="text-xs text-amber-800 font-semibold">⚠️ Rubrik untuk usia ${siswa.usia} tahun belum tersedia.</p>
    </div>`;
    return;
  }

  // Ambil nilai existing per domain
  const nilaiExisting = {};
  globalNilai.filter(n => String(n.siswa_id) === String(siswa.siswa_id) && String(n.pertemuan).replace(/\D/g,"") === String(pertemuan))
    .forEach(n => {
      const existing = nilaiExisting[n.domain];
      if (!existing || new Date(n.timestamp) > new Date(existing.timestamp)) nilaiExisting[n.domain] = n;
    });

  const domainCards = DOMAIN_ORDER.map((dom, idx) => {
    const rubrikDom = rubrikUsia.filter(r => r.domain === dom);
    if (rubrikDom.length === 0) return ''; // skip jika tidak ada rubrik

    // Ambil indikator pertama (asumsi 1 indikator per domain)
    const rubrik = rubrikDom[0];
    const existing = nilaiExisting[dom];
    const skorAwal = existing ? existing.skor : 0;
    const catatanAwal = existing ? (existing.catatan || "") : "";
    const indikatorAwal = existing ? existing.indikator : rubrik.indikator;

    return `
      <div class="domain-card bg-white p-4 rounded-2xl border-2 border-slate-100 space-y-3" data-domain="${esc(dom)}">
        <div class="flex items-start space-x-2.5">
          <div class="w-8 h-8 gradient-purple rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">${idx + 1}</div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-900">${esc(dom)}</h4>
            <p class="text-[10px] text-slate-500 mt-0.5">${esc(rubrik.indikator)}</p>
          </div>
        </div>

        <div class="bg-purple-50 border-l-4 border-purple-500 p-2.5 rounded-lg">
          <p class="text-[9px] font-bold text-purple-700 uppercase tracking-wider mb-0.5">📌 Contoh Perilaku</p>
          <p class="text-[10px] text-slate-700 leading-relaxed">${esc(rubrik.contoh_perilaku)}</p>
        </div>

        <div class="space-y-1.5">
          ${[1,2,3,4].map(level => {
            const desc = rubrik[`star_${level}`];
            const labels = {1:"Perlu Banyak Bantuan",2:"Dengan Bimbingan",3:"Mandiri",4:"Berkembang Sangat Baik"};
            const colors = {1:"text-rose-600",2:"text-amber-600",3:"text-blue-600",4:"text-emerald-600"};
            const checked = skorAwal === level;
            return `
              <label class="block bg-slate-50 border-2 ${checked ? 'border-purple-500 bg-purple-50' : 'border-slate-100'} p-2.5 rounded-xl cursor-pointer active:scale-[0.99] transition-all">
                <div class="flex items-start space-x-2">
                  <input type="radio" name="skor_${idx}" value="${level}" data-domain="${esc(dom)}" ${checked ? 'checked' : ''} class="mt-0.5">
                  <div class="flex-1">
                    <div class="flex items-center space-x-1.5 mb-0.5 flex-wrap">
                      <span class="text-xs" style="color:#f59e0b">${"★".repeat(level)}${"<span style='color:#e2e8f0'>★</span>".repeat(4-level)}</span>
                      <span class="text-[9px] font-bold ${colors[level]} uppercase tracking-wider">Star ${level} - ${labels[level]}</span>
                    </div>
                    <p class="text-[10px] text-slate-600 leading-relaxed">${esc(desc || "-")}</p>
                  </div>
                </div>
              </label>`;
          }).join('')}
        </div>

        <input type="text" name="catatan_${idx}" data-domain="${esc(dom)}" value="${esc(catatanAwal)}" placeholder="Catatan (opsional)" 
               class="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-[11px] focus:border-purple-500 focus:bg-white focus:outline-none">
      </div>`;
  }).join('');

  formBox.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Pertemuan ${pertemuan}</span>
          <span class="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">5 Domain</span>
        </div>
        ${materi ? `
          <h3 class="text-base font-bold text-slate-900">${esc(materi.judul_materi)}</h3>
          <p class="text-xs text-slate-500 mt-1">${esc(materi.deskripsi)}</p>
        ` : `<p class="text-xs text-slate-400 italic">Materi belum diisi untuk pertemuan ini</p>`}
      </div>

      <div class="space-y-3">${domainCards}</div>

      <button onclick="submitPenilaianBatch()" class="w-full gradient-purple text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-purple-200 sticky bottom-2">
        📤 Simpan Semua Penilaian (5 Domain)
      </button>
    </div>`;

  // Event listener radio
  formBox.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const name = this.name;
      formBox.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        const label = r.closest('label');
        if (r.checked) { label.classList.add('border-purple-500', 'bg-purple-50'); label.classList.remove('border-slate-100', 'bg-slate-50'); }
        else { label.classList.remove('border-purple-500', 'bg-purple-50'); label.classList.add('border-slate-100', 'bg-slate-50'); }
      });
    });
  });
}

async function submitPenilaianBatch() {
  const formBox = document.getElementById("guru-form-penilaian");
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const rubrikUsia = getRubrikByUsia(siswa.usia);

  const items = [];
  const domainCards = formBox.querySelectorAll('.domain-card');
  
  for (const card of domainCards) {
    const domain = card.dataset.domain;
    const radio = card.querySelector('input[type="radio"]:checked');
    if (!radio) {
      await showPopup("warning", "Belum Lengkap", `Domain "${domain}" belum dinilai. Semua 5 domain wajib diisi.`);
      return;
    }
    const catatan = card.querySelector('input[type="text"]').value;
    const rubrik = rubrikUsia.find(r => r.domain === domain);
    items.push({
      domain: domain,
      indikator: rubrik ? rubrik.indikator : "",
      skor: radio.value,
      catatan: catatan
    });
  }

  if (items.length === 0) { await showPopup("warning", "Tidak Ada Data", "Tidak ada domain yang dinilai."); return; }

  const loading = showLoading(`Menyimpan ${items.length} penilaian...`);
  const payload = {
    action: "saveNilaiBatch",
    siswaId: selectedSiswaId,
    pertemuan: selectedPertemuan,
    items: items
  };

  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    await new Promise(r => setTimeout(r, 1500));
    loading.close();
    await showPopup("success", "Tersimpan! 🎉", `${items.length} penilaian berhasil dicatat.`);
    refreshData(() => onPilihSiswa());
    showToast("Semua penilaian tersimpan", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

function renderRiwayatPenilaian(nilaiSiswa) {
  const box = document.getElementById("guru-riwayat");
  
  // Group nilai per pertemuan
  const byPertemuan = {};
  nilaiSiswa.forEach(n => {
    const p = String(n.pertemuan).replace(/\D/g, "");
    if (!p) return;
    if (!byPertemuan[p]) byPertemuan[p] = [];
    byPertemuan[p].push(n);
  });

  const sortedPertemuan = Object.keys(byPertemuan).sort((a,b) => parseInt(a) - parseInt(b));

  box.innerHTML = `
    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-900">📚 Riwayat Penilaian</h3>
        <span class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">${sortedPertemuan.length} pertemuan</span>
      </div>
      <div class="space-y-3 max-h-96 overflow-y-auto">
        ${sortedPertemuan.length === 0 ? `<p class="text-xs text-slate-400 text-center py-6 italic">Belum ada penilaian.</p>` :
          sortedPertemuan.map(p => {
            const nilai = byPertemuan[p];
            const totalSkor = nilai.reduce((s, n) => s + getSkor(n), 0);
            const rata = nilai.length > 0 ? (totalSkor / nilai.length).toFixed(1) : 0;
            const timestamp = nilai[0].timestamp;
            return `
              <div class="p-4 bg-slate-50 rounded-2xl">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-800">Pertemuan ${p}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">${fmtTanggal(timestamp)} • ${nilai.length} domain</p>
                  </div>
                  <div class="text-right shrink-0 ml-2">
                    <p class="text-xs font-bold text-purple-600">${totalSkor}/${nilai.length * 4}</p>
                    <p class="text-[9px] text-slate-500">rata ${rata}</p>
                  </div>
                </div>
                <div class="space-y-1 mb-3">
                  ${nilai.sort((a,b) => DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain)).map(n => `
                    <div class="flex items-center justify-between text-[10px] bg-white rounded-lg px-2 py-1.5">
                      <span class="text-slate-600 truncate flex-1 mr-2">${esc(n.domain)}</span>
                      <span style="color:#f59e0b">${"★".repeat(getSkor(n))}${"<span style='color:#e2e8f0'>★</span>".repeat(4-getSkor(n))}</span>
                    </div>
                  `).join('')}
                </div>
                <button onclick="openModalEditBatch('${p}')" class="w-full text-[11px] text-purple-600 font-bold bg-purple-50 hover:bg-purple-100 py-2.5 rounded-xl transition-colors">✏️ Edit Nilai Pertemuan Ini</button>
              </div>`;
          }).join('')}
      </div>
    </div>`;
}

// ============================================================
// MODAL EDIT NILAI (5 domain)
// ============================================================
function openModalEditBatch(pertemuan) {
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const nilaiPertemuan = globalNilai.filter(n => String(n.siswa_id) === String(selectedSiswaId) && String(n.pertemuan).replace(/\D/g,"") === String(pertemuan));
  const rubrikUsia = getRubrikByUsia(siswa.usia);
  const materi = globalMateri.find(m => String(m.pertemuan) === String(pertemuan) && normalisasiUsia(m.usia) === normalisasiUsia(siswa.usia));

  const modal = document.getElementById("modal-edit");
  const content = document.getElementById("modal-edit-content");

  const domainCards = DOMAIN_ORDER.map((dom, idx) => {
    const rubrik = rubrikUsia.find(r => r.domain === dom);
    if (!rubrik) return '';
    const existing = nilaiPertemuan.find(n => n.domain === dom);
    const skorAwal = existing ? existing.skor : 0;
    const catatanAwal = existing ? (existing.catatan || "") : "";
    
    return `
      <div class="domain-card-edit bg-slate-50 p-3 rounded-2xl space-y-2" data-domain="${esc(dom)}">
        <p class="text-xs font-bold text-slate-800">${idx+1}. ${esc(dom)}</p>
        <div class="space-y-1">
          ${[1,2,3,4].map(level => {
            const checked = skorAwal === level;
            return `
              <label class="block bg-white border-2 ${checked ? 'border-purple-500 bg-purple-50' : 'border-slate-100'} p-2 rounded-lg cursor-pointer">
                <div class="flex items-center space-x-2">
                  <input type="radio" name="edit_skor_${idx}" value="${level}" data-domain="${esc(dom)}" ${checked ? 'checked' : ''} class="mt-0.5">
                  <span class="text-xs" style="color:#f59e0b">${"★".repeat(level)}${"<span style='color:#e2e8f0'>★</span>".repeat(4-level)}</span>
                  <span class="text-[9px] font-bold text-slate-600">Star ${level}</span>
                </div>
              </label>`;
          }).join('')}
        </div>
        <input type="text" name="edit_catatan_${idx}" data-domain="${esc(dom)}" value="${esc(catatanAwal)}" placeholder="Catatan" 
               class="w-full px-2.5 py-2 bg-white border-2 border-slate-100 rounded-lg text-[10px] focus:border-purple-500 focus:outline-none">
      </div>`;
  }).join('');

  content.innerHTML = `
    <div class="space-y-1">
      <span class="text-[10px] font-bold text-purple-600 uppercase">Pertemuan ${pertemuan}</span>
      <h4 class="text-sm font-bold text-slate-900">${materi ? esc(materi.judul_materi) : '-'}</h4>
      <p class="text-[10px] text-slate-500">Usia: ${siswa.usia} tahun</p>
    </div>
    <div class="space-y-2 pt-3 border-t border-slate-100">${domainCards}</div>
    <button onclick="submitEditBatch('${pertemuan}')" class="w-full gradient-purple text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-purple-200">💾 Simpan Perubahan</button>`;
  
  modal.classList.remove("hidden");

  content.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const name = this.name;
      content.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        const label = r.closest('label');
        if (r.checked) { label.classList.add('border-purple-500', 'bg-purple-50'); label.classList.remove('border-slate-100', 'bg-white'); }
        else { label.classList.remove('border-purple-500', 'bg-purple-50'); label.classList.add('border-slate-100', 'bg-white'); }
      });
    });
  });
}

function closeModalEdit() { document.getElementById("modal-edit").classList.add("hidden"); }

async function submitEditBatch(pertemuan) {
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const rubrikUsia = getRubrikByUsia(siswa.usia);
  const content = document.getElementById("modal-edit-content");
  const items = [];
  
  for (const card of content.querySelectorAll('.domain-card-edit')) {
    const domain = card.dataset.domain;
    const radio = card.querySelector('input[type="radio"]:checked');
    if (!radio) { await showPopup("warning", "Belum Lengkap", `Domain "${domain}" belum dinilai.`); return; }
    const catatan = card.querySelector('input[type="text"]').value;
    const rubrik = rubrikUsia.find(r => r.domain === domain);
    items.push({
      domain: domain,
      indikator: rubrik ? rubrik.indikator : "",
      skor: radio.value,
      catatan: catatan
    });
  }

  const loading = showLoading("Menyimpan perubahan...");
  const payload = {
    action: "saveNilaiBatch",
    siswaId: selectedSiswaId,
    pertemuan: pertemuan,
    items: items
  };

  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    await new Promise(r => setTimeout(r, 1000));
    loading.close();
    closeModalEdit();
    await showPopup("success", "Terupdate!", "Perubahan nilai disimpan.");
    refreshData(() => onPilihSiswa());
    showToast("Nilai diperbarui", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

// ============================================================
// DASHBOARD GURU
// ============================================================
function renderDashboardGuru() {
  const box = document.getElementById("dashboard-guru-content");
  if (!box) return;

  const stats = globalSiswa.map(s => {
    const levelSiswa = globalLevel.find(l => l.level === s.level_saat_ini);
    const totalPertemuanUsia = levelSiswa ? (parseInt(levelSiswa.pertemuan_max) - parseInt(levelSiswa.pertemuan_min) + 1) : 0;
    const nilaiSiswa = globalNilai.filter(n => String(n.siswa_id) === String(s.siswa_id));
    const totalBintang = nilaiSiswa.reduce((sum, n) => sum + getSkor(n), 0);
    const maxBintang = totalPertemuanUsia * 5 * 4; // 5 domain × 4 bintang
    const persen = maxBintang > 0 ? ((totalBintang / maxBintang) * 100).toFixed(1) : 0;
    const rataBintang = nilaiSiswa.length > 0 ? (totalBintang / nilaiSiswa.length).toFixed(1) : 0;
    return { ...s, totalBintang, maxBintang, count: nilaiSiswa.length, totalPertemuanUsia, persen, rataBintang };
  }).sort((a, b) => b.totalBintang - a.totalBintang);

  const totalSiswa = globalSiswa.length;
  const rataRata = totalSiswa > 0 ? (stats.reduce((s, x) => s + parseFloat(x.persen), 0) / totalSiswa).toFixed(1) : 0;
  const totalBintangSemua = stats.reduce((s, x) => s + x.totalBintang, 0);

  box.innerHTML = `
    <div class="grid grid-cols-3 gap-2">
      <div class="gradient-purple p-4 rounded-3xl text-white shadow-soft">
        <p class="text-[9px] uppercase tracking-wider text-white/70">Siswa</p>
        <p class="text-2xl font-bold mt-1">${totalSiswa}</p>
      </div>
      <div class="gradient-green p-4 rounded-3xl text-white shadow-soft">
        <p class="text-[9px] uppercase tracking-wider text-white/70">Total ⭐</p>
        <p class="text-2xl font-bold mt-1">${totalBintangSemua}</p>
      </div>
      <div class="gradient-blue p-4 rounded-3xl text-white shadow-soft">
        <p class="text-[9px] uppercase tracking-wider text-white/70">Rata-rata</p>
        <p class="text-2xl font-bold mt-1">${rataRata}%</p>
      </div>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-sm font-bold text-slate-900 mb-4">🏆 Peringkat Siswa</h3>
      <div class="space-y-2">
        ${stats.length === 0 ? '<p class="text-xs text-slate-400 text-center py-6">Belum ada siswa.</p>' :
          stats.map((s, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`;
            return `
              <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl">
                <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 border border-slate-200">${medal}</div>
                ${renderAvatar(s, 'md')}
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">${esc(s.nama_siswa)}</p>
                  <p class="text-[10px] text-slate-400">${s.usia} thn • ${s.count} penilaian</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-bold text-purple-600">${s.totalBintang}⭐</p>
                  <p class="text-[10px] text-slate-400">${s.persen}%</p>
                </div>
              </div>`;
          }).join('')}
      </div>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-sm font-bold text-slate-900 mb-4">📊 Detail Capaian</h3>
      <div class="space-y-3">
        ${stats.map(s => {
          const warna = parseFloat(s.persen) >= 85 ? 'bg-emerald-500' : parseFloat(s.persen) >= 65 ? 'bg-blue-500' : 'bg-amber-500';
          return `
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-slate-800">${esc(s.nama_siswa)}</span>
                <span class="text-[10px] font-bold text-slate-500">${s.totalBintang}/${s.maxBintang} ⭐ • ${s.persen}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="${warna} rounded-full h-2 transition-all" style="width: ${s.persen}%"></div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ============================================================
// RUBRIK CRUD
// ============================================================
function renderRubrikList() {
  const box = document.getElementById("rubrik-list");
  const total = document.getElementById("total-pertemuan");
  if (total) total.innerText = globalRubrik.length;
  if (!box) return;
  if (globalRubrik.length === 0) {
    box.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Rubrik kosong.</p>`;
    return;
  }

  const groups = {};
  globalRubrik.forEach(r => {
    const u = normalisasiUsia(r.usia);
    if (!groups[u]) groups[u] = [];
    groups[u].push(r);
  });

  box.innerHTML = Object.entries(groups).sort((a,b) => parseInt(a[0]) - parseInt(b[0])).map(([usia, items]) => `
    <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-3 px-1">👦 Usia ${usia} Tahun</h3>
      <div class="space-y-2">
        ${items.sort((a,b) => parseInt(a.no) - parseInt(b.no)).map(r => `
          <div class="bg-slate-50 rounded-2xl p-3.5">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 min-w-0 pr-2">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="w-6 h-6 gradient-purple text-white rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0">${esc(r.no)}</span>
                  <p class="text-xs font-bold text-slate-800 truncate">${esc(r.domain)}</p>
                </div>
                <p class="text-[10px] text-slate-500 ml-8">${esc(r.indikator)}</p>
              </div>
              <button onclick="openModalRubrik('${esc(r.no)}', '${esc(r.usia)}')" class="text-[10px] text-purple-600 font-bold bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg shrink-0">✏️</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function openModalRubrikBaru() {
  editingRubrikNo = null;
  editingRubrikUsia = null;
  document.getElementById("modal-silabus-title").innerText = "➕ Tambah Rubrik";
  const content = document.getElementById("modal-silabus-content");
  const nextNum = globalRubrik.length > 0 ? Math.max(...globalRubrik.map(r => parseInt(r.no) || 0)) + 1 : 1;
  content.innerHTML = formRubrikHTML({
    no: nextNum, domain: "", indikator: "", contoh_perilaku: "",
    star_1: "", star_2: "", star_3: "", star_4: "", usia: "6 Tahun"
  }, false);
  document.getElementById("modal-silabus").classList.remove("hidden");
}

function openModalRubrik(no, usia) {
  const u = normalisasiUsia(usia);
  const r = globalRubrik.find(x => String(x.no) === String(no) && normalisasiUsia(x.usia) === u);
  if (!r) return;
  editingRubrikNo = no;
  editingRubrikUsia = u;
  document.getElementById("modal-silabus-title").innerText = `✏️ Edit Rubrik #${no}`;
  document.getElementById("modal-silabus-content").innerHTML = formRubrikHTML(r, true);
  document.getElementById("modal-silabus").classList.remove("hidden");
}

function formRubrikHTML(r, isEdit) {
  const field = (id, label, val, multiline = false) => `
    <div>
      <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">${label}</label>
      ${multiline
        ? `<textarea id="${id}" rows="2" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">${esc(val)}</textarea>`
        : `<input type="text" id="${id}" value="${esc(val)}" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">`}
    </div>`;
  const usiaOptions = ['4 Tahun','5 Tahun','6 Tahun','7 Tahun','8 Tahun']
    .map(u => `<option ${normalisasiUsia(r.usia) === normalisasiUsia(u) ? 'selected' : ''}>${u}</option>`).join('');
  const domainOptions = DOMAIN_ORDER.map(d => `<option ${r.domain === d ? 'selected' : ''}>${d}</option>`).join('');
  return `
    <div class="grid grid-cols-2 gap-3">
      ${field('rub_no', 'No.', r.no)}
      <div>
        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Usia</label>
        <select id="rub_usia" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">${usiaOptions}</select>
      </div>
    </div>
    <div>
      <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Domain</label>
      <select id="rub_domain" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">
        <option value="">-- Pilih Domain --</option>
        ${domainOptions}
      </select>
    </div>
    ${field('rub_indikator', 'Indikator', r.indikator, true)}
    ${field('rub_contoh', 'Contoh Perilaku yang Diamati', r.contoh_perilaku, true)}
    <div class="pt-3 border-t border-slate-100 space-y-3">
      <p class="text-[10px] font-bold text-purple-600 uppercase tracking-wider">⭐ 4 Level Capaian</p>
      ${field('rub_star1', 'Star 1 - Perlu Banyak Bantuan', r.star_1, true)}
      ${field('rub_star2', 'Star 2 - Dengan Bimbingan', r.star_2, true)}
      ${field('rub_star3', 'Star 3 - Mandiri', r.star_3, true)}
      ${field('rub_star4', 'Star 4 - Berkembang Sangat Baik', r.star_4, true)}
    </div>
    ${isEdit ? `<button onclick="hapusRubrikKonfirmasi('${esc(r.no)}', '${esc(r.usia)}')" class="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-2xl active:scale-[0.98] transition-all text-sm">🗑️ Hapus Rubrik</button>` : ''}
    <button onclick="submitRubrik(${isEdit})" class="w-full gradient-purple text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-purple-200">
      ${isEdit ? '💾 Simpan Perubahan' : '➕ Tambah Rubrik'}
    </button>`;
}

function closeModalSilabus() { document.getElementById("modal-silabus").classList.add("hidden"); }

async function submitRubrik(isEdit) {
  const data = {
    no: document.getElementById("rub_no").value,
    domain: document.getElementById("rub_domain").value,
    indikator: document.getElementById("rub_indikator").value,
    contoh_perilaku: document.getElementById("rub_contoh").value,
    star_1: document.getElementById("rub_star1").value,
    star_2: document.getElementById("rub_star2").value,
    star_3: document.getElementById("rub_star3").value,
    star_4: document.getElementById("rub_star4").value,
    usia: document.getElementById("rub_usia").value
  };
  if (!data.domain) { await showPopup("warning", "Domain Kosong", "Pilih domain terlebih dahulu."); return; }
  const loading = showLoading(isEdit ? "Menyimpan perubahan..." : "Menambahkan rubrik...");
  try {
    if (isEdit) {
      data.no_lama = editingRubrikNo;
      data.usia_lama = editingRubrikUsia;
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateRubrik", no: data.no_lama, usia: data.usia_lama, ...data }) });
    } else {
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "tambahRubrik", ...data }) });
    }
    await new Promise(r => setTimeout(r, 1200));
    loading.close();
    closeModalSilabus();
    await showPopup("success", "Berhasil!", isEdit ? "Rubrik diperbarui." : "Rubrik baru ditambahkan.");
    refreshData(() => renderRubrikList());
    showToast(isEdit ? "Rubrik diperbarui" : "Rubrik ditambahkan", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

async function hapusRubrikKonfirmasi(no, usia) {
  const ok = await showConfirm("Hapus Rubrik?", `Yakin hapus rubrik #${no} untuk usia ${usia} tahun?`, "Ya, Hapus", "Batal");
  if (!ok) return;
  const loading = showLoading("Menghapus...");
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "hapusRubrik", no, usia }) });
    await new Promise(r => setTimeout(r, 1000));
    loading.close();
    closeModalSilabus();
    await showPopup("success", "Terhapus!", `Rubrik dihapus.`);
    refreshData(() => renderRubrikList());
    showToast("Rubrik dihapus", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

// ============================================================
// MATERI CRUD
// ============================================================
function renderMateriList() {
  const box = document.getElementById("materi-list");
  const total = document.getElementById("total-materi");
  if (total) total.innerText = globalMateri.length;
  if (!box) return;
  if (globalMateri.length === 0) {
    box.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Belum ada materi. Klik + untuk menambah.</p>`;
    return;
  }

  const groups = {};
  globalMateri.forEach(m => {
    const u = normalisasiUsia(m.usia);
    if (!groups[u]) groups[u] = [];
    groups[u].push(m);
  });

  box.innerHTML = Object.entries(groups).sort((a,b) => parseInt(a[0]) - parseInt(b[0])).map(([usia, items]) => `
    <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-3 px-1">👦 Usia ${usia} Tahun</h3>
      <div class="space-y-2">
        ${items.sort((a,b) => parseInt(a.pertemuan) - parseInt(b.pertemuan)).map(m => `
          <div class="bg-slate-50 rounded-2xl p-3.5">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0 pr-2">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="w-8 h-8 gradient-blue text-white rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0">P${esc(m.pertemuan)}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">${esc(m.judul_materi)}</p>
                    <p class="text-[10px] text-slate-500 truncate">${esc(m.level)}</p>
                  </div>
                </div>
                ${m.deskripsi ? `<p class="text-[10px] text-slate-500 ml-10 mt-1">${esc(m.deskripsi)}</p>` : ''}
              </div>
              <button onclick="openModalMateri('${esc(m.pertemuan)}', '${esc(m.usia)}')" class="text-[10px] text-purple-600 font-bold bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg shrink-0">✏️</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function openModalMateriBaru() {
  editingMateriPertemuan = null;
  editingMateriUsia = null;
  document.getElementById("modal-materi-title").innerText = "➕ Tambah Materi";
  const content = document.getElementById("modal-materi-content");
  const nextNum = globalMateri.length > 0 ? Math.max(...globalMateri.map(m => parseInt(m.pertemuan) || 0)) + 1 : 1;
  content.innerHTML = formMateriHTML({
    pertemuan: nextNum, level: globalLevel[0] ? globalLevel[0].level : "", judul_materi: "", deskripsi: "", usia: "6 Tahun"
  }, false);
  document.getElementById("modal-materi").classList.remove("hidden");
}

function openModalMateri(pertemuan, usia) {
  const u = normalisasiUsia(usia);
  const m = globalMateri.find(x => String(x.pertemuan) === String(pertemuan) && normalisasiUsia(x.usia) === u);
  if (!m) return;
  editingMateriPertemuan = pertemuan;
  editingMateriUsia = u;
  document.getElementById("modal-materi-title").innerText = `✏️ Edit Materi P${pertemuan}`;
  document.getElementById("modal-materi-content").innerHTML = formMateriHTML(m, true);
  document.getElementById("modal-materi").classList.remove("hidden");
}

function formMateriHTML(m, isEdit) {
  const field = (id, label, val, multiline = false) => `
    <div>
      <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">${label}</label>
      ${multiline
        ? `<textarea id="${id}" rows="3" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">${esc(val)}</textarea>`
        : `<input type="text" id="${id}" value="${esc(val)}" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">`}
    </div>`;
  const usiaOptions = ['4 Tahun','5 Tahun','6 Tahun','7 Tahun','8 Tahun']
    .map(u => `<option ${normalisasiUsia(m.usia) === normalisasiUsia(u) ? 'selected' : ''}>${u}</option>`).join('');
  const levelOptions = globalLevel.map(l => `<option ${m.level === l.level ? 'selected' : ''}>${esc(l.level)}</option>`).join('');
  return `
    <div class="grid grid-cols-2 gap-3">
      ${field('mat_pertemuan', 'Pertemuan Ke-', m.pertemuan)}
      <div>
        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Usia</label>
        <select id="mat_usia" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">${usiaOptions}</select>
      </div>
    </div>
    <div>
      <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Level</label>
      <select id="mat_level" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">${levelOptions}</select>
    </div>
    ${field('mat_judul', 'Judul Materi', m.judul_materi, true)}
    ${field('mat_deskripsi', 'Deskripsi Materi', m.deskripsi, true)}
    ${isEdit ? `<button onclick="hapusMateriKonfirmasi('${esc(m.pertemuan)}', '${esc(m.usia)}')" class="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-2xl active:scale-[0.98] transition-all text-sm">🗑️ Hapus Materi</button>` : ''}
    <button onclick="submitMateri(${isEdit})" class="w-full gradient-purple text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-purple-200">
      ${isEdit ? '💾 Simpan Perubahan' : '➕ Tambah Materi'}
    </button>`;
}

function closeModalMateri() { document.getElementById("modal-materi").classList.add("hidden"); }

async function submitMateri(isEdit) {
  const data = {
    pertemuan: document.getElementById("mat_pertemuan").value,
    level: document.getElementById("mat_level").value,
    judul_materi: document.getElementById("mat_judul").value,
    deskripsi: document.getElementById("mat_deskripsi").value,
    usia: document.getElementById("mat_usia").value
  };
  const loading = showLoading(isEdit ? "Menyimpan..." : "Menambahkan materi...");
  try {
    if (isEdit) {
      data.pertemuan_lama = editingMateriPertemuan;
      data.usia_lama = editingMateriUsia;
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateMateri", ...data }) });
    } else {
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "tambahMateri", ...data }) });
    }
    await new Promise(r => setTimeout(r, 1200));
    loading.close();
    closeModalMateri();
    await showPopup("success", "Berhasil!", isEdit ? "Materi diperbarui." : "Materi baru ditambahkan.");
    refreshData(() => renderMateriList());
    showToast(isEdit ? "Materi diperbarui" : "Materi ditambahkan", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

async function hapusMateriKonfirmasi(pertemuan, usia) {
  const ok = await showConfirm("Hapus Materi?", `Yakin hapus materi pertemuan ${pertemuan}?`, "Ya, Hapus", "Batal");
  if (!ok) return;
  const loading = showLoading("Menghapus...");
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "hapusMateri", pertemuan, usia }) });
    await new Promise(r => setTimeout(r, 1000));
    loading.close();
    closeModalMateri();
    await showPopup("success", "Terhapus!", `Materi dihapus.`);
    refreshData(() => renderMateriList());
    showToast("Materi dihapus", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

// ============================================================
// DASHBOARD SUPERADMIN
// ============================================================
function renderDashboard() {
  const box = document.getElementById("tab-dashboard");
  if (!box) return;
  const totalSiswa = globalSiswa.length;
  const totalNilai = globalNilai.length;

  const stats = globalSiswa.map(s => {
    const nilaiSiswa = globalNilai.filter(n => String(n.siswa_id) === String(s.siswa_id));
    const total = nilaiSiswa.reduce((sum, n) => sum + getSkor(n), 0);
    const levelSiswa = globalLevel.find(l => l.level === s.level_saat_ini);
    const totalPertemuan = levelSiswa ? (parseInt(levelSiswa.pertemuan_max) - parseInt(levelSiswa.pertemuan_min) + 1) : 0;
    const maxBintang = totalPertemuan * 5 * 4;
    return { ...s, totalBintang: total, count: nilaiSiswa.length, maxBintang, persen: maxBintang > 0 ? ((total/maxBintang)*100).toFixed(1) : 0 };
  }).sort((a,b) => b.totalBintang - a.totalBintang);

  box.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Dashboard</h2>
      <p class="text-xs text-slate-500 mt-1">Pantau perkembangan seluruh siswa</p>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <div class="gradient-purple p-3 rounded-3xl text-white shadow-soft">
        <p class="text-[8px] uppercase tracking-wider text-white/70">Siswa</p>
        <p class="text-xl font-bold mt-1">${totalSiswa}</p>
      </div>
      <div class="gradient-green p-3 rounded-3xl text-white shadow-soft">
        <p class="text-[8px] uppercase tracking-wider text-white/70">Rubrik</p>
        <p class="text-xl font-bold mt-1">${globalRubrik.length}</p>
      </div>
      <div class="gradient-blue p-3 rounded-3xl text-white shadow-soft">
        <p class="text-[8px] uppercase tracking-wider text-white/70">Materi</p>
        <p class="text-xl font-bold mt-1">${globalMateri.length}</p>
      </div>
      <div class="gradient-orange p-3 rounded-3xl text-white shadow-soft">
        <p class="text-[8px] uppercase tracking-wider text-white/70">Nilai</p>
        <p class="text-xl font-bold mt-1">${totalNilai}</p>
      </div>
    </div>
    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-sm font-bold text-slate-900 mb-4">🏆 Peringkat Siswa</h3>
      <div class="space-y-2">
        ${stats.slice(0, 10).map((s, i) => {
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`;
          return `
            <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl">
              <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 border border-slate-200">${medal}</div>
              ${renderAvatar(s, 'md')}
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-800 truncate">${esc(s.nama_siswa)}</p>
                <p class="text-[10px] text-slate-400">${s.usia} thn • ${s.count} penilaian</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-bold text-purple-600">${s.totalBintang}⭐</p>
                <p class="text-[10px] text-slate-400">${s.persen}%</p>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ============================================================
// RAPOR ORANG TUA
// ============================================================
function renderLaporanAnak() {
  const container = document.getElementById("laporan-container");
  const headerBox = document.getElementById("ortu-header");
  const siswaId = currentLoggedInUser.siswa_id;
  const siswaObj = globalSiswa.find(s => String(s.siswa_id) === String(siswaId));
  if (!siswaObj) { container.innerHTML = `<p class="text-xs text-rose-500 text-center">Data tidak ditemukan.</p>`; return; }

  const nilaiList = globalNilai.filter(n => String(n.siswa_id) === String(siswaId));
  const pertemuanDinilai = new Set(nilaiList.map(n => String(n.pertemuan).replace(/\D/g, "")));

  const levelData = globalLevel.map(lv => {
    const min = parseInt(lv.pertemuan_min), max = parseInt(lv.pertemuan_max);
    const nilaiLevel = nilaiList.filter(n => {
      const p = parseInt(String(n.pertemuan).replace(/\D/g,""));
      return p >= min && p <= max;
    });
    const total = nilaiLevel.reduce((s, n) => s + getSkor(n), 0);
    const maxP = max - min + 1;
    const countPertemuan = new Set(nilaiLevel.map(n => String(n.pertemuan).replace(/\D/g,""))).size;
    return {
      level: lv.level, icon: lv.icon || "📘", warna: lv.warna || "#7c3aed",
      total, max: maxP * 5 * 4, count: countPertemuan, maxP,
      selesai: maxP > 0 && countPertemuan >= maxP
    };
  });

  const grandTotal = levelData.reduce((s, l) => s + l.total, 0);
  const totalMaxSkor = levelData.reduce((s, l) => s + l.max, 0);
  const persenAkhir = totalMaxSkor > 0 ? ((grandTotal / totalMaxSkor) * 100).toFixed(1) : "0";

  let predikat = "", predColor = "", predIcon = "";
  if (persenAkhir >= 85) { predikat = "Sangat Baik"; predColor = "gradient-green"; predIcon = "🏆"; }
  else if (persenAkhir >= 70) { predikat = "Baik"; predColor = "gradient-blue"; predIcon = "⭐"; }
  else if (persenAkhir >= 55) { predikat = "Cukup"; predColor = "gradient-orange"; predIcon = "📚"; }
  else { predikat = "Perlu Bimbingan"; predColor = "gradient-orange"; predIcon = "📖"; }

  const activeIdx = levelData.findIndex(l => !l.selesai);
  const activeLevel = activeIdx >= 0 ? activeIdx : levelData.length - 1;
  const rataBintang = nilaiList.length > 0 ? (grandTotal / nilaiList.length).toFixed(1) : 0;

  headerBox.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
      <div class="${predColor} p-5 text-white">
        <div class="flex items-center space-x-4 mb-4">
          <div class="relative">
            <div class="ring-4 ring-white/30 rounded-full">${renderAvatar(siswaObj, 'xl', 'circle')}</div>
            <button onclick="openModalFoto()" class="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold truncate">${esc(siswaObj.nama_siswa)}</h2>
            <p class="text-xs text-white/80">${esc(siswaObj.siswa_id)} • ${siswaObj.usia} tahun</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
            <p class="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Total Bintang</p>
            <p class="text-2xl font-bold mt-0.5">${grandTotal}<span class="text-sm font-normal text-white/70">/${totalMaxSkor}</span></p>
            <p class="text-[10px] text-white/70 mt-0.5">${renderBintangHtml(rataBintang)} rata-rata</p>
          </div>
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
            <p class="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Progress</p>
            <p class="text-2xl font-bold mt-0.5">${persenAkhir}%</p>
            <p class="text-[9px] text-white/60">${pertemuanDinilai.size} pertemuan dinilai</p>
          </div>
        </div>
      </div>
      <div class="p-4 space-y-2.5">
        <div class="flex justify-between text-xs">
          <span class="text-slate-500">Predikat</span>
          <span class="font-bold text-slate-800">${predIcon} ${predikat}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-slate-500">Level Aktif</span>
          <span class="font-bold text-purple-600">${levelData[activeLevel] ? levelData[activeLevel].level : "-"}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-slate-500">Wali</span>
          <span class="font-medium text-slate-700">${esc(siswaObj.orang_tua)}</span>
        </div>
      </div>
    </div>`;

  container.innerHTML = `
    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-900">🎯 Progress Per Level</h3>
        <span class="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">${activeLevel + 1}/${levelData.length}</span>
      </div>
      <div class="space-y-4">
        ${levelData.map((lv, idx) => {
          const p = lv.maxP > 0 ? (lv.count / lv.maxP * 100) : 0;
          const done = lv.selesai, act = idx === activeLevel;
          return `
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center space-x-2">
                  <span class="w-7 h-7 ${done ? 'bg-emerald-100 text-emerald-600' : act ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'} rounded-lg flex items-center justify-center text-[11px] font-bold">
                    ${done ? '✓' : lv.icon}
                  </span>
                  <span class="text-xs font-bold ${act ? 'text-purple-700' : 'text-slate-700'}">${esc(lv.level)}</span>
                </div>
                <span class="text-[10px] font-bold ${done ? 'text-emerald-600' : 'text-slate-500'}">${lv.total}⭐/${lv.max}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mb-1">
                <div class="${done ? 'bg-emerald-500' : 'gradient-purple'} rounded-full h-2 transition-all duration-500" style="width: ${p}%"></div>
              </div>
              <p class="text-[9px] text-slate-400 ml-9">${lv.count}/${lv.maxP} pertemuan</p>
            </div>`;
        }).join('')}
      </div>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-sm font-bold text-slate-900 mb-4">📈 Grafik Bintang per Pertemuan</h3>
      <div class="relative h-52 w-full"><canvas id="progressChart"></canvas></div>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-900">📝 Riwayat Penilaian</h3>
        <span class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">${pertemuanDinilai.size} pertemuan</span>
      </div>
      <div class="space-y-3 max-h-96 overflow-y-auto">
        ${renderRiwayatOrtu(nilaiList)}
      </div>
    </div>`;
  renderChart(nilaiList);
}

function renderRiwayatOrtu(nilaiList) {
  const byPertemuan = {};
  nilaiList.forEach(n => {
    const p = String(n.pertemuan).replace(/\D/g, "");
    if (!p) return;
    if (!byPertemuan[p]) byPertemuan[p] = [];
    byPertemuan[p].push(n);
  });
  const sorted = Object.keys(byPertemuan).sort((a,b) => parseInt(a) - parseInt(b));
  if (sorted.length === 0) return `<p class="text-xs text-slate-400 text-center py-6 italic">Belum ada nilai.</p>`;
  return sorted.map(p => {
    const nilai = byPertemuan[p];
    const totalSkor = nilai.reduce((s, n) => s + getSkor(n), 0);
    const materi = globalMateri.find(m => String(m.pertemuan) === String(p));
    return `
      <div class="p-4 bg-slate-50 rounded-2xl">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-slate-800">Pertemuan ${p}</p>
            <p class="text-[10px] text-slate-500">${materi ? esc(materi.judul_materi) : '-'}</p>
            <p class="text-[9px] text-slate-400">${fmtTanggal(nilai[0].timestamp)}</p>
          </div>
          <div class="text-right shrink-0 ml-2">
            <p class="text-xs font-bold text-purple-600">${totalSkor}/${nilai.length*4}</p>
          </div>
        </div>
        <div class="space-y-1">
          ${nilai.sort((a,b) => DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain)).map(n => `
            <div class="flex items-center justify-between text-[10px] bg-white rounded-lg px-2 py-1.5">
              <span class="text-slate-600 truncate flex-1 mr-2">${esc(n.domain)}</span>
              <span style="color:#f59e0b">${"★".repeat(getSkor(n))}${"<span style='color:#e2e8f0'>★</span>".repeat(4-getSkor(n))}</span>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('');
}

function renderChart(nilaiList) {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (myChartInstance) myChartInstance.destroy();
  // Group by pertemuan → average
  const byP = {};
  nilaiList.forEach(n => {
    const p = String(n.pertemuan).replace(/\D/g, "");
    if (!p) return;
    if (!byP[p]) byP[p] = [];
    byP[p].push(getSkor(n));
  });
  const sorted = Object.keys(byP).sort((a,b) => parseInt(a) - parseInt(b));
  const labels = sorted.map(p => `P${p}`);
  const data = sorted.map(p => {
    const arr = byP[p];
    return arr.length > 0 ? (arr.reduce((s,x) => s+x, 0) / arr.length) : 0;
  });
  myChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.length > 0 ? labels : ['—'],
      datasets: [{
        data: data.length > 0 ? data : [0],
        borderColor: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.12)',
        borderWidth: 3, pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 5,
        fill: true, tension: 0.4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 4, ticks: { stepSize: 1, font: { size: 10 } }, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

// ============================================================
// FOTO UPLOAD
// ============================================================
function openModalFoto() {
  pendingFotoBase64 = null; pendingFotoMime = null;
  document.getElementById("foto-preview-img").classList.add("hidden");
  document.getElementById("foto-preview-placeholder").classList.remove("hidden");
  document.getElementById("foto-input").value = "";
  document.getElementById("modal-foto").classList.remove("hidden");
}
function closeModalFoto() { document.getElementById("modal-foto").classList.add("hidden"); }

async function previewFoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { await showPopup("warning", "Ukuran Terlalu Besar", "Maksimal 5 MB."); return; }
  if (!file.type.startsWith("image/")) { await showPopup("warning", "Format Tidak Didukung", "Pilih file gambar."); return; }
  const reader = new FileReader();
  reader.onload = function(ev) {
    pendingFotoBase64 = ev.target.result;
    pendingFotoMime = file.type;
    document.getElementById("foto-preview-img").src = ev.target.result;
    document.getElementById("foto-preview-img").classList.remove("hidden");
    document.getElementById("foto-preview-placeholder").classList.add("hidden");
    showToast("Foto siap diunggah", "info");
  };
  reader.readAsDataURL(file);
}

async function uploadFoto() {
  if (!pendingFotoBase64) { await showPopup("warning", "Foto Belum Dipilih", "Pilih foto dulu ya."); return; }
  const loading = showLoading("Mengunggah foto...");
  const payload = {
    action: "uploadFoto", siswaId: currentLoggedInUser.siswa_id,
    base64: pendingFotoBase64, mimeType: pendingFotoMime,
    fileName: "foto_" + currentLoggedInUser.siswa_id + "_" + Date.now() + ".jpg"
  };
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    loading.update("Menyimpan ke database...");
    await new Promise(r => setTimeout(r, 1500));
    loading.close();
    await showPopup("success", "Foto Terupload! 🎉", "Foto profil anak berhasil disimpan.");
    closeModalFoto();
    await refreshData(() => renderLaporanAnak());
    showToast("Foto diperbarui", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Upload Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

// ============================================================
// LAPORAN PDF (Portrait)
// ============================================================
async function loadLaporanList() {
  const siswaId = currentLoggedInUser.siswa_id;
  if (!siswaId) return;
  const listEl = document.getElementById("laporan-list-level");
  const containerEl = document.getElementById("laporan-container-preview");
  containerEl.classList.add("hidden");
  containerEl.innerHTML = "";

  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(siswaId));
  if (!siswa) return;
  const nilaiSiswa = globalNilai.filter(n => String(n.siswa_id) === String(siswaId));
  const pertemuanDinilai = new Set(nilaiSiswa.map(n => String(n.pertemuan).replace(/\D/g, "")));

  const statusLevel = globalLevel.map(lv => {
    const min = parseInt(lv.pertemuan_min), max = parseInt(lv.pertemuan_max);
    let selesai = 0;
    for (let p = min; p <= max; p++) {
      if (pertemuanDinilai.has(String(p))) selesai++;
    }
    const total = max - min + 1;
    return {
      nama: lv.level, icon: lv.icon || "📘", warna: lv.warna || "#7c3aed",
      deskripsi: lv.deskripsi || "", min, max,
      selesai, total,
      persen: total > 0 ? ((selesai / total) * 100).toFixed(0) : 0,
      tersedia: total > 0 && selesai > 0
    };
  });

  listEl.innerHTML = statusLevel.map(sl => `
    <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft ${sl.tersedia ? '' : 'opacity-70'}">
      <div class="flex items-center space-x-3 mb-3">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style="background: ${sl.warna}20; color: ${sl.warna};">
          ${sl.tersedia ? sl.icon : '🔒'}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-800 truncate">${esc(sl.nama)}</p>
          <p class="text-[10px] text-slate-500">Pertemuan ${sl.min}-${sl.max} • ${esc(sl.deskripsi)}</p>
        </div>
      </div>
      <div class="space-y-2 mb-3">
        <div class="flex justify-between text-[10px]">
          <span class="text-slate-500">Progress</span>
          <span class="font-bold" style="color: ${sl.warna};">${sl.selesai}/${sl.total}</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2">
          <div class="rounded-full h-2 transition-all" style="width: ${sl.persen}%; background: ${sl.warna};"></div>
        </div>
      </div>
      ${sl.tersedia
        ? `<button onclick="previewLaporan('${esc(sl.nama)}')" class="w-full text-white font-bold py-3 rounded-2xl active:scale-[0.98] transition-all text-xs" style="background: ${sl.warna}; box-shadow: 0 8px 20px -4px ${sl.warna}60;">
            📄 Preview & Download Laporan PDF
          </button>`
        : `<div class="bg-slate-50 text-slate-500 text-center text-[11px] font-semibold py-3 rounded-2xl">
            Belum ada penilaian di level ini
          </div>`}
    </div>`).join('');
}

async function previewLaporan(namaLevel) {
  const loading = showLoading("Memuat laporan...");
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getLaporan&siswaId=${currentLoggedInUser.siswa_id}&level=${encodeURIComponent(namaLevel)}`).then(r => r.json());
    loading.close();
    if (res.status !== "success" || !res.data) {
      await showPopup("error", "Gagal", res.message || "Tidak dapat memuat laporan.");
      return;
    }
    laporanData = res.data;
    await renderLaporanPreview(res.data);
    document.getElementById("pdf-modal-subtitle").innerText = `Laporan ${res.data.level.nama} - ${res.data.siswa.nama}`;
    document.getElementById("modal-pdf").classList.remove("hidden");
  } catch (err) {
    loading.close();
    console.error(err);
    await showPopup("error", "Gagal", "Terjadi kesalahan memuat laporan.");
  }
}

function closeModalPdf() {
  document.getElementById("modal-pdf").classList.add("hidden");
}

async function generateQRCode(text) {
  try {
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, text, { width: 300, margin: 1, color: { dark: "#0f172a", light: "#ffffff" }, errorCorrectionLevel: "H" });
    return canvas.toDataURL("image/png");
  } catch (err) { console.error("QR Error:", err); return ""; }
}

async function renderLaporanPreview(data) {
  const container = document.getElementById("pdf-preview-content");
  const s = data.siswa;
  const lv = data.level;
  const predikatColor = data.predikatColor;
  const verifyUrl = `${SCRIPT_URL}?action=getLaporan&siswaId=${s.id}&level=${encodeURIComponent(lv.nama)}`;
  const qrDataUrl = await generateQRCode(verifyUrl);

  // PAGE 1: COVER + RINGKASAN
  const page1 = `
    <div class="pdf-page portrait">
      <div class="pdf-border" style="border-color: ${lv.warna};">
        <div class="pdf-header">
          <div class="pdf-logo" style="background: linear-gradient(135deg, ${lv.warna}, ${predikatColor});">🤖</div>
          <div>
            <div class="pdf-brand" style="color: ${lv.warna};">RoboClass</div>
            <div class="pdf-brand-sub">ROBOTIC CLASS MANAGEMENT</div>
          </div>
        </div>
        <div class="pdf-line" style="background: linear-gradient(90deg, transparent, ${predikatColor}, transparent);"></div>

        <div class="pdf-title-section">
          <div class="pdf-title-label">LAPORAN</div>
          <div class="pdf-title-main">HASIL BELAJAR</div>
          <div class="pdf-title-sub">CHILD LEARNING REPORT</div>
        </div>

        <div class="pdf-photo-section">
          ${s.foto_url
            ? `<img src="${esc(s.foto_url)}" class="pdf-photo" style="border-color: ${predikatColor};" onerror="this.style.display='none'">`
            : `<div class="pdf-photo pdf-photo-placeholder" style="border-color: ${predikatColor}; background: linear-gradient(135deg, ${lv.warna}, ${predikatColor});">${esc(s.nama).charAt(0).toUpperCase()}</div>`}
        </div>

        <div class="pdf-student-section">
          <div class="pdf-student-label">Nama Anak</div>
          <div class="pdf-student-name" style="color: ${predikatColor};">${esc(s.nama)}</div>
          <div class="pdf-student-line" style="background: linear-gradient(90deg, transparent, ${predikatColor}, transparent);"></div>
          <div class="pdf-student-info">ID: ${esc(s.id)} • Usia: ${s.usia} tahun • Wali: ${esc(s.orangTua)}</div>
        </div>

        <div class="pdf-summary">
          <div class="pdf-summary-text">
            telah mengikuti program <b style="color: ${lv.warna};">${esc(lv.nama)}</b>
            (Pertemuan ${lv.min}-${lv.max}) dengan capaian
          </div>
          <div class="pdf-predikat" style="background: ${predikatColor};">${data.predikatIcon} ${data.predikat}</div>
          <div class="pdf-summary-text">
            Total perolehan <b style="color: ${lv.warna};">${data.grandTotal} ⭐</b> dari maksimal ${data.skorMaksimalLevel} ⭐ (${data.persenAkhir}%)
          </div>
        </div>

        <div class="pdf-footer">
          <div class="pdf-footer-col">
            <div class="pdf-footer-label">Tanggal Cetak</div>
            <div class="pdf-footer-value">${data.tanggalCetak}</div>
          </div>
          <div class="pdf-footer-col">
            <div class="pdf-signature">Arni Irenawati, S.Si</div>
            <div class="pdf-footer-label">Kepala Program RoboClass</div>
          </div>
          <div class="pdf-footer-col qr">
            <img src="${qrDataUrl}" class="pdf-qr">
            <div class="pdf-footer-label">Scan verifikasi</div>
          </div>
        </div>
      </div>
    </div>`;

  // PAGE 2+: DETAIL PER PERTEMUAN
  const detailPages = data.detailPertemuan.filter(dp => dp.countDomain > 0).map(dp => {
    const domainRows = DOMAIN_ORDER.map(dom => {
      const d = dp.domains[dom];
      if (!d || d.skor === 0) return '';
      return `
        <tr>
          <td class="pdf-td-domain">${esc(dom)}</td>
          <td class="pdf-td-stars">${"★".repeat(d.skor)}<span style="color:#e2e8f0">${"★".repeat(4-d.skor)}</span></td>
          <td class="pdf-td-skor">${d.skor}/4</td>
        </tr>`;
    }).join('');

    const deskripsiDomains = DOMAIN_ORDER.map(dom => {
      const d = dp.domains[dom];
      if (!d || d.skor === 0) return '';
      const labels = {1:"Perlu Banyak Bantuan",2:"Dengan Bimbingan",3:"Mandiri",4:"Berkembang Sangat Baik"};
      return `
        <div class="pdf-desc-item">
          <div class="pdf-desc-domain">${esc(dom)} ${"★".repeat(d.skor)}<span style="color:#e2e8f0">${"★".repeat(4-d.skor)}</span></div>
          <div class="pdf-desc-label">${labels[d.skor]}${d.catatan ? ` — "${esc(d.catatan)}"` : ''}</div>
        </div>`;
    }).join('');

    return `
      <div class="pdf-page portrait">
        <div class="pdf-border" style="border-color: ${lv.warna};">
          <div class="pdf-detail-header" style="border-bottom-color: ${predikatColor};">
            <div class="pdf-detail-badge" style="background: linear-gradient(135deg, ${lv.warna}, ${predikatColor});">P${dp.pertemuan}</div>
            <div class="pdf-detail-title">
              <div class="pdf-detail-judul">${esc(dp.judul_materi)}</div>
              <div class="pdf-detail-sub">${esc(dp.deskripsi)}</div>
            </div>
            <div class="pdf-detail-total">
              <div class="pdf-detail-total-val" style="color: ${predikatColor};">${dp.total}</div>
              <div class="pdf-detail-total-lbl">dari ${dp.countDomain * 4}⭐</div>
            </div>
          </div>

          <div class="pdf-detail-section-title">📊 Rincian Penilaian 5 Domain</div>
          <table class="pdf-detail-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th style="width: 100px;">Bintang</th>
                <th style="width: 60px;">Skor</th>
              </tr>
            </thead>
            <tbody>${domainRows}</tbody>
          </table>

          <div class="pdf-detail-section-title">📝 Deskripsi Capaian</div>
          <div class="pdf-desc-list">${deskripsiDomains}</div>
        </div>
      </div>`;
  }).join('');

  // PAGE TERAKHIR: REKAP
  const allDetail = data.detailPertemuan.filter(dp => dp.countDomain > 0);
  const pageRekap = `
    <div class="pdf-page portrait">
      <div class="pdf-border" style="border-color: ${lv.warna};">
        <div class="pdf-detail-header" style="border-bottom-color: ${predikatColor};">
          <div class="pdf-detail-badge" style="background: linear-gradient(135deg, ${lv.warna}, ${predikatColor});">📊</div>
          <div class="pdf-detail-title">
            <div class="pdf-detail-judul">Rekap Keseluruhan</div>
            <div class="pdf-detail-sub">${esc(lv.nama)} • Pertemuan ${lv.min}-${lv.max}</div>
          </div>
        </div>

        <div class="pdf-rekap-summary">
          <div class="pdf-rekap-box" style="background: linear-gradient(135deg, ${predikatColor}15, ${predikatColor}05); border-left: 3px solid ${predikatColor};">
            <div class="pdf-rekap-label">Total Bintang</div>
            <div class="pdf-rekap-value" style="color: ${predikatColor};">${data.grandTotal} / ${data.skorMaksimalLevel} ⭐</div>
            <div class="pdf-rekap-sub">${data.persenAkhir}% • ${data.predikatIcon} ${data.predikat}</div>
          </div>
          <div class="pdf-rekap-box" style="background: #f0f9ff; border-left: 3px solid #3b82f6;">
            <div class="pdf-rekap-label">Pertemuan Dinilai</div>
            <div class="pdf-rekap-value" style="color: #3b82f6;">${data.totalPertemuan} / ${data.totalPertemuanLevel}</div>
            <div class="pdf-rekap-sub">Rata-rata ${data.totalPertemuan > 0 ? (data.grandTotal/data.totalPertemuan).toFixed(1) : 0}⭐ per pertemuan</div>
          </div>
        </div>

        <div class="pdf-detail-section-title">📋 Rata-rata per Domain</div>
        <table class="pdf-detail-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th style="width: 100px;">Total</th>
              <th style="width: 80px;">Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            ${DOMAIN_ORDER.map(dom => {
              let total = 0, count = 0;
              allDetail.forEach(dp => {
                const d = dp.domains[dom];
                if (d && d.skor > 0) { total += d.skor; count++; }
              });
              const avg = count > 0 ? (total / count).toFixed(2) : 0;
              return `
                <tr>
                  <td class="pdf-td-domain">${esc(dom)}</td>
                  <td class="pdf-td-skor">${total}/${count * 4}</td>
                  <td class="pdf-td-skor">${avg}⭐</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>

        <div class="pdf-detail-section-title">📅 Timeline Pertemuan</div>
        <div class="pdf-timeline">
          ${allDetail.map(dp => `
            <div class="pdf-timeline-item">
              <div class="pdf-timeline-marker" style="background: ${predikatColor};">P${dp.pertemuan}</div>
              <div class="pdf-timeline-content">
                <div class="pdf-timeline-judul">${esc(dp.judul_materi)}</div>
                <div class="pdf-timeline-meta">${dp.countDomain} domain • Total ${dp.total}/${dp.countDomain*4}⭐ • Rata ${dp.rata}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;

  container.innerHTML = page1 + detailPages + pageRekap;
}

async function downloadLaporanPDF() {
  if (!laporanData) { await showPopup("warning", "Data Belum Siap", "Laporan belum dimuat."); return; }
  const ok = await showConfirm(
    "Cetak Laporan PDF 📄",
    "Pada dialog print:<br>• Tujuan: <b>Save as PDF</b><br>• Ukuran: <b>A4</b><br>• Orientasi: <b>Portrait</b><br>• Centang <b>Background graphics</b>",
    "Lanjut Cetak", "Batal"
  );
  if (!ok) return;
  // Beri waktu tutup modal dulu
  closeModalPdf();
  setTimeout(() => window.print(), 400);
}

console.log("RoboClass Manager v4 loaded");

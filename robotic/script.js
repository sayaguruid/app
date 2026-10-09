// ============================================================
// KONFIGURASI
// ============================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuHX4uIl2CYFOj_ggLUMtGry4twjJXzOObvXvkbnXYc-iea4e1Dd12MesDnjv3FlWfJQ/exec"; // ← GANTI URL ANDA

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
let globalLevel = [];
let currentLoggedInUser = null;
let myChartInstance = null;
let selectedSiswaId = "";
let selectedPertemuan = null;
let editingRubrikNo = null;
let editingRubrikUsia = null;
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
  let html = '<span style="color:#f59e0b;font-size:1.1rem;letter-spacing:0.05rem">';
  for (let i = 1; i <= 4; i++) {
    html += i <= s ? '★' : '<span style="color:#e2e8f0">★</span>';
  }
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
// LOAD DATA — harus selesai dulu sebelum login bisa
// ============================================================
window.onload = function() {
  // Fetch data dulu, baru tampilkan login setelah selesai
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
      globalLevel   = (d.level   || []).sort((a,b) => parseInt(a.pertemuan_min) - parseInt(b.pertemuan_min));
      dataReady = true;
      if (statusEl) statusEl.innerText = "✅ Sistem siap. Silakan login.";
      if (loginBtn) { loginBtn.disabled = false; loginBtn.innerText = "Masuk"; }
      populateAdminList();
      populateLevelDropdown();
    })
    .catch(err => {
      console.error("Fetch error:", err);
      if (statusEl) statusEl.innerText = "❌ Gagal memuat: " + err.message + " — coba refresh.";
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
      globalLevel    = (d.level   || []).sort((a,b) => parseInt(a.pertemuan_min) - parseInt(b.pertemuan_min));
      if (callback) callback();
    })
    .catch(err => {
      console.error("Refresh error:", err);
      showToast("Gagal refresh data", "error");
    });
}

// ============================================================
// LOGIN / LOGOUT
// ============================================================
async function handleLogin(e) {
  e.preventDefault();
  if (!dataReady) { 
    await showPopup("warning", "Data Belum Siap", "Sistem masih memuat data. Mohon tunggu sebentar."); 
    return; 
  }
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
    ortu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    sertifikat: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    capaian: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>`
  };

  let items = [];
  if (role === "superadmin") items = [
    { key: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { key: 'silabus', icon: icons.silabus, label: 'Rubrik' },
    { key: 'admin', icon: icons.admin, label: 'Siswa' }
  ];
  else if (role === "admin") items = [
    { key: 'admin', icon: icons.admin, label: 'Siswa' },
    { key: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { key: 'silabus', icon: icons.silabus, label: 'Rubrik' }
  ];
  else if (role === "guru") items = [
    { key: 'guru', icon: icons.guru, label: 'Nilai' },
    { key: 'dashboard-guru', icon: icons.capaian, label: 'Capaian' },
    { key: 'silabus', icon: icons.silabus, label: 'Rubrik' }
  ];
  else if (role === "ortu") items = [
    { key: 'ortu', icon: icons.ortu, label: 'Rapor' },
    { key: 'sertifikat', icon: icons.sertifikat, label: 'Laporan' }
  ];

  nav.innerHTML = `<div class="flex justify-around items-center pt-3 pb-2">${items.map(it => `
    <button onclick="switchTab('${it.key}')" id="nav-${it.key}" class="nav-btn flex flex-col items-center space-y-1 px-5 py-1 rounded-xl transition-all text-slate-400">
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
  if (key === 'dashboard') renderDashboard();
  if (key === 'dashboard-guru') renderDashboardGuru();
  if (key === 'sertifikat') loadLaporanList();
}

// ============================================================
// ADMIN
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
    await showPopup("success", "Berhasil! 🎉", "Siswa baru & akun orang tua berhasil ditambahkan.");
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
// GURU - PENILAIAN (Rubrik 4 Bintang)
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
  const um = new Map();
  nilaiSiswa.forEach(n => {
    const k = String(n.pertemuan).replace(/\D/g, "");
    if (!um.has(k) || new Date(n.timestamp) > new Date(um.get(k).timestamp)) um.set(k, n);
  });
  const pertemuanSudahDinilai = new Set(Array.from(um.keys()));

  const levelSiswa = globalLevel.find(l => l.level === siswa.level_saat_ini);
  let allPertemuan = [];
  if (levelSiswa) {
    for (let p = parseInt(levelSiswa.pertemuan_min); p <= parseInt(levelSiswa.pertemuan_max); p++) allPertemuan.push(p);
  } else {
    allPertemuan = Array.from({length: 12}, (_, i) => i + 1);
  }
  const totalPertemuan = allPertemuan.length;
  const totalDinilai = allPertemuan.filter(p => pertemuanSudahDinilai.has(String(p))).length;

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
      <p class="text-[10px] text-white/70">📌 Rubrik sesuai usia ${siswa.usia} tahun</p>
    </div>`;
  infoBox.classList.remove("hidden");

  const available = allPertemuan.filter(p => !pertemuanSudahDinilai.has(String(p)));

  stepPertemuan.innerHTML = `
    <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Pilih Pertemuan (Usia ${siswa.usia} Thn)</label>
    <select id="guru-pilih-pertemuan" onchange="onPilihPertemuan()" class="w-full mt-1.5 px-3 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:border-purple-500 focus:bg-white focus:outline-none font-medium">
      ${available.length === 0
        ? `<option value="">🎉 Semua pertemuan sudah dinilai!</option>`
        : `<option value="">-- Pilih Pertemuan --</option>` + available.map(p => `<option value="${p}">Pertemuan ${p}</option>`).join('')}
    </select>`;
  stepPertemuan.classList.remove("hidden");
  formBox.classList.add("hidden");
  formBox.innerHTML = "";
  renderRiwayatPenilaian(Array.from(um.values()));
  riwayatBox.classList.remove("hidden");
}

function onPilihPertemuan() {
  const val = document.getElementById("guru-pilih-pertemuan").value;
  const formBox = document.getElementById("guru-form-penilaian");
  if (!val) { formBox.classList.add("hidden"); formBox.innerHTML = ""; selectedPertemuan = null; return; }
  selectedPertemuan = val;
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const existing = globalNilai.find(n => 
    String(n.siswa_id) === String(selectedSiswaId) && 
    String(n.pertemuan).replace(/\D/g,"") === String(val)
  );
  renderFormPenilaian(siswa, existing);
  formBox.classList.remove("hidden");
  formBox.classList.add("fade-in");
}

function renderFormPenilaian(siswa, existing) {
  const formBox = document.getElementById("guru-form-penilaian");
  const isEdit = !!existing;
  const rubrikUsia = getRubrikByUsia(siswa.usia);

  if (rubrikUsia.length === 0) {
    formBox.innerHTML = `<div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl">
      <p class="text-xs text-amber-800 font-semibold">⚠️ Rubrik untuk usia ${siswa.usia} tahun belum tersedia. Silakan tambahkan di menu Rubrik.</p>
    </div>`;
    return;
  }

  // Daftar domain unik
  const domains = [...new Set(rubrikUsia.map(r => r.domain))];
  const existingDomain = isEdit ? existing.domain : "";
  const existingIndikator = isEdit ? existing.indikator : "";
  const existingSkor = isEdit ? existing.skor : 0;
  const existingCatatan = isEdit ? (existing.catatan || "") : "";

  formBox.innerHTML = `
    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft space-y-5">
      <div class="border-b border-slate-100 pb-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Pertemuan ${selectedPertemuan}</span>
          <span class="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">Usia ${siswa.usia} Thn</span>
        </div>
        <h3 class="text-base font-bold text-slate-900">Penilaian Rubrik Perkembangan</h3>
        <p class="text-xs text-slate-500 mt-1">Pilih domain & indikator, lalu beri bintang sesuai capaian anak</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Domain</label>
          <select id="p_domain" onchange="onPilihDomain()" class="w-full mt-1.5 px-3 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:border-purple-500 focus:bg-white focus:outline-none font-medium">
            <option value="">-- Pilih Domain --</option>
            ${domains.map(d => `<option value="${esc(d)}" ${existingDomain === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
          </select>
        </div>

        <div id="p_indikator_wrapper" class="hidden">
          <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Indikator</label>
          <select id="p_indikator" onchange="onPilihIndikator()" class="w-full mt-1.5 px-3 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:border-purple-500 focus:bg-white focus:outline-none font-medium">
            <option value="">-- Pilih Indikator --</option>
          </select>
        </div>

        <div id="p_detail_wrapper" class="hidden space-y-4">
          <div class="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-xl">
            <p class="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">📌 Contoh Perilaku yang Diamati</p>
            <p id="p_contoh" class="text-[11px] text-slate-700 leading-relaxed"></p>
          </div>

          <div class="space-y-2">
            <p class="text-[10px] font-bold text-slate-600 uppercase tracking-wider ml-1">Pilih Capaian (4 Level Bintang)</p>
            <div id="p_skor_options" class="space-y-2"></div>
          </div>

          <input type="text" id="p_catatan" value="${esc(existingCatatan)}" placeholder="Catatan observasi (opsional)" class="w-full px-3 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">
        </div>
      </div>

      <button onclick="submitPenilaian()" class="${isEdit ? 'bg-amber-500 shadow-amber-200' : 'gradient-purple shadow-purple-200'} w-full text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg">
        ${isEdit ? '💾 Update Penilaian' : '📤 Simpan Penilaian'}
      </button>
    </div>`;

  // Auto-fill jika edit
  if (isEdit && existingDomain) {
    onPilihDomain();
    if (existingIndikator) {
      document.getElementById("p_indikator").value = existingIndikator;
      onPilihIndikator();
      const radio = document.querySelector(`input[name="p_skor"][value="${existingSkor}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    }
  }
}

function onPilihDomain() {
  const domain = document.getElementById("p_domain").value;
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const wrapper = document.getElementById("p_indikator_wrapper");
  const detailWrapper = document.getElementById("p_detail_wrapper");
  
  if (!domain) { wrapper.classList.add("hidden"); detailWrapper.classList.add("hidden"); return; }

  const rubrikDomain = getRubrikByUsia(siswa.usia).filter(r => r.domain === domain);

  const selIndikator = document.getElementById("p_indikator");
  selIndikator.innerHTML = `<option value="">-- Pilih Indikator --</option>` +
    rubrikDomain.map(r => `<option value="${esc(r.indikator)}">${esc(r.indikator)}</option>`).join('');
  
  wrapper.classList.remove("hidden");
  detailWrapper.classList.add("hidden");
}

function onPilihIndikator() {
  const domain = document.getElementById("p_domain").value;
  const indikator = document.getElementById("p_indikator").value;
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  const detailWrapper = document.getElementById("p_detail_wrapper");
  
  if (!indikator) { detailWrapper.classList.add("hidden"); return; }

  const rubrik = getRubrikByUsia(siswa.usia).find(r => 
    r.domain === domain && r.indikator === indikator
  );

  if (!rubrik) return;

  document.getElementById("p_contoh").innerText = rubrik.contoh_perilaku || "-";

  const labels = [
    { skor: 1, label: "Perlu Banyak Bantuan", desc: rubrik.star_1, color: "text-rose-600" },
    { skor: 2, label: "Dengan Bimbingan", desc: rubrik.star_2, color: "text-amber-600" },
    { skor: 3, label: "Mandiri", desc: rubrik.star_3, color: "text-blue-600" },
    { skor: 4, label: "Berkembang Sangat Baik", desc: rubrik.star_4, color: "text-emerald-600" }
  ];

  document.getElementById("p_skor_options").innerHTML = labels.map(l => `
    <label class="block bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl cursor-pointer active:scale-[0.99] transition-all hover:border-purple-300">
      <div class="flex items-start space-x-3">
        <input type="radio" name="p_skor" value="${l.skor}" class="mt-1">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-1 flex-wrap">
            <span class="text-base" style="color:#f59e0b">${"★".repeat(l.skor)}${"<span style='color:#e2e8f0'>★</span>".repeat(4-l.skor)}</span>
            <span class="text-[10px] font-bold ${l.color} uppercase tracking-wider">Star ${l.skor} - ${l.label}</span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed">${esc(l.desc || "-")}</p>
        </div>
      </div>
    </label>`).join('');

  document.querySelectorAll('input[name="p_skor"]').forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('input[name="p_skor"]').forEach(r => {
        const label = r.closest('label');
        if (r.checked) { 
          label.classList.add('border-purple-500', 'bg-purple-50'); 
          label.classList.remove('border-slate-100', 'bg-slate-50'); 
        } else { 
          label.classList.remove('border-purple-500', 'bg-purple-50'); 
          label.classList.add('border-slate-100', 'bg-slate-50'); 
        }
      });
    });
  });

  detailWrapper.classList.remove("hidden");
}

async function submitPenilaian() {
  const domain = document.getElementById("p_domain").value;
  const indikator = document.getElementById("p_indikator").value;
  const skor = document.querySelector('input[name="p_skor"]:checked');
  
  if (!domain || !indikator) { 
    await showPopup("warning", "Data Belum Lengkap", "Pilih domain dan indikator terlebih dahulu."); 
    return; 
  }
  if (!skor) { 
    await showPopup("warning", "Belum Dinilai", "Pilih level capaian bintang."); 
    return; 
  }

  const loading = showLoading("Menyimpan penilaian...");
  const payload = {
    action: "saveNilai",
    siswaId: selectedSiswaId,
    pertemuan: selectedPertemuan,
    domain: domain,
    indikator: indikator,
    skor: skor.value,
    catatan: document.getElementById("p_catatan").value
  };

  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    await new Promise(r => setTimeout(r, 1200));
    loading.close();
    await showPopup("success", "Tersimpan!", "Penilaian rubrik berhasil dicatat.");
    refreshData(() => onPilihSiswa());
    showToast("Penilaian tersimpan", "success");
  } catch (err) {
    loading.close();
    await showPopup("error", "Gagal", "Terjadi kesalahan.");
    console.error(err);
  }
}

function renderRiwayatPenilaian(nilaiSiswa) {
  const box = document.getElementById("guru-riwayat");
  const sorted = [...nilaiSiswa].sort((a,b) => parseInt(a.pertemuan) - parseInt(b.pertemuan));
  box.innerHTML = `
    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-900">📚 Riwayat Penilaian</h3>
        <span class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">${sorted.length} pertemuan</span>
      </div>
      <div class="space-y-2.5 max-h-96 overflow-y-auto">
        ${sorted.length === 0 ? `<p class="text-xs text-slate-400 text-center py-6 italic">Belum ada penilaian.</p>` :
          sorted.map(n => {
            const s1 = getSkor(n);
            const warna = s1 >= 4 ? 'text-emerald-600 bg-emerald-50' : s1 >= 3 ? 'text-blue-600 bg-blue-50' : s1 >= 2 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
            return `
              <div class="p-4 bg-slate-50 rounded-2xl">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-800">Pertemuan ${String(n.pertemuan).replace(/\D/g,"")}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">${fmtTanggal(n.timestamp)}</p>
                  </div>
                  <div class="text-right shrink-0 ml-2">
                    <div>${renderBintangHtml(s1)}</div>
                    <p class="text-[10px] font-bold ${warna} mt-0.5 px-2 py-0.5 rounded-lg">${s1}/4</p>
                  </div>
                </div>
                <div class="space-y-1.5 mb-3">
                  <p class="text-[11px] text-slate-600 font-medium">${esc(n.domain)}</p>
                  <p class="text-[10px] text-slate-500">${esc(n.indikator)}</p>
                  ${n.catatan ? `<p class="text-[10px] text-slate-500 italic">"${esc(n.catatan)}"</p>` : ''}
                </div>
                <button onclick="openModalEdit('${esc(n.siswa_id)}', '${String(n.pertemuan).replace(/\D/g,"")}')" class="w-full text-[11px] text-purple-600 font-bold bg-purple-50 hover:bg-purple-100 py-2.5 rounded-xl transition-colors">✏️ Edit Nilai</button>
              </div>`;
          }).join('')}
      </div>
    </div>`;
}

// ============================================================
// MODAL EDIT NILAI
// ============================================================
function openModalEdit(siswaId, pertemuan) {
  const nilai = globalNilai.find(n => String(n.siswa_id) === String(siswaId) && String(n.pertemuan).replace(/\D/g,"") === String(pertemuan));
  if (!nilai) return;
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(siswaId));
  if (!siswa) return;
  
  const modal = document.getElementById("modal-edit");
  const content = document.getElementById("modal-edit-content");
  const rubrikUsia = getRubrikByUsia(siswa.usia);
  const domains = [...new Set(rubrikUsia.map(r => r.domain))];
  
  const opt = (val, label, desc, checked) => {
    const colors = { 1: 'text-rose-600', 2: 'text-amber-600', 3: 'text-blue-600', 4: 'text-emerald-600' };
    return `
      <label class="block bg-slate-50 border-2 ${checked == val ? 'border-purple-500 bg-purple-50' : 'border-slate-100'} p-3 rounded-2xl cursor-pointer">
        <div class="flex items-start space-x-2">
          <input type="radio" name="edit_p_skor" value="${val}" ${checked == val ? 'checked' : ''} class="mt-0.5">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-0.5">
              <span class="text-sm" style="color:#f59e0b">${"★".repeat(val)}${"<span style='color:#e2e8f0'>★</span>".repeat(4-val)}</span>
              <span class="text-[10px] font-bold ${colors[val]} uppercase">Star ${val} - ${label}</span>
            </div>
            <p class="text-[10px] text-slate-600 mt-0.5">${esc(desc || "-")}</p>
          </div>
        </div>
      </label>`;
  };
  
  content.innerHTML = `
    <div class="space-y-1">
      <span class="text-[10px] font-bold text-purple-600 uppercase">Pertemuan ${pertemuan}</span>
      <h4 class="text-sm font-bold text-slate-900">${esc(nilai.domain)}</h4>
      <p class="text-[10px] text-slate-500">Usia: ${siswa.usia} tahun</p>
    </div>
    <div class="bg-purple-50 border-l-4 border-purple-500 p-2.5 rounded-xl">
      <p class="text-[10px] font-bold text-purple-700 uppercase mb-1">Indikator</p>
      <p class="text-[10px] text-slate-700 leading-relaxed">${esc(nilai.indikator)}</p>
    </div>
    <div class="space-y-3 pt-3 border-t border-slate-100">
      <div>
        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Domain</label>
        <select id="edit_p_domain" onchange="onEditDomainChange()" class="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">
          ${domains.map(d => `<option value="${esc(d)}" ${nilai.domain === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Indikator</label>
        <select id="edit_p_indikator" onchange="onEditIndikatorChange()" class="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none"></select>
      </div>
      <div class="space-y-1.5">
        <p class="text-[10px] font-bold text-slate-600 uppercase tracking-wider ml-1">Pilih Capaian</p>
        <div id="edit_p_skor_options" class="space-y-1.5"></div>
      </div>
      <input type="text" id="edit_p_catatan" value="${esc(nilai.catatan || '')}" placeholder="Catatan" class="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:outline-none">
    </div>
    <button onclick="submitEditNilai('${esc(siswaId)}', '${pertemuan}')" class="w-full gradient-purple text-white font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-purple-200">💾 Simpan Perubahan</button>`;
  
  modal.classList.remove("hidden");
  
  // Init
  onEditDomainChange(nilai.indikator);
}

function onEditDomainChange(indikatorTarget) {
  const domain = document.getElementById("edit_p_domain").value;
  const siswa = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId || ""));
  // pakai data dari nilai yang sedang di-edit
  const nilaiRef = globalNilai.find(n => n.domain === domain);
  const usia = nilaiRef ? null : null;
  
  // Ambil siswa dari selectedSiswaId (bisa kosong di ortu)
  let siswaObj = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  if (!siswaObj && currentLoggedInUser && currentLoggedInUser.siswa_id) {
    siswaObj = globalSiswa.find(s => String(s.siswa_id) === String(currentLoggedInUser.siswa_id));
  }
  if (!siswaObj) return;
  
  const rubrikDomain = getRubrikByUsia(siswaObj.usia).filter(r => r.domain === domain);
  const selInd = document.getElementById("edit_p_indikator");
  selInd.innerHTML = rubrikDomain.map(r => `<option value="${esc(r.indikator)}" ${indikatorTarget === r.indikator ? 'selected' : ''}>${esc(r.indikator)}</option>`).join('');
  
  onEditIndikatorChange();
}

function onEditIndikatorChange() {
  const domain = document.getElementById("edit_p_domain").value;
  const indikator = document.getElementById("edit_p_indikator").value;
  
  let siswaObj = globalSiswa.find(s => String(s.siswa_id) === String(selectedSiswaId));
  if (!siswaObj && currentLoggedInUser && currentLoggedInUser.siswa_id) {
    siswaObj = globalSiswa.find(s => String(s.siswa_id) === String(currentLoggedInUser.siswa_id));
  }
  if (!siswaObj) return;
  
  const rubrik = getRubrikByUsia(siswaObj.usia).find(r => r.domain === domain && r.indikator === indikator);
  if (!rubrik) return;
  
  const existing = globalNilai.find(n => 
    String(n.siswa_id) === String(siswaObj.siswa_id) &&
    n.domain === domain && n.indikator === indikator
  );
  const currentSkor = existing ? existing.skor : 0;
  
  const labels = [
    { skor: 1, label: "Perlu Banyak Bantuan", desc: rubrik.star_1, color: "text-rose-600" },
    { skor: 2, label: "Dengan Bimbingan", desc: rubrik.star_2, color: "text-amber-600" },
    { skor: 3, label: "Mandiri", desc: rubrik.star_3, color: "text-blue-600" },
    { skor: 4, label: "Berkembang Sangat Baik", desc: rubrik.star_4, color: "text-emerald-600" }
  ];
  
  document.getElementById("edit_p_skor_options").innerHTML = labels.map(l => {
    const checked = currentSkor === l.skor;
    return `
      <label class="block bg-slate-50 border-2 ${checked ? 'border-purple-500 bg-purple-50' : 'border-slate-100'} p-3 rounded-2xl cursor-pointer">
        <div class="flex items-start space-x-2">
          <input type="radio" name="edit_p_skor" value="${l.skor}" ${checked ? 'checked' : ''} class="mt-0.5">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-0.5">
              <span class="text-sm" style="color:#f59e0b">${"★".repeat(l.skor)}${"<span style='color:#e2e8f0'>★</span>".repeat(4-l.skor)}</span>
              <span class="text-[10px] font-bold ${l.color} uppercase">Star ${l.skor} - ${l.label}</span>
            </div>
            <p class="text-[10px] text-slate-600 mt-0.5">${esc(l.desc || "-")}</p>
          </div>
        </div>
      </label>`;
  }).join('');
  
  document.querySelectorAll('input[name="edit_p_skor"]').forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('input[name="edit_p_skor"]').forEach(r => {
        const label = r.closest('label');
        if (r.checked) { label.classList.add('border-purple-500', 'bg-purple-50'); label.classList.remove('border-slate-100', 'bg-slate-50'); }
        else { label.classList.remove('border-purple-500', 'bg-purple-50'); label.classList.add('border-slate-100', 'bg-slate-50'); }
      });
    });
  });
}

function closeModalEdit() { document.getElementById("modal-edit").classList.add("hidden"); }

async function submitEditNilai(siswaId, pertemuan) {
  const domain = document.getElementById("edit_p_domain").value;
  const indikator = document.getElementById("edit_p_indikator").value;
  const skor = document.querySelector('input[name="edit_p_skor"]:checked');
  if (!skor) { await showPopup("warning", "Data Belum Lengkap", "Pilih bintang."); return; }
  
  const loading = showLoading("Menyimpan perubahan...");
  const payload = {
    action: "saveNilai",
    siswaId, pertemuan,
    domain: domain,
    indikator: indikator,
    skor: skor.value,
    catatan: document.getElementById("edit_p_catatan").value
  };
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    await new Promise(r => setTimeout(r, 1000));
    loading.close();
    closeModalEdit();
    await showPopup("success", "Terupdate!", "Perubahan nilai disimpan.");
    refreshData(() => {
      if (selectedSiswaId) onPilihSiswa();
      if (currentLoggedInUser && currentLoggedInUser.role === "ortu") renderLaporanAnak();
    });
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
    const um = new Map();
    nilaiSiswa.forEach(n => {
      const k = String(n.pertemuan).replace(/\D/g, "");
      if (!k) return;
      if (!um.has(k) || new Date(n.timestamp) > new Date(um.get(k).timestamp)) um.set(k, n);
    });
    const totalBintang = Array.from(um.values()).reduce((sum, n) => sum + getSkor(n), 0);
    const maxBintang = totalPertemuanUsia * 4;
    const persen = maxBintang > 0 ? ((totalBintang / maxBintang) * 100).toFixed(1) : 0;
    const rataBintang = um.size > 0 ? (totalBintang / um.size).toFixed(1) : 0;
    return { ...s, totalBintang, maxBintang, count: um.size, totalPertemuanUsia, persen, rataBintang };
  }).sort((a, b) => b.totalBintang - a.totalBintang);

  const totalSiswa = globalSiswa.length;
  const rataRata = totalSiswa > 0
    ? (stats.reduce((s, x) => s + parseFloat(x.persen), 0) / totalSiswa).toFixed(1)
    : 0;
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
      <h3 class="text-sm font-bold text-slate-900 mb-4">🏆 Peringkat Siswa (Bintang)</h3>
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
                  <p class="text-[10px] text-slate-400">${s.usia} thn • ${s.count}/${s.totalPertemuanUsia} pertemuan</p>
                </div>
                <div class="text-right shrink-0">
                  <div>${renderBintangHtml(s.rataBintang)}</div>
                  <p class="text-[10px] text-slate-500 font-bold">${s.totalBintang}⭐ • ${s.persen}%</p>
                </div>
              </div>`;
          }).join('')}
      </div>
    </div>

    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
      <h3 class="text-sm font-bold text-slate-900 mb-4">📊 Detail Capaian per Siswa</h3>
      <div class="space-y-3">
        ${stats.map(s => {
          const warna = parseFloat(s.persen) >= 85 ? 'bg-emerald-500' : parseFloat(s.persen) >= 65 ? 'bg-blue-500' : 'bg-amber-500';
          return `
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-slate-800">${esc(s.nama_siswa)} <span class="text-slate-400 font-normal">(${s.usia} thn)</span></span>
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
// RUBRIK
// ============================================================
function renderRubrikList() {
  const box = document.getElementById("rubrik-list");
  const total = document.getElementById("total-pertemuan");
  if (total) total.innerText = globalRubrik.length;
  if (!box) return;
  if (globalRubrik.length === 0) {
    box.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Rubrik kosong. Klik + untuk menambah.</p>`;
    return;
  }

  // Group by usia
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
  return `
    <div class="grid grid-cols-2 gap-3">
      ${field('rub_no', 'No.', r.no)}
      <div>
        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Usia</label>
        <select id="rub_usia" class="w-full mt-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs focus:border-purple-500 focus:bg-white focus:outline-none">${usiaOptions}</select>
      </div>
    </div>
    ${field('rub_domain', 'Domain', r.domain)}
    ${field('rub_indikator', 'Indikator', r.indikator, true)}
    ${field('rub_contoh', 'Contoh Perilaku yang Diamati', r.contoh_perilaku, true)}
    <div class="pt-3 border-t border-slate-100 space-y-3">
      <p class="text-[10px] font-bold text-purple-600 uppercase tracking-wider">⭐ 4 Level Capaian</p>
      ${field('rub_star1', 'Star 1 - Perlu Banyak Bantuan', r.star_1, true)}
      ${field('rub_star2', 'Star 2 - Dengan Bimbingan', r.star_2, true)}
      ${field('rub_star3', 'Star 3 - Mandiri', r.star_3, true)}
      ${field('rub_star4', 'Star 4 - Berkembang Sangat Baik', r.star_4, true)}
    </div>
    ${isEdit ? `<button onclick="hapusRubrikKonfirmasi('${esc(r.no)}', '${esc(r.usia)}')" class="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-2xl active:scale-[0.98] transition-all text-sm">🗑️ Hapus Rubrik Ini</button>` : ''}
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
// DASHBOARD SUPERADMIN
// ============================================================
function renderDashboard() {
  const box = document.getElementById("tab-dashboard");
  if (!box) return;
  const totalSiswa = globalSiswa.length;
  const totalNilai = globalNilai.length;

  const stats = globalSiswa.map(s => {
    const nilaiSiswa = globalNilai.filter(n => String(n.siswa_id) === String(s.siswa_id));
    const um = new Map();
    nilaiSiswa.forEach(n => {
      const k = String(n.pertemuan).replace(/\D/g,"");
      if (!um.has(k) || new Date(n.timestamp) > new Date(um.get(k).timestamp)) um.set(k, n);
    });
    const total = Array.from(um.values()).reduce((sum, n) => sum + getSkor(n), 0);
    const levelSiswa = globalLevel.find(l => l.level === s.level_saat_ini);
    const totalPertemuan = levelSiswa ? (parseInt(levelSiswa.pertemuan_max) - parseInt(levelSiswa.pertemuan_min) + 1) : 0;
    const maxBintang = totalPertemuan * 4;
    return { ...s, totalBintang: total, count: um.size, maxBintang, persen: maxBintang > 0 ? ((total/maxBintang)*100).toFixed(1) : 0 };
  }).sort((a,b) => b.totalBintang - a.totalBintang);

  box.innerHTML = `
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Dashboard</h2>
      <p class="text-xs text-slate-500 mt-1">Pantau perkembangan seluruh siswa</p>
    </div>
    <div class="grid grid-cols-3 gap-2">
      <div class="gradient-purple p-4 rounded-3xl text-white shadow-soft">
        <p class="text-[9px] uppercase tracking-wider text-white/70">Siswa</p>
        <p class="text-2xl font-bold mt-1">${totalSiswa}</p>
      </div>
      <div class="gradient-green p-4 rounded-3xl text-white shadow-soft">
        <p class="text-[9px] uppercase tracking-wider text-white/70">Rubrik</p>
        <p class="text-2xl font-bold mt-1">${globalRubrik.length}</p>
      </div>
      <div class="gradient-blue p-4 rounded-3xl text-white shadow-soft">
        <p class="text-[9px] uppercase tracking-wider text-white/70">Penilaian</p>
        <p class="text-2xl font-bold mt-1">${totalNilai}</p>
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
                <p class="text-[10px] text-slate-400">${s.usia} thn • ${s.count} pertemuan</p>
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
  const um = new Map();
  nilaiList.forEach(n => {
    const k = String(n.pertemuan).replace(/\D/g, "");
    if (!k) return;
    if (!um.has(k) || new Date(n.timestamp) > new Date(um.get(k).timestamp)) um.set(k, n);
  });
  const nilaiUnik = Array.from(um.values());

  const levelData = globalLevel.map(lv => {
    const min = parseInt(lv.pertemuan_min), max = parseInt(lv.pertemuan_max);
    const filtered = nilaiUnik.filter(n => {
      const p = parseInt(String(n.pertemuan).replace(/\D/g,""));
      return p >= min && p <= max;
    });
    const total = filtered.reduce((s, n) => s + getSkor(n), 0);
    const maxP = max - min + 1;
    return {
      level: lv.level, icon: lv.icon || "📘", warna: lv.warna || "#7c3aed",
      total, max: maxP * 4, count: filtered.length, maxP,
      selesai: maxP > 0 && filtered.length >= maxP
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
  const rataBintang = nilaiUnik.length > 0 ? (grandTotal / nilaiUnik.length).toFixed(1) : 0;

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
            <p class="text-[9px] text-white/60">${nilaiUnik.length} pertemuan dinilai</p>
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
        <h3 class="text-sm font-bold text-slate-900">📝 Riwayat Bintang</h3>
        <span class="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">${nilaiUnik.length}</span>
      </div>
      <div class="space-y-2.5 max-h-96 overflow-y-auto">
        ${nilaiUnik.length > 0 ? nilaiUnik.sort((a,b) => parseInt(String(a.pertemuan).replace(/\D/g,"")) - parseInt(String(b.pertemuan).replace(/\D/g,""))).map(n => {
          const s1 = getSkor(n);
          const warna = s1 >= 4 ? 'text-emerald-600 bg-emerald-50' : s1 >= 3 ? 'text-blue-600 bg-blue-50' : s1 >= 2 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
          return `
            <div class="p-3.5 bg-slate-50 rounded-2xl">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800">Pertemuan ${String(n.pertemuan).replace(/\D/g,"")}</p>
                  <p class="text-[10px] text-slate-400">${fmtTanggal(n.timestamp)}</p>
                </div>
                <div class="text-right shrink-0">
                  <div>${renderBintangHtml(s1)}</div>
                  <p class="text-[10px] font-bold ${warna} px-2 py-0.5 rounded-lg mt-0.5">${s1}/4</p>
                </div>
              </div>
              <p class="text-[10px] text-slate-500 font-medium">${esc(n.domain)}</p>
              <p class="text-[10px] text-slate-500 truncate">${esc(n.indikator)}</p>
              ${n.catatan ? `<p class="text-[10px] text-slate-500 italic mt-1">"${esc(n.catatan)}"</p>` : ''}
            </div>`;
        }).join('') : `<p class="text-xs text-slate-400 text-center py-6 italic">Belum ada nilai.</p>`}
      </div>
    </div>`;
  renderChart(nilaiUnik);
}

function renderChart(nilaiList) {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (myChartInstance) myChartInstance.destroy();
  const sorted = [...nilaiList].sort((a, b) => parseInt(String(a.pertemuan).replace(/\D/g,"")) - parseInt(String(b.pertemuan).replace(/\D/g,"")));
  const labels = sorted.map(n => `P${String(n.pertemuan).replace(/\D/g,"")}`);
  const data = sorted.map(n => getSkor(n));
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
// LAPORAN HASIL BELAJAR
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
        ? `<button onclick="lihatLaporanLevel('${esc(sl.nama)}')" class="w-full text-white font-bold py-3 rounded-2xl active:scale-[0.98] transition-all text-xs" style="background: ${sl.warna}; box-shadow: 0 8px 20px -4px ${sl.warna}60;">
            📄 Lihat & Download Laporan PDF
          </button>`
        : `<div class="bg-slate-50 text-slate-500 text-center text-[11px] font-semibold py-3 rounded-2xl">
            Belum ada penilaian di level ini
          </div>`}
    </div>`).join('');
}

async function lihatLaporanLevel(namaLevel) {
  const containerEl = document.getElementById("laporan-container-preview");
  const loading = showLoading("Memuat laporan...");
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getLaporan&siswaId=${currentLoggedInUser.siswa_id}&level=${encodeURIComponent(namaLevel)}`).then(r => r.json());
    loading.close();
    if (res.status !== "success" || !res.data) {
      await showPopup("error", "Gagal", res.message || "Tidak dapat memuat laporan.");
      return;
    }
    laporanData = res.data;
    containerEl.classList.remove("hidden");
    await renderLaporan(res.data);
    containerEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    loading.close();
    console.error(err);
    await showPopup("error", "Gagal", "Terjadi kesalahan memuat laporan.");
  }
}

async function generateQRCode(text) {
  try {
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, text, {
      width: 300, margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "H"
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("QR Error:", err);
    return "";
  }
}

async function renderLaporan(data) {
  const container = document.getElementById("laporan-container-preview");
  const s = data.siswa;
  const lv = data.level;
  const predikatColor = data.predikatColor;

  const detailNilai = data.detailNilai;
  const chartLabels = detailNilai.map(n => `P${n.pertemuan}`);
  const chartData = detailNilai.map(n => n.skor);

  const verifyUrl = `${SCRIPT_URL}?action=getLaporan&siswaId=${s.id}&level=${encodeURIComponent(lv.nama)}`;
  const qrDataUrl = await generateQRCode(verifyUrl);

  const fotoHtml = s.foto_url
    ? `<img src="${esc(s.foto_url)}" alt="Foto" style="width: 25mm; height: 25mm; border-radius: 50%; object-fit: cover; border: 1mm solid ${predikatColor};">`
    : `<div style="width: 25mm; height: 25mm; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 10mm; color: white; font-weight: 900; border: 1mm solid ${predikatColor};">${esc(s.nama).charAt(0).toUpperCase()}</div>`;

  const page1 = `
    <div class="laporan-page">
      <div class="laporan-border-outer" style="border-color: ${lv.warna};"></div>
      <div class="laporan-border-inner" style="border-color: ${lv.warna};"></div>

      <div style="position: absolute; inset: 15mm; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center;">
        
        <div style="width: 100%;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 4mm; margin-bottom: 4mm;">
            <div style="width: 14mm; height: 14mm; background: linear-gradient(135deg, ${lv.warna}, ${predikatColor}); border-radius: 3mm; display: flex; align-items: center; justify-content: center; color: white; font-size: 7mm;">🤖</div>
            <div style="text-align: left;">
              <div style="font-size: 5mm; font-weight: 900; color: ${lv.warna}; letter-spacing: 1px;">RoboClass</div>
              <div style="font-size: 2mm; color: #64748b; font-weight: 600; letter-spacing: 1.5px;">ROBOTIC CLASS MANAGEMENT</div>
            </div>
          </div>
          <div style="width: 50mm; height: 0.8mm; background: linear-gradient(90deg, transparent, ${predikatColor}, transparent); margin: 0 auto;"></div>
        </div>

        <div style="margin: 3mm 0;">${fotoHtml}</div>

        <div style="margin: 2mm 0;">
          <div style="font-size: 4mm; color: #64748b; letter-spacing: 5px; font-weight: 600;">LAPORAN</div>
          <div style="font-size: 11mm; font-weight: 900; color: #0f172a; letter-spacing: 3px; line-height: 1; margin-top: 1mm;">HASIL BELAJAR</div>
          <div style="font-size: 2.5mm; color: #94a3b8; letter-spacing: 3px; margin-top: 1mm;">CHILD LEARNING REPORT</div>
        </div>

        <div style="width: 100%;">
          <div style="font-size: 2.8mm; color: #64748b; margin-bottom: 1mm;">Nama Anak:</div>
          <div style="font-size: 9mm; font-weight: 900; color: ${predikatColor}; letter-spacing: 1px; line-height: 1.1; margin-bottom: 1mm;">${esc(s.nama)}</div>
          <div style="width: 80mm; height: 0.4mm; background: linear-gradient(90deg, transparent, ${predikatColor}, transparent); margin: 0 auto 1mm;"></div>
          <div style="font-size: 2.5mm; color: #64748b;">ID: ${esc(s.id)} • Usia: ${s.usia} tahun • Wali: ${esc(s.orangTua)}</div>
        </div>

        <div style="max-width: 180mm; margin: 2mm 0;">
          <div style="font-size: 3mm; color: #475569; line-height: 1.6;">
            telah mengikuti program <b style="color: ${lv.warna};">${lv.nama}</b>
            (Pertemuan ${lv.min}-${lv.max}) dengan capaian
          </div>
          <div style="margin: 2mm 0;">
            <span style="display: inline-block; padding: 1.5mm 6mm; background: ${predikatColor}; color: white; border-radius: 3mm; font-size: 4.5mm; font-weight: 900; letter-spacing: 2px;">
              ${data.predikatIcon} ${data.predikat}
            </span>
          </div>
          <div style="font-size: 3mm; color: #475569;">
            Total perolehan <b style="color: ${lv.warna};">${data.grandTotal} ⭐</b> dari maksimal ${data.skorMaksimalLevel} ⭐ (${data.persenAkhir}%)
          </div>
        </div>

        <div style="width: 100%; display: flex; align-items: flex-end; justify-content: space-between; gap: 4mm;">
          <div style="text-align: center; flex: 1;">
            <div style="font-size: 2.5mm; color: #64748b; margin-bottom: 1mm;">Tanggal Cetak</div>
            <div style="font-size: 3mm; font-weight: 700; color: #0f172a;">${data.tanggalCetak}</div>
          </div>

          <div style="text-align: center; flex: 1;">
            <div style="font-size: 3mm; font-weight: 700; color: #0f172a; border-bottom: 0.4mm solid #0f172a; padding-bottom: 1mm; min-width: 35mm;">Arni Irenawati, S.Si</div>
            <div style="font-size: 2.5mm; color: #64748b; margin-top: 1mm;">Kepala Program RoboClass</div>
          </div>

          <div style="text-align: center; flex: 0.5;">
            <img src="${qrDataUrl}" alt="QR" style="width: 18mm; height: 18mm; border: 0.4mm solid #e2e8f0; padding: 0.8mm; background: white; border-radius: 1.5mm;">
            <div style="font-size: 1.8mm; color: #94a3b8; margin-top: 0.8mm;">Scan verifikasi</div>
          </div>
        </div>
      </div>
    </div>`;

  const page2 = `
    <div class="laporan-page">
      <div class="laporan-border-outer" style="border-color: ${lv.warna};"></div>
      <div class="laporan-border-inner" style="border-color: ${lv.warna};"></div>

      <div style="position: absolute; inset: 12mm; display: flex; flex-direction: column;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 0.8mm solid ${predikatColor}; padding-bottom: 2mm; margin-bottom: 3mm;">
          <div style="display: flex; align-items: center; gap: 2.5mm;">
            <div style="width: 10mm; height: 10mm; background: linear-gradient(135deg, ${lv.warna}, ${predikatColor}); border-radius: 2.5mm; display: flex; align-items: center; justify-content: center; color: white; font-size: 5mm;">${lv.icon}</div>
            <div>
              <div style="font-size: 4mm; font-weight: 900; color: ${lv.warna};">DETAIL CAPAIAN</div>
              <div style="font-size: 2.2mm; color: #64748b;">${lv.nama} • Pertemuan ${lv.min}-${lv.max}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 3mm; font-weight: 900; color: #0f172a;">${esc(s.nama)}</div>
            <div style="font-size: 2.2mm; color: #64748b;">ID: ${esc(s.id)} • ${data.tanggalCetak}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 4mm; flex: 1; overflow: hidden;">
          <div style="display: flex; flex-direction: column;">
            <div style="font-size: 2.8mm; font-weight: 900; color: #0f172a; margin-bottom: 2mm; padding-bottom: 1mm; border-bottom: 0.4mm solid #e2e8f0;">📈 GRAFIK PERKEMBANGAN</div>
            <div style="background: #fafafe; border: 0.4mm solid #e2e8f0; border-radius: 2mm; padding: 2mm; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 70mm;">
              <canvas id="laporanChart" style="max-width: 100%; max-height: 70mm;"></canvas>
            </div>
            <div style="margin-top: 2mm; background: linear-gradient(135deg, ${predikatColor}15, ${predikatColor}05); border-left: 0.8mm solid ${predikatColor}; padding: 2mm; border-radius: 1mm;">
              <div style="font-size: 2.2mm; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Perolehan</div>
              <div style="font-size: 5mm; font-weight: 900; color: ${predikatColor};">${data.grandTotal} ⭐<span style="font-size: 2.5mm; color: #94a3b8;">/${data.skorMaksimalLevel} ⭐</span> <span style="font-size: 2.5mm; color: #64748b;">(${data.persenAkhir}%)</span></div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; overflow: hidden;">
            <div style="font-size: 2.8mm; font-weight: 900; color: #0f172a; margin-bottom: 2mm; padding-bottom: 1mm; border-bottom: 0.4mm solid #e2e8f0;">📋 RINCIAN PENILAIAN</div>
            <div style="overflow-y: auto; flex: 1;">
              <table style="width: 100%; border-collapse: collapse; font-size: 2.2mm;">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="padding: 1.2mm; text-align: center; color: #475569; font-weight: 700; width: 10%;">P</th>
                    <th style="padding: 1.2mm; text-align: left; color: #475569; font-weight: 700;">Domain / Indikator</th>
                    <th style="padding: 1.2mm; text-align: center; color: #475569; font-weight: 700; width: 22%;">Bintang</th>
                  </tr>
                </thead>
                <tbody>
                  ${detailNilai.filter(n => n.skor > 0).map(n => `
                    <tr style="border-bottom: 0.2mm solid #e2e8f0;">
                      <td style="padding: 1mm; text-align: center; font-weight: 700; color: ${lv.warna};">${n.pertemuan}</td>
                      <td style="padding: 1mm; color: #334155;">
                        <div style="font-weight: 600;">${esc(n.domain)}</div>
                        <div style="font-size: 1.9mm; color: #64748b;">${esc(n.indikator)}</div>
                        ${n.catatan ? `<div style="font-size: 1.8mm; color: #94a3b8; font-style: italic; margin-top: 0.5mm;">"${esc(n.catatan)}"</div>` : ''}
                      </td>
                      <td style="padding: 1mm; text-align: center;">
                        <span style="color:#f59e0b;font-size:2.5mm;">${"★".repeat(n.skor)}${"<span style='color:#e2e8f0'>★</span>".repeat(4-n.skor)}</span>
                        <div style="font-size: 1.8mm; color: #64748b;">${n.skor}/4</div>
                      </td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>
            <div style="margin-top: 2mm; background: #f8fafc; border-radius: 1mm; padding: 2mm; display: flex; justify-content: space-between; font-size: 2.2mm; color: #475569;">
              <span>Rata-rata bintang per pertemuan</span>
              <span style="font-weight: 900; color: ${lv.warna};">${data.totalPertemuan > 0 ? (data.grandTotal/data.totalPertemuan).toFixed(1) : 0} ⭐</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 2mm; border-top: 0.4mm solid #e2e8f0; padding-top: 1.5mm; display: flex; justify-content: space-between; font-size: 2mm; color: #94a3b8;">
          <span>${data.totalPertemuan}/${data.totalPertemuanLevel} pertemuan dinilai • Total: <b style="color: ${lv.warna};">${data.grandTotal}⭐/${data.skorMaksimalLevel}⭐</b> (${data.persenAkhir}%)</span>
          <span>Laporan No: RC-${lv.nama.replace(/\s+/g, '').substring(0,6).toUpperCase()}-${s.id}-${new Date().getFullYear()}</span>
        </div>
      </div>
    </div>`;

  container.innerHTML = `
    <div class="flex items-center justify-between no-print mb-3">
      <h3 class="text-sm font-bold text-slate-900">📄 Preview Laporan — ${esc(lv.nama)}</h3>
      <button onclick="downloadLaporan()" class="gradient-purple text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all flex items-center space-x-2 text-xs font-bold">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        <span>Download PDF</span>
      </button>
    </div>
    ${page1}${page2}`;

  setTimeout(() => {
    const canvas = document.getElementById("laporanChart");
    if (canvas && chartLabels.length > 0) {
      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Bintang',
            data: chartData,
            borderColor: lv.warna,
            backgroundColor: lv.warna + '20',
            borderWidth: 2.5,
            pointBackgroundColor: lv.warna,
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5,
            pointRadius: 4,
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
  }, 200);
}

async function downloadLaporan() {
  if (!laporanData) { await showPopup("warning", "Data Belum Siap", "Laporan belum dimuat."); return; }
  const ok = await showConfirm(
    "Cetak Laporan 📄",
    "Pada dialog print, pilih:<br>• Tujuan: <b>Save as PDF</b><br>• Ukuran: <b>A4</b><br>• Orientasi: <b>Landscape</b><br>• Centang <b>Background graphics</b>",
    "Lanjut Cetak", "Batal"
  );
  if (!ok) return;
  setTimeout(() => window.print(), 300);
}

console.log("RoboClass Manager v3 loaded");

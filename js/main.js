(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const C = { green: "#2e8b57", blue: "#2b7bb9", pink: "#d9486b", yellow: "#c99a00", ink: "#111111",
              gL: "#B9E4C9", bL: "#A9D8F5", pL: "#F9C9D4", yL: "#FFF3B0" };
  const npr = (v) => "NPR " + Math.round(v).toLocaleString("en-US");
  const nprM = (v) => "NPR " + v.toFixed(1) + " M";
  if (window.Chart) { Chart.defaults.font.family = "Arial, Helvetica, sans-serif"; Chart.defaults.color = "#111"; }

  /* ---------- Navigation ---------- */
  const nav = $("#nav"), tog = $(".nav-toggle");
  tog.addEventListener("click", () => { const o = nav.classList.toggle("open"); tog.setAttribute("aria-expanded", o); });
  $$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); tog.setAttribute("aria-expanded", false); }));

  /* ---------- Language ---------- */
  const i18nEls = $$("[data-i18n]");
  i18nEls.forEach(el => { el.dataset.en = el.innerHTML; });
  function setLang(lang) {
    i18nEls.forEach(el => {
      const ne = window.BRM_NE && window.BRM_NE[el.dataset.i18n];
      el.innerHTML = (lang === "ne" && ne) ? ne : el.dataset.en;
    });
    document.documentElement.lang = lang === "ne" ? "ne" : "en";
    $$(".lang-switch button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    try { localStorage.setItem("brm-lang", lang); } catch (e) {}
    renderDmaic(currentDm);
  }
  $$(".lang-switch button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: 0.05 });
  $$(".step, .rung").forEach((el, i) => { el.style.transitionDelay = (i % 6) * 0.12 + "s"; io.observe(el); });

  /* ---------- Issue tree ---------- */
  const treeText = {
    root: "Start with the full question and agree the target: back to a 12% operating margin within 6 months. Every branch below must add up to explain the 4-point drop.",
    rev: "Revenue side: did we sell less, at lower prices, or more of the products that earn little? We compare this year and last year by product, customer and month.",
    price: "Test: compare average selling price per product with last year and with list prices. Data: invoices. Typical finding: unofficial discounts to large customers.",
    vol: "Test: units sold by product and customer. Data: sales register. Typical finding: two key customers reduced orders after a competitor entered.",
    mix: "Test: margin per product (costing sheet) multiplied by the change in volume. Typical finding: growth came mainly from low-margin products.",
    cost: "Cost side: did any cost line grow faster than sales? We build cost per unit for the main products and compare periods.",
    mat: "Test: material used per unit against the bill of materials; weigh scrap for two weeks. Typical finding: 6 to 10% more material used than the standard.",
    energy: "Test: energy cost per unit from monthly bills and production. Typical finding: idle machines running between shifts, compressed air leaks.",
    labour: "Test: output per worker-day by team; time studies of key products. Typical finding: waiting for material and rework, not slow workers.",
    ovh: "Test: overhead lines against budget. Typical finding: new expenses added without a clear benefit or owner."
  };
  const info = $("#treeInfo");
  $$("#issueTree .node").forEach(n => n.addEventListener("click", () => {
    $$("#issueTree .node").forEach(x => x.classList.remove("sel")); n.classList.add("sel");
    info.textContent = treeText[n.dataset.info];
  }));
  info.textContent = treeText.root;

  /* ---------- Tabs ---------- */
  const inited = {};
  function initTab(id) {
    if (inited[id]) return; inited[id] = true;
    if (id === "t-ops") { drawSPC(); drawGauge(); }
    if (id === "t-mc") runMC();
    if (id === "t-fin") { updateBridge(); updateWC(); }
    if (id === "t-sus") updateCO2();
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => x.classList.remove("active")); t.classList.add("active");
    $$(".panel").forEach(p => p.classList.remove("active"));
    $("#" + t.dataset.tab).classList.add("active");
    initTab(t.dataset.tab);
    if (t.dataset.tab === "t-it") $$("#ladder .rung").forEach(r => io.observe(r));
  }));

  /* ---------- DMAIC ---------- */
  const dmaic = [
    ["Define", "Problem: 7.8% of velvet-covered display items need rework, costing about NPR 180,000 a month. Goal: below 3% within 12 weeks. Scope: wrapping and gluing in two production cells."],
    ["Measure", "Two weeks of daily tally sheets by defect type. Result: glue stains 41%, wrinkles 27%, loose corners 19%, wrong colour 8%, other 5%. Measurement system checked with supervisors."],
    ["Analyse", "Pareto: glue stains and wrinkles make up 68% of rework. Fishbone and 5 Whys point to too much glue from open pots and no wrapping jig. Rework is 2.4 times higher in the afternoon shift."],
    ["Improve", "Metered glue bottles, a laser-cut wrapping jig, one-page standard work with photos, and drying racks. Piloted in one cell for three weeks: rework fell from 7.8% to 2.6%."],
    ["Control", "Daily rework chart posted in each cell, weekly 5S audit, training for new workers, and a control plan. Result checked at 30 and 90 days before rolling out to all cells."]
  ];
  let currentDm = 0;
  function renderDmaic(k) {
    currentDm = k;
    $$("#dmaicSteps .dm").forEach(b => b.classList.toggle("active", +b.dataset.k === k));
    $("#dmaicText").innerHTML = "<b>" + dmaic[k][0] + ".</b> " + dmaic[k][1] + "<br><small class='small'>Illustrative example.</small>";
  }
  $$("#dmaicSteps .dm").forEach(b => b.addEventListener("click", () => renderDmaic(+b.dataset.k)));
  renderDmaic(0);

  /* ---------- OEE gauge ---------- */
  function drawGauge() {
    const a = +$("#sA").value, p = +$("#sP").value, q = +$("#sQ").value;
    $("#oA").textContent = a; $("#oP").textContent = p; $("#oQ").textContent = q;
    const oee = a * p * q / 10000;
    $("#oeeVal").textContent = oee.toFixed(0) + "%";
    $("#oeeNote").textContent = oee >= 85 ? "World-class level" : oee >= 65 ? "Typical; room to improve" : "Large hidden capacity";
    const cv = $("#oeeGauge"), ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1; cv.width = 260 * dpr; cv.height = 150 * dpr; cv.style.width = "260px"; cv.style.height = "150px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, 260, 150);
    const cx = 130, cy = 135, r = 105;
    const seg = [[0, .65, C.pL], [.65, .85, C.yL], [.85, 1, C.gL]];
    seg.forEach(([s, e, col]) => { ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI + s * Math.PI, Math.PI + e * Math.PI); ctx.lineWidth = 26; ctx.strokeStyle = col; ctx.stroke(); });
    const ang = Math.PI + Math.min(oee, 100) / 100 * Math.PI;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + (r - 8) * Math.cos(ang), cy + (r - 8) * Math.sin(ang));
    ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, 2 * Math.PI); ctx.fillStyle = C.ink; ctx.fill();
  }
  ["#sA", "#sP", "#sQ"].forEach(s => $(s).addEventListener("input", drawGauge));

  /* ---------- SPC ---------- */
  let spcChart;
  function randn() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function drawSPC() {
    const n = 30, base = [];
    for (let i = 0; i < n; i++) base.push(Math.max(0.5, 4 + 0.7 * randn()));
    const shift = 18 + Math.floor(Math.random() * 6);
    base[shift] = 4 + 0.7 * 3.6;               // special cause above the upper limit
    const mean = 4, sd = 0.7, ucl = mean + 3 * sd, lcl = Math.max(0, mean - 3 * sd);
    const labels = base.map((_, i) => "Day " + (i + 1));
    const ptCol = base.map(v => (v > ucl || v < lcl) ? C.pink : C.blue);
    const ptRad = base.map(v => (v > ucl || v < lcl) ? 7 : 3);
    const data = {
      labels,
      datasets: [
        { label: "Rework %", data: base.map(v => +v.toFixed(2)), borderColor: C.blue, pointBackgroundColor: ptCol, pointRadius: ptRad, tension: 0.2 },
        { label: "Upper limit", data: labels.map(() => +ucl.toFixed(2)), borderColor: C.pink, borderDash: [6, 4], pointRadius: 0 },
        { label: "Mean", data: labels.map(() => mean), borderColor: C.green, pointRadius: 0 },
        { label: "Lower limit", data: labels.map(() => +lcl.toFixed(2)), borderColor: C.pink, borderDash: [6, 4], pointRadius: 0 }
      ]
    };
    const opts = { responsive: true, maintainAspectRatio: false, animation: { duration: 900 },
      plugins: { legend: { position: "bottom" }, tooltip: { mode: "index", intersect: false } },
      scales: { y: { title: { display: true, text: "Rework (%)" }, min: 0 }, x: { ticks: { maxTicksLimit: 10 } } } };
    if (spcChart) { spcChart.data = data; spcChart.update(); } else spcChart = new Chart($("#spcChart"), { type: "line", data, options: opts });
  }
  $("#spcNew").addEventListener("click", drawSPC);

  /* ---------- Monte Carlo ---------- */
  let mcChart;
  const scen = {
    base: { dem: 10000, demSd: 15, price: 120, priceSd: 5, vc: 85, vcSd: 8, fix: 250000 },
    energy: { dem: 10000, demSd: 15, price: 120, priceSd: 5, vc: 95, vcSd: 12, fix: 260000 },
    slump: { dem: 8000, demSd: 25, price: 115, priceSd: 6, vc: 85, vcSd: 8, fix: 250000 },
    contract: { dem: 11500, demSd: 10, price: 116, priceSd: 4, vc: 84, vcSd: 7, fix: 255000 }
  };
  $$(".chip").forEach(ch => ch.addEventListener("click", () => {
    const s = scen[ch.dataset.s];
    $("#mDem").value = s.dem; $("#mDemSd").value = s.demSd; $("#mPrice").value = s.price; $("#mPriceSd").value = s.priceSd;
    $("#mVc").value = s.vc; $("#mVcSd").value = s.vcSd; $("#mFix").value = s.fix;
    $$(".chip").forEach(x => x.classList.remove("active")); ch.classList.add("active");
    runMC();
  }));
  function runMC() {
    const g = id => Math.max(0, +$(id).value || 0);
    const dem = g("#mDem"), dSd = g("#mDemSd") / 100, pr = g("#mPrice"), pSd = g("#mPriceSd") / 100, vc = g("#mVc"), vSd = g("#mVcSd") / 100, fix = g("#mFix");
    const N = 10000, out = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const d = Math.max(0, dem * (1 + dSd * randn()));
      const p = Math.max(0, pr * (1 + pSd * randn()));
      const c = Math.max(0, vc * (1 + vSd * randn()));
      out[i] = d * (p - c) - fix;
    }
    const s = Array.from(out).sort((a, b) => a - b);
    const q = f => s[Math.floor(f * (N - 1))];
    const loss = s.filter(v => v < 0).length / N;
    $("#mP10").textContent = npr(q(0.1)); $("#mP50").textContent = npr(q(0.5)); $("#mP90").textContent = npr(q(0.9));
    $("#mLoss").textContent = (loss * 100).toFixed(1) + "%";
    const lo = q(0.005), hi = q(0.995), bins = 30, w = (hi - lo) / bins || 1;
    const counts = new Array(bins).fill(0);
    s.forEach(v => { if (v >= lo && v <= hi) counts[Math.min(bins - 1, Math.floor((v - lo) / w))]++; });
    const labels = counts.map((_, i) => Math.round((lo + (i + 0.5) * w) / 1000) + "k");
    const cols = counts.map((_, i) => (lo + (i + 0.5) * w) < 0 ? C.pink : C.green);
    const data = { labels, datasets: [{ label: "Number of simulated months", data: counts, backgroundColor: cols, borderColor: C.ink, borderWidth: 0.5 }] };
    const opts = { responsive: true, maintainAspectRatio: false, animation: { duration: 700 },
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: it => "Profit ≈ NPR " + it[0].label } } },
      scales: { x: { title: { display: true, text: "Monthly profit (NPR, thousands); pink = loss" }, ticks: { maxTicksLimit: 8 } }, y: { title: { display: true, text: "Frequency" } } } };
    if (mcChart) { mcChart.data = data; mcChart.update(); } else mcChart = new Chart($("#mcChart"), { type: "bar", data, options: opts });
  }
  $("#mRun").addEventListener("click", runMC);

  /* ---------- EBITDA bridge ---------- */
  let bridge;
  function updateBridge() {
    const p = +$("#fPr").value / 100, v = +$("#fVo").value / 100, m = +$("#fMa").value / 100, e = +$("#fEn").value / 100, f = +$("#fFx").value;
    const sign = x => (x > 0 ? "+" : "") + x;
    $("#oPr").textContent = sign(+$("#fPr").value); $("#oVo").textContent = sign(+$("#fVo").value);
    $("#oMa").textContent = sign(+$("#fMa").value); $("#oEn").textContent = sign(+$("#fEn").value); $("#oFx").textContent = sign(+$("#fFx").value);
    // Base year (NPR million): sales 100, material 55, energy 8, labour 15 (half variable), fixed 10 => EBITDA 12
    const base = 12;
    const vol = 100 * v - 55 * v - 8 * v - 7.5 * v;
    const price = 100 * p * (1 + v);
    const mat = -55 * m * (1 + v);
    const en = -8 * e * (1 + v);
    const fx = -f;
    const fin = base + vol + price + mat + en + fx;
    const sales = 100 * (1 + v) * (1 + p);
    $("#fNew").textContent = nprM(fin);
    $("#fMarg").textContent = (fin / sales * 100).toFixed(1) + "%";
    const steps = [["Base EBITDA", base, "total"], ["Volume", vol], ["Price", price], ["Material", mat], ["Energy", en], ["Fixed costs", fx], ["New EBITDA", fin, "total"]];
    let run = 0; const bars = [], cols = [];
    steps.forEach(([name, val, t]) => {
      if (t === "total") { bars.push([0, val]); cols.push(C.bL); run = val; }
      else { bars.push([run, run + val]); cols.push(val >= 0 ? C.gL : C.pL); run += val; }
    });
    const data = { labels: steps.map(s => s[0]), datasets: [{ data: bars, backgroundColor: cols, borderColor: C.ink, borderWidth: 1, borderSkipped: false }] };
    const opts = { responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => { const [a, b] = c.raw; const t = steps[c.dataIndex][2]; return t ? "NPR " + b.toFixed(2) + " M" : (b - a >= 0 ? "+" : "") + (b - a).toFixed(2) + " M"; } } } },
      scales: { y: { title: { display: true, text: "NPR million" } } } };
    if (bridge) { bridge.data = data; bridge.update(); } else bridge = new Chart($("#bridgeChart"), { type: "bar", data, options: opts });
  }
  ["#fPr", "#fVo", "#fMa", "#fEn", "#fFx"].forEach(s => $(s).addEventListener("input", updateBridge));

  function updateWC() {
    const rec = +$("#wRec").value || 0, sales = +$("#wSales").value || 1, tgt = +$("#wTarget").value || 0;
    const dso = rec / sales * 30, release = Math.max(0, rec - sales * tgt / 30);
    $("#wOut").textContent = "Customers take about " + dso.toFixed(0) + " days to pay. Collecting within " + tgt + " days would release " + npr(release) + " of cash.";
  }
  ["#wRec", "#wSales", "#wTarget"].forEach(s => $(s).addEventListener("input", updateWC));

  /* ---------- CO2 ---------- */
  let co2Chart;
  function updateCO2() {
    const kwh = +$("#cKwh").value || 0, kp = +$("#cKwhP").value || 0, gf = +$("#cGrid").value || 0;
    const dsl = +$("#cDsl").value || 0, dp = +$("#cDslP").value || 0, units = +$("#cUnits").value || 1, eff = +$("#cEff").value / 100;
    $("#oEff").textContent = $("#cEff").value;
    const co2E = kwh * gf / 1000, co2D = dsl * 2.68 / 1000;
    const costE = kwh * kp, costD = dsl * dp;
    $("#kCo2").textContent = (co2E + co2D).toFixed(1) + " t";
    const after = 1 - eff;
    $("#kCpu").textContent = "NPR " + ((costE + costD) / units).toFixed(2) + " → " + ((costE + costD) * after / units).toFixed(2);
    $("#kSave").textContent = npr((costE + costD) * eff * 12);
    $("#kAvoid").textContent = ((co2E + co2D) * eff * 12).toFixed(0) + " t";
    const data = { labels: ["Electricity", "Diesel"], datasets: [
      { label: "Cost today (NPR thousand/month)", data: [costE / 1000, costD / 1000], backgroundColor: C.bL, borderColor: C.ink, borderWidth: 1, yAxisID: "y" },
      { label: "Cost after improvement", data: [costE * after / 1000, costD * after / 1000], backgroundColor: C.gL, borderColor: C.ink, borderWidth: 1, yAxisID: "y" },
      { label: "CO₂ today (t/month)", data: [co2E, co2D], backgroundColor: C.pL, borderColor: C.ink, borderWidth: 1, yAxisID: "y1" },
      { label: "CO₂ after improvement", data: [co2E * after, co2D * after], backgroundColor: C.yL, borderColor: C.ink, borderWidth: 1, yAxisID: "y1" } ] };
    const yMax = Math.max(costE, costD) / 1000 * 1.1 || 1, y1Max = Math.max(co2E, co2D) * 1.1 || 1;
    const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 14, font: { size: 11 } } } },
      scales: { y: { position: "left", min: 0, max: yMax, title: { display: true, text: "NPR thousand per month" } }, y1: { position: "right", min: 0, max: y1Max, grid: { drawOnChartArea: false }, title: { display: true, text: "t CO₂ per month" } } } };
    if (co2Chart) { co2Chart.data = data; co2Chart.options = opts; co2Chart.update(); } else co2Chart = new Chart($("#co2Chart"), { type: "bar", data, options: opts });
  }
  ["#cKwh", "#cKwhP", "#cGrid", "#cDsl", "#cDslP", "#cUnits", "#cEff"].forEach(s => $(s).addEventListener("input", updateCO2));

  /* ---------- Enquiry form (FormSubmit) ---------- */
  const form = $("#enquiry");
  if (form) form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const ne = document.documentElement.lang === "ne";
    const msg = $("#formMsg"), btn = form.querySelector("button[type=submit]");
    const f = Object.fromEntries(new FormData(form).entries());
    msg.className = "form-msg";
    if (!f.name.trim() || !f.email.trim() || !f.message.trim() || !form.email.checkValidity()) {
      msg.classList.add("err");
      msg.textContent = ne ? "कृपया नाम, मान्य इमेल र सोधपुछ भर्नुहोस्।" : "Please fill in your name, a valid email and your enquiry.";
      return;
    }
    if (f._honey) return;
    btn.disabled = true;
    msg.textContent = ne ? "पठाउँदै..." : "Sending...";
    try {
      const r = await fetch("https://formsubmit.co/ajax/rajanvk56@outlook.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: f.name, email: f.email, phone: f.phone || "-", message: f.message,
          _subject: "New enquiry from the BRM Consulting website",
          _cc: "basantbasnet51@gmail.com", _template: "table", _captcha: "false"
        })
      });
      const j = await r.json().catch(() => ({}));
      if (String(j.success) === "false" && /activat/i.test(j.message || "")) {
        msg.classList.add("err");
        msg.textContent = ne ? "फारम अझै सक्रिय गरिएको छैन। सक्रिय भएपछि कृपया फेरि प्रयास गर्नुहोस्।"
                             : "The form is waiting for activation by the site owner. Please try again shortly, or email us directly.";
        btn.disabled = false; return;
      }
      if (!r.ok || String(j.success) === "false") throw new Error(j.message || "failed");
      form.reset();
      msg.classList.add("ok");
      msg.textContent = ne ? "धन्यवाद! तपाईंको सन्देश पठाइयो। हामी छिट्टै सम्पर्क गर्नेछौं।" : "Thank you. Your message has been sent and we will reply soon.";
    } catch (e) {
      msg.classList.add("err");
      const mail = "mailto:rajanvk56@outlook.com?cc=basantbasnet51@gmail.com&subject=" + encodeURIComponent("Enquiry from " + f.name) +
        "&body=" + encodeURIComponent(f.message + "\n\n" + f.name + "\n" + f.email + (f.phone ? "\n" + f.phone : ""));
      msg.innerHTML = ne ? "सन्देश पठाउन सकिएन। <a href=\"" + mail + "\">यहाँ थिचेर आफ्नो इमेलबाट पठाउनुहोस्</a>।"
                         : "Sorry, the message could not be sent. <a href=\"" + mail + "\">Click here to send it from your own email</a>.";
    }
    btn.disabled = false;
  });

  /* ---------- Start ---------- */
  initTab("t-ops");
  let saved = "en"; try { saved = localStorage.getItem("brm-lang") || "en"; } catch (e) {}
  if (saved === "ne") setLang("ne");
})();

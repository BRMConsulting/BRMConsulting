/* BRM Consulting: interactive four-area framework with one live demo per area */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wheel = $("#fwSegs"), list = $("#fwList"), panel = $("#fwPanel");
  if (!wheel || !list || !panel) return;
  const lang = () => (document.documentElement.lang === "ne" ? "ne" : "en");
  const T = (o) => (o && typeof o === "object" ? o[lang()] || o.en : o);
  const fmt = (v) => Math.round(v).toLocaleString("en-US");

  /* ---------- Icons (simple line icons) ---------- */
  const ICON = {
    ops: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7.4 7.4 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.4 7.4 0 0 0 2.6-1.5l2.4 1 2-3.4z"/>',
    it: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4"/>',
    sus: '<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
    fin: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/><circle cx="19" cy="6" r="2.5"/>'
  };
  const icon = (k, cls = "") => '<svg class="ic ' + cls + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + "</svg>";

  /* ---------- Content ---------- */
  const AREAS = [
    {
      id: "ops", grad: "gOps", light: "#9FDBB4", dark: "#2e8b57", btn: "#2e9e5b", btnInk: "#fff",
      short: { en: "Operations", ne: "सञ्चालन" },
      title: { en: "Operations, Optimisation & Resilience", ne: "सञ्चालन, अनुकूलन र सुदृढता" },
      line: { en: "Lean processes, optimisation models, business continuity", ne: "लीन प्रक्रिया, अनुकूलन मोडेल, व्यवसाय निरन्तरता" },
      tag: { en: "Higher productivity, less waste and lower cost, with operations built to withstand disruption.",
             ne: "बढी उत्पादकत्व, कम खेर र कम लागत, साथै अवरोध सहन सक्ने सञ्चालन।" },
      focus: [
        { t: { en: "Lean Six Sigma and process improvement", ne: "लीन सिक्स सिग्मा र प्रक्रिया सुधार" },
          d: { en: "DMAIC projects, process mapping and bottleneck removal that raise output without buying new machines.",
               ne: "नयाँ मेसिन नकिनी उत्पादन बढाउने DMAIC परियोजना, प्रक्रिया नक्सांकन र अवरोध हटाउने काम।" } },
        { t: { en: "Business process and cost optimisation", ne: "व्यवसाय प्रक्रिया र लागत अनुकूलन" },
          d: { en: "Order to cash, purchasing, approvals and paperwork made faster and cheaper, with product mix decided on real numbers.",
               ne: "अर्डरदेखि भुक्तानीसम्म, खरिद, स्वीकृति र कागजी काम छिटो र सस्तो; उत्पादन मिश्रण वास्तविक अंकका आधारमा।" } },
        { t: { en: "Optimisation models and resilience", ne: "अनुकूलन मोडेल र सुदृढता" },
          d: { en: "Scheduling, routing, layout and workforce planning with mathematical models, plus risk scenarios and supplier back-ups.",
               ne: "गणितीय मोडेलद्वारा तालिका, मार्ग, लेआउट र जनशक्ति योजना, साथै जोखिम परिदृश्य र वैकल्पिक आपूर्तिकर्ता।" } }
      ],
      also: [
        { en: "OEE and capacity planning", ne: "OEE र क्षमता योजना" },
        { en: "Inventory and supply chain", ne: "भण्डार र आपूर्ति शृङ्खला" },
        { en: "Quality control and SPC", ne: "गुणस्तर नियन्त्रण र SPC" },
        { en: "Factory layout and material flow", ne: "कारखाना लेआउट र सामग्री प्रवाह" },
        { en: "Shift and maintenance planning", ne: "सिफ्ट र मर्मत योजना" },
        { en: "Energy and resource use", ne: "ऊर्जा र स्रोत उपयोग" },
        { en: "Business continuity plans", ne: "व्यवसाय निरन्तरता योजना" }
      ],
      steps: [
        { en: "Walk the floor and map the process", ne: "कार्यस्थल हेर्ने र प्रक्रिया नक्सांकन" },
        { en: "Measure output, waste and delays", ne: "उत्पादन, खेर र ढिलाइ मापन" },
        { en: "Fix the biggest constraint first", ne: "सबैभन्दा ठूलो अवरोध पहिले सुधार्ने" },
        { en: "Lock in gains with simple controls", ne: "सरल नियन्त्रणद्वारा उपलब्धि टिकाउने" }
      ],
      demo: { en: "Live demo: find the bottleneck", ne: "प्रत्यक्ष डेमो: अवरोध पत्ता लगाउनुहोस्" }
    },
    {
      id: "it", grad: "gIt", light: "#8DCDF2", dark: "#2b7bb9", btn: "#2b84c9", btnInk: "#fff",
      short: { en: "IT & Digital", ne: "आईटी र डिजिटल" },
      title: { en: "IT & Digital", ne: "आईटी र डिजिटल" },
      line: { en: "Digital roadmaps, software and websites, AI automation", ne: "डिजिटल मार्गचित्र, सफ्टवेयर र वेबसाइट, एआई स्वचालन" },
      tag: { en: "From paper registers to connected, data-driven operations, one practical step at a time.",
             ne: "कागजी रजिस्टरदेखि जोडिएको, तथ्याङ्कमा आधारित सञ्चालनसम्म, एक-एक व्यावहारिक कदम।" },
      focus: [
        { t: { en: "Digital maturity and roadmap", ne: "डिजिटल परिपक्वता र मार्गचित्र" },
          d: { en: "Where you stand today, what to digitise first and what it will return.",
               ne: "आज तपाईं कहाँ हुनुहुन्छ, पहिले के डिजिटल गर्ने र त्यसले के फाइदा दिन्छ।" } },
        { t: { en: "Software, websites and business apps", ne: "सफ्टवेयर, वेबसाइट र व्यवसायिक एप" },
          d: { en: "ERP and e-billing selection, custom apps, KPI dashboards, and websites built, maintained and secured.",
               ne: "ERP र ई-बिलिङ छनोट, आफ्नै एप, KPI ड्यासबोर्ड, र वेबसाइट निर्माण, मर्मत र सुरक्षा।" } },
        { t: { en: "AI and automation pathways", ne: "एआई र स्वचालनका मार्ग" },
          d: { en: "Practical AI that automates routine work and optimises business processes, introduced step by step.",
               ne: "दोहोरिने काम स्वचालित गर्ने र व्यवसाय प्रक्रिया अनुकूलन गर्ने व्यावहारिक एआई, क्रमिक रूपमा।" } }
      ],
      also: [
        { en: "E-billing readiness", ne: "ई-बिलिङ तयारी" },
        { en: "KPI dashboards", ne: "KPI ड्यासबोर्ड" },
        { en: "SEO and digital branding", ne: "SEO र डिजिटल ब्रान्डिङ" },
        { en: "Cyber hygiene", ne: "साइबर सुरक्षा अभ्यास" },
        { en: "Digital twins", ne: "डिजिटल ट्विन" },
        { en: "Website maintenance", ne: "वेबसाइट मर्मत" }
      ],
      steps: [
        { en: "Assess digital maturity", ne: "डिजिटल परिपक्वता मूल्याङ्कन" },
        { en: "Rank options by value and cost", ne: "मूल्य र लागतका आधारमा विकल्प क्रम" },
        { en: "Build or select the tools", ne: "उपकरण निर्माण वा छनोट" },
        { en: "Train people and track use", ne: "कर्मचारी तालिम र प्रयोगको अनुगमन" }
      ],
      demo: { en: "Live demo: digital maturity check", ne: "प्रत्यक्ष डेमो: डिजिटल परिपक्वता जाँच" }
    },
    {
      id: "sus", grad: "gSus", light: "#FFE680", dark: "#b08600", btn: "#f2c230", btnInk: "#111",
      short: { en: "Sustainability", ne: "दिगोपना" },
      title: { en: "Sustainability", ne: "दिगोपना" },
      line: { en: "Energy savings, carbon and ESG data, twin transition", ne: "ऊर्जा बचत, कार्बन र ESG तथ्याङ्क, ट्विन ट्रान्जिसन" },
      tag: { en: "Lower energy bills, cleaner operations and the environmental data banks and regulators now ask for.",
             ne: "कम ऊर्जा बिल, सफा सञ्चालन र बैंक तथा नियामकले माग्ने वातावरणीय तथ्याङ्क।" },
      focus: [
        { t: { en: "Energy efficiency and cost baselines", ne: "ऊर्जा दक्षता र लागत आधाररेखा" },
          d: { en: "Find where energy money is lost and cut it, starting from your own bills.",
               ne: "आफ्नै बिलबाट सुरु गरेर ऊर्जामा पैसा कहाँ खेर गइरहेको छ पत्ता लगाउने र घटाउने।" } },
        { t: { en: "Carbon inventories and ESG data", ne: "कार्बन विवरण र ESG तथ्याङ्क" },
          d: { en: "CO₂ footprints and ESG data packs ready for banks, buyers and export markets.",
               ne: "बैंक, खरिदकर्ता र निर्यात बजारका लागि तयार CO₂ फुटप्रिन्ट र ESG तथ्याङ्क।" } },
        { t: { en: "Green and digital (twin) transition", ne: "हरित र डिजिटल (ट्विन) ट्रान्जिसन" },
          d: { en: "One plan that links sustainability goals with digital tools, so both pay back.",
               ne: "दिगोपनाका लक्ष्य र डिजिटल उपकरण जोड्ने एउटै योजना, ताकि दुवैबाट प्रतिफल मिलोस्।" } }
      ],
      also: [
        { en: "Waste and effluent compliance", ne: "फोहोर र प्रदूषित पानी अनुपालन" },
        { en: "Pollution control support", ne: "प्रदूषण नियन्त्रण सहयोग" },
        { en: "Energy audit readiness", ne: "ऊर्जा लेखापरीक्षण तयारी" },
        { en: "EU carbon border (CBAM) readiness", ne: "EU कार्बन सीमा (CBAM) तयारी" },
        { en: "Solar and clean energy options", ne: "सौर्य र स्वच्छ ऊर्जा विकल्प" }
      ],
      steps: [
        { en: "Collect bills and site data", ne: "बिल र स्थलगत तथ्याङ्क सङ्कलन" },
        { en: "Build the energy and CO₂ baseline", ne: "ऊर्जा र CO₂ आधाररेखा तयार" },
        { en: "Rank savings by payback", ne: "प्रतिफल अवधिअनुसार बचत क्रम" },
        { en: "Report in the format lenders ask for", ne: "ऋणदाताले माग्ने ढाँचामा प्रतिवेदन" }
      ],
      demo: { en: "Live demo: sustainability readiness", ne: "प्रत्यक्ष डेमो: दिगोपना तयारी" }
    },
    {
      id: "fin", grad: "gFin", light: "#F5ADC1", dark: "#d9486b", btn: "#e0507a", btnInk: "#fff",
      short: { en: "Finance", ne: "वित्त" },
      title: { en: "Finance", ne: "वित्त" },
      line: { en: "Costing and margin, cash flow, audit and funding", ne: "लागत र मार्जिन, नगद प्रवाह, लेखापरीक्षण र लगानी" },
      tag: { en: "Clear numbers for better decisions: where margin is made, where it leaks, and how to fund growth.",
             ne: "राम्रो निर्णयका लागि स्पष्ट अंक: मार्जिन कहाँ बन्छ, कहाँ चुहिन्छ र वृद्धिको लगानी कसरी जुटाउने।" },
      focus: [
        { t: { en: "Costing and margin analysis", ne: "लागत र मार्जिन विश्लेषण" },
          d: { en: "Product costing and EBITDA analysis that shows which products and customers really make money.",
               ne: "कुन उत्पादन र ग्राहकबाट वास्तवमै नाफा हुन्छ देखाउने उत्पादन लागत र EBITDA विश्लेषण।" } },
        { t: { en: "Planning, cash flow and working capital", ne: "योजना, नगद प्रवाह र कार्यशील पुँजी" },
          d: { en: "Budgets, forecasts and scenarios, plus faster collection and leaner stock to free up cash.",
               ne: "बजेट, पूर्वानुमान र परिदृश्य, साथै छिटो असुली र कम भण्डारबाट नगद मुक्त गर्ने।" } },
        { t: { en: "Audit, business plans and funding", ne: "लेखापरीक्षण, व्यवसाय योजना र लगानी" },
          d: { en: "Statutory and tax audit by our chartered accountant, CA Kishore Jaiswal, through his registered audit practice, plus business plans and loan files.",
               ne: "हाम्रा चार्टर्ड एकाउन्टेन्ट CA किशोर जैसवालद्वारा उनको दर्ता भएको लेखापरीक्षण फर्ममार्फत वैधानिक र कर लेखापरीक्षण, साथै व्यवसाय योजना र ऋण फाइल।" } }
      ],
      also: [
        { en: "Budgeting and forecasting", ne: "बजेट र पूर्वानुमान" },
        { en: "Scenario planning", ne: "परिदृश्य योजना" },
        { en: "Investment cases", ne: "लगानी प्रस्ताव" },
        { en: "Loan files", ne: "ऋण फाइल" },
        { en: "Break-even analysis", ne: "नाफा-नोक्सान बिन्दु विश्लेषण" },
        { en: "Data-driven financial advisory", ne: "तथ्याङ्कमा आधारित वित्तीय परामर्श" }
      ],
      steps: [
        { en: "Clean up the numbers", ne: "अंकहरू व्यवस्थित गर्ने" },
        { en: "Find where margin leaks", ne: "मार्जिन कहाँ चुहिन्छ पत्ता लगाउने" },
        { en: "Model scenarios and cash", ne: "परिदृश्य र नगदको मोडेल" },
        { en: "Prepare plans, audits and funding files", ne: "योजना, लेखापरीक्षण र लगानी फाइल तयार" }
      ],
      demo: { en: "Live demo: break-even calculator", ne: "प्रत्यक्ष डेमो: नाफा-नोक्सान बिन्दु गणक" }
    }
  ];
  const L = {
    core: { en: "one integrated team", ne: "एउटै एकीकृत टोली" },
    focus: { en: "Where we mainly focus", ne: "हाम्रो मुख्य ध्यान" },
    also: { en: "Also covered", ne: "यसबाहेक" },
    how: { en: "How we work", ne: "हामी कसरी काम गर्छौं" },
    explore: { en: "Explore", ne: "हेर्नुहोस्" },
    close: { en: "Close", ne: "बन्द" },
    illus: { en: "Illustrative figures. In a project we use your own data.", ne: "उदाहरणका अंक। परियोजनामा तपाईंकै तथ्याङ्क प्रयोग गरिन्छ।" }
  };

  /* ---------- Wheel ---------- */
  const CX = 200, CY = 200, R = 182, r = 96, GAP = 2.2;
  const pt = (rad, deg) => [CX + rad * Math.cos(deg * Math.PI / 180), CY + rad * Math.sin(deg * Math.PI / 180)];
  function seg(a0, a1) {
    const [x1, y1] = pt(R, a0), [x2, y2] = pt(R, a1), [x3, y3] = pt(r, a1), [x4, y4] = pt(r, a0);
    return `M${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 0 0 ${x4},${y4} Z`;
  }
  let current = null;
  function buildWheel() {
    wheel.innerHTML = "";
    list.innerHTML = "";
    AREAS.forEach((a, i) => {
      const a0 = -180 + 90 * i + GAP, a1 = -90 + 90 * i - GAP, mid = (a0 + a1) / 2;
      const [lx, ly] = pt((R + r) / 2 - 4, mid);
      const dx = Math.cos(mid * Math.PI / 180) * 10, dy = Math.sin(mid * Math.PI / 180) * 10;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "fw-seg");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.dataset.id = a.id;
      g.style.setProperty("--dx", dx + "px");
      g.style.setProperty("--dy", dy + "px");
      g.innerHTML = `<path d="${seg(a0, a1)}" fill="url(#${a.grad})"/>` +
        `<g transform="translate(${lx - 14},${ly - 30}) scale(1.15)" class="fw-seg-ic" style="color:${a.dark}">${ICON[a.id]}</g>` +
        `<text x="${lx}" y="${ly + 16}" text-anchor="middle" class="fw-seg-t">${T(a.short)}</text>`;
      g.setAttribute("aria-label", T(a.title));
      g.addEventListener("click", () => select(a.id));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(a.id); } });
      wheel.appendChild(g);

      const b = document.createElement("button");
      b.type = "button";
      b.className = "fw-item";
      b.dataset.id = a.id;
      b.setAttribute("role", "tab");
      b.style.setProperty("--ac", a.light);
      b.style.setProperty("--acd", a.dark);
      b.style.setProperty("--btn", a.btn);
      b.style.setProperty("--btnInk", a.btnInk);
      b.innerHTML = `<span class="fw-item-ic">${icon(a.id)}</span><span class="fw-item-txt"><b>${T(a.title)}</b><small>${T(a.line)}</small></span><span class="fw-item-go">${T(L.explore)} →</span>`;
      b.addEventListener("click", () => select(a.id));
      list.appendChild(b);
    });
    $("#fwCoreSub").textContent = T(L.core);
    markActive();
  }
  function markActive() {
    $$(".fw-seg", wheel).forEach(g => g.classList.toggle("active", g.dataset.id === current));
    $(".fw-wheel").classList.toggle("has-sel", !!current);
    $$(".fw-item", list).forEach(b => { b.classList.toggle("active", b.dataset.id === current); b.setAttribute("aria-selected", b.dataset.id === current); });
  }

  /* ---------- Panel ---------- */
  let charts = [], anim = null;
  function cleanup() {
    charts.forEach(c => c.destroy()); charts = [];
    if (anim) { cancelAnimationFrame(anim); anim = null; }
  }
  function select(id, scroll = true) {
    current = id;
    markActive();
    render();
    if (scroll) {
      const top = panel.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.75 || top < 0) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  function render() {
    cleanup();
    if (!current) return;
    const a = AREAS.find(x => x.id === current);
    panel.style.setProperty("--ac", a.light);
    panel.style.setProperty("--acd", a.dark);
    panel.innerHTML = `
      <div class="fwp">
        <header class="fwp-head">
          <span class="fwp-ic">${icon(a.id)}</span>
          <div><h3>${T(a.title)}</h3><p>${T(a.tag)}</p></div>
          <button type="button" class="fwp-close" aria-label="${T(L.close)}">✕</button>
        </header>
        <div class="fwp-body">
          <div class="fwp-left">
            <h4>${T(L.focus)}</h4>
            <div class="fwp-focus">${a.focus.map((f, i) => `<div class="fcard" style="--i:${i}"><span class="fnum">${i + 1}</span><div><b>${T(f.t)}</b><p>${T(f.d)}</p></div></div>`).join("")}</div>
            <h4>${T(L.also)}</h4>
            <div class="fwp-chips">${a.also.map(c => `<span>${T(c)}</span>`).join("")}</div>
          </div>
          <div class="fwp-demo">
            <h4>${T(a.demo)}</h4>
            <div id="demoBox"></div>
            <p class="small fwp-note">${T(L.illus)}</p>
          </div>
        </div>
        <div class="fwp-how">
          <h4>${T(L.how)}</h4>
          <ol class="fwp-steps">${a.steps.map((s, i) => `<li style="--i:${i}"><span>${i + 1}</span>${T(s)}</li>`).join("")}</ol>
        </div>
      </div>`;
    $(".fwp-close", panel).addEventListener("click", () => {
      current = null; cleanup(); markActive();
      panel.innerHTML = `<div class="fw-empty">${(window.BRM_NE && lang() === "ne") ? window.BRM_NE["fw.empty"] : "Select one of the four areas above to open its details here."}</div>`;
      $("#framework").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    DEMOS[a.id]($("#demoBox", panel), a);
  }

  /* ---------- Demo 1: bottleneck ---------- */
  const lineState = { caps: [120, 80, 95, 140] };
  const DEMOS = {};
  DEMOS.ops = function (box, a) {
    const N = [{ en: "Cutting", ne: "काटाइ" }, { en: "Assembly", ne: "जडान" }, { en: "Polishing", ne: "पालिस" }, { en: "Packing", ne: "प्याकिङ" }];
    const tx = {
      out: { en: "Line output", ne: "लाइन उत्पादन" }, uph: { en: "units per hour", ne: "एकाइ प्रति घण्टा" },
      day: { en: "Per 8-hour shift", ne: "८ घण्टाको सिफ्टमा" }, idle: { en: "Idle capacity elsewhere", ne: "अन्यत्र खाली क्षमता" },
      fix: { en: "Add a shift at the bottleneck (+25%)", ne: "अवरोधमा एक सिफ्ट थप्नुहोस् (+२५%)" }, reset: { en: "Reset", ne: "सुरुमा फर्काउनुहोस्" },
      bn: { en: "Bottleneck", ne: "अवरोध" }, tip: { en: "Use − and + to change each station's capacity. The slowest station sets the pace of the whole line.", ne: "हरेक स्टेसनको क्षमता − र + ले बदल्नुहोस्। सबैभन्दा ढिलो स्टेसनले पूरै लाइनको गति तय गर्छ।" }
    };
    box.innerHTML = `<p class="small">${T(tx.tip)}</p>
      <div class="line">${N.map((n, i) => `<div class="st" data-i="${i}"><small class="st-n">${T(n)}</small><b class="st-c"></b><span class="st-u">/h</span>
        <div class="st-bar"><i></i></div><div class="st-ctl"><button type="button" data-d="-10" aria-label="−">−</button><button type="button" data-d="10" aria-label="+">+</button></div><em class="st-tag">${T(tx.bn)}</em></div>`).join("")}</div>
      <canvas class="flow" height="56"></canvas>
      <div class="kpis3"><div><small>${T(tx.out)}</small><b id="bOut"></b><span>${T(tx.uph)}</span></div><div><small>${T(tx.day)}</small><b id="bDay"></b></div><div><small>${T(tx.idle)}</small><b id="bIdle"></b></div></div>
      <div class="btn-row"><button type="button" class="btn btn-dark btn-sm" id="bFix">${T(tx.fix)}</button><button type="button" class="btn btn-dark btn-sm btn-ghost" id="bReset">${T(tx.reset)}</button></div>`;
    const cv = $(".flow", box), ctx = cv.getContext("2d");
    let dots = [], spawn = 0, last = performance.now();
    function calc() {
      const caps = lineState.caps, thr = Math.min(...caps), bi = caps.indexOf(thr);
      $$(".st", box).forEach((el, i) => {
        el.querySelector(".st-c").textContent = caps[i];
        el.querySelector(".st-bar i").style.width = Math.round(thr / caps[i] * 100) + "%";
        el.classList.toggle("bn", i === bi);
      });
      $("#bOut", box).textContent = fmt(thr);
      $("#bDay", box).textContent = fmt(thr * 8);
      const others = caps.filter((_, i) => i !== bi);
      $("#bIdle", box).textContent = Math.round(others.reduce((s, c) => s + (1 - thr / c), 0) / others.length * 100) + "%";
      return { thr, bi };
    }
    let st = calc();
    $$(".st-ctl button", box).forEach(b => b.addEventListener("click", () => {
      const i = +b.closest(".st").dataset.i;
      lineState.caps[i] = Math.max(30, Math.min(200, lineState.caps[i] + +b.dataset.d));
      st = calc();
    }));
    $("#bFix", box).addEventListener("click", () => { const i = st.bi; lineState.caps[i] = Math.min(200, Math.round(lineState.caps[i] * 1.25)); st = calc(); });
    $("#bReset", box).addEventListener("click", () => { lineState.caps = [120, 80, 95, 140]; st = calc(); });
    function draw(now) {
      const w = cv.clientWidth; if (cv.width !== w * 2) { cv.width = w * 2; cv.height = 112; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, w, 56);
      const xs = [0, 1, 2, 3].map(i => (i + 0.5) * w / 4);
      ctx.strokeStyle = "#d8cfc0"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(8, 28); ctx.lineTo(w - 8, 28); ctx.stroke();
      // queue in front of the bottleneck
      const up = Math.max(0, ...lineState.caps.slice(0, st.bi + 1)) - st.thr;
      const q = Math.min(14, Math.round(up / 7));
      for (let k = 0; k < q; k++) {
        ctx.fillStyle = "rgba(214,40,40,.75)";
        ctx.beginPath(); ctx.arc(xs[st.bi] - 22 - (k % 7) * 9, 28 + (k < 7 ? -7 : 7), 3.6, 0, 7); ctx.fill();
      }
      xs.forEach((x, i) => {
        ctx.fillStyle = i === st.bi ? "#d62828" : a.dark;
        ctx.beginPath(); ctx.arc(x, 28, i === st.bi ? 10 + Math.sin(now / 220) * 1.5 : 8, 0, 7); ctx.fill();
      });
      spawn += dt * st.thr / 12;
      while (spawn > 1) { dots.push(8); spawn -= 1; }
      const speed = 40 + st.thr * 0.7;
      dots = dots.map(x => x + speed * dt).filter(x => x < w - 6);
      ctx.fillStyle = "#111";
      dots.forEach(x => { ctx.beginPath(); ctx.arc(x, 28, 3, 0, 7); ctx.fill(); });
      anim = requestAnimationFrame(draw);
    }
    anim = requestAnimationFrame(draw);
  };

  /* ---------- Demo 2: digital maturity radar ---------- */
  const radarState = { v: [2, 1, 2, 2, 1, 2] };
  DEMOS.it = function (box, a) {
    const D = [{ en: "Data and records", ne: "तथ्याङ्क र अभिलेख" }, { en: "Processes", ne: "प्रक्रिया" }, { en: "Customers and sales", ne: "ग्राहक र बिक्री" },
      { en: "People and skills", ne: "जनशक्ति र सीप" }, { en: "Security", ne: "सुरक्षा" }, { en: "Leadership and plan", ne: "नेतृत्व र योजना" }];
    const LV = [{ en: "Paper-based", ne: "कागजमा आधारित" }, { en: "Getting started", ne: "सुरुवाती" }, { en: "Connected", ne: "जोडिएको" }, { en: "Data-driven", ne: "तथ्याङ्कमा आधारित" }, { en: "Smart", ne: "स्मार्ट" }];
    const tx = { tip: { en: "Rate each area from 1 (paper) to 5 (smart).", ne: "हरेक क्षेत्रलाई १ (कागजी) देखि ५ (स्मार्ट) सम्म अंक दिनुहोस्।" },
      today: { en: "Today", ne: "आज" }, target: { en: "Target in 12 months", ne: "१२ महिनाको लक्ष्य" },
      score: { en: "Maturity score", ne: "परिपक्वता अंक" }, start: { en: "Start with", ne: "यहाँबाट सुरु गर्नुहोस्" } };
    box.innerHTML = `<p class="small">${T(tx.tip)}</p><div class="radar-wrap"><div class="rates">${D.map((d, i) => `<div class="rate" data-i="${i}"><span>${T(d)}</span><div>${[1, 2, 3, 4, 5].map(n => `<button type="button" data-n="${n}">${n}</button>`).join("")}</div></div>`).join("")}</div>
      <div class="radar-c"><canvas id="radarC"></canvas></div></div>
      <div class="kpis3"><div><small>${T(tx.score)}</small><b id="rScore"></b></div><div><small>&nbsp;</small><b id="rLevel"></b></div><div><small>${T(tx.start)}</small><b id="rStart"></b></div></div>`;
    const ch = new Chart($("#radarC", box), {
      type: "radar",
      data: { labels: D.map(T), datasets: [
        { label: T(tx.today), data: [], backgroundColor: "rgba(43,123,185,.25)", borderColor: "#2b7bb9", pointBackgroundColor: "#2b7bb9", borderWidth: 2 },
        { label: T(tx.target), data: [], backgroundColor: "rgba(214,40,40,.06)", borderColor: "#d62828", borderDash: [6, 4], pointRadius: 0, borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
        scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, display: false }, pointLabels: { font: { size: 11 } }, grid: { color: "#e6dccb" }, angleLines: { color: "#e6dccb" } } },
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
    charts.push(ch);
    function upd() {
      const v = radarState.v;
      $$(".rate", box).forEach((el, i) => $$("button", el).forEach(b => b.classList.toggle("on", +b.dataset.n <= v[i])));
      ch.data.datasets[0].data = v.slice();
      ch.data.datasets[1].data = v.map(x => Math.min(5, x + 1.5));
      ch.update();
      const avg = v.reduce((s, x) => s + x, 0) / v.length;
      $("#rScore", box).textContent = avg.toFixed(1) + " / 5";
      $("#rLevel", box).textContent = T(LV[Math.min(4, Math.round(avg) - 1)]);
      $("#rStart", box).textContent = T(D[v.indexOf(Math.min(...v))]);
    }
    $$(".rate", box).forEach(el => $$("button", el).forEach(b => b.addEventListener("click", () => { radarState.v[+el.dataset.i] = +b.dataset.n; upd(); })));
    upd();
  };

  /* ---------- Demo 3: sustainability readiness ---------- */
  const susState = { on: [true, false, false, true, false, false, false, false] };
  DEMOS.sus = function (box, a) {
    const Q = [
      { en: "We track monthly electricity and diesel use", ne: "हामी मासिक बिजुली र डिजेल खपत राख्छौं" },
      { en: "We know our energy cost per unit produced", ne: "हामीलाई प्रति एकाइ ऊर्जा लागत थाहा छ" },
      { en: "Our CO₂ footprint has been measured", ne: "हाम्रो CO₂ फुटप्रिन्ट मापन गरिएको छ" },
      { en: "Waste and effluent are recorded and handled legally", ne: "फोहोर र प्रदूषित पानीको अभिलेख र कानुनी व्यवस्थापन हुन्छ" },
      { en: "We have an energy-saving plan with paybacks", ne: "प्रतिफलसहितको ऊर्जा बचत योजना छ" },
      { en: "We can share ESG data when a bank or buyer asks", ne: "बैंक वा खरिदकर्ताले मागे ESG तथ्याङ्क दिन सक्छौं" },
      { en: "Solar or other clean energy is in use or planned", ne: "सौर्य वा अन्य स्वच्छ ऊर्जा प्रयोगमा वा योजनामा छ" },
      { en: "One person is responsible for energy and environment", ne: "ऊर्जा र वातावरणको जिम्मेवारी एक जनालाई तोकिएको छ" }];
    const LV = [{ en: "Starting point", ne: "सुरुवाती अवस्था" }, { en: "On the way", ne: "प्रगतिमा" }, { en: "Nearly ready", ne: "लगभग तयार" }, { en: "Ready for lenders and buyers", ne: "ऋणदाता र खरिदकर्ताका लागि तयार" }];
    const tx = { tip: { en: "Tick what is true for your business today.", ne: "आज तपाईंको व्यवसायमा जे सत्य छ, त्यसमा चिन्ह लगाउनुहोस्।" },
      next: { en: "Next step", ne: "अर्को कदम" }, done: { en: "All in place. Next: an external review of your data.", ne: "सबै तयार। अब: तथ्याङ्कको बाह्य समीक्षा।" } };
    const C = 2 * Math.PI * 52;
    box.innerHTML = `<p class="small">${T(tx.tip)}</p><div class="ready">
      <div class="checks">${Q.map((q, i) => `<label class="chk"><input type="checkbox" data-i="${i}"><span class="box"></span><span>${T(q)}</span></label>`).join("")}</div>
      <div class="ring-wrap"><svg viewBox="0 0 130 130" class="ring"><circle cx="65" cy="65" r="52" class="ring-bg"/><circle cx="65" cy="65" r="52" class="ring-fg" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 65 65)"/>
        <text x="65" y="64" text-anchor="middle" class="ring-pct">0%</text><text x="65" y="84" text-anchor="middle" class="ring-sub">ESG</text></svg>
        <b class="ring-lv"></b><p class="ring-next small"></p></div></div>`;
    function upd() {
      const on = susState.on, n = on.filter(Boolean).length, pct = n / on.length;
      $$(".chk input", box).forEach((c, i) => { c.checked = on[i]; });
      const fg = $(".ring-fg", box);
      fg.style.strokeDashoffset = C * (1 - pct);
      fg.style.stroke = pct < 0.4 ? "#d62828" : pct < 0.75 ? "#c99a00" : "#2e8b57";
      $(".ring-pct", box).textContent = Math.round(pct * 100) + "%";
      $(".ring-lv", box).textContent = T(LV[n === 8 ? 3 : n >= 6 ? 2 : n >= 3 ? 1 : 0]);
      const k = on.indexOf(false);
      $(".ring-next", box).innerHTML = k < 0 ? T(tx.done) : "<b>" + T(tx.next) + ":</b> " + T(Q[k]);
    }
    $$(".chk input", box).forEach(c => c.addEventListener("change", () => { susState.on[+c.dataset.i] = c.checked; upd(); }));
    requestAnimationFrame(upd);
  };

  /* ---------- Demo 4: break-even ---------- */
  const beState = { p: 200, v: 120, f: 800, s: 14000 };
  DEMOS.fin = function (box, a) {
    const tx = {
      p: { en: "Price per unit (NPR)", ne: "प्रति एकाइ मूल्य (रु.)" }, v: { en: "Variable cost per unit (NPR)", ne: "प्रति एकाइ परिवर्तनशील लागत (रु.)" },
      f: { en: "Fixed cost per month (NPR thousand)", ne: "मासिक स्थिर लागत (रु. हजार)" }, s: { en: "Expected sales (units per month)", ne: "अपेक्षित बिक्री (एकाइ प्रति महिना)" },
      be: { en: "Break-even", ne: "नाफा-नोक्सान बिन्दु" }, units: { en: "units", ne: "एकाइ" }, profit: { en: "Monthly profit", ne: "मासिक नाफा" },
      mos: { en: "Safety margin", ne: "सुरक्षा मार्जिन" }, rev: { en: "Revenue", ne: "आम्दानी" }, tc: { en: "Total cost", ne: "कुल लागत" }, fc: { en: "Fixed cost", ne: "स्थिर लागत" },
      no: { en: "No break-even: price must be above variable cost.", ne: "नाफा-नोक्सान बिन्दु छैन: मूल्य परिवर्तनशील लागतभन्दा बढी हुनुपर्छ।" },
      x: { en: "Units sold per month", ne: "मासिक बिक्री एकाइ" }, y: { en: "NPR thousand", ne: "रु. हजार" } };
    const sl = (k, min, max, step) => `<label>${T(tx[k])} <output id="o_${k}"></output><input type="range" id="r_${k}" min="${min}" max="${max}" step="${step}" value="${beState[k]}"></label>`;
    box.innerHTML = `<div class="be-grid"><div class="be-in">${sl("p", 50, 500, 5)}${sl("v", 20, 450, 5)}${sl("f", 100, 3000, 50)}${sl("s", 0, 30000, 500)}</div>
      <div class="be-c"><canvas id="beC"></canvas></div></div>
      <div class="kpis3"><div><small>${T(tx.be)}</small><b id="kBe"></b><span>${T(tx.units)}</span></div><div><small>${T(tx.profit)}</small><b id="kPr"></b></div><div><small>${T(tx.mos)}</small><b id="kMos"></b></div></div>`;
    const ch = new Chart($("#beC", box), {
      type: "line",
      data: { datasets: [
        { label: T(tx.rev), data: [], borderColor: "#2e8b57", backgroundColor: "#2e8b57", borderWidth: 3, pointRadius: 0 },
        { label: T(tx.tc), data: [], borderColor: "#d9486b", backgroundColor: "#d9486b", borderWidth: 3, pointRadius: 0 },
        { label: T(tx.fc), data: [], borderColor: "#9a8f80", borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
        { label: T(tx.be), data: [], type: "scatter", backgroundColor: "#d62828", borderColor: "#fff", borderWidth: 2, pointRadius: 8, pointHoverRadius: 9 }] },
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 300 }, interaction: { mode: "nearest", intersect: false },
        scales: { x: { type: "linear", min: 0, title: { display: true, text: T(tx.x) }, grid: { color: "#efe6d6" } },
                  y: { min: 0, title: { display: true, text: T(tx.y) }, grid: { color: "#efe6d6" } } },
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
    charts.push(ch);
    function upd() {
      ["p", "v", "f", "s"].forEach(k => { beState[k] = +$("#r_" + k, box).value; $("#o_" + k, box).textContent = fmt(beState[k]); });
      const { p, v, f, s } = beState, cm = p - v;
      const be = cm > 0 ? f * 1000 / cm : null;
      const xmax = Math.max(s * 1.25, be ? be * 1.6 : 0, 1000);
      const xs = Array.from({ length: 21 }, (_, i) => xmax * i / 20);
      ch.data.datasets[0].data = xs.map(x => ({ x, y: x * p / 1000 }));
      ch.data.datasets[1].data = xs.map(x => ({ x, y: f + x * v / 1000 }));
      ch.data.datasets[2].data = xs.map(x => ({ x, y: f }));
      ch.data.datasets[3].data = be ? [{ x: be, y: be * p / 1000 }] : [];
      ch.options.scales.x.max = xmax;
      ch.update();
      const profit = s * cm - f * 1000;
      $("#kBe", box).textContent = be ? fmt(be) : "–";
      $("#kPr", box).textContent = "NPR " + fmt(profit);
      $("#kPr", box).style.color = profit < 0 ? "#d62828" : "#2e8b57";
      $("#kMos", box).textContent = be && s > 0 ? Math.round((s - be) / s * 100) + "%" : T(tx.no);
    }
    $$("input[type=range]", box).forEach(i => i.addEventListener("input", upd));
    upd();
  };

  /* ---------- Scroll progress, header shadow, back to top ---------- */
  const bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
  const top = document.createElement("button"); top.className = "to-top"; top.type = "button"; top.setAttribute("aria-label", "Back to top"); top.textContent = "↑";
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })); document.body.appendChild(top);
  const head = $(".site-header");
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + "%";
    top.classList.toggle("show", h.scrollTop > 700);
    if (head) head.classList.toggle("scrolled", h.scrollTop > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Language and start ---------- */
  document.addEventListener("brm:lang", () => { buildWheel(); render(); });
  buildWheel();

  /* reveal on scroll for the whole page */
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const els = $$(".section h2, .section .intro, .section .kicker, .pillar, .person, .office, .enquiry, .tree-card, .fw-wheel-wrap, .fw-item");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((el, i) => { el.classList.add("rv"); el.style.transitionDelay = (el.classList.contains("fw-item") ? (i % 4) * 0.08 : 0) + "s"; io.observe(el); });
  }
})();

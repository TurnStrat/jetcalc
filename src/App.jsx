import { useState } from "react";
import "./App.css";

// ─── FORMULAS ────────────────────────────────────────────────────────────────
// Gradient % → ft/nm
function gradientToFtPerNm(pct) {
  return pct * 60.76;
}

// ft/nm → ft/min at groundspeed
function ftPerNmToFtPerMin(ftNm, groundspeedKts) {
  return ftNm * (groundspeedKts / 60);
}

// Gradient % → ft/min (combined)
function gradientToFtPerMin(pct, groundspeedKts) {
  return gradientToFtPerNm(pct) * (groundspeedKts / 60);
}

// ft/min → gradient %
function ftPerMinToGradient(ftMin, groundspeedKts) {
  const ftNm = ftMin / (groundspeedKts / 60);
  return ftNm / 60.76;
}

// ft/nm → gradient %
function ftPerNmToGradient(ftNm) {
  return ftNm / 60.76;
}

// ─── INPUT COMPONENT ─────────────────────────────────────────────────────────
function NumInput({ label, value, onChange, unit, placeholder }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <input
          type="number"
          inputMode="decimal"
          className="num-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || "0"}
        />
        {unit && <span className="input-unit">{unit}</span>}
      </div>
    </div>
  );
}

// ─── WORK PANEL ──────────────────────────────────────────────────────────────
function WorkPanel({ steps }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="work-panel">
      <button className="work-toggle" onClick={() => setOpen(o => !o)}>
        <span>{open ? "▲" : "▼"}</span>
        <span>Show the math</span>
      </button>
      {open && (
        <div className="work-steps">
          {steps.map((s, i) => (
            <div key={i} className="work-step">
              <div className="step-label">{s.label}</div>
              <div className="step-formula">{s.formula}</div>
              <div className="step-result">{s.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RESULT DISPLAY ──────────────────────────────────────────────────────────
function ResultBox({ label, value, unit, highlight }) {
  return (
    <div className={`result-box ${highlight ? "result-highlight" : ""}`}>
      <div className="result-label">{label}</div>
      <div className="result-value">
        {value !== null && value !== undefined && !isNaN(value)
          ? `${value.toFixed(1)} ${unit}`
          : <span className="result-empty">—</span>}
      </div>
    </div>
  );
}

// ─── CALC: GRADIENT → FT/NM + FT/MIN ────────────────────────────────────────
function GradientCalc() {
  const [pct, setPct] = useState("");
  const [gs, setGs] = useState("");

  const hasPct = pct !== "" && !isNaN(pct) && Number(pct) > 0;
  const hasGs = gs !== "" && !isNaN(gs) && Number(gs) > 0;

  const ftNm = hasPct ? gradientToFtPerNm(Number(pct)) : null;
  const ftMin = hasPct && hasGs ? gradientToFtPerMin(Number(pct), Number(gs)) : null;

  const steps = [];
  if (hasPct) {
    steps.push({
      label: "Step 1 — Convert % to ft/nm",
      formula: `Gradient % × 60.76`,
      result: `${pct}% × 60.76 = ${ftNm?.toFixed(1)} ft/nm`,
    });
  }
  if (hasPct && hasGs) {
    steps.push({
      label: "Step 2 — Convert ft/nm to ft/min",
      formula: `ft/nm × (Groundspeed ÷ 60)`,
      result: `${ftNm?.toFixed(1)} × (${gs} ÷ 60) = ${ftMin?.toFixed(0)} ft/min`,
    });
  }

  return (
    <div className="calc-body">
      <div className="calc-inputs">
        <NumInput label="Climb Gradient" value={pct} onChange={setPct} unit="%" placeholder="e.g. 3.3" />
        <NumInput label="Groundspeed" value={gs} onChange={setGs} unit="kts" placeholder="e.g. 250" />
      </div>
      <div className="calc-results">
        <ResultBox label="Climb Gradient" value={ftNm} unit="ft/nm" />
        <ResultBox label="Required Climb Rate" value={ftMin} unit="ft/min" highlight />
      </div>
      {steps.length > 0 && <WorkPanel steps={steps} />}
    </div>
  );
}

// ─── CALC: FT/MIN → GRADIENT ─────────────────────────────────────────────────
function RateCalc() {
  const [ftMin, setFtMin] = useState("");
  const [gs, setGs] = useState("");

  const hasFtMin = ftMin !== "" && !isNaN(ftMin) && Number(ftMin) > 0;
  const hasGs = gs !== "" && !isNaN(gs) && Number(gs) > 0;

  const ftNm = hasFtMin && hasGs ? Number(ftMin) / (Number(gs) / 60) : null;
  const pct = ftNm !== null ? ftPerNmToGradient(ftNm) : null;

  const steps = [];
  if (hasFtMin && hasGs) {
    steps.push({
      label: "Step 1 — Convert ft/min to ft/nm",
      formula: `ft/min ÷ (Groundspeed ÷ 60)`,
      result: `${ftMin} ÷ (${gs} ÷ 60) = ${ftNm?.toFixed(1)} ft/nm`,
    });
    steps.push({
      label: "Step 2 — Convert ft/nm to gradient %",
      formula: `ft/nm ÷ 60.76`,
      result: `${ftNm?.toFixed(1)} ÷ 60.76 = ${pct?.toFixed(2)}%`,
    });
  }

  return (
    <div className="calc-body">
      <div className="calc-inputs">
        <NumInput label="Climb Rate" value={ftMin} onChange={setFtMin} unit="ft/min" placeholder="e.g. 800" />
        <NumInput label="Groundspeed" value={gs} onChange={setGs} unit="kts" placeholder="e.g. 250" />
      </div>
      <div className="calc-results">
        <ResultBox label="Climb Gradient" value={ftNm} unit="ft/nm" />
        <ResultBox label="Climb Gradient" value={pct} unit="%" highlight />
      </div>
      {steps.length > 0 && <WorkPanel steps={steps} />}
    </div>
  );
}

// ─── CALC: FT/NM ↔ CONVERSIONS ───────────────────────────────────────────────
function FtNmCalc() {
  const [ftNm, setFtNm] = useState("");
  const [gs, setGs] = useState("");

  const hasFtNm = ftNm !== "" && !isNaN(ftNm) && Number(ftNm) > 0;
  const hasGs = gs !== "" && !isNaN(gs) && Number(gs) > 0;

  const pct = hasFtNm ? ftPerNmToGradient(Number(ftNm)) : null;
  const ftMin = hasFtNm && hasGs ? ftPerNmToFtPerMin(Number(ftNm), Number(gs)) : null;

  const steps = [];
  if (hasFtNm) {
    steps.push({
      label: "Step 1 — Convert ft/nm to gradient %",
      formula: `ft/nm ÷ 60.76`,
      result: `${ftNm} ÷ 60.76 = ${pct?.toFixed(2)}%`,
    });
  }
  if (hasFtNm && hasGs) {
    steps.push({
      label: "Step 2 — Convert ft/nm to ft/min",
      formula: `ft/nm × (Groundspeed ÷ 60)`,
      result: `${ftNm} × (${gs} ÷ 60) = ${ftMin?.toFixed(0)} ft/min`,
    });
  }

  return (
    <div className="calc-body">
      <div className="calc-inputs">
        <NumInput label="Climb Gradient" value={ftNm} onChange={setFtNm} unit="ft/nm" placeholder="e.g. 200" />
        <NumInput label="Groundspeed" value={gs} onChange={setGs} unit="kts" placeholder="e.g. 250" />
      </div>
      <div className="calc-results">
        <ResultBox label="Gradient" value={pct} unit="%" />
        <ResultBox label="Required Climb Rate" value={ftMin} unit="ft/min" highlight />
      </div>
      {steps.length > 0 && <WorkPanel steps={steps} />}
    </div>
  );
}

// ─── CALCULATORS CONFIG ───────────────────────────────────────────────────────
const CALCS = [
  {
    id: "gradient",
    label: "% → ft/min",
    sublabel: "Departure gradient to required climb rate",
    component: GradientCalc,
  },
  {
    id: "rate",
    label: "ft/min → %",
    sublabel: "Climb rate to gradient percentage",
    component: RateCalc,
  },
  {
    id: "ftnm",
    label: "ft/nm",
    sublabel: "Obstacle clearance gradient conversions",
    component: FtNmCalc,
  },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCalc, setActiveCalc] = useState("gradient");
  const ActiveComponent = CALCS.find(c => c.id === activeCalc)?.component;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-eyebrow">CLIMB / DESCENT</div>
        <h1 className="app-title">JetCalc</h1>
        <p className="app-subtitle">Gradient conversions for business jet pilots</p>
      </header>

      <main className="app-main">
        <nav className="calc-nav">
          {CALCS.map(c => (
            <button
              key={c.id}
              className={`nav-btn ${activeCalc === c.id ? "nav-btn-active" : ""}`}
              onClick={() => setActiveCalc(c.id)}
            >
              <span className="nav-btn-label">{c.label}</span>
            </button>
          ))}
        </nav>

        <div className="calc-card">
          <div className="calc-sublabel">
            {CALCS.find(c => c.id === activeCalc)?.sublabel}
          </div>
          {ActiveComponent && <ActiveComponent key={activeCalc} />}
        </div>

        <div className="formula-ref">
          <div className="ref-title">Reference Formulas</div>
          <div className="ref-grid">
            <div className="ref-item">
              <span className="ref-label">% → ft/nm</span>
              <span className="ref-formula">gradient% × 60.76</span>
            </div>
            <div className="ref-item">
              <span className="ref-label">ft/nm → ft/min</span>
              <span className="ref-formula">ft/nm × (GS ÷ 60)</span>
            </div>
            <div className="ref-item">
              <span className="ref-label">ft/nm → %</span>
              <span className="ref-formula">ft/nm ÷ 60.76</span>
            </div>
            <div className="ref-item">
              <span className="ref-label">ft/min → ft/nm</span>
              <span className="ref-formula">ft/min ÷ (GS ÷ 60)</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>For training reference only. Always verify against approved AFM data.</p>
      </footer>
    </div>
  );
}

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { resolveResource } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";
import "./App.css";
import "./style.css";

const copy = {
  en: {
    eyebrow: "Beautiful. Wonderful. Amazing.",
    headline: "Design your next app like magic.",
    description:
      "A polished Tauri macOS app screen with glassmorphism, soft gradients, bundled resources, and a native PDF open action.",
    openPdf: "Open English PDF",
    title: "Welcome to Aurora Studio",
    premium: "Crafted to feel premium.",
    premiumDescription:
      "Every block is responsive, elegant, and intentionally simple so you can adapt it fast.",
  },
  ja: {
    eyebrow: "Beautiful. Wonderful. Amazing.",
    headline: "Create a magical macOS app.",
    description:
      "Tauri macOS app with React UI, bundled resources, and a native PDF open action.",
    openPdf: "Open Japanese PDF",
    title: "Aurora Studio",
    premium: "Premium desktop experience.",
    premiumDescription:
      "Responsive, elegant, and simple enough to customize quickly.",
  },
};

function preferredLanguage() {
  const language = navigator.language?.toLowerCase() || "en";
  return language.startsWith("ja") ? "ja" : "en";
}

function resourcePdfForLocale(locale) {
  return locale === "ja"
    ? "resources/ja.lproj/manual.pdf"
    : "resources/en.lproj/manual.pdf";
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function openBundledPdf() {
    const pdfPath = await resolveResource("resources/en.lproj/manual.pdf");
    await openPath(pdfPath);
  }
  
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }


  return (
   <main className="app-shell">
      <div className="background-orb orb-red"></div>
      <div className="background-orb orb-blue"></div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">武</div>
          <div>
            <strong>LookOut Arena</strong>
            <span>Eastern Warrior Desktop Experience</span>
          </div>
        </div>

        <nav>
          <a href="#warriors">Warriors</a>
          <a href="#mission">Mission</a>
          <a href="#scroll">Scroll</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Cinematic Tauri Interface</p>
          <h1>
            Two warriors.
            <span> One unforgettable arena.</span>
          </h1>
          <p className="lead">
            A beautiful female warrior and a wonderful male warrior meet in a
            dramatic moonlit interface built for your Tauri macOS app.
          </p>

          <div className="actions">
            <button className="primary-button" onClick={openBundledPdf}>
              Open Battle Scroll
            </button>
            <a className="secondary-button" href="#warriors">
              View Warriors
            </a>
          </div>
        </div>

        <div className="warrior-grid" id="warriors">
          <article className="warrior-card female-card">
            <FemaleWarrior />
            <div className="card-text">
              <p className="label">Beautiful Warrior</p>
              <h2>Scarlet Lotus</h2>
              <p>
                Graceful, fearless, and precise — a crimson blade master with a
                calm gaze and unstoppable motion.
              </p>
            </div>
          </article>

          <article className="warrior-card male-card">
            <MaleWarrior />
            <div className="card-text">
              <p className="label blue">Wonderful Warrior</p>
              <h2>Azure Ronin</h2>
              <p>
                Powerful, honorable, and battle-ready — a blue-armored guardian
                with heroic strength and sharp focus.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mission" id="mission">
        <div>
          <p className="eyebrow">Interface Mission</p>
          <h3>Visible. Dramatic. No blank screen.</h3>
        </div>
        <p>
          This version uses embedded SVG warriors directly inside React, so it
          does not need external image files or remote fonts to display the main
          characters.
        </p>
      </section>

      <section className="scroll-panel" id="scroll">
        <div className="scroll-symbol">戦</div>
        <div>
          <p className="eyebrow">Battle Scroll</p>
          <h3>Your PDF action remains connected.</h3>
          <p>
            The button still opens <code>resources/en.lproj/manual.pdf</code>
            using Tauri.
          </p>
        </div>
        <button className="primary-button" onClick={openBundledPdf}>
          Open PDF
        </button>
      </section>
    </main>
  );
}


function FemaleWarrior() {
  return (
    <svg className="warrior-svg" viewBox="0 0 420 520" role="img" aria-label="Beautiful female warrior">
      <defs>
        <linearGradient id="femaleBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#55101f" />
          <stop offset="55%" stopColor="#150711" />
          <stop offset="100%" stopColor="#07040a" />
        </linearGradient>
        <linearGradient id="femaleArmor" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff6f8d" />
          <stop offset="50%" stopColor="#b91f3e" />
          <stop offset="100%" stopColor="#5f1021" />
        </linearGradient>
        <linearGradient id="bladeSilver" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#dbe4ee" />
          <stop offset="100%" stopColor="#77818e" />
        </linearGradient>
        <filter id="femaleGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="420" height="520" rx="34" fill="url(#femaleBg)" />
      <circle cx="210" cy="105" r="78" fill="#ffbdc8" opacity="0.22" />
      <circle cx="210" cy="105" r="52" fill="#ffd4dc" opacity="0.72" />

      <path d="M95 405 C135 315 282 310 326 405 L348 500 H72 Z" fill="#230815" opacity="0.95" />
      <path d="M132 235 C102 298 112 390 92 480 L180 480 C166 390 184 292 172 238 Z" fill="#2b0714" />
      <path d="M248 238 C236 292 254 390 240 480 L328 480 C308 390 318 298 288 235 Z" fill="#2b0714" />

      <path d="M140 176 C142 98 278 98 280 176 C282 250 250 286 210 286 C170 286 138 250 140 176 Z" fill="#1d0710" />
      <path d="M152 172 C158 116 262 116 268 172 C272 228 246 263 210 263 C174 263 148 228 152 172 Z" fill="#f0b99f" />
      <path d="M151 165 C176 131 248 131 269 164 C255 141 238 124 210 124 C181 124 163 141 151 165 Z" fill="#32101a" />

      <path d="M136 290 C150 252 180 232 210 232 C240 232 270 252 284 290 L305 430 L115 430 Z" fill="url(#femaleArmor)" />
      <path d="M160 300 L210 245 L260 300 L236 430 H184 Z" fill="#ffd0d9" opacity="0.2" />
      <path d="M130 315 C92 330 72 365 60 420 L112 426 C122 380 148 350 175 334 Z" fill="#a71936" />
      <path d="M290 315 C328 330 348 365 360 420 L308 426 C298 380 272 350 245 334 Z" fill="#a71936" />

      <path d="M92 166 C100 100 146 58 210 58 C274 58 320 100 328 166 C297 116 250 92 210 92 C170 92 123 116 92 166 Z" fill="#16060d" />
      <path d="M115 150 C85 230 102 318 74 392 C124 365 142 278 140 184 Z" fill="#18060d" />
      <path d="M305 150 C335 230 318 318 346 392 C296 365 278 278 280 184 Z" fill="#18060d" />

      <path d="M55 312 L340 96 L365 126 L82 340 Z" fill="url(#bladeSilver)" filter="url(#femaleGlow)" />
      <path d="M81 339 L126 359" stroke="#f5c66f" strokeWidth="14" strokeLinecap="round" />
      <path d="M210 232 C190 253 194 286 210 300 C226 286 230 253 210 232 Z" fill="#f7c96f" />
      <text x="210" y="485" textAnchor="middle" fill="#ffd5dd" fontSize="28" fontWeight="800">SCARLET LOTUS</text>
    </svg>
  );
}

function MaleWarrior() {
  return (
    <svg className="warrior-svg" viewBox="0 0 420 520" role="img" aria-label="Wonderful male warrior">
      <defs>
        <linearGradient id="maleBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0d2f5a" />
          <stop offset="55%" stopColor="#08111f" />
          <stop offset="100%" stopColor="#05060a" />
        </linearGradient>
        <linearGradient id="maleArmor" x1="0" x2="1">
          <stop offset="0%" stopColor="#82c4ff" />
          <stop offset="45%" stopColor="#2f6fae" />
          <stop offset="100%" stopColor="#142c4a" />
        </linearGradient>
        <linearGradient id="maleBlade" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#d8e9ff" />
          <stop offset="100%" stopColor="#6f8db2" />
        </linearGradient>
        <filter id="maleGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="420" height="520" rx="34" fill="url(#maleBg)" />
      <circle cx="210" cy="105" r="78" fill="#94caff" opacity="0.2" />
      <circle cx="210" cy="105" r="52" fill="#d8edff" opacity="0.7" />

      <path d="M72 500 L96 392 C118 310 302 310 324 392 L348 500 Z" fill="#07111d" opacity="0.96" />
      <path d="M135 292 C150 244 182 226 210 226 C238 226 270 244 285 292 L312 438 L108 438 Z" fill="url(#maleArmor)" />
      <path d="M146 316 H274 L256 438 H164 Z" fill="#07111d" opacity="0.26" />
      <path d="M127 313 C84 332 62 370 50 430 L108 436 C120 386 150 350 178 332 Z" fill="#244f82" />
      <path d="M293 313 C336 332 358 370 370 430 L312 436 C300 386 270 350 242 332 Z" fill="#244f82" />

      <path d="M146 168 C146 112 274 112 274 168 C274 232 248 262 210 262 C172 262 146 232 146 168 Z" fill="#d7a98e" />
      <path d="M130 168 C134 94 286 94 290 168 C270 132 242 116 210 116 C178 116 150 132 130 168 Z" fill="#0b121d" />
      <path d="M178 78 C178 42 242 42 242 78 L230 124 H190 Z" fill="#111b2a" />
      <path d="M157 157 C178 130 242 130 263 157 C250 122 231 102 210 102 C188 102 170 122 157 157 Z" fill="#111b2a" />

      <path d="M72 114 L366 364 L342 394 L48 144 Z" fill="url(#maleBlade)" filter="url(#maleGlow)" />
      <path d="M330 390 L374 410" stroke="#f5c66f" strokeWidth="14" strokeLinecap="round" />
      <path d="M154 300 L210 236 L266 300 L238 438 H182 Z" fill="#d7ecff" opacity="0.16" />
      <path d="M128 288 H292" stroke="#f5c66f" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
      <path d="M210 226 C190 250 194 282 210 298 C226 282 230 250 210 226 Z" fill="#f7c96f" />
      <text x="210" y="485" textAnchor="middle" fill="#d8ecff" fontSize="28" fontWeight="800">AZURE RONIN</text>
    </svg>
  );
}

export default App;

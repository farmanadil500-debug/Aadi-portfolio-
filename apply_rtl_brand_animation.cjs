const fs = require('fs');

// 1. Update src/main.jsx
let mainJsx = fs.readFileSync('src/main.jsx', 'utf8');
const isCrlf = mainJsx.includes('\r\n');
if (isCrlf) mainJsx = mainJsx.replace(/\r\n/g, '\n');

const oldLogoFunc = `function Logo({ onNavigate, interactive = false, onAvatarClick, isProfileOpen = false }) {
  if (interactive) {
    return (
      <div className="brand-interactive">
        <button
          type="button"
          className={\`logo-avatar-btn \${isProfileOpen ? 'active' : ''}\`}
          onClick={onAvatarClick}
          aria-label="View Farman Adil profile details"
          aria-expanded={isProfileOpen}
          aria-haspopup="dialog"
        >
          <img
            src={profilePhoto}
            alt="Farman Adil"
            className="logo-mark"
            width="40"
            height="40"
          />
        </button>
        <a
          className="brand-text"
          href="#home"
          aria-label="Farman Adil home"
          onClick={(e) => onNavigate && onNavigate(e, 'home')}
        >
          <span><strong>Farman Adil</strong><small>DEVELOPER</small></span>
        </a>
      </div>
    );
  }

  return (
    <a
      className="brand"
      href="#home"
      aria-label="Farman Adil home"
      onClick={(e) => onNavigate && onNavigate(e, 'home')}
    >
      <img
        src={profilePhoto}
        alt="Farman Adil"
        className="logo-mark"
        width="40"
        height="40"
      />
      <span><strong>Farman Adil</strong><small>DEVELOPER</small></span>
    </a>
  );
}`;

const newLogoFunc = `const BrandTitle = () => (
  <span>
    <strong className="brand-name">
      {'Farman Adil'.split('').map((char, i, arr) => (
        <span
          key={i}
          className="brand-letter"
          style={{ '--char-idx-rtl': arr.length - 1 - i }}
        >
          {char === ' ' ? '\\u00A0' : char}
        </span>
      ))}
    </strong>
    <small className="brand-role">DEVELOPER</small>
  </span>
);

function Logo({ onNavigate, interactive = false, onAvatarClick, isProfileOpen = false }) {
  if (interactive) {
    return (
      <div className="brand-interactive">
        <button
          type="button"
          className={\`logo-avatar-btn \${isProfileOpen ? 'active' : ''}\`}
          onClick={onAvatarClick}
          aria-label="View Farman Adil profile details"
          aria-expanded={isProfileOpen}
          aria-haspopup="dialog"
        >
          <img
            src={profilePhoto}
            alt="Farman Adil"
            className="logo-mark"
            width="40"
            height="40"
          />
        </button>
        <a
          className="brand-text"
          href="#home"
          aria-label="Farman Adil home"
          onClick={(e) => onNavigate && onNavigate(e, 'home')}
        >
          <BrandTitle />
        </a>
      </div>
    );
  }

  return (
    <a
      className="brand"
      href="#home"
      aria-label="Farman Adil home"
      onClick={(e) => onNavigate && onNavigate(e, 'home')}
    >
      <img
        src={profilePhoto}
        alt="Farman Adil"
        className="logo-mark"
        width="40"
        height="40"
      />
      <BrandTitle />
    </a>
  );
}`;

if (!mainJsx.includes(oldLogoFunc)) {
  console.error('Could not find oldLogoFunc in main.jsx');
  process.exit(1);
}

mainJsx = mainJsx.replace(oldLogoFunc, newLogoFunc);
if (isCrlf) mainJsx = mainJsx.replace(/\n/g, '\r\n');
fs.writeFileSync('src/main.jsx', mainJsx, 'utf8');
console.log('Successfully updated src/main.jsx with BrandTitle RTL letters');

// 2. Update src/styles.css
let stylesCss = fs.readFileSync('src/styles.css', 'utf8');
const isCssCrlf = stylesCss.includes('\r\n');
if (isCssCrlf) stylesCss = stylesCss.replace(/\r\n/g, '\n');

// Replace previous header brand styles
const brandStyleMarker = '/* Header Brand Horizontal Animation */';
const markerIdx = stylesCss.indexOf(brandStyleMarker);

const rtlCssRules = `/* Header Brand Horizontal Animation (Right-to-Left Kinetic Wave) */
.brand-text {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  padding-bottom: 2px;
  user-select: none;
}

.brand-name {
  display: inline-flex;
  align-items: center;
  font-size: 15.5px;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.brand-letter {
  display: inline-block;
  animation: letterHorizontalRtl 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
  animation-delay: calc(var(--char-idx-rtl) * 75ms);
  will-change: transform, color, text-shadow;
}

@keyframes letterHorizontalRtl {
  0%, 100% {
    transform: translateX(0);
    color: #ffffff;
    text-shadow: none;
  }
  12% {
    transform: translateX(-4px);
    color: #00d2ff;
    text-shadow: 0 0 10px rgba(0, 210, 255, 0.75);
  }
  24% {
    transform: translateX(0);
    color: #ffffff;
    text-shadow: 0 0 4px rgba(0, 210, 255, 0.3);
  }
}

.brand-role {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.22em;
  margin-top: 2px;
  color: var(--blue-light);
  animation: roleHorizontalRtl 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.35s;
  will-change: transform, color, text-shadow;
}

@keyframes roleHorizontalRtl {
  0%, 100% {
    transform: translateX(0);
    color: var(--blue-light);
    text-shadow: none;
  }
  15% {
    transform: translateX(-4px);
    color: #00d2ff;
    text-shadow: 0 0 8px rgba(0, 210, 255, 0.65);
  }
  30% {
    transform: translateX(0);
    color: var(--blue-light);
    text-shadow: none;
  }
}

/* Horizontal Laser Sweep Underneath (Right-to-Left) */
.brand-text::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent 0%, #00d2ff 50%, transparent 100%);
  background-size: 200% 100%;
  animation: brandLaserSweepRtl 4.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  opacity: 0.75;
}

@keyframes brandLaserSweepRtl {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.brand-text:hover .brand-letter {
  color: #00d2ff;
  text-shadow: 0 0 8px rgba(0, 210, 255, 0.5);
}

.brand-text:hover::after {
  opacity: 1;
  height: 2px;
  filter: drop-shadow(0 0 6px #00d2ff);
}`;

if (markerIdx !== -1) {
  // Find where Profile Details Popup begins
  const popupMarker = '/* ==========================================================================\n   PROFILE DETAILS POPUP';
  const popupAltMarker = '/* ==========================================================================\r\n   PROFILE DETAILS POPUP';
  let popupIdx = stylesCss.indexOf(popupMarker);
  if (popupIdx === -1) popupIdx = stylesCss.indexOf(popupAltMarker);

  if (popupIdx !== -1) {
    stylesCss = stylesCss.substring(0, markerIdx) + rtlCssRules + '\n\n' + stylesCss.substring(popupIdx);
  } else {
    stylesCss = stylesCss.substring(0, markerIdx) + rtlCssRules;
  }
} else {
  stylesCss += '\n' + rtlCssRules;
}

if (isCssCrlf) stylesCss = stylesCss.replace(/\n/g, '\r\n');
fs.writeFileSync('src/styles.css', stylesCss, 'utf8');
console.log('Successfully updated src/styles.css with RTL letter wave');

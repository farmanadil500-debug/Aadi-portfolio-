import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, ArrowUpRight, Braces, Check, Code2, Download, ExternalLink, Eye, FileText,
  Flame, Globe2, GitBranch, Layers3, Loader2, Mail, Menu, MessageCircle, Monitor, Palette, Phone,
  Rocket, Send, Server, Smartphone, Sparkles, Users, Briefcase, FolderKanban, X, Zap, ZoomIn, ZoomOut
} from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import './styles.css';

const profilePhoto = '/farman-profile.jpg';

if (typeof window !== 'undefined') {
  const profilePreload = new Image();
  profilePreload.src = profilePhoto;
  const cvPreload = new Image();
  cvPreload.src = '/Farman_Adil_CV_HD.jpg';
}

const GithubIcon = (props) => <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}><path d="M12 .5A11.5 11.5 0 0 0 .5 12 11.5 11.5 0 0 0 8.4 23c.6.1.8-.2.8-.6v-2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" /></svg>;
const LinkedinIcon = (props) => <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}><path d="M20.45 20.45h-3.55v-5.57c0-1.33 0-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.51C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0Z" /></svg>;
const WhatsappIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const services = [
  { icon: Globe2, title: 'Web Development', text: 'Modern, fast and responsive websites built to make your business stand out.' },
  { icon: Smartphone, title: 'Mobile App Development', text: 'Powerful and user-friendly mobile applications people enjoy using.' },
  { icon: Palette, title: 'UI/UX Design', text: 'Clean, modern and intuitive digital experiences that feel effortless.' },
  { icon: Braces, title: 'React Development', text: 'Scalable and interactive React applications with a polished frontend.' },
  { icon: Server, title: 'Full Stack Development', text: 'Complete frontend and backend solutions built around your goals.' },
  { icon: Layers3, title: 'Custom Software', text: 'Thoughtful software solutions tailored to your unique business needs.' },
];

const projects = [
  {
    number: '01',
    title: 'Darzi App',
    category: 'Mobile App Development',
    filterType: 'mobile',
    text: 'A modern tailor management & customer booking mobile application with real-time measurement tracking.',
    tags: ['React Native', 'Expo', 'Firebase'],
    tone: 'emerald',
    image: '/darzi-app-logo.jpg',
    link: 'https://drive.google.com/uc?export=download&id=1KVcTGQ_HJF63UAN0eZfC2b-U4Z2XIZ4V',
    linkText: 'Download APK',
    github: 'https://github.com/farmanadil500-debug/darzi',
    icon: Smartphone,
  },
  {
    number: '02',
    title: 'Weather Forecast App',
    category: 'Web Application',
    filterType: 'web',
    text: 'A real-time weather forecasting web application with dynamic atmospheric data and clean responsive interface.',
    tags: ['JavaScript', 'Weather API', 'CSS3'],
    tone: 'cyan',
    github: 'https://github.com/farmanadil500-debug/weather-app',
    icon: Globe2,
  },
  {
    number: '03',
    title: 'Online Market Platform',
    category: 'E-Commerce Platform',
    filterType: 'web',
    text: 'Digital shopping and online marketplace platform built with TypeScript for seamless item browsing.',
    tags: ['TypeScript', 'React', 'E-Commerce'],
    tone: 'blue',
    github: 'https://github.com/farmanadil500-debug/online-market',
    icon: Layers3,
  },
  {
    number: '04',
    title: 'Farman Portfolio Website',
    category: 'Web Platform',
    filterType: 'web',
    text: 'High-performance interactive developer portfolio featuring custom animations, HD CV viewer, and responsive UI.',
    tags: ['React', 'Vite', 'Firebase Hosting'],
    tone: 'violet',
    link: 'https://farman-6fdb2.web.app/',
    linkText: 'Live Site',
    github: 'https://github.com/farmanadil500-debug/farman-portfolio',
    icon: Code2,
  },
  {
    number: '05',
    title: 'Meer Software App',
    category: 'Software Application',
    filterType: 'web',
    text: 'Structured frontend web application built using TypeScript and clean architectural component patterns.',
    tags: ['TypeScript', 'Frontend', 'Modular UI'],
    tone: 'teal',
    github: 'https://github.com/farmanadil500-debug/meer',
    icon: Rocket,
  },
  {
    number: '06',
    title: 'Mobile App Prototype',
    category: 'Mobile Prototype',
    filterType: 'mobile',
    text: 'Cross-platform mobile experiment exploring React Native lifecycle states, navigation flows, and fluid gestures.',
    tags: ['React Native', 'JavaScript', 'Mobile UI'],
    tone: 'navy',
    github: 'https://github.com/farmanadil500-debug/my-first-app',
    icon: Smartphone,
  },
];

const technologies = [
  ['React', 'âš›', 'react'], ['JavaScript', 'JS', 'js'], ['HTML5', '5', 'html'], ['CSS3', '#', 'css'], ['Node.js', 'N', 'node'], ['Express.js', 'ex', 'express'], ['MongoDB', 'M', 'mongo'], ['Git', 'âŒ˜', 'git'], ['GitHub', 'â—‰', 'github'], ['REST API', '{}', 'api'], ['React Native', 'RN', 'native'], ['Firebase', 'ðŸ”¥', 'firebase'],
];

function Logo({ onNavigate, interactive = false, onAvatarClick, isProfileOpen = false }) {
  if (interactive) {
    return (
      <div className="brand-interactive">
        <button
          type="button"
          className={`logo-avatar-btn ${isProfileOpen ? 'active' : ''}`}
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
}

function ProfilePopup({ isOpen, onClose, onNavigate, onOpenCv }) {
  const popupRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        // Also verify if the click was not on the trigger button (handled by container ref)
        const trigger = e.target.closest('.logo-avatar-btn');
        if (!trigger) {
          onClose();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleViewProfile = (e) => {
    onClose();
    if (onNavigate) {
      onNavigate(e, 'about');
    }
  };

  return (
    <div
      ref={popupRef}
      className="profile-popup"
      role="dialog"
      aria-label="Farman Adil Profile Details"
      aria-modal="false"
    >
      <button
        type="button"
        className="profile-popup-close"
        onClick={onClose}
        aria-label="Close profile card"
      >
        <X size={15} />
      </button>

      <div className="profile-popup-header">
        <div className="profile-popup-avatar-ring">
          <img
            src={profilePhoto}
            alt="Farman Adil"
            className="profile-popup-avatar"
            width="64"
            height="64"
          />
        </div>
        <div className="profile-popup-info">
          <h4 className="profile-popup-name">Farman Adil</h4>
          <span className="profile-popup-role">Frontend &amp; React Native Developer</span>
        </div>
      </div>

      <p className="profile-popup-bio">
        Passionate developer building modern, responsive web and mobile applications with clean code and high performance.
      </p>

      <div className="profile-popup-divider" />

      <div className="profile-popup-contact">
        <a href="mailto:farmanadil500@gmail.com" className="profile-popup-contact-item">
          <div className="profile-popup-icon"><Mail size={14} /></div>
          <span>farmanadil500@gmail.com</span>
        </a>
        <a
          href="https://wa.me/923496506743?text=Hi%20Farman,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
          target="_blank"
          rel="noopener noreferrer"
          className="profile-popup-contact-item"
        >
          <div className="profile-popup-icon whatsapp"><WhatsappIcon width={13} height={13} /></div>
          <span>WhatsApp: +92 3496506743</span>
        </a>
        <a href="tel:+923496506743" className="profile-popup-contact-item">
          <div className="profile-popup-icon"><Phone size={14} /></div>
          <span>Call: +92 3496506743</span>
        </a>
      </div>

      <div className="profile-popup-actions">
        <button
          type="button"
          className="profile-popup-btn primary"
          onClick={handleViewProfile}
        >
          <span>View Full Profile</span>
          <ArrowRight size={14} />
        </button>
        {onOpenCv && (
          <button
            type="button"
            className="profile-popup-btn secondary"
            onClick={() => {
              onClose();
              onOpenCv();
            }}
          >
            <span>View CV</span>
            <Eye size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function Navbar({ onOpenCv }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef({});
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const links = [
    ['Home', 'home'],
    ['Services', 'services'],
    ['Portfolio', 'portfolio'],
    ['About', 'about'],
    ['Experience', 'experience'],
    ['Contact', 'contact'],
  ];

  useEffect(() => {
    const sectionIds = ['home', 'services', 'portfolio', 'about', 'experience', 'contact'];

    const handleScroll = () => {
      // If a nav link was clicked, keep the activeSection locked until smooth scroll finishes
      if (isClickScrollingRef.current) {
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // 1. Top of page: always 'home'
      if (scrollY < 80) {
        setActiveSection('home');
        return;
      }

      // 2. Bottom of page: always 'contact'
      if (windowHeight + scrollY >= scrollHeight - 120) {
        setActiveSection('contact');
        return;
      }

      // 3. Scan sections in document order
      // A section is active if its top has passed into the upper viewport (160px)
      // Because sectionIds is in DOM order, the last section satisfying rect.top <= 160 is the active section
      const navOffset = 160;
      let currentSection = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    const handleUserInterrupt = () => {
      if (isClickScrollingRef.current) {
        isClickScrollingRef.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }
    };

    const handleScrollEnd = () => {
      if (isClickScrollingRef.current) {
        isClickScrollingRef.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        handleScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const updateIndicator = useCallback(() => {
    const activeEl = linkRefs.current[activeSection];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
    const rafId = requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
      if (e.key === 'Escape' && profileOpen) setProfileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 840 && open) setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [open, profileOpen]);

  const scrollToSection = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();

    // Lock programmatic scroll to prevent intermediate jittering
    isClickScrollingRef.current = true;
    setActiveSection(id);
    setOpen(false);
    setProfileOpen(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Safety timeout to release lock once smooth scrolling concludes
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 900);

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 74;
        const rect = element.getBoundingClientRect();
        const targetTop = rect.top + window.scrollY - navbarHeight;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (!profileOpen && open) {
      setOpen(false);
    }
    setProfileOpen((prev) => !prev);
  };

  const handleMenuToggle = () => {
    if (!open && profileOpen) {
      setProfileOpen(false);
    }
    setOpen((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-brand-container">
          <Logo
            onNavigate={scrollToSection}
            interactive={true}
            isProfileOpen={profileOpen}
            onAvatarClick={handleAvatarClick}
          />
          <ProfilePopup
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            onNavigate={scrollToSection}
            onOpenCv={onOpenCv}
          />
        </div>
        {open && (
          <div
            className="nav-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map(([label, id]) => (
            <a
              key={id}
              ref={(el) => (linkRefs.current[id] = el)}
              href={`#${id}`}
              className={activeSection === id ? 'active' : ''}
              onClick={(e) => scrollToSection(e, id)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-cta"
            href="#contact"
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            Let's talk <ArrowUpRight size={15} />
          </a>
          <span
            className="nav-indicator"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />
        </nav>
        <button
          className="menu-button"
          onClick={handleMenuToggle}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

const particles = [
  { top: '18%', left: '48%', size: 4, type: 'dot', dur: '7s', delay: '0s' },
  { top: '35%', left: '42%', size: 3, type: 'glow', dur: '9s', delay: '-2s' },
  { top: '55%', left: '55%', size: 5, type: 'soft', dur: '8s', delay: '-4s' },
  { top: '25%', left: '62%', size: 3, type: 'dot', dur: '10s', delay: '-1s' },
  { top: '68%', left: '38%', size: 4, type: 'glow', dur: '7.5s', delay: '-3s' },
  { top: '45%', left: '28%', size: 3, type: 'soft', dur: '9.5s', delay: '-5s' },
  { top: '72%', left: '60%', size: 3, type: 'dot', dur: '8.5s', delay: '-1.5s' },
  { top: '12%', left: '35%', size: 4, type: 'glow', dur: '11s', delay: '-6s' },
  { top: '82%', left: '50%', size: 3, type: 'soft', dur: '8s', delay: '-3.5s' },
  { top: '40%', left: '70%', size: 5, type: 'dot', dur: '10s', delay: '-7s' },
  { top: '60%', left: '20%', size: 3, type: 'glow', dur: '9s', delay: '-4.5s' },
  { top: '30%', left: '15%', size: 4, type: 'soft', dur: '8.5s', delay: '-2.5s' },
];

function CodeVisual() {
  return (
    <div className="hero-art" aria-label="Abstract developer workspace illustration" role="img">
      <div className="hero-art-stage">
        {/* Background effects */}
        <div className="hero-bg-grid" />
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow-purple" />

        {/* Subtle ambient particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className={`hero-particle hero-particle--${p.type}`}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}

        {/* SVG connecting lines and flowing wave light trails */}
        <svg className="hero-connections" viewBox="0 0 520 460" fill="none">
          {/* Subtle grid connections */}
          <line x1="80" y1="330" x2="190" y2="260" stroke="#0066FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
          <line x1="190" y1="260" x2="330" y2="210" stroke="#0066FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="330" y1="210" x2="470" y2="280" stroke="#00C8FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

          {/* Curved flowing light trails */}
          <path d="M -50 420 Q 120 350 260 410 Q 390 460 550 400" stroke="url(#heroWaveGrad1)" strokeWidth="1.8" filter="url(#heroGlowFilter)" />
          <path d="M -80 450 Q 100 380 300 440 Q 430 480 580 420" stroke="url(#heroWaveGrad2)" strokeWidth="1.4" filter="url(#heroGlowFilter)" />
          <path d="M 20 390 Q 170 320 320 380 Q 450 420 570 360" stroke="url(#heroWaveGrad3)" strokeWidth="1.2" opacity="0.75" filter="url(#heroGlowFilter)" />

          <circle cx="80" cy="330" r="3" fill="#00C8FF" opacity="0.7"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" /></circle>
          <circle cx="190" cy="260" r="2.5" fill="#168CFF" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" /></circle>
          <circle cx="330" cy="210" r="3" fill="#00C8FF" opacity="0.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" /></circle>
          <circle cx="280" cy="395" r="2.5" fill="#00C8FF" opacity="0.85"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite" /></circle>

          <defs>
            <linearGradient id="heroWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#01050E" stopOpacity="0" />
              <stop offset="25%" stopColor="#168CFF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#00C8FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#01050E" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="heroWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#01050E" stopOpacity="0" />
              <stop offset="30%" stopColor="#006BFF" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#168CFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#01050E" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="heroWaveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#01050E" stopOpacity="0" />
              <stop offset="40%" stopColor="#00C8FF" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#006BFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#01050E" stopOpacity="0" />
            </linearGradient>

            <filter id="heroGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Elliptical orbit reflection */}
        <div className="hero-orbit" />

        {/* Large background code window */}
        <div className="code-window-main floating">
          <div className="cw-top"><span /><span /><span /></div>
          <div className="cw-body">
            <div className="cw-code-icon"><span>&lt;/&gt;</span></div>
            <div className="cw-ui-layer cw-ui-layer-1" />
            <div className="cw-ui-layer cw-ui-layer-2" />
            <div className="cw-ui-layer cw-ui-layer-3" />
          </div>
        </div>

        {/* Small floating card 1 */}
        <div className="float-card float-card-1 floating delay">
          <div className="fc-header"><div className="fc-dots"><span /><span /><span /></div></div>
          <div className="fc-content">
            <div className="fc-icon-row">
              <div className="fc-icon-circle"><Code2 size={14} /></div>
              <div className="fc-lines"><div className="fc-line fc-line-long" /><div className="fc-line fc-line-short" /></div>
            </div>
            <div className="fc-blocks"><div className="fc-block fc-block-blue" /><div className="fc-block fc-block-cyan" /><div className="fc-block fc-block-purple" /></div>
            <div className="fc-bars"><div className="fc-bar" style={{ width: '80%' }} /><div className="fc-bar" style={{ width: '60%' }} /><div className="fc-bar" style={{ width: '45%' }} /></div>
          </div>
        </div>

        {/* Small floating card 2 */}
        <div className="float-card float-card-2 floating delay-two">
          <div className="fc-header"><div className="fc-dots"><span /><span /><span /></div></div>
          <div className="fc-content">
            <div className="fc-icon-row">
              <div className="fc-icon-circle"><Zap size={14} /></div>
              <div className="fc-lines"><div className="fc-line fc-line-long" /><div className="fc-line fc-line-short" /></div>
            </div>
            <div className="fc-status-row"><div className="fc-status-dot" /><div className="fc-line fc-line-medium" /></div>
            <div className="fc-mini-grid"><div /><div /><div /><div /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy, align = '' }) { return <div className={`section-heading ${align}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>; }

function CvModal({ isOpen, onClose }) {
  const pdfPath = '/Farman_Adil_CV_HD.pdf';
  const imgPath = '/Farman_Adil_CV_HD.jpg';
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setZoomLevel(1);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(Number((prev + 0.2).toFixed(1)), 2.2));
  const zoomOut = () => setZoomLevel((prev) => Math.max(Number((prev - 0.2).toFixed(1)), 0.8));
  const resetZoom = () => setZoomLevel(1);

  if (!isOpen) return null;

  return (
    <div
      className="cv-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Farman Adil Curriculum Vitae"
    >
      <div
        className="cv-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cv-modal-header">
          <div className="cv-modal-top-row">
            <div className="cv-modal-title-group">
              <div className="cv-modal-icon-badge">
                <FileText size={18} />
              </div>
              <div className="cv-modal-title-text">
                <div className="cv-modal-title">
                  Farman Adil â€” CV <span className="cv-modal-badge">Full HD</span>
                </div>
                <div className="cv-modal-subtitle">Direct Preview Â· React Native &amp; Frontend Developer</div>
              </div>
            </div>

            <button
              type="button"
              className="cv-action-btn cv-action-close cv-mobile-close"
              onClick={onClose}
              aria-label="Close CV preview"
            >
              <X size={18} />
            </button>
          </div>

          <div className="cv-modal-actions">
            <div className="cv-zoom-controls">
              <button
                type="button"
                className="cv-zoom-btn"
                onClick={zoomOut}
                disabled={zoomLevel <= 0.8}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                className="cv-zoom-btn cv-zoom-reset"
                onClick={resetZoom}
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                className="cv-zoom-btn"
                onClick={zoomIn}
                disabled={zoomLevel >= 2.2}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <a
              href={pdfPath}
              download="Farman_Adil_CV_HD.pdf"
              className="cv-action-btn cv-action-download"
              title="Download CV PDF to your device"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-action-btn cv-action-tab"
              title="Open full PDF in a new tab"
            >
              <ExternalLink size={14} />
              <span>Fullscreen Tab</span>
            </a>

            <button
              type="button"
              className="cv-action-btn cv-action-close cv-desktop-close"
              onClick={onClose}
              aria-label="Close CV preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="cv-modal-body">
          {isLoading && (
            <div className="cv-modal-loader" aria-live="polite">
              <div className="cv-loader-spinner-wrapper">
                <div className="cv-loader-ring" />
                <div className="cv-loader-glow" />
                <Loader2 size={34} className="cv-loader-spinner" />
              </div>
              <h3 className="cv-loader-title">Loading Curriculum Vitae...</h3>
              <p className="cv-loader-desc">Preparing High-Definition Document (HD) Â· Please wait</p>
              <div className="cv-loader-progress-track">
                <div className="cv-loader-progress-bar" />
              </div>
            </div>
          )}

          <div className={`cv-image-scroll-wrapper ${isLoading ? 'is-loading' : 'is-loaded'}`}>
            <div
              className="cv-image-container"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={imgPath}
                alt="Farman Adil â€” Curriculum Vitae HD"
                className="cv-preview-img"
                onLoad={handleImageLoaded}
                width="2048"
                height="3072"
              />

              {/* Interactive clickable link hotspots */}
              <div className="cv-interactive-links">
                <a
                  href="tel:+923496506743"
                  className="cv-link-hotspot cv-link-phone"
                  title="Call Farman Adil (+92 349 6506743)"
                />
                <a
                  href="mailto:farmanadil500@gmail.com"
                  className="cv-link-hotspot cv-link-email"
                  title="Email Farman Adil (farmanadil500@gmail.com)"
                />
                <a
                  href="https://www.linkedin.com/in/farman-adil-17b0903a4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-link-hotspot cv-link-linkedin"
                  title="LinkedIn: Farman Adil"
                />
                <a
                  href="https://github.com/farmanadil500-debug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-link-hotspot cv-link-github"
                  title="GitHub: farmanadil500-debug"
                />
                <a
                  href="https://farman-6fdb2.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-link-hotspot cv-link-web"
                  title="Portfolio: Farman Adil"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="cv-modal-footer">
          <span className="cv-modal-footer-note">
            Viewing CV in Crystal HD. Click <strong>Download PDF</strong> to save a local copy.
          </span>
          <div className="cv-modal-footer-links">
            <a href={pdfPath} download="Farman_Adil_CV_HD.pdf" className="cv-footer-link">
              <Download size={13} /> Save PDF
            </a>
            <span className="cv-footer-dot">Â·</span>
            <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="cv-footer-link">
              <ExternalLink size={13} /> Open Tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onOpenCv }) {
  const [btnLoading, setBtnLoading] = useState(false);

  const handleOpenCv = () => {
    setBtnLoading(true);
    if (onOpenCv) onOpenCv();
    setTimeout(() => setBtnLoading(false), 1500);
  };

  return (
    <section className="hero section-pad" id="home">
      <div className="hero-copy">
        <div className="availability"><span /> Available for new projects</div>
        <h1>WE BUILD<br /><span>DIGITAL SOLUTIONS</span></h1>
        <p className="hero-lead">Modern websites. Powerful apps.<br />Endless possibilities.</p>
        <p className="hero-trust-line">
          Based in Pakistan <span className="hero-trust-dot">Â·</span> Working Worldwide
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#contact">Get started <ArrowRight size={16} /></a>
          <a className="button ghost" href="#portfolio">View portfolio <ArrowUpRight size={16} /></a>
          <button
            type="button"
            className={`button ghost button-cv ${btnLoading ? 'is-loading' : ''}`}
            onClick={handleOpenCv}
            aria-label="View Farman Adil CV"
          >
            {btnLoading ? (
              <>
                Loading CV... <Loader2 size={16} className="button-cv-spin" />
              </>
            ) : (
              <>
                View CV <Eye size={16} />
              </>
            )}
          </button>
        </div>
      </div>
      <CodeVisual />
      <div className="hero-trust">
        <div className="trust-item"><Rocket size={19} /><span><strong>Modern Design</strong><small>Clean and modern user interface design.</small></span></div>
        <div className="trust-item"><Code2 size={19} /><span><strong>Quality Code</strong><small>High quality, scalable and maintainable code.</small></span></div>
        <div className="trust-item"><MessageCircle size={19} /><span><strong>Great Support</strong><small>24/7 support to help you whenever you need.</small></span></div>
      </div>
    </section>
  );
}

function Services() { return <section className="section-pad services-section" id="services"><SectionHeading eyebrow="What we do" title={<>BUILDING WHAT<br /><span>MATTERS</span></>} copy="From first idea to final interaction, I create digital products that are useful, beautiful and built to last." /><div className="service-grid">{services.map(({ icon: Icon, title, text }, index) => <article className="service-card" key={title}><div className="card-number">0{index + 1}</div><div className="icon-box"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Learn about ${title}`}><ArrowUpRight size={18} /></a></article>)}</div></section>; }

const aboutSkills = [
  { name: 'React', icon: Sparkles },
  { name: 'JavaScript', icon: Zap },
  { name: 'HTML5', icon: Code2 },
  { name: 'CSS3', icon: Palette },
  { name: 'Firebase', icon: Flame },
  { name: 'Git', icon: GitBranch },
  { name: 'Responsive Design', icon: Smartphone },
  { name: 'Tailwind CSS', icon: Layers3 },
];

function About() {
  const [headingRevealed, setHeadingRevealed] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const firstName = 'Farman';
  const lastName = 'Adil';

  return (
    <section className="about-section" id="about">
      <div className="about-heading reveal">
        <h2>About <span className="gradient-text">Me</span></h2>
        <div className="about-heading-line" />
      </div>

      <div className="about-grid">
        {/* Left â€” Profile Photo */}
        <div className="about-profile-visual reveal">
          <div className="about-profile-bg">
            <div className="about-profile-dots" />
            <div className="about-profile-orbit-ring" aria-hidden="true" />
            <svg className="about-profile-curve" viewBox="0 0 400 500" fill="none">
              <path d="M30 450 Q100 350 200 380 Q300 410 370 320" stroke="url(#aboutCurveGrad)" strokeWidth="1.2" opacity="0.35" fill="none" strokeDasharray="12 800">
                <animate attributeName="stroke-dashoffset" from="800" to="0" dur="8s" repeatCount="indefinite" />
              </path>
              <defs>
                <linearGradient id="aboutCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22C7FF" />
                  <stop offset="100%" stopColor="#0066FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="about-profile-glow-purple" />
          </div>

          <div className="about-profile-frame">
            <img
              src={profilePhoto}
              alt="Farman Adil â€” Software Developer"
              className="about-profile-img"
              width="1024"
              height="812"
              loading="eager"
              fetchPriority="high"
              decoding="auto"
            />
          </div>

          <div className="about-profile-card" tabIndex={0} role="region" aria-label="Profile summary">
            <strong>Farman Adil</strong>
            <small>Developer</small>
          </div>
        </div>

        {/* Right â€” About Content */}
        <div className="about-content">
          <span className="about-label">Who I Am</span>
          <h3
            ref={headingRef}
            className={`about-name ${headingRevealed ? 'revealed' : ''}`}
            aria-label="Farman Adil"
          >
            <span className="about-name-word" aria-hidden="true">
              {firstName.split('').map((char, i) => (
                <span
                  key={i}
                  className="about-name-char"
                  style={{ animationDelay: `${i * 170}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="about-name-word blue" aria-hidden="true">
              {lastName.split('').map((char, i) => (
                <span
                  key={i}
                  className="about-name-char"
                  style={{ animationDelay: `${(firstName.length + i) * 170}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h3>
          <p className="about-role">Frontend & React Native Developer</p>
          <p className="about-desc">
            I'm a Frontend & React Native Developer focused on building modern, responsive web and mobile applications. I work with HTML, CSS, JavaScript, React, React Native, Expo, and Firebase to turn ideas into functional and user-friendly digital products.
          </p>

          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-icon"><FolderKanban size={17} /></div>
              <div className="about-stat-text">
                <strong className="stat-value">15+</strong>
                <small className="stat-label">Projects Completed</small>
              </div>
            </div>
            <div className="about-stat">
              <div className="about-stat-icon"><Briefcase size={17} /></div>
              <div className="about-stat-text">
                <strong className="stat-value">2 Years</strong>
                <small className="stat-label">Experience</small>
              </div>
            </div>
            <div className="about-stat">
              <div className="about-stat-icon"><Layers3 size={17} /></div>
              <div className="about-stat-text">
                <strong className="stat-value">8+</strong>
                <small className="stat-label">Technologies</small>
              </div>
            </div>
            <div className="about-stat">
              <div className="about-stat-icon"><Sparkles size={17} /></div>
              <div className="about-stat-text">
                <strong className="stat-value">Available</strong>
                <small className="stat-label">Open for Projects</small>
              </div>
            </div>
          </div>

          <span className="about-skills-label">My Skills</span>
          <div className="about-skills-grid">
            {aboutSkills.map(({ name, icon: Icon }, i) => (
              <div className="about-skill-badge reveal" key={name} style={{ transitionDelay: `${0.3 + i * 0.06}s` }}>
                <Icon size={15} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const experiences = [
  {
    role: 'Frontend & Mobile App Developer',
    company: 'Software House',
    period: '2026 â€” Present',
    current: true,
    type: 'Full-time Â· Team Environment',
    description: 'Working in an agile software house engineering cross-platform mobile apps and dynamic web applications with production-grade architecture.',
    highlights: [
      'Architecting and implementing scalable UI components with React Native, Expo, and React.js',
      'Integrating RESTful APIs, cloud database synchronization, and authentication with Firebase',
      'Collaborating in agile sprints with designers and backend teams to deliver high-quality client deliverables',
    ],
    skills: ['React Native', 'Expo', 'React.js', 'Firebase', 'REST APIs', 'Git'],
  },
  {
    role: 'Independent App Developer',
    company: 'Mobile Solutions & Client Projects',
    period: '2025 â€” 2026',
    current: false,
    type: 'Production Apps',
    description: 'Built end-to-end mobile applications, including the Darzi App for tailor shop order automation and client management.',
    highlights: [
      'Developed complete customer measurement tracking, order status, and automated record-keeping',
      'Configured cloud Firestore security rules, live syncing, and real-time state management',
      'Packaged and distributed standalone Android APK builds with optimized bundle performance',
    ],
    skills: ['React Native', 'Firebase Firestore', 'Expo EAS', 'Mobile UI/UX', 'JavaScript'],
  },
  {
    role: 'Frontend & Web Developer',
    company: 'Web Solutions & Projects',
    period: '2025',
    current: false,
    type: 'Projects & Freelance',
    description: 'Built responsive web platforms, landing pages, and interactive client dashboards using modern web technologies.',
    highlights: [
      'Crafted mobile-first, responsive user interfaces using React, JavaScript (ES6+), HTML5, and CSS3',
      'Ensured 100% cross-browser responsiveness and optimal page load speeds',
      'Maintained version-controlled, clean codebases following modern web standards',
    ],
    skills: ['JavaScript', 'React', 'HTML5/CSS3', 'Responsive Design', 'Git'],
  },
];

function Experience() {
  return (
    <section className="section-pad experience-section" id="experience">
      <SectionHeading
        eyebrow="Career Journey"
        title={<>PROFESSIONAL <span>EXPERIENCE</span></>}
        copy="My experience working in a software house environment and delivering production-ready mobile and web applications."
      />
      <div className="experience-timeline">
        {experiences.map((exp, index) => (
          <article className="experience-card reveal" key={exp.role + index}>
            <div className="experience-rail" aria-hidden="true">
              <div className={`experience-node ${exp.current ? 'current' : ''}`}>
                <Briefcase size={15} />
              </div>
              {index < experiences.length - 1 && <div className="experience-line" />}
            </div>
            <div className="experience-content">
              <div className="experience-header">
                <div className="experience-title-group">
                  <h3>{exp.role}</h3>
                  <div className="experience-company-wrap">
                    <span className="experience-company">{exp.company}</span>
                    <span className="experience-dot">Â·</span>
                    <span className="experience-type">{exp.type}</span>
                  </div>
                </div>
                <div className="experience-badge-wrap">
                  {exp.current && (
                    <span className="experience-current-badge">
                      <span className="experience-current-pulse" aria-hidden="true" />
                      Active Role
                    </span>
                  )}
                  <span className="experience-period">{exp.period}</span>
                </div>
              </div>
              <p className="experience-desc">{exp.description}</p>
              <ul className="experience-highlights">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <div className="experience-tags">
                {exp.skills.map(skill => (
                  <span key={skill} className="experience-tag">{skill}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GlowingBottomLines() {
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);
  const path2GlowRef = useRef(null);
  const path3Ref = useRef(null);
  const path3GlowRef = useRef(null);
  const path4Ref = useRef(null);
  const path4GlowRef = useRef(null);

  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);
  const circle3Ref = useRef(null);

  useEffect(() => {
    let animationId;
    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      // Organic, normal-speed time multipliers
      const t1 = elapsed * 0.9;
      const t2 = elapsed * 0.75;
      const t3 = elapsed * 0.65;
      const t4 = elapsed * 0.55;

      // --- Path 1 Coords (Original: M0 160 Q360 80 720 130 T1440 100) ---
      const p1_y0 = 160 + 8 * Math.sin(t1 * 1.5 + 0.5);
      const p1_x1 = 360 + 35 * Math.sin(t1 * 1.1);
      const p1_y1 = 80 + 16 * Math.cos(t1 * 1.3);
      const p1_x2 = 720 + 25 * Math.cos(t1 * 0.9 + 1.0);
      const p1_y2 = 130 + 14 * Math.sin(t1 * 1.2);
      const p1_y3 = 100 + 8 * Math.sin(t1 * 0.8);
      const d1 = `M0 ${p1_y0} Q${p1_x1} ${p1_y1} ${p1_x2} ${p1_y2} T1440 ${p1_y3}`;

      // --- Path 2 Coords (Original: M-50 170 Q320 60 720 120 T1490 90) ---
      const p2_y0 = 170 + 11 * Math.sin(t2 * 1.3 + 1.0);
      const p2_x1 = 320 + 40 * Math.cos(t2 * 0.9);
      const p2_y1 = 60 + 20 * Math.sin(t2 * 1.2 + 0.3);
      const p2_x2 = 720 + 30 * Math.sin(t2 * 0.8 + 1.5);
      const p2_y2 = 120 + 16 * Math.cos(t2 * 1.4);
      const p2_y3 = 90 + 10 * Math.sin(t2 * 0.7 + 0.8);
      const d2 = `M-50 ${p2_y0} Q${p2_x1} ${p2_y1} ${p2_x2} ${p2_y2} T1490 ${p2_y3}`;

      // --- Path 3 Coords (Original: M-50 140 Q400 180 800 90 T1490 140) ---
      const p3_y0 = 140 + 10 * Math.cos(t3 * 1.2 + 1.2);
      const p3_x1 = 400 + 45 * Math.sin(t3 * 0.8);
      const p3_y1 = 180 + 18 * Math.cos(t3 * 1.1 + 0.5);
      const p3_x2 = 800 + 32 * Math.cos(t3 * 0.9 + 0.7);
      const p3_y2 = 90 + 16 * Math.sin(t3 * 1.3);
      const p3_y3 = 140 + 12 * Math.cos(t3 * 0.8 + 2.0);
      const d3 = `M-50 ${p3_y0} Q${p3_x1} ${p3_y1} ${p3_x2} ${p3_y2} T1490 ${p3_y3}`;

      // --- Path 4 Coords (Original: M0 190 Q300 110 680 150 T1440 115) ---
      const p4_y0 = 190 + 7 * Math.sin(t4 * 1.4 + 0.2);
      const p4_x1 = 300 + 28 * Math.sin(t4 * 0.9);
      const p4_y1 = 110 + 14 * Math.cos(t4 * 1.2 + 0.9);
      const p4_x2 = 680 + 22 * Math.cos(t4 * 0.8 + 1.1);
      const p4_y2 = 150 + 12 * Math.sin(t4 * 1.0);
      const p4_y3 = 115 + 8 * Math.cos(t4 * 0.9);
      const d4 = `M0 ${p4_y0} Q${p4_x1} ${p4_y1} ${p4_x2} ${p4_y2} T1440 ${p4_y3}`;

      // Update paths in DOM
      if (path1Ref.current) path1Ref.current.setAttribute('d', d1);
      if (path2Ref.current) path2Ref.current.setAttribute('d', d2);
      if (path2GlowRef.current) path2GlowRef.current.setAttribute('d', d2);
      if (path3Ref.current) path3Ref.current.setAttribute('d', d3);
      if (path3GlowRef.current) path3GlowRef.current.setAttribute('d', d3);
      if (path4Ref.current) path4Ref.current.setAttribute('d', d4);
      if (path4GlowRef.current) path4GlowRef.current.setAttribute('d', d4);

      // --- Particles (Circles) ---
      const c1_x = 520 + 30 * Math.sin(elapsed * 1.1);
      const c1_y = 98 + 10 * Math.cos(elapsed * 1.3);

      const c2_x = 860 + 35 * Math.cos(elapsed * 0.95 + 1.0);
      const c2_y = 108 + 12 * Math.sin(elapsed * 1.2 + 0.5);

      const c3_x = 1120 + 28 * Math.sin(elapsed * 1.3 + 2.0);
      const c3_y = 118 + 9 * Math.cos(elapsed * 1.05 + 1.5);

      if (circle1Ref.current) {
        circle1Ref.current.setAttribute('cx', c1_x);
        circle1Ref.current.setAttribute('cy', c1_y);
      }
      if (circle2Ref.current) {
        circle2Ref.current.setAttribute('cx', c2_x);
        circle2Ref.current.setAttribute('cy', c2_y);
      }
      if (circle3Ref.current) {
        circle3Ref.current.setAttribute('cx', c3_x);
        circle3Ref.current.setAttribute('cy', c3_y);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="glowing-lines-wrapper" aria-hidden="true">
      <div className="glowing-lines-glow-ambient" />
      <svg
        className="glowing-lines-svg"
        viewBox="0 0 1440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="glowingLineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#01050E" stopOpacity="0" />
            <stop offset="15%" stopColor="#006BFF" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#00C8FF" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#168CFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#01050E" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glowingLineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#01050E" stopOpacity="0" />
            <stop offset="25%" stopColor="#168CFF" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#00C8FF" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#006BFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#01050E" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glowingLineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#01050E" stopOpacity="0" />
            <stop offset="35%" stopColor="#00C8FF" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#168CFF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#01050E" stopOpacity="0" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" opacity="0.6" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          ref={path1Ref}
          d="M0 160 Q360 80 720 130 T1440 100"
          stroke="url(#glowingLineGrad1)"
          strokeWidth="5"
          opacity="0.25"
          filter="url(#softGlow)"
        />

        {/* Base Path 2 */}
        <path
          ref={path2Ref}
          d="M-50 170 Q320 60 720 120 T1490 90"
          stroke="url(#glowingLineGrad1)"
          strokeWidth="2.2"
          filter="url(#softGlow)"
          opacity="0.35"
        />
        {/* Glow Flow Path 2 */}
        <path
          ref={path2GlowRef}
          d="M-50 170 Q320 60 720 120 T1490 90"
          stroke="url(#glowingLineGrad1)"
          strokeWidth="2.2"
          filter="url(#softGlow)"
          className="glowing-lines-flow-1"
        />

        {/* Base Path 3 */}
        <path
          ref={path3Ref}
          d="M-50 140 Q400 180 800 90 T1490 140"
          stroke="url(#glowingLineGrad2)"
          strokeWidth="1.8"
          filter="url(#softGlow)"
          opacity="0.3"
        />
        {/* Glow Flow Path 3 */}
        <path
          ref={path3GlowRef}
          d="M-50 140 Q400 180 800 90 T1490 140"
          stroke="url(#glowingLineGrad2)"
          strokeWidth="1.8"
          filter="url(#softGlow)"
          className="glowing-lines-flow-2"
        />

        {/* Base Path 4 */}
        <path
          ref={path4Ref}
          d="M0 190 Q300 110 680 150 T1440 115"
          stroke="url(#glowingLineGrad3)"
          strokeWidth="1.2"
          opacity="0.3"
          filter="url(#softGlow)"
        />
        {/* Glow Flow Path 4 */}
        <path
          ref={path4GlowRef}
          d="M0 190 Q300 110 680 150 T1440 115"
          stroke="url(#glowingLineGrad3)"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#softGlow)"
          className="glowing-lines-flow-3"
        />

        <circle ref={circle1Ref} cx="520" cy="98" r="2.5" fill="#00C8FF" opacity="0.9" filter="url(#softGlow)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle ref={circle2Ref} cx="860" cy="108" r="3" fill="#168CFF" opacity="0.85" filter="url(#softGlow)">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle ref={circle3Ref} cx="1120" cy="118" r="2" fill="#00C8FF" opacity="0.8" filter="url(#softGlow)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}


const processSteps = [
  {
    number: '01',
    title: 'Discovery & Strategy',
    subtitle: 'Requirements & Architecture',
    text: 'Understanding your business goals, user flows, technical specifications, and planning the optimal architecture for web or mobile.',
    icon: FolderKanban,
    highlights: ['Requirement Analysis', 'Tech Stack Selection', 'Milestone Roadmapping'],
  },
  {
    number: '02',
    title: 'UI/UX & Prototyping',
    subtitle: 'Design & Visual Flow',
    text: 'Designing modern, responsive interfaces with clean typography, intuitive user interactions, and pixel-perfect screen layouts.',
    icon: Palette,
    highlights: ['Clean Wireframing', 'Responsive UI Design', 'User-Centered Flows'],
  },
  {
    number: '03',
    title: 'Agile Development',
    subtitle: 'Clean Code & Cloud APIs',
    text: 'Building scalable applications using React, React Native, and Expo, seamlessly integrating Firebase Firestore, Auth, and RESTful APIs.',
    icon: Code2,
    highlights: ['React / React Native', 'Firebase Cloud Sync', 'Clean Component Architecture'],
  },
  {
    number: '04',
    title: 'Testing & Deployment',
    subtitle: 'QA, APK Builds & Launch',
    text: 'Cross-platform testing on Android & web devices, bundle optimization, building standalone production APKs, and smooth live deployment.',
    icon: Rocket,
    highlights: ['Device QA Testing', 'Production APK Build', 'Post-Launch Support'],
  },
];

function WorkProcess() {
  return (
    <section className="section-pad process-section" id="process">
      <SectionHeading
        eyebrow="My Workflow"
        title={<>HOW I BRING IDEAS<br /><span>TO REALITY</span></>}
        copy="A structured and transparent 4-step workflow to turn your vision into a scalable, high-performance digital product."
      />

      <div className="process-grid">
        {processSteps.map(({ number, title, subtitle, text, icon: Icon, highlights }) => (
          <article className="process-card reveal" key={number}>
            <div className="process-card-top">
              <div className="process-icon-box">
                <Icon size={22} />
              </div>
              <span className="process-step-num">{number}</span>
            </div>
            <span className="process-subtitle">{subtitle}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <ul className="process-highlights">
              {highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.filterType === filter);

  return (
    <section className="section-pad portfolio-section" id="portfolio">
      <SectionHeading
        eyebrow="Featured projects"
        title={<>SELECTED <span>WORK</span></>}
        copy="A selection of digital products, mobile applications and open-source projects built with care."
      />

      <div className="project-filter-tabs">
        <button
          type="button"
          className={`project-filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Projects ({projects.length})
        </button>
        <button
          type="button"
          className={`project-filter-tab ${filter === 'mobile' ? 'active' : ''}`}
          onClick={() => setFilter('mobile')}
        >
          Mobile Apps ({projects.filter(p => p.filterType === 'mobile').length})
        </button>
        <button
          type="button"
          className={`project-filter-tab ${filter === 'web' ? 'active' : ''}`}
          onClick={() => setFilter('web')}
        >
          Web &amp; APIs ({projects.filter(p => p.filterType === 'web').length})
        </button>
      </div>

      <div className="project-grid">
        {filteredProjects.map(({ number, title, category, text, tags, tone, icon: Icon, image, link, linkText, github }) => {
          const primaryLink = link || github;

          return (
            <article className={`project-card ${tone}`} key={number}>
              <div className="project-preview">
                {image ? (
                  <div className="project-preview-image-wrap">
                    <img src={image} alt={title} className="project-preview-img" loading="lazy" />
                    <div className="project-preview-glow" />
                  </div>
                ) : (
                  <>
                    <div className="preview-lines" />
                    <div className="preview-window"><div /><div /><div /></div>
                    <div className="preview-icon"><Icon size={27} /></div>
                  </>
                )}
                <span className="project-index">{number}</span>
              </div>
              <div className="project-info">
                <div>
                  {category && <span className="project-category">{category}</span>}
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>

                {primaryLink ? (
                  <a
                    href={primaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${title}`}
                    className="project-corner-link"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                ) : (
                  <a href="#contact" aria-label={`View ${title}`} className="project-corner-link">
                    <ArrowUpRight size={20} />
                  </a>
                )}

                <div className="tags">
                  {tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>

                <div className="project-actions">
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-cta-button"
                      aria-label={`${linkText || 'View Project'} for ${title}`}
                    >
                      {link.includes('download') ? <Download size={13} /> : <ExternalLink size={13} />}
                      <span>{linkText || 'Live Demo'}</span>
                    </a>
                  )}
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-github-btn"
                      aria-label={`View GitHub source code for ${title}`}
                    >
                      <GithubIcon width={13} height={13} />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Technologies() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-pad tech-section" ref={sectionRef}>
      <SectionHeading eyebrow="My toolkit" title={<>TECHNOLOGIES I<br /><span>WORK WITH</span></>} />
      <div className={`tech-grid ${revealed ? 'revealed' : ''}`}>
        {technologies.map(([name, mark, kind], index) => (
          <div
            className={`tech-card ${kind}`}
            key={name}
            style={{ '--tech-idx': index }}
          >
            <b>{mark}</b>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseMe() { const items = [['01', 'Clean & Modern Design', 'Every detail has a reason. Nothing gets in the way of the experience.'], ['02', 'Responsive Development', 'Thoughtful layouts that feel right on every screen and every device.'], ['03', 'Performance Focused', 'Fast, reliable digital products that respect your usersâ€™ time.'], ['04', 'User-Centered Experience', 'Technology is only useful when it makes someoneâ€™s day easier.']]; return <section className="section-pad why-section"><SectionHeading eyebrow="The difference" title={<>WHY WORK<br /><span>WITH ME?</span></>} /><div className="why-grid">{items.map(([num, title, text]) => <article key={num}><span>{num}</span><Check size={18} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>; }

function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSent(false);
    setErrorMsg('');

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const name = (formData.get('name')?.toString() || '').trim();
    const email = (formData.get('email')?.toString() || '').trim();
    const subject = (formData.get('subject')?.toString() || '').trim();
    const message = (formData.get('message')?.toString() || '').trim();

    // Client-side validation
    if (!name) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!email || !validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!subject) {
      setErrorMsg('Please enter a subject.');
      return;
    }
    if (!message) {
      setErrorMsg('Please enter your message.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save to Firebase Firestore
      const firestorePromise = addDoc(collection(db, 'contactMessages'), {
        name,
        email,
        subject,
        message,
        createdAt: serverTimestamp(),
      }).catch((fsErr) => {
        console.error('Firestore save notice:', fsErr);
      });

      // 2. Submit to Web3Forms API
      const web3FormsPromise = fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'c0a3c477-bb8a-46a7-ba81-034a303b4c1a',
          name,
          email,
          subject: `New Portfolio Contact â€” ${subject}`,
          message,
          from_name: name,
        }),
      }).then((res) => res.json());

      const [, web3Result] = await Promise.all([firestorePromise, web3FormsPromise]);

      if (web3Result && web3Result.success) {
        setSent(true);
        formEl.reset();
      } else {
        console.error('Web3Forms error response:', web3Result);
        setErrorMsg(web3Result?.message || 'Failed to send message. Please try again.');
        setSent(false);
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setErrorMsg('Failed to send message. Please try again.');
      setSent(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner section-pad">
        <div className="contact-copy">
          <SectionHeading
            eyebrow="Have a project in mind?"
            title={<>LET'S BUILD<br /><span>SOMETHING GREAT</span></>}
            copy="Have an idea, project or business website in mind? Let's turn your idea into reality."
          />
          <div className="contact-details">
            <a href="mailto:farmanadil500@gmail.com"><Mail size={17} /> farmanadil500@gmail.com</a>
            <a
              href="https://wa.me/923496506743?text=Hi%20Farman,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-whatsapp-link"
            >
              <WhatsappIcon width={17} height={17} /> Chat on WhatsApp (+92 3496506743)
            </a>
            <a href="tel:+923496506743"><Phone size={17} /> +92 3496506743</a>
            <span><Globe2 size={17} /> Pakistan / Worldwide</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="access_key" value="c0a3c477-bb8a-46a7-ba81-034a303b4c1a" />
          <label>Name<input name="name" required placeholder="Your name" disabled={submitting} /></label>
          <label>Email<input name="email" type="email" required placeholder="you@company.com" disabled={submitting} /></label>
          <label>Subject<input name="subject" required placeholder="How can I help?" disabled={submitting} /></label>
          <label>Message<textarea name="message" required placeholder="Tell me a little about your project..." rows="4" disabled={submitting} /></label>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : sent ? <>Message sent <Check size={17} /></> : <>Send message <Send size={16} /></>}
          </button>
          {sent && <p className="form-success">Message sent successfully! I'll get back to you soon.</p>}
          {errorMsg && <p className="form-error">{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
}


function Footer({ onOpenCv }) {
  return (
    <footer>
      <div className="footer-inner">
        <Logo />
        <p>
          Building modern digital experiences<br />
          and turning ideas into reality.
        </p>
        <div className="socials">
          <a href="https://github.com/farmanadil500-debug" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a href="https://www.linkedin.com/in/farman-adil-17b0903a4/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a
            href="https://wa.me/923496506743?text=Hi%20Farman,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="social-whatsapp"
          >
            <WhatsappIcon width={17} height={17} />
          </a>
          <a href="mailto:farmanadil500@gmail.com" aria-label="Email">
            <Mail size={17} />
          </a>
        </div>
        <div className="footer-nav">
          {['Home', 'Services', 'Portfolio', 'About', 'Experience', 'Contact'].map(item => (
            <a href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
          {onOpenCv && (
            <button
              type="button"
              className="footer-cv-btn"
              onClick={onOpenCv}
            >
              CV / Resume
            </button>
          )}
        </div>
        <small>Â© {new Date().getFullYear()} Farman Adil. All rights reserved.</small>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <aside className="floating-whatsapp-container" aria-label="WhatsApp quick contact">
      <a
        href="https://wa.me/923496506743?text=Hi%20Farman,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Chat on WhatsApp (+92 3496506743)"
      >
        <span className="floating-whatsapp-pulse" aria-hidden="true" />
        <WhatsappIcon width={28} height={28} />
        <span className="floating-whatsapp-tooltip">Chat with Farman</span>
      </a>
    </aside>
  );
}

function App() {
  const [cvOpen, setCvOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('section, .service-card, .process-card, .project-card, .why-grid article, .about-heading, .about-profile-visual, .about-skill-badge, .experience-card').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar onOpenCv={() => setCvOpen(true)} />
      <main>
        <Hero onOpenCv={() => setCvOpen(true)} />
        <Services />
        <WorkProcess />
        <Portfolio />
        <About />
        <Experience />
        <Technologies />
        <WhyChooseMe />
        <GlowingBottomLines />
        <Contact />
      </main>
      <Footer onOpenCv={() => setCvOpen(true)} />
      <FloatingWhatsApp />
      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);

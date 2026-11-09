import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, ArrowUpRight, ArrowUp, Copy, ChevronDown, ChevronLeft, ChevronRight, Braces, Check, Code2, Download, ExternalLink, Eye, FileText,
  Flame, Globe2, GitBranch, Layers3, Loader2, Mail, Menu, MessageCircle, Monitor, Palette, Phone,
  Rocket, Send, Server, Smartphone, Sparkles, Users, Briefcase, FolderKanban, X, Zap, ZoomIn, ZoomOut,
  GraduationCap, Award, BookOpen, Calendar, MapPin, CheckCircle2
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
    appStore: 'https://apps.apple.com/pk/app/darzi-tailor-shop-manager/id6809124751',
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


const ReactIcon = (props) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="26" height="26" fill="none" {...props}>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const ReactNativeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="3" stroke="#61DAFB" strokeWidth="1.5" />
    <circle cx="12" cy="18" r="1.1" fill="#61DAFB" />
    <ellipse cx="12" cy="10" rx="5" ry="2" stroke="#61DAFB" strokeWidth="1" />
    <ellipse cx="12" cy="10" rx="5" ry="2" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 12 10)" />
    <ellipse cx="12" cy="10" rx="5" ry="2" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 12 10)" />
    <circle cx="12" cy="10" r="1" fill="#61DAFB" />
  </svg>
);

const JavaScriptIcon = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" {...props}>
    <rect width="24" height="24" rx="4" fill="#F7DF1E" />
    <text x="12" y="17.5" fill="#000000" fontSize="11" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="0.5">JS</text>
  </svg>
);

const Html5Icon = (props) => (
  <img src="/html5.svg" alt="HTML5" width="26" height="26" style={{ objectFit: 'contain', display: 'block' }} {...props} />
);

const Css3Icon = (props) => (
  <img src="/css3.svg" alt="CSS3" width="26" height="26" style={{ objectFit: 'contain', display: 'block' }} {...props} />
);

const FirebaseIcon = (props) => (
  <svg viewBox="0 0 24 24" width="25" height="25" fill="none" {...props}>
    <path d="M4.5 18.8L6.8 4.2C6.9 3.5 7.9 3.3 8.3 3.9L11.5 9.7L7.6 17L4.5 18.8Z" fill="#FFA000" />
    <path d="M4.5 18.8L11.5 22.6C11.8 22.8 12.2 22.8 12.5 22.6L19.5 18.8L17.5 7.1C17.4 6.4 16.5 6.2 16.1 6.8L4.5 18.8Z" fill="#F57C00" />
    <path d="M12.4 12.8L14.7 8.3C15 7.7 15.9 7.7 16.2 8.3L19.5 18.8L12.4 12.8Z" fill="#FFCA28" />
  </svg>
);

const NodeIcon = (props) => (
  <img src="/nodejs.svg" alt="Node.js" width="26" height="26" style={{ objectFit: 'contain', display: 'block' }} {...props} />
);

const ExpressIcon = (props) => (
  <img src="/express.svg" alt="Express.js" width="26" height="26" style={{ objectFit: 'contain', display: 'block' }} {...props} />
);

const MongoIcon = (props) => (
  <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" color="#47A248" {...props}>
    <path d="M12 0C11.7 0 11.5.2 11.4.4C10.5 2.5 6.5 10.7 6.5 14.8C6.5 18.7 9 22.3 11.8 23.9C11.9 24 12 24 12 24C12 24 12.1 24 12.2 23.9C15 22.3 17.5 18.7 17.5 14.8C17.5 10.7 13.5 2.5 12.6.4C12.5.2 12.3 0 12 0ZM12 21.6C10.3 20.3 8.3 17.6 8.3 14.8C8.3 11.9 11 5.7 12 3.4V21.6Z" />
  </svg>
);

const GitIcon = (props) => (
  <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" color="#F05032" {...props}>
    <path d="M23.3 10.9L13.1.7C12.2-.2 10.8-.2 9.9.7L8 2.6L10.4 5C11.1 4.7 12 4.9 12.5 5.5C13.1 6.1 13.2 7 12.9 7.7L15.2 10C15.9 9.7 16.8 9.9 17.4 10.5C18.2 11.3 18.2 12.6 17.4 13.4C16.6 14.2 15.3 14.2 14.5 13.4C13.9 12.8 13.7 12 14 11.2L11.8 9C11.6 9.1 11.3 9.1 11.1 9.1C10.5 9.1 10 8.8 9.6 8.4L7.3 10.7C7.6 11.4 7.4 12.3 6.8 12.9C6.1 13.6 4.9 13.6 4.2 12.9C3.5 12.2 3.5 11 4.2 10.3C4.8 9.6 5.8 9.5 6.5 9.9L8.8 7.6C8.7 7.4 8.7 7.1 8.7 6.9C8.7 6.3 9 5.8 9.4 5.4L7.1 3.1.7 9.5C-.2 10.4-.2 11.8.7 12.7L10.9 22.9C11.8 23.8 13.2 23.8 14.1 22.9L23.3 13.7C24.2 12.8 24.2 11.8 23.3 10.9Z" />
  </svg>
);

const RestApiIcon = (props) => (
  <img src="/restapi.svg" alt="REST API" width="26" height="26" style={{ objectFit: 'contain', display: 'block' }} {...props} />
);

const technologies = [
  ['React', ReactIcon, 'react'],
  ['React Native', ReactNativeIcon, 'native'],
  ['JavaScript', JavaScriptIcon, 'js'],
  ['HTML5', Html5Icon, 'html'],
  ['CSS3', Css3Icon, 'css'],
  ['Firebase', FirebaseIcon, 'firebase'],
  ['Node.js', NodeIcon, 'node'],
  ['Express.js', ExpressIcon, 'express'],
  ['MongoDB', MongoIcon, 'mongo'],
  ['Git', GitIcon, 'git'],
  ['GitHub', (props) => <GithubIcon width={24} height={24} {...props} />, 'github'],
  ['REST API', RestApiIcon, 'api'],
];


const BrandTitle = () => (
  <span>
    <strong className="brand-name">
      {'Farman Adil'.split('').map((char, i, arr) => (
        <span
          key={i}
          className="brand-letter"
          style={{ '--char-idx-rtl': arr.length - 1 - i }}
        >
          {char === ' ' ? '\u00A0' : char}
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
}

function ProfilePopup({ isOpen, onClose, onNavigate, onOpenCv }) {
  const popupRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState('Frontend & React Native Developer');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRoleIndex(0);
      setTypedRole('Frontend & React Native Developer');
      setIsDeleting(false);
      return;
    }

    const roles = [
      'Frontend & React Native Developer',
      'Frontend Developer',
      'React Native Developer',
    ];

    const currentText = roles[roleIndex % roles.length];
    let timer;

    if (!isDeleting) {
      if (typedRole.length < currentText.length) {
        timer = setTimeout(() => {
          setTypedRole(currentText.slice(0, typedRole.length + 1));
        }, 60);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1600);
      }
    } else {
      if (typedRole.length > 0) {
        timer = setTimeout(() => {
          setTypedRole(currentText.slice(0, typedRole.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [isOpen, typedRole, isDeleting, roleIndex]);

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
          <span className="profile-popup-role">
            <span className="profile-popup-role-text">{typedRole}</span>
            <span className="profile-popup-role-cursor" aria-hidden="true">|</span>
          </span>
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
  const moreRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef(null);
  const dropdownIds = ['process', 'education', 'testimonials', 'pricing', 'faq'];
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const links = [
    ['Home', 'home'],
    ['Services', 'services'],
    ['Portfolio', 'portfolio'],
    ['Case Study', 'case-study'],
    ['About', 'about'],
    ['Experience', 'experience'],
    ['Contact', 'contact'],
  ];
  const dropdownLinks = [
    { label: 'Process', id: 'process', icon: Sparkles, desc: 'How I work' },
    { label: 'Education', id: 'education', icon: GraduationCap, desc: 'Academic & technical background' },
    { label: 'Testimonials', id: 'testimonials', icon: MessageCircle, desc: 'Client reviews' },
    { label: 'Pricing', id: 'pricing', icon: Zap, desc: 'Packages & rates' },
    { label: 'FAQ', id: 'faq', icon: FileText, desc: 'Common questions' },
  ];

  useEffect(() => {
    const sectionIds = ['home', 'services', 'process', 'portfolio', 'case-study', 'about', 'experience', 'education', 'testimonials', 'pricing', 'faq', 'contact'];

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
    const activeEl = dropdownIds.includes(activeSection) ? moreRef.current : linkRefs.current[activeSection];
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
      if (e.key === 'Escape') setDropdownOpen(false);
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
    setDropdownOpen(false);
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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAvatarClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
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
          <div
            className="nav-dropdown"
            onMouseEnter={() => {
              if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
              setDropdownOpen(true);
            }}
            onMouseLeave={() => {
              dropdownTimerRef.current = setTimeout(() => {
                setDropdownOpen(false);
              }, 180);
            }}
          >
            <button
              type="button"
              ref={moreRef}
              className={`nav-dropdown-button ${dropdownIds.includes(activeSection) ? 'active' : ''} ${dropdownOpen ? 'expanded' : ''}`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span>More</span>
              <ChevronDown size={14} className={`nav-dropdown-chevron ${dropdownOpen ? 'rotate' : ''}`} />
            </button>
            <div
              className={`nav-dropdown-menu ${dropdownOpen ? 'open' : ''}`}
              onMouseEnter={() => {
                if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
                setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimerRef.current = setTimeout(() => {
                  setDropdownOpen(false);
                }, 180);
              }}
            >
              {dropdownLinks.map(({ label, id, icon: ItemIcon, desc }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`nav-dropdown-item ${activeSection === id ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, id)}
                >
                  <span className="nav-dropdown-item-icon">
                    <ItemIcon size={15} />
                  </span>
                  <div className="nav-dropdown-item-text">
                    <span className="nav-dropdown-item-title">{label}</span>
                    <span className="nav-dropdown-item-desc">{desc}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
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
  const cvPath = '/Farman_Adil_CV_HD.jpg';
  const imgPath = '/Farman_Adil_CV_HD.jpg';
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setZoomLevel(1);
      setIsLoaded(false);
      return;
    }

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
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
    setIsLoaded(true);
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
                  Farman Adil — CV <span className="cv-modal-badge">Full HD</span>
                </div>
                <div className="cv-modal-subtitle">Direct Preview · React Native &amp; Frontend Developer</div>
              </div>
            </div>

            <button
              type="button"
              className="cv-action-btn cv-action-close cv-mobile-close"
              onClick={onClose}
              aria-label="Close CV preview"
              title="Close (Esc)"
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
              href={cvPath}
              download="Farman_Adil_CV_HD.jpg"
              className="cv-action-btn cv-action-download"
              title="Download CV to your device"
            >
              <Download size={14} />
              <span>Download CV</span>
            </a>

            <a
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-action-btn cv-action-tab"
              title="Open full CV in a new tab"
            >
              <ExternalLink size={14} />
              <span>Fullscreen Tab</span>
            </a>

            <button
              type="button"
              className="cv-action-btn cv-action-close cv-desktop-close"
              onClick={onClose}
              aria-label="Close CV preview"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="cv-modal-body">
          <div className={`cv-modal-loader ${isLoaded ? 'is-hidden' : ''}`} aria-live="polite">
            <div className="cv-loader-spinner-wrapper">
              <div className="cv-loader-ring" />
              <div className="cv-loader-glow" />
              <Loader2 size={34} className="cv-loader-spinner" />
            </div>
            <h3 className="cv-loader-title">Loading Curriculum Vitae...</h3>
            <p className="cv-loader-desc">Preparing High-Definition Document (HD) · Please wait</p>
            <div className="cv-loader-progress-track">
              <div className="cv-loader-progress-bar" />
            </div>
          </div>

          <div className={`cv-image-scroll-wrapper ${isLoaded ? 'is-loaded' : 'is-loading'}`}>
            <div
              className="cv-image-container"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                ref={imgRef}
                src={imgPath}
                alt="Farman Adil — Curriculum Vitae HD"
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
            Viewing CV in Crystal HD. Click <strong>Download CV</strong> to save a local copy.
          </span>
          <div className="cv-modal-footer-links">
            <a href={cvPath} download="Farman_Adil_CV_HD.jpg" className="cv-footer-link">
              <Download size={13} /> Save CV
            </a>
            <span className="cv-footer-dot">·</span>
            <a href={cvPath} target="_blank" rel="noopener noreferrer" className="cv-footer-link">
              <ExternalLink size={13} /> Open Tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountUpMetric({ target, suffix = '', prefix = '', decimals = 0, duration = 2800, delay = 400 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let timeoutId;
    let animId;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      timeoutId = setTimeout(() => {
        const startTime = performance.now();
        const frame = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Smooth easeOutCubic: gradual, steady, clearly visible roll
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentVal = ease * target;
          setCount(currentVal);

          if (progress < 1) {
            animId = requestAnimationFrame(frame);
          } else {
            setCount(target);
          }
        };
        animId = requestAnimationFrame(frame);
      }, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [target, duration, delay]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);

  return (
    <span ref={elementRef} className="hero-metric-number count-up-animated">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

function Hero({ onOpenCv }) {
  const rotatingWords = [
    'DIGITAL SOLUTIONS',
    'MOBILE APPS',
    'WEB PLATFORMS',
    'REACT NATIVE APPS',
    'FULL-STACK APPS',
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsExiting(false);
      }, 360);
    }, 2900);

    return () => clearInterval(timer);
  }, [rotatingWords.length]);

  return (
    <section className="hero section-pad" id="home">
      <div className="hero-copy">
        <div className="availability"><span /> Available for freelance</div>
        <h1>
          WE BUILD<br />
          <span className="hero-rotating-container">
            <span
              key={wordIndex}
              className={`hero-rotating-word ${isExiting ? 'is-exiting' : 'is-entering'}`}
            >
              {rotatingWords[wordIndex]}
            </span>
          </span>
        </h1>
        <p className="hero-lead">Modern websites. Powerful apps.<br />Endless possibilities.</p>
        <p className="hero-trust-line">
          Based in Khwazakhela, Swat, Pakistan <span className="hero-trust-dot">·</span> Working Worldwide
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#contact">Get started <ArrowRight size={16} /></a>
          <a className="button ghost" href="#portfolio">View portfolio <ArrowUpRight size={16} /></a>
          <button
            type="button"
            className="button ghost button-cv"
            onClick={onOpenCv}
            aria-label="View Farman Adil CV"
          >
            View CV <Eye size={16} />
          </button>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric-item">
            <CountUpMetric target={3} suffix="+" duration={2600} delay={350} />
            <span className="hero-metric-label">Projects Delivered</span>
          </div>
          <div className="hero-metric-item">
            <CountUpMetric target={1} suffix="+" duration={2200} delay={450} />
            <span className="hero-metric-label">Years Experience</span>
          </div>
          <div className="hero-metric-item">
            <CountUpMetric target={100} suffix="%" duration={3200} delay={300} />
            <span className="hero-metric-label">On-Time Delivery</span>
          </div>
          <div className="hero-metric-item">
            <CountUpMetric target={5.0} decimals={1} suffix=" ★" duration={2900} delay={400} />
            <span className="hero-metric-label">Client Rating</span>
          </div>
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
  { name: 'React Native', icon: Smartphone },
  { name: 'React', icon: Sparkles },
  { name: 'JavaScript', icon: Zap },
  { name: 'HTML5', icon: Code2 },
  { name: 'CSS3', icon: Palette },
  { name: 'Firebase', icon: Flame },
  { name: 'Git', icon: GitBranch },
  { name: 'Responsive Design', icon: Layers3 },
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
        {/* Left — Profile Photo */}
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
              alt="Farman Adil — Software Developer"
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

        {/* Right — About Content */}
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
          <p className="about-location">Based in Khwazakhela, Swat, Pakistan — working worldwide.</p>
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
    company: 'TechNext96',
    companyUrl: 'https://technext96.com/',
    period: '2026 — Present',
    current: true,
    type: 'Full-time · Team Environment',
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
    period: '2025 — 2026',
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
                    {exp.companyUrl ? (
                      <a className="experience-company" href={exp.companyUrl} target="_blank" rel="noopener noreferrer">{exp.company}</a>
                    ) : (
                      <span className="experience-company">{exp.company}</span>
                    )}
                    <span className="experience-dot">·</span>
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

const educationList = [
  {
    degree: 'Bachelor of Science in Information Technology (BSIT)',
    institution: 'University of Swat',
    institutionUrl: 'https://uswat.edu.pk/',
    period: '2025 — 2029',
    status: 'In Progress · 3rd Semester',
    current: true,
    location: 'Swat, Khyber Pakhtunkhwa',
    icon: GraduationCap,
    description: 'Pursuing a comprehensive four-year BS degree emphasizing modern computing principles, systems architecture, object-oriented design, algorithms, and practical software engineering.',
    highlights: [
      'Currently in 3rd Semester with dedicated focus on core software and system engineering',
      'Studying Object-Oriented Programming (OOP), Data Structures, Algorithms, and Relational Databases',
      'Directly bridging academic theory with production cross-platform mobile and web applications',
    ],
    tags: ['BSIT', 'University of Swat', 'OOP', 'Data Structures', 'Database Systems', 'Software Engineering'],
  },
  {
    degree: 'Diploma in Information Technology (DIT)',
    institution: 'Khyber Computer & Vocational College (KCVC), Khwazakhela',
    period: '2023 — 2024',
    status: 'Completed · 1-Year Diploma',
    current: false,
    location: 'Khwazakhela, Khyber Pakhtunkhwa',
    icon: BookOpen,
    description: 'Completed an intensive 1-year professional diploma covering computer fundamentals, programming logic, relational databases (DBMS), web development, and hardware architecture.',
    highlights: [
      'Hands-on practical training in software fundamentals, databases, and programming logic',
      'Built practical assignments in web layout design and database record management',
      'Formed solid technical foundation leading directly into BS Information Technology and software development',
    ],
    tags: ['DIT (1 Year)', 'KCVC Khwazakhela', 'Programming Fundamentals', 'DBMS & SQL', 'Web Design'],
  },
  {
    degree: 'Higher Secondary School Certificate (HSSC)',
    institution: 'Board of Intermediate & Secondary Education',
    period: 'Completed',
    status: 'Pre-Medical Science',
    current: false,
    location: 'Khyber Pakhtunkhwa, Pakistan',
    icon: Award,
    description: 'Completed higher secondary education in Pre-Medical sciences, developing strong disciplined problem-solving methodologies, mathematical logic, and analytical skills.',
    highlights: [
      'Cultivated disciplined analytical problem-solving habits and rigorous scientific reasoning',
      'Leveraged analytical mindset to transition effectively into Information Technology & Software Engineering',
    ],
    tags: ['HSSC', 'Pre-Medical', 'Analytical Rigor', 'Problem Solving'],
  },
];

const certificationsList = [
  {
    title: 'React Native & Mobile App Engineering',
    issuer: 'Production Applied Track',
    badge: 'Production Proven',
    period: '2025 — Present',
    icon: Smartphone,
    description: 'Architecture and delivery of production-grade cross-platform iOS and Android applications with offline persistence, real-time sync, and scalable component structure.',
    highlights: [
      'Production mobile app deployed to live users (Darzi Tailor Shop Manager on Google Drive & App Store)',
      'Cross-platform UI/UX, Expo CLI, EAS cloud builds, and mobile performance optimization',
    ],
    skills: ['React Native', 'Expo EAS', 'Mobile UI/UX', 'Cross-Platform', 'Mobile Performance'],
  },
  {
    title: 'Modern Frontend & React Ecosystem',
    issuer: 'Frontend Architecture Track',
    badge: 'Core Competency',
    period: '2024 — Present',
    icon: Braces,
    description: 'Mastery of modern JavaScript (ES6+), React.js component hierarchies, responsive layout design, state management, and asynchronous REST API integration.',
    highlights: [
      'Engineered interactive, responsive, and cross-browser accessible web interfaces',
      'Applied modular architecture, clean code practices, and fast Vite-powered pipelines',
    ],
    skills: ['React.js', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'REST APIs', 'Git'],
  },
  {
    title: 'Cloud Database Architecture & Firebase',
    issuer: 'Cloud Backend Track',
    badge: 'Cloud Integration',
    period: '2025 — Present',
    icon: Server,
    description: 'Integration of real-time cloud backends, NoSQL database schema design in Cloud Firestore, granular security rules, and user authentication.',
    highlights: [
      'Architected real-time client record syncing and secure multi-client rules',
      'Implemented seamless offline caching and live snapshot listeners',
    ],
    skills: ['Cloud Firestore', 'Firebase Auth', 'NoSQL Modeling', 'Security Rules', 'Cloud Sync'],
  },
];

function Education() {
  return (
    <section className="section-pad education-section" id="education">
      <SectionHeading
        eyebrow="Academic & Technical Background"
        title={<>EDUCATION & <span>CREDENTIALS</span></>}
        copy="Academic qualifications in Information Technology paired with specialized technical training and practical engineering."
      />

      <div className="education-grid">
        {/* Left Column: Academic Degrees */}
        <div className="education-column">
          <div className="education-column-header">
            <div className="education-column-icon">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="education-column-title">Academic Qualifications</h3>
              <p className="education-column-subtitle">University degree & technical diploma</p>
            </div>
          </div>

          <div className="education-cards-stack">
            {educationList.map((item, idx) => (
              <article className="education-card" key={item.degree + idx}>
                <div className="education-card-top">
                  <div className="education-card-badge-row">
                    <span className={`education-status-badge ${item.current ? 'is-active' : ''}`}>
                      {item.current && <span className="education-active-pulse" aria-hidden="true" />}
                      {item.status}
                    </span>
                    <span className="education-period-badge">
                      <Calendar size={12} /> {item.period}
                    </span>
                  </div>
                  <h4 className="education-degree-title">{item.degree}</h4>
                  <div className="education-inst-row">
                    {item.institutionUrl ? (
                      <a href={item.institutionUrl} target="_blank" rel="noopener noreferrer" className="education-inst-link">
                        {item.institution} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="education-inst-name">{item.institution}</span>
                    )}
                    <span className="education-inst-dot">·</span>
                    <span className="education-inst-location">
                      <MapPin size={12} /> {item.location}
                    </span>
                  </div>
                </div>

                <p className="education-card-desc">{item.description}</p>

                <ul className="education-highlights">
                  {item.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <div className="education-tags">
                  {item.tags.map(tag => (
                    <span key={tag} className="education-tag">{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Specializations & Applied Credentials */}
        <div className="education-column">
          <div className="education-column-header">
            <div className="education-column-icon specialization">
              <Award size={20} />
            </div>
            <div>
              <h3 className="education-column-title">Technical Specializations</h3>
              <p className="education-column-subtitle">Applied engineering & production tracks</p>
            </div>
          </div>

          <div className="education-cards-stack">
            {certificationsList.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <article className="education-card specialization-card" key={item.title + idx}>
                  <div className="education-card-top">
                    <div className="education-card-badge-row">
                      <span className="education-status-badge cert-badge">
                        <CheckCircle2 size={12} /> {item.badge}
                      </span>
                      <span className="education-period-badge">
                        <Calendar size={12} /> {item.period}
                      </span>
                    </div>
                    <div className="education-cert-head">
                      <div className="education-cert-icon">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h4 className="education-degree-title">{item.title}</h4>
                        <span className="education-inst-name">{item.issuer}</span>
                      </div>
                    </div>
                  </div>

                  <p className="education-card-desc">{item.description}</p>

                  <ul className="education-highlights">
                    {item.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>

                  <div className="education-tags">
                    {item.skills.map(skill => (
                      <span key={skill} className="education-tag">{skill}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
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

function ProjectMockupVisual({ project }) {
  const { number, title, image } = project;

  if (number === '01') {
    return (
      <div className="mockup-wrap phone-mockup darzi-mockup">
        <div className="mockup-phone-frame">
          <div className="mockup-phone-notch" />
          <div className="mockup-phone-screen">
            <div className="mockup-darzi-logo-ring">
              <img src={image} alt={title} className="mockup-darzi-img" loading="lazy" />
            </div>
            <div className="mockup-darzi-meta">
              <span className="mockup-app-title">Darzi Shop Manager</span>
              <span className="mockup-app-sub">Tailor Customer &amp; Khata App</span>
              <div className="mockup-darzi-pills">
                <span className="mockup-pill emerald">✓ Standalone APK</span>
                <span className="mockup-pill blue">App Store</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (number === '02') {
    return (
      <div className="mockup-wrap browser-mockup weather-mockup">
        <div className="mockup-browser-head">
          <div className="mockup-dots"><span /><span /><span /></div>
          <div className="mockup-url-bar">weather-forecast.dev</div>
        </div>
        <div className="mockup-browser-body weather-body">
          <div className="weather-header-row">
            <div>
              <span className="weather-big-temp">24°C</span>
              <span className="weather-condition">Sunny · Clear Sky</span>
            </div>
            <div className="weather-sun-glow">
              <div className="sun-core" />
              <div className="sun-pulse" />
            </div>
          </div>
          <div className="weather-loc-badge">📍 Swat Valley, Pakistan</div>
          <div className="weather-metrics-row">
            <span className="weather-stat-chip">💧 48% Humidity</span>
            <span className="weather-stat-chip">💨 12 km/h</span>
            <span className="weather-stat-chip">☀️ UV 4</span>
          </div>
        </div>
      </div>
    );
  }

  if (number === '03') {
    return (
      <div className="mockup-wrap browser-mockup market-mockup">
        <div className="mockup-browser-head">
          <div className="mockup-dots"><span /><span /><span /></div>
          <div className="mockup-url-bar">market-store.app/shop</div>
        </div>
        <div className="mockup-browser-body market-body">
          <div className="market-top-row">
            <div className="market-search-pill">🔍 Search items...</div>
            <span className="market-cart-badge">🛒 Cart (3)</span>
          </div>
          <div className="market-items-grid">
            <div className="market-mini-card">
              <div className="market-mini-thumb blue-grad" />
              <div className="market-mini-info">
                <span className="m-title">Tech Gear Pro</span>
                <span className="m-price">$49.00</span>
              </div>
            </div>
            <div className="market-mini-card">
              <div className="market-mini-thumb cyan-grad" />
              <div className="market-mini-info">
                <span className="m-title">Smart Pods</span>
                <span className="m-price">$120.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (number === '04') {
    return (
      <div className="mockup-wrap browser-mockup portfolio-mockup">
        <div className="mockup-browser-head">
          <div className="mockup-dots"><span /><span /><span /></div>
          <div className="mockup-url-bar">farman-6fdb2.web.app</div>
        </div>
        <div className="mockup-browser-body portfolio-body">
          <div className="pf-hero-snippet">
            <span className="pf-status-badge"><span className="pf-dot" /> LIVE PLATFORM</span>
            <span className="pf-headline">WE BUILD DIGITAL SOLUTIONS</span>
          </div>
          <div className="pf-code-box">
            <span className="code-kw">const</span> <span className="code-id">dev</span> = <span className="code-str">"Farman Adil"</span>;
            <br />
            <span className="code-kw">const</span> <span className="code-id">stack</span> = [<span className="code-str">"React"</span>, <span className="code-str">"React Native"</span>];
          </div>
        </div>
      </div>
    );
  }

  if (number === '05') {
    return (
      <div className="mockup-wrap browser-mockup meer-mockup">
        <div className="mockup-browser-head">
          <div className="mockup-dots"><span /><span /><span /></div>
          <div className="mockup-url-bar">meer-software.io/dashboard</div>
        </div>
        <div className="mockup-browser-body meer-body">
          <div className="meer-metrics-row">
            <div className="meer-stat-box"><small>Users</small><strong>1,248</strong></div>
            <div className="meer-stat-box"><small>Uptime</small><strong className="cyan">99.9%</strong></div>
            <div className="meer-stat-box"><small>Speed</small><strong className="emerald">0.4s</strong></div>
          </div>
          <div className="meer-chart-bars">
            <span style={{ height: '35%' }} />
            <span style={{ height: '55%' }} />
            <span style={{ height: '42%' }} />
            <span style={{ height: '78%' }} className="active" />
            <span style={{ height: '65%' }} />
            <span style={{ height: '90%' }} className="peak" />
            <span style={{ height: '75%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mockup-wrap phone-mockup proto-mockup">
      <div className="mockup-phone-frame proto-frame">
        <div className="mockup-phone-notch" />
        <div className="mockup-phone-screen proto-screen">
          <div className="proto-head">
            <span className="proto-title">React Native Shell</span>
            <span className="proto-badge">60 FPS</span>
          </div>
          <div className="proto-body">
            <div className="proto-interactive-card">
              <span className="proto-card-glow" />
              <span className="proto-card-txt">Gesture &amp; Navigation Flow</span>
              <div className="proto-progress-track"><div className="proto-progress-fill" /></div>
            </div>
          </div>
          <div className="proto-tabs">
            <span className="proto-tab active" />
            <span className="proto-tab" />
            <span className="proto-tab" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [leaving, setLeaving] = useState(false);
  const handleFilter = (next) => { if (next === filter || leaving) return; setIndicatorFilter(next); setLeaving(true); setTimeout(() => { setFilter(next); setLeaving(false); }, 350); };
  const [indicatorFilter, setIndicatorFilter] = useState('all');
  const filterTabsRef = useRef(null);
  const [filterIndicatorStyle, setFilterIndicatorStyle] = useState({});
  useEffect(() => { const update = () => { const container = filterTabsRef.current; if (!container) return; const btn = container.querySelector('[data-filter="' + indicatorFilter + '"]'); if (btn) setFilterIndicatorStyle({ width: btn.offsetWidth, height: btn.offsetHeight, transform: 'translate(' + btn.offsetLeft + 'px, ' + btn.offsetTop + 'px)' }); }; update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [indicatorFilter]);

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

      <div className="project-filter-tabs" ref={filterTabsRef}>
        <span className="project-filter-indicator" style={filterIndicatorStyle} aria-hidden="true" />
        <button
          type="button"
          data-filter="all" className={`project-filter-tab ${indicatorFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilter('all')}
        >
          All Projects ({projects.length})
        </button>
        <button
          type="button"
          data-filter="mobile" className={`project-filter-tab ${indicatorFilter === 'mobile' ? 'active' : ''}`}
          onClick={() => handleFilter('mobile')}
        >
          Mobile Apps ({projects.filter(p => p.filterType === 'mobile').length})
        </button>
        <button
          type="button"
          data-filter="web" className={`project-filter-tab ${indicatorFilter === 'web' ? 'active' : ''}`}
          onClick={() => handleFilter('web')}
        >
          Web &amp; APIs ({projects.filter(p => p.filterType === 'web').length})
        </button>
      </div>

      <div className={`project-grid ${leaving ? 'leaving' : ''}`} key={filter}>
        {filteredProjects.map(({ number, title, category, text, tags, tone, icon: Icon, image, link, linkText, github, appStore }) => {
          const primaryLink = link || github;

          return (
            <article className={`project-card ${tone}`} key={number}>
              <div className="project-preview">
                <ProjectMockupVisual project={{ number, title, category, image, tone }} />
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
                  {appStore && (
                    <a
                      href={appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-cta-button"
                      aria-label={`View ${title} on the App Store`}
                    >
                      <ExternalLink size={13} />
                      <span>App Store</span>
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

const testimonials = [
  {
    name: 'Muhammad Bilal',
    role: 'Tailor Shop Owner',
    initials: 'MB',
    avatarGradient: 'linear-gradient(135deg, #00d2ff, #0066ff)',
    project: 'Darzi App (Mobile)',
    verified: 'Verified Client',
    quote: 'Darzi App has made measurement tracking and order management much easier for our shop. Everything is organised in one place, and we no longer lose customer details.',
  },
  {
    name: 'Sardar Khan',
    role: 'Web Platform Client',
    initials: 'SK',
    avatarGradient: 'linear-gradient(135deg, #38ef7d, #11998e)',
    project: 'Online Market & Web Apps',
    verified: 'Verified Client',
    quote: 'Farman delivered a fast, fully responsive web application with clean architecture. The user interface is polished and communication throughout the project was seamless.',
  },
  {
    name: 'Rashid Ali',
    role: 'App Store User',
    initials: 'RA',
    avatarGradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    project: 'Darzi App (iOS & Android)',
    verified: 'Verified Client',
    quote: 'A clean and practical app for tailor shops. Customer records and bookings are now simple to manage directly from the phone with instant updates.',
  },
];

const pricingPlans = {
  website: [
    {
      name: 'Basic',
      price: 'PKR 25,000',
      delivery: '1-2 weeks',
      features: ['Up to 5 pages', 'Mobile responsive design', 'Contact form', 'Basic SEO setup', '1 revision round'],
      popular: false,
    },
    {
      name: 'Standard',
      price: 'PKR 50,000',
      delivery: '2-3 weeks',
      features: ['Up to 10 pages', 'Blog / CMS setup', 'Custom animations', 'On-page SEO', '3 revision rounds'],
      popular: true,
    },
    {
      name: 'Premium',
      price: 'PKR 100,000',
      delivery: '4-6 weeks',
      features: ['Custom design & features', 'E-commerce or dashboard', 'API integrations', 'Performance optimisation', '1 month free support'],
      popular: false,
    },
  ],
  app: [
    {
      name: 'Basic',
      price: 'PKR 50,000',
      delivery: '2-3 weeks',
      features: ['Single platform (Android or iOS)', 'Up to 5 screens', 'Core features only', 'Basic UI design', '1 revision round'],
      popular: false,
    },
    {
      name: 'Standard',
      price: 'PKR 100,000',
      delivery: '4-5 weeks',
      features: ['Android + iOS', 'Up to 12 screens', 'Firebase backend', 'Play Store / App Store submission', '3 revision rounds'],
      popular: true,
    },
    {
      name: 'Premium',
      price: 'PKR 200,000',
      delivery: '6-8 weeks',
      features: ['Fully custom app', 'Admin dashboard', 'Payment integration', 'Push notifications', '3 months free support'],
      popular: false,
    },
  ],
};

function Pricing() {
  const [tab, setTab] = useState('website');
  const [leaving, setLeaving] = useState(false);
  const handleTab = (next) => { if (next === tab || leaving) return; setIndicatorTab(next); setLeaving(true); setTimeout(() => { setTab(next); setLeaving(false); }, 350); };
  const [indicatorTab, setIndicatorTab] = useState('website');
  const pricingTabsRef = useRef(null);
  const [pricingIndicatorStyle, setPricingIndicatorStyle] = useState({});
  useEffect(() => { const update = () => { const container = pricingTabsRef.current; if (!container) return; const btn = container.querySelector('[data-tab="' + indicatorTab + '"]'); if (btn) setPricingIndicatorStyle({ width: btn.offsetWidth, height: btn.offsetHeight, transform: 'translate(' + btn.offsetLeft + 'px, ' + btn.offsetTop + 'px)' }); }; update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [indicatorTab]);
  const plans = pricingPlans[tab];
  return (
    <section className="section-pad pricing-section" id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title={<>SIMPLE <span>PRICING</span></>}
        copy="Transparent and competitive pricing — final quote is tailored to your project scope."
      />
      <div className="pricing-toggle" role="tablist" aria-label="Pricing type" ref={pricingTabsRef}>
        <span className="pricing-toggle-indicator" style={pricingIndicatorStyle} aria-hidden="true" />
        <button type="button" role="tab" aria-selected={tab === 'website'} data-tab="website" className={indicatorTab === 'website' ? 'active' : ''} onClick={() => handleTab('website')}>Website</button>
        <button type="button" role="tab" aria-selected={tab === 'app'} data-tab="app" className={indicatorTab === 'app' ? 'active' : ''} onClick={() => handleTab('app')}>Mobile App</button>
      </div>
      <div className={`pricing-grid ${leaving ? 'leaving' : ''}`}>
        {plans.map((plan) => (
          <article className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={tab + plan.name}>
            {plan.popular && <span className="pricing-badge">Most Popular</span>}
            <h3>{plan.name}</h3>
            <p className="pricing-price">{plan.price}</p>
            <small className="pricing-starting">Starting from</small>
            <p className="pricing-delivery">Delivery: {plan.delivery}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}><Check size={16} />{feature}</li>
              ))}
            </ul>
            <a className="pricing-cta" href="#contact">Start Project</a>
          </article>
        ))}
      </div>
      <p className="pricing-note">Have a custom project? <a href="#contact">Contact me</a> for a custom quote.</p>
    </section>
  );
}

function CaseStudy() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(null);
  const darziTabsRef = useRef(null);
  const [darziIndicatorStyle, setDarziIndicatorStyle] = useState({});
  const touchStartX = useRef(0);

  const screens = [
    {
      id: '01',
      tabLabel: 'Orders',
      title: 'Orders & Production Workflow',
      tag: 'Screen 01 · Live Queue',
      desc: 'Real-time order queue with draft, cutting, and stitching stage indicators. Tailors monitor due dates and advance payments in one view.',
      img: '/darzi-screen-orders.jpg',
      caption: 'Real-time queue tracking cutting, stitching, and ready items.',
    },
    {
      id: '02',
      tabLabel: 'Khaata',
      title: 'Khaata & Payments Ledger',
      tag: 'Screen 02 · Financial Ledger',
      desc: 'Automated khata ledger tracking remaining balances with instant 1-tap WhatsApp payment reminders using custom Urdu/English templates.',
      img: '/darzi-screen-khaata.jpg',
      caption: 'Automated remaining balance with instant WhatsApp reminders.',
    },
    {
      id: '03',
      tabLabel: 'Customers',
      title: 'Customer Directory & Profiles',
      tag: 'Screen 03 · Customer History',
      desc: 'Instant search customer database with full saved measurement profiles, order count history, and quick access for new bookings.',
      img: '/darzi-screen-customers.jpg',
      caption: 'Quick customer search with complete measurement history.',
    },
  ];

  // Lock background portfolio scroll when modal is open (resolves background scroll confusion)
  useEffect(() => {
    if (activeScreenIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeScreenIndex]);

  // Smooth sliding pill geometry calculation (exact match with Pricing section)
  useEffect(() => {
    if (activeScreenIndex === null) return;
    const update = () => {
      const container = darziTabsRef.current;
      if (!container) return;
      const btn = container.querySelector('[data-screen-idx="' + activeScreenIndex + '"]');
      if (btn) {
        setDarziIndicatorStyle({
          width: btn.offsetWidth,
          height: btn.offsetHeight,
          transform: 'translate(' + btn.offsetLeft + 'px, ' + btn.offsetTop + 'px)',
        });
      }
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(update);
    });
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeScreenIndex]);

  const switchScreen = useCallback((targetIndex) => {
    setActiveScreenIndex(targetIndex);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeScreenIndex === null) return;
    setActiveScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  }, [activeScreenIndex, screens.length]);

  const handleNext = useCallback(() => {
    if (activeScreenIndex === null) return;
    setActiveScreenIndex((prev) => (prev + 1) % screens.length);
  }, [activeScreenIndex, screens.length]);

  useEffect(() => {
    if (activeScreenIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveScreenIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreenIndex, handlePrev, handleNext]);

  const currentScreen = activeScreenIndex !== null ? screens[activeScreenIndex] : null;

  return (
    <section className="section-pad case-study-section" id="case-study">
      <SectionHeading
        eyebrow="Case study"
        title={<>DARZI APP <span>CASE STUDY</span></>}
        copy="How a tailor shop moved from notebooks to one app — built in React Native with Firebase."
      />
      <div className="case-study-grid">
        <article className="case-study-card">
          <span className="case-study-label">The Problem</span>
          <h3>Records scattered, measurements lost</h3>
          <p>Customer details, measurements and orders lived in notebooks and scattered notes. Measurements were lost or had to be retaken, and finding one customer among many took time.</p>
        </article>
        <article className="case-study-card">
          <span className="case-study-label">The Solution</span>
          <h3>One app for the whole shop</h3>
          <p>Darzi puts customer records, measurements, bookings and khata in one place. Updates arrive over the air — close and reopen the app and the latest version is there.</p>
        </article>
        <article className="case-study-card">
          <span className="case-study-label">The Result</span>
          <h3>A shop run from the phone</h3>
          <p>Measurements update in seconds, customers are found by search, ready clothes trigger an SMS, and the day's business is visible at a glance. Tailors are very impressed with it.</p>
        </article>
      </div>

      {/* Production App Screenshots Showcase */}
      <div className="darzi-showcase-section">
        <div className="darzi-showcase-header">
          <div className="darzi-showcase-badge">
            <Smartphone size={14} /> Production App Interface · React Native &amp; Firebase
          </div>
          <h3 className="darzi-showcase-title">Screens from Live Tailor Shop Usage</h3>
          <p className="darzi-showcase-subtitle">
            Actual mobile interface used by tailor shops in Swat, Pakistan. Tap any screen to view in full HD.
          </p>
        </div>

        <div className="darzi-screens-grid">
          {
            screens.map((item, idx) => (
              <div
                className="darzi-screen-item"
                key={item.id}
                onClick={() => setActiveScreenIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveScreenIndex(idx); }}
                aria-label={'View ' + item.title + ' in HD'}
              >
                <div className="darzi-phone-frame">
                  <div className="darzi-phone-island" />
                  <div className="darzi-phone-screen">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="darzi-screen-img"
                      loading="lazy"
                    />
                    <div className="darzi-screen-overlay">
                      <span className="darzi-zoom-pill">
                        <ZoomIn size={14} /> View in HD
                      </span>
                    </div>
                  </div>
                </div>
                <div className="darzi-screen-meta">
                  <span className="darzi-screen-num">{item.tag}</span>
                  <h4 className="darzi-screen-headline">{item.title}</h4>
                  <p className="darzi-screen-caption">{item.caption}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {currentScreen && (
        <div
          className="darzi-lightbox-backdrop"
          onClick={() => setActiveScreenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={currentScreen.title}
        >
          <div className="darzi-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="darzi-lightbox-header">
              <div>
                <span className="darzi-lightbox-tag">{currentScreen.tag}</span>
                <h3 className="darzi-lightbox-title">{currentScreen.title}</h3>
              </div>
              <div className="darzi-lightbox-header-right">
                <span className="darzi-screen-counter-badge">
                  {activeScreenIndex + 1} / {screens.length}
                </span>
                <button
                  type="button"
                  className="darzi-lightbox-close"
                  onClick={() => setActiveScreenIndex(null)}
                  aria-label="Close HD Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Interactive Screen Switcher Tabs with Sliding Indicator */}
            <div className="darzi-lightbox-tabs-bar" role="tablist" ref={darziTabsRef}>
              <span className="darzi-lightbox-indicator" style={darziIndicatorStyle} aria-hidden="true" />
              {screens.map((item, idx) => {
                const isActive = activeScreenIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-screen-idx={idx}
                    className={`darzi-lightbox-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => switchScreen(idx)}
                  >
                    <span className="darzi-tab-badge">{item.id}</span>
                    <span className="darzi-tab-name">{item.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Stage with Navigation Arrows and Continuous Hardware-Accelerated Slider Track */}
            <div
              className="darzi-lightbox-stage"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) handleNext();
                  else handlePrev();
                }
              }}
            >
              <button
                type="button"
                className="darzi-nav-arrow darzi-nav-prev"
                onClick={handlePrev}
                aria-label="Previous screen"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="darzi-lightbox-slider-viewport">
                <div
                  className="darzi-lightbox-slider-track"
                  style={{ transform: `translateX(-${activeScreenIndex * 100}%)` }}
                >
                  {screens.map((item, idx) => (
                    <div
                      className={`darzi-lightbox-slide ${idx === activeScreenIndex ? 'active' : ''}`}
                      key={item.id}
                    >
                      <div className="darzi-lightbox-phone-frame">
                        <div className="darzi-phone-island" />
                        <div className="darzi-phone-scroll-window">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="darzi-lightbox-img"
                            draggable={false}
                          />
                        </div>
                        <div className="darzi-scroll-hint-pill">
                          <span>Scroll inside phone ↕</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="darzi-nav-arrow darzi-nav-next"
                onClick={handleNext}
                aria-label="Next screen"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Indicator Dots & Description */}
            <div className="darzi-lightbox-footer-info">
              <div className="darzi-screen-indicator-dots">
                {screens.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`darzi-dot ${idx === activeScreenIndex ? 'active' : ''}`}
                    onClick={() => switchScreen(idx)}
                    aria-label={`Go to ${item.tabLabel}`}
                  />
                ))}
              </div>
              <p>{currentScreen.desc}</p>
              <div className="darzi-lightbox-meta-row">
                <span className="darzi-lightbox-note">✓ Captured from live production shop database</span>
                <span className="darzi-lightbox-hint">Use ‹ › keys or scroll phone inside</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="case-study-features">
        <article className="case-study-feature"><Check size={18} /><div><h4>Easy measurement updates</h4><p>No notebook, no retaking measurements again and again.</p></div></article>
        <article className="case-study-feature"><Check size={18} /><div><h4>Fast customer search</h4><p>Find any customer among many, instantly.</p></div></article>
        <article className="case-study-feature"><Check size={18} /><div><h4>Ready-cloth SMS</h4><p>One tap tells the customer their cloth is ready.</p></div></article>
        <article className="case-study-feature"><Check size={18} /><div><h4>Khata</h4><p>The remaining balance is visible to the tailor at a glance.</p></div></article>
        <article className="case-study-feature"><Check size={18} /><div><h4>Today's Earning</h4><p>Today's business, visible in the app.</p></div></article>
        <article className="case-study-feature"><Check size={18} /><div><h4>Delivery-date reminders</h4><p>The tailor is notified on the date a cloth is due.</p></div></article>
        <article className="case-study-feature"><Check size={18} /><div><h4>Over-the-air updates</h4><p>New updates arrive by closing and reopening the app.</p></div></article>
      </div>
      <div className="case-study-tech">
        <span>React Native</span>
        <span>Firebase</span>
        <span>OTA Updates</span>
        <span>SMS Notifications</span>
      </div>
      <div className="case-study-cta">
        <a href="https://apps.apple.com/pk/app/darzi-tailor-shop-manager/id6809124751" target="_blank" rel="noreferrer">View on App Store</a>
        <a href="#contact">Discuss a similar app</a>
      </div>
    </section >
  );
}

function Testimonials() {
  return (
    <section className="section-pad testimonial-section" id="testimonials">
      <SectionHeading
        eyebrow="Client feedback"
        title={<>WHAT CLIENTS <span>SAY</span></>}
        copy="Real feedback from people who use the products I build."
      />
      <div className="testimonial-grid">
        {testimonials.map(({ name, quote, role, project, initials, avatarGradient, verified }) => (
          <article className="testimonial-card" key={name + role}>
            <div className="testimonial-top-row">
              <div className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <span className="testimonial-verified-badge">
                <CheckCircle2 size={12} /> {verified}
              </span>
            </div>
            <p className="testimonial-quote">“{quote}”</p>
            <div className="testimonial-footer">
              <div
                className="testimonial-avatar"
                style={{ background: avatarGradient }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="testimonial-author">
                <strong className="testimonial-name">{name}</strong>
                <span className="testimonial-role">{role}</span>
                <span className="testimonial-project">
                  <Smartphone size={11} /> {project}
                </span>
              </div>
            </div>
          </article>
        ))}
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
    <section className="section-pad tech-section" id="technologies" ref={sectionRef}>
      <SectionHeading eyebrow="My toolkit" title={<>TECHNOLOGIES I<br /><span>WORK WITH</span></>} />
      <div className={`tech-grid ${revealed ? 'revealed' : ''}`}>
        {technologies.map(([name, IconComp, kind], index) => (
          <div
            className={`tech-card ${kind}`}
            key={name}
            style={{ '--tech-idx': index }}
          >
            <b><IconComp /></b>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseMe() { const items = [['01', 'Clean & Modern Design', 'Every detail has a reason. Nothing gets in the way of the experience.'], ['02', 'Responsive Development', 'Thoughtful layouts that feel right on every screen and every device.'], ['03', 'Performance Focused', "Fast, reliable digital products that respect your users' time."], ['04', 'User-Centered Experience', "Technology is only useful when it makes someone's day easier."]]; return <section className="section-pad why-section" id="why"><SectionHeading eyebrow="The difference" title={<>WHY WORK<br /><span>WITH ME?</span></>} /><div className="why-grid">{items.map(([num, title, text]) => <article key={num}><span>{num}</span><Check size={18} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>; }

function Contact() {
  const [sent, setSent] = useState(false);
  const [closing, setClosing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  const handleCloseModal = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setSent(false);
      setClosing(false);
      setErrorMsg('');
    }, 280);
  }, [closing]);

  // Prevent background portfolio scroll & support Escape key when Success Modal is open
  useEffect(() => {
    if (sent) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSent(false);
          setErrorMsg('');
          handleCloseModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [sent]);
}, [sent, handleCloseModal]);

const handleCopy = (text, field) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }
};

const validateEmail = (emailStr) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  if (submitting) return;

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
    // 1. Dispatch Firebase Firestore save immediately
    const firestorePromise = addDoc(collection(db, 'contactMessages'), {
      name,
      email,
      subject,
      message,
      createdAt: serverTimestamp(),
    }).catch((fsErr) => {
      console.warn('Firestore save notice:', fsErr);
    });

    // 2. Dispatch Web3Forms API in parallel
    const web3FormsPromise = fetch('https://api.web3forms.com/submit', {
      const web3FormsPromise = fetch('https://api.web3Forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'c0a3c477-bb8a-46a7-ba81-034a303b4c1a',
          name,
          email,
          subject: `New Portfolio Contact — ${subject}`,
          message,
          from_name: name,
        }),
      })
        .then((res) => res.json())
        .catch((err) => {
          console.warn('Web3Forms background response:', err);
          return { success: true, bgNotice: true };
        });

      // Responsive timeout race:
      // Web3Forms can take 3-5s due to external email relay; race with 850ms so user gets
      // an instant, responsive confirmation without waiting indefinitely on loading!
      const responsiveTimer = new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, timedOut: true }), 850)
      );

      const web3Result = await Promise.race([web3FormsPromise, responsiveTimer]);

      if(web3Result && web3Result.success !== false) {
        setClosing(false);
    setSent(true);
    formEl.reset();
  } else {
    console.error('Web3Forms error:', web3Result);
    setErrorMsg(web3Result?.message || 'Failed to send message. Please try again.');
  }
} catch (err) {
  console.error('Error submitting contact form:', err);
  setErrorMsg('Failed to send message. Please try again.');
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
          <a href="https://github.com/farmanadil500-debug" target="_blank" rel="noopener noreferrer"><GithubIcon width={17} height={17} /> github.com/farmanadil500-debug</a>
          <a href="https://www.linkedin.com/in/farman-adil-17b0903a4/" target="_blank" rel="noopener noreferrer"><LinkedinIcon width={17} height={17} /> linkedin.com/in/farman-adil</a>
          <span><Globe2 size={17} /> Pakistan / Worldwide</span>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="access_key" value="c0a3c477-bb8a-46a7-ba81-034a303b4c1a" />
        <label>Name<input name="name" required placeholder="Your name" disabled={submitting} /></label>
        <label>Email<input name="email" type="email" required placeholder="you@company.com" disabled={submitting} /></label>
        <label>Subject<input name="subject" required placeholder="How can I help?" disabled={submitting} /></label>
        <label>Message<textarea name="message" required placeholder="Tell me a little about your project..." rows="4" disabled={submitting} /></label>
        <button className="button primary contact-submit-btn" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="contact-btn-spinner" />
              <span>Sending message...</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <Send size={16} />
            </>
          )}
        </button>
        {errorMsg && <p className="form-error">{errorMsg}</p>}
      </form>
    </div>

    {/* Sleek Success Modal with Ultra-Smooth Animation */}
    {sent && (
      <div
        className="contact-modal-backdrop"
        className={`contact-modal-backdrop ${closing ? 'is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={() => {
          setSent(false);
          setErrorMsg('');
        }}
        onClick={handleCloseModal}
      >
        <div
          className="contact-modal-card"
          className={`contact-modal-card ${closing ? 'is-closing' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="contact-modal-close-btn"
            onClick={() => {
              setSent(false);
              setErrorMsg('');
            }}
            onClick={handleCloseModal}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div className="contact-modal-icon-wrap">
            <CheckCircle2 size={36} className="contact-modal-icon" />
            <span className="contact-modal-ping" />
          </div>

          <div className="contact-modal-tag">
            <span className="contact-modal-tag-dot" />
            Message Sent Successfully
          </div>

          <h3 id="contact-modal-title" className="contact-modal-title">
            Message Received!
          </h3>

          <p className="contact-modal-copy">
            Thank you for reaching out! I will review your project details and reply via email within a few hours.
          </p>

          <div className="contact-modal-urgent-box">
            <div className="contact-urgent-header">
              <span className="online-indicator-dot" />
              <span className="contact-urgent-label">Instant Response · Online</span>
            </div>
            <a
              href="https://wa.me/923496506743?text=Hi%20Farman,%20I%20just%20sent%20you%20a%20message%20on%20your%20portfolio%20and%20wanted%20to%20connect%20urgently!"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-modal-whatsapp-btn"
            >
              <WhatsappIcon width={22} height={22} />
              <div>
                <strong>Need an urgent reply? Chat instantly on WhatsApp</strong>
                <small>Typically responds in under 15 minutes</small>
              </div>
            </a>
          </div>

          <button
            type="button"
            className="contact-modal-done-btn"
            onClick={() => {
              setSent(false);
              setErrorMsg('');
            }}
            onClick={handleCloseModal}
          >
            Done
          </button>
        </div>
      </div>
    )}
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
          {['Home', 'Services', 'Process', 'Portfolio', 'Case Study', 'About', 'Experience', 'Education', 'Testimonials', 'Pricing', 'FAQ', 'Contact'].map(item => (
            <a href={`#${item.toLowerCase().replace(' ', '-')}`} key={item}>
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
        <small>© {new Date().getFullYear()} Farman Adil. All rights reserved.</small>
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


const faqData = [
  {
    q: 'Do you build for both Android and iOS?',
    a: 'Yes! I use <strong>React Native with Expo</strong>, which means your app runs on both Android and iOS from a single codebase — saving you time, cost, and effort.',
  },
  {
    q: 'How do we collaborate if we are in different time zones?',
    a: 'I work with clients <strong>worldwide</strong> and adapt to your schedule. I provide regular progress updates via WhatsApp, email, or video calls, and share detailed milestone reports throughout the project.',
  },
  {
    q: 'Do you handle backend and database too?',
    a: 'Absolutely. I integrate <strong>Firebase Firestore</strong> (real-time database), Firebase Auth (user authentication), and RESTful APIs. For most mobile and web projects, this covers the full backend.',
  },
  {
    q: 'What is your pricing and engagement model?',
    a: 'I offer both <strong>fixed-price project</strong> quotes (for well-defined scope) and <strong>hourly engagements</strong>. After a free discovery call, I will send a transparent breakdown with timeline and deliverables before any work begins.',
  },
  {
    q: 'How long does it take to build a mobile app?',
    a: 'A standard <strong>React Native MVP app</strong> typically takes 3 to 6 weeks depending on features. Simple utility apps can be faster; complex apps with custom dashboards, payments, or maps may take longer. I will give you a precise estimate after understanding your requirements.',
  },
  {
    q: 'Will I own the source code after delivery?',
    a: 'Yes, 100%. Once the project is delivered and payment is complete, you receive <strong>full ownership</strong> of the source code, assets, and all project files. No strings attached.',
  },
];

function Faq() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx(prev => prev === idx ? null : idx);

  return (
    <section className="section-pad faq-section" id="faq">
      <SectionHeading
        eyebrow="Got questions?"
        title={<>FREQUENTLY<br /><span>ASKED QUESTIONS</span></>}
        copy="Everything you need to know before we start working together."
      />

      <div className="faq-list">
        {faqData.map((item, idx) => (
          <div className={`faq-item ${openIdx === idx ? 'open' : ''}`} key={idx}>
            <button
              type="button"
              className="faq-question"
              onClick={() => toggle(idx)}
              aria-expanded={openIdx === idx}
            >
              <span className="faq-question-left">
                <span className="faq-q-badge">Q{idx + 1}</span>
                {item.q}
              </span>
              <ChevronDown size={18} className="faq-chevron" />
            </button>
            <div className="faq-answer" aria-hidden={openIdx !== idx}>
              <p className="faq-answer-inner" dangerouslySetInnerHTML={{ __html: item.a }} />
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <span>Still have a question? I am happy to answer it personally.</span>
        <a href="#contact">
          Ask me directly <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}


function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top-btn ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top of page"
      title="Back to Top"
    >
      <ArrowUp size={18} />
    </button>
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
    document.querySelectorAll('section, .service-card, .process-card, .project-card, .why-grid article, .about-heading, .about-profile-visual, .about-skill-badge, .experience-card, .testimonial-card').forEach(element => {
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
        <CaseStudy />
        <About />
        <Experience />
        <Education />
        <Testimonials />
        <Pricing />
        <Technologies />
        <WhyChooseMe />
        <Faq />
        <GlowingBottomLines />
        <Contact />
      </main>
      <Footer onOpenCv={() => setCvOpen(true)} />
      <FloatingWhatsApp />
      <BackToTop />
      <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);

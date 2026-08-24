import { useState, useEffect, useRef } from 'react';
import './index.css';
import DecryptedText from './DecryptedText';
import { GitHubCalendar } from 'react-github-calendar';
import Loader from './Loader';
import Preloader from './Preloader';
import GradientWaves from './GradientWaves';
import BorderGlow from './BorderGlow';
import { ParticleCard, GlobalSpotlight, useMobileDetection } from './MagicBento';
import LineSidebar from './LineSidebar';

function App() {
  const [theme, setTheme] = useState("dark");
  const [isChecked, setIsChecked] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  
  const mainContentRef = useRef(null);
  const isMobile = useMobileDetection();
  
  const [askQuery, setAskQuery] = useState('');
  const [askResponse, setAskResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [decryptKey, setDecryptKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showResumeOptions, setShowResumeOptions] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const fullText = "Pongsakorn Phomekham";

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Simulate loading time
    const loadTimer = setTimeout(() => {
      setPageLoaded(true);
      document.body.style.overflow = 'auto';
    }, 2500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(loadTimer);
    };
  }, []);

  // Re-trigger DecryptedText every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDecryptKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "TypeScript", icon: "devicon-typescript-plain colored" },
        { name: "JavaScript", icon: "devicon-javascript-plain colored" },
        { name: "Python", icon: "devicon-python-plain colored" },
        { name: "HTML5", icon: "devicon-html5-plain colored" },
        { name: "CSS3", icon: "devicon-css3-plain colored" }
      ]
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "Next.js", icon: "devicon-nextjs-original" },
        { name: "React", icon: "devicon-react-original colored" },
        { name: "React Native", icon: "devicon-react-original colored" },
        { name: "Expo", icon: "devicon-react-original" },
        { name: "Node.js", icon: "devicon-nodejs-plain colored" }
      ]
    },
    {
      title: "Tools & Databases",
      skills: [
        { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
        { name: "Supabase", icon: "devicon-supabase-plain colored" },
        { name: "SQL", icon: "devicon-mysql-plain colored" },
        { name: "Git", icon: "devicon-git-plain colored" },
        { name: "GitHub", icon: "devicon-github-original" }
      ]
    }
  ];

  // Typewriter Effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayText(fullText.substring(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleAsk = (e, overrideQuery = null) => {
    e?.preventDefault();
    
    const queryToUse = overrideQuery !== null ? overrideQuery : askQuery;
    if (!queryToUse.trim()) return;
    
    if (overrideQuery !== null) {
      setAskQuery(overrideQuery);
    }
    
    setIsAsking(true);
    setAskResponse('');
    
    // Fast search delay
    setTimeout(() => {
      const query = queryToUse.toLowerCase();
      let response = "No exact matches found. Try searching for skills, projects, or contact.";
      
      if (query.includes('work') || query.includes('project') || query.includes('portfolio')) {
        response = "I've built several projects including web frameworks, mobile apps, and e-commerce platforms. Scroll down to the Featured Projects section to see them all!";
      } else if (query.includes('skill') || query.includes('stack') || query.includes('tech') || query.includes('language')) {
        response = "My core stack includes React, Node.js, JavaScript, Python, and SQL/NoSQL databases. Check out the Core Stack section below.";
      } else if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('freelance')) {
        response = "You can reach me at hello@pongsakorn.com or call me at +66 12 345 6789. I'm currently open for freelance work!";
      } else if (query.includes('about') || query.includes('who')) {
        response = "I'm a Computer Science student passionate about crafting clean, modern web applications. Bridging the gap between complex technical problems and elegant solutions is my goal.";
      }
      
      setAskResponse(response);
      setIsAsking(false);
    }, 300);
  };

  // Custom Smooth Scroll handler
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId); // Update active state immediately
    
    const startPosition = window.scrollY || document.documentElement.scrollTop;
    let targetPosition = 0;
    
    if (targetId !== 'home') {
      const element = document.getElementById(targetId);
      if (!element) return;
      // Increased offset to 140 to prevent content from sticking too close to the header
      targetPosition = element.getBoundingClientRect().top + window.scrollY - 140;
    }
    
    const distance = targetPosition - startPosition;
    const duration = 1200; // ms (increased for slower scroll)
    let start = null;
    
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeInOutCubic)
      const easing = percentage < 0.5 
        ? 4 * percentage * percentage * percentage 
        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
        
      window.scrollTo(0, startPosition + distance * easing);
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    });
  };

  // Fade In Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in-section').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Active Section Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.2, rootMargin: "-10% 0px -40% 0px" }); 
    
    const sections = document.querySelectorAll('#home, #about, #skills, #projects, #contact');
    sections.forEach((el) => observer.observe(el));
    
    // Also check for reaching the absolute bottom of the page
    const handleScrollComplete = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        setActiveSection('contact');
      }
    };
    window.addEventListener('scroll', handleScrollComplete, { passive: true });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollComplete);
    };
  }, []);

  const projects = [
    {
      id: 2,
      title: "pskpongsakorn-Portfolio",
      description: "My personal portfolio website repository containing my projects, skills, and interactive UI components.",
      link: "https://github.com/pskcode2004/pskpongsakorn-Portfolio",
      image: "/portfolio-preview.webp",
      tech: [
        { name: "React", icon: "devicon-react-original colored" },
        { name: "JavaScript", icon: "devicon-javascript-plain colored" },
        { name: "CSS3", icon: "devicon-css3-plain colored" },
        { name: "HTML5", icon: "devicon-html5-plain colored" },
        { name: "Vite", icon: "devicon-vite-original colored" }
      ]
    },
    {
      id: 3,
      title: "Nyeta",
      description: "A Next.js application integrating TensorFlow for AI features, Upstash Redis for rate limiting, and Pusher for real-time capabilities.",
      link: "https://github.com/7sadakonr/Nyeta",
      image: "/nyeta-preview.webp",
      tech: [
        { name: "Next.js", icon: "devicon-nextjs-original" },
        { name: "React", icon: "devicon-react-original colored" },
        { name: "TypeScript", icon: "devicon-typescript-plain colored" },
        { name: "Tailwind CSS", icon: "devicon-tailwindcss-original colored" },
        { name: "TensorFlow", icon: "devicon-tensorflow-original colored" },
        { name: "Redis", icon: "devicon-redis-plain colored" }
      ]
    }
  ];

  return (
    <div className="app-container">
      <Preloader isLoaded={pageLoaded} />

      {/* Top Left Logo */}
      <div 
        className="portfolio-highlight fade-in-section" 
        style={{ 
          position: 'fixed', 
          top: '28px', 
          left: '32px', 
          zIndex: 100, 
          fontSize: '2rem',
          cursor: 'pointer',
          padding: 0
        }}
        onClick={(e) => handleScroll(e, 'home')}
      >
        PSK
      </div>

      {/* Header Band */}
      <header className="header-band" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <nav className="nav-links">
          <a href="#home" onClick={(e) => handleScroll(e, 'home')} className={activeSection === 'home' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }} aria-label="Home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </a>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')} className={activeSection === 'about' ? 'active' : ''}>About</a>
          <a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className={activeSection === 'skills' ? 'active' : ''}>Skills</a>
          <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className={activeSection === 'projects' ? 'active' : ''}>Projects</a>
          <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className={activeSection === 'contact' ? 'active' : ''}>Contact</a>
        </nav>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--chip-bg)',
            border: '1px solid var(--chip-border)',
            color: 'var(--ink-on-light)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          aria-label="Toggle theme"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </header>

      {/* Background Wrapper for Hero and About Me */}
      <div style={{ position: 'relative', width: '100%', zIndex: 1 }}>
        {/* Absolute Background covering only this wrapper */}
        <div style={{ 
          position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: -1,
          clipPath: 'ellipse(150% 100% at 50% 0%)',
          WebkitClipPath: 'ellipse(150% 100% at 50% 0%)'
        }}>
          <GradientWaves
            horizonColor={theme === 'dark' ? "#5227FF" : "#ffffff"}
            waveColor={theme === 'dark' ? "#FF9FFC" : "#d8b4fe"}
            crestColor={theme === 'dark' ? "#FFFFFF" : "#6d28d9"}
            speed={0.4}
            amplitude={2.8}
            waveScale={0.8}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={0.95}
            zoom={1.0}
            height={6.5}
            fogDepth={16}
            detail="medium"
            brightness={theme === 'dark' ? 0.75 : 1.0}
            opacity={1.0}
            mouseInteraction={true}
            parallaxStrength={0.5}
            grain={true}
            grainIntensity={0.05}
          />
        </div>

        {/* Hero Band */}
        <section id="home" className="hero-band" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}>
        <div style={{ zIndex: 1, marginBottom: '24px', marginTop: '80px', animation: 'fadeIn 1s ease-out' }}>
          <img 
            fetchPriority="high"
            src="/profile.png" 
            alt="Pongsakorn Phomekham" 
            style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '4px solid var(--accent-orange)',
              boxShadow: '0 12px 32px rgba(var(--shadow-rgb), 0.4)',
              padding: '6px',
              backgroundColor: 'var(--card-surface)'
            }} 
          />
        </div>
        <h1 className="display-hero" style={{ marginBottom: '16px', minHeight: '60px', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
          <DecryptedText
            key={`${decryptKey}-1`}
            text="Welcome to my"
            animateOn="view"
            speed={60}
            maxIterations={20}
            revealDirection="center"
          />
          <DecryptedText
            key={`${decryptKey}-2`}
            text="Portfolio"
            animateOn="view"
            speed={60}
            maxIterations={20}
            revealDirection="center"
            className="portfolio-highlight"
          />
        </h1>
        
        <div className="fade-in-section" style={{ transitionDelay: '1.5s', zIndex: 1 }}>
          <p className="lead-body" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--ink-secondary)' }}>
            Hi, I'm Pongsakorn Phomekham, a Computer Science Student.
          </p>
        </div>
      </section>

      {/* Body Band */}
      <section className="body-band" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}>
        
        {/* About Section */}
        <div id="about" className="fade-in-section" style={{ marginBottom: '96px', textAlign: 'center' }}>
          <h2 className="heading-h1" style={{ marginBottom: '32px', fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            Hi, I'm <span className="portfolio-highlight" style={{ paddingLeft: '4px' }}>Pongsakorn</span>
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p className="body-default" style={{ color: 'var(--ink-secondary)', marginBottom: '16px', fontSize: '16px' }}>
              I'm a 4th-year Computer Science student with a strong focus on Full-Stack Development. 
              Experienced in building end-to-end web applications through real-world projects, covering UI design, database integration, authentication, real-time communication, and AI integration.
            </p>
            <p className="body-default" style={{ color: 'var(--ink-secondary)', fontSize: '16px', marginBottom: '32px' }}>
              Proficient in React, Next.js, TypeScript, Supabase, and PostgreSQL. 
              Highly passionate about delivering secure, high-performance, and accessible systems that provide exceptional user experiences.
            </p>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div 
                onClick={() => setShowResumeOptions(!showResumeOptions)} 
                style={{ cursor: 'pointer', display: 'inline-block' }}
              >
                <BorderGlow
                  borderRadius={100}
                  backgroundColor="var(--accent-orange)"
                  colors={['#ffffff', '#f472b6', '#38bdf8']}
                  edgeSensitivity={50}
                  glowColor="40 100 80"
                  glowRadius={25}
                  className="resume-border-glow"
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ffffff',
                    padding: '14px 28px',
                    fontSize: '16px',
                    fontWeight: '600',
                    position: 'relative',
                    zIndex: 10
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download Resume
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showResumeOptions ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', marginLeft: '4px' }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </BorderGlow>
              </div>

              {showResumeOptions && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '16px',
                  backgroundColor: 'var(--card-surface)',
                  border: '1px solid var(--hairline-dark)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(var(--shadow-rgb), 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  zIndex: 20,
                  width: 'max-content',
                  animation: 'menuReveal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                }}>
                  <a href="/resume_th.pdf" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 24px', color: 'var(--ink-on-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--hairline-dark)', transition: 'background-color 0.2s', fontSize: '15px', fontWeight: '500' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-highlight)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => setShowResumeOptions(false)}>
                    <span style={{ fontSize: '18px' }}>🇹🇭</span> ภาษาไทย (TH)
                  </a>
                  <a href="/resume_en.pdf" target="_blank" rel="noopener noreferrer" style={{ padding: '14px 24px', color: 'var(--ink-on-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background-color 0.2s', fontSize: '15px', fontWeight: '500' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-highlight)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => setShowResumeOptions(false)}>
                    <span style={{ fontSize: '18px' }}>🇬🇧</span> English (EN)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      </div>
      {/* End of Background Wrapper */}

      {/* Rest of the Body Band */}
      <section ref={mainContentRef} className="body-band bento-section" style={{ position: 'relative', zIndex: 1 }}>
        <GlobalSpotlight 
          gridRef={mainContentRef} 
          disableAnimations={isMobile} 
          glowColor="157, 78, 221" 
          spotlightRadius={350} 
        />
        {/* Core Stack & GitHub Section */}
        <div id="skills" className="fade-in-section" style={{ marginBottom: '96px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Core Stack Bento Card */}
          <ParticleCard 
            className="magic-bento-card magic-bento-card--border-glow"
            disableAnimations={isMobile}
            glowColor="157, 78, 221"
            particleCount={15}
            enableTilt={true}
            enableMagnetism={true}
            style={{ 
              backgroundColor: 'var(--card-surface)', 
              border: '1px solid var(--hairline-dark)', 
              borderRadius: '24px', 
              padding: '32px', 
              boxShadow: '0 8px 32px rgba(var(--shadow-rgb), 0.1)',
              backgroundImage: theme === 'dark' ? 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)' : 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            <h2 className="heading-h2" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--accent-orange)' }}>&lt; &gt;</span> Core Stack
            </h2>
            <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '12px' }}>
              <div className="marquee-wrapper" style={{ gap: '12px', marginBottom: '16px', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <div className="marquee-content" style={{ animationDuration: '30s' }}>
                  {skillCategories.flatMap(c => c.skills).slice(0, 7).map((skill, index) => (
                    <span key={`bento-m1-${skill.name}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '500', backgroundColor: 'var(--surface-highlight)', border: '1px solid var(--hairline-dark)', borderRadius: '12px' }}>
                      <i className={skill.icon} style={{ fontSize: '18px' }}></i>
                      {skill.name}
                    </span>
                  ))}
                </div>
                <div className="marquee-content" style={{ animationDuration: '30s' }} aria-hidden="true">
                  {skillCategories.flatMap(c => c.skills).slice(0, 7).map((skill, index) => (
                    <span key={`bento-m1-dup-${skill.name}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '500', backgroundColor: 'var(--surface-highlight)', border: '1px solid var(--hairline-dark)', borderRadius: '12px' }}>
                      <i className={skill.icon} style={{ fontSize: '18px' }}></i>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="marquee-wrapper" style={{ gap: '12px', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <div className="marquee-content" style={{ animationDuration: '35s', animationDirection: 'reverse' }}>
                  {skillCategories.flatMap(c => c.skills).slice(7).map((skill, index) => (
                    <span key={`bento-m2-${skill.name}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '500', backgroundColor: 'var(--surface-highlight)', border: '1px solid var(--hairline-dark)', borderRadius: '12px' }}>
                      <i className={skill.icon} style={{ fontSize: '18px' }}></i>
                      {skill.name}
                    </span>
                  ))}
                </div>
                <div className="marquee-content" style={{ animationDuration: '35s', animationDirection: 'reverse' }} aria-hidden="true">
                  {skillCategories.flatMap(c => c.skills).slice(7).map((skill, index) => (
                    <span key={`bento-m2-dup-${skill.name}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '500', backgroundColor: 'var(--surface-highlight)', border: '1px solid var(--hairline-dark)', borderRadius: '12px' }}>
                      <i className={skill.icon} style={{ fontSize: '18px' }}></i>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ParticleCard>

          {/* GitHub Contributions Bento Card */}
          <ParticleCard 
            className="magic-bento-card magic-bento-card--border-glow"
            disableAnimations={isMobile}
            glowColor="157, 78, 221"
            particleCount={15}
            enableTilt={true}
            enableMagnetism={true}
            style={{ 
              backgroundColor: 'var(--card-surface)', 
              border: '1px solid var(--hairline-dark)', 
              borderRadius: '24px', 
              padding: '32px', 
              boxShadow: '0 8px 32px rgba(var(--shadow-rgb), 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <a href="https://github.com/pskcode2004" target="_blank" rel="noreferrer" style={{ width: '48px', height: '48px', backgroundColor: 'var(--surface-highlight)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-on-light)', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <div>
                  <a href="https://github.com/pskcode2004" target="_blank" rel="noreferrer" style={{ fontWeight: '700', fontSize: '18px', color: 'var(--ink-on-light)', textDecoration: 'none' }}>@pskcode2004</a>
                  <div style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginTop: '2px' }}>Contribution Graph</div>
                </div>
              </div>
            </div>
            <div style={{ maxWidth: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
              <GitHubCalendar 
                username="pskcode2004" 
                colorScheme={theme} 
                blockSize={14}
                blockMargin={5}
                fontSize={14}
              />
            </div>
          </ParticleCard>
        </div>
        
        <div id="projects" className="fade-in-section" style={{ marginBottom: '48px', display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: '48px', alignItems: 'flex-start' }}>
          
          <div style={{ flex: '0 0 280px', position: 'relative', zIndex: 10 }}>
            <h2 className="heading-h1" style={{ marginBottom: '16px', fontSize: '48px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="portfolio-highlight" style={{ paddingLeft: 0 }}>projects</span>
            </h2>
            <p className="body-default" style={{ color: 'var(--ink-secondary)', marginBottom: '32px' }}>A curated selection of projects that made me confident in building software.</p>
            
            <LineSidebar 
              items={projects.map(p => p.title)} 
              accentColor="rgba(157, 78, 221, 1)"
              textColor="var(--ink-secondary)"
              markerColor="var(--hairline-dark)"
              itemGap={36}
              proximityRadius={65}
              defaultActive={activeProjectIndex}
              onItemClick={(index) => {
                setActiveProjectIndex(index);
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0, animation: 'fadeIn 0.3s ease-out' }} key={activeProjectIndex}>
            <ParticleCard 
              className="project-bento-card magic-bento-card magic-bento-card--border-glow" 
              disableAnimations={isMobile}
              glowColor="157, 78, 221"
              particleCount={15}
              enableTilt={true}
              enableMagnetism={true}
              style={{ display: 'flex', flexDirection: 'column', padding: 0, height: '100%' }}
            >
              <a href={projects[activeProjectIndex].link} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none' }}>
                <div className="project-bento-image-container" style={{ aspectRatio: '16/9', maxHeight: '400px' }}>
                  <img src={projects[activeProjectIndex].image} alt={projects[activeProjectIndex].title} className="project-bento-image" loading="lazy" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(20, 9, 36, 0.9)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-on-light)', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} className="project-star-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>View Repository</span>
                  </div>
                </div>
                <div className="project-bento-content" style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 className="heading-h2" style={{ color: 'var(--ink-on-light)', marginBottom: '16px' }}>{projects[activeProjectIndex].title}</h3>
                  <p className="body-default" style={{ color: 'var(--ink-secondary)', marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>{projects[activeProjectIndex].description}</p>
                  {projects[activeProjectIndex].tech && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {projects[activeProjectIndex].tech.map((techItem, i) => (
                        <div key={i} style={{ 
                          background: 'var(--chip-bg)', 
                          padding: '8px 16px', 
                          borderRadius: '12px',
                          border: '1px solid var(--chip-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}>
                          <i className={techItem.icon} style={{ fontSize: '20px' }}></i>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink-on-light)' }}>{techItem.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </ParticleCard>
          </div>
        </div>
        
        <div className="fade-in-section" style={{ marginBottom: '96px', textAlign: 'center' }}>
           <a href="https://github.com/pskcode2004" target="_blank" rel="noreferrer" className="link-standard body-strong" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
             Explore all projects on GitHub 
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <line x1="5" y1="12" x2="19" y2="12"></line>
               <polyline points="12 5 19 12 12 19"></polyline>
             </svg>
           </a>
        </div>

        {/* Contact Section */}
        <div id="contact" className="fade-in-section" style={{ marginTop: '96px', borderTop: '1px solid var(--hairline-light)', paddingTop: '96px' }}>
          <h2 className="heading-h1" style={{ marginBottom: '48px' }}>Get In Touch</h2>
          <div className="about-grid">
            <div>
              <h3 className="heading-h2" style={{ marginBottom: '16px' }}>Let's collaborate</h3>
              <p className="body-default" style={{ color: 'var(--ink-secondary)', marginBottom: '32px' }}>
                I'm currently looking for new opportunities and open to exciting projects. Feel free to drop a message, whether you have a question or just want to say hi!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href="mailto:memory.pongsakorn@gmail.com" className="link-standard body-strong">memory.pongsakorn@gmail.com</a>
                <a href="tel:0618955968" className="link-standard body-strong">0618955968</a>
              </div>
            </div>
            
            <ParticleCard 
              className="magic-bento-card magic-bento-card--border-glow"
              disableAnimations={isMobile}
              glowColor="157, 78, 221"
              particleCount={10}
              enableTilt={true}
              enableMagnetism={true}
              style={{ backgroundColor: 'var(--surface-highlight)', padding: '32px', borderRadius: 'var(--radius-lg)' }}
            >
              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div>
                  <label className="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
                  <input type="text" className="input-standard" placeholder="Your name" />
                </div>
                <div>
                  <label className="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                  <input type="email" className="input-standard" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Message</label>
                  <textarea className="input-standard" rows="4" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="btn-primary-dark" style={{ marginTop: '8px', cursor: 'pointer', position: 'relative', zIndex: 10 }}>
                  Send Message
                </button>
              </form>
            </ParticleCard>
          </div>
        </div>
      </section>

      <footer className="footer fade-in-section" style={{ display: 'block', backgroundColor: 'var(--card-surface)', padding: '64px 32px 32px 32px', borderTop: '1px solid var(--hairline-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '64px', textAlign: 'left' }}>
          
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="portfolio-highlight" style={{ fontSize: '2em', margin: 0, padding: 0 }}>Pongsakorn</h3>
            <p className="body-default" style={{ color: 'var(--ink-secondary)', maxWidth: '300px', lineHeight: '1.6' }}>
              A Computer Science student passionate about crafting clean, modern web applications and building robust software systems.
            </p>
          </div>

          {/* Navigation Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 className="body-strong" style={{ color: 'var(--ink-on-light)', margin: 0, fontSize: '16px' }}>Navigation</h4>
            <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="footer-link">Home</a>
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="footer-link">About</a>
            <a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className="footer-link">Core Stack</a>
            <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="footer-link">Projects</a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="footer-link">Contact</a>
          </div>

          {/* Social Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 className="body-strong" style={{ color: 'var(--ink-on-light)', margin: 0, fontSize: '16px' }}>Connect</h4>
            <a href="https://github.com/pskcode2004" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
            <a href="mailto:memory.pongsakorn@gmail.com" className="footer-link">Email</a>
          </div>
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', borderTop: '1px solid var(--hairline-dark)', paddingTop: '32px', overflow: 'hidden' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span className="caption" style={{ color: 'var(--ink-secondary)' }}>© 2026 Pongsakorn Phomekham. All rights reserved.</span>
            <span className="caption" style={{ color: 'var(--ink-secondary)' }}>Designed & Built with React</span>
          </div>
          
          <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              fontSize: 'clamp(20px, 5vw, 90px)', 
              fontWeight: '900', 
              letterSpacing: '0.02em', 
              color: 'var(--ink-on-light)', 
              opacity: 0.05,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              userSelect: 'none'
            }}>
              PONGSAKORN PHOMEKHAM
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

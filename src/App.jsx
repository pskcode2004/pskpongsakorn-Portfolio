import { useState, useEffect } from 'react';
import './index.css';
import PixelBlast from './PixelBlast';
import DecryptedText from './DecryptedText';

function App() {
  const [theme, setTheme] = useState("dark");
  const [isChecked, setIsChecked] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [askQuery, setAskQuery] = useState('');
  const [askResponse, setAskResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [decryptKey, setDecryptKey] = useState(0);
  const fullText = "Pongsakorn Phomekham";

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
        { name: "JavaScript", icon: "devicon-javascript-plain colored" },
        { name: "Python", icon: "devicon-python-plain colored" },
        { name: "Java", icon: "devicon-java-plain colored" },
        { name: "C++", icon: "devicon-cplusplus-plain colored" },
        { name: "HTML5", icon: "devicon-html5-plain colored" },
        { name: "CSS3", icon: "devicon-css3-plain colored" }
      ]
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "React", icon: "devicon-react-original colored" },
        { name: "Node.js", icon: "devicon-nodejs-plain colored" },
        { name: "Express", icon: "devicon-express-original" }
      ]
    },
    {
      title: "Tools & Databases",
      skills: [
        { name: "SQL", icon: "devicon-mysql-plain colored" },
        { name: "NoSQL", icon: "devicon-mongodb-plain colored" },
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
    
    // Simulate AI loading delay
    setTimeout(() => {
      const query = queryToUse.toLowerCase();
      let response = "I'm not quite sure about that! Try asking about my skills, projects, or how to contact me.";
      
      if (query.includes('work') || query.includes('project') || query.includes('portfolio')) {
        response = "I've built several projects including web frameworks, mobile apps, and e-commerce platforms. Scroll down to the Selected Projects section to see them all!";
      } else if (query.includes('skill') || query.includes('stack') || query.includes('tech') || query.includes('language')) {
        response = "My core stack includes React, Node.js, JavaScript, Python, and SQL/NoSQL databases. I love exploring new technologies too!";
      } else if (query.includes('contact') || query.includes('email') || query.includes('hire') || query.includes('freelance')) {
        response = "You can reach me at hello@pongsakorn.com or call me at +66 12 345 6789. I'm currently open for freelance work!";
      } else if (query.includes('about') || query.includes('who')) {
        response = "I'm a Computer Science student passionate about crafting clean, modern web applications. Bridging the gap between complex technical problems and elegant solutions is my goal.";
      }
      
      setAskResponse(response);
      setIsAsking(false);
    }, 800);
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
      targetPosition = element.getBoundingClientRect().top + window.scrollY - 80;
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
    }, { threshold: 0.4 }); // Trigger when 40% of the section is visible
    
    const sections = document.querySelectorAll('#home, #about, #skills, #projects, #contact');
    sections.forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      id: 1,
      title: "Cube Solver",
      description: "Desktop application using computer vision to scan and solve Rubik's Cube in real-time.",
      link: "https://github.com",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Improvement Tree",
      description: "Full-stack mobile app with cloud server that gamifies personal development.",
      link: "https://github.com",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Nebula",
      description: "Arcade runner game with procedural terrain generation and dynamic gameplay.",
      link: "https://github.com",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Guess Who?",
      description: "Mobile adaptation of the classic board game with camera and gallery integration for custom boards.",
      link: "https://github.com",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="app-container">
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

      {/* Hero Band */}
      <section id="home" className="hero-band">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <PixelBlast
            variant="square"
            pixelSize={4}
            color={theme === 'dark' ? "#b026ff" : "#B497CF"}
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.25}
            transparent
          />
        </div>
        
        <div style={{ zIndex: 1, marginBottom: '24px', marginTop: '80px', animation: 'fadeIn 1s ease-out' }}>
          <img 
            src="https://reg.rmutsb.ac.th/resources/images/std_pic/466415241041.jpg?t=cd7ba977fec700443ac4f79e129f7b58" 
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
        <h1 className="display-hero" style={{ marginBottom: '16px', minHeight: '60px', zIndex: 1 }}>
          <DecryptedText
            key={decryptKey}
            text="Pongsakorn Phomekham"
            animateOn="view"
            speed={60}
            maxIterations={20}
            revealDirection="center"
          />
        </h1>
        
        <div className="fade-in-section" style={{ transitionDelay: '1.5s', zIndex: 1 }}>
          <p className="lead-body" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--hairline-light)' }}>
            I'm a Computer Science student passionate about crafting clean, modern web applications and exploring the intersection of design and technology.
          </p>

          <div className="ask-me-container" style={{ marginTop: '40px', position: 'relative', maxWidth: '540px', margin: '40px auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-surface)', borderRadius: '100px', padding: '10px 14px 10px 24px', boxShadow: '0 8px 30px rgba(176, 38, 255, 0.15)', border: '1px solid rgba(176, 38, 255, 0.2)', transition: 'box-shadow 0.3s ease' }} 
                 onFocus={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(176, 38, 255, 0.3)'}
                 onBlur={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(176, 38, 255, 0.15)'}>
              
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '16px', opacity: 0.8 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              
              <input 
                type="text" 
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask me anything about Pongsakorn..." 
                style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '17px', color: 'var(--ink-on-light)', outline: 'none', padding: '10px 0' }} 
              />
              
              <button 
                style={{ background: 'var(--accent-orange)', color: 'white', border: 'none', borderRadius: '100px', padding: '10px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginLeft: '12px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(176, 38, 255, 0.3)' }} 
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(176, 38, 255, 0.4)'; }} 
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(176, 38, 255, 0.3)'; }}
                onClick={handleAsk}
                disabled={isAsking}
              >
                {isAsking ? '...' : 'Ask'}
              </button>
            </div>
            
            {(isAsking || askResponse) && (
              <div style={{ marginTop: '16px', padding: '16px 24px', backgroundColor: 'var(--card-surface)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'left', border: '1px solid var(--hairline-dark)', animation: 'fadeIn 0.3s ease-out' }}>
                {isAsking ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                    <span style={{ fontSize: '14px' }}>Thinking...</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--ink-on-light)', margin: 0, lineHeight: 1.5 }}>
                    {askResponse}
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
            <button className="chip-btn" onClick={() => handleAsk(null, 'Tell me about your work')}>Work</button>
            <button className="chip-btn" onClick={() => handleAsk(null, 'Who are you?')}>About me</button>
            <button className="chip-btn" onClick={() => handleAsk(null, 'What are your skills?')}>Skills</button>
            <button className="chip-btn" onClick={() => handleAsk(null, 'How can I contact you?')}>Contact</button>
          </div>
        </div>
      </section>

      {/* Body Band */}
      <section className="body-band">
        
        {/* About Section */}
        <div id="about" className="fade-in-section" style={{ marginBottom: '96px' }}>
          <h2 className="heading-h1" style={{ marginBottom: '32px' }}>About Me</h2>
          <div style={{ maxWidth: '800px' }}>
            <p className="body-default" style={{ color: 'var(--ink-secondary)', marginBottom: '16px', fontSize: '16px' }}>
              I'm a Computer Science student with a strong foundation in software engineering, algorithms, and web development. 
              I love building systems from the ground up, whether it's a sleek frontend interface or a robust backend API.
            </p>
            <p className="body-default" style={{ color: 'var(--ink-secondary)', fontSize: '16px' }}>
              My goal is to bridge the gap between complex technical problems and elegant, user-centric solutions. 
              When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.
            </p>
          </div>
        </div>

        {/* Core Stack Section */}
        <div id="skills" className="fade-in-section" style={{ marginBottom: '96px' }}>
          <h2 className="heading-h1" style={{ marginBottom: '48px' }}>Core Stack</h2>
          <div className="about-grid">
            {skillCategories.map(category => (
              <div key={category.title}>
                <h3 className="heading-h2" style={{ marginBottom: '24px', fontSize: '20px' }}>{category.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {category.skills.map(skill => (
                    <span key={skill.name} className="skill-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '15px' }}>
                      <i className={skill.icon} style={{ fontSize: '22px' }}></i>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="projects" className="fade-in-section" style={{ marginBottom: '32px' }}>
          <h2 className="heading-h1" style={{ marginBottom: '8px' }}>Featured Projects</h2>
          <p className="body-default" style={{ color: 'var(--ink-secondary)' }}>A curated selection of projects that made me confident in building software.</p>
        </div>

        <div className="project-grid fade-in-section" style={{ transitionDelay: '0.2s', marginBottom: '48px' }}>
          {projects.map((project) => (
            <a key={project.id} href={project.link} target="_blank" rel="noreferrer" className="project-bento-card">
              <div className="project-bento-image-container">
                <img src={project.image} alt={project.title} className="project-bento-image" />
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(20, 9, 36, 0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink-on-light)', fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} className="project-star-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>Star</span>
                </div>
              </div>
              <div className="project-bento-content">
                <h3 className="heading-h3" style={{ color: 'var(--ink-on-light)', marginBottom: '8px' }}>{project.title}</h3>
                <p className="body-default" style={{ color: 'var(--ink-secondary)' }}>{project.description}</p>
              </div>
            </a>
          ))}
        </div>
        
        <div className="fade-in-section" style={{ marginBottom: '96px', textAlign: 'center' }}>
           <a href="https://github.com" target="_blank" rel="noreferrer" className="link-standard body-strong" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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
                <a href="mailto:hello@example.com" className="link-standard body-strong">hello@pongsakorn.com</a>
                <a href="tel:+66123456789" className="link-standard body-strong">+66 12 345 6789</a>
              </div>
            </div>
            
            <div style={{ backgroundColor: 'var(--surface-highlight)', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <textarea className="input-standard" rows="4" placeholder="How can I help you?" style={{ resize: 'vertical' }}></textarea>
                </div>
                <button type="button" className="btn-primary-dark" style={{ marginTop: '8px' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer fade-in-section">
        <span className="caption" style={{ color: 'var(--ink-secondary)' }}>© 2026 MyPortfolio.</span>
        <a href="https://github.com" className="footer-link">GitHub</a>
        <a href="https://linkedin.com" className="footer-link">LinkedIn</a>
        <a href="https://twitter.com" className="footer-link">Twitter</a>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

// Circular Text Component
const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

const CircularText = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case "pause":
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        };
        scaleVal = 1;
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span key={i} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

// Main App Component
const QualitySystemApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });

  const translations = {
    en: {
      login: 'LOGIN',
      register: 'REGISTER',
      username: 'USERNAME',
      password: 'PASSWORD',
      confirmPassword: 'CONFIRM PASSWORD',
      email: 'EMAIL',
      loginTitle: 'LOGIN TO QUALITY SYSTEM',
      registerTitle: 'REGISTER FOR QUALITY SYSTEM',
      loginButton: 'LOGIN',
      registerButton: 'REGISTER',
      dontHaveAccount: "DON'T HAVE AN ACCOUNT?",
      alreadyHaveAccount: 'ALREADY HAVE AN ACCOUNT?',
      registerHere: 'REGISTER HERE',
      loginHere: 'LOGIN HERE',
      enterUsername: 'ENTER YOUR USERNAME',
      enterPassword: 'ENTER YOUR PASSWORD',
      chooseUsername: 'CHOOSE A USERNAME',
      enterEmail: 'ENTER YOUR EMAIL',
      createPassword: 'CREATE A PASSWORD',
      confirmYourPassword: 'CONFIRM YOUR PASSWORD'
    },
    ar: {
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      email: 'البريد الإلكتروني',
      loginTitle: 'تسجيل الدخول إلى نظام الجودة',
      registerTitle: 'التسجيل في نظام الجودة',
      loginButton: 'تسجيل الدخول',
      registerButton: 'التسجيل',
      dontHaveAccount: 'ليس لديك حساب؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      registerHere: 'سجل هنا',
      loginHere: 'سجل الدخول هنا',
      enterUsername: 'أدخل اسم المستخدم',
      enterPassword: 'أدخل كلمة المرور',
      chooseUsername: 'اختر اسم المستخدم',
      enterEmail: 'أدخل البريد الإلكتروني',
      createPassword: 'أنشئ كلمة مرور',
      confirmYourPassword: 'أكد كلمة المرور'
    }
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    // Check for hardcoded credentials
    if (formData.username === '1' && formData.password === '1') {
      alert(language === 'en' ? 'Login successful! Welcome to Quality System.' : 'تم تسجيل الدخول بنجاح! مرحباً بك في نظام الجودة.');
      console.log('Login successful for user:', formData.username);
    } else {
      alert(language === 'en' ? 'Invalid username or password. Use username: 1 and password: 1' : 'اسم المستخدم أو كلمة المرور غير صحيحة. استخدم اسم المستخدم: 1 وكلمة المرور: 1');
    }
  };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }
    console.log('Registration attempt:', formData);
    alert('Registration functionality would be implemented here');
  };

  const LoginPage = () => (
    <motion.div 
      className={`auth-container ${language === 'ar' ? 'rtl' : 'ltr'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="language-switch">
        <button 
          onClick={() => setLanguage('en')}
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage('ar')}
          className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
        >
          ع
        </button>
      </div>

      <div className="logo-container">
        <div className="logo-wrapper">
          <CircularText 
            text="QUALITY • QUALITY • QUALITY • " 
            spinDuration={15}
            onHover="speedUp"
            className="logo-text"
          />
          <div className="logo-center">
            <div className="logo-icon">THE SYSTEM</div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="form-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>{t.loginTitle}</h2>
        <div>
          <div className="input-group">
            <label>{t.username}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder={t.enterUsername}
            />
          </div>
          <div className="input-group">
            <label>{t.password}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder={t.enterPassword}
            />
          </div>
          <button onClick={handleLogin} className="btn-primary">{t.loginButton}</button>
        </div>
        <p className="switch-page">
          {t.dontHaveAccount}
          <button 
            onClick={() => setCurrentPage('register')}
            className="link-btn"
          >
            {t.registerHere}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );

  const RegisterPage = () => (
    <motion.div 
      className={`auth-container ${language === 'ar' ? 'rtl' : 'ltr'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="language-switch">
        <button 
          onClick={() => setLanguage('en')}
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage('ar')}
          className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
        >
          ع
        </button>
      </div>

      <div className="logo-container">
        <div className="logo-wrapper">
          <CircularText 
            text="QUALITY • QUALITY • QUALITY • " 
            spinDuration={15}
            onHover="speedUp"
            className="logo-text"
          />
          <div className="logo-center">
            <div className="logo-icon">THE SYSTEM</div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="form-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>{t.registerTitle}</h2>
        <div>
          <div className="input-group">
            <label>{t.username}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder={t.chooseUsername}
            />
          </div>
          <div className="input-group">
            <label>{t.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder={t.enterEmail}
            />
          </div>
          <div className="input-group">
            <label>{t.password}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder={t.createPassword}
            />
          </div>
          <div className="input-group">
            <label>{t.confirmPassword}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder={t.confirmYourPassword}
            />
          </div>
          <button onClick={handleRegister} className="btn-primary">{t.registerButton}</button>
        </div>
        <p className="switch-page">
          {t.alreadyHaveAccount}
          <button 
            onClick={() => setCurrentPage('login')}
            className="link-btn"
          >
            {t.loginHere}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="app">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(
            145deg,
            #00ffe0,
            #00d18b,
            #c2f0ff,
            #b8ffb0,
            #ffffff
          );
          background-size: 300% 300%;
          animation: gradientMove 15s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Arial', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          position: relative;
        }

        .auth-container.rtl {
          direction: rtl;
        }

        .auth-container.ltr {
          direction: ltr;
        }

        .language-switch {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .lang-btn {
          padding: 8px 12px;
          border: 2px solid #00d18b;
          background: rgba(255, 255, 255, 0.9);
          color: #00d18b;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .lang-btn.active {
          background: #00d18b;
          color: white;
        }

        .lang-btn:hover {
          transform: scale(1.05);
        }

        .logo-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .logo-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circular-text {
          position: absolute;
          width: 200px;
          height: 200px;
          font-size: 11px;
          font-weight: bold;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .circular-text span {
          position: absolute;
          left: 50%;
          transform-origin: 0 100px;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .logo-center {
          position: absolute;
          width: 140px;
          height: 40px;
          border-radius: 15px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }

        .logo-icon {
          font-size: 1.2rem;
          font-weight: 900;
          color: #000000;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          letter-spacing: 1px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 100%;
        }

        .form-card h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #000000;
          font-size: 1.3rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #000000;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e1e1;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          color: #000000;
          font-weight: 600;
        }

        .input-group input::placeholder {
          color: #666666;
          font-weight: 500;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .input-group input:focus {
          outline: none;
          border-color: #00d18b;
          box-shadow: 0 0 0 3px rgba(0, 209, 139, 0.1);
          transform: translateY(-1px);
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(145deg, #00d18b, #00ffe0);
          color: #000000;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 1rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 209, 139, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .switch-page {
          text-align: center;
          margin-top: 1.5rem;
          color: #000000;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .link-btn {
          background: none;
          border: none;
          color: #00d18b;
          cursor: pointer;
          font-weight: 800;
          text-decoration: underline;
          margin-left: 0.5rem;
          font-size: 0.85rem;
          transition: color 0.3s ease;
          text-transform: uppercase;
        }

        .rtl .link-btn {
          margin-left: 0;
          margin-right: 0.5rem;
        }

        .link-btn:hover {
          color: #00ffe0;
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 1rem;
          }
          
          .form-card {
            padding: 2rem;
          }
          
          .logo-wrapper {
            width: 150px;
            height: 150px;
          }
          
          .circular-text {
            width: 150px;
            height: 150px;
            font-size: 9px;
          }
          
          .circular-text span {
            transform-origin: 0 75px;
          }
          
          .logo-center {
            width: 110px;
            height: 30px;
          }
          
          .logo-icon {
            font-size: 1rem;
          }

          .language-switch {
            position: static;
            margin-bottom: 1rem;
          }
        }
      `}</style>
      
      {currentPage === 'login' ? <LoginPage /> : <RegisterPage />}
    </div>
  );
};

export default QualitySystemApp;
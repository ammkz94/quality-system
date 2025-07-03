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
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
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
const RestaurantSystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [reportPeriod, setReportPeriod] = useState('today');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [sopData, setSopData] = useState({
    en: [
      'FOOD SAFETY: Maintain temperature logs every 2 hours',
      'CUSTOMER SERVICE: Greet customers within 30 seconds',
      'KITCHEN OPERATIONS: Check meat temperature before serving',
      'CLEANLINESS: Sanitize surfaces every 30 minutes',
      'INVENTORY: Count stock daily at closing time',
      'STAFF TRAINING: Weekly safety meetings required'
    ],
    ar: [
      'سلامة الغذاء: الحفاظ على سجلات الحرارة كل ساعتين',
      'خدمة العملاء: الترحيب بالعملاء خلال 30 ثانية',
      'عمليات المطبخ: فحص درجة حرارة اللحوم قبل التقديم',
      'النظافة: تعقيم الأسطح كل 30 دقيقة',
      'المخزون: عد المخزون يومياً عند الإغلاق',
      'تدريب الموظفين: اجتماعات السلامة الأسبوعية مطلوبة'
    ]
  });
  const [editingSOP, setEditingSOP] = useState(false);
  const [newSOPItem, setNewSOPItem] = useState('');

  const translations = {
    en: {
      login: 'LOGIN',
      username: 'USERNAME',
      password: 'PASSWORD',
      loginButton: 'LOGIN',
      loginTitle: 'LOGIN TO RESTAURANT SYSTEM',
      dashboard: 'DASHBOARD',
      sales: 'SALES',
      sop: 'SOP MANAGEMENT',
      today: 'TODAY',
      week: 'WEEK',
      month: 'MONTH',
      quarterly: 'QUARTERLY',
      restaurantName: 'PRIME STEAK HOUSE',
      teamCommitment: 'TEAM SOP COMMITMENT',
      sopCompliance: 'SOP COMPLIANCE RATES',
      editSOP: 'EDIT SOP',
      addSOPItem: 'ADD SOP ITEM',
      saveSOP: 'SAVE SOP',
      cancelEdit: 'CANCEL',
      salesReport: 'SALES REPORT',
      revenue: 'REVENUE',
      growth: 'GROWTH',
      logout: 'LOGOUT',
      enterUsername: 'ENTER USERNAME',
      enterPassword: 'ENTER PASSWORD'
    },
    ar: {
      login: 'تسجيل الدخول',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      loginButton: 'تسجيل الدخول',
      loginTitle: 'تسجيل الدخول إلى نظام المطعم',
      dashboard: 'لوحة التحكم',
      sales: 'المبيعات',
      sop: 'إدارة إجراءات التشغيل',
      today: 'اليوم',
      week: 'الأسبوع',
      month: 'الشهر',
      quarterly: 'ربع سنوي',
      restaurantName: 'مطعم البرايم ستيك',
      teamCommitment: 'التزام الفريق بإجراءات التشغيل',
      sopCompliance: 'معدلات الامتثال لإجراءات التشغيل',
      editSOP: 'تحرير إجراءات التشغيل',
      addSOPItem: 'إضافة عنصر إجراءات التشغيل',
      saveSOP: 'حفظ إجراءات التشغيل',
      cancelEdit: 'إلغاء',
      salesReport: 'تقرير المبيعات',
      revenue: 'الإيرادات',
      growth: 'النمو',
      logout: 'تسجيل الخروج',
      enterUsername: 'أدخل اسم المستخدم',
      enterPassword: 'أدخل كلمة المرور'
    }
  };

  const t = translations[language];

  // Sample data
  const salesData = {
    today: { amount: 15420, growth: 12.5, orders: 127 },
    week: { amount: 89650, growth: 8.3, orders: 892 },
    month: { amount: 342800, growth: 15.7, orders: 3654 },
    quarterly: { amount: 1250000, growth: 22.4, orders: 12847 }
  };

  const sopComplianceData = {
    foodSafety: 92,
    customerService: 85,
    kitchenOperations: 88,
    cleanliness: 95,
    inventory: 78,
    staffTraining: 89
  };

  const handleLogin = () => {
    if (loginData.username === '1' && loginData.password === '1') {
      setIsLoggedIn(true);
      setActiveSection('dashboard');
    } else {
      alert(language === 'en' ? 'Invalid credentials. Use username: 1 and password: 1' : 'بيانات اعتماد غير صحيحة. استخدم اسم المستخدم: 1 وكلمة المرور: 1');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    setActiveSection('dashboard');
    setSidebarOpen(false);
  };

  const handleAddSOPItem = () => {
    if (newSOPItem.trim()) {
      setSopData({
        ...sopData,
        [language]: [...sopData[language], newSOPItem.trim()]
      });
      setNewSOPItem('');
    }
  };

  const handleRemoveSOPItem = (index) => {
    setSopData({
      ...sopData,
      [language]: sopData[language].filter((_, i) => i !== index)
    });
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
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              placeholder={t.enterUsername}
            />
          </div>
          <div className="input-group">
            <label>{t.password}</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              placeholder={t.enterPassword}
            />
          </div>
          <button onClick={handleLogin} className="btn-primary">{t.loginButton}</button>
        </div>
      </motion.div>
    </motion.div>
  );

  const Sidebar = () => (
    <motion.div
      className={`sidebar ${sidebarOpen ? 'open' : ''} ${language === 'ar' ? 'rtl' : 'ltr'}`}
      initial={false}
      animate={{
        [language === 'ar' ? 'right' : 'left']: sidebarOpen ? 0 : -300
      }}
    >
      <div className="sidebar-header">
        <div className="logo-mini">
          <div className="logo-wrapper-mini">
            <CircularText 
              text="QUALITY • QUALITY • " 
              spinDuration={10}
              onHover="speedUp"
              className="logo-text-mini"
            />
            <div className="logo-center-mini">
              <div className="logo-icon-mini">THE SYSTEM</div>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          {t.dashboard}
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveSection('sales')}
        >
          {t.sales}
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'sop' ? 'active' : ''}`}
          onClick={() => setActiveSection('sop')}
        >
          {t.sop}
        </button>
        
        <button 
          className="nav-item logout-btn"
          onClick={handleLogout}
        >
          {t.logout}
        </button>
      </nav>
    </motion.div>
  );

  const DashboardContent = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>{t.teamCommitment}</h2>
        <p>{t.sopCompliance}</p>
      </div>
      
      <div className="commitment-chart">
        <div className="chart-grid">
          {Object.entries(sopComplianceData).map(([key, value]) => (
            <div key={key} className="compliance-item">
              <div className="compliance-bar">
                <div 
                  className="compliance-fill" 
                  style={{ height: `${value}%` }}
                >
                  <span className="compliance-value">{value}%</span>
                </div>
              </div>
              <div className="compliance-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">87%</div>
          <div className="stat-label">OVERALL COMPLIANCE</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Q1 2025</div>
          <div className="stat-label">CURRENT PERIOD</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">+5.2%</div>
          <div className="stat-label">IMPROVEMENT</div>
        </div>
      </div>
    </div>
  );

  const SalesContent = () => (
    <div className="sales-content">
      <div className="sales-header">
        <h2>{t.salesReport}</h2>
        <div className="period-selector">
          {['today', 'week', 'month', 'quarterly'].map(period => (
            <button
              key={period}
              className={`period-btn ${reportPeriod === period ? 'active' : ''}`}
              onClick={() => setReportPeriod(period)}
            >
              {t[period]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="sales-chart">
        <div className="chart-container">
          <div className="chart-bars">
            <div className="chart-bar sales-bar" style={{ height: `${(salesData[reportPeriod].amount / 1250000) * 100}%` }}>
              <span className="bar-label">{t.revenue}</span>
              <span className="bar-value">${salesData[reportPeriod].amount.toLocaleString()}</span>
            </div>
            <div className="chart-bar growth-bar" style={{ height: `${salesData[reportPeriod].growth * 3}%` }}>
              <span className="bar-label">{t.growth}</span>
              <span className="bar-value">+{salesData[reportPeriod].growth}%</span>
            </div>
            <div className="chart-bar orders-bar" style={{ height: `${(salesData[reportPeriod].orders / 12847) * 100}%` }}>
              <span className="bar-label">ORDERS</span>
              <span className="bar-value">{salesData[reportPeriod].orders}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sales-summary">
        <div className="summary-item">
          <strong>PERIOD:</strong> {t[reportPeriod]}
        </div>
        <div className="summary-item">
          <strong>TOTAL REVENUE:</strong> ${salesData[reportPeriod].amount.toLocaleString()}
        </div>
        <div className="summary-item">
          <strong>GROWTH RATE:</strong> +{salesData[reportPeriod].growth}%
        </div>
      </div>
    </div>
  );

  const SOPContent = () => (
    <div className="sop-content">
      <div className="sop-header">
        <h2>{t.sop}</h2>
        <button 
          className="edit-btn"
          onClick={() => setEditingSOP(!editingSOP)}
        >
          {editingSOP ? t.cancelEdit : t.editSOP}
        </button>
      </div>
      
      <div className="sop-list">
        {sopData[language].map((item, index) => (
          <div key={index} className="sop-item">
            <div className="sop-text">{item}</div>
            {editingSOP && (
              <button 
                className="remove-btn"
                onClick={() => handleRemoveSOPItem(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      {editingSOP && (
        <div className="add-sop-section">
          <input
            type="text"
            value={newSOPItem}
            onChange={(e) => setNewSOPItem(e.target.value)}
            placeholder={t.addSOPItem}
            className="sop-input"
          />
          <button onClick={handleAddSOPItem} className="add-btn">
            {t.addSOPItem}
          </button>
        </div>
      )}
    </div>
  );

  const MainContent = () => (
    <div className="main-content">
      <div className="top-bar">
        <button 
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h1 className="restaurant-name">{t.restaurantName}</h1>
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
      </div>
      
      <div className="content-area">
        {activeSection === 'dashboard' && <DashboardContent />}
        {activeSection === 'sales' && <SalesContent />}
        {activeSection === 'sop' && <SOPContent />}
      </div>
    </div>
  );

  return (
    <div className={`app ${language === 'ar' ? 'rtl' : 'ltr'}`}>
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
          font-family: 'Arial', sans-serif;
          position: relative;
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
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .auth-container.rtl {
          direction: rtl;
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
          color: #000000;
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
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon {
          font-size: 1.2rem;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          width: 100%;
        }

        .form-card h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #000000;
          font-size: 1.3rem;
          font-weight: 800;
          text-transform: uppercase;
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

        .input-group input:focus {
          outline: none;
          border-color: #00d18b;
          box-shadow: 0 0 0 3px rgba(0, 209, 139, 0.1);
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
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 209, 139, 0.3);
        }

        .sidebar {
          position: fixed;
          top: 0;
          width: 300px;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          z-index: 1000;
          transition: all 0.3s ease;
          overflow-y: auto;
        }

        .sidebar.rtl {
          right: -300px;
        }

        .sidebar.ltr {
          left: -300px;
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-wrapper-mini {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }

        .logo-text-mini {
          position: absolute;
          width: 80px;
          height: 80px;
          font-size: 6px;
          font-weight: bold;
          color: #00d18b;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .logo-text-mini span {
          position: absolute;
          left: 50%;
          transform-origin: 0 40px;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(0, 209, 139, 0.5);
        }

        .logo-center-mini {
          position: absolute;
          width: 60px;
          height: 20px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .logo-icon-mini {
          font-size: 0.4rem;
          font-weight: 900;
          color: #00d18b;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .sidebar-nav {
          padding: 1rem 0;
        }

        .nav-item {
          width: 100%;
          padding: 1rem;
          background: none;
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .rtl .nav-item {
          text-align: right;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(0, 209, 139, 0.2);
          color: #00ffe0;
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(255, 0, 0, 0.2) !important;
          color: #ff6b6b !important;
        }

        .logout-btn:hover {
          background: rgba(255, 0, 0, 0.3) !important;
        }

        .main-content {
          margin-left: 0;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .top-bar {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .restaurant-name {
          font-size: 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #00ffe0;
        }

        .content-area {
          padding: 2rem;
          min-height: calc(100vh - 80px);
        }

        .dashboard-content, .sales-content, .sop-content {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .dashboard-header h2, .sales-header h2, .sop-header h2 {
          color: #000000;
          font-size: 2rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 1rem;
          text-align: center;
        }

        .commitment-chart {
          margin: 2rem 0;
        }

        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .compliance-item {
          text-align: center;
        }

        .compliance-bar {
          height: 150px;
          width: 40px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          margin: 0 auto 1rem;
          position: relative;
          overflow: hidden;
        }

        .compliance-fill {
          width: 100%;
          background: linear-gradient(to top, #00d18b, #00ffe0);
          border-radius: 20px;
          position: absolute;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: height 0.5s ease;
        }

        .compliance-value {
          color: #000000;
          font-weight: 800;
          font-size: 0.8rem;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .compliance-label {
          color: #000000;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: rgba(0, 209, 139, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          border: 2px solid rgba(0, 209, 139, 0.3);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #000000;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #000000;
          text-transform: uppercase;
        }

        .sales-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .period-selector {
          display: flex;
          gap: 0.5rem;
        }

        .period-btn {
          padding: 0.5rem 1rem;
          background: rgba(0, 209, 139, 0.1);
          border: 2px solid #00d18b;
          color: #000000;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .period-btn.active {
          background: #00d18b;
          color: #000000;
        }

        .sales-chart {
          margin: 2rem 0;
        }

        .chart-container {
          height: 400px;
          display: flex;
          align-items: end;
          justify-content: center;
          background: rgba(0, 209, 139, 0.05);
          border-radius: 12px;
          padding: 2rem;
        }

        .chart-bars {
          display: flex;
          gap: 2rem;
          align-items: end;
          height: 100%;
        }

        .chart-bar {
          width: 80px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          padding: 1rem;
          color: #000000;
          font-weight: 700;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .sales-bar {
          background: linear-gradient(to top, #00d18b, #00ffe0);
        }

        .growth-bar {
          background: linear-gradient(to top, #c2f0ff, #b8ffb0);
        }

        .orders-bar {
          background: linear-gradient(to top, #00ffe0, #ffffff);
        }

        .bar-label {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }

        .bar-value {
          font-size: 0.9rem;
          font-weight: 800;
        }

        .sales-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .summary-item {
          background: rgba(0, 209, 139, 0.1);
          padding: 1rem;
          border-radius: 8px;
          color: #000000;
          font-weight: 600;
          text-transform: uppercase;
        }

        .sop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .edit-btn, .add-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(145deg, #00d18b, #00ffe0);
          color: #000000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .edit-btn:hover, .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 209, 139, 0.3);
        }

        .sop-list {
          margin-bottom: 2rem;
        }

        .sop-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(0, 209, 139, 0.1);
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #00d18b;
        }

        .rtl .sop-item {
          border-left: none;
          border-right: 4px solid #00d18b;
        }

        .sop-text {
          color: #000000;
          font-weight: 600;
          flex: 1;
        }

        .remove-btn {
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-sop-section {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .sop-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e1e1e1;
          border-radius: 8px;
          font-size: 1rem;
          color: #000000;
          font-weight: 600;
        }

        .sop-input:focus {
          outline: none;
          border-color: #00d18b;
          box-shadow: 0 0 0 3px rgba(0, 209, 139, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 250px;
          }
          
          .restaurant-name {
            font-size: 1.2rem;
          }
          
          .chart-container {
            height: 300px;
          }
          
          .chart-bars {
            gap: 1rem;
          }
          
          .chart-bar {
            width: 60px;
          }
          
          .sales-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .sop-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .add-sop-section {
            flex-direction: column;
          }
        }
      `}</style>
      
      {!isLoggedIn ? <LoginPage /> : (
        <>
          <Sidebar />
          <MainContent />
        </>
      )}
    </div>
  );
};

export default RestaurantSystem;
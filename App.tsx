
import React, { useState, useRef, useEffect } from 'react';
import { CardData, TemplateId, TEMPLATES, FONTS, FontStyle, FontSize, CardSizeId, CARD_SIZES, PaletteId, PALETTES, PatternId, PATTERNS } from './types';
import CardRenderer from './components/CardRenderer';
import { enhanceCardData } from './services/geminiService';

declare const html2canvas: any;

const LogoSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 45C15 45 20 25 40 25C60 25 55 45 75 45C95 45 100 25 100 25" stroke="url(#logo-grad)" strokeWidth="12" strokeLinecap="round" />
    <rect x="50" y="5" width="40" height="25" rx="4" fill="url(#logo-grad-light)" />
    <circle cx="70" cy="15" r="5" fill="white" />
    <path d="M60 28C60 22 80 22 80 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#075985" />
        <stop offset="1" stopColor="#0ea5e9" />
      </linearGradient>
      <linearGradient id="logo-grad-light" x1="50" y1="5" x2="90" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
  </svg>
);

const App: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('minimalist');
  const [fontFamily, setFontFamily] = useState<FontStyle>('Inter');
  const [fontSize, setFontSize] = useState<FontSize>('text-sm');
  const [cardSizeId, setCardSizeId] = useState<CardSizeId>('standard');
  const [paletteId, setPaletteId] = useState<PaletteId>('sky');
  const [patternId, setPatternId] = useState<PatternId>('none');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vcard-dark-mode');
    return saved === 'true';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [data, setData] = useState<CardData>({
    fullName: '',
    jobTitle: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    slogan: '',
    logoUrl: '',
    linkedin: '',
    twitter: '',
    github: '',
    qrConfig: {
      enabled: false,
      size: 80,
      x: 50,
      y: 50,
    }
  });

  useEffect(() => {
    localStorage.setItem('vcard-dark-mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleQrChange = (key: string, value: any) => {
    setData(prev => ({
      ...prev,
      qrConfig: { ...prev.qrConfig, [key]: value }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setData(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleMagicFill = async () => {
    if (!data.jobTitle && !data.companyName && !data.fullName) {
      alert("Please enter at least your name or job title first!");
      return;
    }
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceCardData(data);
      setData(prev => ({
        ...prev,
        slogan: enhanced.slogan || prev.slogan,
        jobTitle: enhanced.jobTitle || prev.jobTitle,
        companyName: enhanced.companyName || prev.companyName,
      }));
    } finally {
      setIsEnhancing(false);
    }
  };

  const handlePrint = () => {
    const cardElement = document.getElementById('printable-card');
    if (!cardElement) {
      alert("Could not find the card to print.");
      return;
    }
    window.print();
  };

  const handleDownloadImage = async () => {
    const cardElement = document.getElementById('printable-card');
    if (!cardElement) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 4, 
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `sw-vcard-${data.fullName.trim() || 'business-card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export image. Please try the Print option.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentSizeObj = CARD_SIZES.find(s => s.id === cardSizeId) || CARD_SIZES[0];

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <LogoSVG className="w-12 h-12 transition-transform group-hover:scale-110" />
            <div className="hidden xs:block">
              <h1 className={`text-xl font-black tracking-tighter leading-none ${darkMode ? 'text-sky-400' : 'text-sky-900'}`}>SW Vcard</h1>
              <p className="text-[10px] text-sky-500 font-bold uppercase tracking-[0.2em] mt-1">Professional Identity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title="Toggle Theme"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <button 
              onClick={handlePrint}
              className={`flex px-3 sm:px-4 py-2 font-semibold text-xs sm:text-sm rounded-xl transition-colors items-center gap-2 ${darkMode ? 'text-sky-400 hover:bg-slate-800' : 'text-sky-700 hover:bg-sky-50'}`}
              title="Print or Save as PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
              <span className="hidden xs:inline">Print / PDF</span>
            </button>
            <button 
              onClick={handleDownloadImage}
              disabled={isExporting}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 ${darkMode ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-sky-900 text-white hover:bg-sky-800'} ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  <span className="hidden xs:inline">Download PNG</span>
                  <span className="xs:hidden">PNG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          <section className={`rounded-3xl p-6 shadow-sm border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 17-5 5-5-5"/><path d="m7 7 5-5 5 5"/></svg>
              Card Dimensions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {CARD_SIZES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setCardSizeId(s.id)}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl border-2 transition-all ${cardSizeId === s.id ? (darkMode ? 'border-sky-500 bg-sky-950 text-sky-400' : 'border-sky-500 bg-sky-50 text-sky-700') : (darkMode ? 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-800/50' : 'border-slate-100 text-slate-600 hover:border-slate-200 bg-slate-50/50')}`}
                >
                  <span className="text-xs font-black uppercase tracking-tighter">{s.name}</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase mt-1">{s.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-3xl p-6 shadow-sm border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>
              Typography & Style
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-bold uppercase mb-2 block tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Font Family</label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map(f => (
                    <button
                      key={f}
                      onClick={() => setFontFamily(f)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${fontFamily === f ? (darkMode ? 'border-sky-500 bg-sky-950 text-sky-400' : 'border-sky-500 bg-sky-50 text-sky-700') : (darkMode ? 'border-slate-800 text-slate-400 hover:border-slate-700' : 'border-slate-100 text-slate-600 hover:border-slate-200')}`}
                      style={{ fontFamily: `'${f}', sans-serif` }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase mb-2 block tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Text Scaling</label>
                <div className="flex gap-2">
                  {(['text-xs', 'text-sm', 'text-base'] as FontSize[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setFontSize(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border-2 transition-all ${fontSize === s ? (darkMode ? 'border-sky-500 bg-sky-950 text-sky-400' : 'border-sky-500 bg-sky-50 text-sky-700') : (darkMode ? 'border-slate-800 text-slate-400 hover:border-slate-700' : 'border-slate-100 text-slate-600 hover:border-slate-200')}`}
                    >
                      {s.split('-')[1].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={`rounded-3xl p-6 shadow-sm border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>
              Color Scheme
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {PALETTES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPaletteId(p.id)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-2xl border-2 transition-all ${paletteId === p.id ? (darkMode ? 'border-sky-500 bg-sky-950 shadow-sm' : 'border-sky-500 bg-sky-50 shadow-sm') : (darkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-800/50' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50')}`}
                >
                  <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: p.swatch }}></div>
                  <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">{p.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-3xl p-6 shadow-sm border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Background Pattern
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {PATTERNS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPatternId(p.id)}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${patternId === p.id ? (darkMode ? 'border-sky-500 bg-sky-950 text-sky-400' : 'border-sky-500 bg-sky-50 text-sky-700') : (darkMode ? 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-800/50' : 'border-slate-100 text-slate-600 hover:border-slate-200 bg-slate-50/50')}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-3xl p-6 shadow-sm border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              Design Template
            </h2>
            <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`relative aspect-[1.75/1] rounded-xl border-2 transition-all duration-300 overflow-hidden flex items-center justify-center group ${activeTemplate === t.id ? (darkMode ? 'border-sky-500 ring-4 ring-sky-900/50 shadow-lg scale-[1.02]' : 'border-sky-600 ring-4 ring-sky-50 shadow-lg scale-[1.02]') : (darkMode ? 'border-slate-800 hover:border-slate-700 hover:scale-[1.02] hover:shadow-md' : 'border-slate-100 hover:border-slate-300 hover:scale-[1.02] hover:shadow-md')}`}
                >
                  <div className={`absolute inset-0 opacity-100 transition-transform duration-500 group-hover:scale-110 ${t.previewColor} ${darkMode && t.id === 'minimalist' ? 'bg-slate-800 border-slate-700' : ''}`}></div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className={`relative text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-sm transition-colors duration-300 ${activeTemplate === t.id ? 'text-sky-600 bg-white/95' : 'text-slate-500 bg-white/90'} ${darkMode ? 'bg-slate-900/90 text-slate-300' : ''}`}>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className={`rounded-3xl p-6 shadow-sm border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Identity Details</h2>
              <button 
                onClick={handleMagicFill}
                disabled={isEnhancing}
                className={`text-[10px] flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full transition-all disabled:opacity-50 border shadow-sm active:scale-95 ${darkMode ? 'text-sky-400 bg-slate-800 border-slate-700 hover:bg-slate-700' : 'text-sky-600 bg-sky-50 border-sky-100 hover:bg-sky-100'}`}
              >
                {isEnhancing ? <span className="animate-pulse">Magic...</span> : "Gemini Polish"}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className={`block text-[10px] font-extrabold uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Brand Logo</label>
                <div className="flex items-center gap-4">
                   <div className={`relative w-16 h-16 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-sky-500' : 'bg-slate-50 border-slate-200 hover:border-sky-400'}`} onClick={() => fileInputRef.current?.click()}>
                      {data.logoUrl ? (
                        <img src={data.logoUrl} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? 'text-slate-600' : 'text-slate-300'}><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                   </div>
                   {data.logoUrl && (
                     <button onClick={removeLogo} className={`text-[10px] font-bold underline ${darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-500 hover:text-sky-600'}`}>Remove Logo</button>
                   )}
                   <p className={`text-[10px] italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Square PNG/SVG recommended</p>
                </div>
              </div>

              <InputGroup label="Full Name" name="fullName" value={data.fullName} onChange={handleInputChange} placeholder="E.g. Jordan Smith" darkMode={darkMode} />
              <InputGroup label="Job Title" name="jobTitle" value={data.jobTitle} onChange={handleInputChange} placeholder="E.g. Creative Director" darkMode={darkMode} />
              <InputGroup label="Company" name="companyName" value={data.companyName} onChange={handleInputChange} placeholder="E.g. Horizon Labs" darkMode={darkMode} />
              <InputGroup label="Email" name="email" value={data.email} onChange={handleInputChange} placeholder="jordan@horizon.com" darkMode={darkMode} />
              <InputGroup label="Phone" name="phone" value={data.phone} onChange={handleInputChange} placeholder="+1 234 567 890" darkMode={darkMode} />
              <InputGroup label="Website" name="website" value={data.website} onChange={handleInputChange} placeholder="www.horizonlabs.io" darkMode={darkMode} />
              <InputGroup label="Address" name="address" value={data.address} onChange={handleInputChange} placeholder="San Francisco, CA" darkMode={darkMode} />
              
              <div className={`pt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Social Profiles</p>
                <div className="space-y-3">
                  <InputGroup label="LinkedIn URL" name="linkedin" value={data.linkedin || ''} onChange={handleInputChange} placeholder="linkedin.com/in/username" darkMode={darkMode} />
                  <InputGroup label="Twitter / X URL" name="twitter" value={data.twitter || ''} onChange={handleInputChange} placeholder="twitter.com/username" darkMode={darkMode} />
                  <InputGroup label="GitHub URL" name="github" value={data.github || ''} onChange={handleInputChange} placeholder="github.com/username" darkMode={darkMode} />
                </div>
              </div>

              <div className={`pt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Contact QR Code</p>
                  <button 
                    onClick={() => handleQrChange('enabled', !data.qrConfig.enabled)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${data.qrConfig.enabled ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${data.qrConfig.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                
                {data.qrConfig.enabled && (
                  <div className="space-y-4 animate-fadeInUp">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>QR Size: {data.qrConfig.size}px</label>
                      </div>
                      <input 
                        type="range" min="40" max="150" step="1" 
                        value={data.qrConfig.size} 
                        onChange={(e) => handleQrChange('size', parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-[9px] font-bold uppercase tracking-wider mb-1 block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pos X: {data.qrConfig.x}%</label>
                        <input 
                          type="range" min="0" max="100" step="1" 
                          value={data.qrConfig.x} 
                          onChange={(e) => handleQrChange('x', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>
                      <div>
                        <label className={`text-[9px] font-bold uppercase tracking-wider mb-1 block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pos Y: {data.qrConfig.y}%</label>
                        <input 
                          type="range" min="0" max="100" step="1" 
                          value={data.qrConfig.y} 
                          onChange={(e) => handleQrChange('y', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
           <div className="sticky top-24">
              <div className="mb-6 flex items-center justify-between">
                <h2 className={`text-xl font-black tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Design Canvas</h2>
                <div className="flex gap-2">
                  <div className={`flex items-center gap-2 px-4 py-1.5 border text-[10px] font-bold rounded-full shadow-sm uppercase tracking-widest transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-sky-400' : 'bg-sky-100 border-sky-200 text-sky-700'}`}>
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                    {currentSizeObj.name} View
                  </div>
                </div>
              </div>

              <div className={`rounded-[40px] p-8 md:p-16 border-2 flex items-center justify-center min-h-[550px] relative overflow-hidden shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-950 border-slate-800'}`}>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: darkMode ? 'radial-gradient(circle, #1e293b 1px, transparent 1px)' : 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="w-full max-w-[600px] transform transition-all duration-700 ease-in-out">
                  <CardRenderer 
                    data={data} 
                    templateId={activeTemplate} 
                    fontFamily={fontFamily} 
                    fontSize={fontSize} 
                    sizeId={cardSizeId}
                    paletteId={paletteId}
                    patternId={patternId}
                    darkMode={darkMode}
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-3xl border shadow-sm flex items-center gap-4 transition-all ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-sky-900' : 'bg-white border-slate-100 hover:border-sky-200'} cursor-help`}>
                   <div className={`p-3 rounded-2xl ${darkMode ? 'bg-sky-950 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                   </div>
                   <div>
                      <h4 className={`text-xs font-black uppercase ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Adaptive Scaling</h4>
                      <p className={`text-[10px] mt-1 font-bold uppercase tracking-tighter ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Content adjusts to {currentSizeObj.description}</p>
                   </div>
                </div>
                <div className={`p-5 rounded-3xl border shadow-sm flex items-center gap-4 transition-all ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-900' : 'bg-white border-slate-100 hover:border-indigo-200'} cursor-help`}>
                   <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   </div>
                   <div>
                      <h4 className={`text-xs font-black uppercase ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Premium Output</h4>
                      <p className={`text-[10px] mt-1 font-bold uppercase tracking-tighter ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>High-resolution PNG & PDF export</p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </main>
      
      <footer className={`mt-20 border-t py-16 text-center relative overflow-hidden transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
            <span className={`text-[20vw] font-black uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>SW VCARD</span>
         </div>
         <div className="flex flex-col items-center gap-2">
           <LogoSVG className={`w-16 h-10 opacity-50 ${darkMode ? 'brightness-125' : ''}`} />
           <p className={`text-sm font-black uppercase tracking-[0.3em] ${darkMode ? 'text-sky-400' : 'text-sky-900'}`}>SW Vcard</p>
           <p className={`text-[10px] font-bold uppercase tracking-[0.5em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>The ultimate professional card smith</p>
         </div>
      </footer>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  darkMode: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, placeholder, darkMode }) => (
  <div className="space-y-1">
    <label htmlFor={name} className={`block text-[10px] font-extrabold uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all placeholder:text-slate-300 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 focus:ring-sky-500/10 focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-sky-500/10 focus:border-sky-500'}`}
    />
  </div>
);

export default App;

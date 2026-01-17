
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CardData, TemplateId, FontStyle, FontSize, CardSizeId, CARD_SIZES, PaletteId, PALETTES, PatternId } from '../types';

interface CardRendererProps {
  data: CardData;
  templateId: TemplateId;
  fontFamily: FontStyle;
  fontSize: FontSize;
  sizeId: CardSizeId;
  paletteId: PaletteId;
  patternId: PatternId;
  darkMode: boolean;
}

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

const CardRenderer: React.FC<CardRendererProps> = ({ data, templateId, fontFamily, fontSize, sizeId, paletteId, patternId, darkMode }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const activeSize = CARD_SIZES.find(s => s.id === sizeId) || CARD_SIZES[0];
  const palette = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  const containerClass = `relative w-full ${activeSize.aspectRatio} overflow-hidden rounded-xl card-shadow select-none transition-all duration-500 ease-in-out`;
  const styleObj = { fontFamily: `'${fontFamily}', sans-serif` };

  useEffect(() => {
    if (data.qrConfig.enabled) {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.fullName}
ORG:${data.companyName}
TITLE:${data.jobTitle}
TEL;TYPE=WORK,VOICE:${data.phone}
EMAIL:${data.email}
URL:${data.website}
ADR;TYPE=WORK:;;${data.address};;;;
END:VCARD`;
      
      QRCode.toDataURL(vcard, {
        margin: 1,
        width: 256,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [data.fullName, data.companyName, data.jobTitle, data.phone, data.email, data.website, data.address, data.qrConfig.enabled]);

  const renderLogo = (className: string = "w-12 h-12 object-contain") => {
    if (!data.logoUrl) return null;
    return <img src={data.logoUrl} alt="Logo" className={`${className} vcard-animate`} />;
  };

  const renderQrCode = () => {
    if (!data.qrConfig.enabled || !qrDataUrl) return null;
    return (
      <div 
        className="absolute z-50 bg-white p-1 rounded-lg shadow-lg vcard-animate delay-300 overflow-hidden transition-all duration-300 border border-black/5"
        style={{
          width: `${data.qrConfig.size}px`,
          height: `${data.qrConfig.size}px`,
          left: `${data.qrConfig.x}%`,
          top: `${data.qrConfig.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img src={qrDataUrl} alt="QR Code" className="w-full h-full" />
      </div>
    );
  };

  const renderSocials = (colorClass: string = "text-slate-400") => {
    if (!data.linkedin && !data.twitter && !data.github) return null;
    return (
      <div className="flex gap-2 items-center vcard-animate delay-400">
        {data.linkedin && <LinkedInIcon className={`w-4 h-4 ${colorClass}`} />}
        {data.twitter && <TwitterIcon className={`w-4 h-4 ${colorClass}`} />}
        {data.github && <GitHubIcon className={`w-4 h-4 ${colorClass}`} />}
      </div>
    );
  };

  const renderPattern = () => {
    if (patternId === 'none') return null;

    let opacity = 0.05;

    switch (patternId) {
      case 'dots':
        return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', opacity }} />;
      case 'grid':
        return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px', opacity }} />;
      case 'stripes':
        return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 10px)', opacity }} />;
      case 'waves':
        return (
          <div className="absolute inset-0 pointer-events-none" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.526 0-16.246 1.237-26 5-3.31 1.28-5.893 2.277-8.261 3h5.445z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            opacity
          }} />
        );
      case 'circuit':
        return (
          <div className="absolute inset-0 pointer-events-none" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M10 10h10v10H10zM30 10h10v10H30zM50 10h10v10H50zM70 10h10v10H70zM90 10h10v10H90z' fill='currentColor' fill-opacity='1'/%3E%3Cpath d='M15 15v15M35 15v15M55 15v15M75 15v15M95 15v15' stroke='currentColor' stroke-width='1'/%3E%3C/svg%3E")`,
            opacity: opacity * 0.8
          }} />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (templateId) {
      case 'minimalist':
        const minimalBg = darkMode ? 'bg-slate-900' : 'bg-white';
        const minimalText = darkMode ? 'text-slate-100' : 'text-slate-800';
        const minimalSubtext = darkMode ? 'text-slate-400' : 'text-slate-400';
        const minimalBorder = darkMode ? 'border-slate-800' : 'border-gray-100';
        
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} ${minimalBg} border ${minimalBorder} p-8 flex flex-col justify-between ${minimalText}`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className="relative flex justify-between items-start">
              <div>
                <h1 className={`text-3xl font-bold tracking-tight leading-none vcard-animate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{data.fullName || 'Your Full Name'}</h1>
                <p className={`text-sm font-medium ${palette.primaryText} mt-2 uppercase tracking-widest vcard-animate delay-100`}>{data.jobTitle || 'Job Title'}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                {data.logoUrl ? renderLogo("w-14 h-14 object-contain mb-2") : (
                  <p className={`font-bold text-lg vcard-animate delay-200 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{data.companyName || 'Company Name'}</p>
                )}
                <p className={`text-[10px] italic max-w-[150px] mb-2 vcard-animate delay-300 ${minimalSubtext}`}>{data.slogan || 'Professional slogan'}</p>
                {renderSocials(minimalSubtext)}
              </div>
            </div>
            <div className={`relative flex justify-between items-end border-t pt-6 ${fontSize} vcard-animate delay-400 ${minimalBorder}`}>
              <div className="space-y-1">
                <p>📞 {data.phone || '+1 555-0000'}</p>
                <p>✉️ {data.email || 'hello@site.com'}</p>
              </div>
              <div className="space-y-1 text-right">
                <p>🌐 {data.website || 'www.site.com'}</p>
                <p>📍 {data.address || '123 Ave, City'}</p>
              </div>
            </div>
          </div>
        );

      case 'corporate':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} ${palette.darkBg} text-white p-10 flex`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className={`absolute left-0 top-0 w-2 h-full ${palette.accentBg}`}></div>
            <div className="relative flex-1 flex flex-col justify-between">
              <div>
                <p className={`text-xs font-bold ${palette.accentText} tracking-[0.3em] mb-2 vcard-animate`}>{data.companyName?.toUpperCase() || 'CORP'}</p>
                <h1 className="text-4xl font-light tracking-wide vcard-animate delay-100">{data.fullName || 'Your Name'}</h1>
                <div className={`h-0.5 w-12 ${palette.accentBg} my-4 vcard-animate delay-200`}></div>
                <p className="text-sm text-white/60 font-medium mb-4 vcard-animate delay-300">{data.jobTitle || 'Executive Officer'}</p>
                {renderSocials("text-white/40")}
              </div>
              <div className={`grid grid-cols-2 gap-4 text-white/80 ${fontSize} vcard-animate delay-400`}>
                <p>T: {data.phone || 'Phone'}</p>
                <p>W: {data.website || 'Website'}</p>
                <p>E: {data.email || 'Email'}</p>
                <p>A: {data.address || 'Address'}</p>
              </div>
            </div>
            <div className="relative w-24 flex items-center justify-center">
              {data.logoUrl ? renderLogo("w-20 h-20 object-contain brightness-0 invert opacity-80") : (
                <div className="border-4 border-white/20 rounded-full p-4 opacity-20">
                  <div className={`w-8 h-8 ${palette.accentBg} rounded-sm rotate-45`}></div>
                </div>
              )}
            </div>
          </div>
        );

      case 'modern-gradient':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} bg-gradient-to-br ${palette.gradient} text-white p-0 flex flex-col`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className="relative p-8 flex-1 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4 flex items-center justify-center border border-white/30 shadow-xl overflow-hidden vcard-animate">
                  {data.logoUrl ? renderLogo("w-full h-full object-cover") : (
                    <span className="text-3xl font-bold">{(data.companyName || 'C').charAt(0).toUpperCase()}</span>
                  )}
               </div>
               <h1 className="text-3xl font-bold mb-1 drop-shadow-md vcard-animate delay-100">{data.fullName || 'Creative Pro'}</h1>
               <p className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm mb-4 vcard-animate delay-200">{data.jobTitle || 'Designer'}</p>
               {renderSocials("text-white")}
            </div>
            <div className={`relative bg-black/20 backdrop-blur-md p-4 grid grid-cols-2 gap-2 border-t border-white/10 ${fontSize} vcard-animate delay-300`}>
               <p className="truncate">📍 {data.address || 'Worldwide'}</p>
               <p className="truncate text-right">🌐 {data.website || 'portfolio.me'}</p>
               <p className="truncate">✉️ {data.email || 'hello@world.com'}</p>
               <p className="truncate text-right">📞 {data.phone || '+0 123'}</p>
            </div>
          </div>
        );

      case 'tech-mono':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} ${palette.darkBg} ${palette.accentText} p-8 border border-white/5`} style={{ ...styleObj, fontFamily: `'Space Mono', monospace` }}>
            {renderPattern()}
            {renderQrCode()}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-3 z-10">
              <div className="opacity-40">
                {data.logoUrl && renderLogo("w-10 h-10 object-contain grayscale brightness-200")}
              </div>
              {renderSocials(`${palette.accentText}/40`)}
            </div>
            <div className="relative flex flex-col h-full z-10">
              <div className="mb-auto">
                <p className="text-[10px] text-zinc-500 mb-1 vcard-animate">// {data.companyName?.toLowerCase().replace(/\s/g, '_') || 'sys'}</p>
                <h1 className="text-2xl font-bold tracking-tighter text-white vcard-animate delay-100">&lt;{data.fullName || 'User'} /&gt;</h1>
                <p className={`text-xs mt-2 ${palette.accentText}/80 vcard-animate delay-200`}>function {data.jobTitle?.replace(/\s/g, '') || 'Dev'}() &#123;</p>
              </div>
              <div className={`space-y-1 ${fontSize} vcard-animate delay-300`}>
                <p><span className="text-zinc-500">Email:</span> "{data.email || 'dev@local'}"</p>
                <p><span className="text-zinc-500">Site:</span> "{data.website || 'localhost'}"</p>
                <p className={`${palette.accentText}/80`}>&#125;</p>
              </div>
            </div>
          </div>
        );

      case 'luxury-gold':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} bg-[#1a1a1a] text-[#d4af37] p-10 flex flex-col justify-center items-center border-[8px] border-[#d4af37]/20`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className="relative mb-4 z-10 vcard-animate">
              {data.logoUrl ? renderLogo("w-16 h-16 object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]") : (
                <div className="border border-[#d4af37]/30 w-12 h-12 flex items-center justify-center rotate-45">
                   <span className="-rotate-45 font-serif text-2xl">{(data.companyName || 'L').charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="relative text-center z-10">
               <h1 className="text-4xl tracking-widest uppercase mb-1 drop-shadow-lg text-[#f1d279] vcard-animate delay-100">{data.fullName || 'Elite'}</h1>
               <div className="w-48 h-px bg-[#d4af37] mx-auto my-3 opacity-50 vcard-animate delay-200"></div>
               <p className="text-xs uppercase tracking-[0.5em] text-[#d4af37]/80 mb-6 vcard-animate delay-300">{data.jobTitle || 'CEO'}</p>
               {renderSocials("text-[#d4af37]/50")}
            </div>
            <div className={`relative mt-auto grid grid-cols-3 gap-8 tracking-widest text-[#d4af37]/60 text-center w-full z-10 ${fontSize} vcard-animate delay-400`}>
              <p>{data.phone || 'Phone'}</p>
              <p>{data.email || 'Email'}</p>
              <p>{data.website || 'Web'}</p>
            </div>
          </div>
        );

      case 'creative-glass':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} bg-gradient-to-tr ${palette.gradient} p-8`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)]"></div>
            <div className="relative h-full bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-8 flex flex-col justify-between shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-white uppercase tracking-tighter vcard-animate">{data.fullName || 'Creative Name'}</h1>
                  <p className="text-xs text-white/70 font-bold tracking-widest mb-4 vcard-animate delay-100">{data.jobTitle || 'Digital Creator'}</p>
                  {renderSocials("text-white")}
                </div>
                <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center font-bold text-white text-xl overflow-hidden border border-white/40 vcard-animate">
                  {data.logoUrl ? renderLogo("w-full h-full object-cover") : (data.companyName?.[0] || 'V')}
                </div>
              </div>
              <div className={`grid grid-cols-2 gap-y-2 text-white/90 ${fontSize} vcard-animate delay-300`}>
                 <p className="flex items-center gap-2">📱 {data.phone || 'Mobile'}</p>
                 <p className="flex items-center gap-2">💌 {data.email || 'Email'}</p>
                 <p className="flex items-center gap-2">📍 {data.address || 'Address'}</p>
                 <p className="flex items-center gap-2">🔗 {data.website || 'Website'}</p>
              </div>
            </div>
          </div>
        );

      case 'minimal-dark':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} ${palette.darkBg} text-white p-12 flex flex-col items-center justify-center`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className="relative mb-6 z-10 vcard-animate">
              {data.logoUrl && renderLogo("w-14 h-14 object-contain brightness-200 grayscale")}
            </div>
            <h1 className="relative text-4xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 z-10 vcard-animate delay-100">{data.fullName || 'Name'}</h1>
            <p className="relative text-xs uppercase tracking-[0.4em] text-white/40 mb-8 z-10 vcard-animate delay-200">{data.jobTitle || 'Professional'}</p>
            <div className="relative z-10">{renderSocials("text-white/20")}</div>
            <div className={`relative flex gap-6 text-white/40 border-t border-white/10 pt-6 w-full justify-center mt-auto z-10 ${fontSize} vcard-animate delay-400`}>
              <p>{data.phone || 'P'}</p>
              <p>{data.email || 'E'}</p>
              <p>{data.website || 'W'}</p>
            </div>
          </div>
        );

      case 'bauhaus-art':
        return (
          <div key={templateId} id="printable-card" className={`${containerClass} bg-yellow-400 text-black border-4 border-black font-black flex`} style={styleObj}>
            {renderPattern()}
            {renderQrCode()}
            <div className="relative w-1/3 bg-red-600 border-r-4 border-black flex flex-col items-center justify-center p-4 z-10">
               <div className="vcard-animate">
               {data.logoUrl ? (
                 <div className="bg-white p-2 border-2 border-black rotate-3 mb-4">
                   {renderLogo("w-16 h-16 object-contain")}
                 </div>
               ) : (
                 <div className="flex-1 bg-blue-700 w-full border-b-4 border-black mb-4 h-12"></div>
               )}
               </div>
               {renderSocials("text-black")}
               {!data.logoUrl && (
                 <div className="p-4 flex items-center justify-center vcard-animate delay-100">
                    <span className="text-4xl uppercase -rotate-90 origin-center whitespace-nowrap">{data.companyName || 'ART'}</span>
                 </div>
               )}
            </div>
            <div className="relative flex-1 p-8 flex flex-col justify-between z-10">
               <div>
                  <h1 className="text-3xl leading-none uppercase vcard-animate delay-100">{data.fullName || 'Bauhaus'}</h1>
                  <p className="text-sm mt-2 font-bold uppercase underline decoration-4 decoration-red-600 vcard-animate delay-200">{data.jobTitle || 'Architect'}</p>
               </div>
               <div className={`space-y-1 uppercase leading-tight ${fontSize} vcard-animate delay-300`}>
                  <p>{data.phone || 'Phone'}</p>
                  <p className="truncate">{data.email || 'Email'}</p>
                  <p className="truncate">{data.website || 'Site'}</p>
               </div>
            </div>
          </div>
        );

      default:
        return <div>Template not found</div>;
    }
  };

  return renderContent();
};

export default CardRenderer;

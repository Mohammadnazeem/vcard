
export type TemplateId = 
  | 'minimalist' 
  | 'corporate' 
  | 'modern-gradient' 
  | 'tech-mono' 
  | 'luxury-gold' 
  | 'creative-glass' 
  | 'minimal-dark' 
  | 'bauhaus-art';

export type FontStyle = 'Inter' | 'Playfair Display' | 'Space Mono' | 'Montserrat' | 'Lora' | 'Oswald';
export type FontSize = 'text-xs' | 'text-sm' | 'text-base';

export type CardSizeId = 'standard' | 'square' | 'slim' | 'portrait';

export type PaletteId = 'sky' | 'midnight' | 'sunset' | 'ocean' | 'lavender' | 'crimson';

export interface Palette {
  id: PaletteId;
  name: string;
  primaryText: string;
  primaryBg: string;
  accentText: string;
  accentBg: string;
  darkBg: string;
  lightBg: string;
  gradient: string;
  swatch: string;
}

export const PALETTES: Palette[] = [
  { 
    id: 'sky', 
    name: 'Sky Blue', 
    primaryText: 'text-sky-600', 
    primaryBg: 'bg-sky-600', 
    accentText: 'text-sky-400', 
    accentBg: 'bg-sky-500', 
    darkBg: 'bg-sky-950', 
    lightBg: 'bg-sky-50',
    gradient: 'from-sky-600 via-blue-600 to-indigo-500',
    swatch: '#0ea5e9' 
  },
  { 
    id: 'midnight', 
    name: 'Midnight', 
    primaryText: 'text-emerald-500', 
    primaryBg: 'bg-emerald-600', 
    accentText: 'text-emerald-400', 
    accentBg: 'bg-emerald-500', 
    darkBg: 'bg-zinc-950', 
    lightBg: 'bg-emerald-50',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    swatch: '#10b981' 
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    primaryText: 'text-orange-500', 
    primaryBg: 'bg-orange-600', 
    accentText: 'text-rose-400', 
    accentBg: 'bg-rose-500', 
    darkBg: 'bg-rose-950', 
    lightBg: 'bg-orange-50',
    gradient: 'from-orange-500 via-rose-500 to-purple-600',
    swatch: '#f97316' 
  },
  { 
    id: 'ocean', 
    name: 'Deep Ocean', 
    primaryText: 'text-cyan-600', 
    primaryBg: 'bg-cyan-600', 
    accentText: 'text-cyan-400', 
    accentBg: 'bg-cyan-500', 
    darkBg: 'bg-indigo-950', 
    lightBg: 'bg-cyan-50',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-700',
    swatch: '#06b6d4' 
  },
  { 
    id: 'lavender', 
    name: 'Lavender', 
    primaryText: 'text-violet-600', 
    primaryBg: 'bg-violet-600', 
    accentText: 'text-violet-400', 
    accentBg: 'bg-violet-500', 
    darkBg: 'bg-violet-950', 
    lightBg: 'bg-violet-50',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-500',
    swatch: '#8b5cf6' 
  },
  { 
    id: 'crimson', 
    name: 'Crimson', 
    primaryText: 'text-red-600', 
    primaryBg: 'bg-red-600', 
    accentText: 'text-red-400', 
    accentBg: 'bg-red-500', 
    darkBg: 'bg-red-950', 
    lightBg: 'bg-red-50',
    gradient: 'from-red-600 via-rose-700 to-orange-500',
    swatch: '#ef4444' 
  },
];

export type PatternId = 'none' | 'dots' | 'grid' | 'stripes' | 'waves' | 'circuit';

export interface Pattern {
  id: PatternId;
  name: string;
}

export const PATTERNS: Pattern[] = [
  { id: 'none', name: 'Plain' },
  { id: 'dots', name: 'Dots' },
  { id: 'grid', name: 'Grid' },
  { id: 'stripes', name: 'Stripes' },
  { id: 'waves', name: 'Waves' },
  { id: 'circuit', name: 'Circuit' },
];

export interface CardSize {
  id: CardSizeId;
  name: string;
  aspectRatio: string;
  description: string;
}

export const CARD_SIZES: CardSize[] = [
  { id: 'standard', name: 'Standard', aspectRatio: 'aspect-[1.75/1]', description: '3.5" x 2.0"' },
  { id: 'square', name: 'Square', aspectRatio: 'aspect-square', description: '2.5" x 2.5"' },
  { id: 'slim', name: 'Slim', aspectRatio: 'aspect-[3.5/1]', description: '3.5" x 1.0"' },
  { id: 'portrait', name: 'Portrait', aspectRatio: 'aspect-[1/1.75]', description: '2.0" x 3.5"' },
];

export interface QrCodeConfig {
  enabled: boolean;
  size: number;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export interface CardData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  slogan: string;
  logoUrl?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  qrConfig: QrCodeConfig;
}

export interface Template {
  id: TemplateId;
  name: string;
  previewColor: string;
}

export const TEMPLATES: Template[] = [
  { id: 'minimalist', name: 'Minimalist White', previewColor: 'bg-white border-gray-200' },
  { id: 'corporate', name: 'Executive Dark', previewColor: 'bg-slate-900 border-slate-900' },
  { id: 'modern-gradient', name: 'Vibrant Pulse', previewColor: 'bg-gradient-to-br from-purple-500 to-pink-500 border-none' },
  { id: 'tech-mono', name: 'Developer Grid', previewColor: 'bg-zinc-800 border-zinc-800' },
  { id: 'luxury-gold', name: 'Royal Gold', previewColor: 'bg-stone-900 border-stone-900' },
  { id: 'creative-glass', name: 'Glassmorphism', previewColor: 'bg-blue-100 border-white/50' },
  { id: 'minimal-dark', name: 'Onyx Clean', previewColor: 'bg-zinc-900 border-zinc-700' },
  { id: 'bauhaus-art', name: 'Bauhaus Art', previewColor: 'bg-yellow-400 border-black' },
];

export const FONTS: FontStyle[] = ['Inter', 'Playfair Display', 'Space Mono', 'Montserrat', 'Lora', 'Oswald'];

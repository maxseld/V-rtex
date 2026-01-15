import React, { useState, useEffect, useRef } from 'react';
import { Save, ArrowLeft, Copy, Monitor, Smartphone, Video, Sliders, Palette, Clock, Check, Loader2 } from 'lucide-react';
import { VSLConfig } from '../types';
import { generateVSLCode } from '../utils/generator';

interface EditorProps {
  initialConfig: VSLConfig;
  onSave: (config: VSLConfig) => Promise<void>;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialConfig, onSave, onBack }) => {
  const [config, setConfig] = useState<VSLConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'video' | 'style' | 'behavior'>('video');

  // Preview State simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  // Reset preview when video url changes or ratio changes
  useEffect(() => {
    setIsPlaying(false);
    setShowOverlay(true);
    setShowPauseIcon(false);
    setProgress(0);
    if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    }
  }, [config.videoUrl, config.ratio]);

  // Use real-time updates for preview to match the generated code logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
        if (video.duration) {
            const pct = Math.pow((video.currentTime / video.duration), config.retentionSpeed) * 100;
            setProgress(pct);
        }
    };

    const handleEnded = () => {
        setProgress(100);
        setIsPlaying(false);
        setShowPauseIcon(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
    };
  }, [config.retentionSpeed]);

  const handleCopyCode = () => {
    const code = generateVSLCode(config);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
        await onSave(config);
    } finally {
        setIsSaving(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setShowPauseIcon(true);
      videoRef.current?.pause();
    } else {
      setIsPlaying(true);
      setShowPauseIcon(false);
      setShowOverlay(false);
      videoRef.current?.play();
    }
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setIsPlaying(true);
    if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.currentTime = 0;
        videoRef.current.play();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: Settings Form */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-hidden h-full">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            <button 
              onClick={handleCopyCode}
              className={`flex items-center gap-2 ${copied ? 'bg-green-600' : 'bg-vortex-accent hover:bg-blue-600'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Prompt + Código'}
            </button>
          </div>
        </div>

        {/* Accordion List - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          
          {/* Card 1: Video Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div 
                className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
                onClick={() => setActiveAccordion('video')}
            >
                <div className="flex items-center gap-3">
                    <Video size={18} className="text-vortex-accent" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Configuração do Vídeo</span>
                </div>
            </div>
            
            {activeAccordion === 'video' && (
                <div className="p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Nome do Projeto</label>
                        <input 
                            type="text" 
                            value={config.name}
                            onChange={(e) => setConfig({...config, name: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-vortex-accent outline-none"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">URL do Vídeo (.mp4)</label>
                        <input 
                            type="text" 
                            value={config.videoUrl}
                            onChange={(e) => setConfig({...config, videoUrl: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-vortex-accent outline-none font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Proporção (Aspect Ratio)</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                            <button 
                                onClick={() => setConfig({...config, ratio: '16:9'})}
                                className={`py-2 text-xs font-bold rounded-md transition-all ${config.ratio === '16:9' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Horizontal (16:9)
                            </button>
                            <button 
                                onClick={() => setConfig({...config, ratio: '9:16'})}
                                className={`py-2 text-xs font-bold rounded-md transition-all ${config.ratio === '9:16' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Vertical (9:16)
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Card 2: Visual Style */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <div 
                className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
                onClick={() => setActiveAccordion('style')}
            >
                <div className="flex items-center gap-3">
                    <Palette size={18} className="text-vortex-accent" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Estilização</span>
                </div>
            </div>

            {activeAccordion === 'style' && (
                <div className="p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                        <label className="text-xs text-slate-400 font-medium flex justify-between">
                            <span>Cor Principal (Botões e Barra)</span>
                            <span className="text-white font-mono">{config.primaryColor}</span>
                        </label>
                        <div className="flex gap-4 items-center">
                            <div className="relative w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden shadow-lg cursor-pointer">
                                <input 
                                    type="color" 
                                    value={config.primaryColor}
                                    onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0" 
                                />
                                <div 
                                    className="w-full h-full" 
                                    style={{backgroundColor: config.primaryColor}}
                                ></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-2">Sugestões de alta conversão:</p>
                                <div className="flex gap-2">
                                    {['#2563eb', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setConfig({...config, primaryColor: c})}
                                            className="w-6 h-6 rounded-full border border-slate-700 hover:scale-110 transition-transform"
                                            style={{backgroundColor: c}}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Card 3: Behavior & Logic */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <div 
                className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
                onClick={() => setActiveAccordion('behavior')}
            >
                <div className="flex items-center gap-3">
                    <Sliders size={18} className="text-vortex-accent" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Comportamento</span>
                </div>
            </div>

            {activeAccordion === 'behavior' && (
                <div className="p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs text-slate-400 font-medium">Curvatura de Retenção</label>
                            <span className="text-xs font-mono text-vortex-accent bg-vortex-accent/10 px-2 py-1 rounded">
                                {config.retentionSpeed.toFixed(1)}x
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.1" 
                            value={config.retentionSpeed}
                            onChange={(e) => setConfig({...config, retentionSpeed: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-vortex-accent"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 font-medium uppercase">
                            <span>Rápido (Exponencial)</span>
                            <span>Normal (Linear)</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" />
                                <span className="text-sm font-medium">Delay de Conteúdo</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={config.hasDelay}
                                    onChange={(e) => setConfig({...config, hasDelay: e.target.checked})}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vortex-accent"></div>
                            </label>
                        </div>

                        {config.hasDelay && (
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 animate-in fade-in">
                                <label className="text-xs text-slate-500 mb-1 block">Revelar elementos após (segundos)</label>
                                <input 
                                    type="number"
                                    value={config.delaySeconds}
                                    onChange={(e) => setConfig({...config, delaySeconds: parseInt(e.target.value)})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Preview Area */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Preview Toolbar */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-center relative bg-slate-900 z-10">
          <span className="absolute left-4 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:block">Real-time Preview</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
                onClick={() => setActiveTab('desktop')}
                className={`p-2 rounded transition-all ${activeTab === 'desktop' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                title="Desktop View"
            >
                <Monitor size={18} />
            </button>
            <button 
                onClick={() => setActiveTab('mobile')}
                className={`p-2 rounded transition-all ${activeTab === 'mobile' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                title="Mobile View"
            >
                <Smartphone size={18} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

            {/* Simulated VSL Container */}
            <div 
                className="relative transition-all duration-500 ease-in-out shadow-2xl"
                style={{
                    width: activeTab === 'mobile' || config.ratio === '9:16' ? '360px' : '800px',
                    maxWidth: '100%',
                    aspectRatio: config.ratio.replace(':', '/'),
                    borderRadius: '15px',
                    backgroundColor: '#000',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                }}
            >
                <video 
                    ref={videoRef}
                    src={config.videoUrl} 
                    className="w-full h-full object-cover rounded-[15px] cursor-pointer"
                    onClick={togglePlay}
                    playsInline
                    muted
                />

                {showOverlay && (
                    <div 
                        onClick={handleOverlayClick}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-30 rounded-[15px] backdrop-blur-[2px]"
                    >
                        <div 
                            className="text-white px-6 py-4 rounded-full font-bold text-base shadow-lg animate-bounce"
                            style={{
                                backgroundColor: config.primaryColor,
                                boxShadow: `0 4px 15px ${config.primaryColor}80`
                            }}
                        >
                            🔊 CLIQUE PARA OUVIR
                        </div>
                    </div>
                )}

                {showPauseIcon && (
                    <div 
                        onClick={togglePlay}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    >
                         <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${config.primaryColor}cc` }}
                         >
                            <div className="ml-1 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-l-[25px] border-l-white"></div>
                        </div>
                    </div>
                )}

                {/* Progress Bar - RIGOROUSLY 12px */}
                <div className="absolute bottom-0 left-0 w-full h-[12px] bg-white/20 z-20 rounded-b-[15px] overflow-hidden">
                    <div 
                        style={{
                            width: `${progress}%`,
                            backgroundColor: config.primaryColor,
                            height: '100%',
                            transition: 'width 0.1s linear'
                        }}
                    ></div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};
import { VSLConfig } from '../types';

/**
 * Escapes special characters to prevent XSS or code injection in generated templates
 */
const escapeHTML = (str: string): string => {
  return str
    .replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m] || m);
};

/**
 * Generates the full HTML/JS code for the VSL with fixed retention logic and styling.
 */
export const generateVSLCode = (config: VSLConfig): string => {
  const isVertical = config.ratio === '9:16';
  const maxWidth = isVertical ? '400px' : '900px';
  const videoUrl = encodeURI(config.videoUrl); // Sanitize URL
  const primaryColor = config.primaryColor.startsWith('#') ? config.primaryColor : '#2563eb';
  const curvaturaSensorial = config.retentionSpeed;
  const projectName = escapeHTML(config.name);

  // HTML + Script Template
  const htmlTemplate = `
<div id="vsl-container-${Math.floor(Math.random() * 1000)}" style="position: relative; width: 100%; max-width: ${maxWidth}; margin: 20px auto; aspect-ratio: ${config.ratio.replace(':', '/')}; background: #000; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5); font-family: sans-serif;">
    <!-- Project: ${projectName} -->
    <video id="vsl-video" autoplay muted playsinline onclick="togglePlay()" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;">
        <source src="${videoUrl}" type="video/mp4">
    </video>

    <div id="vsl-overlay" onclick="primeiroClique()" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 30;">
        <div style="background: ${primaryColor}; color: white; padding: 15px 25px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px ${primaryColor}66;">
            🔊 CLIQUE PARA OUVIR
        </div>
    </div>

    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 12px; background: rgba(255,255,255,0.2); z-index: 25;">
        <div id="progress-bar" style="width: 0%; height: 100%; background: ${primaryColor}; transition: width 0.1s linear;"></div>
    </div>
</div>

<script>
    (function() {
        const video = document.getElementById('vsl-video');
        const progressBar = document.getElementById('progress-bar');
        const curvatura = ${curvaturaSensorial};

        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                let pct = Math.pow((video.currentTime / video.duration), curvatura) * 100;
                progressBar.style.width = pct + '%';
            }
        });

        video.onended = () => { 
            progressBar.style.width = '100%'; 
        };

        window.primeiroClique = function() {
            if (!video) return;
            video.muted = false;
            video.currentTime = 0;
            video.play();
            const overlay = document.getElementById('vsl-overlay');
            if (overlay) overlay.style.display = 'none';
        }
        
        window.togglePlay = function() {
            if (!video) return;
            if (video.paused) video.play(); else video.pause();
        }
    })();
</script>
`.trim();

  return `
=== PROMPT PARA IA / DESENVOLVEDOR ===

OBJETIVO: Inserir o player de vídeo de alta conversão (VSL) abaixo no site.

LOCALIZAÇÃO DESEJADA: 
[ !!! INSIRA AQUI O LOCAL ONDE O VÍDEO DEVE APARECER !!! ]

INSTRUÇÕES TÉCNICAS:
1. Copie o bloco de código abaixo integralmente.
2. Cole-o como um elemento "HTML Personalizado" ou "Embed Code".

--- CÓDIGO DO PLAYER VORTEX ---

${htmlTemplate}

--- FIM DO CÓDIGO ---
`.trim();
};
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
 * Generates the full HTML/JS code for the VSL with recalibrated logic and styling.
 */
export const generateVSLCode = (config: VSLConfig): string => {
  const isVertical = config.ratio === '9:16';
  const maxWidth = isVertical ? '400px' : '900px';
  const videoUrl = encodeURI(config.videoUrl); // Sanitize URL
  const primaryColor = config.primaryColor.startsWith('#') ? config.primaryColor : '#2563eb';
  const curvaturaSensorial = config.retentionSpeed;
  const projectName = escapeHTML(config.name);
  const containerId = `vsl-container-${Math.floor(Math.random() * 10000)}`;

  // HTML + Script Template based on the "Recalibration Prompt"
  const htmlTemplate = `
<div id="${containerId}" style="position: relative; width: 100%; max-width: ${maxWidth}; margin: 20px auto; aspect-ratio: ${config.ratio.replace(':', '/')}; background: #000; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5); font-family: sans-serif;">
    <!-- Project: ${projectName} -->
    <video id="vsl-video" autoplay muted playsinline onclick="togglePlay()" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;">
        <source src="${videoUrl}" type="video/mp4">
    </video>

    <div id="vsl-overlay" onclick="primeiroClique()" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 30;">
        <div style="background: ${primaryColor}; color: white; padding: 15px 25px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px ${primaryColor}80;">
            🔊 CLIQUE PARA OUVIR
        </div>
    </div>

    <div id="pause-icon" onclick="togglePlay()" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 20;">
        <div class="vortex-pulse-button" style="width: 80px; height: 80px; background: ${primaryColor}66; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <div style="width: 0; height: 0; border-top: 15px solid transparent; border-bottom: 15px solid transparent; border-left: 25px solid white; margin-left: 5px;"></div>
        </div>
    </div>

    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 12px; background: rgba(255,255,255,0.2); z-index: 25;">
        <div id="progress-bar" style="width: 0%; height: 100%; background: ${primaryColor}; transition: width 0.1s linear;"></div>
    </div>
</div>

<style>
    @keyframes vortex-pulse-blue {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
    }
    .vortex-pulse-button { animation: vortex-pulse-blue 2s infinite ease-in-out; }
</style>

<script>
    (function() {
        const video = document.querySelector('#${containerId} #vsl-video');
        const overlay = document.querySelector('#${containerId} #vsl-overlay');
        const progressBar = document.querySelector('#${containerId} #progress-bar');
        const pauseIcon = document.querySelector('#${containerId} #pause-icon');
        const curvatura = ${curvaturaSensorial};

        window.primeiroClique = function() {
            if (!video) return;
            video.muted = false;
            video.currentTime = 0;
            video.play();
            if (overlay) overlay.style.display = 'none';
        };

        window.togglePlay = function() {
            if (!video) return;
            if (overlay && overlay.style.display === 'none') {
                if (video.paused) {
                    video.play();
                    if (pauseIcon) pauseIcon.style.display = 'none';
                } else {
                    video.pause();
                    if (pauseIcon) pauseIcon.style.display = 'block';
                }
            }
        };

        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                let progressoLogico = Math.pow((video.currentTime / video.duration), curvatura) * 100;
                if (progressoLogico > 100) progressoLogico = 100;
                if (progressBar) progressBar.style.width = progressoLogico + '%';
            }
        });

        video.onended = () => { 
            if (pauseIcon) pauseIcon.style.display = 'none'; 
            if (progressBar) progressBar.style.width = '100%'; 
        };
    })();
</script>
`.trim();

  return `
=== PROMPT PARA IA / DESENVOLVEDOR ===

OBJETIVO: Inserir o player de vídeo de alta conversão (Vortex VSL) abaixo no site.

LOCALIZAÇÃO DESEJADA: 
[ !!! INSIRA AQUI O LOCAL ONDE O VÍDEO DEVE APARECER !!! ]

INSTRUÇÕES TÉCNICAS:
1. Copie o bloco de código abaixo integralmente.
2. Cole-o como um elemento "HTML Personalizado" ou "Embed Code" na sua página de vendas.
3. Certifique-se de que o site suporta a execução de Scripts inline.

--- CÓDIGO DO PLAYER VORTEX RECALIBRADO ---

${htmlTemplate}

--- FIM DO CÓDIGO ---
`.trim();
};
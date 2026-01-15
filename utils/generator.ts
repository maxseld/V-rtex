import { VSLConfig } from '../types';

/**
 * Generates the full HTML/JS code for the VSL with fixed retention logic and styling.
 */
export const generateVSLCode = (config: VSLConfig): string => {
  const isVertical = config.ratio === '9:16';
  const maxWidth = isVertical ? '400px' : '900px';
  const videoUrl = config.videoUrl;
  const primaryColor = config.primaryColor;
  const curvaturaSensorial = config.retentionSpeed;

  // HTML + Script Template strictly following the user's instructions
  const htmlTemplate = `
<div id="vsl-container" style="position: relative; width: 100%; max-width: ${maxWidth}; margin: 20px auto; aspect-ratio: ${config.ratio.replace(':', '/')}; background: #000; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5); font-family: sans-serif;">
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
        const curvatura = ${curvaturaSensorial}; // Valor do Slider (0.1 a 1.0)

        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                // A matemática Math.pow garante que 1^curvatura sempre seja 1 (ou seja, 100%)
                let pct = Math.pow((video.currentTime / video.duration), curvatura) * 100;
                progressBar.style.width = pct + '%';
            }
        });

        video.onended = () => { 
            progressBar.style.width = '100%'; 
        };

        window.primeiroClique = function() {
            video.muted = false;
            video.currentTime = 0;
            video.play();
            document.getElementById('vsl-overlay').style.display = 'none';
        }
        
        window.togglePlay = function() {
            if (video.paused) video.play(); else video.pause();
        }
    })();
</script>
`.trim();

  // Return formatted Prompt + Code
  return `
=== PROMPT PARA IA / DESENVOLVEDOR ===

OBJETIVO: Inserir o player de vídeo de alta conversão (VSL) abaixo no site.

LOCALIZAÇÃO DESEJADA: 
[ !!! INSIRA AQUI O LOCAL ONDE O VÍDEO DEVE APARECER (Ex: Abaixo do H1, Na seção de Hero, No topo da página de vendas) !!! ]

INSTRUÇÕES TÉCNICAS:
1. Copie o bloco de código abaixo integralmente.
2. Cole-o como um elemento "HTML Personalizado" ou "Embed Code" no seu construtor de páginas (Wordpress, Elementor, Shopify, HTML puro, etc).
3. Não altere os IDs ou Classes para garantir que o script de automação (Sincronização de Barra 12px e Retenção) funcione corretamente.

--- CÓDIGO DO PLAYER VORTEX ---

${htmlTemplate}

--- FIM DO CÓDIGO ---
`.trim();
};
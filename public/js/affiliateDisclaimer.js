(function () {
    const STORAGE_KEY = 'echoview-affiliate-disclaimer';
    const LINK = 'https://github.com/seu-usuario/echoview/blob/main/AFILIADOS_DISCLAIMER.md'; // Atualizar com o link real

    function injectStyles() {
        if (document.getElementById('affiliate-disclaimer-styles')) return;
        const style = document.createElement('style');
        style.id = 'affiliate-disclaimer-styles';
        style.textContent = `
            .affiliate-banner {
                position: fixed;
                bottom: 1.5rem;
                right: 1.5rem;
                width: min(380px, calc(100vw - 2rem));
                background: rgba(5, 20, 34, 0.92);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 24px;
                box-shadow: 0 25px 60px rgba(0,0,0,0.5);
                padding: 1.25rem;
                z-index: 9000;
                color: white;
                backdrop-filter: blur(12px);
                animation: affiliate-slide 0.4s ease forwards;
            }
            @media (max-width: 640px) {
                .affiliate-banner {
                    left: 50%;
                    transform: translateX(-50%);
                    right: auto;
                    bottom: 1rem;
                }
            }
            @keyframes affiliate-slide {
                from { opacity: 0; transform: translate3d(0, 20px, 0); }
                to { opacity: 1; transform: translate3d(0, 0, 0); }
            }
            .affiliate-banner h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 700;
            }
            .affiliate-banner p {
                margin: 0.5rem 0 1rem;
                font-size: 0.9rem;
                color: rgba(229,231,235,0.85);
            }
            .affiliate-actions {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            .affiliate-btn {
                border: none;
                border-radius: 999px;
                padding: 0.55rem 1.2rem;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, filter 0.2s ease;
            }
            .affiliate-btn:active {
                transform: scale(0.97);
            }
        `;
        document.head.appendChild(style);
    }

    function createBanner() {
        if (localStorage.getItem(STORAGE_KEY)) return;
        injectStyles();

        const banner = document.createElement('div');
        banner.className = 'affiliate-banner';
        banner.innerHTML = `
            <h4><span class="material-symbols-outlined align-middle mr-1">paid</span> Transparência nos links</h4>
            <p>Alguns botões de “Assistir agora” utilizam links de afiliados. Se você contratar algum serviço por eles, podemos receber uma comissão sem alterar o preço para você.</p>
            <div class="affiliate-actions">
                <button class="affiliate-btn" data-action="dismiss" style="background: #4ade80; color: #051422;">Entendi</button>
                <a class="affiliate-btn" data-action="more" style="background: rgba(255,255,255,0.1); color: white; text-decoration: none;" href="${LINK}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
            </div>
        `;

        banner.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
            banner.remove();
        });

        document.body.appendChild(banner);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(createBanner, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(createBanner, 800));
    }
})();


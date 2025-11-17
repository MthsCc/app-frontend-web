(function () {
    const typeConfig = {
        info: {
            icon: 'info',
            accent: '#4c8eda'
        },
        success: {
            icon: 'check_circle',
            accent: '#4ade80'
        },
        warning: {
            icon: 'warning',
            accent: '#fbbf24'
        },
        error: {
            icon: 'error',
            accent: '#f87171'
        }
    };

    let toastContainer = null;

    const ensureToastContainer = () => {
        if (toastContainer) return toastContainer;
        toastContainer = document.createElement('div');
        toastContainer.id = 'appToastContainer';
        toastContainer.className = 'app-toast-container';

        const appendContainer = () => document.body.appendChild(toastContainer);
        if (document.body) {
            appendContainer();
        } else {
            document.addEventListener('DOMContentLoaded', appendContainer, { once: true });
        }

        return toastContainer;
    };

    const ensureStyles = () => {
        if (document.getElementById('app-feedback-styles')) return;
        const style = document.createElement('style');
        style.id = 'app-feedback-styles';
        style.textContent = `
            @keyframes toast-slide-in {
                from { opacity: 0; transform: translate3d(0, -10px, 0) scale(0.98); }
                to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
            }
            @keyframes toast-slide-out {
                from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                to { opacity: 0; transform: translate3d(0, -10px, 0) scale(0.96); }
            }
            .app-toast-container {
                position: fixed;
                top: 1.5rem;
                right: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                z-index: 9999;
                pointer-events: none;
                max-width: 24rem;
                width: calc(100vw - 2rem);
            }
            @media (max-width: 640px) {
                .app-toast-container {
                    right: 50%;
                    transform: translateX(50%);
                    width: calc(100vw - 1.5rem);
                }
            }
            .app-toast {
                background: rgba(5, 20, 34, 0.95);
                border-radius: 18px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 25px 50px rgba(3, 7, 18, 0.55);
                padding: 0.85rem 1.15rem;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                color: white;
                pointer-events: auto;
                animation: toast-slide-in 0.35s ease forwards;
            }
            .app-toast.fade-out {
                animation: toast-slide-out 0.3s ease forwards;
            }
            .app-toast-icon {
                width: 38px;
                height: 38px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                flex-shrink: 0;
                background: rgba(255,255,255,0.06);
            }
            .app-toast-content {
                flex: 1;
            }
            .app-toast-title {
                font-weight: 700;
                margin: 0;
                font-size: 0.95rem;
            }
            .app-toast-message {
                margin: 0.15rem 0 0;
                font-size: 0.9rem;
                color: rgba(229, 231, 235, 0.95);
            }
            .app-toast-close {
                background: none;
                border: none;
                color: rgba(255,255,255,0.7);
                cursor: pointer;
                font-size: 1.15rem;
                padding: 0.15rem;
            }
            .app-confirm-overlay {
                position: fixed;
                inset: 0;
                background: rgba(5, 8, 15, 0.85);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 1.5rem;
            }
            .app-confirm {
                width: 100%;
                max-width: 420px;
                background: rgba(7, 19, 33, 0.95);
                border-radius: 24px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 45px 90px rgba(3, 7, 18, 0.65);
                padding: 2rem;
                color: white;
                text-align: center;
                animation: toast-slide-in 0.35s ease forwards;
            }
            .app-confirm-icon {
                width: 68px;
                height: 68px;
                border-radius: 18px;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }
            .app-confirm h3 {
                margin: 0 0 0.75rem;
                font-size: 1.35rem;
                font-weight: 700;
            }
            .app-confirm p {
                margin: 0 auto 1.5rem;
                font-size: 0.95rem;
                color: rgba(229, 231, 235, 0.85);
                line-height: 1.5;
            }
            .app-confirm-actions {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            .app-btn {
                border: none;
                border-radius: 999px;
                padding: 0.8rem 1.5rem;
                font-weight: 600;
                cursor: pointer;
                flex: 1;
                min-width: 140px;
                transition: transform 0.2s ease, filter 0.2s ease;
            }
            .app-btn:active {
                transform: scale(0.97);
            }
        `;
        document.head.appendChild(style);
    };

    const getType = (type, message = '') => {
        if (typeConfig[type]) return type;
        const normalized = (message || '').toLowerCase();
        if (normalized.includes('erro') || normalized.includes('falha') || normalized.includes('não foi possível')) return 'error';
        if (normalized.includes('sucesso') || normalized.includes('adicionad') || normalized.includes('salvo')) return 'success';
        if (normalized.includes('tem certeza') || normalized.includes('atenção')) return 'warning';
        return 'info';
    };

    const createToast = (message, type = 'info', options = {}) => {
        ensureStyles();
        const container = ensureToastContainer();
        const variant = getType(type, message);
        const config = typeConfig[variant];
        
        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.innerHTML = `
            <div class="app-toast-icon" style="box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); color: ${config.accent};">
                <span class="material-symbols-outlined">${config.icon}</span>
            </div>
            <div class="app-toast-content">
                <p class="app-toast-title">${options.title || (variant === 'error' ? 'Algo deu errado' : variant === 'success' ? 'Tudo certo!' : variant === 'warning' ? 'Atenção' : 'Informação')}</p>
                <p class="app-toast-message">${message || 'Ação concluída'}</p>
            </div>
            <button class="app-toast-close" aria-label="Fechar notificação">&times;</button>
        `;

        const removeToast = () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 280);
        };

        toast.querySelector('.app-toast-close').addEventListener('click', removeToast);

        container.appendChild(toast);

        setTimeout(removeToast, options.duration || 4500);
        return toast;
    };

    window.showToast = (message, type = 'info', options = {}) => createToast(message, type, options);

    window.alert = (message, maybeType) => {
        const type = typeof maybeType === 'string' ? maybeType : getType(undefined, message);
        createToast(message, type);
    };

    window.showConfirm = ({ 
        title = 'Confirmar ação',
        message = 'Deseja continuar?',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        type = 'warning'
    } = {}) => {
        ensureStyles();
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'app-confirm-overlay';
            
            const variant = typeConfig[type] ? type : 'warning';
            const config = typeConfig[variant];
            
            overlay.innerHTML = `
                <div class="app-confirm">
                    <div class="app-confirm-icon" style="background: rgba(255,255,255,0.05); color: ${config.accent}; box-shadow: 0 10px 30px rgba(0,0,0,0.35);">
                        <span class="material-symbols-outlined">${config.icon}</span>
                    </div>
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="app-confirm-actions">
                        <button class="app-btn" data-action="cancel" style="background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.1);">${cancelText}</button>
                        <button class="app-btn" data-action="confirm" style="background: ${config.accent}; color: #051422;">${confirmText}</button>
                    </div>
                </div>
            `;

            const cleanup = (result) => {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 200);
                resolve(result);
            };

            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    cleanup(false);
                }
            });

            overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => cleanup(false));
            overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => cleanup(true));

            document.body.appendChild(overlay);
        });
    };
})();


/**
 * Sistema de Tutorial Simples e Funcional - VERSÃO CORRIGIDA
 */

const TutorialSystem = {
    STORAGE_KEY: 'echoview-tutorial-completed',
    currentStep: 0,
    positionUpdateInterval: null,
    modalClickHandler: null,
    steps: [
        {
            title: 'Bem-vindo ao EchoView!',
            content: 'Este tutorial vai te mostrar as principais funcionalidades da plataforma.',
            target: null
        },
        {
            title: '1. Catálogo de Filmes e Séries',
            content: 'Aqui você encontra o catálogo completo. Clique em qualquer filme ou série para ver os detalhes!',
            target: '.carousel-item, .grid-item',
            autoOpenModal: true
        },
        {
            title: '2. Adicionar à Watchlist',
            content: 'No modal, você pode marcar o status: "Quero Assistir", "Já Assisti" ou "Abandonado".',
            target: 'input[name="status"]',
            modalRequired: true
        },
        {
            title: '3. Comentar em Filmes',
            content: 'Você pode deixar comentários sobre filmes e séries que assistiu.',
            target: '#commentInput, textarea[placeholder*="comentário"]',
            modalRequired: true
        },
        {
            title: '4. Ver seu Perfil',
            content: 'Acesse seu perfil para ver suas estatísticas, watchlist e posts.',
            target: '#profileButton, button[onclick*="perfil"]',
            closeModal: true
        },
        {
            title: '5. EchoSocial',
            content: 'Compartilhe posts, curta e reposte conteúdo de outros usuários.',
            target: '#postsContainer, .posts-container, .social-feed, [class*="post"]',
            page: 'echosocial.html',
            fallbackToCenter: true
        },
        {
            title: 'Tutorial Concluído!',
            content: 'Agora você conhece as principais funcionalidades. Explore e divirta-se!',
            target: null
        }
    ],

    init() {
        if (localStorage.getItem(this.STORAGE_KEY) === 'true') {
            return;
        }
        
        this.injectStyles();
        this.createTutorialOverlay();
        this.showTutorial();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                z-index: 100000;
                pointer-events: none;
            }
            
            .modal {
                z-index: 99999 !important;
            }
            
            .modal.show {
                z-index: 99999 !important;
            }
            
            .tutorial-highlight {
                position: fixed;
                border: 3px solid #4ade80;
                border-radius: 8px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.5);
                z-index: 100001 !important;
                pointer-events: none;
                transition: all 0.3s ease;
            }
            
            .tutorial-card {
                background: linear-gradient(135deg, #072f57 0%, #051422 100%);
                border: 2px solid rgba(74, 222, 128, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                max-width: 500px;
                width: calc(100% - 2rem);
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
                z-index: 100003 !important;
                position: fixed !important;
                color: white;
                pointer-events: auto !important;
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                transition: top 0.3s ease, left 0.3s ease;
                margin: 1rem;
            }
            
            @media (max-width: 768px) {
                .tutorial-card {
                    padding: 1rem;
                    max-width: calc(100% - 2rem);
                    width: calc(100% - 2rem);
                    border-radius: 15px;
                }
                
                .tutorial-card h3 {
                    font-size: 1.25rem;
                }
                
                .tutorial-card p {
                    font-size: 0.9rem;
                }
                
                .tutorial-btn {
                    padding: 0.6rem 1.2rem;
                    font-size: 0.9rem;
                }
            }
            
            .tutorial-card * {
                pointer-events: auto !important;
            }
            
            .tutorial-card h3 {
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0 0 1rem 0;
            }
            
            .tutorial-card p {
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.6;
                margin: 0 0 1.5rem 0;
            }
            
            .tutorial-actions {
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
            }
            
            .tutorial-btn {
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
                pointer-events: auto !important;
            }
            
            .tutorial-btn-primary {
                background: linear-gradient(135deg, #335b7e 0%, #4a6f95 100%);
                color: white;
            }
            
            .tutorial-btn-primary:hover {
                background: linear-gradient(135deg, #4a6f95 0%, #5a7fa5 100%);
            }
            
            .tutorial-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .tutorial-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    },

    createTutorialOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.id = 'tutorialOverlay';
        document.body.appendChild(overlay);
    },

    showTutorial() {
        document.body.classList.add('tutorial-active');
        this.pauseAllCarousels();
        this.showStep(0);
    },
    
    blockModalInteractions() {
        const modal = document.getElementById('titleModal');
        if (!modal) return;

        // Salvar closeModal original
        if (typeof window.closeModal === 'function' && !window._originalCloseModal) {
            window._originalCloseModal = window.closeModal;
        }

        // Substituir closeModal
        window.closeModal = () => {
            if (document.body.classList.contains('tutorial-active') && !window._tutorialAllowClose) {
                console.log('Modal bloqueado durante tutorial');
                return false;
            }
            if (window._originalCloseModal) {
                return window._originalCloseModal();
            }
        };

        // Bloquear botão fechar
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.style.opacity = '0.5';
            closeBtn.style.cursor = 'not-allowed';
        }

        // Prevenir cliques no backdrop
        if (!this.modalClickHandler) {
            this.modalClickHandler = (e) => {
                if (e.target === modal && document.body.classList.contains('tutorial-active')) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            };
            modal.addEventListener('click', this.modalClickHandler, true);
        }
    },
    
    unblockModalInteractions() {
        // Restaurar closeModal
        if (window._originalCloseModal) {
            window.closeModal = window._originalCloseModal;
            delete window._originalCloseModal;
        }

        // Desbloquear botão fechar
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.style.opacity = '';
            closeBtn.style.cursor = '';
        }

        // Remover listener
        const modal = document.getElementById('titleModal');
        if (modal && this.modalClickHandler) {
            modal.removeEventListener('click', this.modalClickHandler, true);
            this.modalClickHandler = null;
        }

        delete window._tutorialAllowClose;
    },

    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.completeTutorial();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        
        // Limpar estado anterior
        this.clearHighlights();
        
        // Se o passo precisa fechar o modal
        if (step.closeModal) {
            this.closeModalForTutorial();
            setTimeout(() => this.renderStep(step, stepIndex), 500);
            return;
        }
        
        // Se precisa abrir modal
        if (step.autoOpenModal) {
            this.openExampleModal().then(() => {
                setTimeout(() => {
                    this.blockModalInteractions();
                    this.renderStep(step, stepIndex);
                }, 800);
            });
            return;
        }
        
        // Renderizar passo normal
        setTimeout(() => this.renderStep(step, stepIndex), 300);
    },

    renderStep(step, stepIndex) {
        this.createTutorialCard(step, stepIndex);
        
        if (step.target) {
            // Tentar múltiplos seletores se fornecidos
            const selectors = step.target.split(',').map(s => s.trim());
            let targetElement = null;
            
            for (const selector of selectors) {
                targetElement = document.querySelector(selector);
                if (targetElement) {
                    console.log('Elemento encontrado com seletor:', selector);
                    break;
                }
            }
            
            if (targetElement) {
                this.highlightElement(targetElement);
                this.startPositionTracking(step.target);
            } else {
                console.warn('Nenhum elemento encontrado para:', step.target);
                if (step.fallbackToCenter) {
                    console.log('Centralizando card (fallback)');
                    this.updateCardPosition(null);
                } else {
                    this.updateCardPosition(null);
                }
            }
        } else {
            this.updateCardPosition(null);
        }
    },

    clearHighlights() {
        // Parar tracking de posição
        if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
            this.positionUpdateInterval = null;
        }

        // Remover elementos do tutorial
        const highlight = document.getElementById('tutorialHighlight');
        const card = document.getElementById('tutorialCard');
        
        if (highlight) highlight.remove();
        if (card) card.remove();
    },

    startPositionTracking(targetSelector) {
        if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
        }

        this.positionUpdateInterval = setInterval(() => {
            // Tentar múltiplos seletores
            const selectors = targetSelector.split(',').map(s => s.trim());
            let targetElement = null;
            
            for (const selector of selectors) {
                targetElement = document.querySelector(selector);
                if (targetElement) break;
            }
            
            if (targetElement) {
                this.updateHighlightPosition(targetElement);
                this.updateCardPosition(targetSelector);
            }
        }, 100);
    },

    updateHighlightPosition(element) {
        const highlight = document.getElementById('tutorialHighlight');
        if (!highlight) return;

        const rect = element.getBoundingClientRect();
        highlight.style.left = `${rect.left - 6}px`;
        highlight.style.top = `${rect.top - 6}px`;
        highlight.style.width = `${rect.width + 12}px`;
        highlight.style.height = `${rect.height + 12}px`;
    },

    highlightElement(element) {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.id = 'tutorialHighlight';
        highlight.className = 'tutorial-highlight';
        highlight.style.left = `${rect.left - 6}px`;
        highlight.style.top = `${rect.top - 6}px`;
        highlight.style.width = `${rect.width + 12}px`;
        highlight.style.height = `${rect.height + 12}px`;
        document.body.appendChild(highlight);
        
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    createTutorialCard(step, stepIndex) {
        const overlay = document.getElementById('tutorialOverlay');
        if (!overlay) return;
        
        const oldCard = document.getElementById('tutorialCard');
        if (oldCard) oldCard.remove();
        
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        card.id = 'tutorialCard';
        
        card.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tutorial-actions">
                ${stepIndex > 0 ? '<button class="tutorial-btn tutorial-btn-secondary" onclick="TutorialSystem.previousStep()">← Anterior</button>' : ''}
                <button class="tutorial-btn tutorial-btn-secondary" onclick="TutorialSystem.skipTutorial()">Pular</button>
                <button class="tutorial-btn tutorial-btn-primary" onclick="TutorialSystem.nextStep()">
                    ${stepIndex === this.steps.length - 1 ? 'Concluir' : 'Próximo →'}
                </button>
            </div>
        `;
        
        overlay.appendChild(card);
        
        requestAnimationFrame(() => {
            this.updateCardPosition(step.target);
        });
    },

    updateCardPosition(targetSelector) {
        const card = document.getElementById('tutorialCard');
        if (!card) return;
        
        const isMobile = window.innerWidth <= 768;
        
        if (!targetSelector || isMobile) {
            card.style.top = '50%';
            card.style.left = '50%';
            card.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const selectors = targetSelector.split(',').map(s => s.trim());
        let targetElement = null;
        
        for (const selector of selectors) {
            targetElement = document.querySelector(selector);
            if (targetElement) break;
        }
        
        if (!targetElement) {
            card.style.top = '50%';
            card.style.left = '50%';
            card.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const rect = targetElement.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const spacing = 20;
        const padding = 20;
        
        let top, left;
        
        if (rect.top > cardRect.height + spacing + padding) {
            top = rect.top - cardRect.height - spacing;
            left = Math.max(padding, Math.min(rect.left, window.innerWidth - cardRect.width - padding));
        }
        else if (rect.bottom + cardRect.height + spacing + padding < window.innerHeight) {
            top = rect.bottom + spacing;
            left = Math.max(padding, Math.min(rect.left, window.innerWidth - cardRect.width - padding));
        }
        else if (rect.right + cardRect.width + spacing + padding < window.innerWidth) {
            top = Math.max(padding, Math.min(rect.top, window.innerHeight - cardRect.height - padding));
            left = rect.right + spacing;
        }
        else if (rect.left - cardRect.width - spacing > padding) {
            top = Math.max(padding, Math.min(rect.top, window.innerHeight - cardRect.height - padding));
            left = rect.left - cardRect.width - spacing;
        }
        else {
            card.style.top = '50%';
            card.style.left = '50%';
            card.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        card.style.top = `${top}px`;
        card.style.left = `${left}px`;
        card.style.transform = 'none';
    },

    async openExampleModal() {
        const firstItem = document.querySelector('.carousel-item, .grid-item');
        if (firstItem) {
            firstItem.click();
            
            return new Promise((resolve) => {
                const checkModal = setInterval(() => {
                    const modal = document.getElementById('titleModal');
                    if (modal && modal.classList.contains('show')) {
                        clearInterval(checkModal);
                        resolve();
                    }
                }, 100);
                
                setTimeout(() => {
                    clearInterval(checkModal);
                    resolve();
                }, 5000);
            });
        }
    },

    closeModalForTutorial() {
        const modal = document.getElementById('titleModal');
        if (!modal) return;
        
        console.log('Tentando fechar modal para tutorial...');
        
        // Permitir fechamento
        window._tutorialAllowClose = true;
        
        // Tentar todas as formas possíveis de fechar
        if (modal.classList.contains('show')) {
            // Método 1: Função original
            if (window._originalCloseModal) {
                console.log('Usando _originalCloseModal');
                window._originalCloseModal();
            }
            // Método 2: Função closeModal normal
            else if (typeof closeModal === 'function') {
                console.log('Usando closeModal');
                closeModal();
            }
            // Método 3: Remover classes manualmente
            else {
                console.log('Fechando modal manualmente');
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                
                // Remover backdrop se existir
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
        }
        
        // Garantir que o modal foi fechado
        setTimeout(() => {
            if (modal.classList.contains('show')) {
                console.log('Modal ainda aberto, forçando fechamento...');
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
            window._tutorialAllowClose = false;
        }, 200);
    },

    pauseAllCarousels() {
        document.body.setAttribute('data-tutorial-active', 'true');
    },

    resumeAllCarousels() {
        document.body.removeAttribute('data-tutorial-active');
    },

    nextStep() {
        this.showStep(this.currentStep + 1);
    },

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    },

    skipTutorial() {
        if (confirm('Deseja pular o tutorial?')) {
            this.completeTutorial();
        }
    },

    completeTutorial() {
        this.clearHighlights();
        this.unblockModalInteractions();
        
        localStorage.setItem(this.STORAGE_KEY, 'true');
        document.body.classList.remove('tutorial-active');
        this.resumeAllCarousels();
        
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        if (typeof showToast === 'function') {
            showToast('Tutorial concluído!', 'success');
        }
    },

    resetTutorial() {
        localStorage.removeItem(this.STORAGE_KEY);
        if (typeof showToast === 'function') {
            showToast('Tutorial reiniciado. Recarregue a página.', 'info');
        }
    }
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TutorialSystem.init();
    });
} else {
    TutorialSystem.init();
}

window.TutorialSystem = TutorialSystem;
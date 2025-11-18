/**
 * Sistema de Tutorial Simples e Funcional
 */

const TutorialSystem = {
    STORAGE_KEY: 'echoview-tutorial-completed',
    currentStep: 0,
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
            target: '#profileButton, button[onclick*="perfil"]'
        },
        {
            title: '5. EchoSocial',
            content: 'Compartilhe posts, curta e reposte conteúdo de outros usuários.',
            target: '#postsContainer',
            page: 'echosocial.html'
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
                background: rgba(0, 0, 0, 0.5);
                z-index: 99998;
                pointer-events: none;
            }
            
            /* Modal deve ficar acima do overlay mas abaixo do card do tutorial */
            .modal.show {
                z-index: 99999 !important;
            }
            
            .tutorial-highlight {
                position: fixed;
                border: 3px solid #4ade80;
                border-radius: 8px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.5);
                z-index: 99999;
                pointer-events: none;
            }
            
            .tutorial-card {
                background: linear-gradient(135deg, #072f57 0%, #051422 100%);
                border: 2px solid rgba(74, 222, 128, 0.3);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
                z-index: 100001 !important;
                position: fixed !important;
                color: white;
                pointer-events: auto !important;
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
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
                position: relative;
                z-index: 100001;
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

    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.completeTutorial();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        
        // Remover highlight anterior
        const oldHighlight = document.getElementById('tutorialHighlight');
        if (oldHighlight) oldHighlight.remove();
        
        // Remover card anterior
        const oldCard = document.getElementById('tutorialCard');
        if (oldCard) oldCard.remove();
        
        // Se tem autoOpenModal, abrir modal primeiro
        if (step.autoOpenModal) {
            this.openExampleModal().then(() => {
                // Após modal abrir, mostrar card
                setTimeout(() => {
                    if (step.target) {
                        const targetElement = document.querySelector(step.target);
                        if (targetElement) {
                            this.highlightElement(targetElement);
                        }
                    }
                    this.createTutorialCard(step, stepIndex);
                }, 500);
            });
            return;
        }
        
        // Aguardar um pouco e mostrar highlight se tiver target
        setTimeout(() => {
            if (step.target) {
                const targetElement = document.querySelector(step.target);
                if (targetElement) {
                    this.highlightElement(targetElement);
                }
            }
            this.createTutorialCard(step, stepIndex);
        }, step.modalRequired ? 2000 : 500);
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
        
        // Scroll suave para o elemento
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    createTutorialCard(step, stepIndex) {
        const overlay = document.getElementById('tutorialOverlay');
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
        
        // Posicionar card
        this.positionCard(card, step.target);
    },

    positionCard(card, targetSelector) {
        // Aguardar um frame para garantir que o card foi renderizado
        requestAnimationFrame(() => {
            if (!targetSelector) {
                // Centralizar se não tiver target
                card.style.top = '50%';
                card.style.left = '50%';
                card.style.transform = 'translate(-50%, -50%)';
                return;
            }
            
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) {
                // Se não encontrar target, centralizar
                card.style.top = '50%';
                card.style.left = '50%';
                card.style.transform = 'translate(-50%, -50%)';
                return;
            }
            
            const rect = targetElement.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const spacing = 20;
            
            // Tentar colocar acima
            if (rect.top > cardRect.height + spacing) {
                card.style.top = `${rect.top - cardRect.height - spacing}px`;
                card.style.left = `${Math.max(20, rect.left)}px`;
            } else if (rect.bottom + cardRect.height + spacing < window.innerHeight) {
                // Colocar abaixo
                card.style.top = `${rect.bottom + spacing}px`;
                card.style.left = `${Math.max(20, rect.left)}px`;
            } else {
                // Se não couber, centralizar na tela
                card.style.top = '50%';
                card.style.left = '50%';
                card.style.transform = 'translate(-50%, -50%)';
            }
            
            // Garantir que não saia da tela
            const maxLeft = window.innerWidth - cardRect.width - 20;
            const currentLeft = parseInt(card.style.left) || 0;
            if (currentLeft > maxLeft) {
                card.style.left = `${maxLeft}px`;
            }
            if (currentLeft < 20) {
                card.style.left = '20px';
            }
        });
    },

    async openExampleModal() {
        try {
            const firstItem = document.querySelector('.carousel-item, .grid-item');
            if (firstItem) {
                firstItem.click();
                // Aguardar modal abrir completamente
                await new Promise(resolve => {
                    const checkModal = setInterval(() => {
                        const modal = document.getElementById('titleModal');
                        if (modal && modal.classList.contains('show')) {
                            clearInterval(checkModal);
                            setTimeout(resolve, 1000); // Aguardar conteúdo carregar
                        }
                    }, 100);
                    // Timeout de segurança
                    setTimeout(() => {
                        clearInterval(checkModal);
                        resolve();
                    }, 5000);
                });
            } else if (typeof openModal === 'function') {
                await openModal({ id: 603, tmdbId: 603, type: 'movie' });
                await new Promise(resolve => {
                    const checkModal = setInterval(() => {
                        const modal = document.getElementById('titleModal');
                        if (modal && modal.classList.contains('show')) {
                            clearInterval(checkModal);
                            setTimeout(resolve, 1000);
                        }
                    }, 100);
                    setTimeout(() => {
                        clearInterval(checkModal);
                        resolve();
                    }, 5000);
                });
            }
        } catch (error) {
            console.error('Erro ao abrir modal:', error);
        }
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
        localStorage.setItem(this.STORAGE_KEY, 'true');
        document.body.classList.remove('tutorial-active');
        this.resumeAllCarousels();
        
        const overlay = document.getElementById('tutorialOverlay');
        const highlight = document.getElementById('tutorialHighlight');
        const card = document.getElementById('tutorialCard');
        
        if (overlay) overlay.remove();
        if (highlight) highlight.remove();
        if (card) card.remove();
        
        // Remover atributo do modal
        const modal = document.getElementById('titleModal');
        if (modal) modal.removeAttribute('data-tutorial-modal');
        
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

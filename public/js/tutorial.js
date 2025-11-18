/**
 * Sistema de Tutorial Interativo
 * Mostra todas as funcionalidades da aplicação
 */

const TutorialSystem = {
    STORAGE_KEY: 'echoview-tutorial-completed',
    currentStep: 0,
    steps: [
        {
            title: 'Bem-vindo ao EchoView!',
            content: 'Este tutorial vai te mostrar todas as funcionalidades da plataforma. Você pode pular a qualquer momento.',
            target: null,
            position: 'center'
        },
        {
            title: 'Catálogo de Filmes e Séries',
            content: 'Explore o catálogo completo de filmes e séries. Use as categorias para encontrar conteúdo popular, mais bem avaliado, ou em cartaz.',
            target: '#catalogSection',
            position: 'bottom',
            page: 'catalogo.html'
        },
        {
            title: 'Sistema de Watchlist',
            content: 'Marque filmes e séries como "Quero Assistir", "Já Assisti" ou "Abandonado". Adicione comentários e acompanhe sua lista pessoal.',
            target: '.status-options',
            position: 'top',
            page: 'catalogo.html'
        },
        {
            title: 'Perfil Público',
            content: 'Visualize seu perfil e o de outros usuários. Veja suas estatísticas, watchlist, posts e interações.',
            target: '#profileSection',
            position: 'bottom',
            page: 'perfil.html'
        },
        {
            title: 'Seguir Usuários',
            content: 'Siga outros usuários para ver suas atividades e interações. Veja seus seguidores e quem você está seguindo.',
            target: '#followSection',
            position: 'top',
            page: 'perfil-publico.html'
        },
        {
            title: 'EchoSocial - Rede Social',
            content: 'Compartilhe posts, curta e reposte conteúdo. Interaja com outros usuários e descubra novos filmes e séries.',
            target: '#postsContainer',
            position: 'bottom',
            page: 'echosocial.html'
        },
        {
            title: 'Mensagens Privadas',
            content: 'Envie mensagens privadas para outros usuários. Compartilhe imagens, vídeos, filmes e posts nas conversas.',
            target: '#chatSection',
            position: 'right',
            page: 'echosocial.html'
        },
        {
            title: 'Notificações',
            content: 'Receba notificações sobre novos seguidores, feedbacks e outras atualizações importantes.',
            target: '#notificationBtn',
            position: 'bottom',
            page: 'catalogo.html'
        },
        {
            title: 'Dashboard Admin',
            content: 'Administradores podem gerenciar usuários, ver logs do sistema, feedbacks e métricas em tempo real.',
            target: '#dashboardBtn',
            position: 'bottom',
            page: 'catalogo.html'
        },
        {
            title: 'Calendário de Atividade',
            content: 'Acompanhe sua atividade diária e mantenha uma sequência (streak) de uso da plataforma.',
            target: '#activityCalendar',
            position: 'top',
            page: 'perfil.html'
        },
        {
            title: 'Feedback e Suporte',
            content: 'Envie feedbacks, reporte problemas ou sugira melhorias. Nossa equipe está sempre pronta para ajudar!',
            target: '#feedbackLink',
            position: 'top',
            page: 'feedback.html'
        },
        {
            title: 'Tutorial Concluído!',
            content: 'Agora você conhece todas as funcionalidades do EchoView. Divirta-se explorando filmes, séries e interagindo com outros usuários!',
            target: null,
            position: 'center'
        }
    ],
    
    init() {
        // Verificar se o tutorial já foi completado
        if (localStorage.getItem(this.STORAGE_KEY)) {
            return;
        }
        
        // Aguardar um pouco antes de iniciar o tutorial
        setTimeout(() => {
            this.showTutorial();
        }, 2000);
    },
    
    showTutorial() {
        this.injectStyles();
        this.createTutorialOverlay();
        this.showStep(0);
    },
    
    injectStyles() {
        if (document.getElementById('tutorial-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'tutorial-styles';
        style.textContent = `
            .tutorial-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                z-index: 99998;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tutorial-highlight {
                position: absolute;
                border: 3px solid #335b7e;
                border-radius: 8px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(51, 91, 126, 0.5);
                z-index: 99999;
                pointer-events: none;
                transition: all 0.3s ease;
            }
            
            .tutorial-card {
                background: linear-gradient(135deg, #072f57 0%, #051422 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                z-index: 100000;
                position: relative;
                animation: tutorialSlideIn 0.3s ease;
            }
            
            @keyframes tutorialSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
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
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }
            
            .tutorial-btn-primary {
                background: #335b7e;
                color: white;
            }
            
            .tutorial-btn-primary:hover {
                background: #4a6f95;
            }
            
            .tutorial-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            .tutorial-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .tutorial-progress {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .tutorial-progress-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: all 0.2s ease;
            }
            
            .tutorial-progress-dot.active {
                background: #335b7e;
                width: 24px;
                border-radius: 4px;
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
    
    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.completeTutorial();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        const overlay = document.getElementById('tutorialOverlay');
        
        // Remover highlight anterior
        const oldHighlight = document.getElementById('tutorialHighlight');
        if (oldHighlight) oldHighlight.remove();
        
        // Remover card anterior
        const oldCard = document.getElementById('tutorialCard');
        if (oldCard) oldCard.remove();
        
        // Criar highlight se houver target
        if (step.target && step.page) {
            // Verificar se estamos na página correta
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage !== step.page) {
                // Redirecionar para a página correta
                window.location.href = step.page + '?tutorial=true';
                return;
            }
            
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
                const targetElement = document.querySelector(step.target);
                if (targetElement) {
                    this.highlightElement(targetElement, step.position);
                } else {
                    // Se o elemento não existir, mostrar no centro
                    this.positionCard(card, { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, bottom: window.innerHeight / 2, right: window.innerWidth / 2 }, 'center');
                }
            }, 300);
        }
        
        // Criar card do tutorial
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        card.id = 'tutorialCard';
        
        const progress = this.steps.map((_, i) => 
            `<div class="tutorial-progress-dot ${i === stepIndex ? 'active' : ''}"></div>`
        ).join('');
        
        card.innerHTML = `
            <div class="tutorial-progress">${progress}</div>
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tutorial-actions">
                ${stepIndex > 0 ? '<button class="tutorial-btn tutorial-btn-secondary" onclick="TutorialSystem.previousStep()">Anterior</button>' : ''}
                <button class="tutorial-btn tutorial-btn-secondary" onclick="TutorialSystem.skipTutorial()">Pular</button>
                <button class="tutorial-btn tutorial-btn-primary" onclick="TutorialSystem.nextStep()">
                    ${stepIndex === this.steps.length - 1 ? 'Concluir' : 'Próximo'}
                </button>
            </div>
        `;
        
        overlay.appendChild(card);
    },
    
    highlightElement(element, position) {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.id = 'tutorialHighlight';
        highlight.className = 'tutorial-highlight';
        
        highlight.style.left = `${rect.left - 4}px`;
        highlight.style.top = `${rect.top - 4}px`;
        highlight.style.width = `${rect.width + 8}px`;
        highlight.style.height = `${rect.height + 8}px`;
        
        document.body.appendChild(highlight);
        
        // Posicionar card próximo ao elemento
        const card = document.getElementById('tutorialCard');
        if (card) {
            setTimeout(() => {
                this.positionCard(card, rect, position);
            }, 100);
        }
    },
    
    positionCard(card, rect, position) {
        const cardRect = card.getBoundingClientRect();
        let top = 0;
        let left = 0;
        
        switch(position) {
            case 'top':
                top = rect.top - cardRect.height - 20;
                left = rect.left + (rect.width / 2) - (cardRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + (rect.width / 2) - (cardRect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (cardRect.height / 2);
                left = rect.left - cardRect.width - 20;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (cardRect.height / 2);
                left = rect.right + 20;
                break;
            default:
                top = window.innerHeight / 2 - cardRect.height / 2;
                left = window.innerWidth / 2 - cardRect.width / 2;
        }
        
        // Garantir que o card fique dentro da viewport
        top = Math.max(20, Math.min(top, window.innerHeight - cardRect.height - 20));
        left = Math.max(20, Math.min(left, window.innerWidth - cardRect.width - 20));
        
        card.style.position = 'absolute';
        card.style.top = `${top}px`;
        card.style.left = `${left}px`;
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
        if (confirm('Deseja pular o tutorial? Você pode reiniciá-lo a qualquer momento nas configurações.')) {
            this.completeTutorial();
        }
    },
    
    completeTutorial() {
        localStorage.setItem(this.STORAGE_KEY, 'true');
        const overlay = document.getElementById('tutorialOverlay');
        const highlight = document.getElementById('tutorialHighlight');
        if (overlay) overlay.remove();
        if (highlight) highlight.remove();
        showToast && showToast('Tutorial concluído! Bem-vindo ao EchoView!', 'success');
    },
    
    resetTutorial() {
        localStorage.removeItem(this.STORAGE_KEY);
        showToast && showToast('Tutorial reiniciado. Recarregue a página para começar.', 'info');
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

// Exportar para uso global
window.TutorialSystem = TutorialSystem;


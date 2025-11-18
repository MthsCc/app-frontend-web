/**
 * Sistema de Tutorial Interativo e Detalhado
 * Mostra todas as funcionalidades da aplicação de forma bem mastigada
 */

const TutorialSystem = {
    STORAGE_KEY: 'echoview-tutorial-completed',
    currentStep: 0,
    waitingForClick: false,
    steps: [
        {
            title: 'Bem-vindo ao EchoView! 🎬',
            content: 'Olá! Este tutorial vai te guiar por todas as funcionalidades da plataforma. Vamos começar!',
            instruction: 'Clique em "Próximo" para começar o tutorial.',
            target: null,
            position: 'center',
            waitForClick: false
        },
        {
            title: '1. Catálogo de Filmes e Séries',
            content: 'Aqui você encontra o catálogo completo de filmes e séries do TMDB.',
            instruction: '👆 Clique em qualquer filme ou série para ver os detalhes e adicionar à sua lista!',
            target: '.grid-item, .carousel-item, [class*="grid"] [class*="item"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: '.grid-item, .carousel-item'
        },
        {
            title: '2. Adicionar à Watchlist',
            content: 'Quando abrir um filme ou série, você verá opções para marcar o status.',
            instruction: '👆 Clique em "Quero Assistir", "Já Assisti" ou "Abandonado" para adicionar à sua lista!',
            target: 'input[name="status"], label[for*="status"], [onchange*="updateStatus"]',
            position: 'top',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: 'input[name="status"]'
        },
        {
            title: '3. Comentar em Filmes',
            content: 'Você pode deixar comentários sobre filmes e séries que assistiu.',
            instruction: '👆 Digite um comentário na caixa de texto e clique em "Enviar"!',
            target: '#commentInput, textarea[placeholder*="comentário"]',
            position: 'top',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: 'button[onclick*="submitComment"]'
        },
        {
            title: '4. Ver seu Perfil',
            content: 'Acesse seu perfil para ver suas estatísticas, watchlist e posts.',
            instruction: '👆 Clique no botão de perfil (ícone de pessoa) no canto superior direito!',
            target: '#profileButton, button[onclick*="perfil"], [href*="perfil.html"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: '#profileButton, button[onclick*="perfil"]'
        },
        {
            title: '5. Ver Seguidores e Seguindo',
            content: 'No perfil, você pode ver quantos seguidores tem e quem está seguindo.',
            instruction: '👆 Clique nos números de "Seguidores" ou "Seguindo" para ver a lista completa!',
            target: '#followerCount, #followingCount, [onclick*="showFollowers"], [onclick*="showFollowing"]',
            position: 'top',
            page: 'perfil.html',
            waitForClick: true,
            clickTarget: '[onclick*="showFollowers"], [onclick*="showFollowing"]'
        },
        {
            title: '6. Seguir Outros Usuários',
            content: 'Visite perfis de outros usuários e siga-os para ver suas atividades.',
            instruction: '👆 Clique no botão "Seguir" no perfil de outro usuário!',
            target: '#followBtn, button[onclick*="toggleFollow"]',
            position: 'top',
            page: 'perfil-publico.html',
            waitForClick: true,
            clickTarget: '#followBtn'
        },
        {
            title: '7. EchoSocial - Rede Social',
            content: 'Compartilhe posts, curta e reposte conteúdo de outros usuários.',
            instruction: '👆 Clique em "EchoSocial" no menu ou acesse echosocial.html para ver os posts!',
            target: '#postsContainer, [id*="post"]',
            position: 'bottom',
            page: 'echosocial.html',
            waitForClick: false
        },
        {
            title: '8. Criar um Post',
            content: 'Compartilhe seus pensamentos sobre filmes e séries com outros usuários.',
            instruction: '👆 Digite algo na caixa "O que você está pensando?" e clique em "Publicar"!',
            target: '#postContent, textarea[placeholder*="pensando"], input[placeholder*="pensando"]',
            position: 'top',
            page: 'echosocial.html',
            waitForClick: true,
            clickTarget: 'button[onclick*="publishPost"], button[onclick*="createPost"]'
        },
        {
            title: '9. Enviar Mensagem Privada',
            content: 'Envie mensagens privadas para outros usuários.',
            instruction: '👆 Clique em uma conversa na lista à esquerda ou no botão "Mensagem" no perfil de alguém!',
            target: '#messagesList, #chatSection, button[onclick*="openChat"]',
            position: 'right',
            page: 'echosocial.html',
            waitForClick: true,
            clickTarget: '#messagesList > div, button[onclick*="openChat"]'
        },
        {
            title: '10. Ver Notificações',
            content: 'Receba notificações sobre novos seguidores, feedbacks e outras atualizações.',
            instruction: '👆 Clique no ícone de sino (🔔) no canto superior direito para ver suas notificações!',
            target: '#notificationBtn, button[id*="notification"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: '#notificationBtn'
        },
        {
            title: '11. Buscar Filmes e Séries',
            content: 'Use a barra de busca para encontrar filmes e séries específicos.',
            instruction: '👆 Digite o nome de um filme ou série na barra de busca no topo da página!',
            target: '#searchInput, input[placeholder*="Buscar"], input[type="search"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: false
        },
        {
            title: '12. Enviar Feedback',
            content: 'Envie sugestões, reporte problemas ou dê feedback sobre a plataforma.',
            instruction: '👆 Acesse a página de feedback e preencha o formulário!',
            target: '#feedbackForm, form[action*="feedback"]',
            position: 'top',
            page: 'feedback.html',
            waitForClick: false
        },
        {
            title: 'Tutorial Concluído! 🎉',
            content: 'Parabéns! Agora você conhece todas as funcionalidades principais do EchoView. Divirta-se explorando!',
            instruction: 'Clique em "Concluir" para finalizar o tutorial.',
            target: null,
            position: 'center',
            waitForClick: false
        }
    ],
    
    init() {
        // Verificar se o tutorial já foi completado
        if (localStorage.getItem(this.STORAGE_KEY)) {
            return;
        }
        
        // Verificar se há parâmetro tutorial na URL
        const urlParams = new URLSearchParams(window.location.search);
        const hasTutorialParam = urlParams.get('tutorial') === 'true';
        
        // Aguardar um pouco antes de iniciar o tutorial
        setTimeout(() => {
            this.showTutorial();
        }, hasTutorialParam ? 500 : 2000);
    },
    
    showTutorial() {
        this.injectStyles();
        this.createTutorialOverlay();
        // Adicionar classe ao body para aplicar blur
        document.body.classList.add('tutorial-active');
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
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 99998;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* Aplicar blur em todo o conteúdo da página quando tutorial está ativo */
            body.tutorial-active {
                overflow: hidden;
            }
            
            body.tutorial-active * {
                filter: blur(8px);
                pointer-events: none;
            }
            
            /* Exceções - elementos que NÃO devem ter blur */
            body.tutorial-active .tutorial-overlay,
            body.tutorial-active .tutorial-overlay *,
            body.tutorial-active .tutorial-highlight,
            body.tutorial-active .tutorial-highlight *,
            body.tutorial-active .tutorial-card,
            body.tutorial-active .tutorial-card *,
            body.tutorial-active [data-tutorial-visible],
            body.tutorial-active [data-tutorial-visible] * {
                filter: none !important;
                pointer-events: auto !important;
            }
            
            /* Garantir que o overlay não tenha blur */
            .tutorial-overlay {
                filter: none !important;
                pointer-events: auto !important;
            }
            
            .tutorial-highlight {
                position: absolute;
                border: 4px solid #4ade80;
                border-radius: 12px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85), 
                            0 0 40px rgba(74, 222, 128, 0.8),
                            inset 0 0 25px rgba(74, 222, 128, 0.4);
                z-index: 99999;
                pointer-events: none;
                transition: all 0.3s ease;
                animation: tutorialPulse 2s ease-in-out infinite;
                filter: none !important;
            }
            
            /* Elemento destacado não deve ter blur */
            .tutorial-highlight * {
                filter: none !important;
            }
            
            /* Card do tutorial não deve ter blur */
            .tutorial-card {
                filter: none !important;
            }
            
            @keyframes tutorialPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 
                                0 0 30px rgba(74, 222, 128, 0.6),
                                inset 0 0 20px rgba(74, 222, 128, 0.3);
                }
                50% {
                    transform: scale(1.02);
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 
                                0 0 40px rgba(74, 222, 128, 0.8),
                                inset 0 0 25px rgba(74, 222, 128, 0.5);
                }
            }
            
            .tutorial-arrow {
                position: absolute;
                width: 0;
                height: 0;
                z-index: 100001;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            }
            
            .tutorial-arrow-top {
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-bottom: 20px solid #335b7e;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 10px;
            }
            
            .tutorial-arrow-bottom {
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 20px solid #335b7e;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 10px;
            }
            
            .tutorial-arrow-left {
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-right: 20px solid #335b7e;
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-right: 10px;
            }
            
            .tutorial-arrow-right {
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-left: 20px solid #335b7e;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 10px;
            }
            
            .tutorial-card {
                background: linear-gradient(135deg, #072f57 0%, #051422 100%);
                border: 2px solid rgba(74, 222, 128, 0.3);
                border-radius: 20px;
                padding: 2rem;
                max-width: 550px;
                width: 90%;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
                z-index: 100000;
                position: relative;
                animation: tutorialSlideIn 0.4s ease;
            }
            
            @keyframes tutorialSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .tutorial-card h3 {
                color: white;
                font-size: 1.75rem;
                font-weight: bold;
                margin: 0 0 1rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .tutorial-card .instruction {
                background: rgba(74, 222, 128, 0.15);
                border-left: 4px solid #4ade80;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0 1.5rem 0;
                color: #d1fae5;
                font-weight: 600;
                font-size: 1.05rem;
                line-height: 1.6;
            }
            
            .tutorial-card p {
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.7;
                margin: 0 0 1rem 0;
                font-size: 1rem;
            }
            
            .tutorial-actions {
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                flex-wrap: wrap;
            }
            
            .tutorial-btn {
                padding: 0.875rem 1.75rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
                font-size: 0.95rem;
            }
            
            .tutorial-btn-primary {
                background: linear-gradient(135deg, #335b7e 0%, #4a6f95 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(51, 91, 126, 0.4);
            }
            
            .tutorial-btn-primary:hover {
                background: linear-gradient(135deg, #4a6f95 0%, #5a7fa5 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(51, 91, 126, 0.5);
            }
            
            .tutorial-btn-primary:active {
                transform: translateY(0);
            }
            
            .tutorial-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .tutorial-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .tutorial-progress {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }
            
            .tutorial-progress-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: all 0.3s ease;
            }
            
            .tutorial-progress-dot.active {
                background: #4ade80;
                width: 30px;
                border-radius: 15px;
                box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
            }
            
            .tutorial-waiting {
                pointer-events: auto !important;
            }
            
            .tutorial-waiting .tutorial-highlight {
                pointer-events: auto;
                cursor: pointer;
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
        
        // Remover highlight anterior e restaurar estilos
        const oldHighlight = document.getElementById('tutorialHighlight');
        if (oldHighlight) {
            // Remover atributos dos elementos anteriores
            const previousElements = document.querySelectorAll('[data-tutorial-visible]');
            previousElements.forEach(el => {
                el.removeAttribute('data-tutorial-visible');
                el.style.position = '';
                el.style.zIndex = '';
            });
            oldHighlight.remove();
        }
        
        // Remover card anterior
        const oldCard = document.getElementById('tutorialCard');
        if (oldCard) oldCard.remove();
        
        // Remover arrow anterior
        const oldArrow = document.getElementById('tutorialArrow');
        if (oldArrow) oldArrow.remove();
        
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
                    if (step.waitForClick && step.clickTarget) {
                        this.waitForUserClick(step.clickTarget);
                    }
                } else {
                    // Se o elemento não existir, mostrar no centro
                    this.showCardInCenter();
                }
            }, 500);
        } else {
            this.showCardInCenter();
        }
        
        // Criar card do tutorial
        this.createTutorialCard(step, stepIndex);
    },
    
    createTutorialCard(step, stepIndex) {
        const overlay = document.getElementById('tutorialOverlay');
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        card.id = 'tutorialCard';
        
        const progress = this.steps.map((_, i) => 
            `<div class="tutorial-progress-dot ${i === stepIndex ? 'active' : ''}"></div>`
        ).join('');
        
        const instructionHtml = step.instruction ? 
            `<div class="instruction">${step.instruction}</div>` : '';
        
        card.innerHTML = `
            <div class="tutorial-progress">${progress}</div>
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            ${instructionHtml}
            <div class="tutorial-actions">
                ${stepIndex > 0 ? '<button class="tutorial-btn tutorial-btn-secondary" onclick="TutorialSystem.previousStep()">← Anterior</button>' : ''}
                <button class="tutorial-btn tutorial-btn-secondary" onclick="TutorialSystem.skipTutorial()">Pular Tutorial</button>
                ${step.waitForClick ? 
                    '<button class="tutorial-btn tutorial-btn-primary" onclick="TutorialSystem.forceNextStep()" disabled id="nextBtnTutorial">Aguardando ação...</button>' :
                    `<button class="tutorial-btn tutorial-btn-primary" onclick="TutorialSystem.nextStep()">
                        ${stepIndex === this.steps.length - 1 ? '✓ Concluir' : 'Próximo →'}
                    </button>`
                }
            </div>
        `;
        
        overlay.appendChild(card);
    },
    
    showCardInCenter() {
        const card = document.getElementById('tutorialCard');
        if (card) {
            card.style.position = 'absolute';
            card.style.top = '50%';
            card.style.left = '50%';
            card.style.transform = 'translate(-50%, -50%)';
        }
    },
    
    highlightElement(element, position) {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.id = 'tutorialHighlight';
        highlight.className = 'tutorial-highlight';
        
        highlight.style.left = `${rect.left - 6}px`;
        highlight.style.top = `${rect.top - 6}px`;
        highlight.style.width = `${rect.width + 12}px`;
        highlight.style.height = `${rect.height + 12}px`;
        
        document.body.appendChild(highlight);
        
        // Marcar elemento destacado para não ter blur
        element.setAttribute('data-tutorial-visible', 'true');
        element.style.position = 'relative';
        element.style.zIndex = '100000';
        
        // Aplicar aos filhos também
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            child.setAttribute('data-tutorial-visible', 'true');
        });
        
        // Scroll para o elemento se necessário
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Posicionar card próximo ao elemento
        setTimeout(() => {
            this.positionCard(highlight, rect, position);
        }, 100);
    },
    
    positionCard(highlight, rect, position) {
        const card = document.getElementById('tutorialCard');
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        let top = 0;
        let left = 0;
        let arrowPosition = position;
        
        switch(position) {
            case 'top':
                top = rect.top - cardRect.height - 30;
                left = rect.left + (rect.width / 2) - (cardRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + 30;
                left = rect.left + (rect.width / 2) - (cardRect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (cardRect.height / 2);
                left = rect.left - cardRect.width - 30;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (cardRect.height / 2);
                left = rect.right + 30;
                break;
            default:
                top = window.innerHeight / 2 - cardRect.height / 2;
                left = window.innerWidth / 2 - cardRect.width / 2;
                arrowPosition = null;
        }
        
        // Garantir que o card fique dentro da viewport
        top = Math.max(20, Math.min(top, window.innerHeight - cardRect.height - 20));
        left = Math.max(20, Math.min(left, window.innerWidth - cardRect.width - 20));
        
        card.style.position = 'absolute';
        card.style.top = `${top}px`;
        card.style.left = `${left}px`;
        
        // Adicionar seta apontando para o elemento
        if (arrowPosition && highlight) {
            this.addArrow(card, highlight, arrowPosition);
        }
    },
    
    addArrow(card, highlight, position) {
        const arrow = document.createElement('div');
        arrow.id = 'tutorialArrow';
        arrow.className = `tutorial-arrow tutorial-arrow-${position}`;
        card.appendChild(arrow);
    },
    
    waitForUserClick(clickTarget) {
        this.waitingForClick = true;
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.classList.add('tutorial-waiting');
        
        const clickHandler = (e) => {
            const target = e.target.closest(clickTarget);
            if (target) {
                e.stopPropagation();
                this.waitingForClick = false;
                overlay.classList.remove('tutorial-waiting');
                document.removeEventListener('click', clickHandler, true);
                
                // Habilitar botão próximo
                const nextBtn = document.getElementById('nextBtnTutorial');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'Próximo →';
                    nextBtn.onclick = () => this.nextStep();
                }
                
                // Mostrar feedback
                showToast && showToast('Ótimo! Continue assim!', 'success');
            }
        };
        
        document.addEventListener('click', clickHandler, true);
        
        // Timeout de segurança - permitir continuar após 10 segundos
        setTimeout(() => {
            if (this.waitingForClick) {
                const nextBtn = document.getElementById('nextBtnTutorial');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'Pular esta ação →';
                    nextBtn.onclick = () => {
                        this.waitingForClick = false;
                        overlay.classList.remove('tutorial-waiting');
                        document.removeEventListener('click', clickHandler, true);
                        this.nextStep();
                    };
                }
            }
        }, 10000);
    },
    
    forceNextStep() {
        this.waitingForClick = false;
        this.nextStep();
    },
    
    nextStep() {
        this.waitingForClick = false;
        this.showStep(this.currentStep + 1);
    },
    
    previousStep() {
        this.waitingForClick = false;
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    },
    
    skipTutorial() {
        if (confirm('Deseja pular o tutorial? Você pode reiniciá-lo chamando TutorialSystem.resetTutorial() no console.')) {
            this.completeTutorial();
        }
    },
    
    completeTutorial() {
        localStorage.setItem(this.STORAGE_KEY, 'true');
        const overlay = document.getElementById('tutorialOverlay');
        const highlight = document.getElementById('tutorialHighlight');
        const arrow = document.getElementById('tutorialArrow');
        
        // Remover blur do body
        document.body.classList.remove('tutorial-active');
        
        // Remover atributos dos elementos destacados
        const highlightedElements = document.querySelectorAll('[data-tutorial-visible]');
        highlightedElements.forEach(el => {
            el.removeAttribute('data-tutorial-visible');
            el.style.position = '';
            el.style.zIndex = '';
        });
        
        if (overlay) overlay.remove();
        if (highlight) highlight.remove();
        if (arrow) arrow.remove();
        showToast && showToast('Tutorial concluído! Bem-vindo ao EchoView! 🎉', 'success');
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

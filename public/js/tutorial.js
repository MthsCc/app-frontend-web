/**
 * Sistema de Tutorial Interativo e Detalhado
 * Mostra todas as funcionalidades da aplicação de forma bem mastigada
 */

const TutorialSystem = {
    STORAGE_KEY: 'echoview-tutorial-completed',
    currentStep: 0,
    waitingForClick: false,
    carouselAnimationIds: [], // Armazenar IDs de animação dos carrosséis
    steps: [
        {
            title: 'Bem-vindo ao EchoView!',
            content: 'Olá! Este tutorial vai te guiar por todas as funcionalidades da plataforma. Vamos começar!',
            instruction: 'Clique em "Próximo" para começar o tutorial.',
            target: null,
            position: 'center',
            waitForClick: false
        },
        {
            title: '1. Catálogo de Filmes e Séries',
            content: 'Aqui você encontra o catálogo completo de filmes e séries do TMDB.',
            instruction: 'Você pode clicar em qualquer filme ou série para ver os detalhes e adicionar à sua lista!',
            target: '.grid-item, .carousel-item, [class*="grid"] [class*="item"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: false,
            autoOpenModal: true // Abrir modal automaticamente após este passo
        },
        {
            title: '2. Adicionar à Watchlist',
            content: 'Quando abrir um filme ou série, você verá opções para marcar o status.',
            instruction: 'Você pode clicar em "Quero Assistir", "Já Assisti" ou "Abandonado" para adicionar à sua lista!',
            target: 'input[name="status"], label[for*="status"], [onchange*="updateStatus"]',
            position: 'top',
            page: 'catalogo.html',
            waitForClick: false,
            modalRequired: true // Este passo só funciona se o modal estiver aberto
        },
        {
            title: '3. Comentar em Filmes',
            content: 'Você pode deixar comentários sobre filmes e séries que assistiu.',
            instruction: 'Digite um comentário na caixa de texto e clique em "Enviar" para compartilhar sua opinião!',
            target: '#commentInput, textarea[placeholder*="comentário"]',
            position: 'top',
            page: 'catalogo.html',
            waitForClick: false,
            modalRequired: true // Este passo só funciona se o modal estiver aberto
        },
        {
            title: '4. Ver seu Perfil',
            content: 'Acesse seu perfil para ver suas estatísticas, watchlist e posts.',
            instruction: 'Clique no botão de perfil (ícone de pessoa) no canto superior direito!',
            target: '#profileButton, button[onclick*="perfil"], [href*="perfil.html"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: '#profileButton, button[onclick*="perfil"]'
        },
        {
            title: '5. Ver Seguidores e Seguindo',
            content: 'No perfil, você pode ver quantos seguidores tem e quem está seguindo.',
            instruction: 'Clique nos números de "Seguidores" ou "Seguindo" para ver a lista completa!',
            target: '#followerCount, #followingCount, [onclick*="showFollowers"], [onclick*="showFollowing"]',
            position: 'top',
            page: 'perfil.html',
            waitForClick: true,
            clickTarget: '[onclick*="showFollowers"], [onclick*="showFollowing"]'
        },
        {
            title: '6. Seguir Outros Usuários',
            content: 'Visite perfis de outros usuários e siga-os para ver suas atividades.',
            instruction: 'Clique no botão "Seguir" no perfil de outro usuário!',
            target: '#followBtn, button[onclick*="toggleFollow"]',
            position: 'top',
            page: 'perfil-publico.html',
            waitForClick: true,
            clickTarget: '#followBtn'
        },
        {
            title: '7. EchoSocial - Rede Social',
            content: 'Compartilhe posts, curta e reposte conteúdo de outros usuários.',
            instruction: 'Clique em "EchoSocial" no menu ou acesse echosocial.html para ver os posts!',
            target: '#postsContainer, [id*="post"]',
            position: 'bottom',
            page: 'echosocial.html',
            waitForClick: false
        },
        {
            title: '8. Criar um Post',
            content: 'Compartilhe seus pensamentos sobre filmes e séries com outros usuários.',
            instruction: 'Digite algo na caixa "O que você está pensando?" e clique em "Publicar"!',
            target: '#postContent, textarea[placeholder*="pensando"], input[placeholder*="pensando"]',
            position: 'top',
            page: 'echosocial.html',
            waitForClick: true,
            clickTarget: 'button[onclick*="publishPost"], button[onclick*="createPost"]'
        },
        {
            title: '9. Enviar Mensagem Privada',
            content: 'Envie mensagens privadas para outros usuários.',
            instruction: 'Clique em uma conversa na lista à esquerda ou no botão "Mensagem" no perfil de alguém!',
            target: '#messagesList, #chatSection, button[onclick*="openChat"]',
            position: 'right',
            page: 'echosocial.html',
            waitForClick: true,
            clickTarget: '#messagesList > div, button[onclick*="openChat"]'
        },
        {
            title: '10. Ver Notificações',
            content: 'Receba notificações sobre novos seguidores, feedbacks e outras atualizações.',
            instruction: 'Clique no ícone de sino no canto superior direito para ver suas notificações!',
            target: '#notificationBtn, button[id*="notification"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: true,
            clickTarget: '#notificationBtn'
        },
        {
            title: '11. Buscar Filmes e Séries',
            content: 'Use a barra de busca para encontrar filmes e séries específicos.',
            instruction: 'Digite o nome de um filme ou série na barra de busca no topo da página!',
            target: '#searchInput, input[placeholder*="Buscar"], input[type="search"]',
            position: 'bottom',
            page: 'catalogo.html',
            waitForClick: false
        },
        {
            title: '12. Enviar Feedback',
            content: 'Envie sugestões, reporte problemas ou dê feedback sobre a plataforma.',
            instruction: 'Acesse a página de feedback e preencha o formulário!',
            target: '#feedbackForm, form[action*="feedback"]',
            position: 'top',
            page: 'feedback.html',
            waitForClick: false
        },
        {
            title: 'Tutorial Concluído!',
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
        // Pausar todos os carrosséis ANTES de adicionar blur
        this.pauseAllCarousels();
        // Adicionar classe ao body para aplicar blur
        document.body.classList.add('tutorial-active');
        // Aplicar blur manualmente para garantir que funcione
        this.applyBlurToPage();
        this.showStep(0);
    },
    
    applyBlurToPage() {
        // Aplicar blur recursivamente em todos os elementos, exceto os que devem estar visíveis
        const applyBlurRecursive = (element) => {
            // Pular elementos que não devem ter blur
            if (element.hasAttribute('data-tutorial-visible') ||
                element.closest('.tutorial-overlay') ||
                element.closest('.tutorial-card') ||
                element.classList.contains('tutorial-overlay') ||
                element.classList.contains('tutorial-card') ||
                element.classList.contains('tutorial-highlight')) {
                return;
            }
            
            // Aplicar blur no elemento
            if (!element.style.filter || !element.style.filter.includes('none')) {
                element.style.filter = 'blur(8px)';
                element.style.pointerEvents = 'none';
            }
            
            // Aplicar recursivamente nos filhos
            Array.from(element.children).forEach(child => {
                applyBlurRecursive(child);
            });
        };
        
        // Aplicar em todos os filhos diretos do body
        Array.from(document.body.children).forEach(child => {
            if (!child.classList.contains('tutorial-overlay')) {
                applyBlurRecursive(child);
            }
        });
    },
    
    removeBlurFromPage() {
        // Remover blur de todos os elementos
        const allElements = document.querySelectorAll('[style*="blur"]');
        allElements.forEach(el => {
            if (!el.closest('.tutorial-overlay') && !el.closest('.tutorial-card')) {
                el.style.filter = '';
                el.style.pointerEvents = '';
            }
        });
    },
    
    pauseAllCarousels() {
        // Encontrar todos os carrosséis e pausá-los
        const carouselWrappers = document.querySelectorAll('.carousel-wrapper, [class*="carousel"]');
        carouselWrappers.forEach(wrapper => {
            // Parar qualquer animação de scroll
            wrapper.style.animationPlayState = 'paused';
            wrapper.style.scrollBehavior = 'auto';
            
            // Tentar encontrar e pausar requestAnimationFrame
            const carouselContainer = wrapper.closest('.carousel-container');
            if (carouselContainer) {
                // Adicionar flag de pausa
                carouselContainer.dataset.tutorialPaused = 'true';
            }
        });
        
        // Pausar animações CSS
        const style = document.createElement('style');
        style.id = 'tutorial-pause-carousels';
        style.textContent = `
            body.tutorial-active .carousel-wrapper,
            body.tutorial-active [class*="carousel"] {
                animation-play-state: paused !important;
            }
        `;
        if (!document.getElementById('tutorial-pause-carousels')) {
            document.head.appendChild(style);
        }
    },
    
    resumeAllCarousels() {
        // Remover flag de pausa
        const carouselContainers = document.querySelectorAll('[data-tutorial-paused]');
        carouselContainers.forEach(container => {
            delete container.dataset.tutorialPaused;
        });
        
        // Remover estilo de pausa
        const pauseStyle = document.getElementById('tutorial-pause-carousels');
        if (pauseStyle) {
            pauseStyle.remove();
        }
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
            
            /* Aplicar blur em todos os elementos */
            body.tutorial-active > *:not(.tutorial-overlay) {
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
            }
            
            /* Card do tutorial sempre clicável */
            body.tutorial-active .tutorial-card,
            body.tutorial-active .tutorial-card * {
                pointer-events: auto !important;
            }
            
            /* Elemento destacado clicável e sem blur - PRIORIDADE MÁXIMA */
            body.tutorial-active [data-tutorial-visible] {
                pointer-events: auto !important;
                filter: none !important;
                z-index: 100000 !important;
                position: relative !important;
            }
            
            /* Garantir que elementos dentro do destacado também sejam clicáveis */
            body.tutorial-active [data-tutorial-visible] * {
                pointer-events: auto !important;
                filter: none !important;
            }
            
            /* Garantir que o overlay não tenha blur */
            .tutorial-overlay {
                filter: none !important;
                pointer-events: auto !important;
            }
            
            .tutorial-highlight {
                position: fixed;
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
                z-index: 100001 !important;
                position: fixed !important;
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
                el.style.filter = '';
                el.style.pointerEvents = '';
            });
            oldHighlight.remove();
        }
        
        // Reaplicar blur na página (exceto elementos que devem estar visíveis)
        this.applyBlurToPage();
        
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
            
            // Se o passo requer modal, aguardar o modal estar aberto
            const waitForModal = step.modalRequired ? 1500 : 500;
            
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
                // Se requer modal, verificar se está aberto
                if (step.modalRequired) {
                    const modal = document.getElementById('titleModal');
                    if (!modal || !modal.classList.contains('show')) {
                        // Modal não está aberto, mostrar mensagem e tentar novamente
                        console.warn('Modal não está aberto, aguardando...');
                        setTimeout(() => this.showStep(stepIndex), 500);
                        return;
                    }
                }
                
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
            }, waitForModal);
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
        // Verificar se o elemento não é o próprio card do tutorial
        if (element.closest('.tutorial-card') || element.closest('.tutorial-overlay')) {
            console.warn('Tentando destacar o próprio card do tutorial, pulando highlight');
            this.showCardInCenter();
            return;
        }
        
        // Aguardar um pouco para garantir que o elemento está renderizado
        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            
            // Verificar se o elemento ainda existe e está visível
            if (!rect.width || !rect.height) {
                console.warn('Elemento não está visível, tentando novamente...');
                setTimeout(() => this.highlightElement(element, position), 300);
                return;
            }
            
            const highlight = document.createElement('div');
            highlight.id = 'tutorialHighlight';
            highlight.className = 'tutorial-highlight';
            
            highlight.style.left = `${rect.left - 6}px`;
            highlight.style.top = `${rect.top - 6}px`;
            highlight.style.width = `${rect.width + 12}px`;
            highlight.style.height = `${rect.height + 12}px`;
            
            document.body.appendChild(highlight);
            
            // Marcar elemento destacado para não ter blur - IMPORTANTE: fazer isso ANTES de aplicar blur
            element.setAttribute('data-tutorial-visible', 'true');
            element.style.position = 'relative';
            element.style.zIndex = '100000';
            element.style.filter = 'none';
            element.style.pointerEvents = 'auto';
            
            // Remover blur do elemento e seus pais
            let currentEl = element;
            let depth = 0;
            while (currentEl && depth < 5 && currentEl !== document.body) {
                currentEl.setAttribute('data-tutorial-visible', 'true');
                currentEl.style.filter = 'none';
                currentEl.style.pointerEvents = 'auto';
                currentEl = currentEl.parentElement;
                depth++;
            }
            
            // Aplicar aos filhos também - CRÍTICO para garantir que não tenham blur
            const children = element.querySelectorAll('*');
            children.forEach(child => {
                child.setAttribute('data-tutorial-visible', 'true');
                child.style.filter = 'none';
                child.style.pointerEvents = 'auto';
            });
            
            // Forçar atualização do estilo
            element.offsetHeight; // Trigger reflow
            
            // Aguardar um frame para garantir que os estilos foram aplicados
            requestAnimationFrame(() => {
                // Verificar novamente e forçar remoção de blur
                element.style.filter = 'none';
                element.style.pointerEvents = 'auto';
                
                // Reaplicar blur na página (isso vai respeitar o data-tutorial-visible)
                this.applyBlurToPage();
            });
            
            // Scroll para o elemento se necessário (mas não se for o card)
            if (!element.closest('.tutorial-card')) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Aguardar scroll completar antes de posicionar card
            setTimeout(() => {
                const newRect = element.getBoundingClientRect();
                this.positionCard(highlight, newRect, position);
            }, 500);
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
        
        // Garantir que o card fique dentro da viewport e não sobreponha o highlight
        // Se o card estiver muito próximo do highlight, ajustar posição
        const padding = 20;
        top = Math.max(padding, Math.min(top, window.innerHeight - cardRect.height - padding));
        left = Math.max(padding, Math.min(left, window.innerWidth - cardRect.width - padding));
        
        // Verificar se o card está sobrepondo o highlight e ajustar
        const highlightRect = highlight.getBoundingClientRect();
        const cardBottom = top + cardRect.height;
        const cardRight = left + cardRect.width;
        const highlightTop = highlightRect.top;
        const highlightBottom = highlightRect.bottom;
        const highlightLeft = highlightRect.left;
        const highlightRight = highlightRect.right;
        
        // Se o card está sobrepondo o highlight, reposicionar
        if (top < highlightBottom + 10 && cardBottom > highlightTop - 10 && 
            left < highlightRight + 10 && cardRight > highlightLeft - 10) {
            // Colocar o card abaixo do highlight se estiver sobrepondo
            if (position === 'top' || position === 'bottom') {
                top = highlightBottom + 30;
            } else if (position === 'left' || position === 'right') {
                left = highlightRight + 30;
            }
        }
        
        card.style.position = 'fixed';
        card.style.top = `${top}px`;
        card.style.left = `${left}px`;
        card.style.transform = 'none';
        
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
    
    async nextStep() {
        this.waitingForClick = false;
        
        // Verificar se o passo atual tem autoOpenModal
        const currentStep = this.steps[this.currentStep];
        if (currentStep && currentStep.autoOpenModal) {
            // Abrir modal automaticamente
            await this.openExampleModal();
        }
        
        this.showStep(this.currentStep + 1);
    },
    
    async openExampleModal() {
        // Buscar um filme popular para usar como exemplo
        try {
            // Tentar pegar o primeiro item do carrossel ou grid que tenha um evento de clique
            const firstItem = document.querySelector('.carousel-item, .grid-item');
            let movieId = null;
            let movieType = 'movie';
            
            if (firstItem) {
                // Tentar simular o clique no primeiro item (mais confiável)
                // Isso vai usar os dados reais do item
                firstItem.click();
                
                // Aguardar um pouco e verificar se o modal abriu
                await new Promise(resolve => setTimeout(resolve, 800));
                const modal = document.getElementById('titleModal');
                if (modal && modal.classList.contains('show')) {
                    // Modal foi aberto pelo clique, aguardar carregar completamente
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Marcar modal como parte do tutorial para não fechar acidentalmente
                    modal.setAttribute('data-tutorial-modal', 'true');
                    return;
                }
                
                // Se o clique não funcionou, tentar extrair dados manualmente
                const onclickAttr = firstItem.getAttribute('onclick');
                if (onclickAttr) {
                    const idMatch = onclickAttr.match(/id:\s*(\d+)/);
                    if (idMatch) {
                        movieId = parseInt(idMatch[1]);
                    }
                }
                
                // Tentar pegar de dataset
                if (!movieId && firstItem.dataset) {
                    movieId = firstItem.dataset.id || firstItem.dataset.tmdbId;
                    if (movieId) movieId = parseInt(movieId);
                }
            }
            
            // Se não encontrou ID, usar um filme popular como exemplo (The Matrix)
            if (!movieId) {
                movieId = 603; // The Matrix
            }
            
            // Verificar se a função openModal existe
            if (typeof openModal === 'function') {
                await openModal({
                    id: movieId,
                    tmdbId: movieId,
                    type: movieType
                });
                
                // Aguardar o modal carregar completamente
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Marcar modal como parte do tutorial
                const modal = document.getElementById('titleModal');
                if (modal) {
                    modal.setAttribute('data-tutorial-modal', 'true');
                }
            } else {
                console.warn('Função openModal não encontrada');
            }
        } catch (error) {
            console.error('Erro ao abrir modal de exemplo:', error);
            // Fallback: tentar abrir The Matrix
            try {
                if (typeof openModal === 'function') {
                    await openModal({
                        id: 603,
                        tmdbId: 603,
                        type: 'movie'
                    });
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    const modal = document.getElementById('titleModal');
                    if (modal) {
                        modal.setAttribute('data-tutorial-modal', 'true');
                    }
                }
            } catch (fallbackError) {
                console.error('Erro no fallback ao abrir modal:', fallbackError);
            }
        }
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
        
        // Remover blur manualmente
        this.removeBlurFromPage();
        
        // Remover blur do body
        document.body.classList.remove('tutorial-active');
        
        // Retomar carrosséis
        this.resumeAllCarousels();
        
        // Remover atributos dos elementos destacados
        const highlightedElements = document.querySelectorAll('[data-tutorial-visible]');
        highlightedElements.forEach(el => {
            el.removeAttribute('data-tutorial-visible');
            el.style.position = '';
            el.style.zIndex = '';
            el.style.filter = '';
            el.style.pointerEvents = '';
        });
        
        // Remover blur de todos os elementos
        const allBlurred = document.querySelectorAll('[style*="blur"]');
        allBlurred.forEach(el => {
            el.style.filter = '';
            el.style.pointerEvents = '';
        });
        
        // Remover atributo do modal do tutorial
        const tutorialModal = document.getElementById('titleModal');
        if (tutorialModal) {
            tutorialModal.removeAttribute('data-tutorial-modal');
        }
        
        if (overlay) overlay.remove();
        if (highlight) highlight.remove();
        if (arrow) arrow.remove();
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

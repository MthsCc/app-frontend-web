/**
 * Sistema de Notificações Global
 * Funciona em todas as páginas da aplicação
 */

const NotificationSystem = {
    API_URL: 'http://localhost:3000',
    token: null,
    pollingInterval: null,
    
    init() {
        this.token = localStorage.getItem('token');
        if (!this.token) return;
        
        this.setupEventListeners();
        this.startPolling();
        this.loadNotifications();
    },
    
    setupEventListeners() {
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationDropdown();
            });
        }
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('notificationDropdown');
            const btn = document.getElementById('notificationBtn');
            if (dropdown && !dropdown.contains(e.target) && btn && !btn.contains(e.target)) {
                this.closeNotificationDropdown();
            }
        });
        
        // Botão "Marcar todas como lidas"
        const markAllBtn = document.querySelector('[onclick*="markAllNotificationsAsRead"]');
        if (markAllBtn) {
            markAllBtn.onclick = () => this.markAllNotificationsAsRead();
        }
    },
    
    async loadNotifications() {
        try {
            const response = await fetch(`${this.API_URL}/api/social/conversations`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                const conversations = data.conversations || [];
                const unreadConversations = conversations.filter(c => c.unread);
                
                this.displayNotifications(unreadConversations);
                this.updateNotificationBadge(unreadConversations.length);
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    },
    
    displayNotifications(notifications) {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        if (!notifications || notifications.length === 0) {
            container.innerHTML = `
                <div class="p-8 flex flex-col items-center justify-center">
                    <div class="w-16 h-16 rounded-full bg-[#335b7e]/20 flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-[#707d9b] !text-4xl">notifications_none</span>
                    </div>
                    <p class="text-white font-medium text-base mb-1">Ainda não há notificações</p>
                    <p class="text-gray-400 text-sm text-center">Quando você receber mensagens ou outras atualizações, elas aparecerão aqui</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = notifications.map(conv => {
            const otherUser = conv.otherUser || conv.user;
            const avatar = this.createAvatarElement(otherUser, 'w-10 h-10');
            let lastMsg = 'Nova mensagem';
            if (conv.lastMessage) {
                if (typeof conv.lastMessage === 'string') {
                    lastMsg = conv.lastMessage || 'Mídia';
                } else {
                    lastMsg = conv.lastMessage.content || (conv.lastMessage.hasMedia ? 'Mídia' : 'Nova mensagem');
                }
            }
            
            // Escapar HTML para evitar problemas
            const safeName = (otherUser.name || 'Usuário').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeMsg = lastMsg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            // Criar link para abrir chat (se estiver na página echosocial) ou redirecionar
            const chatUrl = window.location.pathname.includes('echosocial.html') 
                ? `javascript:void(0);` 
                : `echosocial.html?chat=${otherUser.id}`;
            
            return `
                <div class="notification-item p-3 hover:bg-[#335b7e] cursor-pointer rounded-lg border-b border-white/5" style="width: 100%; box-sizing: border-box; overflow: hidden;" onclick="window.location.href='${chatUrl}'">
                    <div class="flex items-start gap-3" style="width: 100%; box-sizing: border-box;">
                        <div style="flex-shrink: 0; width: 40px;">${avatar}</div>
                        <div style="flex: 1; min-width: 0; max-width: calc(100% - 60px); overflow: hidden; box-sizing: border-box;">
                            <p class="text-white font-medium text-sm" style="word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; max-width: 100%; overflow: hidden; white-space: normal; margin: 0;">${safeName}</p>
                            <p class="text-gray-400 text-xs mt-1" style="word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; max-width: 100%; overflow: hidden; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-overflow: ellipsis; margin: 0; line-height: 1.4;">${safeMsg}</p>
                        </div>
                        <span class="w-2 h-2 bg-blue-500 rounded-full" style="flex-shrink: 0; width: 8px; height: 8px; margin-top: 4px;"></span>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    createAvatarElement(user, sizeClass = 'w-10 h-10') {
        if (user.profilePicture) {
            return `<img src="${user.profilePicture}" alt="${user.name || 'Usuário'}" class="${sizeClass} rounded-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`;
        }
        const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const colors = ['#335b7e', '#707d9b', '#a7aabd', '#e2e0df'];
        const colorIndex = (user.name || '').length % colors.length;
        return `<div class="${sizeClass} rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: ${colors[colorIndex]}; display: flex;">
            ${initials}
        </div>`;
    },
    
    updateNotificationBadge(count) {
        const notificationBtn = document.getElementById('notificationBtn');
        if (!notificationBtn) return;
        
        if (count > 0) {
            let badge = notificationBtn.querySelector('.notification-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'notification-badge absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center';
                notificationBtn.style.position = 'relative';
                notificationBtn.appendChild(badge);
            }
            badge.textContent = count > 99 ? '99+' : count;
        } else {
            const badge = notificationBtn.querySelector('.notification-badge');
            if (badge) {
                badge.remove();
            }
        }
    },
    
    toggleNotificationDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            if (!dropdown.classList.contains('hidden')) {
                this.loadNotifications();
            }
        }
    },
    
    closeNotificationDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    },
    
    markAllNotificationsAsRead() {
        // Esta função pode ser expandida para marcar todas como lidas via API
        this.closeNotificationDropdown();
        this.loadNotifications();
    },
    
    startPolling() {
        // Atualizar notificações a cada 15 segundos
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        this.pollingInterval = setInterval(() => {
            this.loadNotifications();
        }, 15000);
    },
    
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        NotificationSystem.init();
    });
} else {
    NotificationSystem.init();
}

// Exportar para uso global
window.NotificationSystem = NotificationSystem;



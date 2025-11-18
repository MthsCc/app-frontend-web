/**
 * Sistema de Notificações Global
 * Funciona em todas as páginas da aplicação
 */

// Adicionar estilos CSS para animações
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
            animation: fade-in 0.4s ease-out;
        }
        
        .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}

const NotificationSystem = {
    API_URL: 'https://app-backend-api-h67c.onrender.com',
    token: null,
    pollingInterval: null,
    
    init() {
        // Verificar token no localStorage ou sessionStorage
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
            // Carregar notificações separadas (seguidores, feedbacks, etc)
            const notificationsResponse = await fetch(`${this.API_URL}/api/social/notifications`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (notificationsResponse.ok) {
                const notificationsData = await notificationsResponse.json();
                const notifications = notificationsData.notifications || [];
                const unreadCount = notificationsData.unreadCount || 0;
                
                this.displayNotifications(notifications);
                this.updateNotificationBadge(unreadCount);
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
                <div class="p-8 flex flex-col items-center justify-center animate-fade-in">
                    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-[#335b7e]/30 to-[#707d9b]/20 flex items-center justify-center mb-4 shadow-lg">
                        <span class="material-symbols-outlined text-[#707d9b] !text-5xl">notifications_none</span>
                    </div>
                    <p class="text-white font-semibold text-lg mb-2">Nenhuma notificação</p>
                    <p class="text-gray-400 text-sm text-center max-w-xs">Quando você receber novos seguidores, feedbacks ou outras atualizações, elas aparecerão aqui</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = notifications.map((notif, index) => {
            const sender = notif.sender || {};
            const avatar = this.createAvatarElement(sender, 'w-12 h-12');
            const safeName = (sender.name || notif.title || 'Usuário').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeMsg = (notif.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const timeAgo = this.getTimeAgo(notif.createdAt);
            
            // Determinar ação baseada no tipo
            let onClickAction = 'javascript:void(0);';
            if (notif.action) {
                if (notif.action.type === 'view_profile' && notif.action.userId) {
                    onClickAction = `window.location.href='perfil-publico.html?userId=${notif.action.userId}'`;
                } else if (notif.action.type === 'view_feedback') {
                    onClickAction = `window.location.href='dashboard-admin.html'`;
                }
            }
            
            // Ícone baseado no tipo
            const icon = notif.icon || 'notifications';
            const iconColor = notif.type === 'follower' ? 'from-green-500 to-green-600' : 
                            notif.type === 'feedback' ? 'from-yellow-500 to-yellow-600' : 
                            'from-blue-500 to-blue-600';
            
            return `
                <div class="notification-item group relative p-4 hover:bg-gradient-to-r hover:from-[#335b7e]/30 hover:to-[#707d9b]/20 cursor-pointer rounded-xl border-b border-white/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-slide-in ${!notif.read ? 'bg-blue-500/10' : ''}" style="width: 100%; box-sizing: border-box; overflow: hidden; animation-delay: ${index * 50}ms;" onclick="${onClickAction}; NotificationSystem.markNotificationAsRead('${notif.id}')">
                    <div class="flex items-start gap-4" style="width: 100%; box-sizing: border-box;">
                        <div class="relative flex-shrink-0" style="width: 48px;">
                            ${avatar}
                            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br ${iconColor} rounded-full flex items-center justify-center shadow-md border-2 border-[#051422]">
                                <span class="material-symbols-outlined text-white !text-xs">${icon}</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0" style="max-width: calc(100% - 80px); overflow: hidden; box-sizing: border-box;">
                            <div class="flex items-start justify-between gap-2 mb-1">
                                <p class="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors" style="word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; max-width: 100%; overflow: hidden; white-space: normal; margin: 0;">${safeName}</p>
                                <span class="text-gray-500 text-xs whitespace-nowrap flex-shrink-0">${timeAgo}</span>
                            </div>
                            <p class="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors" style="word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; max-width: 100%; overflow: hidden; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-overflow: ellipsis; margin: 0; line-height: 1.5;">${safeMsg}</p>
                        </div>
                        ${!notif.read ? '<div class="flex-shrink-0 flex flex-col items-center gap-2"><span class="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg animate-pulse"></span></div>' : ''}
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#335b7e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            `;
        }).join('');
    },
    
    getTimeAgo(date) {
        if (!date) return 'Agora';
        const now = new Date();
        const then = new Date(date);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return then.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
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
    
    async markNotificationAsRead(notificationId) {
        try {
            await fetch(`${this.API_URL}/api/social/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            // Recarregar notificações após marcar como lida
            setTimeout(() => this.loadNotifications(), 500);
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
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



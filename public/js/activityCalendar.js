/**
 * Sistema de Calendário de Atividades - Versão Simplificada
 * Focado em sequência (streak) e visualização clara
 */

class ActivityCalendar {
    constructor(containerId, statsContainerId) {
        this.container = document.getElementById(containerId);
        this.statsContainer = document.getElementById(statsContainerId);
        this.userCreatedAt = null;
        this.currentYear = null;
        this.currentMonth = null;
        this.activities = {};
        this.streakInfo = null;
        
        this.init();
    }
    
    async init() {
        await this.loadUserCreatedAt();
        const today = new Date();
        
        if (this.userCreatedAt) {
            const userYear = this.userCreatedAt.getFullYear();
            const userMonth = this.userCreatedAt.getMonth();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth();
            
            if (userYear === todayYear) {
                this.currentYear = todayYear;
                this.currentMonth = Math.max(userMonth, todayMonth);
            } else {
                this.currentYear = userYear;
                this.currentMonth = userMonth;
            }
        } else {
            this.currentYear = today.getFullYear();
            this.currentMonth = today.getMonth();
        }
        
        await this.loadActivities(this.currentYear);
        await this.loadStreak();
        this.renderCalendar();
        this.setupNavigation();
        this.setupStreakRestore();
        
        // Atualizar sequência periodicamente (a cada 30 segundos)
        setInterval(async () => {
            await this.loadStreak();
        }, 30000);
    }
    
    async loadUserCreatedAt() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://app-backend-api-h67c.onrender.com/api/profile/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const userData = await response.json();
                if (userData.createdAt) {
                    this.userCreatedAt = new Date(userData.createdAt);
                    if (isNaN(this.userCreatedAt.getTime())) {
                        this.userCreatedAt = new Date();
                    }
                } else {
                    this.userCreatedAt = new Date();
                }
            } else {
                this.userCreatedAt = new Date();
            }
        } catch (error) {
            console.error('Erro ao carregar data de criação:', error);
            this.userCreatedAt = new Date();
        }
    }
    
    async loadActivities(year) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://app-backend-api-h67c.onrender.com/api/activity/calendar?year=${year}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.activities = data.activities || {};
                
                // Verificar se hoje tem login registrado, se não, tentar corrigir
                const today = new Date();
                const todayYear = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const todayKey = `${todayYear}-${month}-${day}`;
                
                if (!this.activities[todayKey] && todayYear === this.currentYear) {
                    // Tentar corrigir o login de hoje
                    try {
                        const fixResponse = await fetch('https://app-backend-api-h67c.onrender.com/api/activity/fix-today-login', {
                            method: 'POST',
                            headers: { 
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (fixResponse.ok) {
                            const fixData = await fixResponse.json();
                            if (fixData.created) {
                                // Recarregar atividades e sequência após correção
                                await this.loadActivities(year);
                                await this.loadStreak();
                                this.renderCalendar();
                            }
                        }
                    } catch (error) {
                        console.warn('Não foi possível corrigir login de hoje:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            this.activities = {};
        }
    }
    
    async loadStreak() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://app-backend-api-h67c.onrender.com/api/activity/streak', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                this.streakInfo = await response.json();
                console.log('Streak carregado:', this.streakInfo);
                this.updateStreakDisplay();
            } else {
                console.error('Erro ao buscar streak:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Erro ao carregar streak:', error);
        }
    }
    
    updateStreakDisplay() {
        if (!this.streakInfo) {
            console.warn('streakInfo não está disponível');
            return;
        }
        
        const streakElement = document.getElementById('currentStreak');
        const restoreBtn = document.getElementById('restoreStreakBtn');
        
        if (streakElement) {
            const streakValue = this.streakInfo.currentStreak || 0;
            streakElement.textContent = streakValue;
            console.log('Sequência atualizada:', streakValue, 'dias');
        } else {
            console.warn('Elemento currentStreak não encontrado no DOM');
        }
        
        if (restoreBtn) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastLogin = this.streakInfo.lastLoginDate ? new Date(this.streakInfo.lastLoginDate) : null;
            
            if (lastLogin) {
                lastLogin.setHours(0, 0, 0, 0);
                const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
                
                if (daysDiff > 1 && this.streakInfo.restoresAvailable > 0) {
                    restoreBtn.classList.remove('hidden');
                    restoreBtn.title = `Restaurar sequência (${this.streakInfo.restoresAvailable} restaurações disponíveis este mês)`;
                } else {
                    restoreBtn.classList.add('hidden');
                }
            } else {
                restoreBtn.classList.add('hidden');
            }
        }
    }
    
    setupStreakRestore() {
        const restoreBtn = document.getElementById('restoreStreakBtn');
        if (restoreBtn) {
            restoreBtn.onclick = async () => {
                if (!confirm('Tem certeza que deseja restaurar sua sequência? Você tem ' + this.streakInfo.restoresAvailable + ' restaurações disponíveis este mês.')) {
                    return;
                }
                
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('https://app-backend-api-h67c.onrender.com/api/activity/restore-streak', {
                        method: 'POST',
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.streakInfo = data;
                        this.updateStreakDisplay();
                        alert('Sequência restaurada com sucesso!');
                    } else {
                        const errorData = await response.json();
                        alert('Erro: ' + (errorData.error || 'Não foi possível restaurar a sequência'));
                    }
                } catch (error) {
                    console.error('Erro ao restaurar streak:', error);
                    alert('Erro ao restaurar sequência');
                }
            };
        }
    }
    
    renderCalendar() {
        const grid = document.getElementById('activityGrid');
        if (!grid) {
            console.error('Elemento activityGrid não encontrado');
            return;
        }
        
        grid.innerHTML = '';
        
        if (!this.userCreatedAt) {
            console.error('Data de criação não carregada');
            return;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const userCreatedDate = new Date(this.userCreatedAt);
        userCreatedDate.setHours(0, 0, 0, 0);
        
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
        const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
        const firstDayWeekday = firstDayOfMonth.getDay();
        
        // Cabeçalho com dias da semana
        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        weekdays.forEach(day => {
            const headerCell = document.createElement('div');
            headerCell.className = 'text-center text-xs font-semibold text-gray-400 dark:text-gray-500 py-2';
            headerCell.textContent = day;
            grid.appendChild(headerCell);
        });
        
        // Células vazias para alinhar
        for (let i = 0; i < firstDayWeekday; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'aspect-square';
            grid.appendChild(emptyCell);
        }
        
        // Células dos dias
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            currentDate.setHours(0, 0, 0, 0);
            
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateKey = `${year}-${month}-${dayStr}`;
            
            const isToday = this.isToday(currentDate);
            const isPast = currentDate < userCreatedDate;
            const isFuture = currentDate > today;
            const isFirstDay = currentDate.getTime() === userCreatedDate.getTime();
            
            // Verificar se houve login neste dia (atividades do tipo 'login')
            const dayActivities = this.activities[dateKey] || 0;
            // Se houver atividade de login, considerar como login
            const hasLogin = dayActivities > 0 || isFirstDay;
            
            const cell = document.createElement('div');
            cell.className = 'aspect-square flex items-center justify-center rounded-lg relative';
            cell.style.minWidth = '40px';
            cell.style.minHeight = '40px';
            
            if (isPast || isFuture) {
                cell.classList.add('opacity-30', 'bg-gray-800');
                cell.innerHTML = `<span class="text-gray-500 text-sm">${day}</span>`;
            } else {
                // Fundo base
                cell.classList.add('bg-gray-800', 'dark:bg-gray-900');
                
                // Determinar cor da borda baseado em login
                // Primeiro dia sempre verde, depois verifica se teve login
                let hasLoginToday = isFirstDay || hasLogin;
                
                // Aplicar borda colorida
                if (hasLoginToday) {
                    cell.style.border = '3px solid #10b981'; // verde-500
                } else {
                    cell.style.border = '3px solid #ef4444'; // red-500
                }
                
                // Destaque para hoje
                if (isToday) {
                    cell.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
                    cell.style.transform = 'scale(1.1)';
                }
                
                cell.innerHTML = `<span class="text-white text-sm font-bold">${day}</span>`;
            }
            
            grid.appendChild(cell);
        }
        
        this.updateMonthYearDisplay();
        // Garantir que a sequência está atualizada
        if (this.streakInfo) {
            this.updateStreakDisplay();
        }
    }
    
    updateMonthYearDisplay() {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                           'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const monthDisplay = document.getElementById('activityMonthYear');
        if (monthDisplay) {
            monthDisplay.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }
    }
    
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    setupNavigation() {
        setTimeout(() => {
            const prevBtn = document.getElementById('activityPrevMonth');
            const nextBtn = document.getElementById('activityNextMonth');
            
            if (prevBtn) {
                prevBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.navigateMonth(-1);
                };
            }
            
            if (nextBtn) {
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.navigateMonth(1);
                };
            }
            
            this.updateNavigationButtons();
        }, 100);
    }
    
    navigateMonth(direction) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const userCreatedDate = new Date(this.userCreatedAt);
        userCreatedDate.setHours(0, 0, 0, 0);
        
        this.currentMonth += direction;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        
        const minYear = userCreatedDate.getFullYear();
        const minMonth = userCreatedDate.getMonth();
        const maxYear = today.getFullYear();
        const maxMonth = today.getMonth();
        
        const currentDate = new Date(this.currentYear, this.currentMonth, 1);
        const minDate = new Date(minYear, minMonth, 1);
        const maxDate = new Date(maxYear, maxMonth, 1);
        
        if (currentDate < minDate) {
            this.currentYear = minYear;
            this.currentMonth = minMonth;
        } else if (currentDate > maxDate) {
            this.currentYear = maxYear;
            this.currentMonth = maxMonth;
        }
        
        const needsReload = direction !== 0 && (
            (direction > 0 && this.currentMonth === 0) || 
            (direction < 0 && this.currentMonth === 11)
        );
        
        if (needsReload) {
            this.loadActivities(this.currentYear).then(() => {
                this.renderCalendar();
                this.updateNavigationButtons();
            });
        } else {
            this.renderCalendar();
            this.updateNavigationButtons();
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('activityPrevMonth');
        const nextBtn = document.getElementById('activityNextMonth');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const userCreatedDate = new Date(this.userCreatedAt);
        userCreatedDate.setHours(0, 0, 0, 0);
        
        const minYear = userCreatedDate.getFullYear();
        const minMonth = userCreatedDate.getMonth();
        const maxYear = today.getFullYear();
        const maxMonth = today.getMonth();
        
        const currentDate = new Date(this.currentYear, this.currentMonth, 1);
        const minDate = new Date(minYear, minMonth, 1);
        const maxDate = new Date(maxYear, maxMonth, 1);
        
        if (prevBtn) {
            if (currentDate <= minDate) {
                prevBtn.disabled = true;
                prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                prevBtn.disabled = false;
                prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        if (nextBtn) {
            if (currentDate >= maxDate) {
                nextBtn.disabled = true;
                nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                nextBtn.disabled = false;
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }
}

// Exportar para uso global
window.ActivityCalendar = ActivityCalendar;

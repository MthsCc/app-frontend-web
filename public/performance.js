// Otimizações de Performance

// 1. Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker não disponível');
        });
    });
}

// 2. Lazy Loading de Imagens
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach((img) => {
            imageObserver.observe(img);
        });
    }
});

// 3. Preload de recursos críticos
function preloadResource(url, as = 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
}

// 4. Debounce para eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 5. Throttle para eventos frequentes
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// 6. Medir Core Web Vitals
if ('web-vital' in window || 'PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        console.log('LCP não suportado');
    }

    // First Input Delay (FID)
    try {
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                console.log('FID:', entry.processingDuration);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
        console.log('FID não suportado');
    }

    // Cumulative Layout Shift (CLS)
    try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
        console.log('CLS não suportado');
    }
}

// 7. Otimizar carregamento de scripts
function loadScriptAsync(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
}

// 8. Compressão de dados em requisições
function compressData(data) {
    return JSON.stringify(data);
}

// 9. Cache de requisições GET
const requestCache = new Map();

function cachedFetch(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);
    
    if (requestCache.has(cacheKey)) {
        return Promise.resolve(requestCache.get(cacheKey));
    }
    
    return fetch(url, options)
        .then((response) => {
            if (response.ok) {
                const cloned = response.clone();
                cloned.json().then((data) => {
                    requestCache.set(cacheKey, data);
                    // Limpar cache após 5 minutos
                    setTimeout(() => requestCache.delete(cacheKey), 5 * 60 * 1000);
                });
            }
            return response;
        });
}

// 10. Monitorar performance de navegação
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Tempo total de carregamento:', pageLoadTime, 'ms');
    
    // Enviar dados de performance para análise (opcional)
    if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('loadTime', pageLoadTime);
        navigator.sendBeacon('/api/analytics', data);
    }
});

// 11. Otimizar renderização com requestAnimationFrame
function optimizeAnimation(callback) {
    let ticking = false;
    return function() {
        if (!ticking) {
            window.requestAnimationFrame(callback);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    };
}

// 12. Prefetch de recursos
function prefetchResource(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
}

// Exportar funções para uso global
window.PerformanceUtils = {
    debounce,
    throttle,
    cachedFetch,
    loadScriptAsync,
    preloadResource,
    prefetchResource,
    optimizeAnimation
};

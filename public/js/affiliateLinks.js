/**
 * Configuração de Links de Afiliados
 * 
 * Edite este arquivo para adicionar seus próprios links de afiliados.
 * Substitua os links genéricos pelos seus links de afiliado personalizados.
 * 
 * Variáveis disponíveis:
 * - {title}: Nome do filme/série
 * - {searchQuery}: Nome do filme/série codificado para URL
 * - {tmdbId}: ID do filme/série no TMDB
 * - {type}: Tipo ('movie' ou 'tv')
 */

const AFFILIATE_LINKS_CONFIG = {
    // Amazon Prime Video
    'Amazon Prime Video': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado da Amazon
        // Exemplo: return `https://www.amazon.com.br/dp/SEU_CODIGO_AFILIADO?tag=seu-tag&keywords=${searchQuery}`;
        return `https://www.primevideo.com/search/ref=atv_sr_sug_1?phrase=${searchQuery}`;
    },
    
    // Apple TV
    'Apple TV': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado da Apple TV
        // Exemplo: return `https://tv.apple.com/search?term=${searchQuery}&at=SEU_CODIGO`;
        return `https://tv.apple.com/search?term=${searchQuery}`;
    },
    
    // Apple iTunes
    'Apple iTunes': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do iTunes
        // Exemplo: return `https://itunes.apple.com/search?term=${searchQuery}&media=${type === 'tv' ? 'tvShow' : 'movie'}&at=SEU_CODIGO`;
        return `https://itunes.apple.com/search?term=${searchQuery}&media=${type === 'tv' ? 'tvShow' : 'movie'}`;
    },
    
    // Google Play Movies
    'Google Play Movies': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Google Play
        // Exemplo: return `https://play.google.com/store/search?q=${searchQuery}&c=movies&pcampaignid=SEU_CODIGO`;
        return `https://play.google.com/store/search?q=${searchQuery}&c=movies`;
    },
    
    // YouTube
    'YouTube': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do YouTube (se tiver programa de afiliados)
        return `https://www.youtube.com/results?search_query=${searchQuery}`;
    },
    
    // Paramount
    'Paramount': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Paramount+
        return `https://www.paramountplus.com/search/?q=${searchQuery}`;
    },
    
    // Max (HBO Max)
    'Max': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Max
        return `https://www.max.com/search?q=${searchQuery}`;
    },
    
    // HBO Max
    'HBO Max': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do HBO Max
        return `https://www.max.com/search?q=${searchQuery}`;
    },
    
    // Discovery+
    'Discovery+': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Discovery+
        return `https://www.discoveryplus.com/search?q=${searchQuery}`;
    },
    
    // Claro video
    'Claro video': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Claro Video
        return `https://www.clarovideo.com/brasil/web/guest/search?term=${searchQuery}`;
    },
    
    // NOW
    'NOW': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do NOW
        return `https://www.nowtv.com/search?q=${searchQuery}`;
    },
    
    // Rakuten TV
    'Rakuten TV': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Rakuten TV
        return `https://rakuten.tv/br/search?q=${searchQuery}`;
    },
    
    // Vudu
    'Vudu': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Vudu
        return `https://www.vudu.com/content/search?q=${searchQuery}`;
    },
    
    // Starz
    'Starz': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do Starz
        return `https://www.starz.com/search?q=${searchQuery}`;
    },
    
    // StarzPlay
    'StarzPlay': (title, searchQuery, tmdbId, type) => {
        // Substitua pelo seu link de afiliado do StarzPlay
        return `https://www.starz.com/search?q=${searchQuery}`;
    }
};

/**
 * Função para gerar link de afiliado
 * @param {string} providerName - Nome do provider
 * @param {string} titleName - Nome do filme/série
 * @param {number} tmdbId - ID do TMDB
 * @param {string} type - Tipo ('movie' ou 'tv')
 * @returns {string|null} - Link de afiliado ou null se não encontrado
 */
function generateAffiliateLink(providerName, titleName, tmdbId, type) {
    const providerKey = Object.keys(AFFILIATE_LINKS_CONFIG).find(
        key => key.toLowerCase() === providerName.toLowerCase() ||
               providerName.toLowerCase().includes(key.toLowerCase()) ||
               key.toLowerCase().includes(providerName.toLowerCase())
    );
    
    if (!providerKey) {
        return null;
    }
    
    const searchQuery = encodeURIComponent(titleName);
    const generator = AFFILIATE_LINKS_CONFIG[providerKey];
    
    if (typeof generator === 'function') {
        return generator(titleName, searchQuery, tmdbId, type);
    }
    
    return null;
}

// Tornar a função disponível globalmente
window.generateAffiliateLink = generateAffiliateLink;


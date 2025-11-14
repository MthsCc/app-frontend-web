# 🔗 Como Configurar Seus Links de Afiliados

Este arquivo explica como adicionar seus próprios links de afiliados ao EchoView.

## 📁 Arquivo de Configuração

Edite o arquivo: `frontend/public/js/affiliateLinks.js`

## 📝 Como Adicionar Seus Links

1. Abra o arquivo `affiliateLinks.js`
2. Para cada provider, substitua o `return` dentro da função pelo seu link de afiliado
3. Use as variáveis disponíveis:
   - `title`: Nome completo do filme/série
   - `searchQuery`: Nome codificado para URL (já pronto para usar)
   - `tmdbId`: ID do filme/série no TMDB
   - `type`: Tipo ('movie' ou 'tv')

## 💡 Exemplos

### Amazon Prime Video
```javascript
'Amazon Prime Video': (title, searchQuery, tmdbId, type) => {
    // Seu código de afiliado da Amazon
    return `https://www.amazon.com.br/dp/SEU_CODIGO?tag=seu-tag-20&keywords=${searchQuery}`;
},
```

### Apple TV
```javascript
'Apple TV': (title, searchQuery, tmdbId, type) => {
    // Seu código de afiliado da Apple
    return `https://tv.apple.com/search?term=${searchQuery}&at=SEU_CODIGO`;
},
```

### Google Play Movies
```javascript
'Google Play Movies': (title, searchQuery, tmdbId, type) => {
    // Seu código de afiliado do Google Play
    return `https://play.google.com/store/search?q=${searchQuery}&c=movies&pcampaignid=SEU_CODIGO`;
},
```

## 🎯 Providers Disponíveis

- Amazon Prime Video
- Apple TV
- Apple iTunes
- Google Play Movies
- YouTube
- Paramount
- Max
- HBO Max
- Discovery+
- Claro video
- NOW
- Rakuten TV
- Vudu
- Starz
- StarzPlay

## ⚠️ Importante

- Mantenha as variáveis `${searchQuery}`, `${title}`, `${tmdbId}`, `${type}` no link quando necessário
- Teste seus links após adicionar
- Certifique-se de que seus links de afiliado estão ativos
- Alguns providers podem não ter programa de afiliados - nesse caso, use links de busca genéricos

## 🔄 Após Editar

Após editar o arquivo, recarregue a página no navegador (Ctrl+F5 ou Cmd+Shift+R) para ver as mudanças.



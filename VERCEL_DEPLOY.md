# Configuração do Deploy no Vercel

## ⚠️ Erro 401 no manifest.json

Se você está recebendo erro 401 ao acessar o `manifest.json`, siga estes passos:

### 1. Verificar Configurações do Projeto no Vercel

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **General**
4. Verifique se o projeto está configurado como **Public** (não privado)
5. Em **Deployment Protection**, desative a proteção para deploy previews se estiver ativa

### 2. Verificar Root Directory ✅ CORRETO

**Baseado na estrutura do repositório GitHub (`app-frontend-web`):**

1. No Vercel, vá em **Settings** → **General**
2. Em **Root Directory**, configure como `public` ou deixe **VAZIO**
   - Como o repositório tem `public/` na raiz, você pode:
     - Deixar vazio (Vercel usará a raiz do repositório)
     - Ou configurar como `public` (se quiser ser explícito)
   - **NÃO use `frontend/public`** - essa pasta não existe no repositório GitHub

### 3. Verificar Build Settings ✅ CORREÇÃO NECESSÁRIA

1. Vá em **Settings** → **General** → **Build & Development Settings**
2. Ajuste as seguintes configurações:
   - **Framework Preset**: Other ✅ (já está correto)
   - **Build Command**: (deixe vazio ou remova o override)
   - **Output Directory**: Altere de `public` para `.` (ponto)
     - O ponto (`.`) significa "a raiz do Root Directory"
     - Se Root Directory for `public`, o Output Directory `.` apontará para `public/`
     - Se Root Directory estiver vazio, o Output Directory `.` apontará para a raiz do repo
   - **Install Command**: (deixe vazio ou remova o override)
   - **Development Command**: (deixe vazio)

**Resumo da configuração correta:**
- **Root Directory**: `public` (ou vazio)
- **Output Directory**: `.` (ponto)

### 4. Verificar Environment Variables

Certifique-se de que não há variáveis de ambiente que possam estar causando autenticação.

### 5. Localização do vercel.json ✅ JÁ CRIADO

O arquivo `vercel.json` deve estar na **raiz do diretório de deploy**:
- Como o Root Directory é `public` (ou vazio), o arquivo deve estar em `public/vercel.json` ✅
- **Já foi criado!** O arquivo está em `ubuntu/project/frontend/public/vercel.json`
- **IMPORTANTE:** Quando você fizer commit e push para o GitHub, certifique-se de que o arquivo `vercel.json` esteja na pasta `public/` do repositório

### 6. Testar Localmente

Após fazer as alterações:
1. Faça commit das mudanças
2. Faça push para o repositório
3. O Vercel fará um novo deploy automaticamente
4. Aguarde o deploy completar
5. Teste acessando: `https://seu-projeto.vercel.app/manifest.json`

### 7. Se o Erro Persistir

Se ainda houver erro 401 após seguir os passos acima:

1. **Verifique se o projeto não está em modo privado:**
   - Vá em **Settings** → **General**
   - Certifique-se de que não há proteção de autenticação ativa

2. **Crie um arquivo `vercel.json` na pasta `public/` também:**
   ```bash
   cp frontend/vercel.json frontend/public/vercel.json
   ```

3. **Verifique os logs do deploy:**
   - No Vercel, vá em **Deployments**
   - Clique no último deploy
   - Verifique se há erros nos logs

4. **Tente acessar diretamente:**
   - `https://seu-projeto.vercel.app/manifest.json`
   - Se retornar 401, o problema é de configuração do Vercel
   - Se retornar 404, o arquivo não está sendo servido corretamente

## 🔴 SOLUÇÃO PARA ERRO 401 - PASSOS CRÍTICOS

O erro 401 geralmente ocorre porque:

### 1. Deploy Preview Protegido ⚠️ MAIS COMUM

Se a URL é algo como `app-frontend-XXXXX-mthsccs-projects.vercel.app`, é um **preview deployment** que pode estar protegido.

**Solução:**
1. No Vercel, vá em **Settings** → **Deployment Protection**
2. Desative a proteção para **Preview Deployments**
3. Ou acesse o **domínio de produção** (não o preview):
   - Vá em **Settings** → **Domains**
   - Use o domínio de produção (ex: `app-frontend.vercel.app`)

### 2. Projeto em Modo Privado

1. No Vercel, vá em **Settings** → **General**
2. Verifique se há alguma opção de **Privacy** ou **Visibility**
3. Certifique-se de que o projeto está **público**

### 3. Verificar Configuração de Autenticação

1. No Vercel, vá em **Settings** → **Security**
2. Verifique se há **Password Protection** ou **Vercel Authentication** ativa
3. **DESATIVE** qualquer proteção de autenticação se quiser acesso público

### 4. Testar no Domínio de Produção

O erro pode estar apenas nos preview deployments. Teste:
- Acesse: `https://app-frontend.vercel.app/manifest.json` (domínio de produção)
- Se funcionar no domínio de produção, o problema é apenas nos previews

### 5. Verificar Permissões do Projeto

1. No Vercel, vá em **Settings** → **General**
2. Verifique a seção **Permissions**
3. Certifique-se de que arquivos estáticos podem ser acessados publicamente

## 📝 Notas Importantes

- O erro 401 geralmente indica que há **proteção de autenticação** ativa no Vercel
- **Deploy previews podem estar protegidos por padrão** - este é o problema mais comum
- Certifique-se de que o projeto está configurado como **público** se você quer acesso público aos arquivos estáticos
- **Sempre teste no domínio de produção**, não apenas nos preview deployments


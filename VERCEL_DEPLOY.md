# 🚀 Deploy do alaganao na Vercel

Este guia contém todas as instruções para fazer deploy do PWA **alaganao** na Vercel com todas as otimizações aplicadas.

## 📋 Pré-requisitos

### 1. **Conta na Vercel**

- Crie uma conta em https://vercel.com
- Conecte com seu GitHub, GitLab ou Bitbucket

### 2. **Supabase Configurado**

- Projeto Supabase ativo
- URLs e chaves de API disponíveis

### 3. **Repositório Git**

- Código commitado no GitHub/GitLab/Bitbucket
- Branch main/master atualizada

## 🔧 Configuração Inicial

### 1. **Instalar Vercel CLI** (Opcional)

```bash
npm i -g vercel
vercel login
```

### 2. **Variáveis de Ambiente**

Crie um arquivo `.env.local` baseado no `env.example`:

```bash
cp env.example .env.local
```

Configure as variáveis necessárias:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
VITE_APP_URL=https://seu-dominio.vercel.app
```

## 🚀 Deploy via Dashboard Vercel

### 1. **Importar Projeto**

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório do alaganao
4. Configure as opções:

```
Project Name: alaganao
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build:production
Output Directory: dist
Install Command: npm install
```

### 2. **Configurar Variáveis de Ambiente**

No dashboard da Vercel:

1. Vá em "Settings" → "Environment Variables"
2. Adicione as variáveis do `.env.example`
3. Marque para todos os environments (Production, Preview, Development)

### 3. **Deploy**

1. Clique em "Deploy"
2. Aguarde o build completar (~2-3 minutos)
3. Acesse a URL gerada

## 🚀 Deploy via CLI

### 1. **Deploy de Preview**

```bash
# Gerar ícones e fazer build
npm run predeploy

# Deploy de preview
vercel
```

### 2. **Deploy de Produção**

```bash
# Deploy direto para produção
npm run deploy:production
```

## ⚙️ Configurações Avançadas

### 1. **Domínio Personalizado**

1. No dashboard: "Settings" → "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções

### 2. **Configurações de Build**

O arquivo `vercel.json` já está configurado com:

- ✅ Rewrites para SPA
- ✅ Headers otimizados para PWA
- ✅ Cache de assets estáticos
- ✅ Service Worker configurado

### 3. **Analytics** (Opcional)

1. Ative Vercel Analytics no dashboard
2. Adicione `VITE_VERCEL_ANALYTICS_ID` nas env vars

## 🧪 Testes Pós-Deploy

### 1. **Testar PWA**

```bash
# Testar localmente primeiro
npm run preview:build
npm run test:pwa
```

### 2. **Lighthouse Audit**

1. Acesse seu site na Vercel
2. Abra DevTools → Lighthouse
3. Execute audit completo
4. Score PWA deve ser 100 ✅

### 3. **Testes de Funcionalidade**

- [ ] Site carrega corretamente
- [ ] PWA pode ser instalado
- [ ] Service Worker funciona
- [ ] Autenticação Supabase funciona
- [ ] Todas as páginas carregam
- [ ] Modo offline funciona

## 🔄 CI/CD Automático

### 1. **Deploy Automático**

A Vercel automaticamente:

- ✅ Faz deploy a cada push na branch main
- ✅ Cria preview a cada Pull Request
- ✅ Executa builds otimizados
- ✅ Aplica configurações do vercel.json

### 2. **Hooks de Deploy**

Adicione ao `package.json` para executar antes do deploy:

```json
{
  "scripts": {
    "predeploy": "npm run generate-icons && npm run lint && npm run build:production"
  }
}
```

## 📊 Monitoramento

### 1. **Vercel Analytics**

- Métricas de performance
- Core Web Vitals
- Dados de usuário real

### 2. **Logs de Função**

- Para futuras API routes
- Monitoramento de erros

## 🐛 Troubleshooting

### ❌ **Build Falha**

```bash
# Limpar cache e tentar novamente
npm run clean
npm install
npm run build:production
```

### ❌ **Service Worker Não Funciona**

1. Verifique se `sw.js` está na raiz do site
2. Confirme headers no Network tab
3. Teste em modo incógnito

### ❌ **PWA Não Instala**

1. Verifique manifest.json
2. Confirme que está servindo via HTTPS
3. Teste em Chrome/Edge primeiro

### ❌ **Supabase Não Conecta**

1. Verifique variáveis de ambiente
2. Confirme CORS no Supabase
3. Teste URLs manualmente

## 📈 Otimizações Pós-Deploy

### 1. **Performance**

- [ ] Configure CDN para assets grandes
- [ ] Implemente lazy loading
- [ ] Otimize imagens para WebP

### 2. **SEO**

- [ ] Configure sitemap.xml
- [ ] Adicione meta tags Open Graph
- [ ] Configure Google Search Console

### 3. **Analytics**

- [ ] Google Analytics
- [ ] Hotjar/FullStory para UX
- [ ] Error tracking (Sentry)

## 🎯 URLs Importantes

- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs
- **Status**: https://vercel-status.com/
- **Community**: https://github.com/vercel/vercel/discussions

## 🎉 Pronto!

Seu PWA **alaganao** agora está rodando na Vercel com:

- ✅ Deploy automático
- ✅ PWA completo e funcional
- ✅ Performance otimizada
- ✅ Cache inteligente
- ✅ Domínio personalizado
- ✅ SSL automático
- ✅ CDN global

---

## 📞 Suporte

Em caso de problemas:

1. Verifique logs no dashboard Vercel
2. Consulte a documentação oficial
3. Abra issue no repositório do projeto

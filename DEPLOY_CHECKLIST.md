# ✅ Checklist de Deploy - alaganao PWA

## 📋 Pré-Deploy

### ✅ **Arquivos de Configuração**

- [x] `vercel.json` - Configurações PWA para Vercel
- [x] `vite.config.ts` - Build otimizado para produção
- [x] `manifest.json` - Manifesto PWA completo
- [x] `sw.js` - Service Worker funcional
- [x] `.npmrc` - Configurações npm para Vercel
- [x] `package.json` - Scripts de deploy

### ✅ **Assets PWA**

- [x] Ícones SVG gerados (16x16 até 512x512)
- [x] Ícones de shortcuts (map, report, alert, donation)
- [x] `favicon.svg` atualizado
- [x] `browserconfig.xml` para Windows
- [x] `robots.txt` otimizado

### ✅ **Build e Testes**

- [x] `npm run build:production` - ✅ Funcionando
- [x] Chunks otimizados e minificados
- [x] Service Worker na raiz do build
- [x] Manifest acessível via HTTP

## 🚀 Deploy na Vercel

### 📝 **Informações Necessárias**

```
Project Name: alaganao
Framework: Vite
Build Command: npm run build:production
Output Directory: dist
Install Command: npm install
```

### 🔐 **Variáveis de Ambiente**

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_APP_URL=https://seu-dominio.vercel.app
VITE_APP_NAME=alaganao
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PWA=true
```

### 📋 **Passos de Deploy**

#### Via Dashboard:

1. [ ] Acessar https://vercel.com/new
2. [ ] Importar repositório GitHub
3. [ ] Configurar build settings
4. [ ] Adicionar variáveis de ambiente
5. [ ] Fazer deploy inicial

#### Via CLI:

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod
```

## 🧪 Testes Pós-Deploy

### 🌐 **Funcionalidades Básicas**

- [ ] Site carrega corretamente
- [ ] Todas as páginas acessíveis
- [ ] Login/Register funcionando
- [ ] Rotas protegidas funcionando

### 📱 **PWA Features**

- [ ] Manifest.json acessível (`/manifest.json`)
- [ ] Service Worker registrado (`/sw.js`)
- [ ] PWA detectado pelo browser
- [ ] Botão de instalação aparece
- [ ] PWA pode ser instalado
- [ ] App funciona offline

### ⚡ **Performance**

- [ ] Lighthouse Score > 90
- [ ] PWA Score = 100
- [ ] Core Web Vitals ✅
- [ ] Assets carregam rapidamente

### 🔧 **Testes Técnicos**

```bash
# Teste de PWA
npx lighthouse https://seu-dominio.vercel.app --only-categories=pwa --view

# Teste completo
npx lighthouse https://seu-dominio.vercel.app --view
```

## 🎯 **Verificações Específicas PWA**

### 📋 **Manifest**

- [ ] Acessível via HTTPS
- [ ] Campos obrigatórios preenchidos
- [ ] Ícones em todos os tamanhos
- [ ] Shortcuts configurados

### ⚙️ **Service Worker**

- [ ] Registrado corretamente
- [ ] Cache funcionando
- [ ] Estratégias de cache implementadas
- [ ] Offline fallback funciona

### 🔔 **Recursos Avançados**

- [ ] Install prompt funciona
- [ ] Standalone mode detectado
- [ ] Shortcuts da homescreen
- [ ] Share target configurado

## 🚨 **Troubleshooting Comum**

### ❌ **Build Falha**

```bash
# Limpar e tentar novamente
npm run clean
npm install --legacy-peer-deps
npm run build:production
```

### ❌ **Service Worker Não Carrega**

- Verificar se `sw.js` está na raiz (`/sw.js`)
- Confirmar headers de cache no vercel.json
- Testar em modo incógnito

### ❌ **PWA Não Instala**

- Verificar HTTPS (obrigatório)
- Confirmar manifest.json válido
- Testar no Chrome primeiro
- Verificar console para erros

### ❌ **Supabase Não Conecta**

- Verificar variáveis de ambiente
- Confirmar CORS no dashboard Supabase
- Testar URLs manualmente

## 📊 **Métricas de Sucesso**

### 🎯 **Lighthouse Scores Esperados**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90
- PWA: 100 ✅

### 📈 **Core Web Vitals**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🎉 **Deploy Concluído!**

Quando todos os itens estiverem ✅, seu PWA estará:

- 🌐 Online na Vercel
- 📱 Instalável como app nativo
- ⚡ Otimizado para performance
- 🔄 Com deploy automático configurado
- 📊 Monitorado via analytics

---

## 📞 **Próximos Passos**

1. **Domínio Personalizado**: Configure seu domínio próprio
2. **Analytics**: Implemente Google Analytics
3. **Monitoring**: Configure error tracking
4. **SEO**: Adicione sitemap e meta tags
5. **Push Notifications**: Ative notificações push

**🔗 URLs Importantes:**

- Dashboard: https://vercel.com/dashboard
- Docs PWA: https://web.dev/progressive-web-apps/
- Lighthouse: https://developers.google.com/web/tools/lighthouse

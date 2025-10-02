# 📱 PWA (Progressive Web App) - Nexus

Este documento descreve a configuração do PWA implementada no Nexus.

## 🎯 O que é PWA?

PWA (Progressive Web App) permite que o Nexus seja instalado como um aplicativo nativo no dispositivo do usuário, funcionando offline e oferecendo uma experiência similar a aplicativos nativos.

## ✨ Funcionalidades Implementadas

### 1. **Instalação como App**
- ✅ Instalável em Android, iOS, Windows, Mac e Linux
- ✅ Ícone na tela inicial / área de trabalho
- ✅ Funcionamento em tela cheia (sem barra do navegador)
- ✅ Splash screen personalizada

### 2. **Offline Support**
- ✅ Página de offline customizada
- ✅ Cache de recursos estáticos
- ✅ Service Worker para gerenciar cache

### 3. **Otimizações**
- ✅ Ícones em múltiplos tamanhos (72x72 até 512x512)
- ✅ Suporte para iOS e Android
- ✅ Tema e cores personalizadas
- ✅ Atalhos rápidos (Dashboard, Despesas, Receitas)

## 📦 Arquivos Principais

### `public/manifest.json`
Define as configurações do PWA:
- Nome e descrição do app
- Ícones em vários tamanhos
- Cor do tema (#00D4AA)
- Atalhos rápidos
- Orientação (portrait)

### `next.config.js`
Configuração do plugin `@ducanh2912/next-pwa`:
- Geração automática do Service Worker
- Cache de recursos
- Fallback para página offline

### `src/app/layout.tsx`
Meta tags e configurações de PWA:
- Links para ícones
- Configurações de Apple Web App
- Link para manifest.json

### `src/app/offline/page.tsx`
Página exibida quando o usuário está offline.

## 🚀 Como Testar

### Em Desenvolvimento
O PWA está **desabilitado em desenvolvimento** para facilitar o desenvolvimento.

### Em Produção

1. **Build do projeto:**
   ```bash
   npm run build
   ```

2. **Iniciar servidor de produção:**
   ```bash
   npm start
   ```

3. **Testar instalação:**
   - **Chrome/Edge:** Clique no ícone de instalação na barra de endereço
   - **iOS Safari:** Toque em "Compartilhar" → "Adicionar à Tela de Início"
   - **Android Chrome:** Toque no menu → "Instalar app"

## 📱 Como Instalar (Usuários Finais)

### Android (Chrome, Edge, Brave)
1. Acesse o Nexus pelo navegador
2. Toque no menu **⋮** (três pontos)
3. Selecione **"Adicionar à tela inicial"** ou **"Instalar app"**
4. Confirme a instalação

### iOS (Safari)
1. Acesse o Nexus pelo Safari
2. Toque no botão **Compartilhar** (quadrado com seta)
3. Role para baixo e toque em **"Adicionar à Tela de Início"**
4. Confirme o nome e toque em **"Adicionar"**

### Desktop (Windows, Mac, Linux)
1. Acesse o Nexus no Chrome ou Edge
2. Clique no ícone de **instalação** na barra de endereço
3. Clique em **"Instalar"**

## 🔧 Customização

### Alterar Cores do Tema
Edite `public/manifest.json`:
```json
{
  "theme_color": "#00D4AA",
  "background_color": "#0E1116"
}
```

### Adicionar/Remover Atalhos
Edite a seção `shortcuts` em `public/manifest.json`:
```json
{
  "shortcuts": [
    {
      "name": "Novo Atalho",
      "url": "/rota",
      "icons": [...]
    }
  ]
}
```

### Modificar Comportamento Offline
Edite `next.config.js`:
```javascript
const withPWA = require('@ducanh2912/next-pwa').default({
  fallbacks: {
    document: '/offline', // Página offline
  },
});
```

## 📝 Ícones Necessários

Os seguintes ícones devem estar em `public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-180x180.png` (Apple)
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## 🐛 Troubleshooting

### PWA não aparece para instalação
- Certifique-se de estar usando **HTTPS** (ou localhost)
- Verifique se o `manifest.json` está acessível
- Abra DevTools → Application → Manifest para ver erros

### Service Worker não atualiza
- Limpe o cache do navegador
- Desinstale e reinstale o PWA
- Em DevTools → Application → Service Workers → Unregister

### Ícones não aparecem
- Verifique se os arquivos existem em `public/icons/`
- Confirme os tamanhos corretos (72x72, 96x96, etc.)
- Use ferramentas como [RealFaviconGenerator](https://realfavicongenerator.net/)

## 📚 Recursos

- [Next PWA Documentation](https://github.com/DuCanh541/next-pwa)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## ✅ Checklist de Implementação

- [x] Instalar `@ducanh2912/next-pwa`
- [x] Configurar `next.config.js`
- [x] Criar `manifest.json`
- [x] Adicionar meta tags no layout
- [x] Criar página offline
- [x] Adicionar entradas no `.gitignore`
- [ ] Gerar ícones em todos os tamanhos
- [ ] Testar em diferentes dispositivos
- [ ] Testar funcionamento offline
- [ ] Deploy em produção com HTTPS

---

**Nota:** Os ícones precisam ser criados/gerados antes do deploy em produção. Use o logo do Nexus como base.

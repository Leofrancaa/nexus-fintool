# DatePicker Component

Componente de calendário personalizado no estilo visual do Nexus.

## Características

✨ **Visual moderno** com gradiente do Nexus (azul → ciano → verde)
📅 **Navegação por mês** com setas
🎯 **Destaque do dia atual** em azul
✅ **Botão "Hoje"** para seleção rápida
🎨 **Totalmente integrado** com o design system do projeto
🌙 **Suporte a dark mode** automático via variáveis CSS

## Como usar

```tsx
import { DatePicker } from "@/components/ui/datePicker";

function MyForm() {
  const [data, setData] = useState("2025-10-02"); // YYYY-MM-DD

  return (
    <DatePicker
      value={data}
      onChange={setData}
      placeholder="Selecione uma data"
    />
  );
}
```

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `value` | `string` | Data no formato `YYYY-MM-DD` |
| `onChange` | `(date: string) => void` | Callback quando data é selecionada |
| `placeholder` | `string` (opcional) | Texto quando não há data selecionada |

## Estilização

O componente usa as variáveis CSS do projeto:

- `--card-bg`: Fundo do calendário
- `--card-border`: Bordas
- `--card-text`: Texto
- `--hover-bg`: Hover dos dias

## Funcionalidades

- ✅ Clique fora fecha o calendário
- ✅ Navegação por mês (setas)
- ✅ Seleção visual do dia escolhido (gradiente)
- ✅ Destaque do dia de hoje
- ✅ Botão "Hoje" para seleção rápida
- ✅ Dias da semana em português
- ✅ Meses em português completo

## Diferença do input nativo

❌ Input nativo `<input type="date">`:
- Visual genérico do navegador
- Formato varia por navegador/OS
- Difícil customizar

✅ DatePicker customizado:
- Visual consistente em todos os navegadores
- Totalmente integrado ao design do Nexus
- Fácil de customizar e estender

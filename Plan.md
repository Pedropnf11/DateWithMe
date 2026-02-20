# DateLink.me - Especificação Completa da App

## Objetivo do Projeto
O DateLink.me é uma aplicação web que permite convidar alguém para um encontro através de um link romântico interativo.  
Não é uma rede social, nem um chat, nem uma app de dating.  
É uma ferramenta de momento: criar um convite especial e receber uma resposta emocional.  
O foco principal: rapidez, zero fricção, privacidade, experiência mobile.

## Público-Alvo
- Jovens adultos (18-35 anos) que querem fazer convites românticos de forma divertida e privada.  
- Pessoas em relacionamentos iniciais ou estabelecidos que buscam algo leve e gamificado para primeiros dates, aniversários ou surpresas.  
- Utilizadores que valorizam privacidade (sem registo, sem histórico permanente) e simplicidade (criar em ≤60 segundos).  
- Mercado inicial: Portugal, Brasil e outros países lusófonos, com expansão para inglês.

## Princípios do Produto
A aplicação deve ser:  
- Instantânea (≤ 60 segundos para criar).  
- Sem registo obrigatório.  
- Sem perfis públicos.  
- Sem histórico permanente.  
- Utilizável apenas com um link.

## Conceito Central
O sistema não utiliza contas.  
Cada convite é um objeto temporário independente.  
O acesso é controlado por links privados.  
Quem possui o link correto tem acesso — quem não possui, não existe forma de recuperar.

## Sistema de Links
Quando um utilizador cria um convite, o sistema gera automaticamente dois links:  
1. **Link público** — para a pessoa convidada:  
   - Permite abrir e responder ao convite.  
   - Exemplo: datelink.me/d/A1bC9xK2.  
   - Características: Qualquer pessoa com este link pode ver o convite; não permite ver a resposta depois; não permite editar.  

2. **Link privado** — para quem criou:  
   - É a chave secreta do convite.  
   - Exemplo: datelink.me/r/A1bC9xK2?key=Kf82LmQp91sXa.  
   - Permite: Ver estado (não visto / visto / respondeu); ler a resposta; reabrir durante 1 dias.  
   - ⚠️ Este link não pode ser recuperado. A aplicação não guarda identidade do utilizador.  

Após 1 dias: convite, resposta e media são automaticamente apagados.

## Funcionalidades do MVP (por pontos)
1. **Landing Page**:  
   - Explicar em segundos.  
   - Elementos: Headline, botão “Criar convite grátis”, 3 passos (Criar, Enviar, Receber resposta).  

2. **Criar Convite (multi-step)**:  
   - Step 1: Escolher Template/Modo (First Date 🌸, Anniversary 💝, Special ✨, Surprise 🎲).  
   - Steps subsequentes variam por modo (ver seção Modos abaixo).  
   - Após gerar: Mostrar botão para Enviar convite (WhatsApp share), Guardar link da resposta.  
   - Aviso claro: “Este link é a única forma de veres a resposta. Por privacidade, não conseguimos recuperá-lo. Guarda já ou envia para ti próprio no WhatsApp.”  

3. **Página do Convite (para quem recebe)**:  
   - Design temático com animações suaves e música opcional.  
   - Mostra pergunta, detalhes (data, atividade, local).  
   - Botões: SIM ❤️ (destacado), NÃO (com efeito divertido, ex: fugir do cursor).  

4. **Resposta**:  
   - Se SIM: Mensagem opcional, sugerir alternativa (data/local).  
   - Se NÃO: Mensagem opcional.  
   - Após envio: “Resposta enviada 💌”.  

5. **Página do Criador (ver resposta)**:  
   - Estados: Ainda não aberto, Já aberto, Respondido.  
   - Se respondido: Mostrar decisão, mensagem, sugestões.  
   - Mostrar contador: “Apaga em X dias”.  

6. **Expiração Automática**:  
   - Convites apagados 1 dias após resposta OU 1 dias após criação se não houver resposta.  
   - Sem histórico permanente.  

## Estrutura de Cada Invite
Cada invite é um objeto JSON-like temporário armazenado no backend (ex: Firebase), com expiração automática. Estrutura base:  
- **ID**: UUID único gerado automaticamente.  
- **Modo**: String (ex: 'first_date').  
- **Pergunta**: String (texto personalizado).  
- **Data**: String ou array (ex: data fixa ou calendário de disponibilidade).  
- **Atividade/Local**: String ou array (depende do modo).  
- **Música**: String (link ou opção pré-definida).  
- **Media**: Array de URLs (fotos, GIFs uploadados).  
- **Chave Privada**: String hashada (para acesso ao link privado).  
- **Estado**: Enum (não_visto, visto, respondido).  
- **Resposta**: Objeto { decisão: 'sim/nao', mensagem: string, sugestões: array }.  
- **Criado Em**: Timestamp.  
- **Expiração**: Timestamp (criado + 7 dias).  

Exemplo simplificado:  
O rapaz cria basicamente cria um mini form/quiz e a rapariga preenche e o rapaz ve a resposta.
Analisa o content.png ate ao (5)
Modos de Criação (Detalhados)
Cada modo tem passos específicos para o criador:

Modo: First Date 🌸 (O Quebra-gelo)
Foco: Leveza e segurança.
Passos:
Escolher a pergunta principal.
Sugerir 3 opções de atividades/locais.
Definir calendário de disponibilidade.
Adicionar toque final (animação, música).
Gerar e pré-visualizar.


Modo: Anniversary 💝 (O Nostálgico)
Foco: Romance e recordação.
Passos:
Definir o plano fixo (data, hora, local).
Adicionar conteúdo multimédia (fotos, playlist Spotify).
Escolher a pergunta emocional.
Customizar tema.
Gerar e pré-visualizar.


Modo: Special ✨ (O Planeador Detalhado)
Foco: Organização total.
Passos:
Escolher a pergunta.
Definir detalhes logísticos (local, dress code, hora).
Adicionar opções de comida/preferências.
Integrar mapa e extras.
Gerar e pré-visualizar.


Modo: Surprise 🎲 (O Gamificado)
Foco: Curiosidade.
Passos:
Escolher a pergunta teaser.
Definir o plano secreto.
Adicionar gamificação (efeito NÃO, raspadinha).
Customizar hora e toque final.
Gerar e pré-visualizar.
Gaminficar isto para a rapariga


Stack Tecnológico Sugerido (para MVP)

Frontend: React 19 com Vite, React Router, Framer Motion (animações), Tailwind CSS.
State Management: Zustand ou useState.
Forms: React Hook Form.
Backend Inicial: Nenhum (client-side), depois Firebase/Supabase para storage temporário.
Deploy: Vercel ou Netlify.
Monetização Futura: Freemium (básico grátis, premium para extras).

Considerações Finais

Privacidade: Cumprir GDPR, sem dados pessoais permanentes.
Mobile-First: Design responsivo.
Viralidade: Integração com WhatsApp/TikTok para partilha.
Evolução: Começar grátis, validar MVP, adicionar features premium.

Esta especificação cobre o essencial para o desenvolvimento do DateLink.m
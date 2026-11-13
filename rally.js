// rally.js - Módulo de Simulação, Física e Cenários do Modo RALLY WRC
(function() {
    'use strict';

    // ==========================================
    // 1. SPRITES PROCEDURAIS DE CARROS DE RALLY (ALTA DEFINIÇÃO & DETALHES RETRO)
    // ==========================================
    function drawRallySprite(ctx, x, y, width, height, bodyColor, accentColor, turn, helmetColor, modelType) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);

        modelType = modelType || 'SUBARU';

        // Inclinação dinâmica em curvas de terra / derrapagens
        if (turn === -1) ctx.rotate(-0.07);
        if (turn === 1) ctx.rotate(0.07);

        // 1. Sombra suave sob o carro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.50)';
        ctx.beginPath();
        ctx.ellipse(0, 30, 52, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Para-barros de Competição (Rally Mudflaps) atrás dos pneus
        let mudflapColor = (modelType === 'LANCER_EVO' || modelType === 'SUBARU') ? '#dc2626' : '#1e293b';
        ctx.fillStyle = mudflapColor;
        ctx.fillRect(-52, 18, 10, 16); // Traseiro esquerdo
        ctx.fillRect(42, 18, 10, 16);  // Traseiro direito

        // 3. Pneus de Terra / Cascalho (Gravel Tires com Cravos e Banda Larga)
        // Traseiro Esquerdo
        ctx.fillStyle = '#111111';
        ctx.fillRect(-50, 4, 18, 30);
        ctx.fillStyle = '#222222';
        for (let ty = 6; ty < 32; ty += 5) ctx.fillRect(-50, ty, 3, 2); // Ranhuras de tração

        // Traseiro Direito
        ctx.fillStyle = '#111111';
        ctx.fillRect(32, 4, 18, 30);
        ctx.fillStyle = '#222222';
        for (let ty = 6; ty < 32; ty += 5) ctx.fillRect(47, ty, 3, 2);

        // Rodas de Rally Traseiras
        let rimColor = '#eab308'; // Dourado padrão (Subaru)
        if (modelType === 'AUDI_QUATTRO' || modelType === 'LANCER_EVO') rimColor = '#ffffff';
        if (modelType === 'LANCIA_STRATOS') rimColor = '#d97706';

        // Roda Traseira Esquerda
        ctx.fillStyle = rimColor;
        ctx.beginPath(); ctx.arc(-41, 19, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(-41, 19, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-42, 18, 2, 2); // Porca central

        // Roda Traseira Direita
        ctx.fillStyle = rimColor;
        ctx.beginPath(); ctx.arc(41, 19, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(41, 19, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(40, 18, 2, 2);

        // Rodas Dianteiras com Esterçamento Dinâmico para Contra-Esterço em Curvas de Terra
        let steerAngle = (turn || 0) * 0.18;
        ctx.save(); ctx.translate(-42, -20); ctx.rotate(steerAngle);
        ctx.fillStyle = '#111111'; ctx.fillRect(-8, -10, 16, 24);
        ctx.fillStyle = rimColor; ctx.beginPath(); ctx.arc(0, 2, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save(); ctx.translate(42, -20); ctx.rotate(steerAngle);
        ctx.fillStyle = '#111111'; ctx.fillRect(-8, -10, 16, 24);
        ctx.fillStyle = rimColor; ctx.beginPath(); ctx.arc(0, 2, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(0, 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // ----------------------------------------------------
        // MODELO 1: SUBARU IMPREZA WRC (AZUL CLÁSSICO 555 & AEROFÓLIO ALTO)
        // ----------------------------------------------------
        if (modelType === 'SUBARU') {
            let subaruBlue = bodyColor || '#003893';
            let goldAccent = accentColor || '#facc15';

            // Carroceria Principal
            ctx.fillStyle = subaruBlue;
            ctx.beginPath();
            ctx.moveTo(-32, -44);
            ctx.lineTo(32, -44);
            ctx.lineTo(38, 26);
            ctx.lineTo(-38, 26);
            ctx.closePath();
            ctx.fill();

            // Para-choque Dianteiro Agressivo WRC com Grade Central e Faróis Auxiliares
            ctx.fillStyle = '#002566';
            ctx.fillRect(-28, -44, 56, 6);
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(-18, -43, 36, 4); // Grade intercooler
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-4, -42, 8, 2); // Emblema STi vermelho

            // Faróis de Milha Noturnos de Rally (Pod Lights)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(-22, -42, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(22, -42, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(-14, -42, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(14, -42, 3, 0, Math.PI * 2); ctx.fill();

            // Capô com Tomada de Ar Gigante do Intercooler (Hood Scoop)
            ctx.fillStyle = '#002875';
            ctx.fillRect(-12, -32, 24, 12);
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(-10, -28, 20, 6);

            // Saídas de ar laterais do capô
            ctx.fillStyle = '#002875';
            ctx.fillRect(-26, -26, 8, 6);
            ctx.fillRect(18, -26, 8, 6);

            // Parabrisa Dianteiro e Teto
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-24, -16, 48, 12); // Parabrisa
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-20, -14, 40, 2); // Reflexo azul do céu
            ctx.fillStyle = subaruBlue;
            ctx.fillRect(-26, -4, 52, 22);  // Teto

            // Entrada de ar no teto (Roof Scoop de ventilação de cabine)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-6, -6, 12, 4);

            // Vidro Traseiro
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-22, 10, 44, 8);

            // Grafismo Dourado 555 nas Portas e Laterais
            ctx.fillStyle = goldAccent;
            ctx.fillRect(-34, -10, 5, 24);
            ctx.fillRect(29, -10, 5, 24);
            ctx.beginPath();
            ctx.arc(0, 4, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = subaruBlue;
            ctx.font = 'bold 9px "Press Start 2P"';
            ctx.fillText("5", -3, 8);

            // Lanterna Traseira e Escapamento Inox
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-36, 22, 12, 4);
            ctx.fillRect(24, 22, 12, 4);
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath(); ctx.arc(22, 27, 4, 0, Math.PI * 2); ctx.fill(); // Ponteira de escape
            ctx.fillStyle = '#0a0a0a';
            ctx.beginPath(); ctx.arc(22, 27, 2, 0, Math.PI * 2); ctx.fill();

            // AEROFÓLIO GIGANTE WRC (HIGH REAR SPOILER)
            ctx.fillStyle = subaruBlue;
            ctx.fillRect(-36, 26, 6, 8); // Haste esquerda
            ctx.fillRect(30, 26, 6, 8);  // Haste direita
            ctx.fillStyle = '#002875';
            ctx.fillRect(-40, 32, 80, 7); // Asa principal
            ctx.fillStyle = goldAccent;
            ctx.fillRect(-38, 37, 76, 2); // Detalhe dourado na borda de fuga

            // Piloto e Navegador (Co-piloto) na cabine
            ctx.fillStyle = helmetColor || '#facc15';
            ctx.beginPath(); ctx.arc(-11, 2, 4, 0, Math.PI * 2); ctx.fill(); // Piloto (Esquerda)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(11, 2, 4, 0, Math.PI * 2); ctx.fill();  // Navegador (Direita)
        }

        // ----------------------------------------------------
        // MODELO 2: AUDI SPORT QUATTRO S1 E2 (O MONSTRO DO GRUPO B)
        // ----------------------------------------------------
        else if (modelType === 'AUDI_QUATTRO') {
            let whiteBody = bodyColor || '#f8fafc';
            let yellowHB = accentColor || '#facc15';

            // Carroceria Larga Boxy Grupo B
            ctx.fillStyle = whiteBody;
            ctx.beginPath();
            ctx.moveTo(-34, -46);
            ctx.lineTo(34, -46);
            ctx.lineTo(42, 26);
            ctx.lineTo(-42, 26);
            ctx.closePath();
            ctx.fill();

            // ASA DIANTEIRA LIMPA-NEVE GIGANTE (FRONT CHIN SPLITTER / SNOWPLOW WING)
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-40, -48, 80, 5);
            ctx.fillStyle = yellowHB;
            ctx.fillRect(-40, -47, 80, 2);
            // Endplates da asa dianteira
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-42, -50, 4, 8);
            ctx.fillRect(38, -50, 4, 8);

            // Bateria de 4 Faróis Quadrados de Competição Noturna
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(-26, -44, 10, 6);
            ctx.fillRect(-12, -44, 10, 6);
            ctx.fillRect(2, -44, 10, 6);
            ctx.fillRect(16, -44, 10, 6);

            // Grade frontal com quatro argolas da Audi
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-18, -37, 36, 4);

            // Capô com enormes saídas de refrigeração do turbo
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-16, -30, 32, 10);
            ctx.fillStyle = yellowHB;
            ctx.fillRect(-28, -32, 8, 14);
            ctx.fillRect(20, -32, 8, 14);

            // Para-lamas Alargados Box-Flare com aberturas de ventilação de cascalho
            ctx.fillStyle = '#334155';
            ctx.fillRect(-38, -18, 4, 20);
            ctx.fillRect(34, -18, 4, 20);

            // Cabine e Teto Curto Encurtado (Short Wheelbase)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-24, -14, 48, 12);
            ctx.fillStyle = whiteBody;
            ctx.fillRect(-24, -2, 48, 20);

            // Faixas Históricas HB Audi Sport no Teto e Capô (Amarelo, Marrom e Vermelho)
            ctx.fillStyle = yellowHB;
            ctx.fillRect(-6, -34, 12, 50);
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-6, -34, 4, 50);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(2, -34, 4, 50);

            // Vidro Traseiro e Grelhas do Radiador Traseiro
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-22, 10, 44, 10);
            ctx.fillStyle = '#475569';
            for (let gy = 12; gy < 19; gy += 2) ctx.fillRect(-18, gy, 36, 1);

            // AEROFÓLIO DUPLO GIGANTESCO DO GRUPO B (COLOSSAL REAR WING)
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-44, 26, 88, 10); // Lâmina superior principal
            ctx.fillStyle = yellowHB;
            ctx.fillRect(-42, 34, 84, 3);  // Aba amarela
            // Grandes aletas laterais (Endplates)
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-46, 22, 5, 16);
            ctx.fillRect(41, 22, 5, 16);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-45, 24, 3, 4);
            ctx.fillRect(42, 24, 3, 4);

            // Escapamento lateral cuspidor de fogo do turbo anti-lag
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(-38, 24, 5, 4);
            ctx.fillStyle = '#ea580c';
            ctx.fillRect(-37, 25, 2, 2);

            // Piloto Walter Röhrl e Navegador
            ctx.fillStyle = helmetColor || '#f8fafc';
            ctx.beginPath(); ctx.arc(-11, 4, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#facc15';
            ctx.beginPath(); ctx.arc(11, 4, 4, 0, Math.PI * 2); ctx.fill();
        }

        // ----------------------------------------------------
        // MODELO 3: MITSUBISHI LANCER EVOLUTION VI (TOMMI MÄKINEN EDITION)
        // ----------------------------------------------------
        else if (modelType === 'LANCER_EVO') {
            let evoRed = bodyColor || '#dc2626';
            let whiteStripe = accentColor || '#ffffff';

            // Chassi e Laterais
            ctx.fillStyle = evoRed;
            ctx.beginPath();
            ctx.moveTo(-32, -44);
            ctx.lineTo(32, -44);
            ctx.lineTo(38, 26);
            ctx.lineTo(-38, 26);
            ctx.closePath();
            ctx.fill();

            // Faixas Ralliart Diagonais nas Laterais
            ctx.fillStyle = whiteStripe;
            ctx.beginPath();
            ctx.moveTo(-35, -20);
            ctx.lineTo(-30, -20);
            ctx.lineTo(-36, 15);
            ctx.lineTo(-40, 15);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(35, -20);
            ctx.lineTo(30, -20);
            ctx.lineTo(36, 15);
            ctx.lineTo(40, 15);
            ctx.closePath();
            ctx.fill();

            // Detalhe preto e prata Ralliart
            ctx.fillStyle = '#000000';
            ctx.fillRect(-37, -5, 3, 10);
            ctx.fillRect(34, -5, 3, 10);

            // Para-choque Frontal Agressivo TME com Grandes Faróis PIAA Circulares
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(-30, -44, 60, 6);
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(-18, -42, 36, 4); // Entrada frontal do intercooler

            // Grandes Faróis Auxiliares de Milha PIAA no Para-choque
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(-22, -40, 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(22, -40, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(-22, -40, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(22, -40, 3, 0, Math.PI * 2); ctx.fill();

            // Capô com Tomada de Ar Assimétrica e Extrator de Calor Central
            ctx.fillStyle = '#111827';
            ctx.fillRect(-10, -32, 20, 10); // Grade central preta
            ctx.fillRect(-22, -26, 6, 6);   // Duto NACA esquerdo

            // Parabrisa Dianteiro com Faixa Vermelha/Branca RALLIART no topo
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-24, -16, 48, 12);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-24, -16, 48, 3); // Faixa de para-brisa
            ctx.fillStyle = evoRed;
            ctx.fillRect(-20, -16, 14, 3);

            // Teto e Antena de Rádio WRC
            ctx.fillStyle = evoRed;
            ctx.fillRect(-26, -4, 52, 20);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, -6, 2, 8); // Antena central

            // Vidro Traseiro
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-22, 8, 44, 8);

            // AEROFÓLIO DUPLO AJUSTÁVEL LANCER EVOLUTION (TWIN BLADE WING)
            ctx.fillStyle = '#000000';
            ctx.fillRect(-34, 22, 6, 8); // Suportes em preto carbono
            ctx.fillRect(28, 22, 6, 8);
            ctx.fillStyle = evoRed;
            ctx.fillRect(-38, 28, 76, 5); // Lâmina inferior vermelha
            ctx.fillStyle = '#000000';
            ctx.fillRect(-36, 33, 72, 4); // Lâmina superior preta ajustável

            // Lanternas Traseiras e Escapamento Rally
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-36, 20, 10, 4);
            ctx.fillRect(26, 20, 10, 4);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-34, 20, 6, 4);
            ctx.fillRect(28, 20, 6, 4);

            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath(); ctx.arc(-24, 26, 4, 0, Math.PI * 2); ctx.fill();

            // Piloto Tommi Mäkinen e Navegador Mannisenmäki
            ctx.fillStyle = helmetColor || '#ffffff';
            ctx.beginPath(); ctx.arc(-11, 2, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(11, 2, 4, 0, Math.PI * 2); ctx.fill();
        }

        // ----------------------------------------------------
        // MODELO 4: LANCIA STRATOS HF (O CLÁSSICO EM CUNHA ALITALIA)
        // ----------------------------------------------------
        else if (modelType === 'LANCIA_STRATOS') {
            let whiteBody = bodyColor || '#ffffff';
            let greenAlitalia = accentColor || '#16a34a';

            // Carroceria em Cunha Agressiva (Wedge Shape)
            ctx.fillStyle = whiteBody;
            ctx.beginPath();
            ctx.moveTo(-28, -46);
            ctx.lineTo(28, -46);
            ctx.lineTo(40, 24);
            ctx.lineTo(-40, 24);
            ctx.closePath();
            ctx.fill();

            // Pintura Alitalia Triângulos Verde e Vermelho
            ctx.fillStyle = greenAlitalia;
            ctx.beginPath();
            ctx.moveTo(0, -42);
            ctx.lineTo(-24, -10);
            ctx.lineTo(24, -10);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(0, -36);
            ctx.lineTo(-14, -16);
            ctx.lineTo(14, -16);
            ctx.closePath();
            ctx.fill();

            // Bateria de 4 Faróis Redondos Frontais no Nariz em Cunha
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(-18, -42, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(-6, -42, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(6, -42, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(18, -42, 4, 0, Math.PI * 2); ctx.fill();

            // Para-brisa Envolvente Côncavo Tipo Viseira de Capacete (Visor Cockpit)
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.moveTo(-22, -18);
            ctx.quadraticCurveTo(0, -24, 22, -18);
            ctx.lineTo(24, -2);
            ctx.lineTo(-24, -2);
            ctx.closePath();
            ctx.fill();

            // Barra / Spoiler de Teto Aerodinâmico
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-22, -4, 44, 4);

            // Teto Muito Estreito e Traseira Musculosa
            ctx.fillStyle = whiteBody;
            ctx.fillRect(-22, 0, 44, 14);

            // Grelhas Traseiras sobre o Motor V6 Ferrari Dino
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-20, 8, 40, 8);
            ctx.fillStyle = '#000000';
            for (let ly = 9; ly < 16; ly += 2) ctx.fillRect(-18, ly, 36, 1);

            // SPOILER TRASEIRO TIPO DUCKTAIL INTEGRADO COM AEROFÓLIO
            ctx.fillStyle = greenAlitalia;
            ctx.fillRect(-38, 22, 76, 6);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-38, 26, 76, 3);

            // Lanternas Traseiras Redondas Icônicas
            ctx.fillStyle = '#dc2626';
            ctx.beginPath(); ctx.arc(-30, 22, 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(30, 22, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#facc15';
            ctx.beginPath(); ctx.arc(-30, 22, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(30, 22, 2, 0, Math.PI * 2); ctx.fill();

            // Ponteiras Duplas de Escape Central
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(-4, 24, 3, 5);
            ctx.fillRect(1, 24, 3, 5);

            // Piloto Sandro Munari
            ctx.fillStyle = helmetColor || '#ffffff';
            ctx.beginPath(); ctx.arc(-8, -2, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#15803d';
            ctx.beginPath(); ctx.arc(8, -2, 4, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
    }

    // ==========================================
    // 2. SPRITES DE CENÁRIO DO MODO RALLY (ÁRVORES, PÔRTRICOS, RAMPAS E ARQUIBANCADAS)
    // ==========================================
    function initRallySprites(sCtx, SPRITES) {
        if (!sCtx || !SPRITES) return;

        // Registro de coordenadas na folha de sprites
        SPRITES.RALLY_PINE_TREE        = { x: 520, y: 740, w: 120, h: 220 };
        SPRITES.RALLY_SPECTATOR_FENCE  = { x: 650, y: 740, w: 180, h: 100 };
        SPRITES.RALLY_JUMP_SIGN        = { x: 840, y: 740, w: 90,  h: 110 };
        SPRITES.RALLY_BANNER_ARCH      = { x: 520, y: 510, w: 260, h: 140 };
        SPRITES.RALLY_ROCK_BOULDER     = { x: 790, y: 510, w: 120, h: 90  };
        SPRITES.RALLY_TENT             = { x: 650, y: 620, w: 130, h: 90  };

        // --- 1. PINHEIRO NÓRDICO DENSO (PINE TREE) ---
        let tx = SPRITES.RALLY_PINE_TREE.x;
        let ty = SPRITES.RALLY_PINE_TREE.y;
        let tw = SPRITES.RALLY_PINE_TREE.w;
        let th = SPRITES.RALLY_PINE_TREE.h;

        sCtx.save();
        sCtx.translate(tx, ty);

        // Tronco de Madeira
        sCtx.fillStyle = '#451a03';
        sCtx.fillRect(tw / 2 - 8, th - 50, 16, 50);
        sCtx.fillStyle = '#291001';
        sCtx.fillRect(tw / 2 - 4, th - 50, 8, 50);

        // Camadas de Copa de Pinheiro em Triângulos Sobrepostos
        const pineGreens = ['#14532d', '#166534', '#15803d', '#14532d'];
        for (let level = 0; level < 4; level++) {
            let ly = 15 + level * 36;
            let lw = 40 + level * 24;
            sCtx.fillStyle = pineGreens[level % pineGreens.length];
            sCtx.beginPath();
            sCtx.moveTo(tw / 2, ly - 20);
            sCtx.lineTo(tw / 2 + lw / 2, ly + 40);
            sCtx.lineTo(tw / 2 - lw / 2, ly + 40);
            sCtx.closePath();
            sCtx.fill();

            // Textura de ramos e folhas
            sCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            sCtx.fillRect(tw / 2 - 2, ly - 15, 4, 30);
            sCtx.fillStyle = '#052e16';
            for (let bx = -lw / 3; bx < lw / 3; bx += 8) {
                sCtx.fillRect(tw / 2 + bx, ly + 36, 4, 4);
            }
        }
        sCtx.restore();

        // --- 2. CERCA DE MADEIRA COM TORCIDA DE RALLY (SPECTATOR FENCE) ---
        let fx = SPRITES.RALLY_SPECTATOR_FENCE.x;
        let fy = SPRITES.RALLY_SPECTATOR_FENCE.y;
        let fw = SPRITES.RALLY_SPECTATOR_FENCE.w;
        let fh = SPRITES.RALLY_SPECTATOR_FENCE.h;

        sCtx.save();
        sCtx.translate(fx, fy);

        // Torcedores Vibrando Atrás da Fita
        const fanColors = ['#dc2626', '#2563eb', '#f59e0b', '#10b981', '#ffffff', '#9333ea'];
        for (let i = 0; i < 9; i++) {
            let px = 12 + i * 18;
            let col = fanColors[i % fanColors.length];
            // Corpo
            sCtx.fillStyle = col;
            sCtx.fillRect(px, 32, 12, 28);
            // Cabeça
            sCtx.fillStyle = '#fed7aa';
            sCtx.beginPath(); ctx.arc ? sCtx.arc(px + 6, 26, 5, 0, Math.PI * 2) : sCtx.fillRect(px + 1, 21, 10, 10);
            sCtx.fill();
            // Boné / Gorro
            sCtx.fillStyle = col;
            sCtx.fillRect(px + 1, 20, 10, 3);
            // Braço erguido ou bandeira
            if (i % 2 === 0) {
                sCtx.fillStyle = '#ffffff';
                sCtx.fillRect(px + 12, 10, 2, 24);
                sCtx.fillStyle = '#dc2626';
                sCtx.fillRect(px + 14, 10, 12, 8);
            }
        }

        // Mourões de Madeira da Cerca
        sCtx.fillStyle = '#78350f';
        for (let x = 8; x < fw; x += 36) {
            sCtx.fillRect(x, 40, 6, fh - 40);
        }

        // Fita Zebrada Plástica Laranja / Amarela de Segurança WRC
        sCtx.fillStyle = '#ea580c';
        sCtx.fillRect(0, 52, fw, 8);
        sCtx.fillStyle = '#facc15';
        for (let x = 0; x < fw; x += 16) {
            sCtx.fillRect(x, 52, 8, 8);
        }

        // Banner de Patrocinador na Cerca
        sCtx.fillStyle = '#1e293b';
        sCtx.fillRect(15, 66, fw - 30, 26);
        sCtx.fillStyle = '#ffffff';
        sCtx.font = 'bold 9px "Press Start 2P"';
        sCtx.fillText("PIRELLI RALLY", 25, 83);
        sCtx.restore();

        // --- 3. PLACA DE ALERTA DE RAMPA DE SALTO (JUMP SIGN) ---
        let jx = SPRITES.RALLY_JUMP_SIGN.x;
        let jy = SPRITES.RALLY_JUMP_SIGN.y;
        let jw = SPRITES.RALLY_JUMP_SIGN.w;
        let jh = SPRITES.RALLY_JUMP_SIGN.h;

        sCtx.save();
        sCtx.translate(jx, jy);

        // Poste de metal
        sCtx.fillStyle = '#475569';
        sCtx.fillRect(jw / 2 - 3, 50, 6, jh - 50);

        // Placa Losango Amarela Fluorescente de Perigo
        sCtx.save();
        sCtx.translate(jw / 2, 32);
        sCtx.rotate(Math.PI / 4);
        sCtx.fillStyle = '#facc15';
        sCtx.fillRect(-22, -22, 44, 44);
        sCtx.strokeStyle = '#000000';
        sCtx.lineWidth = 3;
        sCtx.strokeRect(-19, -19, 38, 38);
        sCtx.restore();

        // Texto e Ícone de Salto
        sCtx.fillStyle = '#000000';
        sCtx.font = 'bold 8px "Press Start 2P"';
        sCtx.fillText("JUMP", jw / 2 - 18, 30);
        sCtx.fillText("▲▲▲", jw / 2 - 14, 42);

        sCtx.restore();

        // --- 4. PÓRTICO / ARCO WRC STAGE FINISH/START (BANNER ARCH) ---
        let ax = SPRITES.RALLY_BANNER_ARCH.x;
        let ay = SPRITES.RALLY_BANNER_ARCH.y;
        let aw = SPRITES.RALLY_BANNER_ARCH.w;
        let ah = SPRITES.RALLY_BANNER_ARCH.h;

        sCtx.save();
        sCtx.translate(ax, ay);

        // Pilares Laterais Treliçados
        sCtx.fillStyle = '#0284c7';
        sCtx.fillRect(0, 30, 24, ah - 30);
        sCtx.fillRect(aw - 24, 30, 24, ah - 30);
        sCtx.fillStyle = '#ffffff';
        sCtx.fillRect(4, 34, 16, ah - 38);
        sCtx.fillRect(aw - 20, 34, 16, ah - 38);

        // Barra Superior Principal
        sCtx.fillStyle = '#0369a1';
        sCtx.fillRect(0, 0, aw, 38);
        sCtx.fillStyle = '#facc15';
        sCtx.fillRect(0, 34, aw, 4);

        // Inscrição WRC RALLY CHAMPIONSHIP
        sCtx.fillStyle = '#ffffff';
        sCtx.font = 'bold 10px "Press Start 2P"';
        sCtx.fillText("★ WRC WORLD RALLY ★", 24, 18);
        sCtx.fillStyle = '#fde047';
        sCtx.font = '8px "Press Start 2P"';
        sCtx.fillText("SPECIAL STAGE", 70, 30);

        sCtx.restore();

        // --- 5. ROCHEDO / PEDREGULHO NATURAL DE RALLY (ROCK BOULDER) ---
        let rx = SPRITES.RALLY_ROCK_BOULDER.x;
        let ry = SPRITES.RALLY_ROCK_BOULDER.y;
        let rw = SPRITES.RALLY_ROCK_BOULDER.w;
        let rh = SPRITES.RALLY_ROCK_BOULDER.h;

        sCtx.save();
        sCtx.translate(rx, ry);

        // Formação Rochosa Angular
        sCtx.fillStyle = '#57534e';
        sCtx.beginPath();
        sCtx.moveTo(10, rh - 5);
        sCtx.lineTo(25, 20);
        sCtx.lineTo(60, 10);
        sCtx.lineTo(rw - 20, 25);
        sCtx.lineTo(rw - 5, rh - 5);
        sCtx.closePath();
        sCtx.fill();

        // Iluminação e Facetas da Pedra
        sCtx.fillStyle = '#78716c';
        sCtx.beginPath();
        sCtx.moveTo(25, 20);
        sCtx.lineTo(60, 10);
        sCtx.lineTo(55, rh - 5);
        sCtx.lineTo(10, rh - 5);
        sCtx.closePath();
        sCtx.fill();

        sCtx.fillStyle = '#44403c';
        sCtx.beginPath();
        sCtx.moveTo(60, 10);
        sCtx.lineTo(rw - 20, 25);
        sCtx.lineTo(rw - 5, rh - 5);
        sCtx.lineTo(55, rh - 5);
        sCtx.closePath();
        sCtx.fill();

        sCtx.restore();

        // --- 6. TENDA DE EQUIPE / SERVIÇO WRC (SERVICE TENT) ---
        let tentX = SPRITES.RALLY_TENT.x;
        let tentY = SPRITES.RALLY_TENT.y;
        let tentW = SPRITES.RALLY_TENT.w;
        let tentH = SPRITES.RALLY_TENT.h;

        sCtx.save();
        sCtx.translate(tentX, tentY);
        // Teto piramidal da tenda
        sCtx.fillStyle = '#dc2626';
        sCtx.beginPath();
        sCtx.moveTo(tentW / 2, 5);
        sCtx.lineTo(tentW - 5, 40);
        sCtx.lineTo(5, 40);
        sCtx.closePath();
        sCtx.fill();

        sCtx.fillStyle = '#b91c1c';
        sCtx.beginPath();
        sCtx.moveTo(tentW / 2, 5);
        sCtx.lineTo(tentW - 5, 40);
        sCtx.lineTo(tentW / 2, 40);
        sCtx.closePath();
        sCtx.fill();

        // Colunas e interior da tenda
        sCtx.fillStyle = '#0f172a';
        sCtx.fillRect(10, 40, tentW - 20, tentH - 45);
        sCtx.fillStyle = '#ffffff';
        sCtx.fillRect(8, 40, 4, tentH - 40);
        sCtx.fillRect(tentW - 12, 40, 4, tentH - 40);
        sCtx.fillRect(tentW / 2 - 2, 40, 4, tentH - 40);
        sCtx.restore();
    }

    // ==========================================
    // 3. CONFIGURAÇÃO DAS PISTAS DE RALLY WRC (COM RAMPAS E CURVAS DE TERRA)
    // ==========================================
    const RALLY_STAGES = [
        {
            name: "RALLY WRC — FINLÂNDIA (1000 LAKES) 🌲",
            menuName: "RALLY 1: FINLÂNDIA (SALTOS NOS CUMES) 🌲",
            laps: 3,
            weather: "CLEAR",
            theme: "RALLY_GRAVEL",
            aiSpeedFactor: 1.02,
            build: function(addRoad, addRamp) {
                // Pista de cascalho ultra rápida com as famosas rampas de salto nos cumes finlandeses
                addRoad(80, 80, 80, 0, 0);               // Reta de largada na floresta
                addRamp(25, 12, 25, 2, 55);              // RAMPA DE SALTO 1: VOO NO CUME!
                addRoad(50, 40, 50, -8, -10);            // Curva rápida de terra à esquerda
                addRoad(60, 60, 60, 6, 15);              // Subida e curva aberta à direita
                addRamp(30, 15, 30, 0, 70);              // RAMPA DE SALTO 2: O GRANDE SALTO DE OURO!
                addRoad(90, 90, 90, 0, -20);             // Descida em alta velocidade
                addRoad(45, 40, 45, -10, 0);             // Curva fechada de terra
                addRamp(20, 10, 20, -3, 50);             // RAMPA DE SALTO 3: Salto em curva!
                addRoad(70, 70, 70, 7, 0);               // Curva longa com derrapagem
                addRoad(100, 100, 100, 0, 0);            // Reta final rumo à linha de chegada
            }
        },
        {
            name: "RALLY WRC — SAFARI DO QUÊNIA 🏜️",
            menuName: "RALLY 2: SAFARI QUÊNIA (TERRA VERMELHA) 🏜️",
            laps: 3,
            weather: "SUNSET",
            theme: "RALLY_SAFARI",
            aiSpeedFactor: 1.04,
            build: function(addRoad, addRamp) {
                // Savana africana, terra vermelha, poeira intensa e ondulações dramáticas
                addRoad(100, 100, 100, 0, 0);            // Reta de terra batida
                addRamp(35, 15, 30, 0, 75);              // RAMPA DE SALTO 1: Elevação de savana
                addRoad(50, 50, 50, 7, -15);             // Curva larga com poeira vermelha
                addRoad(60, 60, 60, -8, 20);
                addRamp(28, 12, 28, 4, 60);              // RAMPA DE SALTO 2: Salto sobre vala
                addRoad(120, 120, 120, 0, 0);            // Super reta poeirenta
                addRamp(32, 14, 30, 0, 80);              // RAMPA DE SALTO 3: O Voo dos Leões
                addRoad(40, 35, 40, -11, -20);           // Cotovelo fechado em terra solta
                addRoad(60, 60, 60, 9, 10);              // Derrapagem contínua
                addRamp(22, 10, 22, 0, 45);              // RAMPA DE SALTO 4
                addRoad(90, 90, 90, 0, 0);
            }
        },
        {
            name: "RALLY WRC — MONTE CARLO (ALPES) ⛰️",
            menuName: "RALLY 3: MONTE CARLO (DESFILADEIROS) ⛰️",
            laps: 3,
            weather: "CLEAR",
            theme: "RALLY_DIRT",
            aiSpeedFactor: 1.00,
            build: function(addRoad, addRamp) {
                // Desfiladeiros escarpados, curvas cotovelo muito travadas e saltos técnicos
                addRoad(60, 60, 60, 0, 0);
                addRoad(35, 30, 35, 12, 25);             // Hairpin 1 à direita subindo
                addRoad(40, 35, 40, -12, 30);            // Hairpin 2 à esquerda
                addRamp(24, 12, 24, 0, 60);              // RAMPA DE SALTO 1: Salto no cume do rochedo!
                addRoad(70, 70, 70, 5, -25);             // Descida em zigue-zague
                addRoad(30, 25, 30, -13, -15);           // Curva cega
                addRamp(26, 12, 26, -4, 65);             // RAMPA DE SALTO 2: Salto técnico em descida
                addRoad(80, 80, 80, 7, 10);
                addRoad(35, 30, 35, -11, 0);
                addRamp(20, 10, 20, 0, 50);              // RAMPA DE SALTO 3
                addRoad(80, 80, 80, 0, 0);
            }
        },
        {
            name: "RALLY WRC — PAÍS DE GALES (LAMA & CHUVA) 🌧️⚡",
            menuName: "RALLY 4: PAÍS DE GALES (LAMAÇAL) 🌧️⚡",
            laps: 3,
            weather: "RAIN",
            theme: "RALLY_MUD",
            aiSpeedFactor: 0.97,
            build: function(addRoad, addRamp) {
                // Florestas galesas escorregadias, lama densa, baixa aderência e derrapagens pesadas
                addRoad(70, 70, 70, 0, 0);
                addRamp(25, 12, 25, 0, 55);              // RAMPA DE SALTO 1: Salto sobre poça gigante
                addRoad(45, 40, 45, -9, 15);             // Lamaçal traiçoeiro
                addRoad(55, 50, 55, 10, -10);            // Contra-esterço obrigatório
                addRamp(28, 14, 28, 3, 65);              // RAMPA DE SALTO 2: Salto no nevoeiro
                addRoad(80, 80, 80, 0, 0);
                addRoad(40, 35, 40, -12, 20);            // Curva fechadíssima de lama
                addRamp(24, 10, 24, 0, 50);              // RAMPA DE SALTO 3
                addRoad(60, 60, 60, 8, -15);
                addRoad(75, 75, 75, 0, 0);
            }
        },
        {
            name: "RALLY WRC — GRÉCIA (ACROPOLIS) 🌋",
            menuName: "RALLY 5: GRÉCIA ACROPOLIS (PEDREGULHO) 🌋",
            laps: 3,
            weather: "SUNSET",
            theme: "RALLY_DIRT",
            aiSpeedFactor: 1.03,
            build: function(addRoad, addRamp) {
                // Pista de cascalho bruto, pedras cortantes, subidas íngremes e rampas duplas
                addRoad(70, 70, 70, 0, 0);
                addRamp(30, 14, 26, 0, 80);              // RAMPA 1: Rampa gigante na pedreira!
                addRoad(40, 35, 40, 9, 20);
                addRamp(20, 8, 20, 0, 45);               // RAMPA 2: Salto duplo (Double Jump) parte 1
                addRamp(24, 10, 24, -3, 55);             // RAMPA 3: Salto duplo parte 2!
                addRoad(80, 80, 80, -8, -30);            // Descida radical nos cânions
                addRoad(40, 35, 40, 11, 0);              // Curva acentuada
                addRamp(32, 15, 30, 0, 85);              // RAMPA 4: O Voo de Atenas!
                addRoad(60, 60, 60, -9, 10);
                addRoad(110, 110, 110, 0, 0);            // Reta final
            }
        }
    ];

    // Exportação para o escopo global
    window.drawRallySprite = drawRallySprite;
    window.initRallySprites = initRallySprites;
    window.RALLY_CONFIG = {
        stages: RALLY_STAGES
    };

})();

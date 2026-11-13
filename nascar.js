// nascar.js - Módulo de Simulação e Cenários da NASCAR
(function() {
    'use strict';

    // ==========================================
    // 1. SPRITES PROCEDURAIS DE MODELOS NASCAR (ALTA DEFINIÇÃO & DETALHES RETRO)
    // ==========================================
    function drawNascarSprite(ctx, x, y, width, height, bodyColor, accentColor, turn, helmetColor, modelType) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);

        modelType = modelType || 'SUPERBIRD';

        // Inclinação dinâmica em curvas
        if (turn === -1) ctx.rotate(-0.06);
        if (turn === 1) ctx.rotate(0.06);

        // 1. Sombra suave e profunda sob o carro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
        ctx.beginPath();
        let shadowH = modelType === 'SUPERBIRD' ? 62 : 54;
        ctx.ellipse(0, 32, shadowH, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Pneus Stock Car Largos de Competição (Goodyear Eagle)
        // Traseiro Esquerdo
        ctx.fillStyle = '#050505';
        ctx.fillRect(-54, 4, 24, 34);
        ctx.fillStyle = '#ffcc00'; // Letras amarelas Goodyear nos pneus
        ctx.fillRect(-53, 10, 2, 8);
        ctx.fillRect(-53, 24, 2, 8);

        // Traseiro Direito
        ctx.fillStyle = '#050505';
        ctx.fillRect(30, 4, 24, 34);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(51, 10, 2, 8);
        ctx.fillRect(51, 24, 2, 8);

        // Rodas Esportivas NASCAR (Aro Amarelo de Aço com Miolo Preto)
        ctx.fillStyle = '#eab308';
        ctx.beginPath(); ctx.arc(-42, 21, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111827';
        ctx.beginPath(); ctx.arc(-42, 21, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-43, 20, 2, 2); // Porca central cromada

        ctx.fillStyle = '#eab308';
        ctx.beginPath(); ctx.arc(42, 21, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111827';
        ctx.beginPath(); ctx.arc(42, 21, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(41, 20, 2, 2);

        // Rodas Dianteiras Esterçadas
        let steer = (turn || 0) * 0.14;
        ctx.save(); ctx.translate(-44, -22); ctx.rotate(steer);
        ctx.fillStyle = '#050505'; ctx.fillRect(-9, -12, 20, 26);
        ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(1, 1, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(1, 1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save(); ctx.translate(44, -22); ctx.rotate(steer);
        ctx.fillStyle = '#050505'; ctx.fillRect(-11, -12, 20, 26);
        ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(-1, 1, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(-1, 1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // ----------------------------------------------------
        // MODELO 1: PLYMOUTH SUPERBIRD 1970 (O LENDÁRIO "THE KING")
        // ----------------------------------------------------
        if (modelType === 'SUPERBIRD') {
            let pettyBlue = bodyColor || '#00a3e0';
            let whiteAccent = accentColor || '#ffffff';

            // 1. Chassi Principal e Bico em Cunha Aerodinâmico Alongado
            ctx.fillStyle = pettyBlue;
            ctx.beginPath();
            ctx.moveTo(-32, -48);
            ctx.lineTo(32, -48);
            ctx.lineTo(44, 28);
            ctx.lineTo(-44, 28);
            ctx.closePath();
            ctx.fill();

            // Brilho e reflexo metálico nas laterais da lataria
            ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.fillRect(-38, -35, 6, 60);
            ctx.fillRect(32, -35, 6, 60);

            // Bico Dianteiro Agressivo e Faróis Escamoteáveis (Pop-up Headlights)
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(-30, -47, 60, 4);
            ctx.fillStyle = '#0c4a6e';
            ctx.fillRect(-26, -45, 16, 5);
            ctx.fillRect(10, -45, 16, 5);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-24, -44, 12, 2);
            ctx.fillRect(12, -44, 12, 2);

            // Faixas Esportivas Duplas no Capô
            ctx.fillStyle = whiteAccent;
            ctx.fillRect(-10, -48, 20, 72);
            ctx.fillStyle = pettyBlue;
            ctx.fillRect(-2, -48, 4, 72);

            // Tomadas de ar laterais do capô (Fender Scoops)
            ctx.fillStyle = '#000000';
            ctx.fillRect(-36, -18, 5, 10);
            ctx.fillRect(31, -18, 5, 10);

            // Teto Musculoso do Superbird
            ctx.fillStyle = pettyBlue;
            ctx.fillRect(-28, -20, 56, 34);

            // Número Lendário no Teto (#43)
            ctx.fillStyle = whiteAccent;
            ctx.font = 'bold 12px "Press Start 2P", sans-serif';
            ctx.fillText("43", -13, 2);
            ctx.fillStyle = '#e11d48';
            ctx.fillText("43", -12, 3); // Sombra vermelha do número

            // Para-brisa Dianteiro Inclinado com Reflexo de Vidro
            let windGrad = ctx.createLinearGradient(0, -36, 0, -18);
            windGrad.addColorStop(0, '#0f172a');
            windGrad.addColorStop(1, '#38bdf8');
            ctx.fillStyle = windGrad;
            ctx.beginPath();
            ctx.moveTo(-26, -18); ctx.lineTo(26, -18);
            ctx.lineTo(34, -34); ctx.lineTo(-34, -34);
            ctx.closePath(); ctx.fill();

            // Vidro Traseiro Fastback Aerodinâmico
            let rearWindGrad = ctx.createLinearGradient(0, 14, 0, 26);
            rearWindGrad.addColorStop(0, '#0f172a');
            rearWindGrad.addColorStop(1, '#1e293b');
            ctx.fillStyle = rearWindGrad;
            ctx.beginPath();
            ctx.moveTo(-26, 14); ctx.lineTo(26, 14);
            ctx.lineTo(36, 26); ctx.lineTo(-36, 26);
            ctx.closePath(); ctx.fill();

            // Rede de Segurança da Janela do Piloto
            ctx.fillStyle = '#0a1018';
            ctx.fillRect(-32, -18, 6, 30);
            ctx.fillRect(26, -18, 6, 30);
            ctx.fillStyle = '#fb923c';
            for (let ny = -16; ny < 10; ny += 4) { ctx.fillRect(-32, ny, 6, 1.5); }

            // Piloto com Capacete e Viseira
            ctx.fillStyle = helmetColor || '#f8fafc';
            ctx.beginPath(); ctx.arc(-14, -2, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#111827'; ctx.fillRect(-18, -4, 6, 3);

            // === A LENDÁRIA ASA GIGANTE TRASEIRA (SUPERBIRD HIGH-TOWER WING) ===
            // Sombra da asa no porta-malas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.fillRect(-46, 25, 92, 6);

            // 1. Hastes verticais elevadas e reforçadas
            ctx.fillStyle = pettyBlue;
            ctx.fillRect(-45, 14, 9, 32);  // Haste esquerda
            ctx.fillRect(36, 14, 9, 32);   // Haste direita
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.fillRect(-45, 14, 3, 32);
            ctx.fillRect(36, 14, 3, 32);

            // 2. Aerofólio horizontal superior imponente
            ctx.fillStyle = pettyBlue;
            ctx.fillRect(-48, 42, 96, 9);
            ctx.fillStyle = whiteAccent;
            ctx.fillRect(-44, 44, 88, 3);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(-48, 50, 96, 2);

            // Decalque clássico "ROAD RUNNER / SUPERBIRD" nas aletas laterais da asa
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-44, 22, 7, 14);
            ctx.fillRect(37, 22, 7, 14);
            ctx.fillStyle = '#000000';
            ctx.fillRect(-42, 26, 3, 6);
            ctx.fillRect(39, 26, 3, 6);

            // Para-choque Traseiro Cromado e Lanternas Triplas Horizontais
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-42, 30, 84, 4);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-38, 30, 16, 3);
            ctx.fillRect(22, 30, 16, 3);
        }

        // ----------------------------------------------------
        // MODELO 2: MONTE CARLO AEROCOUPE (ANOS 80/90 - DALE EARNHARDT #3)
        // ----------------------------------------------------
        else if (modelType === 'MONTE_CARLO') {
            let blackColor = bodyColor || '#111827';
            let redAccent = accentColor || '#dc2626';

            // Carroceria Stock Car Aerocoupe
            ctx.fillStyle = blackColor;
            ctx.beginPath();
            ctx.moveTo(-36, -40); ctx.lineTo(36, -40);
            ctx.lineTo(44, 28); ctx.lineTo(-44, 28);
            ctx.closePath(); ctx.fill();

            // Friso Prateado e Grade Dianteira Agressiva Vermelha
            ctx.fillStyle = redAccent;
            ctx.fillRect(-34, -40, 68, 5);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-28, -39, 56, 2);

            // Faróis Retangulares dos Anos 80
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-32, -38, 10, 4);
            ctx.fillRect(22, -38, 10, 4);

            // Teto e Vidro Bolha Aerocoupe Curvo
            ctx.fillStyle = blackColor;
            ctx.fillRect(-28, -20, 56, 32);

            // Número #3 Estilizado
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px "Press Start 2P", sans-serif';
            ctx.fillText("3", -8, 2);
            ctx.fillStyle = redAccent;
            ctx.fillText("3", -7, 3);

            // Vidro Traseiro Bolha Aerocoupe Glass (Vidro Curvo que deu a fama ao carro)
            let bubbleGrad = ctx.createLinearGradient(0, 10, 0, 26);
            bubbleGrad.addColorStop(0, '#0f172a');
            bubbleGrad.addColorStop(0.5, '#334155');
            bubbleGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = bubbleGrad;
            ctx.beginPath();
            ctx.moveTo(-26, 12); ctx.lineTo(26, 12);
            ctx.quadraticCurveTo(36, 26, 36, 27);
            ctx.lineTo(-36, 27);
            ctx.quadraticCurveTo(-36, 26, -26, 12);
            ctx.fill();

            // Para-brisa Dianteiro
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.moveTo(-26, -20); ctx.lineTo(26, -20);
            ctx.lineTo(34, -36); ctx.lineTo(-34, -36);
            ctx.closePath(); ctx.fill();

            // Piloto
            ctx.fillStyle = helmetColor || '#facc15';
            ctx.beginPath(); ctx.arc(-14, -2, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#111827'; ctx.fillRect(-18, -4, 6, 3);

            // Spoiler Lâmina Traseira Agressivo de Alumínio
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(-46, 26, 92, 10);
            ctx.fillStyle = redAccent;
            ctx.fillRect(-44, 27, 88, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-42, 28, 84, 1.5);
        }

        // ----------------------------------------------------
        // MODELO 3: NASCAR RACING TRUCK (CRAFTSMAN TRUCK SERIES)
        // ----------------------------------------------------
        else if (modelType === 'TRUCK') {
            let truckColor = bodyColor || '#059669';
            let truckAccent = accentColor || '#10b981';

            // Silhueta Robusta de Picape V8 de Corrida
            ctx.fillStyle = truckColor;
            ctx.beginPath();
            ctx.moveTo(-36, -38); ctx.lineTo(36, -38);
            ctx.lineTo(45, 28); ctx.lineTo(-45, 28);
            ctx.closePath(); ctx.fill();

            // Grade Cromada e Faróis Verticais de Picape
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-32, -38, 64, 4);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-32, -37, 8, 6);
            ctx.fillRect(24, -37, 8, 6);

            // Cabine Quadrada Esportiva
            ctx.fillStyle = truckColor;
            ctx.fillRect(-28, -22, 56, 26);

            // Caçamba Fechada com Capota Tonneau Cover e Travas de Segurança
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-34, 4, 68, 24);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-30, 8, 60, 16);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-28, 6, 4, 3);
            ctx.fillRect(24, 6, 4, 3);

            // Número no Teto
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "Press Start 2P", sans-serif';
            ctx.fillText("88", -12, -6);

            // Para-brisa e Janela Traseira Vertical
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-26, -22, 52, 14);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-24, 2, 48, 4);

            // Piloto
            ctx.fillStyle = helmetColor || '#ffffff';
            ctx.beginPath(); ctx.arc(-14, -12, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#111827'; ctx.fillRect(-18, -14, 6, 3);

            // Aerofólio Alto de Picape NASCAR
            ctx.fillStyle = '#111827';
            ctx.fillRect(-46, 26, 92, 11);
            ctx.fillStyle = truckAccent;
            ctx.fillRect(-42, 28, 84, 5);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-38, 29, 76, 2);
        }

        // ----------------------------------------------------
        // MODELO 4: NASCAR NEXT-GEN MODERNO (CAMARO ZL1 / MUSTANG DARK HORSE)
        // ----------------------------------------------------
        else {
            let cupColor = bodyColor || '#0055ff';
            let cupAccent = accentColor || '#facc15';

            // Carroceria Aerodinâmica Moderna Next-Gen
            ctx.fillStyle = cupColor;
            ctx.beginPath();
            ctx.moveTo(-38, -40); ctx.lineTo(38, -40);
            ctx.lineTo(45, 27); ctx.lineTo(-45, 27);
            ctx.closePath(); ctx.fill();

            // Splitter Dianteiro de Fibra de Carbono e Faróis LED
            ctx.fillStyle = '#111827';
            ctx.fillRect(-36, -42, 72, 4);
            ctx.fillStyle = '#38bdf8'; // Faróis LED azulados
            ctx.fillRect(-32, -40, 10, 3);
            ctx.fillRect(22, -40, 10, 3);

            // Faixas Modernas Next-Gen no Capô
            ctx.fillStyle = cupAccent;
            ctx.fillRect(-14, -40, 28, 66);
            ctx.fillStyle = cupColor;
            ctx.fillRect(-3, -40, 6, 66);

            // Teto com Spoiler de Teto (Roof Flaps Anti-Capotamento)
            ctx.fillStyle = cupColor;
            ctx.fillRect(-28, -20, 56, 34);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-18, -2, 14, 3);
            ctx.fillRect(4, -2, 14, 3);

            // Número Moderno Estilizado no Teto
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Press Start 2P", sans-serif';
            ctx.fillText("24", -12, 3);

            // Para-brisa com Película e Reflexo
            let cupWind = ctx.createLinearGradient(0, -36, 0, -18);
            cupWind.addColorStop(0, '#0f172a');
            cupWind.addColorStop(1, '#0284c7');
            ctx.fillStyle = cupWind;
            ctx.beginPath();
            ctx.moveTo(-26, -18); ctx.lineTo(26, -18);
            ctx.lineTo(34, -36); ctx.lineTo(-34, -36);
            ctx.closePath(); ctx.fill();

            // Vidro Traseiro Fastback com Câmera Onboard
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.moveTo(-26, 14); ctx.lineTo(26, 14);
            ctx.lineTo(36, 25); ctx.lineTo(-36, 25);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-2, 16, 4, 3); // Câmera de transmissão

            // Vidros Laterais com Rede Laranja e Piloto
            ctx.fillStyle = '#0a1018';
            ctx.fillRect(-32, -18, 6, 30);
            ctx.fillRect(26, -18, 6, 30);
            ctx.fillStyle = '#ea580c';
            for (let ny = -16; ny < 10; ny += 4) { ctx.fillRect(-32, ny, 6, 1.5); }

            ctx.fillStyle = helmetColor || '#ffffff';
            ctx.beginPath(); ctx.arc(-14, -2, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#111827'; ctx.fillRect(-18, -4, 6, 3);

            // Spoiler Traseiro de Fibra de Carbono com Difusor Inferior
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-46, 26, 92, 8);
            ctx.fillStyle = cupAccent;
            ctx.fillRect(-42, 27, 84, 3.5);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-40, 28, 80, 1.5);
        }

        // Tubo de Escapamento Lateral com Brilho Metálico (Gera o rugido clássico NASCAR)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(38, 14, 7, 5);
        ctx.fillStyle = '#111827';
        ctx.fillRect(43, 15, 2, 3);

        ctx.restore();
    }

    // ====================================================
    // 2. SPRITES DO CENÁRIO NASCAR (ARQUIBANCADA GIGANTE)
    // ====================================================
    function initNascarSprites(sCtx, SPRITES) {
        if (!SPRITES) return;

        // SPRITE: ARQUIBANCADA GIGANTE NASCAR (NASCAR_GRANDSTAND_GIANT)
        // Localizado no spriteCanvas em (0, 0, 500, 260) ou área livre
        SPRITES.NASCAR_GRANDSTAND_GIANT = { x: 520, y: 0, w: 500, h: 260 };
        SPRITES.NASCAR_SCORING_PYLON   = { x: 520, y: 265, w: 90, h: 230 };
        SPRITES.NASCAR_LIGHT_TOWER     = { x: 620, y: 265, w: 110, h: 230 };
        SPRITES.NASCAR_SAFER_BARRIER   = { x: 740, y: 265, w: 280, h: 100 };
        SPRITES.NASCAR_HAULER          = { x: 740, y: 370, w: 280, h: 120 };

        let gx = SPRITES.NASCAR_GRANDSTAND_GIANT.x;
        let gy = SPRITES.NASCAR_GRANDSTAND_GIANT.y;
        let gw = SPRITES.NASCAR_GRANDSTAND_GIANT.w;
        let gh = SPRITES.NASCAR_GRANDSTAND_GIANT.h;

        sCtx.save();
        sCtx.translate(gx, gy);

        // --- ARQUIBANCADA GIGANTE MULTI-NÍVEL (ESTILO DAYTONA / BRISTOL) ---
        // 1. Estrutura de Concreto e Aço dos Níveis Superiores
        sCtx.fillStyle = '#1e2530';
        sCtx.fillRect(0, 40, gw, gh - 40);

        // 2. Cobertura / Marquise do Topo com Vigas de Iluminação
        sCtx.fillStyle = '#2b3545';
        sCtx.fillRect(0, 0, gw, 35);
        sCtx.fillStyle = '#e10600';
        sCtx.fillRect(0, 0, gw, 8); // Friso vermelho NASCAR

        // Faixa com Logo NASCAR SPEEDWAY no topo
        sCtx.fillStyle = '#ffffff';
        sCtx.font = 'bold 16px "Press Start 2P", sans-serif';
        sCtx.fillText("★★★ NASCAR SUPERSPEEDWAY ★★★", 25, 24);

        // 3. Camarotes VIP e Cabines de Transmissão (Suites com vidros espelhados)
        sCtx.fillStyle = '#0f172a';
        sCtx.fillRect(10, 38, gw - 20, 30);
        for (let bx = 15; bx < gw - 20; bx += 32) {
            sCtx.fillStyle = '#38bdf8'; // Vidro azul refletindo o céu
            sCtx.fillRect(bx, 42, 26, 22);
            sCtx.fillStyle = 'rgba(255,255,255,0.6)';
            sCtx.fillRect(bx + 2, 44, 8, 18);
        }

        // 4. Arquibancada Principal Superior (Cores vivas de assentos e multidão vibrante)
        let tier1Y = 72;
        let tier1H = 80;
        sCtx.fillStyle = '#1e293b';
        sCtx.fillRect(0, tier1Y, gw, tier1H);

        // Linhas de degraus
        for (let row = 0; row < 8; row++) {
            let ry = tier1Y + row * 10;
            sCtx.fillStyle = row % 2 === 0 ? '#334155' : '#1e293b';
            sCtx.fillRect(0, ry, gw, 10);
        }

        // Multidão animada de torcedores (pixels coloridos, bandeiras, bonés)
        const fanColors = ['#ff0033', '#ffffff', '#0066ff', '#ffcc00', '#00cc44', '#ff6600', '#9900cc', '#00ffff'];
        for (let i = 0; i < 900; i++) {
            let px = 5 + Math.random() * (gw - 10);
            let py = tier1Y + 2 + Math.random() * (tier1H - 6);
            let col = fanColors[Math.floor(Math.random() * fanColors.length)];
            sCtx.fillStyle = col;
            sCtx.fillRect(px, py, 3, 3);
            // Cabeça/boné
            sCtx.fillStyle = '#ffdbac';
            sCtx.fillRect(px, py - 2, 3, 2);
        }

        // Banners de Patrocinadores no Meio da Arquibancada
        sCtx.fillStyle = '#000000';
        sCtx.fillRect(0, tier1Y + tier1H, gw, 22);
        sCtx.fillStyle = '#ffcc00';
        sCtx.fillRect(0, tier1Y + tier1H + 20, gw, 2);

        let sponsorOffset = 10;
        const sponsors = [
            { text: "GOODYEAR", bg: "#003399", fg: "#ffcc00", w: 110 },
            { text: "MONSTER", bg: "#000000", fg: "#00ff00", w: 105 },
            { text: "SUNOCO", bg: "#cc0000", fg: "#ffff00", w: 95 },
            { text: "CHEVY", bg: "#c59b27", fg: "#ffffff", w: 85 },
            { text: "FORD", bg: "#00205b", fg: "#ffffff", w: 75 }
        ];
        for (let sp of sponsors) {
            if (sponsorOffset + sp.w < gw) {
                sCtx.fillStyle = sp.bg;
                sCtx.fillRect(sponsorOffset, tier1Y + tier1H + 2, sp.w, 17);
                sCtx.fillStyle = sp.fg;
                sCtx.font = '9px "Press Start 2P", sans-serif';
                sCtx.fillText(sp.text, sponsorOffset + 8, tier1Y + tier1H + 14);
                sponsorOffset += sp.w + 10;
            }
        }

        // 5. Nível Inferior da Arquibancada (Próximo à pista)
        let tier2Y = tier1Y + tier1H + 24;
        let tier2H = 50;
        sCtx.fillStyle = '#1e293b';
        sCtx.fillRect(0, tier2Y, gw, tier2H);

        for (let row = 0; row < 5; row++) {
            let ry = tier2Y + row * 10;
            sCtx.fillStyle = row % 2 === 0 ? '#475569' : '#334155';
            sCtx.fillRect(0, ry, gw, 10);
        }

        for (let i = 0; i < 500; i++) {
            let px = 5 + Math.random() * (gw - 10);
            let py = tier2Y + 2 + Math.random() * (tier2H - 6);
            let col = fanColors[Math.floor(Math.random() * fanColors.length)];
            sCtx.fillStyle = col;
            sCtx.fillRect(px, py, 3, 3);
        }

        // 6. Alambrado de Proteção (Catch Fence) e Mureta SAFER Barrier na Frente
        let fenceY = tier2Y + tier2H;
        let fenceH = gh - fenceY;
        
        // Postes de aço da grade
        sCtx.strokeStyle = 'rgba(200, 210, 225, 0.6)';
        sCtx.lineWidth = 1;
        for (let fx = 0; fx < gw; fx += 15) {
            sCtx.beginPath();
            sCtx.moveTo(fx, fenceY);
            sCtx.lineTo(fx, fenceY + fenceH - 12);
            sCtx.stroke();
        }
        // Cabos de aço horizontais da Catch Fence
        for (let cy = fenceY + 2; cy < fenceY + fenceH - 12; cy += 5) {
            sCtx.beginPath();
            sCtx.moveTo(0, cy);
            sCtx.lineTo(gw, cy);
            sCtx.stroke();
        }

        // Mureta SAFER Barrier Branca e Vermelha
        sCtx.fillStyle = '#e2e8f0';
        sCtx.fillRect(0, gh - 14, gw, 14);
        sCtx.fillStyle = '#cc0000';
        for (let mx = 0; mx < gw; mx += 40) {
            sCtx.fillRect(mx, gh - 14, 20, 14);
        }
        sCtx.fillStyle = '#1e293b';
        sCtx.fillRect(0, gh - 2, gw, 2); // Linha preta de base

        sCtx.restore();

        // --- TORRE DE PONTUAÇÃO DIGITAL NASCAR (SCORING PYLON) ---
        let px = SPRITES.NASCAR_SCORING_PYLON.x;
        let py = SPRITES.NASCAR_SCORING_PYLON.y;
        let pw = SPRITES.NASCAR_SCORING_PYLON.w;
        let ph = SPRITES.NASCAR_SCORING_PYLON.h;

        sCtx.save();
        sCtx.translate(px, py);
        sCtx.fillStyle = '#0a0f1d';
        sCtx.fillRect(15, 0, pw - 30, ph);
        sCtx.fillStyle = '#ffcc00';
        sCtx.fillRect(12, 0, pw - 24, 25);
        sCtx.fillStyle = '#000000';
        sCtx.font = '10px "Press Start 2P"';
        sCtx.fillText("NASCAR", 18, 17);

        // Linhas de posições no painel LED
        for (let pos = 1; pos <= 8; pos++) {
            let ly = 32 + (pos - 1) * 23;
            sCtx.fillStyle = '#111827';
            sCtx.fillRect(18, ly, pw - 36, 20);
            sCtx.fillStyle = '#00ffcc';
            sCtx.font = '9px "Press Start 2P"';
            sCtx.fillText(`${pos} P`, 22, ly + 14);
            sCtx.fillStyle = '#ffcc00';
            let num = [88, 24, 11, 5, 9, 20, 18, 48][pos - 1];
            sCtx.fillText(`${num}`, pw - 38, ly + 14);
        }
        sCtx.restore();

        // --- TORRE DE HOLOFOTES DE ILUMINAÇÃO NOTURNA (LIGHT TOWER) ---
        let lx = SPRITES.NASCAR_LIGHT_TOWER.x;
        let ly = SPRITES.NASCAR_LIGHT_TOWER.y;
        let lw = SPRITES.NASCAR_LIGHT_TOWER.w;
        let lh = SPRITES.NASCAR_LIGHT_TOWER.h;

        sCtx.save();
        sCtx.translate(lx, ly);
        // Haste de metal treliçada
        sCtx.fillStyle = '#64748b';
        sCtx.fillRect(lw / 2 - 4, 45, 8, lh - 45);
        sCtx.strokeStyle = '#94a3b8';
        sCtx.lineWidth = 2;
        for (let ty = 50; ty < lh - 10; ty += 20) {
            sCtx.beginPath();
            sCtx.moveTo(lw / 2 - 10, ty);
            sCtx.lineTo(lw / 2 + 10, ty + 15);
            sCtx.lineTo(lw / 2 - 10, ty + 15);
            sCtx.stroke();
        }

        // Bateria de refletores no topo
        sCtx.fillStyle = '#1e293b';
        sCtx.fillRect(5, 5, lw - 10, 40);
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 5; c++) {
                sCtx.fillStyle = '#ffffff';
                sCtx.beginPath();
                sCtx.arc(16 + c * 18, 15 + r * 18, 6, 0, Math.PI * 2);
                sCtx.fill();
                sCtx.fillStyle = 'rgba(255, 255, 200, 0.8)';
                sCtx.beginPath();
                sCtx.arc(16 + c * 18, 15 + r * 18, 4, 0, Math.PI * 2);
                sCtx.fill();
            }
        }
        sCtx.restore();

        // --- MURETA SAFER BARRIER COM ALAMBRADO ---
        let sbx = SPRITES.NASCAR_SAFER_BARRIER.x;
        let sby = SPRITES.NASCAR_SAFER_BARRIER.y;
        let sbw = SPRITES.NASCAR_SAFER_BARRIER.w;
        let sbh = SPRITES.NASCAR_SAFER_BARRIER.h;

        sCtx.save();
        sCtx.translate(sbx, sby);
        // Grade
        sCtx.strokeStyle = 'rgba(200, 220, 240, 0.5)';
        for (let x = 0; x < sbw; x += 12) {
            sCtx.beginPath(); sCtx.moveTo(x, 0); sCtx.lineTo(x, sbh - 25); sCtx.stroke();
        }
        for (let y = 0; y < sbh - 25; y += 8) {
            sCtx.beginPath(); sCtx.moveTo(0, y); sCtx.lineTo(sbw, y); sCtx.stroke();
        }
        // Mureta
        sCtx.fillStyle = '#f8fafc';
        sCtx.fillRect(0, sbh - 25, sbw, 25);
        sCtx.fillStyle = '#dc2626';
        for (let x = 0; x < sbw; x += 40) {
            sCtx.fillRect(x, sbh - 25, 20, 25);
        }
        sCtx.fillStyle = '#0f172a';
        sCtx.fillRect(0, sbh - 4, sbw, 4);
        sCtx.restore();

        // --- CAMINHÃO TRANSPORTADOR DA EQUIPE NASCAR (HAULER) ---
        let hx = SPRITES.NASCAR_HAULER.x;
        let hy = SPRITES.NASCAR_HAULER.y;
        let hw = SPRITES.NASCAR_HAULER.w;
        let hh = SPRITES.NASCAR_HAULER.h;

        sCtx.save();
        sCtx.translate(hx, hy);
        // Trailer
        sCtx.fillStyle = '#0f172a';
        sCtx.fillRect(50, 10, hw - 55, hh - 30);
        sCtx.fillStyle = '#2563eb';
        sCtx.fillRect(50, 10, hw - 55, 18);
        sCtx.fillStyle = '#ffffff';
        sCtx.font = '10px "Press Start 2P"';
        sCtx.fillText("RACING TEAM", 70, 24);
        // Cabine do Caminhão
        sCtx.fillStyle = '#1e3a8a';
        sCtx.fillRect(5, 25, 45, hh - 45);
        sCtx.fillStyle = '#38bdf8';
        sCtx.fillRect(10, 30, 20, 16);
        // Rodas do caminhão
        sCtx.fillStyle = '#000000';
        sCtx.fillRect(12, hh - 22, 16, 16);
        sCtx.fillRect(hw - 60, hh - 22, 16, 16);
        sCtx.fillRect(hw - 40, hh - 22, 16, 16);
        sCtx.restore();
    }

    // ==========================================
    // 3. CONFIGURAÇÃO DAS PISTAS DA NASCAR
    // ==========================================
    const NASCAR_STAGES = [
        {
            name: "NASCAR — DAYTONA INTERNATIONAL SPEEDWAY 🏁",
            menuName: "NASCAR 1: DAYTONA SPEEDWAY 🏁",
            laps: 3,
            weather: "CLEAR",
            theme: "NASCAR_OVAL",
            aiSpeedFactor: 1.05,
            build: function(addRoad) {
                // Tri-oval super rápido de Daytona
                addRoad(200, 240, 200, 0, 0);      // Reta principal dos boxes (Frontstretch)
                addRoad(60, 140, 60, 12, 10);      // Curva 1 e 2 super inclinadas (High banking)
                addRoad(240, 260, 240, 0, 0);      // Super Reta oposta (Backstretch)
                addRoad(60, 140, 60, 12, 10);      // Curva 3 e 4
                addRoad(80, 80, 80, 3, 0);         // Tri-oval kink (leve curva da linha de chegada)
            }
        },
        {
            name: "NASCAR — TALLADEGA SUPERSPEEDWAY 🌅",
            menuName: "NASCAR 2: TALLADEGA 🌅",
            laps: 3,
            weather: "SUNSET",
            theme: "NASCAR_OVAL",
            aiSpeedFactor: 1.07,
            build: function(addRoad) {
                // Oval gigantesco de Talladega (velocidades extremas e vácuo constante)
                addRoad(250, 300, 250, 0, 0);      // Reta gigantesca
                addRoad(70, 160, 70, 13, 15);      // Curvas 1 & 2 muito abertas
                addRoad(280, 320, 280, 0, 0);      // Reta oposta
                addRoad(70, 160, 70, 13, 15);      // Curvas 3 & 4
            }
        },
        {
            name: "NASCAR — CHARLOTTE MOTOR SPEEDWAY 🌙",
            menuName: "NASCAR 3: CHARLOTTE 🌙",
            laps: 3,
            weather: "SUNSET",
            theme: "NASCAR_OVAL",
            aiSpeedFactor: 1.04,
            build: function(addRoad) {
                // Quad-oval intermediário
                addRoad(180, 200, 180, 0, 0);
                addRoad(50, 120, 50, 11, 5);
                addRoad(180, 200, 180, 0, 0);
                addRoad(50, 120, 50, 11, 5);
            }
        },
        {
            name: "NASCAR — BRISTOL MOTOR SPEEDWAY ⚡",
            menuName: "NASCAR 4: BRISTOL COLOSSEUM ⚡",
            laps: 4,
            weather: "RAIN",
            theme: "NASCAR_OVAL",
            aiSpeedFactor: 1.02,
            build: function(addRoad) {
                // Short Track "The Last Great Colosseum" - Todo cercado de arquibancadas verticais
                addRoad(100, 120, 100, 0, 0);
                addRoad(60, 130, 60, 14, 25);
                addRoad(100, 120, 100, 0, 0);
                addRoad(60, 130, 60, 14, 25);
            }
        },
        {
            name: "NASCAR — WATKINS GLEN ROAD COURSE 🌲",
            menuName: "NASCAR 5: WATKINS GLEN 🌲",
            laps: 3,
            weather: "CLEAR",
            theme: "NASCAR_ROAD",
            aiSpeedFactor: 1.03,
            build: function(addRoad) {
                // Circuito misto de alta velocidade com Stock Cars
                addRoad(160, 160, 160, 0, 0);
                addRoad(45, 50, 45, 8, 15);        // The Esses
                addRoad(45, 50, 45, -8, -10);
                addRoad(220, 220, 220, 0, 0);      // Inner loop & backstretch
                addRoad(60, 60, 60, 10, 0);        // Carousel
                addRoad(150, 150, 150, 0, 0);
                addRoad(50, 50, 50, -7, 0);
                addRoad(120, 120, 120, 0, 0);
            }
        }
    ];

    // Exportação para o escopo global
    window.drawNascarSprite = drawNascarSprite;
    window.initNascarSprites = initNascarSprites;
    window.NASCAR_CONFIG = {
        stages: NASCAR_STAGES
    };

})();

<?php
// rally.php - API de Configuração das Pistas do Modo Rally WRC
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

class RallyTrackManager {
    public function getTracks() {
        return [
            'name' => 'RALLY WRC',
            'description' => 'Campeonato Mundial de Rally - Pistas de Terra, Rampas de Salto e Derrapagens Radicais',
            'stages' => [
                [
                    'name' => 'RALLY WRC — FINLÂNDIA (1000 LAKES) 🌲',
                    'menuName' => 'RALLY 1: FINLÂNDIA (SALTOS NOS CUMES) 🌲',
                    'laps' => 3,
                    'weather' => 'CLEAR',
                    'theme' => 'RALLY_GRAVEL',
                    'aiSpeedFactor' => 1.02,
                    'ramps' => 4,
                    'surface' => 'Cascalho Rápido e Terra Batida'
                ],
                [
                    'name' => 'RALLY WRC — SAFARI DO QUÊNIA 🏜️',
                    'menuName' => 'RALLY 2: SAFARI QUÊNIA (TERRA VERMELHA) 🏜️',
                    'laps' => 3,
                    'weather' => 'SUNSET',
                    'theme' => 'RALLY_SAFARI',
                    'aiSpeedFactor' => 1.03,
                    'ramps' => 5,
                    'surface' => 'Terra Vermelha e Valas de Savana'
                ],
                [
                    'name' => 'RALLY WRC — MONTE CARLO (ALPES) ⛰️',
                    'menuName' => 'RALLY 3: MONTE CARLO (DESFILADEIROS) ⛰️',
                    'laps' => 3,
                    'weather' => 'CLEAR',
                    'theme' => 'RALLY_DIRT',
                    'aiSpeedFactor' => 1.00,
                    'ramps' => 3,
                    'surface' => 'Cascalho de Montanha e Curvas Fechadas'
                ],
                [
                    'name' => 'RALLY WRC — PAÍS DE GALES (LAMA & CHUVA) 🌧️⚡',
                    'menuName' => 'RALLY 4: PAÍS DE GALES (LAMAÇAL) 🌧️⚡',
                    'laps' => 3,
                    'weather' => 'RAIN',
                    'theme' => 'RALLY_MUD',
                    'aiSpeedFactor' => 0.96,
                    'ramps' => 4,
                    'surface' => 'Lama Escorregadia e Poças d\'Água'
                ],
                [
                    'name' => 'RALLY WRC — GRÉCIA (ACROPOLIS) 🌋',
                    'menuName' => 'RALLY 5: GRÉCIA ACROPOLIS (PEDREGULHO) 🌋',
                    'laps' => 3,
                    'weather' => 'SUNSET',
                    'theme' => 'RALLY_DIRT',
                    'aiSpeedFactor' => 1.01,
                    'ramps' => 6,
                    'surface' => 'Pedregulhos, Desfiladeiros e Rampas Duplas'
                ]
            ],
            'cars' => [
                ['id' => 'SUBARU', 'name' => 'Subaru Impreza WRC 1999', 'class' => 'WRC 4WD', 'power' => '300 HP'],
                ['id' => 'AUDI_QUATTRO', 'name' => 'Audi Sport Quattro S1 E2', 'class' => 'Grupo B Monster', 'power' => '550 HP'],
                ['id' => 'LANCER_EVO', 'name' => 'Mitsubishi Lancer Evo VI', 'class' => 'Group A / WRC', 'power' => '320 HP'],
                ['id' => 'LANCIA_STRATOS', 'name' => 'Lancia Stratos HF', 'class' => 'Classic Group 4', 'power' => '275 HP']
            ]
        ];
    }
}

$manager = new RallyTrackManager();
echo json_encode($manager->getTracks());

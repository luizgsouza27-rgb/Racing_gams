<?php
// api_nascar.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

class NascarTrackManager {
    public function getTracks() {
        return [
            'name' => 'NASCAR',
            'stages' => [
                [
                    'name' => 'NASCAR — DAYTONA INTERNATIONAL SPEEDWAY',
                    'menuName' => 'NASCAR 1: DAYTONA 🏁',
                    'laps' => 3, 'weather' => 'CLEAR', 'theme' => 'NASCAR_OVAL',
                    'aiSpeedFactor' => 1.00, 'banking' => 0.22,
                    'buildConfig' => ['type' => 'oval', 'params' => [250, 105, 11.5]]
                ],
                [
                    'name' => 'NASCAR — TALLADEGA SUPERSPEEDWAY',
                    'menuName' => 'NASCAR 2: TALLADEGA 🏁',
                    'laps' => 3, 'weather' => 'SUNSET', 'theme' => 'NASCAR_OVAL',
                    'aiSpeedFactor' => 1.03, 'banking' => 0.28,
                    'buildConfig' => ['type' => 'oval', 'params' => [285, 120, 12.5]]
                ],
                [
                    'name' => 'NASCAR — CHARLOTTE MOTOR SPEEDWAY',
                    'menuName' => 'NASCAR 3: CHARLOTTE 🌙',
                    'laps' => 3, 'weather' => 'SUNSET', 'theme' => 'NASCAR_OVAL',
                    'aiSpeedFactor' => 1.01, 'banking' => 0.24,
                    'buildConfig' => ['type' => 'oval', 'params' => [225, 100, 11.5]]
                ],
                [
                    'name' => 'NASCAR — BRISTOL MOTOR SPEEDWAY',
                    'menuName' => 'NASCAR 4: BRISTOL ⚡',
                    'laps' => 4, 'weather' => 'RAIN', 'theme' => 'NASCAR_OVAL',
                    'aiSpeedFactor' => 0.96, 'banking' => 0.34,
                    'buildConfig' => ['type' => 'oval', 'params' => [145, 125, 14.0]]
                ],
                [
                    'name' => 'NASCAR — ROAD COURSE',
                    'menuName' => 'NASCAR 5: ROAD COURSE 🌲',
                    'laps' => 3, 'weather' => 'CLEAR', 'theme' => 'NASCAR_ROAD',
                    'aiSpeedFactor' => 0.98, 'banking' => 0.05,
                    'buildConfig' => ['type' => 'roadCourse', 'params' => []]
                ]
            ]
        ];
    }
}

$manager = new NascarTrackManager();
echo json_encode($manager->getTracks());
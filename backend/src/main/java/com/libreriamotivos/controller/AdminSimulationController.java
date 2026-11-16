package com.libreriamotivos.controller;

import com.libreriamotivos.service.AdminAuthService;
import com.libreriamotivos.simulation.DataSimulationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoint de control para la simulación de datos en el panel de ADMINISTRADOR.
 * Permite consultar el estado de la simulación y reejecutar la precarga de datos de prueba.
 */
@RestController
@RequestMapping("/api/admin/simulacion")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AdminSimulationController {

    private final DataSimulationService simulationService;
    private final AdminAuthService adminAuthService;

    public AdminSimulationController(DataSimulationService simulationService, AdminAuthService adminAuthService) {
        this.simulationService = simulationService;
        this.adminAuthService = adminAuthService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> resumen() {
        return ResponseEntity.ok(simulationService.obtenerResumenSimulacion());
    }

    @PostMapping("/ejecutar")
    public ResponseEntity<Map<String, Object>> ejecutar(
            @RequestParam(defaultValue = "false") boolean forzar,
            @RequestHeader(value = "X-Admin-Password", required = false) String adminPasswordHeader) {

        if (forzar) {
            if (!adminAuthService.verificarPassword(adminPasswordHeader)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Se requiere contraseña de administrador válida en cabecera 'X-Admin-Password' para forzar la simulación"));
            }
        }

        Map<String, Object> resultado = simulationService.ejecutarSimulacion(forzar);
        return ResponseEntity.ok(resultado);
    }
}

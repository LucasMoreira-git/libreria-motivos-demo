package com.libreriamotivos.controller;

import com.libreriamotivos.dto.HorarioAtencionDTO;
import com.libreriamotivos.entity.HorarioAtencion;
import com.libreriamotivos.service.HorarioAtencionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para Horarios de Atención por Turnos (Mañana, Tarde, Sábados).
 * Mapeo estricto con HorarioAtencionDTO.
 */
@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class HorarioAtencionController {

    private final HorarioAtencionService horarioService;

    public HorarioAtencionController(HorarioAtencionService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping
    public ResponseEntity<List<HorarioAtencionDTO>> listarActivos() {
        return ResponseEntity.ok(horarioService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioAtencionDTO> obtenerPorId(@PathVariable Long id) {
        return horarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HorarioAtencionDTO> crear(@RequestBody HorarioAtencion horario) {
        HorarioAtencionDTO creado = horarioService.guardar(horario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioAtencionDTO> actualizar(@PathVariable Long id, @RequestBody HorarioAtencion horario) {
        horario.setId(id);
        HorarioAtencionDTO actualizado = horarioService.guardar(horario);
        return ResponseEntity.ok(actualizado);
    }

    /**
     * Baja lógica del turno de horario.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBaja(@PathVariable Long id) {
        boolean dadoDeBaja = horarioService.darDeBaja(id);
        if (dadoDeBaja) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Horario dado de baja lógicamente con éxito",
                    "id", id,
                    "activo", false
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Horario no encontrado o ya inactivo",
                "id", id
        ));
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<Map<String, Object>> reactivar(@PathVariable Long id) {
        boolean reactivado = horarioService.reactivar(id);
        if (reactivado) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Horario reactivado con éxito",
                    "id", id,
                    "activo", true
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Horario no encontrado o ya activo",
                "id", id
        ));
    }
}

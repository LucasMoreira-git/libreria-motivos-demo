package com.libreriamotivos.controller;

import com.libreriamotivos.dto.PromocionDTO;
import com.libreriamotivos.entity.Promocion;
import com.libreriamotivos.service.PromocionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para Promociones y Combos de Temporada.
 * Utiliza exclusivamente PromocionDTO para la respuesta al cliente.
 */
@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    @GetMapping
    public ResponseEntity<List<PromocionDTO>> listarActivas(@RequestParam(required = false) String temporada) {
        if (temporada != null && !temporada.isBlank()) {
            return ResponseEntity.ok(promocionService.listarPorTemporada(temporada));
        }
        return ResponseEntity.ok(promocionService.listarActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromocionDTO> obtenerPorId(@PathVariable Long id) {
        return promocionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PromocionDTO> crear(@RequestBody Promocion promocion) {
        PromocionDTO creada = promocionService.guardar(promocion);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromocionDTO> actualizar(@PathVariable Long id, @RequestBody Promocion promocion) {
        promocion.setId(id);
        PromocionDTO actualizada = promocionService.guardar(promocion);
        return ResponseEntity.ok(actualizada);
    }

    /**
     * Baja lógica de la promoción.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBaja(@PathVariable Long id) {
        boolean dadaDeBaja = promocionService.darDeBaja(id);
        if (dadaDeBaja) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Promoción dada de baja lógicamente con éxito",
                    "id", id,
                    "activo", false
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Promoción no encontrada o ya inactiva",
                "id", id
        ));
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<Map<String, Object>> reactivar(@PathVariable Long id) {
        boolean reactivada = promocionService.reactivar(id);
        if (reactivada) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Promoción reactivada con éxito",
                    "id", id,
                    "activo", true
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Promoción no encontrada o ya activa",
                "id", id
        ));
    }
}

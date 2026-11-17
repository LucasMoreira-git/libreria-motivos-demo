package com.libreriamotivos.controller;

import com.libreriamotivos.dto.TipoCategoriaDTO;
import com.libreriamotivos.entity.TipoCategoria;
import com.libreriamotivos.service.TipoCategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para TipoCategoria.
 * Expone endpoints para el catálogo público y administración.
 * NUNCA devuelve entidades crudas, utiliza siempre TipoCategoriaDTO.
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class TipoCategoriaController {

    private final TipoCategoriaService categoriaService;

    public TipoCategoriaController(TipoCategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<List<TipoCategoriaDTO>> listarActivas(
            @RequestParam(required = false, defaultValue = "false") boolean incluirInactivas) {
        if (incluirInactivas) {
            return ResponseEntity.ok(categoriaService.listarTodas());
        }
        return ResponseEntity.ok(categoriaService.listarActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoCategoriaDTO> obtenerPorId(@PathVariable Long id) {
        return categoriaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<TipoCategoriaDTO> obtenerPorSlug(@PathVariable String slug) {
        return categoriaService.obtenerPorSlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipoCategoriaDTO> crear(@RequestBody TipoCategoria categoria) {
        TipoCategoriaDTO creada = categoriaService.guardar(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoCategoriaDTO> actualizar(@PathVariable Long id, @RequestBody TipoCategoria categoria) {
        categoria.setId(id);
        TipoCategoriaDTO actualizada = categoriaService.guardar(categoria);
        return ResponseEntity.ok(actualizada);
    }

    /**
     * Baja lógica de la categoría: propaga baja a todos los productos dependientes.
     * NUNCA ejecuta DELETE en base de datos.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBaja(@PathVariable Long id) {
        boolean eliminada = categoriaService.darDeBaja(id);
        if (eliminada) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Categoría y sus productos asociados dados de baja lógicamente con éxito",
                    "id", id,
                    "activo", false
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Categoría no encontrada o ya dada de baja",
                "id", id
        ));
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<Map<String, Object>> reactivar(@PathVariable Long id) {
        boolean reactivada = categoriaService.reactivar(id);
        if (reactivada) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Categoría reactivada con éxito",
                    "id", id,
                    "activo", true
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Categoría no encontrada o ya activa",
                "id", id
        ));
    }
}

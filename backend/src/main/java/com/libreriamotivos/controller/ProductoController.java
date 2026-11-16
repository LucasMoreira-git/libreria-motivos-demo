package com.libreriamotivos.controller;

import com.libreriamotivos.dto.ProductoDTO;
import com.libreriamotivos.entity.Producto;
import com.libreriamotivos.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el Catálogo de Productos de Librería Motivos.
 * NUNCA expone entidades crudas; responde exclusivamente con ProductoDTO.
 */
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long promocionId,
            @RequestParam(required = false) String buscar,
            @RequestParam(required = false) Boolean destacados) {

        if (buscar != null && !buscar.isBlank()) {
            return ResponseEntity.ok(productoService.buscarPorNombre(buscar.trim()));
        }
        if (destacados != null && destacados) {
            return ResponseEntity.ok(productoService.listarDestacados());
        }
        if (categoriaId != null) {
            return ResponseEntity.ok(productoService.listarPorCategoria(categoriaId));
        }
        if (promocionId != null) {
            return ResponseEntity.ok(productoService.listarPorPromocion(promocionId));
        }

        return ResponseEntity.ok(productoService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long promocionId,
            @RequestBody Producto producto) {
        ProductoDTO creado = productoService.guardar(producto, categoriaId, promocionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(
            @PathVariable Long id,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long promocionId,
            @RequestBody Producto producto) {
        producto.setId(id);
        ProductoDTO actualizado = productoService.guardar(producto, categoriaId, promocionId);
        return ResponseEntity.ok(actualizado);
    }

    /**
     * Baja lógica del producto.
     * NUNCA ejecuta DELETE en la base de datos.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBaja(@PathVariable Long id) {
        boolean dadoDeBaja = productoService.darDeBaja(id);
        if (dadoDeBaja) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Producto dado de baja lógicamente con éxito",
                    "id", id,
                    "activo", false
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Producto no encontrado o ya inactivo",
                "id", id
        ));
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<Map<String, Object>> reactivar(@PathVariable Long id) {
        boolean reactivado = productoService.reactivar(id);
        if (reactivado) {
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Producto reactivado con éxito",
                    "id", id,
                    "activo", true
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "mensaje", "Producto no encontrado o ya activo",
                "id", id
        ));
    }
}

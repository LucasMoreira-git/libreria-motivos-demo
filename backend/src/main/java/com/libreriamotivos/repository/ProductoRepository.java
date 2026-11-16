package com.libreriamotivos.repository;

import com.libreriamotivos.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Spring Data JPA para la entidad Producto.
 * Aplica regla estricta de bajas lógicas: consultas filtran por fechaHoraBajaProducto IS NULL.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Consultas para registros activos (sin baja lógica)
    List<Producto> findByFechaHoraBajaProductoIsNull();

    Optional<Producto> findByIdAndFechaHoraBajaProductoIsNull(Long id);

    List<Producto> findByTipoCategoriaIdAndFechaHoraBajaProductoIsNull(Long tipoCategoriaId);

    List<Producto> findByPromocionIdAndFechaHoraBajaProductoIsNull(Long promocionId);

    List<Producto> findByDestacadoProductoTrueAndFechaHoraBajaProductoIsNull();

    List<Producto> findByEnOfertaProductoTrueAndFechaHoraBajaProductoIsNull();

    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :nombre, '%')) AND p.fechaHoraBajaProducto IS NULL")
    List<Producto> findByNombreProductoContainingIgnoreCaseAndFechaHoraBajaProductoIsNull(@Param("nombre") String nombre);

    // Consulta para auditoría de registros dados de baja
    List<Producto> findByFechaHoraBajaProductoIsNotNull();
}

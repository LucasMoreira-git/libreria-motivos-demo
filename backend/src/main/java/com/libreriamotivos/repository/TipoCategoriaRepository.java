package com.libreriamotivos.repository;

import com.libreriamotivos.entity.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Spring Data JPA para la entidad TipoCategoria.
 * Aplica regla estricta de bajas lógicas: consultas filtran por fechaHoraBajaTC IS NULL.
 */
@Repository
public interface TipoCategoriaRepository extends JpaRepository<TipoCategoria, Long> {

    // Consultas para registros activos ordenados por ordenCategoria
    List<TipoCategoria> findByFechaHoraBajaTCIsNullOrderByOrdenCategoriaAsc();

    Optional<TipoCategoria> findByIdAndFechaHoraBajaTCIsNull(Long id);

    Optional<TipoCategoria> findBySlugCategoriaAndFechaHoraBajaTCIsNull(String slugCategoria);

    // Consulta para auditoría de categorías dadas de baja
    List<TipoCategoria> findByFechaHoraBajaTCIsNotNull();
}

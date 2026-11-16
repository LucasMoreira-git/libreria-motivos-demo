package com.libreriamotivos.repository;

import com.libreriamotivos.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Spring Data JPA para la entidad Promocion.
 * Aplica regla estricta de bajas lógicas: consultas filtran por fechaHoraBajaPromocion IS NULL.
 */
@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {

    // Consultas para registros activos
    List<Promocion> findByFechaHoraBajaPromocionIsNull();

    Optional<Promocion> findByIdAndFechaHoraBajaPromocionIsNull(Long id);

    List<Promocion> findByTemporadaPromocionAndFechaHoraBajaPromocionIsNull(String temporada);

    // Consulta para auditoría de promociones dadas de baja
    List<Promocion> findByFechaHoraBajaPromocionIsNotNull();
}

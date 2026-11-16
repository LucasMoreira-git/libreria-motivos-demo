package com.libreriamotivos.repository;

import com.libreriamotivos.entity.HorarioAtencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Spring Data JPA para la entidad HorarioAtencion.
 * Aplica regla estricta de bajas lógicas: consultas filtran por fechaHoraBajaHA IS NULL.
 */
@Repository
public interface HorarioAtencionRepository extends JpaRepository<HorarioAtencion, Long> {

    // Consultas para registros activos
    List<HorarioAtencion> findByFechaHoraBajaHAIsNull();

    Optional<HorarioAtencion> findByIdAndFechaHoraBajaHAIsNull(Long id);

    // Consulta para auditoría de horarios dados de baja
    List<HorarioAtencion> findByFechaHoraBajaHAIsNotNull();
}

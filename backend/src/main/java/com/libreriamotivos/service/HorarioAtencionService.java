package com.libreriamotivos.service;

import com.libreriamotivos.dto.HorarioAtencionDTO;
import com.libreriamotivos.entity.HorarioAtencion;
import com.libreriamotivos.repository.HorarioAtencionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la gestión de Horarios de Atención de Librería Motivos.
 * Aplica bajas lógicas y validación de turnos.
 */
@Service
@Transactional
public class HorarioAtencionService {

    private final HorarioAtencionRepository horarioRepository;

    public HorarioAtencionService(HorarioAtencionRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    @Transactional(readOnly = true)
    public List<HorarioAtencionDTO> listarActivos() {
        return horarioRepository.findByFechaHoraBajaHAIsNull()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HorarioAtencionDTO> listarTodos() {
        return horarioRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<HorarioAtencionDTO> obtenerPorId(Long id) {
        return horarioRepository.findByIdAndFechaHoraBajaHAIsNull(id)
                .map(this::convertirADTO);
    }

    public HorarioAtencionDTO guardar(HorarioAtencion horario) {
        HorarioAtencion guardado = horarioRepository.save(horario);
        return convertirADTO(guardado);
    }

    public boolean darDeBaja(Long id) {
        Optional<HorarioAtencion> opt = horarioRepository.findByIdAndFechaHoraBajaHAIsNull(id);
        if (opt.isPresent()) {
            HorarioAtencion ha = opt.get();
            ha.darDeBaja(new Date());
            horarioRepository.save(ha);
            return true;
        }
        return false;
    }

    public boolean reactivar(Long id) {
        Optional<HorarioAtencion> opt = horarioRepository.findById(id);
        if (opt.isPresent() && !opt.get().isActivo()) {
            HorarioAtencion ha = opt.get();
            ha.reactivar();
            horarioRepository.save(ha);
            return true;
        }
        return false;
    }

    public HorarioAtencionDTO convertirADTO(HorarioAtencion entity) {
        if (entity == null) return null;
        HorarioAtencionDTO dto = new HorarioAtencionDTO();
        dto.setId(entity.getId());
        dto.setCodHA(entity.getCodHA());
        dto.setDiasTextoHA(entity.getDiasTextoHA());
        dto.setDiasSemanaHA(entity.getDiasSemanaHA());
        dto.setNombreTurnoHA(entity.getNombreTurnoHA());
        dto.setHoraInicioHA(entity.getHoraInicioHA());
        dto.setHoraFinHA(entity.getHoraFinHA());
        dto.setDetallesHA(entity.getDetallesHA());
        dto.setEsCerradoHA(entity.getEsCerradoHA());
        dto.setActivo(entity.isActivo());
        dto.setFechaHoraBajaHA(entity.getFechaHoraBajaHA());
        return dto;
    }
}

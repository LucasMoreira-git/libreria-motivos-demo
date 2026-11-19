package com.libreriamotivos.service;

import com.libreriamotivos.dto.PromocionDTO;
import com.libreriamotivos.entity.Promocion;
import com.libreriamotivos.repository.PromocionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la gestión de Promociones de Librería Motivos.
 * Aplica bajas lógicas y propagación en cascada.
 */
@Service
@Transactional
public class PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionService(PromocionRepository promocionRepository) {
        this.promocionRepository = promocionRepository;
    }

    @Transactional(readOnly = true)
    public List<PromocionDTO> listarActivas() {
        return promocionRepository.findByFechaHoraBajaPromocionIsNull()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PromocionDTO> listarTodas() {
        return promocionRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<PromocionDTO> obtenerPorId(Long id) {
        return promocionRepository.findByIdAndFechaHoraBajaPromocionIsNull(id)
                .map(this::convertirADTO);
    }

    @Transactional(readOnly = true)
    public List<PromocionDTO> listarPorTemporada(String temporada) {
        return promocionRepository.findByTemporadaPromocionAndFechaHoraBajaPromocionIsNull(temporada)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public PromocionDTO guardar(Promocion promocion) {
        if (promocion.getId() != null) {
            Optional<Promocion> existente = promocionRepository.findById(promocion.getId());
            if (existente.isPresent()) {
                Promocion ex = existente.get();
                if (promocion.getCodPromocion() == null || promocion.getCodPromocion().isBlank()) {
                    promocion.setCodPromocion(ex.getCodPromocion());
                }
                if (promocion.getFechaHoraAltaPromocion() == null) {
                    promocion.setFechaHoraAltaPromocion(ex.getFechaHoraAltaPromocion());
                }
                if (promocion.getFechaHoraBajaPromocion() == null) {
                    promocion.setFechaHoraBajaPromocion(ex.getFechaHoraBajaPromocion());
                }
            }
        }
        Promocion guardada = promocionRepository.save(promocion);
        return convertirADTO(guardada);
    }

    public boolean darDeBaja(Long id) {
        Optional<Promocion> opt = promocionRepository.findByIdAndFechaHoraBajaPromocionIsNull(id);
        if (opt.isPresent()) {
            Promocion promo = opt.get();
            promo.darDeBaja(new Date());
            promocionRepository.save(promo);
            return true;
        }
        return false;
    }

    public boolean reactivar(Long id) {
        Optional<Promocion> opt = promocionRepository.findById(id);
        if (opt.isPresent() && !opt.get().isActivo()) {
            Promocion promo = opt.get();
            promo.reactivar();
            promocionRepository.save(promo);
            return true;
        }
        return false;
    }

    public PromocionDTO convertirADTO(Promocion entity) {
        if (entity == null) return null;
        PromocionDTO dto = new PromocionDTO();
        dto.setId(entity.getId());
        dto.setCodPromocion(entity.getCodPromocion());
        dto.setNombrePromocion(entity.getNombrePromocion());
        dto.setDetallePromocion(entity.getDetallePromocion());
        dto.setTemporadaPromocion(entity.getTemporadaPromocion());
        dto.setFechaInicioPromocion(entity.getFechaInicioPromocion());
        dto.setFechaFinPromocion(entity.getFechaFinPromocion());
        dto.setDescuentoTexto(entity.getDescuentoTexto());
        dto.setFotoCombo(entity.getFotoCombo());
        dto.setCondicionPromocion(entity.getCondicionPromocion());
        dto.setActivo(entity.isActivo());
        dto.setFechaHoraBajaPromocion(entity.getFechaHoraBajaPromocion());
        if (entity.getProductos() != null) {
            long activos = entity.getProductos().stream().filter(p -> p.getFechaHoraBajaProducto() == null).count();
            dto.setCantidadProductos((int) activos);
        } else {
            dto.setCantidadProductos(0);
        }
        return dto;
    }
}

package com.libreriamotivos.service;

import com.libreriamotivos.dto.TipoCategoriaDTO;
import com.libreriamotivos.entity.TipoCategoria;
import com.libreriamotivos.repository.TipoCategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la gestión de TipoCategoria.
 * Aplica reglas de bajas lógicas y propagación en cascada a Producto.
 */
@Service
@Transactional
public class TipoCategoriaService {

    private final TipoCategoriaRepository categoriaRepository;

    public TipoCategoriaService(TipoCategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<TipoCategoriaDTO> listarActivas() {
        return categoriaRepository.findByFechaHoraBajaTCIsNullOrderByOrdenCategoriaAsc()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<TipoCategoriaDTO> obtenerPorId(Long id) {
        return categoriaRepository.findByIdAndFechaHoraBajaTCIsNull(id)
                .map(this::convertirADTO);
    }

    @Transactional(readOnly = true)
    public Optional<TipoCategoriaDTO> obtenerPorSlug(String slug) {
        return categoriaRepository.findBySlugCategoriaAndFechaHoraBajaTCIsNull(slug)
                .map(this::convertirADTO);
    }

    public TipoCategoriaDTO guardar(TipoCategoria categoria) {
        TipoCategoria guardada = categoriaRepository.save(categoria);
        return convertirADTO(guardada);
    }

    /**
     * Baja lógica de la categoría: propaga automáticamente fechaHoraBaja a todos sus productos dependientes.
     */
    public boolean darDeBaja(Long id) {
        Optional<TipoCategoria> opt = categoriaRepository.findByIdAndFechaHoraBajaTCIsNull(id);
        if (opt.isPresent()) {
            TipoCategoria cat = opt.get();
            cat.darDeBaja(new Date());
            categoriaRepository.save(cat);
            return true;
        }
        return false;
    }

    /**
     * Reactivación de una categoría dada de baja.
     */
    public boolean reactivar(Long id) {
        Optional<TipoCategoria> opt = categoriaRepository.findById(id);
        if (opt.isPresent() && !opt.get().isActivo()) {
            TipoCategoria cat = opt.get();
            cat.reactivar();
            categoriaRepository.save(cat);
            return true;
        }
        return false;
    }

    public TipoCategoriaDTO convertirADTO(TipoCategoria entity) {
        if (entity == null) return null;
        TipoCategoriaDTO dto = new TipoCategoriaDTO();
        dto.setId(entity.getId());
        dto.setCodTC(entity.getCodTC());
        dto.setNombreTC(entity.getNombreTC());
        dto.setSlugCategoria(entity.getSlugCategoria());
        dto.setIconoCategoria(entity.getIconoCategoria());
        dto.setDescripcionTC(entity.getDescripcionTC());
        dto.setOrdenCategoria(entity.getOrdenCategoria());
        dto.setActivo(entity.isActivo());
        if (entity.getProductos() != null) {
            long activos = entity.getProductos().stream().filter(p -> p.getFechaHoraBajaProducto() == null).count();
            dto.setCantidadProductos((int) activos);
        } else {
            dto.setCantidadProductos(0);
        }
        return dto;
    }
}

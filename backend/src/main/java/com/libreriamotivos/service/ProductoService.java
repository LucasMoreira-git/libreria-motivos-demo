package com.libreriamotivos.service;

import com.libreriamotivos.dto.ProductoDTO;
import com.libreriamotivos.entity.Producto;
import com.libreriamotivos.entity.Promocion;
import com.libreriamotivos.entity.TipoCategoria;
import com.libreriamotivos.repository.ProductoRepository;
import com.libreriamotivos.repository.PromocionRepository;
import com.libreriamotivos.repository.TipoCategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de negocio para la gestión de Productos de Librería Motivos.
 * Aplica reglas estrictas de bajas lógicas y validaciones de dominio.
 */
@Service
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final TipoCategoriaRepository categoriaRepository;
    private final PromocionRepository promocionRepository;

    public ProductoService(ProductoRepository productoRepository,
                           TipoCategoriaRepository categoriaRepository,
                           PromocionRepository promocionRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.promocionRepository = promocionRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarActivos() {
        return productoRepository.findByFechaHoraBajaProductoIsNull()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarTodos() {
        return productoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductoDTO> obtenerPorId(Long id) {
        return productoRepository.findByIdAndFechaHoraBajaProductoIsNull(id)
                .map(this::convertirADTO);
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByTipoCategoriaIdAndFechaHoraBajaProductoIsNull(categoriaId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarPorPromocion(Long promocionId) {
        return productoRepository.findByPromocionIdAndFechaHoraBajaProductoIsNull(promocionId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarDestacados() {
        return productoRepository.findByDestacadoProductoTrueAndFechaHoraBajaProductoIsNull()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> buscarPorNombre(String query) {
        return productoRepository.findByNombreProductoContainingIgnoreCaseAndFechaHoraBajaProductoIsNull(query)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO guardar(Producto producto, Long categoriaId, Long promocionId) {
        if (categoriaId != null) {
            Optional<TipoCategoria> cat = categoriaRepository.findByIdAndFechaHoraBajaTCIsNull(categoriaId);
            cat.ifPresent(producto::setTipoCategoria);
        }
        if (promocionId != null) {
            Optional<Promocion> promo = promocionRepository.findByIdAndFechaHoraBajaPromocionIsNull(promocionId);
            promo.ifPresent(producto::setPromocion);
        }
        if (producto.getId() != null) {
            Optional<Producto> existente = productoRepository.findById(producto.getId());
            if (existente.isPresent()) {
                Producto ex = existente.get();
                if (producto.getFechaHoraAltaProducto() == null) {
                    producto.setFechaHoraAltaProducto(ex.getFechaHoraAltaProducto());
                }
                if (producto.getFechaHoraBajaProducto() == null) {
                    producto.setFechaHoraBajaProducto(ex.getFechaHoraBajaProducto());
                }
            }
        }
        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }

    public ProductoDTO guardar(Producto producto) {
        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }

    public boolean darDeBaja(Long id) {
        Optional<Producto> opt = productoRepository.findByIdAndFechaHoraBajaProductoIsNull(id);
        if (opt.isPresent()) {
            Producto prod = opt.get();
            prod.darDeBaja(new Date());
            productoRepository.save(prod);
            return true;
        }
        return false;
    }

    public boolean reactivar(Long id) {
        Optional<Producto> opt = productoRepository.findById(id);
        if (opt.isPresent() && !opt.get().isActivo()) {
            Producto prod = opt.get();
            prod.reactivar();
            productoRepository.save(prod);
            return true;
        }
        return false;
    }

    public ProductoDTO convertirADTO(Producto entity) {
        if (entity == null) return null;
        ProductoDTO dto = new ProductoDTO();
        dto.setId(entity.getId());
        dto.setCodigoProducto(entity.getCodigoProducto());
        dto.setNombreProducto(entity.getNombreProducto());
        dto.setDetalleProducto(entity.getDetalleProducto());
        dto.setPrecioProducto(entity.getPrecioProducto());
        dto.setPrecioDescuentoProducto(entity.getPrecioDescuentoProducto());
        dto.setFechaFinDescuento(entity.getFechaFinDescuento());
        dto.setUltimasUnidadesProducto(entity.getUltimasUnidadesProducto());
        dto.setNuevoIngresoProducto(entity.getNuevoIngresoProducto());
        dto.setFotoProducto(entity.getFotoProducto());
        dto.setDestacadoProducto(entity.getDestacadoProducto());
        dto.setBadgeProducto(entity.getBadgeProducto());
        dto.setIconoProducto(entity.getIconoProducto());
        dto.setActivo(entity.isActivo());
        dto.setFechaHoraAltaProducto(entity.getFechaHoraAltaProducto());
        dto.setFechaHoraBajaProducto(entity.getFechaHoraBajaProducto());

        // Lógica de Descuento Vigente
        boolean tieneDescuento = entity.tieneDescuentoVigente();
        dto.setTieneDescuentoVigente(tieneDescuento);
        if (tieneDescuento) {
            dto.setPrecioEfectivo(entity.getPrecioDescuentoProducto());
            dto.setPrecioAnteriorProducto(entity.getPrecioProducto());
            dto.setEnOfertaProducto(true);
        } else {
            dto.setPrecioEfectivo(entity.getPrecioProducto());
            dto.setPrecioAnteriorProducto(entity.getPrecioAnteriorProducto());
            dto.setEnOfertaProducto(entity.getEnOfertaProducto() != null ? entity.getEnOfertaProducto() : false);
        }

        if (entity.getTipoCategoria() != null) {
            dto.setTipoCategoriaId(entity.getTipoCategoria().getId());
            dto.setTipoCategoriaNombre(entity.getTipoCategoria().getNombreTC());
        }
        if (entity.getPromocion() != null) {
            dto.setPromocionId(entity.getPromocion().getId());
            dto.setPromocionNombre(entity.getPromocion().getNombrePromocion());
        }
        return dto;
    }
}

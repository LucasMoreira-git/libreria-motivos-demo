package com.libreriamotivos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.Objects;

/**
 * Entidad Producto: Representa los artículos físicos comercializados por Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Mapea precioProducto a Double, fechas a Date (java.util.Date) y relaciones bidireccionales con TipoCategoria y Promocion.
 */
@Entity
@Table(name = "productos")
@Getter
@Setter
@ToString(exclude = {"tipoCategoria", "promocion"})
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_producto", length = 50)
    private String codigoProducto;

    @Column(name = "nombre_producto", nullable = false, length = 150)
    private String nombreProducto;

    @Column(name = "detalle_producto", columnDefinition = "TEXT")
    private String detalleProducto;

    @Column(name = "precio_producto", nullable = false)
    private Double precioProducto;

    @Column(name = "precio_descuento_producto")
    private Double precioDescuentoProducto;

    @Column(name = "precio_anterior_producto")
    private Double precioAnteriorProducto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_fin_descuento")
    private Date fechaFinDescuento;

    @Column(name = "foto_producto", columnDefinition = "LONGTEXT")
    private String fotoProducto;

    @Column(name = "destacado_producto", nullable = false)
    private Boolean destacadoProducto = false;

    @Column(name = "en_oferta_producto", nullable = false)
    private Boolean enOfertaProducto = false;

    @Column(name = "ultimas_unidades_producto", nullable = false)
    private Boolean ultimasUnidadesProducto = false;

    @Column(name = "nuevo_ingreso_producto", nullable = false)
    private Boolean nuevoIngresoProducto = false;

    @Column(name = "badge_producto", length = 50)
    private String badgeProducto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_alta_producto")
    private Date fechaHoraAltaProducto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_producto")
    private Date fechaHoraBajaProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_categoria_id")
    private TipoCategoria tipoCategoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promocion_id")
    private Promocion promocion;

    // Constructores
    public Producto() {
        this.fechaHoraAltaProducto = new Date();
    }

    public Producto(Long id, String nombreProducto, Double precioProducto, TipoCategoria tipoCategoria) {
        this.id = id;
        this.nombreProducto = nombreProducto;
        this.precioProducto = precioProducto;
        this.tipoCategoria = tipoCategoria;
        this.fechaHoraAltaProducto = new Date();
        this.destacadoProducto = false;
        this.enOfertaProducto = false;
    }

    /**
     * Ciclo de vida JPA: Si se persiste un producto asociado a una categoría
     * que ya posee fechaHoraBajaTC, el producto hereda automáticamente la baja.
     */
    @PrePersist
    public void prePersist() {
        if (this.fechaHoraAltaProducto == null) {
            this.fechaHoraAltaProducto = new Date();
        }
        if (this.tipoCategoria != null && this.tipoCategoria.getFechaHoraBajaTC() != null) {
            if (this.fechaHoraBajaProducto == null) {
                this.fechaHoraBajaProducto = this.tipoCategoria.getFechaHoraBajaTC();
            }
        }
    }

    // Métodos de Dominio
    public void darDeBaja(Date fechaHora) {
        this.fechaHoraBajaProducto = (fechaHora != null) ? fechaHora : new Date();
    }

    public void darDeBaja() {
        darDeBaja(new Date());
    }

    public void reactivar() {
        this.fechaHoraBajaProducto = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaProducto == null;
    }

    /**
     * Evalúa si el producto posee un descuento especial vigente en el tiempo.
     * Si no tiene fecha límite o la fecha límite aún no expiró, el descuento es válido.
     */
    public boolean tieneDescuentoVigente() {
        if (precioDescuentoProducto == null || precioDescuentoProducto <= 0) {
            return false;
        }
        if (fechaFinDescuento == null) {
            return true;
        }
        return !fechaFinDescuento.before(new Date());
    }

    /**
     * Obtiene el precio efectivo a cobrar/mostrar al cliente:
     * Si el descuento sigue vigente, devuelve precioDescuentoProducto.
     * En caso contrario o si ya expiró, devuelve el precioProducto regular.
     */
    public Double getPrecioEfectivo() {
        if (tieneDescuentoVigente()) {
            return precioDescuentoProducto;
        }
        return precioProducto;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigoProducto() {
        return codigoProducto;
    }

    public void setCodigoProducto(String codigoProducto) {
        this.codigoProducto = codigoProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getDetalleProducto() {
        return detalleProducto;
    }

    public void setDetalleProducto(String detalleProducto) {
        this.detalleProducto = detalleProducto;
    }

    public Double getPrecioProducto() {
        return precioProducto;
    }

    public void setPrecioProducto(Double precioProducto) {
        this.precioProducto = precioProducto;
    }

    public Double getPrecioAnteriorProducto() {
        return precioAnteriorProducto;
    }

    public void setPrecioAnteriorProducto(Double precioAnteriorProducto) {
        this.precioAnteriorProducto = precioAnteriorProducto;
    }

    public String getFotoProducto() {
        return fotoProducto;
    }

    public void setFotoProducto(String fotoProducto) {
        this.fotoProducto = fotoProducto;
    }

    public Boolean getDestacadoProducto() {
        return destacadoProducto;
    }

    public void setDestacadoProducto(Boolean destacadoProducto) {
        this.destacadoProducto = destacadoProducto;
    }

    public Boolean getEnOfertaProducto() {
        return enOfertaProducto;
    }

    public void setEnOfertaProducto(Boolean enOfertaProducto) {
        this.enOfertaProducto = enOfertaProducto;
    }

    public String getBadgeProducto() {
        return badgeProducto;
    }

    public void setBadgeProducto(String badgeProducto) {
        this.badgeProducto = badgeProducto;
    }

    public Date getFechaHoraAltaProducto() {
        return fechaHoraAltaProducto;
    }

    public void setFechaHoraAltaProducto(Date fechaHoraAltaProducto) {
        this.fechaHoraAltaProducto = fechaHoraAltaProducto;
    }

    public Date getFechaHoraBajaProducto() {
        return fechaHoraBajaProducto;
    }

    public void setFechaHoraBajaProducto(Date fechaHoraBajaProducto) {
        this.fechaHoraBajaProducto = fechaHoraBajaProducto;
    }

    public TipoCategoria getTipoCategoria() {
        return tipoCategoria;
    }

    public void setTipoCategoria(TipoCategoria tipoCategoria) {
        this.tipoCategoria = tipoCategoria;
    }

    public Promocion getPromocion() {
        return promocion;
    }

    public void setPromocion(Promocion promocion) {
        this.promocion = promocion;
    }

    public Double getPrecioDescuentoProducto() {
        return precioDescuentoProducto;
    }

    public void setPrecioDescuentoProducto(Double precioDescuentoProducto) {
        this.precioDescuentoProducto = precioDescuentoProducto;
    }

    public Date getFechaFinDescuento() {
        return fechaFinDescuento;
    }

    public void setFechaFinDescuento(Date fechaFinDescuento) {
        this.fechaFinDescuento = fechaFinDescuento;
    }

    public Boolean getUltimasUnidadesProducto() {
        return ultimasUnidadesProducto;
    }

    public void setUltimasUnidadesProducto(Boolean ultimasUnidadesProducto) {
        this.ultimasUnidadesProducto = ultimasUnidadesProducto;
    }

    public Boolean getNuevoIngresoProducto() {
        return nuevoIngresoProducto;
    }

    public void setNuevoIngresoProducto(Boolean nuevoIngresoProducto) {
        this.nuevoIngresoProducto = nuevoIngresoProducto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Producto producto = (Producto) o;
        return Objects.equals(id, producto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Producto{" +
                "id=" + id +
                ", nombreProducto='" + nombreProducto + '\'' +
                ", precioProducto=" + precioProducto +
                ", activo=" + isActivo() +
                '}';
    }
}

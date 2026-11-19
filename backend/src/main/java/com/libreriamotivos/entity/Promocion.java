package com.libreriamotivos.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Entidad Promocion: Representa ofertas de temporada, combos escolares y descuentos comerciales de Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Se relaciona bidireccionalmente con Producto mediante @OneToMany y gestiona fechas con java.util.Date.
 */
@Entity
@Table(name = "promociones")
@Getter
@Setter
@ToString(exclude = "productos")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cod_promocion", length = 50)
    private String codPromocion;

    @Column(name = "nombre_promocion", nullable = false, length = 150)
    private String nombrePromocion;

    @Column(name = "detalle_promocion", columnDefinition = "TEXT")
    private String detallePromocion;

    @Column(name = "temporada_promocion", nullable = false, length = 100)
    private String temporadaPromocion;

    @Temporal(TemporalType.DATE)
    @Column(name = "fecha_inicio_promocion")
    private Date fechaInicioPromocion;

    @Temporal(TemporalType.DATE)
    @Column(name = "fecha_fin_promocion")
    private Date fechaFinPromocion;

    @Column(name = "descuento_texto", length = 50)
    private String descuentoTexto;

    @Column(name = "foto_combo", columnDefinition = "LONGTEXT")
    private String fotoCombo;

    @Column(name = "condicion_promocion", length = 200)
    private String condicionPromocion;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_alta_promocion")
    private Date fechaHoraAltaPromocion;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_promocion")
    private Date fechaHoraBajaPromocion;

    @OneToMany(mappedBy = "promocion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Producto> productos = new ArrayList<>();

    // Constructores
    public Promocion() {
        this.fechaHoraAltaPromocion = new Date();
    }

    public Promocion(Long id, String nombrePromocion, String temporadaPromocion) {
        this.id = id;
        this.nombrePromocion = nombrePromocion;
        this.temporadaPromocion = temporadaPromocion;
        this.fechaHoraAltaPromocion = new Date();
    }

    /**
     * Constructor completo usado por DataSimulationService para precarga inicial de datos.
     */
    public Promocion(Long id, String codPromocion, String nombrePromocion, String detallesPromocion,
                     String temporadaPromocion, Date fechaInicioPromocion, Date fechaFinPromocion,
                     String descuentoTexto, String fotoCombo, String condicionPromocion) {
        this.id = id;
        this.codPromocion = codPromocion;
        this.nombrePromocion = nombrePromocion;
        this.detallePromocion = detallesPromocion;
        this.temporadaPromocion = temporadaPromocion;
        this.fechaInicioPromocion = fechaInicioPromocion;
        this.fechaFinPromocion = fechaFinPromocion;
        this.descuentoTexto = descuentoTexto;
        this.fotoCombo = fotoCombo;
        this.condicionPromocion = condicionPromocion;
        this.fechaHoraAltaPromocion = new Date();
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaHoraAltaPromocion == null) {
            this.fechaHoraAltaPromocion = new Date();
        }
    }

    /**
     * Ciclo de vida JPA: Propagación de baja lógica en cascada a los productos vinculados a la promoción.
     */
    @PreUpdate
    public void propagarBajaLogica() {
        if (this.fechaHoraBajaPromocion != null && this.productos != null) {
            for (Producto prod : this.productos) {
                if (prod.getFechaHoraBajaProducto() == null) {
                    prod.setFechaHoraBajaProducto(this.fechaHoraBajaPromocion);
                }
            }
        }
    }

    // Métodos de Dominio
    public void darDeBaja(Date fechaHora) {
        this.fechaHoraBajaPromocion = (fechaHora != null) ? fechaHora : new Date();
        if (this.productos != null) {
            for (Producto prod : this.productos) {
                if (prod.getFechaHoraBajaProducto() == null) {
                    prod.setFechaHoraBajaProducto(this.fechaHoraBajaPromocion);
                }
            }
        }
    }

    public void darDeBaja() {
        darDeBaja(new Date());
    }

    public void reactivar() {
        this.fechaHoraBajaPromocion = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaPromocion == null;
    }

    // Sincronización de relación bidireccional
    public void addProducto(Producto producto) {
        if (this.productos == null) {
            this.productos = new ArrayList<>();
        }
        this.productos.add(producto);
        producto.setPromocion(this);
    }

    public void removeProducto(Producto producto) {
        if (this.productos != null) {
            this.productos.remove(producto);
            producto.setPromocion(null);
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodPromocion() {
        return codPromocion;
    }

    public void setCodPromocion(String codPromocion) {
        this.codPromocion = codPromocion;
    }

    public String getNombrePromocion() {
        return nombrePromocion;
    }

    public void setNombrePromocion(String nombrePromocion) {
        this.nombrePromocion = nombrePromocion;
    }

    public String getDetallePromocion() {
        return detallePromocion;
    }

    public void setDetallePromocion(String detallePromocion) {
        this.detallePromocion = detallePromocion;
    }

    public String getDetallesPromocion() {
        return detallePromocion;
    }

    public void setDetallesPromocion(String detallesPromocion) {
        this.detallePromocion = detallesPromocion;
    }

    public String getTemporadaPromocion() {
        return temporadaPromocion;
    }

    public void setTemporadaPromocion(String temporadaPromocion) {
        this.temporadaPromocion = temporadaPromocion;
    }

    public Date getFechaInicioPromocion() {
        return fechaInicioPromocion;
    }

    public void setFechaInicioPromocion(Date fechaInicioPromocion) {
        this.fechaInicioPromocion = fechaInicioPromocion;
    }

    public Date getFechaFinPromocion() {
        return fechaFinPromocion;
    }

    public void setFechaFinPromocion(Date fechaFinPromocion) {
        this.fechaFinPromocion = fechaFinPromocion;
    }

    public String getDescuentoTexto() {
        return descuentoTexto;
    }

    public void setDescuentoTexto(String descuentoTexto) {
        this.descuentoTexto = descuentoTexto;
    }

    public String getFotoCombo() {
        return fotoCombo;
    }

    public void setFotoCombo(String fotoCombo) {
        this.fotoCombo = fotoCombo;
    }

    public String getCondicionPromocion() {
        return condicionPromocion;
    }

    public void setCondicionPromocion(String condicionPromocion) {
        this.condicionPromocion = condicionPromocion;
    }

    public Date getFechaHoraAltaPromocion() {
        return fechaHoraAltaPromocion;
    }

    public void setFechaHoraAltaPromocion(Date fechaHoraAltaPromocion) {
        this.fechaHoraAltaPromocion = fechaHoraAltaPromocion;
    }

    public Date getFechaHoraBajaPromocion() {
        return fechaHoraBajaPromocion;
    }

    public void setFechaHoraBajaPromocion(Date fechaHoraBajaPromocion) {
        this.fechaHoraBajaPromocion = fechaHoraBajaPromocion;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Promocion promocion = (Promocion) o;
        return Objects.equals(id, promocion.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Promocion{" +
                "id=" + id +
                ", nombrePromocion='" + nombrePromocion + '\'' +
                ", temporadaPromocion='" + temporadaPromocion + '\'' +
                ", activo=" + isActivo() +
                '}';
    }
}

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Entidad TipoCategoria: Representa la clasificación de artículos del catálogo de Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Define fechaHoraBajaTC según el diagrama de dominio y propaga bajas lógicas en cascada a Producto.
 */
@Entity
@Table(name = "tipos_categoria")
@Getter
@Setter
@ToString(exclude = "productos")
public class TipoCategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cod_tc", length = 50)
    private String codTC;

    @Column(name = "nombre_tc", nullable = false, length = 100)
    private String nombreTC;

    @Column(name = "slug_categoria", nullable = false, unique = true, length = 100)
    private String slugCategoria;

    @Column(name = "icono_categoria", length = 50)
    private String iconoCategoria;

    @Column(name = "descripcion_tc", length = 500)
    private String descripcionTC;

    @Column(name = "orden_categoria")
    private Integer ordenCategoria;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_alta_tc")
    private Date fechaHoraAltaTC;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_tc")
    private Date fechaHoraBajaTC;

    @OneToMany(mappedBy = "tipoCategoria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Producto> productos = new ArrayList<>();

    // Constructores
    public TipoCategoria() {
        this.fechaHoraAltaTC = new Date();
    }

    public TipoCategoria(Long id, String nombreTC, String slugCategoria) {
        this.id = id;
        this.nombreTC = nombreTC;
        this.slugCategoria = slugCategoria;
        this.fechaHoraAltaTC = new Date();
    }

    /**
     * Constructor completo usado por DataSimulationService para precarga inicial de datos.
     */
    public TipoCategoria(Long id, String codTC, String nombreTC, String slugCategoria,
                         String iconoCategoria, String descripcionTC, Integer ordenCategoria) {
        this.id = id;
        this.codTC = codTC;
        this.nombreTC = nombreTC;
        this.slugCategoria = slugCategoria;
        this.iconoCategoria = iconoCategoria;
        this.descripcionTC = descripcionTC;
        this.ordenCategoria = ordenCategoria;
        this.fechaHoraAltaTC = new Date();
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaHoraAltaTC == null) {
            this.fechaHoraAltaTC = new Date();
        }
    }

    /**
     * Ciclo de vida JPA: Propagación de baja lógica en cascada a entidades hijas (Producto).
     */
    @PreUpdate
    public void propagarBajaLogica() {
        if (this.fechaHoraBajaTC != null && this.productos != null) {
            for (Producto prod : this.productos) {
                if (prod.getFechaHoraBajaProducto() == null) {
                    prod.setFechaHoraBajaProducto(this.fechaHoraBajaTC);
                }
            }
        }
    }

    // Métodos de Dominio
    public void darDeBaja(Date fechaHora) {
        this.fechaHoraBajaTC = (fechaHora != null) ? fechaHora : new Date();
        if (this.productos != null) {
            for (Producto prod : this.productos) {
                if (prod.getFechaHoraBajaProducto() == null) {
                    prod.setFechaHoraBajaProducto(this.fechaHoraBajaTC);
                }
            }
        }
    }

    public void darDeBaja() {
        darDeBaja(new Date());
    }

    public void reactivar() {
        this.fechaHoraBajaTC = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaTC == null;
    }

    // Sincronización de relación bidireccional
    public void addProducto(Producto producto) {
        if (this.productos == null) {
            this.productos = new ArrayList<>();
        }
        this.productos.add(producto);
        producto.setTipoCategoria(this);
    }

    public void removeProducto(Producto producto) {
        if (this.productos != null) {
            this.productos.remove(producto);
            producto.setTipoCategoria(null);
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodTC() {
        return codTC;
    }

    public void setCodTC(String codTC) {
        this.codTC = codTC;
    }

    public String getNombreTC() {
        return nombreTC;
    }

    public void setNombreTC(String nombreTC) {
        this.nombreTC = nombreTC;
    }

    public String getSlugCategoria() {
        return slugCategoria;
    }

    public void setSlugCategoria(String slugCategoria) {
        this.slugCategoria = slugCategoria;
    }

    public String getIconoCategoria() {
        return iconoCategoria;
    }

    public void setIconoCategoria(String iconoCategoria) {
        this.iconoCategoria = iconoCategoria;
    }

    public String getDescripcionTC() {
        return descripcionTC;
    }

    public void setDescripcionTC(String descripcionTC) {
        this.descripcionTC = descripcionTC;
    }

    public String getDetallesTC() {
        return descripcionTC;
    }

    public void setDetallesTC(String detallesTC) {
        this.descripcionTC = detallesTC;
    }

    public Integer getOrdenCategoria() {
        return ordenCategoria;
    }

    public void setOrdenCategoria(Integer ordenCategoria) {
        this.ordenCategoria = ordenCategoria;
    }

    public Date getFechaHoraAltaTC() {
        return fechaHoraAltaTC;
    }

    public void setFechaHoraAltaTC(Date fechaHoraAltaTC) {
        this.fechaHoraAltaTC = fechaHoraAltaTC;
    }

    public Date getFechaHoraBajaTC() {
        return fechaHoraBajaTC;
    }

    public void setFechaHoraBajaTC(Date fechaHoraBajaTC) {
        this.fechaHoraBajaTC = fechaHoraBajaTC;
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
        TipoCategoria that = (TipoCategoria) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TipoCategoria{" +
                "id=" + id +
                ", nombreTC='" + nombreTC + '\'' +
                ", slugCategoria='" + slugCategoria + '\'' +
                ", activo=" + isActivo() +
                '}';
    }
}

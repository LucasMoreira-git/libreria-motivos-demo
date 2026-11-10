package com.libreriamotivos.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Entidad TipoCategoria: Representa la clasificación de artículos del catálogo de Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Define fechaHoraBajaTC según el diagrama de dominio y propaga bajas lógicas en cascada a Producto.
 */
@Entity
@Table(name = "tipos_categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = "productos")
public class TipoCategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    @Column(name = "fecha_hora_baja_tc")
    private Date fechaHoraBajaTC;

    @OneToMany(mappedBy = "tipoCategoria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Producto> productos = new ArrayList<>();

    /**
     * Ciclo de vida JPA: Propagación de baja lógica en cascada a entidades hijas (Producto).
     * Dado que JPA no propaga nativamente cascadas en operaciones UPDATE (bajas lógicas),
     * este hook intercepta la actualización: si la categoría tiene asignada una fechaHoraBajaTC,
     * se invoca getFechaHoraBajaTC() y se actualiza automáticamente fechaHoraBajaProducto en todos sus productos activos.
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

    /**
     * Método de dominio para dar de baja lógica la categoría y sus productos asociados.
     */
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

    /**
     * Reactivación de la categoría.
     */
    public void reactivar() {
        this.fechaHoraBajaTC = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaTC == null;
    }

    // Métodos alias para asegurar compatibilidad total con vistas o referencias anteriores
    public String getNombreCategoria() {
        return this.nombreTC;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreTC = nombreCategoria;
    }

    public String getDescripcionCategoria() {
        return this.descripcionTC;
    }

    public void setDescripcionCategoria(String descripcionCategoria) {
        this.descripcionTC = descripcionCategoria;
    }

    public Date getFechaHoraBajaTC() {
        return this.fechaHoraBajaTC;
    }
        
    public void setFechaHoraBajaTipoCategoria(Date fechaHoraBajaCategoria) {
        this.fechaHoraBajaTC = fechaHoraBajaCategoria;
    }

    // Métodos de ayuda para sincronización de relación bidireccional
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
}

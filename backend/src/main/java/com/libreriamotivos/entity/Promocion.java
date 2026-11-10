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
 * Entidad Promocion: Representa ofertas de temporada, combos escolares y descuentos comerciales de Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Se relaciona bidireccionalmente con Producto mediante @OneToMany y gestiona fechas con java.util.Date.
 */
@Entity
@Table(name = "promociones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = "productos")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_fin_promocion")
    private Date fechaHoraFinPromocion;

    @Column(name = "descuento_texto_promocion", length = 100)
    private String descuentoTextoPromocion;

    @Column(name = "condicion_promocion", length = 255)
    private String condicionPromocion;

    @Column(name = "badge_texto_promocion", length = 50)
    private String badgeTextoPromocion;

    @Column(name = "foto_combo_promocion", length = 500)
    private String fotoComboPromocion;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_promocion")
    private Date fechaHoraBajaPromocion;

    @OneToMany(mappedBy = "promocion", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Producto> productos = new ArrayList<>();

    /**
     * Interceptor de ciclo de vida JPA: Propagación de baja lógica si la promoción es dada de baja.
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

    /**
     * Método de dominio para registrar la baja lógica de la promoción y sincronizar productos.
     */
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

    /**
     * Reactivación de la promoción.
     */
    public void reactivar() {
        this.fechaHoraBajaPromocion = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaPromocion == null;
    }

    // Métodos de sincronización bidireccional con Producto (Lombok genera setPromocion en Producto)
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
}

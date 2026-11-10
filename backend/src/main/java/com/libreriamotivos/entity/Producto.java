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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * Entidad Producto: Representa los artículos físicos comercializados por Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Mapea precioProducto a Double, fechas a Date (java.util.Date) y relaciones bidireccionales con TipoCategoria y Promocion.
 */
@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"tipoCategoria", "promocion"})
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_producto", nullable = false, length = 150)
    private String nombreProducto;

    @Column(name = "detalle_producto", columnDefinition = "TEXT")
    private String detalleProducto;

    @Column(name = "precio_producto", nullable = false)
    private Double precioProducto;

    @Column(name = "foto_producto", length = 500)
    private String fotoProducto;

    @Column(name = "destacado_producto", nullable = false)
    @Builder.Default
    private Boolean destacadoProducto = false;

    @Column(name = "en_oferta_producto", nullable = false)
    @Builder.Default
    private Boolean enOfertaProducto = false;

    @Column(name = "badge_producto", length = 50)
    private String badgeProducto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_producto")
    private Date fechaHoraBajaProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_categoria_id")
    private TipoCategoria tipoCategoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promocion_id")
    private Promocion promocion;

    /**
     * Ciclo de vida JPA: Si se persiste un producto asociado a una categoría
     * que ya posee fechaHoraBajaTC, el producto hereda automáticamente la baja.
     * Invoca estrictamente getFechaHoraBajaTC() generado por Lombok en TipoCategoria.
     */
    @PrePersist
    public void heredarBajaDeCategoria() {
        if (this.tipoCategoria != null && this.tipoCategoria.getFechaHoraBajaTC() != null) {
            if (this.fechaHoraBajaProducto == null) {
                this.fechaHoraBajaProducto = this.tipoCategoria.getFechaHoraBajaTC();
            }
        }
    }

    /**
     * Método de dominio para registrar la baja lógica del producto individual.
     */
    public void darDeBaja(Date fechaHora) {
        this.fechaHoraBajaProducto = (fechaHora != null) ? fechaHora : new Date();
    }

    public void darDeBaja() {
        darDeBaja(new Date());
    }

    /**
     * Método de dominio para reactivar el producto.
     */
    public void reactivar() {
        this.fechaHoraBajaProducto = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaProducto == null;
    }
}

package com.libreriamotivos.dto;

import java.util.Date;

/**
 * DTO para la transferencia de datos de Promocion.
 */
public class PromocionDTO {

    private Long id;
    private String codPromocion;
    private String nombrePromocion;
    private String detallePromocion;
    private String temporadaPromocion;
    private Date fechaInicioPromocion;
    private Date fechaFinPromocion;
    private String descuentoTexto;
    private String fotoCombo;
    private String condicionPromocion;
    private boolean activo;
    private int cantidadProductos;

    public PromocionDTO() {}

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

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public int getCantidadProductos() {
        return cantidadProductos;
    }

    public void setCantidadProductos(int cantidadProductos) {
        this.cantidadProductos = cantidadProductos;
    }
}

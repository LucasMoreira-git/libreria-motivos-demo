package com.libreriamotivos.dto;

import java.util.Date;

/**
 * DTO para la transferencia de datos de Producto hacia el cliente API / Frontend.
 */
public class ProductoDTO {

    private Long id;
    private String codigoProducto;
    private String nombreProducto;
    private String detalleProducto;
    private Double precioProducto;
    private Double precioAnteriorProducto;
    private String fotoProducto;
    private Boolean destacadoProducto;
    private Boolean enOfertaProducto;
    private String badgeProducto;
    private Long tipoCategoriaId;
    private String tipoCategoriaNombre;
    private Long promocionId;
    private String promocionNombre;
    private boolean activo;
    private Date fechaHoraAltaProducto;
    private Date fechaHoraBajaProducto;

    public ProductoDTO() {}

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

    public Long getTipoCategoriaId() {
        return tipoCategoriaId;
    }

    public void setTipoCategoriaId(Long tipoCategoriaId) {
        this.tipoCategoriaId = tipoCategoriaId;
    }

    public String getTipoCategoriaNombre() {
        return tipoCategoriaNombre;
    }

    public void setTipoCategoriaNombre(String tipoCategoriaNombre) {
        this.tipoCategoriaNombre = tipoCategoriaNombre;
    }

    public Long getPromocionId() {
        return promocionId;
    }

    public void setPromocionId(Long promocionId) {
        this.promocionId = promocionId;
    }

    public String getPromocionNombre() {
        return promocionNombre;
    }

    public void setPromocionNombre(String promocionNombre) {
        this.promocionNombre = promocionNombre;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
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
}

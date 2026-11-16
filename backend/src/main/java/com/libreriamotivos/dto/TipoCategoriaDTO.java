package com.libreriamotivos.dto;

/**
 * DTO para la transferencia de datos de TipoCategoria.
 */
public class TipoCategoriaDTO {

    private Long id;
    private String codTC;
    private String nombreTC;
    private String slugCategoria;
    private String iconoCategoria;
    private String descripcionTC;
    private Integer ordenCategoria;
    private boolean activo;
    private int cantidadProductos;

    public TipoCategoriaDTO() {}

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

    public Integer getOrdenCategoria() {
        return ordenCategoria;
    }

    public void setOrdenCategoria(Integer ordenCategoria) {
        this.ordenCategoria = ordenCategoria;
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

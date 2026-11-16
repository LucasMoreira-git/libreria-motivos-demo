package com.libreriamotivos.dto;

import java.time.LocalTime;

/**
 * DTO para la transferencia de datos de HorarioAtencion.
 */
public class HorarioAtencionDTO {

    private Long id;
    private String codHA;
    private String diasTextoHA;
    private String diasSemanaHA;
    private String nombreTurnoHA;
    private LocalTime horaInicioHA;
    private LocalTime horaFinHA;
    private String detallesHA;
    private Boolean esCerradoHA;
    private boolean activo;

    public HorarioAtencionDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodHA() {
        return codHA;
    }

    public void setCodHA(String codHA) {
        this.codHA = codHA;
    }

    public String getDiasTextoHA() {
        return diasTextoHA;
    }

    public void setDiasTextoHA(String diasTextoHA) {
        this.diasTextoHA = diasTextoHA;
    }

    public String getDiasSemanaHA() {
        return diasSemanaHA;
    }

    public void setDiasSemanaHA(String diasSemanaHA) {
        this.diasSemanaHA = diasSemanaHA;
    }

    public String getNombreTurnoHA() {
        return nombreTurnoHA;
    }

    public void setNombreTurnoHA(String nombreTurnoHA) {
        this.nombreTurnoHA = nombreTurnoHA;
    }

    public LocalTime getHoraInicioHA() {
        return horaInicioHA;
    }

    public void setHoraInicioHA(LocalTime horaInicioHA) {
        this.horaInicioHA = horaInicioHA;
    }

    public LocalTime getHoraFinHA() {
        return horaFinHA;
    }

    public void setHoraFinHA(LocalTime horaFinHA) {
        this.horaFinHA = horaFinHA;
    }

    public String getDetallesHA() {
        return detallesHA;
    }

    public void setDetallesHA(String detallesHA) {
        this.detallesHA = detallesHA;
    }

    public Boolean getEsCerradoHA() {
        return esCerradoHA;
    }

    public void setEsCerradoHA(Boolean esCerradoHA) {
        this.esCerradoHA = esCerradoHA;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}

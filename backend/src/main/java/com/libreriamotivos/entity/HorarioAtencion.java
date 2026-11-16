package com.libreriamotivos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalTime;
import java.util.Date;
import java.util.Objects;

/**
 * Entidad HorarioAtencion: Representa los turnos comerciales y de atención al público de Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Mapea horaInicioHA y horaFinHA a LocalTime, y fechaHoraBajaHA a Date (java.util.Date).
 */
@Entity
@Table(name = "horarios_atencion")
@Getter
@Setter
@ToString
public class HorarioAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cod_ha", length = 50)
    private String codHA;

    @Column(name = "dias_texto_ha", nullable = false, length = 100)
    private String diasTextoHA;

    @Column(name = "dias_semana_ha", length = 50)
    private String diasSemanaHA;

    @Column(name = "nombre_turno_ha", nullable = false, length = 100)
    private String nombreTurnoHA;

    @Column(name = "hora_inicio_ha")
    private LocalTime horaInicioHA;

    @Column(name = "hora_fin_ha")
    private LocalTime horaFinHA;

    @Column(name = "detalles_ha", length = 250)
    private String detallesHA;

    @Column(name = "es_cerrado_ha", nullable = false)
    private Boolean esCerradoHA = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_alta_ha")
    private Date fechaHoraAltaHA;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_ha")
    private Date fechaHoraBajaHA;

    // Constructores
    public HorarioAtencion() {
        this.fechaHoraAltaHA = new Date();
        this.esCerradoHA = false;
    }

    public HorarioAtencion(Long id, String diasTextoHA, String nombreTurnoHA, LocalTime horaInicioHA, LocalTime horaFinHA) {
        this.id = id;
        this.diasTextoHA = diasTextoHA;
        this.nombreTurnoHA = nombreTurnoHA;
        this.horaInicioHA = horaInicioHA;
        this.horaFinHA = horaFinHA;
        this.esCerradoHA = false;
        this.fechaHoraAltaHA = new Date();
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaHoraAltaHA == null) {
            this.fechaHoraAltaHA = new Date();
        }
    }

    // Métodos de Dominio
    public void darDeBaja(Date fechaHora) {
        this.fechaHoraBajaHA = (fechaHora != null) ? fechaHora : new Date();
    }

    public void darDeBaja() {
        darDeBaja(new Date());
    }

    public void reactivar() {
        this.fechaHoraBajaHA = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaHA == null;
    }

    // Getters y Setters
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

    public String getDiaSemanaHA() {
        return diasSemanaHA;
    }

    public void setDiaSemanaHA(String diaSemanaHA) {
        this.diasSemanaHA = diaSemanaHA;
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

    public Date getFechaHoraAltaHA() {
        return fechaHoraAltaHA;
    }

    public void setFechaHoraAltaHA(Date fechaHoraAltaHA) {
        this.fechaHoraAltaHA = fechaHoraAltaHA;
    }

    public Date getFechaHoraBajaHA() {
        return fechaHoraBajaHA;
    }

    public void setFechaHoraBajaHA(Date fechaHoraBajaHA) {
        this.fechaHoraBajaHA = fechaHoraBajaHA;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HorarioAtencion that = (HorarioAtencion) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "HorarioAtencion{" +
                "id=" + id +
                ", nombreTurnoHA='" + nombreTurnoHA + '\'' +
                ", horario=" + horaInicioHA + " - " + horaFinHA +
                ", activo=" + isActivo() +
                '}';
    }
}

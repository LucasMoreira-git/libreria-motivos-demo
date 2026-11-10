package com.libreriamotivos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

import java.time.LocalTime;
import java.util.Date;

/**
 * Entidad HorarioAtencion: Representa los turnos comerciales y de atención al público de Librería Motivos.
 * Normalización de clave primaria mediante 'id' unificado (Long AUTO_INCREMENT).
 * Mapea horaInicioHA y horaFinHA a LocalTime, y fechaHoraBajaHA a Date (java.util.Date).
 */
@Entity
@Table(name = "horarios_atencion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString
public class HorarioAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dias_texto_ha", nullable = false, length = 100)
    private String diasTextoHA;

    @Column(name = "dias_semana_ha", length = 50)
    private String diasSemanaHA;

    @Column(name = "nombre_turno_ha", nullable = false, length = 100)
    private String nombreTurnoHA;

    @Column(name = "hora_inicio_ha", nullable = false)
    private LocalTime horaInicioHA;

    @Column(name = "hora_fin_ha", nullable = false)
    private LocalTime horaFinHA;

    @Column(name = "es_cerrado_ha", nullable = false)
    @Builder.Default
    private Boolean esCerradoHA = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_hora_baja_ha")
    private Date fechaHoraBajaHA;

    /**
     * Método de dominio para registrar la baja lógica del turno de atención.
     */
    public void darDeBaja(Date fechaHora) {
        this.fechaHoraBajaHA = (fechaHora != null) ? fechaHora : new Date();
    }

    public void darDeBaja() {
        darDeBaja(new Date());
    }

    /**
     * Reactivación del turno de atención.
     */
    public void reactivar() {
        this.fechaHoraBajaHA = null;
    }

    public boolean isActivo() {
        return this.fechaHoraBajaHA == null;
    }
}

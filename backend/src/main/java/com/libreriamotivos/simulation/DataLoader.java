package com.libreriamotivos.simulation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Runner de arranque para la precarga automática de la simulación de datos.
 * Se activa si app.simulation.seed-on-startup=true en application.properties.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final DataSimulationService simulationService;

    @Value("${app.simulation.seed-on-startup:true}")
    private boolean seedOnStartup;

    public DataLoader(DataSimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @Override
    public void run(String... args) {
        if (seedOnStartup) {
            log.info("Inicializando precarga de datos de simulación para Librería Motivos...");
            try {
                simulationService.ejecutarSimulacion(false);
            } catch (Exception e) {
                log.warn("Precarga inicial omitida o no requerida: {}", e.getMessage());
            }
        }
    }
}

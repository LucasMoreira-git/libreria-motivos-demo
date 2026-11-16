package com.libreriamotivos.simulation;

import com.libreriamotivos.entity.HorarioAtencion;
import com.libreriamotivos.entity.Producto;
import com.libreriamotivos.entity.Promocion;
import com.libreriamotivos.entity.TipoCategoria;
import com.libreriamotivos.repository.HorarioAtencionRepository;
import com.libreriamotivos.repository.ProductoRepository;
import com.libreriamotivos.repository.PromocionRepository;
import com.libreriamotivos.repository.TipoCategoriaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;

/**
 * Servicio de Simulación y Precarga de Datos de Librería Motivos.
 * Genera el catálogo inicial realista (útiles escolares, dibujo técnico, oficina, horarios y promociones).
 */
@Service
@Transactional
public class DataSimulationService {

    private static final Logger log = LoggerFactory.getLogger(DataSimulationService.class);

    private final TipoCategoriaRepository categoriaRepository;
    private final PromocionRepository promocionRepository;
    private final HorarioAtencionRepository horarioRepository;
    private final ProductoRepository productoRepository;

    public DataSimulationService(TipoCategoriaRepository categoriaRepository,
                                 PromocionRepository promocionRepository,
                                 HorarioAtencionRepository horarioRepository,
                                 ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.promocionRepository = promocionRepository;
        this.horarioRepository = horarioRepository;
        this.productoRepository = productoRepository;
    }

    /**
     * Ejecuta la simulación de datos inicial si no existen registros o si se solicita forzarla.
     */
    public synchronized Map<String, Object> ejecutarSimulacion(boolean forzar) {
        long catCount = categoriaRepository.count();
        if (!forzar && catCount > 0) {
            log.info("La base de datos ya contiene datos precargados ({} categorías encontradas). Se omite la simulación inicial.", catCount);
            return obtenerResumenSimulacion();
        }

        log.info("=== INICIANDO SIMULACIÓN DE DATOS PARA LIBRERÍA MOTIVOS ===");

        // 1. Sembrar Categorías
        TipoCategoria catEscolar = new TipoCategoria(
                null, "CAT-ESC", "Escolar", "escolar", "BookOpen",
                "Útiles escolares, cartucheras, cuadernos y carpetas para todos los niveles escolares.", 1
        );
        TipoCategoria catOficina = new TipoCategoria(
                null, "CAT-OFI", "Oficina y Comercial", "oficina", "Briefcase",
                "Papelería comercial, resmas, biblioratos y suministros para comercios y oficinas.", 2
        );
        TipoCategoria catArte = new TipoCategoria(
                null, "CAT-ART", "Arte y Manualidades", "arte", "Palette",
                "Pinturas acrílicas, bastidores, pinceles y porcelana para crear sin límites.", 3
        );
        TipoCategoria catRegaleria = new TipoCategoria(
                null, "CAT-REG", "Regalería y Didácticos", "regaleria", "Gift",
                "Mochilas urbanas, botellas térmicas, juegos didácticos y regalos especiales.", 4
        );
        TipoCategoria catDibujoTecnico = new TipoCategoria(
                null, "CAT-TEC", "Dibujo Técnico", "dibujo-tecnico", "Ruler",
                "Instrumentos de precisión, tableros y estilógrafos para arquitectura e ingeniería.", 5
        );

        catEscolar = categoriaRepository.save(catEscolar);
        catOficina = categoriaRepository.save(catOficina);
        catArte = categoriaRepository.save(catArte);
        catRegaleria = categoriaRepository.save(catRegaleria);
        catDibujoTecnico = categoriaRepository.save(catDibujoTecnico);

        log.info("✓ 5 Categorías precargadas");

        // 2. Sembrar Promociones
        Calendar cal = Calendar.getInstance();
        Date ahora = cal.getTime();
        cal.add(Calendar.MONTH, 3);
        Date finPromo = cal.getTime();

        Promocion promoVueltaClases = new Promocion(
                null, "PROMO-VUELTA-CLASES", "Vuelta a Clases 2026",
                "15% de descuento en el armado de listas escolares completas abonando en efectivo o transferencia.",
                "Temporada Escolar", ahora, finPromo, "15% OFF Lista Completa",
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
                "Abonando en efectivo o transferencia bancaria"
        );

        Promocion promoArteCreativo = new Promocion(
                null, "PROMO-ARTE-CREATIVO", "Kit Artístico Creativo",
                "20% de descuento en sets seleccionados de acrílicos y pinceles profesionales.",
                "Arte y Diseño", ahora, finPromo, "20% OFF en Pinturas",
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
                "Válido durante el mes en curso en el local"
        );

        promoVueltaClases = promocionRepository.save(promoVueltaClases);
        promoArteCreativo = promocionRepository.save(promoArteCreativo);

        log.info("✓ 2 Promociones de temporada precargadas");

        // 3. Sembrar Horarios de Atención (Guaymallén, Mendoza)
        HorarioAtencion haManana = new HorarioAtencion(
                null, "Lunes a Viernes", "Turno Mañana",
                LocalTime.of(9, 30), LocalTime.of(13, 30)
        );
        haManana.setCodHA("HA-LV-MANANA");
        haManana.setDiasSemanaHA("Lunes a Viernes");
        haManana.setDetallesHA("Atención al público en mostrador y preparación de pedidos para retiro en tienda.");

        HorarioAtencion haTarde = new HorarioAtencion(
                null, "Lunes a Viernes", "Turno Tarde",
                LocalTime.of(17, 0), LocalTime.of(20, 30)
        );
        haTarde.setCodHA("HA-LV-TARDE");
        haTarde.setDiasSemanaHA("Lunes a Viernes");
        haTarde.setDetallesHA("Atención general, retiro de reservas y asesoramiento en útiles escolares y oficina.");

        HorarioAtencion haSabado = new HorarioAtencion(
                null, "Sábados", "Turno Sábado",
                LocalTime.of(10, 0), LocalTime.of(13, 30)
        );
        haSabado.setCodHA("HA-SABADO");
        haSabado.setDiasSemanaHA("Sábados");
        haSabado.setDetallesHA("Atención matutina para consultas, compras de último momento y retiro de pedidos.");

        HorarioAtencion haDomingo = new HorarioAtencion();
        haDomingo.setCodHA("HA-DOMINGO");
        haDomingo.setDiasTextoHA("Domingos y Feriados");
        haDomingo.setDiasSemanaHA("Domingos y Feriados");
        haDomingo.setNombreTurnoHA("Cerrado");
        haDomingo.setEsCerradoHA(true);
        haDomingo.setDetallesHA("Cerrado por descanso semanal. Consultas por WhatsApp se responden el siguiente día hábil.");

        horarioRepository.saveAll(List.of(haManana, haTarde, haSabado, haDomingo));

        log.info("✓ 4 Turnos de horarios de atención precargados");

        // 4. Sembrar Productos Reales
        List<Producto> productos = new ArrayList<>();

        // Dibujo Técnico
        Producto p1 = new Producto(null, "Set de Geometría Pizzini 30cm", 5600.0, catDibujoTecnico);
        p1.setCodigoProducto("PROD-TEC-001");
        p1.setPrecioAnteriorProducto(6200.0);
        p1.setDetalleProducto("Incluye regla de 30cm biselada, escuadras de 45° y 60°, y transportador semicircular 180°. Material acrílico de alta resistencia.");
        p1.setFotoProducto("https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80");
        p1.setDestacadoProducto(true);
        p1.setBadgeProducto("Más Vendido");
        productos.add(p1);

        Producto p2 = new Producto(null, "Tablero de Dibujo Técnico Pizzini 50x60", 48000.0, catDibujoTecnico);
        p2.setCodigoProducto("PROD-TEC-002");
        p2.setDetalleProducto("Tablero melamínico blanco de 50x60cm con paralela incorporada y atril de inclinación regulable en 4 posiciones.");
        p2.setFotoProducto("https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80");
        p2.setDestacadoProducto(true);
        p2.setBadgeProducto("Calidad Profesional");
        productos.add(p2);

        // Escolar (con Promoción Vuelta a Clases)
        Producto p3 = new Producto(null, "Cuaderno Universitario Éxito 100 Hojas", 4200.0, catEscolar);
        p3.setCodigoProducto("PROD-ESC-001");
        p3.setPrecioAnteriorProducto(4700.0);
        p3.setDetalleProducto("Cuaderno tapa dura encuadernado de 100 hojas rayadas de 90g. Especial para uso escolar intensivo.");
        p3.setFotoProducto("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80");
        p3.setDestacadoProducto(true);
        p3.setEnOfertaProducto(true);
        p3.setBadgeProducto("Vuelta a Clases");
        p3.setPromocion(promoVueltaClases);
        productos.add(p3);

        Producto p4 = new Producto(null, "Caja Lápices de Colores Faber-Castell x 24", 8900.0, catEscolar);
        p4.setCodigoProducto("PROD-ESC-002");
        p4.setDetalleProducto("Ecolápices triangulares de madera reforestada con mina de alta pigmentación y resistencia a la rotura.");
        p4.setFotoProducto("https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80");
        p4.setEnOfertaProducto(true);
        p4.setPromocion(promoVueltaClases);
        productos.add(p4);

        // Oficina
        Producto p5 = new Producto(null, "Resma A4 Chamex 75g 500 Hojas", 6800.0, catOficina);
        p5.setCodigoProducto("PROD-OFI-001");
        p5.setDetalleProducto("Papel blanco multiuso alcalino de máxima blancura. Ideal para fotocopias, impresiones inkjet y láser de alta definición.");
        p5.setFotoProducto("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80");
        p5.setDestacadoProducto(true);
        productos.add(p5);

        Producto p6 = new Producto(null, "Abrochadora Metálica Mit 50", 11500.0, catOficina);
        p6.setCodigoProducto("PROD-OFI-002");
        p6.setDetalleProducto("Abrochadora de sobremesa de cuerpo metálico con base antideslizante. Capacidad para broches 26/6 y 24/6.");
        p6.setFotoProducto("https://images.unsplash.com/photo-1585336261026-6d60ee464eb7?auto=format&fit=crop&w=800&q=80");
        productos.add(p6);

        // Arte (con Promoción Kit Artístico)
        Producto p7 = new Producto(null, "Set Pinturas Acrílicas Eterna x 10 Colores", 8900.0, catArte);
        p7.setCodigoProducto("PROD-ART-001");
        p7.setPrecioAnteriorProducto(10200.0);
        p7.setDetalleProducto("Pinturas acrílicas de calidad artística al agua, de acabado satinado y alto poder cubritivo. Tubos de 50ml surtidos.");
        p7.setFotoProducto("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80");
        p7.setEnOfertaProducto(true);
        p7.setBadgeProducto("Promo Arte");
        p7.setPromocion(promoArteCreativo);
        productos.add(p7);

        Producto p8 = new Producto(null, "Set de Pinceles Casan Serie 120 x 5 Unidades", 7400.0, catArte);
        p8.setCodigoProducto("PROD-ART-002");
        p8.setDetalleProducto("Pinceles de pelo de cerda sintética dorada toray: redondos, chatos y lengua de gato para óleo y acrílico.");
        p8.setFotoProducto("https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80");
        p8.setPromocion(promoArteCreativo);
        productos.add(p8);

        // Regalería y Didácticos
        Producto p9 = new Producto(null, "Mochila Urbana Juvenil Motivos", 22000.0, catRegaleria);
        p9.setCodigoProducto("PROD-REG-001");
        p9.setDetalleProducto("Mochila reforzada con compartimento porta-notebook acolchado, doble bolsillo lateral para botellas y correas ergonómicas.");
        p9.setFotoProducto("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80");
        p9.setDestacadoProducto(true);
        productos.add(p9);

        Producto p10 = new Producto(null, "Botella Térmica de Acero Inoxidable 500ml", 14500.0, catRegaleria);
        p10.setCodigoProducto("PROD-REG-002");
        p10.setDetalleProducto("Botella doble capa con aislamiento al vacío. Mantiene bebidas frías hasta 24hs y calientes hasta 12hs. Libre de BPA.");
        p10.setFotoProducto("https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80");
        productos.add(p10);

        productoRepository.saveAll(productos);

        log.info("✓ 10 Productos del catálogo precargados con éxito");
        log.info("=== SIMULACIÓN DE DATOS COMPLETADA CON ÉXITO ===");

        return obtenerResumenSimulacion();
    }

    /**
     * Retorna el resumen consolidado del estado de datos simulados.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerResumenSimulacion() {
        Map<String, Object> resumen = new LinkedHashMap<>();

        long totalCat = categoriaRepository.count();
        long catActivas = categoriaRepository.findByFechaHoraBajaTCIsNullOrderByOrdenCategoriaAsc().size();

        long totalPromo = promocionRepository.count();
        long promoActivas = promocionRepository.findByFechaHoraBajaPromocionIsNull().size();

        long totalHorarios = horarioRepository.count();
        long horariosActivos = horarioRepository.findByFechaHoraBajaHAIsNull().size();

        long totalProd = productoRepository.count();
        long prodActivos = productoRepository.findByFechaHoraBajaProductoIsNull().size();
        long prodDestacados = productoRepository.findByDestacadoProductoTrueAndFechaHoraBajaProductoIsNull().size();

        resumen.put("estado", "SIMULACIÓN ACTIVA");
        resumen.put("totalCategorias", totalCat);
        resumen.put("categoriasActivas", catActivas);
        resumen.put("totalPromociones", totalPromo);
        resumen.put("promocionesActivas", promoActivas);
        resumen.put("totalHorarios", totalHorarios);
        resumen.put("horariosActivos", horariosActivos);
        resumen.put("totalProductos", totalProd);
        resumen.put("productosActivos", prodActivos);
        resumen.put("productosDestacados", prodDestacados);

        return resumen;
    }
}

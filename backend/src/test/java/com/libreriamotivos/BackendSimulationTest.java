package com.libreriamotivos;

import com.libreriamotivos.dto.LoginRequestDTO;
import com.libreriamotivos.dto.LoginResponseDTO;
import com.libreriamotivos.dto.ProductoDTO;
import com.libreriamotivos.dto.TipoCategoriaDTO;
import com.libreriamotivos.entity.Producto;
import com.libreriamotivos.entity.TipoCategoria;
import com.libreriamotivos.repository.ProductoRepository;
import com.libreriamotivos.repository.TipoCategoriaRepository;
import com.libreriamotivos.service.AdminAuthService;
import com.libreriamotivos.service.ProductoService;
import com.libreriamotivos.service.TipoCategoriaService;
import com.libreriamotivos.simulation.DataSimulationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Suite integral de pruebas para la simulación de datos, autenticación de administrador
 * y reglas de negocio de bajas lógicas de Librería Motivos.
 */
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class BackendSimulationTest {

    @Autowired
    private AdminAuthService adminAuthService;

    @Autowired
    private DataSimulationService simulationService;

    @Autowired
    private TipoCategoriaService categoriaService;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private TipoCategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @BeforeEach
    void setUp() {
        // Garantizar que la simulación de datos esté ejecutada para las pruebas
        simulationService.ejecutarSimulacion(false);
    }

    @Test
    @DisplayName("1. Autenticación de Administrador con contraseña configurada")
    void testAutenticacionAdministrador() {
        // Prueba con contraseña errónea
        LoginRequestDTO requestInvalido = new LoginRequestDTO("admin", "password_incorrecta");
        LoginResponseDTO respuestaInvalida = adminAuthService.autenticar(requestInvalido);
        assertFalse(respuestaInvalida.isAutenticado(), "No debe permitir acceso con contraseña incorrecta");
        assertNull(respuestaInvalida.getToken());

        // Prueba con la contraseña configurada en application.properties (motivosAdmin2026!)
        LoginRequestDTO requestValido = new LoginRequestDTO("admin", "motivosAdmin2026!");
        LoginResponseDTO respuestaValida = adminAuthService.autenticar(requestValido);
        assertTrue(respuestaValida.isAutenticado(), "Debe autenticar con éxito al administrador");
        assertNotNull(respuestaValida.getToken(), "Debe emitir un token de sesión para el panel");
        assertEquals("admin", respuestaValida.getUsername());
        assertEquals("Administrador Librería Motivos", respuestaValida.getNombre());
    }

    @Test
    @DisplayName("2. Verificación de Precarga de Datos de Simulación")
    void testPrecargaDeDatosSimulados() {
        Map<String, Object> resumen = simulationService.obtenerResumenSimulacion();

        assertNotNull(resumen);
        assertTrue((Long) resumen.get("totalCategorias") >= 5, "Deben existir al menos 5 categorías");
        assertTrue((Long) resumen.get("totalPromociones") >= 2, "Deben existir al menos 2 promociones");
        assertTrue((Long) resumen.get("totalHorarios") >= 4, "Deben existir los 4 horarios de atención");
        assertTrue((Long) resumen.get("totalProductos") >= 10, "Deben existir los 10 productos del catálogo");

        // Validar categorías específicas de la librería
        List<TipoCategoriaDTO> categorias = categoriaService.listarActivas();
        assertTrue(categorias.stream().anyMatch(c -> c.getSlugCategoria().equals("dibujo-tecnico")), "Debe existir la categoría 'Dibujo Técnico'");
        assertTrue(categorias.stream().anyMatch(c -> c.getSlugCategoria().equals("escolar")), "Debe existir la categoría 'Escolar'");

        // Validar búsqueda de productos
        List<ProductoDTO> productosPizzini = productoService.buscarPorNombre("Pizzini");
        assertFalse(productosPizzini.isEmpty(), "Debe encontrar artículos Pizzini");
    }

    @Test
    @DisplayName("3. Regla Estricta de Bajas Lógicas en Producto (Sin sentencias DELETE)")
    void testBajaLogicaProducto() {
        List<ProductoDTO> activosAntes = productoService.listarActivos();
        assertFalse(activosAntes.isEmpty());
        ProductoDTO primerProd = activosAntes.get(0);
        Long idProd = primerProd.getId();

        // Ejecutar baja lógica
        boolean dadaDeBaja = productoService.darDeBaja(idProd);
        assertTrue(dadaDeBaja, "La baja lógica debe reportar éxito");

        // El producto ya no debe figurar en el listado de activos
        List<ProductoDTO> activosDespues = productoService.listarActivos();
        assertFalse(activosDespues.stream().anyMatch(p -> p.getId().equals(idProd)), "El producto dado de baja no debe aparecer en activos");

        // Pero DEBE seguir existiendo físicamente en la base de datos (Regla: NUNCA DELETE)
        Optional<Producto> productoFisico = productoRepository.findById(idProd);
        assertTrue(productoFisico.isPresent(), "El registro físico debe permanecer en la base de datos");
        assertNotNull(productoFisico.get().getFechaHoraBajaProducto(), "Debe tener registrada la fecha de baja lógica");
        assertFalse(productoFisico.get().isActivo());

        // Reactivación del producto
        boolean reactivado = productoService.reactivar(idProd);
        assertTrue(reactivado, "La reactivación debe ser exitosa");
        assertTrue(productoService.listarActivos().stream().anyMatch(p -> p.getId().equals(idProd)), "El producto debe volver a figurar activo");
    }

    @Test
    @DisplayName("4. Propagación en Cascada de Baja Lógica (Categoría -> Productos)")
    void testBajaLogicaEnCascadaCategoria() {
        // Encontrar una categoría con productos
        List<TipoCategoriaDTO> categorias = categoriaService.listarActivas();
        TipoCategoriaDTO catConProductos = categorias.stream()
                .filter(c -> c.getCantidadProductos() > 0)
                .findFirst()
                .orElseThrow();

        Long idCategoria = catConProductos.getId();
        List<ProductoDTO> productosDeCatAntes = productoService.listarPorCategoria(idCategoria);
        assertFalse(productosDeCatAntes.isEmpty(), "La categoría debe tener productos asociados");

        // Dar de baja lógica la categoría
        boolean bajaCat = categoriaService.darDeBaja(idCategoria);
        assertTrue(bajaCat, "La baja lógica de la categoría debe ejecutarse");

        // La categoría no debe aparecer en activas
        assertFalse(categoriaService.listarActivas().stream().anyMatch(c -> c.getId().equals(idCategoria)));

        // Los productos dependientes deben haber heredado la baja lógica y no estar activos
        List<ProductoDTO> productosDeCatDespues = productoService.listarPorCategoria(idCategoria);
        assertTrue(productosDeCatDespues.isEmpty(), "Ningún producto de una categoría dada de baja debe figurar activo");

        // Verificar a nivel persistencia que los productos tienen fechaHoraBajaProducto
        for (ProductoDTO pDto : productosDeCatAntes) {
            Producto pEnRepo = productoRepository.findById(pDto.getId()).orElseThrow();
            assertNotNull(pEnRepo.getFechaHoraBajaProducto(), "El producto asociado debe tener asignada fechaHoraBajaProducto");
        }
    }
}

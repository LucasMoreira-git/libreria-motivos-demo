# Documentación del Proyecto: Sitio Web para Librería Motivos
**Contexto, relevamiento, arquitectura, diseño UI/UX y estado de avance**

---

## 1. Contexto del Negocio

Librería Motivos es una librería y papelería tradicional de barrio ubicada en Guaymallén, Mendoza. El local comercial no contaba con un sitio web oficial: la información de este proyecto fue relevada a partir de su ficha en el directorio comercial Libros Tauro y de la observación directa del autor del proyecto.

| Campo | Detalle |
| :--- | :--- |
| **Nombre Comercial** | Librería Motivos |
| **Dirección** | Juan Carlos Lucero M-D-C44, M5533 Guaymallén, Mendoza, Argentina |
| **Rubro Principal** | Librería escolar, papelería comercial, regalería y artística |
| **Reputación en Directorio** | 9.6 sobre 10 (con más de 65 reseñas verificadas) |
| **Perfil del Negocio** | Punto de referencia barrial en Guaymallén para útiles escolares, papelería de oficina y artículos de regalo; caracterizado por su atención cercana y personalizada, amplio stock y asesoramiento a medida tanto para familias como para pymes y docentes. |
| **Presencia Digital Inicial** | Sin plataforma propia oficial. Presencia restringida a fichas de directorios externos. |

---

## 2. Relevamiento del Local

### 2.1 Productos y Rubros
El local se destaca por su surtido integral ("tienen de todo"). Los rubros principales relevados abarcan:
1. **Útiles Escolares:** Cuadernos, repuestos de hojas, carpetas, cartucheras, mochilas, lápices y kits para nivel inicial, primario y secundario.
2. **Artículos de Oficina y Comercial:** Resmas de papel (A4, Oficio), abrochadoras, biblioratos, formularios comerciales y consumibles de contabilidad.
3. **Arte y Diseño:** Pinceles, témperas, acuarelas, acrílicos, blocks de dibujo y papeles especiales.
4. **Dibujo Técnico:** Tableros, escuadras, compases de precisión, reglas y papel vegetal.
5. **Regalería, Didácticos y Merchandising:** Juegos de mesa en madera, juguetes didácticos, agendas anuales, artículos de regalo y merchandising temático.

### 2.2 Precios y Política Comercial
- Precios alineados y competitivos con los valores del mercado local de Mendoza.
- Lanzamiento de promociones y combos especiales según la temporada comercial (ej: Vuelta al Cole, Día de las Infancias, Especial Primavera, Fiestas).

### 2.3 Horarios de Atención por Turnos Independientes
Los horarios del local se estructuran en turnos independientes:

| Día | Turnos de Atención |
| :--- | :--- |
| **Lunes a Viernes** | **Mañana:** 09:30 a 13:30 hs &nbsp;\|&nbsp; **Tarde:** 17:00 a 20:30 hs (21:00 hs según época) |
| **Sábados** | **Mañana:** 10:00 a 13:30 hs (turno corrido matutino) |
| **Domingos y Feriados** | Sujeto a verificación estacional (atención puntual de 14:00/19:00 a 21:00 hs). En temporada regular se computa como cerrado para atención al público presencial. |

> **Diferencial Competitivo:** La potencial apertura en domingo por la tarde/noche representa una ventaja única frente a librerías de la zona, ideal para compras escolares de último momento.

### 2.4 Delivery y Métodos de Entrega
Aspectos relevados y definidos para el modelo de servicio:
- **Retiro en Local:** Los clientes coordinan su pedido o presupuesto vía WhatsApp y retiran en el local de Guaymallén.
- **Envíos / Delivery:** A convenir por cercanía barrial mediante mensajería o cadetería local.
- **Medios de Pago en Local:** Efectivo, transferencias bancarias directas, tarjetas de débito y crédito.

---

## 3. Problema y Oportunidad

- **Problema:** El negocio no poseía una vitrina digital donde los vecinos y clientes pudieran explorar el catálogo de artículos, verificar precios de referencia, conocer los horarios de atención en vivo o aprovechar promociones vigentes sin tener que trasladarse físicamente.
- **Oportunidad:** Construir una **vitrina web moderna, ligera y de alta conversión**, con diseño optimizado para dispositivos móviles (Mobile First) que conecte al cliente directamente con el canal de atención personalizada más utilizado: **WhatsApp**.

---

## 4. Alcance y Límites del Sistema

### 4.1 Alcance de la Vitrina Web (Interfaz del Cliente)
- **Vitrina Web Informativa (Cero Transacciones Complejas):** No incluye carrito de compras, registro de cuentas de usuario ni pasarelas de pago (Mercado Pago, Stripe).
- **Conversational Commerce (100% WhatsApp CTA):** Toda intención de compra, consulta de stock o solicitud de presupuesto cuenta con botones directos hacia WhatsApp con mensajes precargados contextuales (producto, precio de referencia, categoría o promoción).
- **Catálogo Interactivo:** Búsqueda en vivo y filtrado reactivo por categorías semánticas.
- **Promociones Dinámicas:** Hero banner de combos y descuentos de temporada (ej: "Especial Primavera 2026").
- **Evaluación de Horarios en Vivo:** Widget y badge dinámico que informa si el local se encuentra abierto o cerrado en tiempo real según los turnos de atención.
- **Modal de Detalle Rápido:** Vista ampliada de producto adaptada a pantallas táctiles (*Bottom Sheet* en móviles).

### 4.2 Escalabilidad y Gestión Administrativa (Panel ABM)
- La gestión de productos, promociones, categorías y horarios contará con un panel independiente para el administrador del negocio, respaldado por una base de datos relacional y una API REST robusta.

### 4.3 Supuestos de Trabajo
- El cliente final ingresa en un 80%+ desde smartphones.
- El comerciante requiere agilidad para responder por WhatsApp y una forma sencilla de actualizar precios y stock sin lidiar con arquitecturas de e-commerce pesadas.

---

## 5. Diseño UI/UX y Decisiones de Ingeniería de Frontend

Se implementó un estándar visual y de usabilidad profesional guiado por las skills de desarrollo del proyecto (`libreria-motivos-ui` y `frontend-pro`):

### 5.1 Principios de Usabilidad Mobile First
- **Zonas Táctiles Ergonómicas (Thumb Zone):** Todas las áreas táctiles respetan un mínimo de $44 \times 44\text{ px}$ (`min-h-[44px] touch-manipulation`).
- **Deslizamiento Horizontal Suave:** Barra de categorías táctil con clases `overflow-x-auto scrollbar-hide no-scrollbar touch-pan-x overscroll-x-contain`, garantizando navegación fluida con el pulgar sin desbordes de página ni scrollbars visibles.
- **Prevención de Trampas Táctiles:** En los botones de filtro y tarjetas interactivas se asignó `pointer-events-none` a los íconos interiores SVG y etiquetas de texto, asegurando que WebKit/iOS registre el clic directamente en el elemento interactivo contenedor.
- **Margen Inferior de Despeje:** Se incorporó `pb-24 sm:pb-8` en el contenedor principal para que el botón flotante de WhatsApp no bloquee el acceso táctil a las últimas tarjetas o enlaces del pie.

### 5.2 Identidad Visual, Paleta Cromática y Tipografía
- **Tipografía Global:** **Plus Jakarta Sans** (`--font-sans`), configurada vía `next/font/google` y Tailwind CSS para máxima legibilidad en textos, fichas técnicas y precios.
- **Tipografía de Encabezados:** **Poppins** (`--font-heading`), aplicada en títulos, banners y nombres comerciales para aportar personalidad y presencia de marca.
- **Paleta Cromática Institucional (Tonos Rosados de Marca y Acentos):**
  - *Rosa / Fucsia de Marca (`--color-brand-pink: #e11d48`, hover `#be123c`, borde `#fecdd3`):* Color primario y de acento alineado con la identidad digital y redes sociales de la marca (`motivos.regalos_`).
  - *Ámbar / Coral Cálido (`text-amber-300`, `from-rose-600 via-pink-600 to-rose-700`):* Acento cálido para promociones de temporada, badges y destellos.
  - *Verde WhatsApp (`#25D366` / `#1EBE5D`):* Botones de acción directa reconocibles al instante con respuesta táctil interactiva (`hover:scale-[1.02] active:scale-95`).
  - *Fondo Neutro Suave (`bg-slate-50`, bordes `border-slate-200`):* Prevención de fatiga visual y lectura cómoda.

### 5.3 Sistema de Microinteracciones, Animaciones y Restricciones Estrictas
- **Hero Banner con Entrada Escalonada CSS (500-700ms):**
  Implementado mediante `@keyframes` fluidos (`cubic-bezier(0.16, 1, 0.3, 1)`) sin librerías pesadas:
  1. *Contenedor Principal:* Fade in progresivo (0 a 550ms).
  2. *Título con Poppins:* Desplazamiento desde abajo (`translateY(22px) -> 0`, retardo 120ms).
  3. *Descripción y Badges:* Fade in suave (`translateY(10px) -> 0`, retardo 260ms).
  4. *Imagen del Combo:* Entrada lateral desde la derecha (`translateX(28px) -> 0`, retardo 380ms).
  5. *Botón CTA de WhatsApp:* Aparición final y elevación (`translateY(8px) -> 0`, retardo 500ms).
- **Catálogo de Productos con Revelación Progresiva en Scroll:**
  - Uso de **Intersection Observer** nativo (`.scroll-reveal-card.revealed`) para mostrar las tarjetas con un suave deslizamiento vertical y retardo escalonado conforme el usuario se desplaza por la pantalla.
  - Efecto hover en tarjetas: ligera elevación (`hover:-translate-y-1`), sombreado expandido (`hover:shadow-lg`) y borde destacado en tono rosa suave (`hover:border-rose-300`).
  - Reorganización y filtrado fluido de categorías (`.catalog-grid-fluid`): desvanecimiento breve (`opacity-20`) y transición continua de 200ms al seleccionar categorías (ej. *Dibujo Técnico* o *Escolar*), evitando saltos o desapariciones abruptas.
- **Restricción Estricta de Animaciones:**
  Siguiendo las directrices del proyecto, se prohíbe terminantemente el uso de rebotes excesivos (*overshoot curves*), partículas decorativas, paralaje intenso, rotación continua de íconos y botones pulsantes (`animate-ping`/`animate-pulse` en elementos interactivos). Todo feedback se basa en escala táctil sutil (`hover:scale-[1.02] active:scale-95`).

### 5.4 Sistema Uniforme de Iconografía Semántica
Se desterraron los emojis en los elementos interactivos del catálogo, migrando a íconos vectoriales SVG de **Lucide React** con tamaño estándar ($20 \times 20\text{ px}$ / `w-5 h-5`), trazo unificado (`strokeWidth={2}`) y transiciones suaves (`transition-colors duration-200`):
- `LayoutGrid` &rarr; Todos los Artículos
- `Backpack` &rarr; Útiles Escolares
- `Briefcase` &rarr; Oficina y Comercial
- `Palette` &rarr; Arte y Diseño
- `Gift` &rarr; Regalería y Didácticos
- `Ruler` &rarr; Dibujo Técnico

### 5.4 Jerarquía de Capas (`z-index`)
Para asegurar que los modales, menús y barras flotantes convivan sin conflictos en móviles:
1. `z-30`: Header Fijo (`sticky top-0`) y Botón Flotante Global de WhatsApp.
2. `z-40`: Telones semitransparentes de cierre (*backdrops*) con `touch-manipulation cursor-pointer`.
3. `z-50`: Tooltips de horarios, menús desplegables y menú de navegación móvil.
4. `z-[60]`: Modal de Detalle de Producto (`ProductModal`), garantizando aislamiento total sobre cualquier elemento de la cabecera o flotante.

---

## 6. Estado del Proyecto: Lo Implementado HASTA AHORA

Actualmente, el frontend del cliente (Vitrina Web) se encuentra 100% operativo, maquetado y compilado en producción sin errores:

### Componentes y Vistas Desarrolladas
1. **Header Principal Interactivo (`Header.tsx`):**
   - Barra de navegación con leve tinte rosado pálido / gris perla (`bg-[#fbf7f8]/95 backdrop-blur-md border-b border-pink-100/90 shadow-md`) para un contraste nítido y elegante al hacer scroll sobre el catálogo blanco.
   - Logo con la "M" institucional y badge de destello.
   - Enlaces de navegación rápida a secciones (`#catalogo`, `#promociones`, `#horarios`, `#ubicacion`) con margen de desplazamiento `scroll-mt-24` y hover en tono rosa de marca.
   - Botón de búsqueda global con ícono `Search` de Lucide que traslada suavemente la pantalla y enfoca el campo del catálogo.
   - Íconos sutiles de acceso a redes sociales: Instagram oficial ([@motivos.regalos_](https://www.instagram.com/motivos.regalos_/)) y Reseñas de Google Maps (con calificación barrial 4.9 ★).
   - Badge interactivo en vivo de estado ("Abierto ahora" / "Cerrado") que despliega un tooltip limpio con la grilla de horarios completa por turnos (Lunes a Viernes mañana/tarde, Sábados mañana, Domingos cerrado) sin animaciones pulsantes.
   - Menú móvil desplegable (`Menu` / `X`) para resoluciones táctiles menores a 768px.
2. **Hero de Promociones de Temporada (`PromoHero.tsx`):**
   - Maquetación en cuadrícula de 2 columnas con fondo en degradado de **rosado pastel suave y amigable** (`from-pink-100/90 via-rose-50/95 to-pink-200/80 text-slate-900 border border-pink-200/90 shadow-sm`), sustituyendo los tonos magentas intensos por una estética clara, accesible y cercana.
   - Entrada escalonada CSS nativa de 500-700ms (contenedor, título desde abajo, descripción, imagen desde la derecha y botón de la promo).
   - Botón CTA de promoción con escala interactiva (`hover:scale-[1.02] active:scale-95`).
   - Mocks de campaña actualizados a **"Especial Primavera 2026"** con combos creativos y comerciales.
3. **Catálogo Interactivo con Búsqueda y Filtros (`ProductGrid.tsx` & `CategoryChips.tsx`):**
   - Barra de búsqueda reactiva instantánea con botón de limpieza y foco en tono rosa de marca.
   - Fila de chips de categorías con íconos vectoriales SVG de Lucide, `scrollbar-hide` táctil y estilo activo en rosa de marca (`bg-rose-600`).
   - Animación de scroll con **Intersection Observer** nativo y reorganización fluida de tarjetas al filtrar categorías.
   - Tarjetas de producto (`ProductCard.tsx`) con efecto hover de ligera elevación (`-translate-y-1`), sombreado y borde destacado en rosa, imágenes reales simuladas (`object-cover`, alturas fijas `h-[220px] lg:h-[260px]`), badges absolutos (`OFERTA`, `NOVEDAD`) y botón de consulta en rosado muy claro y suave (`bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold`) sin ícono de WhatsApp y con texto estricto **"Consultar producto"**.
4. **Modal de Detalle Rápido (`ProductModal.tsx`):**
   - Diálogo accesible (*Bottom Sheet* en móviles, modal centrado en desktop) con tecla Escape, bloqueo de scroll en fondo y botón principal adaptado a la estética rosado claro suave (`bg-pink-100 hover:bg-pink-200 text-pink-950`) sin ícono de WhatsApp y con texto estricto **"Consultar producto"**.
5. **Widget de Horarios de Atención (`ScheduleWidget.tsx`):**
   - Visualización clara de turnos de atención independientes (Lunes a Viernes mañana/tarde, Sábados mañana, Domingos cerrado) con **animación de entrada escalonada (*staggered slide-up*)** controlada por **Intersection Observer**, apareciendo suavemente fila por fila al ingresar al viewport.
   - Indicador estático de estado en vivo, detalles de modalidad de retiro de pedidos en el local y enlace directo hacia el mapa de ubicación.
6. **Sección de Ubicación "¿Dónde encontrarnos?" (`LocationSection.tsx`):**
   - Layout responsivo: 2 columnas en desktop (izquierda información y CTA en azul corporativo; derecha minimapa incrustado de Google Maps) y apilado vertical en mobile sin desbordamiento horizontal.
   - Datos verificados del negocio: dirección exacta (`Juan Carlos Lucero M-D-C44, M5521 Guaymallén, Mendoza`) y referencia barrial en San Francisco del Monte / Parque Urquiza (cerca de Átomo Elpidio González y Urquiza).
   - Iframe estándar de Google Maps estructurado con bordes redondeados (`rounded-3xl`) y sombra suave (`shadow-sm`) con pin verificado.
   - Animación secuencial mediante **Intersection Observer** detonada una sola vez al llegar a la sección con transiciones suaves (300-500ms): 1) Título introductorio, 2) Bloque de información y CTA, 3) Minimapa.
   - Botón principal 'Ver en Google Maps' en azul corporativo con microinteracciones visuales (`hover:-translate-y-1` y `active:scale-95`), sin animaciones infinitas, paralaje ni partículas.
7. **Botón Flotante Global de WhatsApp (`WhatsAppFloatingCTA.tsx`):**
   - Botón siempre visible en la esquina inferior derecha con soporte táctil optimizado, respuesta `hover:scale-[1.03] active:scale-95` (sin rotaciones de íconos) y enlace preconfigurado para consultas generales.
8. **Motor Generador de Enlaces de WhatsApp (`whatsapp.ts`):**
   - Número de WhatsApp oficial actualizado: **02615635813** (formateado internacionalmente a `5492615635813` para la API de WhatsApp `wa.me/`).
   - Codificación automática en formato internacional para Mendoza (+54 9 261 ...) con mensajes contextualizados por producto, promoción o consulta general.

---

## 7. Arquitectura Técnica Definida para las Próximas Fases

Para evolucionar la vitrina desde los mocks iniciales hacia un sistema dinámico y autoadministrable, se ha definido formalmente la siguiente arquitectura:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DEL SISTEMA                        │
└────────────────────────────────────────────────────────────────────────┘

  [ CLIENTE FINAL ]                           [ ADMINISTRADOR ]
   Vitrina Web Mobile First                   Panel ABM (Ruta Protegida)
   Next.js 16 + Tailwind CSS                  Next.js + Tailwind CSS
          │                                              │
          │ (Lectura GET)                                │ (CRUD Completo)
          ▼                                              ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │                   BACKEND API REST (Spring Boot)                     │
  │                                                                      │
  │  • Controllers (REST Endpoints)        • DTOs (Data Transfer)        │
  │  • Services (Lógica de Negocio)        • Lombok (Boilerplate-free)   │
  │  • Repositories (Spring Data JPA)      • Hibernate (ORM)             │
  │  • Security / Auth (Protección de rutas administrativas)             │
  └──────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼ (JDBC / Driver MySQL)
  ┌──────────────────────────────────────────────────────────────────────┐
  │                    BASE DE DATOS RELACIONAL                          │
  │                                                                      │
  │  • MySQL (Instancia local administrada vía XAMPP)                    │
  │  • Inspección y administración visual de esquemas con DBeaver        │
  └──────────────────────────────────────────────────────────────────────┘
```

### 7.1 Base de Datos: MySQL + XAMPP + DBeaver
- **Motor:** MySQL Server ejecutado localmente a través de la suite **XAMPP**.
- **Herramienta de Administración:** **DBeaver Community** para diseño visual de esquemas, ejecución de consultas SQL, creación de índices y monitoreo de integridad referencial.
- **Tablas Principales:**
  - `categorias`: `id`, `nombre`, `slug`, `icono_lucide`, `descripcion`, `orden`.
  - `productos`: `id`, `nombre`, `detalle`, `precio`, `foto_url`, `categoria_id` (FK), `destacado`, `en_oferta`, `badge`.
  - `promociones`: `id`, `nombre`, `detalle`, `temporada_promocion`, `fecha_inicio`, `fecha_fin`, `descuento_texto`, `condicion`, `foto_combo`.
  - `turnos_horario`: `id`, `dias_semana`, `dias_texto`, `nombre_turno`, `hora_apertura`, `hora_cierre`, `es_cerrado`.

### 7.2 Backend: API REST en Java con Spring Boot
- **Paradigma:** Orientación a Objetos estricta con arquitectura limpia en capas (*Controller - Service - Repository - Entity*).
- **Framework & Herramientas:**
  - **Spring Boot 3.x:** Configuración ágil del servidor y endpoints RESTful.
  - **Spring Data JPA & Hibernate:** Mapeo Objeto-Relacional (ORM) eficiente, generación automática de esquemas y transacciones ACID.
  - **Lombok:** Uso de anotaciones (`@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`) para erradicar el código repetitivo en entidades y DTOs.
  - **Patrón DTO (Data Transfer Object):** Desacoplamiento total entre los modelos de la base de datos y la información expuesta al frontend, optimizando el ancho de banda y protegiendo datos internos.
  - **Manejo Global de Errores:** `@ControllerAdvice` con respuestas JSON estandarizadas (código de error, mensaje y timestamp).

### 7.3 Frontend Administrador: Panel ABM Protegido
- **Ruta Independiente:** Vistas de administración construidas en una ruta protegida (ej: `/admin`), desacoplada visualmente de la vitrina del cliente final.
- **Funcionalidades del ABM:**
  - Alta, baja y modificación de productos (precios, stock simulado, categorías, fotos y badges).
  - Configuración de promociones de temporada (vigencias, fotos de combos, descuentos).
  - Modificación de horarios comerciales y turnos especiales.
- **Consumo de la API:** Peticiones HTTP asíncronas con feedback inmediato (toasts de éxito/error y modales de confirmación).

---

## 8. Lo que Queda por Hacer (Plan de Trabajo y Próximos Pasos)

### Fase 1: Base de Datos y Persistencia
- [ ] Iniciar el servicio MySQL en **XAMPP**.
- [ ] Conectar **DBeaver** a la instancia local y crear la base de datos `libreria_motivos_db`.
- [ ] Diseñar el script DDL de creación de tablas con claves foráneas, restricciones de unicidad e índices de búsqueda.
- [ ] Cargar el dataset inicial (seed) basado en los datos relevados de Guaymallén.

### Fase 2: Desarrollo del Backend en Spring Boot
- [x] Inicializar el proyecto Spring Boot (Maven) con las dependencias exclusivas: `Spring Web`, `Spring Data JPA`, `MySQL Driver` y `Lombok` en `backend/pom.xml`.
- [x] Configurar `backend/src/main/resources/application.properties` para la conexión a MySQL local (XAMPP) en base de datos `libreria_motivos`, puerto 3306, credenciales por defecto (`root`, sin contraseña) y `spring.jpa.hibernate.ddl-auto=update`.
- [x] Desarrollar entidades JPA (`Producto`, `TipoCategoria`, `Promocion`, `HorarioAtencion`) en `com.libreriamotivos.entity`:
  - Normalización unificada de Primary Keys con `@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;`.
  - Mapeo estricto de tipos de dominio: `Double` para precios, `Date` (`java.util.Date`) para fechas de vigencias y marcas temporales de baja lógica, y `LocalTime` para horarios de apertura/cierre.
  - Atributo de baja lógica en `TipoCategoria` definido como `fechaHoraBajaTC`, generando `getFechaHoraBajaTC()` y `setFechaHoraBajaTC()` con Lombok.
  - Relaciones `@OneToMany` y `@ManyToOne` bidireccionales completas entre `TipoCategoria`, `Producto` y `Promocion` con generación automática de `setTipoCategoria()` y `setPromocion()` en `Producto`.
  - Mecanismo de Bajas Lógicas en cascada con interceptores `@PreUpdate` (en `TipoCategoria` propagando `fechaHoraBajaTC` a `Producto`), `@PrePersist` (en `Producto` invocando `getFechaHoraBajaTC()`), y métodos de dominio `darDeBaja(Date fechaHora)`.
- [ ] Crear los DTOs de solicitud (*Request*) y respuesta (*Response*).
- [ ] Implementar la capa de repositorios (`JpaRepository`) y servicios con lógica de negocio.
- [ ] Construir los controladores REST públicos para la vitrina (`GET /api/productos`, `GET /api/promociones`, `GET /api/categorias`, `GET /api/horarios`).
- [ ] Construir los controladores seguros para el ABM (`POST`, `PUT`, `DELETE`).
- [ ] Configurar CORS para permitir la comunicación fluida con el frontend de Next.js.

### Fase 3: Frontend Administrador (Panel ABM) — [COMPLETADO]
- [x] Maquetar la plantilla base del panel administrativo en `/admin` con barra lateral fija/móvil y navbar exclusivo para el rol de Administrador del sistema.
- [x] Implementar ABM Productos (`/admin/productos`) con DataGrid, filtros y formulario modal con atributo estricto `precioProducto` y `codTC`.
- [x] Implementar ABM Categorías (`/admin/categorias`) con DataGrid, filtros y formulario modal con atributos `slugCategoria` e `iconoCategoria`.
- [x] Implementar ABM Promociones (`/admin/promociones`) con DataGrid, filtros y formulario modal con atributos estrictos `temporadaPromocion` y `fechaHoraFinPromocion`.
- [x] Implementar ABM Horarios (`/admin/horarios`) con DataGrid y formulario modal con atributos estrictos `horaInicioHA` y `horaFinHA`.
- [x] Implementar la lógica completa de Bajas Lógicas (*Soft Deletes*) registrando marcas temporales en `fechaHoraBaja...`, con badges visuales de estado y opción de reactivación.
- [x] Refactorizar la vista principal (`/admin`):
  - Purga total de referencias técnicas (MySQL, Spring Boot, DBeaver, JPA, Next.js) de la interfaz de usuario.
  - Cabecera compacta y funcional enfocada exclusivamente en la operación de Librería Motivos.
  - Barra lateral limpia enfocada estrictamente en los módulos: Dashboard, ABM Categorías, ABM Promociones, ABM Producto y ABM Horarios.
  - Implementación de la sección **Alertas Operativas** con 3 indicadores de negocio:
    1. *Promociones próximas a vencer* (evaluando `fechaHoraFinPromocion` respecto a la fecha de referencia).
    2. *Productos sin categoría asignada* (evaluando `codTC` nulo o vacío para asegurar integridad referencial).
    3. *Horarios de atención que requieren revisión* (evaluando turnos especiales como domingo/feriados sujeto a revisión estacional de 14:00/19:00 a 21:00 hs).

### Fase 4: Integración Final y Despliegue
- [ ] Reemplazar los archivos de mocks del frontend del cliente (`mock-catalogo.ts`, `mock-data.ts`) por llamadas `fetch` a la API REST de Spring Boot.
- [ ] Realizar pruebas integrales de extremo a extremo:
  1. Modificación de un precio u horario en el panel de administración.
  2. Persistencia automática en la base de datos MySQL.
  3. Reflejo instantáneo en la vitrina web del cliente.
  4. Generación correcta del mensaje contextual para WhatsApp.

---

## 9. Fuentes y Referencias

- **Ficha comercial:** Directorio Libros Tauro (Librería Motivos, Guaymallén, Mendoza).
- **Relevamiento territorial:** Observación directa de local, vitrina y horarios por el autor del proyecto.
- **Skills internas del proyecto:**
  - `.agents/skills/libreria-motivos-ui/`: Principios de negocio, directrices UI/UX y generador de mensajes.
  - `.agents/skills/frontend-pro/`: Estándares de ingeniería Mobile First, microinteracciones y separación modular.

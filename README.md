# 📚 Librería Motivos — Vitrina Web & Catálogo Comercial Interactivo

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

Plataforma web comercial y vitrina interactiva desarrollada para **Librería Motivos**, comercio tradicional de librería escolar, papelería comercial, artística y regalería en **Guaymallén, Mendoza, Argentina**.

Diseñada bajo un estándar de desarrollo profesional **Mobile First**, con arquitectura modular desacoplada, rendimiento de carga ultra rápido, microinteracciones fluidas y un canal de conversión directa vía WhatsApp sin fricciones ni burocracia de registro.

---

## 🌟 Características Principales

### 📱 Experiencia de Usuario & Mobile First (Thumb Zone)
- **Ergonomía Táctil:** Botones y elementos interactivos con zonas de impacto mínimas de $44 \times 44\text{ px}$, feedback visual inmediato al tacto (`active:scale-95`) y navegación sin desplazamientos horizontales accidentales.
- **Botón Flotante Estratégico:** Acceso rápido a WhatsApp anclado en la zona de pulgar inferior para consultas vecinales inmediatas.

### 🛍️ Catálogo Interactivo con Búsqueda & Filtro Instantáneo
- **Buscador Reactivo:** Búsqueda en tiempo real por nombre de producto, descripción o categoría sin recargas de página.
- **Chips de Categoría Horizontales:** Filtro deslizante táctil (`CategoryChips`) con íconos semánticos Lucide SVG y transiciones suaves (`catalog-grid-fluid`).
- **Claridad de Precios:** Muestra prominente de precios con aclaración explícita sobre condiciones comerciales («Precio contado/transf.» para efectivo, débito o transferencia).
- **Modal de Detalle Rápido:** Vista ampliada de producto con badges de oferta/novedad, stock garantizado y botón de consulta directa.

### 💬 Motor de Automatización WhatsApp (`wa.me`)
- **Mensajes Contextuales Estandarizados:** Generación automática de enlaces internacionales (`+54 9 261 563-5813`) con mensajes pre-redactados para cada producto:
  > *"¡Hola! ¿Qué tal? Quería hacerles una consulta sobre [Nombre del producto]. ¡Gracias!"*
- **Presupuestos Escolares y Comerciales:** Flujo directo para enviar listas completas o solicitar presupuestos por WhatsApp en un solo clic.

### 🕒 Motor de Horarios en Vivo con Turnos Desacoplados
- **Evaluación en Tiempo Real:** Algoritmo que calcula dinámicamente si el local se encuentra **Abierto** o **Cerrado**, respetando turnos partidos comerciales de Mendoza:
  - **Lunes a Viernes:** 09:30 a 13:30 hs (Mañana) y 17:00 a 20:30 hs (Tarde).
  - **Sábados:** 10:00 a 13:30 hs (Mañana).
  - **Domingos y Feriados:** Cerrado.
- **Animaciones al Scroll:** Entrada escalonada de las filas de turnos semanales mediante `IntersectionObserver`.

### 📍 Ubicación Exacta & Minimapa Integrado
- **Pin Geográfico Verificado:** Coordenadas de alta precisión (`-32.91971, -68.79241`) correspondientes a *Juan Carlos Lucero M-D-C44, Barrio Parque Urquiza / San Francisco del Monte, Guaymallén, Mendoza* (próximo a Urquiza y Elpidio González).
- **Acceso Directo a Google Maps:** Botón con feedback interactivo que abre la ruta guiada en Google Maps.

### 🎨 Identidad Visual Sofisticada & Pie de Página Completo
- **Paleta Cromática Armónica:** Tonos suaves de rosado natural (*Blush/Nude* `#d97786`), barra superior (*Header*) en suave lavanda pastel (`#ede4f6`) y tipografía oscura de alto contraste (`Plus Jakarta Sans` y `Poppins`).
- **Footer Corporativo de 4 Columnas:** Estructura completa con datos de contacto, enlaces de catálogo, servicios, formulario de suscripción a listas/novedades, redes sociales y sello monograma de marca.

---

## 🏛️ Arquitectura del Sistema

El proyecto está diseñado con una arquitectura moderna de separación estricta entre capa de presentación y servicios de dominio:

```
Libreria-Motivos/
├── src/                               # Frontend en Next.js 16 (App Router)
│   ├── app/                           # Rutas, Layouts, globals.css y Providers
│   │   ├── admin/                     # Módulo de administración interna
│   │   ├── globals.css                # Tokens Tailwind CSS v4 y animaciones CSS
│   │   ├── layout.tsx                 # Root layout, fuentes tipográficas y meta tags
│   │   └── page.tsx                   # Vitrina pública principal
│   ├── components/                    # Componentes modulares reutilizables
│   │   ├── layout/                    # Header, Footer, WhatsAppFloatingCTA
│   │   ├── modules/                   # ProductGrid, ProductCard, ProductModal,
│   │   │                              # PromoHero, CategoryChips, ScheduleWidget,
│   │   │                              # LocationSection
│   │   └── ui/                        # Componentes atómicos (Card, etc.)
│   ├── lib/                           # Lógica de negocio y utilidades desacopladas
│   │   ├── mock-catalogo.ts           # Datos tipados de catálogo y promociones
│   │   ├── mock-data.ts               # Horarios, turnos y datos institucionales
│   │   ├── utils.ts                   # Utilidades de clases (clsx, tailwind-merge)
│   │   └── whatsapp.ts                # Motor generador de deep-links WhatsApp
│   └── types/                         # Definiciones de tipos TypeScript
│       ├── catalogo.ts                # Modelos de Producto, Categoría y Promoción
│       └── horario.ts                 # Modelos de Turnos y Estado de Atención
│
└── backend/                           # Backend en Spring Boot 3 + Spring Data JPA
    ├── src/main/java/com/libreriamotivos/
    │   ├── entity/                    # Entidades JPA (Producto, TipoCategoria,
    │   │                              # Promocion, HorarioAtencion)
    │   └── LibreriaMotivosApplication.java
    └── src/main/resources/
        ├── application.properties     # Configuración con variables de entorno
        └── application.properties.example
```

---

## 💻 Tecnologías Utilizadas

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework Web** | [Next.js 16](https://nextjs.org/) | App Router, Turbopack, Prerendering estático ultra veloz |
| **Librería UI** | [React 19](https://react.dev/) | Componentes cliente y servidor reactivos |
| **Lenguaje Frontend** | [TypeScript](https://www.typescriptlang.org/) | Tipado estricto para modelos de catálogo y estados |
| **Estilos & Diseño** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilidades atómicas modernas y variables CSS fluidas |
| **Íconos** | [Lucide React](https://lucide.dev/) | Iconografía SVG ligera, coherente y accesible |
| **Backend API** | [Spring Boot 3.5](https://spring.io/) | API RESTful robusta y modular con Java 21 |
| **Persistencia ORM** | [Spring Data JPA / Hibernate](https://spring.io/projects/spring-data-jpa) | Mapeo objeto-relacional con bajas lógicas (Soft Delete) |
| **Base de Datos** | [MySQL 8.0](https://www.mysql.com/) | Motor relacional con integridad referencial |
| **Productividad** | [Lombok](https://projectlombok.org/) | Reducción de boilerplate (`@Getter`, `@Setter`, `@Builder`) |

---

## ⚙️ Configuración & Ejecución Local

### Prerrequisitos
- **Node.js:** Versión 20.x o superior.
- **npm:** Versión 10.x o superior.
- **Java JDK:** Versión 21 o superior (para el backend Spring Boot).
- **Maven:** Versión 3.9+ (o wrapper integrado).
- **MySQL:** Versión 8.0+ (opcional para el backend, por ejemplo vía XAMPP en el puerto 3306).

---

### 1. Clonar el Repositorio
```bash
git clone https://github.com/LucasMoreira-git/libreria-motivos-demo.git
cd libreria-motivos-demo
```

---

### 2. Ejecutar el Frontend (Next.js)

Instalar las dependencias del proyecto:
```bash
npm install
```

Iniciar el servidor de desarrollo:
```bash
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en vivo.

Para generar y verificar el build de producción optimizado:
```bash
npm run build
npm run start
```

---

### 3. Ejecutar el Backend (Spring Boot — Opcional)

1. Crear la base de datos en MySQL:
```sql
CREATE DATABASE IF NOT EXISTS libreriamotivosbd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configurar variables de entorno (o usar las predeterminadas de `application.properties`):
```bash
cd backend
mvn clean spring-boot:run
```
El servidor backend se levantará en [http://localhost:8080](http://localhost:8080).

---

## 🔒 Auditoría de Seguridad & Buenas Prácticas

- **Cero Credenciales Expuestas:** Todas las contraseñas y tokens sensibles de base de datos se parametrizan mediante variables de entorno (`${DB_PASSWORD:}`) con fallbacks seguros.
- **Archivos Sensibles Ignorados:** Configuración rigurosa de `.gitignore` para omitir artefactos compilados (`.next/`, `backend/target/`, `node_modules/`), credenciales locales (`.env*`) y configuraciones de IDEs (`.idea/`, `.vscode/`).
- **Seguridad en Formularios:** Validación de campos y sanitización de inputs para evitar inyecciones.
- **Rendimiento Web:** Zero layout shifts (CLS = 0), Largest Contentful Paint (LCP) optimizado mediante prerender estático de Next.js y fuentes de sistema optimizadas.

---

## 👨‍💻 Autor

**Lucas Moreira**  
*Desarrollador Full Stack & Diseñador de Interfaces*  
- **GitHub:** [@LucasMoreira-git](https://github.com/LucasMoreira-git)
- **Ubicación:** Mendoza, Argentina

---

⭐ Si este proyecto te resultó interesante o útil para tu portafolio, no dudes en dejarle una estrella en GitHub.

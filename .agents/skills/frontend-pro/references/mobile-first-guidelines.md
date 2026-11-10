# Guía de Diseño y Maquetación Mobile First — Frontend Pro

Directrices para garantizar una experiencia óptima en dispositivos móviles para los clientes de Librería Motivos en Guaymallén.

---

## 1. Zonas del Pulgar (Thumb Zone Ergonomics)

En navegación con una sola mano en pantallas de 6 a 6.7 pulgadas:
*   **Zona Cómoda (Natural Thumb Reach):** Mitad inferior de la pantalla. Aquí deben ubicarse los botones de acción principal, el botón flotante de WhatsApp y las barras de navegación.
*   **Zona de Estiramiento:** Mitad superior. Ideal para información de solo lectura (nombre del negocio, badges informativos).
*   **Zona Difícil:** Esquinas superiores. Evitar colocar acciones críticas que requieran uso frecuente.

---

## 2. Dimensiones de Áreas Táctiles (Touch Targets)

*   **Estándar Apple HIG & Google Material Design:** Mínimo **44px x 44px** (ó 48px x 48px).
*   **En Tailwind CSS:**
    ```html
    <!-- Correcto: cumple con min-h-[44px] y padding ergonómico -->
    <button class="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl flex items-center justify-center">
      Consultar
    </button>
    ```

---

## 3. Comportamiento Responsive Fluido

*   **Pills Deslizables:**
    ```html
    <div class="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 -mx-4 sm:mx-0 sm:px-0">
      <!-- botones de categorías -->
    </div>
    ```
*   **Tarjetas en 2 Columnas Móviles:**
    ```html
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Producto cards -->
    </div>
    ```

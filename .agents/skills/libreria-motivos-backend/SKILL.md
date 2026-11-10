---
name: libreria-motivos-backend
description: Gestiona y estructura la arquitectura del backend para Librería Motivos utilizando Spring Boot, Spring Data JPA y Lombok.
---

# Estructurador Backend de Librería Motivos

Esta skill define la arquitectura, entidades y reglas de negocio del servidor para el proyecto "Librería Motivos".

## Cuándo usarla
Activa esta skill cuando el usuario necesite crear o modificar configuraciones de base de datos, repositorios JPA, servicios, controladores REST o DTOs en Spring Boot.

## 🚨 REGLAS DE ARQUITECTURA (SCOPE ESTRICTO)
1. **CERO FRONTEND:** Esta skill es exclusivamente para el backend. NUNCA generes código de React, HTML, CSS o Tailwind aquí.
2. **CAPAS OBLIGATORIAS:** Toda entidad debe tener su respectiva interfaz `Repository`, una clase `@Service` para la lógica de negocio y un `@RestController` para exponer los endpoints.
3. **PATRÓN DTO:** Los Controladores NUNCA deben devolver las entidades JPA crudas al cliente. Se deben mapear siempre a Data Transfer Objects (DTOs).

## Modelo de Dominio (Entidades Spring Boot)
Basado en el Diagrama de Clases, debes generar las entidades utilizando Lombok (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) con los siguientes atributos exactos:
- **Producto:** `codigoProducto`, `nombreProducto`, `precioProducto`, `fechaHoraAltaProducto`, `fotoProducto`, `fechaHoraBajaProducto`, `detalleProducto`.
- **Promocion:** `codPromocion`, `nombrePromocion`, `detallesPromocion`, `fechaHoraBajaPromocion`, `fechaHoraAltaPromocion`, `fechaHoraInicioPromocion`, `fechaHoraFinPromocion`, `temporadaPromocion`.
- **TipoCategoria:** `codTC`, `nombreTC`, `detallesTC`, `fechaHoraBajaTC`.
- **HorarioAtencion:** `codHA`, `fechaHoraBajaHA`, `fechaHoraAltaHA`, `horaInicioHA`, `horaFinHA`, `detallesHA`, `diaSemanaHA`.

## Regla de Bajas Lógicas
NUNCA utilices sentencias `DELETE` en la base de datos. Todos los repositorios deben incluir métodos personalizados (ej. `findByFechaHoraBajaProductoIsNull()`) para asegurar que solo se consulten registros activos.

## Pila Tecnológica
- **Framework:** Spring Boot (Java).
- **Persistencia:** Spring Data JPA / Hibernate.
- **Base de Datos:** MySQL (XAMPP puerto 3306) o H2 embebida.
package com.libreriamotivos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración Web MVC de Spring Boot para Librería Motivos:
 * - Habilita CORS para el frontend Next.js (http://localhost:3000).
 * - Enrutamiento directo y amigable para el acceso al Panel de Administración HTML (/admin).
 * - Mapeo de recursos estáticos (HTML, CSS, JS).
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirige /admin y /admin/ directamente al login HTML del panel
        registry.addRedirectViewController("/admin", "/admin/login.html");
        registry.addRedirectViewController("/admin/", "/admin/login.html");
        registry.addViewController("/admin/panel").setViewName("forward:/admin/panel.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/admin/**")
                .addResourceLocations("classpath:/static/admin/");
    }
}

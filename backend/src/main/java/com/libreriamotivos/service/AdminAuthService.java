package com.libreriamotivos.service;

import com.libreriamotivos.dto.LoginRequestDTO;
import com.libreriamotivos.dto.LoginResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio de Autenticación para el apartado de ADMINISTRADOR.
 * Lee las credenciales maestras configuradas en application.properties
 * y gestiona tokens de sesión activos en memoria con tiempo de expiración.
 */
@Service
public class AdminAuthService {

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:motivosAdmin2026!}")
    private String adminPassword;

    @Value("${app.admin.nombre:Administrador Librer\u00EDa Motivos}")
    private String adminNombre;

    @Value("${app.admin.session-timeout-minutes:60}")
    private int sessionTimeoutMinutes;

    // Almacén seguro en memoria para tokens de sesión activos: Token -> Timestamp expiración (epoch ms)
    private final Map<String, Long> activeSessions = new ConcurrentHashMap<>();

    /**
     * Valida las credenciales suministradas por el usuario contra las definidas en application.properties.
     */
    public LoginResponseDTO autenticar(LoginRequestDTO request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            return LoginResponseDTO.fallido("Debe ingresar usuario y contraseña");
        }

        boolean usuarioValido = adminUsername.trim().equalsIgnoreCase(request.getUsername().trim());
        boolean passwordValida = adminPassword.trim().equals(request.getPassword().trim());

        if (usuarioValido && passwordValida) {
            String tokenSesion = UUID.randomUUID().toString();
            long expiracion = System.currentTimeMillis() + ((long) sessionTimeoutMinutes * 60 * 1000);
            activeSessions.put(tokenSesion, expiracion);
            return LoginResponseDTO.exitoso(this.adminUsername, this.adminNombre, tokenSesion);
        }

        return LoginResponseDTO.fallido("Credenciales incorrectas para el panel de administración");
    }

    /**
     * Verifica si un token de sesión emitido sigue siendo válido y no ha expirado.
     */
    public boolean isTokenValido(String token) {
        if (token == null || token.isBlank()) return false;
        Long expiracion = activeSessions.get(token.trim());
        if (expiracion == null) return false;

        if (System.currentTimeMillis() > expiracion) {
            activeSessions.remove(token.trim());
            return false;
        }
        return true;
    }

    /**
     * Cierra la sesión activa invalidando el token.
     */
    public boolean cerrarSesion(String token) {
        if (token == null) return false;
        return activeSessions.remove(token.trim()) != null;
    }

    public boolean verificarPassword(String password) {
        if (password == null) return false;
        return adminPassword.trim().equals(password.trim());
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public String getAdminNombre() {
        return adminNombre;
    }
}

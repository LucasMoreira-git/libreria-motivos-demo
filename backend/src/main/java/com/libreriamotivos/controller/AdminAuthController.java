package com.libreriamotivos.controller;

import com.libreriamotivos.dto.LoginRequestDTO;
import com.libreriamotivos.dto.LoginResponseDTO;
import com.libreriamotivos.service.AdminAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST para la autenticación en el apartado de ADMINISTRADOR.
 * Valida la contraseña configurada en application.properties y gestiona sesiones.
 */
@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = adminAuthService.autenticar(request);
        if (response.isAutenticado()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        boolean valido = adminAuthService.isTokenValido(token);
        response.put("valido", valido);
        if (valido) {
            response.put("username", adminAuthService.getAdminUsername());
            response.put("nombre", adminAuthService.getAdminNombre());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        adminAuthService.cerrarSesion(token);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Sesión cerrada correctamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getAdminInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("username", adminAuthService.getAdminUsername());
        info.put("nombre", adminAuthService.getAdminNombre());
        info.put("panel", "Librería Motivos - Panel de Control Administrativo");
        return ResponseEntity.ok(info);
    }
}

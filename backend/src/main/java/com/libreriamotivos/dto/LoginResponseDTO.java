package com.libreriamotivos.dto;

/**
 * DTO de respuesta para la autenticación en el apartado de ADMINISTRADOR.
 */
public class LoginResponseDTO {

    private boolean autenticado;
    private String username;
    private String nombre;
    private String mensaje;
    private String token;

    public LoginResponseDTO() {}

    public LoginResponseDTO(boolean autenticado, String username, String nombre, String mensaje, String token) {
        this.autenticado = autenticado;
        this.username = username;
        this.nombre = nombre;
        this.mensaje = mensaje;
        this.token = token;
    }

    public static LoginResponseDTO exitoso(String username, String nombre, String token) {
        return new LoginResponseDTO(true, username, nombre, "Autenticación exitosa", token);
    }

    public static LoginResponseDTO fallido(String mensaje) {
        return new LoginResponseDTO(false, null, null, mensaje, null);
    }

    public boolean isAutenticado() {
        return autenticado;
    }

    public void setAutenticado(boolean autenticado) {
        this.autenticado = autenticado;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

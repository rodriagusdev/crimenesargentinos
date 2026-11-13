import { defineMessages } from "@/lib/i18n/messages";

export const loginFormMessages = defineMessages({
  es: {
    title: "LOGIN",
    missingFields: "Por favor completa todos los campos",
    wrongCredentials: "El email y/o la contraseña son incorrectos",
    loginError: "Error al iniciar sesión",
    emailLabel: "Ingrese su email",
    emailPlaceholder: "usuario@ejemplo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Ingrese contraseña",
    hidePassword: "Ocultar contraseña",
    showPassword: "Mostrar contraseña",
    entering: "INGRESANDO...",
    enter: "ENTRAR",
    register: "REGISTRAR",
  },
  en: {
    title: "LOGIN",
    missingFields: "Please fill in all fields",
    wrongCredentials: "Incorrect email and/or password",
    loginError: "Login failed",
    emailLabel: "Enter your email",
    emailPlaceholder: "user@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    hidePassword: "Hide password",
    showPassword: "Show password",
    entering: "LOGGING IN...",
    enter: "ENTER",
    register: "SIGN UP",
  },
});

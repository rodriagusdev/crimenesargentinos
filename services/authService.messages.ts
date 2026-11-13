import { defineMessages } from "@/lib/i18n/messages";

export const authServiceMessages = defineMessages({
  es: {
    loginError: "Error al iniciar sesión",
    registerError: "Error al registrar usuario",
    registerSuccess: "Usuario registrado exitosamente",
    unknownError: "Error desconocido",
  },
  en: {
    loginError: "Login failed",
    registerError: "Could not register user",
    registerSuccess: "User registered successfully",
    unknownError: "Unknown error",
  },
});

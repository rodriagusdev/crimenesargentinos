import { API_URL } from "@/lib/api";
import { translate } from "@/lib/i18n/messages";
import { readLocaleCookie } from "@/lib/i18n/localeStorage";
import { authServiceMessages } from "./authService.messages";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  userName: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  success?: boolean;
  id?: string;
  email?: string;
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Los mensajes de error del backend vuelven en el idioma del jugador
        "Accept-Language": readLocaleCookie(),
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || translate(authServiceMessages, "loginError"));
    }

    const data = await response.json();
    return {
      token: data.token,
      success: true,
      id: data.id,
      email: data.email,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error(translate(authServiceMessages, "unknownError"));
  }
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Accept-Language": readLocaleCookie(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || translate(authServiceMessages, "registerError")
      );
    }

    const responseData = await response.json();
    return {
      success: true,
      message: translate(authServiceMessages, "registerSuccess"),
      ...responseData,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error(translate(authServiceMessages, "unknownError"));
  }
}

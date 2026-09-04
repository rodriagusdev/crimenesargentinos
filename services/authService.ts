import { API_URL } from "@/lib/api";

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
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al iniciar sesión");
    }

    const data = await response.json();
    return {
      token: data.token,
      success: true,
      id: data.id,
      email: data.email,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Error desconocido");
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
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Error al registrar usuario"
      );
    }

    const responseData = await response.json();
    return {
      success: true,
      message: "Usuario registrado exitosamente",
      ...responseData,
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}

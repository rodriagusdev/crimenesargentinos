import { useState, useEffect } from "react";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const parts = token.split(".");
      if (parts.length !== 3) {
        setError("Token JWT inválido");
        setLoading(false);
        return;
      }

      let payloadBase64 = parts[1];
      const padding = 4 - (payloadBase64.length % 4);
      if (padding !== 4) {
        payloadBase64 += "=".repeat(padding);
      }

      const decodedPayload = JSON.parse(atob(payloadBase64));
      const extractedUserId =
        decodedPayload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        decodedPayload.sub ||
        decodedPayload.jti;

      if (!extractedUserId) {
        setError("No userId found in token");
        setLoading(false);
        return;
      }

      setUserId(extractedUserId);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido al decodificar token";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { userId, loading, error };
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export interface LevelResponse {
  caseId: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  canPlay: boolean;
}

export async function getLevelsByUserId(userId: string): Promise<LevelResponse[]> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/api/levels/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch levels: ${response.statusText}`);
  }

  return response.json();
}
import { ICriminal } from "../models/criminal";
import { API_URL } from "../lib/api";

export async function getCriminals(): Promise<ICriminal[]> {
  const res = await fetch(`${API_URL}/criminals`);

  if (!res.ok) {
    throw new Error("Failed to fetch criminals");
  }

  return res.json();
}

import { cookies } from "next/headers";

export const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token")?.value ?? null;

    if (!token) return null;

    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

    const response = await fetch(`${baseUrl}/user/me`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    return data.success ? data.data : null;

  } catch (error) {
    console.log("Get User Error:", error.message || error);
    return null;
  }
};

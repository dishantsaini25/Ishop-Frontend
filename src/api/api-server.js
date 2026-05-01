import { cookies } from "next/headers";
import { axiosInstance } from "../../helper/helper";

export const getUser = async () => {
  try {
    const cookieStore = await cookies(); 

    const token = cookieStore.get("user_token")?.value ?? null;

    if (!token) return null;

    const response = await axiosInstance.get("user/me", {
      headers: {
        Authorization: token,
      },
    });

    return response.data.success ? response.data.data : null;

  } catch (error) {
    console.log("Get User Error:", error);
    return null;
  }
};

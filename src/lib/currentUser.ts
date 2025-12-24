import { connectDB } from "@/config/dbConfig";
import { getTokenData } from "@/lib/auth";
import User from "@/models/userModel";

export async function getCurrentUserFromDB() {
  await connectDB();

  const tokenData = await getTokenData();
  if (!tokenData) return null;

  return User.findById(tokenData.id).select("-password");
}

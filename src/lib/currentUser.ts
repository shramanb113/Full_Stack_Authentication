import { connectDB } from "@/config/dbConfig";
import { getTokenData } from "@/lib/auth";
import User from "@/models/userModel";

export async function getCurrentUserFromDB() {
  await connectDB();

  const tokenData = await getTokenData();

  if (!tokenData) return null;

  const user = await User.findById(tokenData.id).select("-password");

  return user;
}

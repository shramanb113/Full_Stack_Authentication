import { redirect } from "next/navigation";
import { getCurrentUserFromDB } from "@/lib/currentUser";
import User from "@/models/userModel";

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const currentUser = await getCurrentUserFromDB();

  if (
    currentUser &&
    currentUser.username.toLowerCase() === username.toLowerCase()
  ) {
    redirect("/profile");
  }

  const user = await User.findOne({
    username: username.toLowerCase(),
  }).select("-password");

  if (!user) {
    return <h1>User not found</h1>;
  }

  return (
    <div>
      <h1>@{user.username}</h1>
      <p>{user.email}</p>
    </div>
  );
}

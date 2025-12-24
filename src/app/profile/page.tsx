import { redirect } from "next/navigation";
import { getCurrentUserFromDB } from "@/lib/currentUser";

export default async function ProfilePage() {
  const user = await getCurrentUserFromDB();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome @{user.username}</h1>
      <p>{user.email}</p>
    </div>
  );
}

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const user = jwt.verify(token!, process.env.JWT_SECRET!) as {
    username: string;
    email: string;
  };

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <p>{user.email}</p>
    </div>
  );
}

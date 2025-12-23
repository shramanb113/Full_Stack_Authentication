import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

console.log("🔥 ENV CHECK:", {
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log("➡️ Login request received");

    await connectDB();
    console.log("✅ DB connected");

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const { email, password } = await request.json();
    console.log("📩 Body:", { email, password: !!password });

    // mongodb doesnot send the password with just findone ... you need select
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    if (!user.password) {
      return NextResponse.json(
        { error: "User password not set. Please re-register." },
        { status: 400 }
      );
    }

    console.log("🔍 USER FROM DB:", user);
    console.log("🔐 USER PASSWORD:", user.password);

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log("✅ Login success");
    return response;
  } catch (error: any) {
    console.error("❌ LOGIN ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

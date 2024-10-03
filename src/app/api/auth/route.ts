// api/auth.ts
import { NextResponse } from "next/server";

const users = [
  { id: 1, email: "john.doe@example.com", password: "password123" },
];

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  return NextResponse.json(
    user
      ? { message: "Logged in successfully" }
      : { message: "Invalid email or password" },
    { status: user ? 200 : 401 }
  );
}

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import Admin from "../../../models/Admin";
import { loginSchema } from "../../../lib/validation";
import { signToken } from "../../../lib/auth";

await connectDB();

export async function POST(req) {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors }, { status: 400 });

    const admin = await Admin.findOne({ username: parsed.data.username });
    if (!admin || !(await admin.comparePassword(parsed.data.password))) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: admin._id, username: admin.username });
    return NextResponse.json({ token });
}

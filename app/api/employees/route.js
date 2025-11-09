import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import Employee from "../../../models/Employee";
import { employeeSchema } from "../../../lib/validation";
import { verifyToken } from "../../../lib/auth";

await connectDB();

function getUser(req) {
    const auth = req.headers.get("authorization")?.split(" ")[1];
    if (!auth) return null;
    return verifyToken(auth);
}

export async function GET(req) {
    if (!getUser(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const employees = await Employee.find().sort({ createdAt: -1 });
    return NextResponse.json({ employees });
}

export async function POST(req) {
    if (!getUser(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = employeeSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    const emp = await Employee.create(parsed.data);
    return NextResponse.json(emp);
}

export async function PUT(req) {
    if (!getUser(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = employeeSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    const emp = await Employee.findByIdAndUpdate(body._id, parsed.data, { new: true });
    return NextResponse.json(emp);
}

export async function DELETE(req) {
    if (!getUser(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const id = new URL(req.url).searchParams.get("id");
    await Employee.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}

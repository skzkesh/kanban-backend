import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request){
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password required" }),
                { status: 400 }
            );
        }

        // Check if email existed
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user){
            return new Response(
                JSON.stringify({ error: "Invalid email or password" }),
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid){
            return new Response(
                JSON.stringify({ error: "Invalid email or password" }),
                { status: 401 }
            );
        }

        // Issue JWT token
        const token = jwt.sign(
            { userId: user.id }, 
            JWT_SECRET,
            { expiresIn: "7d" },
        );

        return new Response(
            JSON.stringify({
                user: {
                    id: user.id,
                    email: user.email,
                },
                token,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    catch (error) {
        return new Response(
        JSON.stringify({
            error: "Login failed",
            details: (error as Error).message,
        }),
        { status: 500 }
        );
    }
}
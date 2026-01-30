import jwt from "jsonwebtoken";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request){
    try {
        const userId = requireAuth(request);

        const userBoards = await prisma.board.findMany({
            where: { ownerId: userId, },
        })
        return new Response(JSON.stringify(userBoards), { status: 200 })
    }
    catch (error){
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        )
    }
}
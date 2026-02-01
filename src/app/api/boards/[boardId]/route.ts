import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getBoardById } from "@/lib/board.service";
import { NextRequest } from "next/server";


export async function GET (
    request: NextRequest,
    { params }: { params: { boardId: string } },
){
    const { boardId } = params;
    const userId = requireAuth(request);

    const board = await getBoardById(boardId, userId);
    
    if (!board) {
        return new Response(
        JSON.stringify({ error: "Board not found" }),
        { status: 404 }
        );
    }

    return new Response(JSON.stringify({ 
        board 
    }),
    {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
};



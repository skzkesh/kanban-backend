import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getBoardById } from "@/lib/board.service";
import { NextRequest } from "next/server";

// Get specific board
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

// Delete a board
export async function DELETE (
    request: NextRequest,
    { params }: { params: { boardId: string } },
){
    const { boardId } = params;
    const userId = requireAuth(request);

    try {
        await prisma.board.delete({
            where: {
                id: boardId,
                ownerId: userId,
            }
        })

        return new Response(JSON.stringify({ message: "Board deleted successfully" }),  { status: 204 })
    }
    catch (error){
        return new Response(JSON.stringify({
            error: "Internal server error"
        }),
            {status: 500}
        )
    }
}
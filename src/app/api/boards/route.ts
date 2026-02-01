import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";
import { getBoardsByUser } from "@/lib/board.service";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const userId = requireAuth(request);

    const userBoards = await getBoardsByUser(userId);

    return new Response(JSON.stringify(userBoards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }
}

export async function POST(request: Request){
    try {
        const body = await request.json();
        const { title } = body;

        const userId = requireAuth(request);

        const board = await prisma.board.create({
            data : {
                id: randomUUID(),
                title: title,
                ownerId: userId,
            }
        })

        return new Response(
            JSON.stringify(board), 
            { status: 201 }
        )
    }
    catch (error){
        return new Response(
            JSON.stringify({ error: "Fail to create new board" }),
            { status: 401 }
        )
    }
}

import { requireAuth } from "@/lib/auth";
import { getBoardsByUser, createBoard } from "@/lib/board.service";

// Get all boards for a user
export async function GET(request: Request) {
  try {
    const userId = requireAuth(request);

    const userBoards = await getBoardsByUser(userId);

    return new Response(JSON.stringify(userBoards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } 
  catch {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }
}

// Create a new board
export async function POST(request: Request){
    try {
        const body = await request.json();
        const { title } = body;

        if (!title) {
            return new Response(
                JSON.stringify({ error: "Title required" }),
                { status: 400 }
            );
        }

        const userId = requireAuth(request);

        const board = await createBoard(userId, title);

        return new Response(JSON.stringify(board), { 
            status: 201,
            headers: { "Content-Type": "application/json" },
        })
    }
    catch (error){
        return new Response(
            JSON.stringify({ error: "Fail to create new board" }),
            { status: 401 }
        )
    }
}

import { getColumnsByBoard, createColumn, getColumnCount } from "@/lib/column.service"; 
import { requireAuth } from "@/lib/auth"; 
import { NextRequest } from "next/server";

// Get all columns for a board
export async function GET(
    request: NextRequest,
    { params }: { params: { boardId: string } },
) {
    const userId = requireAuth(request);

    const columns = await getColumnsByBoard(params.boardId);

    if (columns.length === 0) {
        return new Response(
            JSON.stringify({ error: "No columns found for this board" }),
            { status: 404 } 
        );
    }

    return new Response(JSON.stringify({ columns }), {
        status: 200, // OK
        headers: { 'Content-Type': 'application/json' },
    });
}

// Create a column for a board
export async function POST(
    request: NextRequest,
    { params }: { params: { boardId: string } }
) {
    try {
        const { title } = await request.json();

        if (!title) {
            return new Response(
                JSON.stringify({ error: "Title required" }),
                { status: 400 } // Bad Request
            );
        }

        const userId = requireAuth(request);
        
        const lastCount = await getColumnCount(params.boardId); 
        const order = lastCount + 1; 

        const newColumn = await createColumn(params.boardId, title, order);

        return new Response(JSON.stringify(newColumn), { 
            status: 201, // Created
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error); 
        return new Response(
            JSON.stringify({ error: "Failed to create new column" }),
            { status: 500 } // Internal Server Error
        );
    }
}
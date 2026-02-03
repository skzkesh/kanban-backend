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
// Create a column for a board
export async function POST(
    request: NextRequest,
    { params }: { params: { boardId: string } }
) {
    try {
        const { title } = await request.json();

        // Check if title is provided
        if (!title) {
            return new Response(
                JSON.stringify({ error: "Title required" }),
                { status: 400 } // Bad Request
            );
        }

        // Get the authenticated user's ID
        const userId = requireAuth(request);
        
        // Use getColumnCount to retrieve the current count of columns
        const lastCount = await getColumnCount(params.boardId); // Await the count
        const order = lastCount + 1; // Set order based on the column count

        // Create the new column
        const newColumn = await createColumn(params.boardId, title, order);

        // Return the newly created column as a response
        return new Response(JSON.stringify(newColumn), { 
            status: 201, // Created
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response(
            JSON.stringify({ error: "Failed to create new column" }),
            { status: 500 } // Internal Server Error
        );
    }
}
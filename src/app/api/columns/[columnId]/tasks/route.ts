import { NextRequest } from "next/server";
import { getTasksByColumn, createTask, getTaskCount } from "@/lib/task.service";
import { getBoardIdByColumn } from "@/lib/column.service";

// Get all tasks for a column
export async function GET(
    request: NextRequest,
    { params }: { params: { columnId: string } }
) {
    try {
        const tasks = await getTasksByColumn(params.columnId);
        
        return new Response(JSON.stringify({ tasks }), {
            status: 200, // OK
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error); 
        return new Response(
            JSON.stringify({ error: "Failed to retrieve tasks" }),
            { status: 500 } 
        );
    }
}

// Create a new task
export async function POST(
    request: NextRequest,
    { params }: { params: { columnId: string } }
){
    try {
        const { title } = await request.json();

        if (!title) {
            return new Response(
                JSON.stringify({ error: "Title required" }),
                { status: 400 } // Bad Request
            );
        }
        
        const boardId = await getBoardIdByColumn(params.columnId);

        if (!boardId) {
            return new Response(
                JSON.stringify({ error: "Column not found" }),
                { status: 404 } // Not Found
            );
        }

        const lastCount = await getTaskCount(params.columnId); 
        const order = lastCount + 1; 

        const newTask = await createTask(boardId, params.columnId, title, order);

        return new Response(JSON.stringify(newTask), { 
            status: 201, // Created
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error); 
        return new Response(
            JSON.stringify({ error: "Failed to create new task" }),
            { status: 500 } // Internal Server Error
        );
    }
}
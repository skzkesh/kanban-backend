import { NextRequest } from "next/server";
import { deleteTask, getTaskById } from "@/lib/task.service";

// Get a specific task
export async function GET(
    request: NextRequest,
    { params }: { params: { columnId: string, taskId: string } }
){
    const task = await getTaskById(params.columnId, params.taskId);
    
    if (!task) {
        return new Response(
            JSON.stringify({ error: "Task is not found" }),
            { status: 404 } 
        );
    }

    return new Response(JSON.stringify({ task }), {
        status: 200, // OK
        headers: { 'Content-Type': 'application/json' },
    });
}

// Delete a task
export async function DELETE(
    request: NextRequest,
    { params }: { params: { columnId: string; taskId: string } }
) {
    try {
        await deleteTask(params.columnId, params.taskId);

        return new Response(JSON.stringify({ message: "Task deleted successfully" }), { 
            status: 204 
        });
    } catch (error) {
        console.error(error); 
        
        return new Response(JSON.stringify({
            error: "Internal server error"
        }), { 
            status: 500 
        });
    }
}
import { prisma } from "@/lib/prisma";

export async function getTasksByColumn(columnId: string){
    return prisma.task.findMany({
        where: { columnId: columnId },
        orderBy: { order: "asc"},
    });
}

export async function createTask(columnId: string, boardId: string, title: string, order: number){
    return prisma.task.create({
        data : {
            columnId: columnId,
            boardId: boardId,
            title: title,
            order: order,
        }
    })
}

export async function getTaskCount(columnId: string){
    return prisma.task.count({
        where: { columnId: columnId }
    });
}
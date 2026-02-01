import { prisma } from "@/lib/prisma";

export async function getColumnsByBoard(boardId: string){
    return prisma.column.findMany({
        where: { boardId: boardId },
        orderBy: { createdAt: "desc" },
    });
}

export async function createColumn(boardId: string, title: string, order: number){
    return prisma.column.create({
        data : {
            boardId: boardId,
            title: title,
            order: order,
        }
    })
}
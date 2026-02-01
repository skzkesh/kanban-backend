import { prisma } from "@/lib/prisma";

export async function getBoardsByUser(userId: string){
    return prisma.board.findMany({
        where: { ownerId: userId, },
        orderBy: { createdAt: "desc" },
    });
}

export async function getBoardById(boardId: string, userId: string){
    return prisma.board.findFirst({
        where: { 
            id: boardId,
            ownerId: userId,
        }
    })
}

export async function createBoard(userId: string, title: string){
    return prisma.board.create({
        data : {
            title: title,
            ownerId: userId,
        }
    })
}
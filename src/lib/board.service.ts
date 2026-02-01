import { prisma } from "@/lib/prisma";

export async function getBoardsByUser(userId: string){
    return prisma.board.findMany({
        where: { ownerId: userId, },
        orderBy: { createdAt: "desc" },
    });
}

// export async function getBoardById(boardId: string){

// }
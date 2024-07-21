import { NextResponse } from "next/server";
// import prisma from "../../../../prisma";
import { PrismaClient } from "@prisma/client";
import { getCustomServerSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗しました");
  }
}

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { ...data } = await req.json();
    await main();
    const session = await getCustomServerSession();
    const post = await prisma.post.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: session?.user.id, // ここでユーザーのIDを使用します todo あとで可変にする
          },
        },
      },
    });

    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

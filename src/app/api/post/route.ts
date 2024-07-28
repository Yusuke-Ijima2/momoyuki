import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/lib/auth";

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
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      createdBy: {
        id: post.createdBy.id,
        name: post.createdBy.name,
        email: post.createdBy.email,
      },
    }));

    return NextResponse.json(
      { message: "Success", posts: formattedPosts },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { location, description } = await req.json();
    await main();
    const session = await getServerSession();
    const post = await prisma.post.create({
      data: {
        location,
        description,
        createdBy: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });

    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

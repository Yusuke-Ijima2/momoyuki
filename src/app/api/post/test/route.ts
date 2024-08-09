import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/lib/auth";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗しました");
  }
}
export async function POST(request: Request) {
  try {
    // URLからファイル名を取得
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("filename");

    // リクエストからフォームデータを取得
    const formData = await request.formData();
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;

    if (!fileName || !location) {
      return NextResponse.json(
        { error: "filename, location, is missing" },
        { status: 400 }
      );
    }

    // アップロードされた画像のURLを生成
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${fileName}`;

    await main();
    const session = await getServerSession();
    const post = await prisma.post.create({
      data: {
        location,
        description,
        image: imageUrl,
        createdBy: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });

    console.log(post);

    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const prisma = new PrismaClient();

async function main() {
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

// 環境変数からAWSの設定を取得
// const {
//   AWS_S3_BUCKET_ACCESS_KEY_ID,
//   AWS_S3_BUCKET_SECRET_ACCESS_KEY,
//   AWS_S3_BUCKET_REGION,
//   AWS_S3_BUCKET_NAME,
// } = process.env;

// S3クライアントの作成
// const s3Client = new S3Client({
//   region: AWS_S3_BUCKET_REGION,
//   credentials: {
//     accessKeyId: AWS_S3_BUCKET_ACCESS_KEY_ID!,
//     secretAccessKey: AWS_S3_BUCKET_SECRET_ACCESS_KEY!,
//   },
// });

export async function POST(request: Request) {
  try {
    // リクエストからファイル名とファイルタイプを取得
    const { searchParams } = new URL(request.url);

    const fileName = searchParams.get("filename");
    const fileType = searchParams.get("fileType");

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "ファイル名またはファイルタイプが不足しています" },
        { status: 400 }
      );
    }

    // Presigned URLの生成
    const s3Client = new S3Client({
      region: process.env.AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY!,
      },
    });

    const presignedPost = await createPresignedPost(s3Client, {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Fields: {
        "Content-Type": fileType,
      },
      Expires: 60, // URLの有効期限（秒）
      Conditions: [["content-length-range", 0, 10485760]], // 最大10MB
    });

    return NextResponse.json({ presignedPost }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Presigned URLの生成に失敗しました" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

// 環境変数からAWSの設定を取得
const {
  AWS_S3_BUCKET_ACCESS_KEY_ID,
  AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_REGION,
  AWS_S3_BUCKET_NAME,
} = process.env;

// S3クライアントの作成
const s3Client = new S3Client({
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_S3_BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: AWS_S3_BUCKET_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    // URLからファイル名を取得
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("filename");

    // リクエストからフォームデータを取得
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;

    if (!file || !fileName || !location || !description) {
      return NextResponse.json(
        { error: "File, filename, location, or description is missing" },
        { status: 400 }
      );
    }

    // File オブジェクトから Buffer に変換
    const buffer = Buffer.from(await file.arrayBuffer());

    // アップロードパラメータの設定
    const uploadParams = {
      Bucket: AWS_S3_BUCKET_NAME!,
      Key: fileName, // 保存時の画像名
      Body: buffer, // input fileから取得
      ContentType: file.type, // 適切なContentTypeを設定
    };

    // 画像のアップロード
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // アップロードされた画像のURLを生成
    const imageUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_BUCKET_REGION}.amazonaws.com/${fileName}`;

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

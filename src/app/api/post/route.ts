import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/lib/auth";
import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";

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

async function uploadLargeFileToS3(file: Blob, fileName: string) {
  const createMultipartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: AWS_S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: file.type,
  });

  const createResponse = await s3Client.send(createMultipartUploadCommand);
  const uploadId = createResponse.UploadId;

  const partSize = 5 * 1024 * 1024; // 5MB
  const parts: any[] = [];

  for (let start = 0; start < file.size; start += partSize) {
    const end = Math.min(start + partSize, file.size);
    const partBlob = file.slice(start, end);

    // BlobをArrayBufferに変換
    const arrayBuffer = await partBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const partNumber = parts.length + 1;

    const uploadPartCommand = new UploadPartCommand({
      Bucket: AWS_S3_BUCKET_NAME!,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: buffer, // BlobではなくBufferを使用
    });

    const uploadPartResponse = await s3Client.send(uploadPartCommand);
    parts.push({ ETag: uploadPartResponse.ETag, PartNumber: partNumber });
  }

  const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
    Bucket: AWS_S3_BUCKET_NAME!,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });

  await s3Client.send(completeMultipartUploadCommand);
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("filename");

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

    // 大きなファイルをS3にマルチパートアップロード
    await uploadLargeFileToS3(file, fileName);

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

import { validFolder } from "../../../services/s3Service";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { folderPath } = await req.json();
    const result = await validFolder(folderPath);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      exists: false,
      message: "Ha ocurrido un error al validar la existencia de la carpeta",
    });
  }
}

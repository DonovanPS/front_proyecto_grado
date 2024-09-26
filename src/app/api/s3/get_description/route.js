import { NextResponse } from "next/server";
import { getDescriptions } from "../../services/s3Service";

export async function GET(req) {
    try {
        const url = new URL(req.url); 
        const folderPath = url.searchParams.get('folderPath');
        const fileName = url.searchParams.get('fileName');

        if (!folderPath) {
            return NextResponse.json({
                success: false,
                message: "Folder es requerido",
            });
        }

        if (!fileName) {
            return NextResponse.json({
                success: false,
                message: "Nombre del archivo es requerido",
            });
        }

        const result = await getDescriptions(folderPath, fileName);

        return NextResponse.json(result);

    }catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        })
    }
}

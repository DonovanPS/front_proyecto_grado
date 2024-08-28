import { NextResponse } from "next/server";
import { getDescriptions } from "../../services/s3Service";

export async function GET(req) {
    try {
        const url = new URL(req.url); 
        const folderPath = url.searchParams.get('folderPath');

        if (!folderPath) {
            return NextResponse.json({
                success: false,
                message: "Folder es requerido",
            });
        }

        const result = await getDescriptions(folderPath);

        return NextResponse.json(result);

    }catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        })
    }
}

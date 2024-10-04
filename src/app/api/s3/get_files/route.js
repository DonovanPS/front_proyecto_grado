import { NextResponse } from "next/server";
import { listFilesInFolder } from "../../services/s3Service";


export async function GET(req) {
    try {
        const url = new URL(req.url); // Crear un objeto URL a partir de la URL de la solicitud
        const folderPath = url.searchParams.get('folderPath'); // Obtener el parametro de consulta 'folderPath'


        if (!folderPath) {
            return NextResponse.json({
                success: false,
                message: "Folder es requerido",
            });
        }


        const result = await listFilesInFolder(folderPath);
        result.files = result.files.filter(file => file.Name); // Filtrar archivos sin nombre
        return NextResponse.json(result);


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        })
    }
}
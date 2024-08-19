import { NextResponse } from "next/server";
import { uploadFile } from "../../services/s3Service";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const folder = formData.get('folder');
        const files = formData.getAll('files');

        // Validaciones
        if (!folder) {
            return NextResponse.json({
                success: false,
                message: "El folder es requerido",
            });
        }

        if (!files || files.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No se han proporcionado archivos para subir",
            });
        }

        // Procesa los archivos correctamente
        const filesArray = await Promise.all(files.map(async (file) => ({
            originalname: file.name,  
            buffer: Buffer.from(await file.arrayBuffer()), 
            mimetype: file.type,
        })));

        
        const result = await uploadFile(filesArray, folder);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error al subir los archivos:", error);

        return NextResponse.json({
            success: false,
            message: "Ha ocurrido un error al subir los archivos",
        });
    }
}

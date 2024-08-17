import { NextResponse } from "next/server";
import { createFolder } from "../../services/s3Service";


export async function POST(req) {
    try{
        const { folderPath } = await req.json();
        const result = await createFolder(folderPath);
        return NextResponse.json(result);
    }catch(error){
       return NextResponse.json({
           success: false,
           message: "Ha ocurrido un error al crear la carpeta",
       });
    }
}
import { S3Client, ListObjectsV2Command, PutObjectCommand  } from "@aws-sdk/client-s3";


// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
});


const bucketName = process.env.AWS_BUCKET_NAME;

// Función para validar si una carpeta existe en S3
export const validFolder = async (folderPath) => {
  try {
   
    if (!folderPath) {
      throw new Error("Folder path is required");
    }

    // Configurar los parámetros para listar los objetos en la carpeta
    const params = {
      Bucket: bucketName,
      Prefix: folderPath.endsWith("/") ? folderPath : `${folderPath}/`,
      MaxKeys: 1,
    };

    
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    // Verificar si la carpeta contiene objetos
    const exists = response.Contents && response.Contents.length > 0;

    return {
      success: true,
      exists: exists ? true : false,
      message: exists ? "Folder existe" : "Folder no existe",
    };
  } catch (error) {
    // Manejo de errores
    console.error("Error checking folder existence:", error);

    return {
      success: false,
      exists: false,
      message: "AHa ocurrido un error al validar la existencia de la carpeta",
    };
  }
};

// Función para crear una carpeta en S3
export const createFolder = async (folderPath) => {
  try {
    if (!folderPath) {
      throw new Error("Folder path is required");
    }

    // Configurar los parámetros para crear la carpeta
    const params = {
      Bucket: bucketName,
      Key: folderPath.endsWith("/") ? folderPath : `${folderPath}/`,
    };

    // Crear la carpeta
    await s3Client.send(new PutObjectCommand(params));

    return {
      success: true,
      message: "Folder created successfully",
    };
  } catch (error) {
    // Manejo de errores
    console.error("Error creating folder:", error);

    return {
      success: false,
      message: "An error occurred while creating the folder",
    };
  }
};


export const uploadFile = async (files, folder) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided for upload");
    }
    
    if (!folder) {
      throw new Error("Folder path is required");
    }

    // Iterar sobre los archivos y subirlos uno por uno
    const uploadPromises = files.map(async (file) => {
      const fileKey = `${folder}/${file.originalname}`;

      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer, // Buffer del archivo para subirlo
        ContentType: file.mimetype, // Tipo de contenido MIME del archivo
      };

      // Subir el archivo a S3 usando PutObjectCommand
      await s3Client.send(new PutObjectCommand(params));
    });

    // Esperar a que todos los archivos sean subidos
    await Promise.all(uploadPromises);

    return {
      success: true,
      message: "Files uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading files:", error);

    return {
      success: false,
      message: "An error occurred while uploading files",
    };
  }
};

import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand   } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { read, utils } from 'xlsx';


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

    const sanitizedBucketName = bucketName.trim();
    const sanitizedFolderPath = folderPath.trim();

    console.log("Validating folder path:", sanitizedFolderPath);
    console.log("Bucket Name:", sanitizedBucketName);
    console.log("Bucket Name Length:", sanitizedBucketName.length);
    console.log("Folder Path Length:", sanitizedFolderPath.length);

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
      message: "Ha ocurrido un error al validar la existencia de la carpeta",
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


export const listFilesInFolder = async (folderPath) => {
  try {
    if (!folderPath) {
      throw new Error("Folder path is required");
    }

    // Configurar los parámetros para listar los objetos en la carpeta
    const params = {
      Bucket: bucketName,
      Prefix: folderPath.endsWith("/") ? folderPath : `${folderPath}/`,
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    // Función para formatear el tamaño del archivo
    const formatSize = (size) => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(2)} ${units[unitIndex]}`;
    };


    const formatName = (key) => {
      return key.split('/').pop();
    };

    // Obtener la lista de archivos con URL pre-firmada
    const files = await Promise.all(response.Contents.map(async (file) => {
      const url = await getSignedUrl(s3Client, new GetObjectCommand({
        Bucket: bucketName,
        Key: file.Key,
      }), { expiresIn: 3600 }); // URL válida por 1 hora (3600 segundos)

      return {
        Key: file.Key,
        Name: formatName(file.Key), // Formatear el nombre
        Size: formatSize(file.Size), // Formatear el tamaño
        LastModified: file.LastModified,
        Url: url, // Añadir la URL pre-firmada
      };
    }));

    return {
      success: true,
      files,
    };
  } catch (error) {
    console.error("Error al listar archivos en la carpeta:", error);

    return {
      success: false,
      message: "Ha ocurrido un error al listar los archivos en la carpeta",
    };
  }
};


export const getDescriptions = async (folderPath, fileName) => {
  try {
    if (!folderPath) {
      throw new Error("Folder path is required");
    }

    if (!fileName) {
      throw new Error("File name is required");
    }

    const fileKey = `${folderPath}/${fileName}`;

    // Obtener el archivo desde S3
    const getObjectParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    const command = new GetObjectCommand(getObjectParams);
    const response = await s3Client.send(command);

    // Leer el archivo Excel del stream
    const stream = response.Body;
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Leer el contenido del archivo Excel
    const workbook = read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Asumiendo que las descripciones están en la primera hoja
    const sheet = workbook.Sheets[sheetName];

    // Extraer la columna de descripciones (suponiendo que están en la columna 'A')
    const data = utils.sheet_to_json(sheet, { header: 1 });
    const descriptions = data.map((row) => row[0]).slice(1); // Quitar el encabezado

    return {
      success: true,
      descriptions,
    };
  } catch (error) {
    console.error("Error al extraer descripciones del archivo:", error);

    return {
      success: false,
      message: "Ha ocurrido un error al extraer las descripciones",
    };
  }
};

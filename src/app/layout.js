import { Inter } from "next/font/google";
import "./globals.css";

import { PrimeReactProvider } from 'primereact/api';
// Estilos de PrimeReact
import 'primereact/resources/themes/lara-dark-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Contexto
import { FileProvider } from "./context/fileContex";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Forecasting for Social Good: Predicciones y Análisis de Datos con Modelos Bayesianos",
  description: "Una plataforma interactiva para realizar predicciones de datos mediante modelos bayesianos, enfocada en el bienestar social. Los usuarios pueden cargar sus propios datos o explorar el conjunto de datos de medicamentos proporcionado en el folder 'demo'. Compara predicciones entre diferentes modelos y medicamentos, y analiza las correlaciones entre los elementos seleccionados. Desarrollado con Next.js y Python, este proyecto permite tomar decisiones informadas para promover el bien social a través del análisis avanzado de datos.",
  
  // Open Graph
  openGraph: {
    title: "Forecasting for Social Good: Predicciones y Análisis de Datos",
    description: "Plataforma para predicciones de datos con modelos bayesianos enfocados en el bienestar social.",
    url: "https://monograph.donovanps.site", // URL del sitio
    siteName: "Forecasting for Social Good",
    images: [
      {
        url: "/images/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Predicciones de datos con modelos bayesianos"
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",  
    site: "@DonovanPicon", 
    title: "Forecasting for Social Good",
    description: "Predicciones y análisis de datos con modelos bayesianos para el bienestar social.",
    image: "/images/og-image.png", 
    creator: "@DonovanPicon", 
  },

  // Metadatos adicionales (Autor y contexto del proyecto)
  author: "Donovan Picon",  
  keywords: "trabajo de grado, modelos bayesianos, predicción de datos, bienestar social, análisis de datos", // Palabras clave relevantes
  robots: "index, follow", 
  article: {
    author: "Donovan Picon", 
    published_time: "2024-12-01T12:00:00Z",  
    modified_time: "2024-12-01T12:00:00Z",  
    section: "Trabajo de Grado",  
    tag: "Trabajo de Grado, predicciones de datos, modelos bayesianos"
  }
};


export default function RootLayout({ children }) {
  return (
    <FileProvider>

      <PrimeReactProvider>
        <html lang="en">
        <body className={`${inter.className} p-4 md:p-6 bg-gradient-to-r from-gray-200 via-gray-100 to-white dark:from-gray-900 dark:to-gray-800`}>
        <Analytics />{children}<SpeedInsights/></body>
        </html>
      </PrimeReactProvider>
    </FileProvider>
  );
}

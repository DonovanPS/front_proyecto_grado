import { Inter } from "next/font/google";
import "./globals.css";

import { PrimeReactProvider } from 'primereact/api';
// Estilos de PrimeReact
import 'primereact/resources/themes/lara-dark-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { Analytics } from "@vercel/analytics/react"

// Contexto
import { FileProvider } from "./context/fileContex";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Forecasting for Social Good: Predicciones y Análisis de Datos con Modelos Bayesianos",
  description: "Una plataforma interactiva para realizar predicciones de datos mediante modelos bayesianos, enfocada en el bienestar social. Los usuarios pueden cargar sus propios datos o explorar el conjunto de datos de medicamentos proporcionado en el folder 'demo'. Compara predicciones entre diferentes modelos y medicamentos, y analiza las correlaciones entre los elementos seleccionados. Desarrollado con Next.js y Python, este proyecto permite tomar decisiones informadas para promover el bien social a través del análisis avanzado de datos.",
};

export default function RootLayout({ children }) {
  return (
    <FileProvider>

      <PrimeReactProvider>
        <html lang="en">
          <body className={`${inter.className} m-6 mx-8 `}> <Analytics />{children}</body>
        </html>
      </PrimeReactProvider>
    </FileProvider>
  );
}

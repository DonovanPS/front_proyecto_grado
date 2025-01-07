"use client"

import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Timeline } from "primereact/timeline";
import Image from "next/image";
import { Dialog } from 'primereact/dialog';
import FolderSelector from "@/components/Folder/FolderSelector";

// Función para agregar animación de aparición con scroll
const useScrollAnimation = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -40% 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
};

const CustomizedContent = ({ item }) => {
  const elementRef = useRef(null);
  const isVisible = useScrollAnimation(elementRef);

  return (
    <Card
      title={item.status}
      subTitle={item.date}
      className={`shadow-3 p-3 timeline-item transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ borderRadius: "12px" }}
      ref={elementRef}
    >
      <div className="flex items-center gap-2">
        {item.image && (
          <div className="flex-shrink-0 hidden sm:block">
            <Image
              src={item.image}
              alt={item.name ? item.name : `Imagen relacionada con ${item.status}`}
              width={100}
              height={100}
              className="shadow-2 border-round"
            />
          </div>
        )}

        <div className="w-full">
          <p className="text-left sm:text-center">{item.description}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          label="Leer más"
          icon="pi pi-arrow-right"
          className="p-button-text p-button-rounded"
        />
      </div>

    </Card>
  );
};

export default function HomePage() {

  const [visible, setVisible] = useState(false);
  const [showTableAndPredictions, setShowTableAndPredictions] = useState(false);

  const events = [
    {
      status: "Carga de Datos",
      date: "Paso 1",
      icon: "pi pi-upload",
      color: "#1ABC9C",
      image: "/images/carga-de-archivos.png",
      description: "Carga tus propios datos o utiliza los conjuntos de datos de demostración incluidos."
    },
    {
      status: "Selección de Modelo",
      date: "Paso 2",
      icon: "pi pi-cog",
      color: "#3498DB",
      description: "Compara predicciones generadas por diferentes modelos matemáticos avanzados."
    },
    {
      status: "Generación de Predicciones",
      date: "Paso 3",
      icon: "pi pi-chart-line",
      color: "#E67E22",
      description: "Genera predicciones utilizando la lógica bayesiana para diferentes escenarios."
    },
    {
      status: "Análisis de Resultados",
      date: "Paso 4",
      icon: "pi pi-eye",
      color: "#E74C3C",
      description: "Analiza los resultados obtenidos a través de gráficos interactivos y métricas clave."
    },
  ];

  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-b from-teal-400 to-teal-600 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
          Forecasting for Social Good
        </h1>
        <p className="text-lg sm:text-xl">
          Predicciones y análisis de datos con lógica bayesiana para optimizar la distribución equitativa de medicamentos de alto costo.
        </p>
      </div>

      <Divider className="my-6 sm:my-8" />

      {/* Descripción del Proyecto */}
      <Card
        title="Sobre la Plataforma"
        className="mb-8 shadow-2 p-5"
        style={{ background: "#2C3E50", color: "#ECF0F1", borderRadius: "12px" }}
      >
        <p className="m-0">
          Nuestra plataforma utiliza modelos bayesianos avanzados para realizar pronósticos precisos y facilitar la toma de decisiones informadas. Diseñada para abordar problemas sociales críticos, permite optimizar la accesibilidad y distribución de medicamentos esenciales.
        </p>
      </Card>

      {/* Características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4">
        <Card
          title="Carga de Datos"
          className="shadow-2 bg-[#34495E] text-[#ECF0F1] w-full"
          style={{ borderRadius: "12px" }}
        >
          <p>Carga tus propios datos o utiliza los conjuntos de datos de demostración incluidos.</p>
        </Card>
        <Card
          title="Modelos Bayesianos"
          className="shadow-2 bg-[#2C3E50] text-[#ECF0F1] w-full"
          style={{ borderRadius: "12px" }}
        >
          <p>Compara predicciones generadas por diferentes modelos matemáticos avanzados.</p>
        </Card>
        <Card
          title="Análisis Visual"
          className="shadow-2 bg-[#22313F] text-[#ECF0F1] w-full"
          style={{ borderRadius: "12px" }}
        >
          <p>Explora gráficos interactivos y relaciones entre variables clave.</p>
        </Card>
      </div>

      <Divider className="my-6 sm:my-8" />

      {/* Proceso */}
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-cyan-600 dark:text-cyan-300">
        ¿Cómo Funciona?
      </h2>
      <Timeline
        value={events}
        align="alternate"
        className="customized-timeline"
        marker={customizedMarker}
        content={(item) => <CustomizedContent item={item} />}
      />

      <div className="text-center mt-8">
        <Button
          label="Explorar la Plataforma"
          icon="pi pi-arrow-right"
          className="p-button-raised p-button-lg p-button-primary"
          style={{ borderRadius: "12px" }}
          onClick={() => setVisible(true)}
        />
      </div>

      {/* Dialog */}
      <Dialog
        header="Seleccione una carpeta"
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-full sm:w-3/4 lg:w-1/2"
      >
        <div className="flex flex-col justify-center items-center w-full h-full">
          <FolderSelector setShowTableAndPredictions={setShowTableAndPredictions} />
        </div>
      </Dialog>
    </div>
  );
}

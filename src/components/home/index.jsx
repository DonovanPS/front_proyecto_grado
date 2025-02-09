"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import "./animate.css";
import "./bootstrap.css";
import "./maicons.css";
import "./theme.css";

import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import FolderSelector from "@/components/Folder/FolderSelector";

// --- Custom Hook for Scroll Animation ---
const useScrollAnimation = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -40% 0px",
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isVisible;
};

// --- Customized Content Component for Timeline ---
const CustomizedContent = ({ item, onOpenModal }) => {
  const elementRef = useRef(null);
  const isVisible = useScrollAnimation(elementRef);

  return (
    <Card
      title={<h5>{item.status}</h5>}
      subTitle={<p>{item.date}</p>}
      className={`shadow-3 p-3 timeline-item bg-transparent transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ borderRadius: "12px" }}
      ref={elementRef}
    >
      <div className="flex items-center gap-2">
        {item.image && (
          <div className="flex-shrink-0 hidden sm:block">
            <Image
              src={item.image}
              alt={
                item.name ? item.name : `Imagen relacionada con ${item.status}`
              }
              width={100}
              height={100}
              className="shadow-2 border-round"
            />
          </div>
        )}
        <div className="w-full">
          <p className="text-left sm:text-center ">{item.description}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          label="Leer más"
          icon="pi pi-arrow-right"
          className="p-button-text p-button-rounded"
          onClick={() =>
            onOpenModal(item.videoSrc, item.detailedDescription, item.date)
          }
        />
      </div>
    </Card>
  );
};

// --- Main Component ---
export default function IndexComponent() {
  const [visible, setVisible] = useState(false);
  const [showTableAndPredictions, setShowTableAndPredictions] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const WOW = require("wowjs").WOW;
      new WOW().init();
    }
  }, []);

  const events = [
    {
      status: "Explora la Plataforma",
      date: "Paso 1",
      icon: "pi pi-compass",
      color: "#1ABC9C",
      description:
        "Accede a la plataforma explorando las carpetas de datos. Introduce el nombre de la carpeta y decide si acceder a una existente o crear una nueva.",
      videoSrc: "/videos/paso1.mp4",
      detailedDescription:
        "Acceso a la plataforma:\n\n" +
        "1. Haz clic en 'Explora la plataforma'\n" +
        "2. **Introduce nombre de carpeta** (Ej: 'demo')\n" +
        "3. El sistema verificará:\n" +
        "   - **Carpeta existente**: Click en 'Acceder'\n" +
        "   - **Carpeta nueva**: Click en 'Crear'\n\n" +
        "Listo para cargar datos en el siguiente paso.",
    },

    {
      status: "Carga de Datos",
      date: "Paso 2",
      icon: "pi pi-upload",
      color: "#3498DB",
      image: "/images/carga-de-archivos.png",
      description:
        "Carga tus propios datos o utiliza los conjuntos de datos de demostración incluidos.",
      videoSrc: "/videos/paso1.mp4",
      detailedDescription:
        "Carga de archivos:\n\n" +
        "1. **Seleccionar archivo**:\n" +
        "   - Click en 'Seleccionar' y elige tu archivo\n" +
        "   - O arrástralo directamente al área marcada\n\n" +
        "2. **Iniciar carga**:\n" +
        "   - Click en 'Subir' para cargar el archivo\n\n" +
        "3. Confirmación:\n" +
        "   - Mensaje de éxito al completarse\n" +
        "   - Archivo visible en la tabla\n\n" +
        "Listo para seleccionar modelos en el siguiente paso.",
    },
    {
      status: "Selección de Modelo",
      date: "Paso 3",
      icon: "pi pi-cog",
      color: "#E67E22",
      videoSrc: "/videos/paso1.mp4",
      description: "Compara predicciones generadas por diferentes modelos.",
      detailedDescription:
        "Configuración de modelos:\n\n" +
        "1. **Elegir tipo de modelo**:\n" +
        "   - Predeterminado: Aplicar mismo modelo a todos\n" +
        "   - **Personalizado**: Modelo diferente por medicamento\n\n" +
        "2. **Seleccionar medicamentos**:\n" +
        "   - Autocompletado con nombres del archivo cargado\n" +
        "   - Agrega múltiples con el botón '+'\n\n" +
        "3. **Definir período**:\n" +
        "   - Meses a predecir (ej: 6 meses)\n\n" +
        "4. **Generar predicciones**:\n" +
        "   - Click en 'Obtener Predicción'" 
        
    },
    {
      status: "Generación de Predicciones",
      date: "Paso 4",
      icon: "pi pi-chart-line",
      color: "#E74C3C",
      videoSrc: "/videos/paso1.mp4",
      description:
        "Genera predicciones utilizando la lógica bayesiana para diferentes escenarios.",
      detailedDescription:
        "Proceso de predicción:\n\n" +
        "1. **Iniciar cálculo**:\n" +
        "   - El sistema procesará cada medicamento seleccionado\n" +
        "   - Barra de progreso visible durante el cálculo\n\n" +
        "2. **Visualización inicial**:\n" +
        "   - Gráfico principal con tendencia predictiva"
    },
    {
      status: "Análisis de Resultados",
      date: "Paso 5",
      icon: "pi pi-eye",
      color: "#9B59B6",
      videoSrc: "/videos/paso1.mp4",
      description:
        "Analiza los resultados obtenidos a través de gráficos interactivos y métricas clave.",
        detailedDescription:
        "Exploración de resultados:\n\n" +
        "1. **Herramientas visuales**:\n" +
        "   - Zoom en períodos específicos\n" +
        "   - Filtros por rango de fechas\n\n" +
        "2. **Comparación**:\n" +
        "   - Superposición de múltiples predicciones\n" +
        "   - Análisis comparativo entre modelos\n\n" +
        "4. **Exportación**:\n" +
        "   - Descarga de gráficos en PNG/PDF\n" +
        "   - Exportar datos a CSV/Excel" 
     
    },
  ];

  const customizedMarker = (item) => (
    <span
      className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
      style={{ backgroundColor: item.color }}
    >
      <i className={item.icon}></i>
    </span>
  );

  const handleOpenModal = (videoSrc, detailedDescription, date) => {
    setSelectedVideo(videoSrc);
    setSelectedDescription(detailedDescription);
    setStep(date);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setSelectedDescription(null);
  };

  // Modal video

  const ModalVideo = ({
    videoSrc,
    visible,
    onHide,
    step,
    detailedDescription,
  }) => {
    // Añadimos 'detailedDescription' como prop
    const videoRef = useRef(null);

    useEffect(() => {
      if (visible && videoRef.current) {
        videoRef.current.play().catch((error) => {
          // Manejar error de autoplay
          console.log("Autoplay error:", error);
        });
      }
    }, [visible]);

    return (
      <Dialog
        header={step}
        visible={visible}
        onHide={onHide}
        dismissableMask
        style={{
          width: "min(600px, 90vw)",
          borderRadius: "12px",
        }}
        contentStyle={{
          padding: 0,
          overflow: "hidden", // Importante para que el contenido no se desborde del contenedor con aspectRatio
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {" "}
          {/* Usamos un contenedor flex vertical */}
          <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
            {" "}
            {/* Contenedor para el video con aspectRatio */}
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              style={{
                objectFit: "cover",
                borderRadius: "12px 12px 0 0", // Bordes redondeados solo en la parte superior
              }}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
          {detailedDescription && (
            <div style={{ padding: "1rem", borderRadius: "0 0 12px 12px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#f9f9f9",
                  whiteSpace: "pre-line",
                }}
                dangerouslySetInnerHTML={{
                  __html: detailedDescription.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </div>
          )}
        </div>
      </Dialog>
    );
  };

  return (
    <div>
      {/* --- Navbar Section --- */}
      <nav className="navbar navbar-expand-lg navbar-light navbar-float">
        <div className="container">
          <a href="index.html" className="navbar-brand text-white no-underline">
            Fore<span className="text-primary">Casting.</span>
          </a>
        </div>
      </nav>

      {/* --- Page Banner Section --- */}
      <div className="page-banner home-banner">
        <div className="container h-100">
          <div className="row align-items-center h-100">
            <div className="col-lg-6 py-3 wow fadeInUp">
              <h1 className="mb-4 text-white">Forecasting for Social Good</h1>
              <p className="text-lg mb-5 text-white">
                Predicciones y análisis de datos con lógica bayesiana para
                optimizar la distribución equitativa de medicamentos de alto
                costo.
              </p>
            </div>
            <div className="col-lg-6 py-3 wow zoomIn">
              <div className="img-place">
                <img src="/images/bg_image_1.png" alt="Background" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <main>
        {/* Features Section */}
        <div className="page-section features bg-transparent">
          <div className="container">
            <div className="row justify-content-center">
              {[
                {
                  title: "Prophet",
                  description:
                    "Prophet es un modelo predictivo que utiliza la lógica bayesiana para el pronóstico de series temporales.  Está diseñado para manejar datos con estacionalidad y tendencias, realizando predicciones robustas y proporcionando intervalos de confianza que reflejan la incertidumbre inherente en los pronósticos.",
                },
                {
                  title: "SARIMAX",
                  description:
                    "SARIMAX es un modelo avanzado que emplea la lógica bayesiana para el análisis de series temporales complejas.  Permite modelar patrones estacionales y la influencia de variables externas, ofreciendo predicciones detalladas y adaptadas a series temporales con múltiples factores.",
                },
                {
                  title: "XGBoost",
                  description:
                    "XGBoost es un modelo predictivo de alto rendimiento que, utilizando una lógica avanzada inspirada en principios bayesianos,  permite realizar predicciones precisas y eficientes.  Es especialmente potente para capturar relaciones complejas en los datos y ofrece resultados robustos en diversas tareas predictivas.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="col-md-6 col-lg-4 py-3 wow fadeInUp"
                >
                  <div className="d-flex flex-row">
                    <div className="img-fluid mr-3">
                      <img src="/images/icon_pattern.svg" alt="Icon" />
                    </div>
                    <div>
                      <h5 className="text-white">{feature.title}</h5>
                      <p className="!text-[#cccccf]">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-teal-400 to-teal-600 dark:from-gray-900 dark:to-gray-800">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-cyan-600 dark:text-cyan-300">
            ¿Cómo Funciona?
          </h2>
          <Timeline
            value={events}
            align="alternate"
            className="customized-timeline"
            marker={customizedMarker}
            content={(item) => (
              <CustomizedContent item={item} onOpenModal={handleOpenModal} />
            )}
          />

          <ModalVideo
            videoSrc={selectedVideo}
            visible={!!selectedVideo}
            onHide={handleCloseModal}
            detailedDescription={selectedDescription}
            step={step}
          />
        </div>

        {/* Predictive Model Section */}
        <div className="page-section bg-transparent">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 py-3 wow zoomIn">
                <div className="img-place text-center">
                  <img
                    src="/images/bg_image_2.png"
                    alt="Validación del modelo"
                  />
                </div>
              </div>
              <div className="col-lg-6 py-3 wow fadeInRight">
                <h2 className="title-section text-white">
                  Modelo Predictivo para{" "}
                  <span className="marked">Mejorar Accesibilidad</span>
                </h2>
                <div className="divider"></div>
                <p className="!text-[#cccccf]">
                  Se Desarrollo y valido los modelos predictivos mediante
                  pruebas iterativas, asegurando precisión y capacidad para
                  anticipar cambios en la demanda.
                </p>
                <a href="#" className="btn btn-primary">
                  Explorar Modelos
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div className="page-section bg-transparent">
          <div className="container">
            <div className="text-center wow fadeInUp">
              <div className="subhead">Enfoque</div>
              <h2 className="title-section text-white">
                Por qué <span className="marked">Forecasting for Social</span>
              </h2>
              <div className="divider mx-auto"></div>
            </div>

            <div className="row mt-5 text-center">
              {[
                {
                  title: "Precisión Bayesiana",
                  description:
                    "Modelos diseñados para minimizar incertidumbres en datos complejos.",
                  icon: "mai-shapes",
                },
                {
                  title: "Análisis Personalizado",
                  description:
                    "Herramientas ajustadas a las necesidades de salud pública.",
                  icon: "mai-analytics",
                },
                {
                  title: "Impacto Social",
                  description:
                    "Optimización de recursos para garantizar bienestar y equidad.",
                  icon: "mai-stats-chart",
                },
              ].map((approach, index) => (
                <div key={index} className="col-lg-4 py-3 wow fadeInUp">
                  <div className="display-3">
                    <span className={`${approach.icon} text-white`}></span>
                  </div>
                  <h5 className="text-white">{approach.title}</h5>
                  <p className="!text-[#cccccf]">{approach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

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
      >
        <div className="flex flex-col justify-center items-center w-full h-full">
          <FolderSelector
            setShowTableAndPredictions={setShowTableAndPredictions}
          />
        </div>
      </Dialog>

      {/* --- Footer Section --- */}
      <footer className="page-footer bg-transparent">
        <Divider className="my-6 sm:my-8" />
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6 py-3 text-center">
              <h3>
                Forecasting<span className="text-primary">Bayes.</span>
              </h3>
              <p>
                Optimización de la distribución equitativa de medicamentos a
                través de modelos predictivos.
              </p>
              <p>
                <a
                  className="no-underline"
                  href="mailto:donovan.picon.sossa@gmail.com "
                >
                  donovan.picon.sossa@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

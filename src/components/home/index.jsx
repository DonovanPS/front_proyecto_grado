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
import FolderSelector from "../Folder/FolderSelector";

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
const CustomizedContent = ({ item }) => {
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
        />
      </div>
    </Card>
  );
};

// --- Main Component ---
export default function IndexComponent() {
  const [visible, setVisible] = useState(false);
  const [showTableAndPredictions, setShowTableAndPredictions] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const WOW = require("wowjs").WOW;
      new WOW().init();
    }
  }, []);

  const events = [
    {
      status: "Carga de Datos",
      date: "Paso 1",
      icon: "pi pi-upload",
      color: "#1ABC9C",
      image: "/images/carga-de-archivos.png",
      description:
        "Carga tus propios datos o utiliza los conjuntos de datos de demostración incluidos.",
    },
    {
      status: "Selección de Modelo",
      date: "Paso 2",
      icon: "pi pi-cog",
      color: "#3498DB",
      description:
        "Compara predicciones generadas por diferentes modelos matemáticos avanzados.",
    },
    {
      status: "Generación de Predicciones",
      date: "Paso 3",
      icon: "pi pi-chart-line",
      color: "#E67E22",
      description:
        "Genera predicciones utilizando la lógica bayesiana para diferentes escenarios.",
    },
    {
      status: "Análisis de Resultados",
      date: "Paso 4",
      icon: "pi pi-eye",
      color: "#E74C3C",
      description:
        "Analiza los resultados obtenidos a través de gráficos interactivos y métricas clave.",
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

  return (
    <div>
      {/* --- Navbar Section --- */}
      <nav className="navbar navbar-expand-lg navbar-light navbar-float">
        <div className="container">
          <a href="index.html" className="navbar-brand text-white">
            Fore<span className="text-primary">Casting.</span>
          </a>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
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
                  title: "Carga de Datos",
                  description:
                    "Carga tus propios datos o utiliza los conjuntos de datos de demostración incluidos.",
                },
                {
                  title: "Modelos Bayesianos",
                  description:
                    "Compara predicciones generadas por diferentes modelos matemáticos avanzados.",
                },
                {
                  title: "Análisis Visual",
                  description:
                    "Explora gráficos interactivos y relaciones entre variables clave.",
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
            content={(item) => <CustomizedContent item={item} />}
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
                <a href="mailto:donovan.picon.sossa@gmail.com">
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

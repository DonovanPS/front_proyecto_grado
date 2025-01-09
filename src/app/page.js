"use client"

import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Timeline } from "primereact/timeline";
import Image from "next/image";
import { Dialog } from 'primereact/dialog';
import FolderSelector from "@/components/Folder/FolderSelector";
import IndexComponent from "@/components/home";

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




 

  return (
    <>
      <IndexComponent />
  
    </>
  );
}

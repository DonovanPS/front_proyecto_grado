"use client";

import { Button } from "primereact/button";
import { useState } from "react";

export default function Page() {
    const [loading, setLoading] = useState(false);

    const sendData = async () => {
        setLoading(true); 

        const jsonData = {

            'LUCES': {
                'Frontales': { 'Lunes': true, 'Martes': false, 'Miercoles': false, 'Jueves': 'null', 'Viernes': false, 'Sabado': true, 'Domingo': 'null' },
                'Traseras': { 'Lunes': true, 'Martes': 'null', 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': 'null', 'Sabado': false, 'Domingo': false },
                'Direccionales Delanteras de Parqueo': { 'Lunes': true, 'Martes': false, 'Miercoles': true, 'Jueves': true, 'Viernes': true, 'Sabado': false, 'Domingo': 'null' },
                'Direccionales Traseras de Parqueo': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': true, 'Jueves': 'null', 'Viernes': true, 'Sabado': 'null', 'Domingo': false },
                'Luz Reversa': { 'Lunes': 'null', 'Martes': true, 'Miercoles': true, 'Jueves': 'null', 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Stop ': { 'Lunes': 'null', 'Martes': false, 'Miercoles': true, 'Jueves': false, 'Viernes': false, 'Sabado': false, 'Domingo': true }
            },
            'CABINA': {
                'Espejo Central Convexo': { 'Lunes': 'null', 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': false, 'Sabado': false, 'Domingo': 'null' },
                'Espejo Central Convexo': { 'Lunes': 'null', 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': false, 'Sabado': false, 'Domingo': 'null' },
                'Espejos Laterales': { 'Lunes': false, 'Martes': 'null', 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Alarma de Retroceso': { 'Lunes': false, 'Martes': true, 'Miercoles': true, 'Jueves': 'null', 'Viernes': false, 'Sabado': true, 'Domingo': true },
                'Pito': { 'Lunes': true, 'Martes': 'null', 'Miercoles': false, 'Jueves': false, 'Viernes': 'null', 'Sabado': true, 'Domingo': true }
            },
            'FRENO DE SERVICIO': {
                'FRENO DE SERVICIO': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': 'null', 'Jueves': true, 'Viernes': false, 'Sabado': true, 'Domingo': 'null' }
            },
            'FRENO DE EMERGENCIA': {
                'Recamaras': { 'Lunes': false, 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': 'null', 'Sabado': 'null', 'Domingo': 'null' },
                'Freno de Aire': { 'Lunes': false, 'Martes': 'null', 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': 'null', 'Sabado': true, 'Domingo': false },
                'Compresor de Aire': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': false, 'Jueves': 'null', 'Viernes': 'null', 'Sabado': true, 'Domingo': 'null' },
                'Direccion Suspension Terminales': { 'Lunes': 'null', 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': true, 'Sabado': false, 'Domingo': false },
                'Pasadores, Suspension': { 'Lunes': true, 'Martes': false, 'Miercoles': true, 'Jueves': 'null', 'Viernes': false, 'Sabado': 'null', 'Domingo': true },
                'Cinturon de Seguridad': { 'Lunes': false, 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': 'null', 'Sabado': false, 'Domingo': true },
                'Barra Antivuelco': { 'Lunes': false, 'Martes': 'null', 'Miercoles': true, 'Jueves': 'null', 'Viernes': true, 'Sabado': true, 'Domingo': true },
                'Vidrio Frontal en Buen Estado': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': 'null', 'Jueves': true, 'Viernes': 'null', 'Sabado': 'null', 'Domingo': true },
                'Limpia Brisas': { 'Lunes': true, 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Asiento en Buenas Condiciones': { 'Lunes': 'null', 'Martes': false, 'Miercoles': false, 'Jueves': true, 'Viernes': false, 'Sabado': true, 'Domingo': 'null' }
            },
            'INDICADORES DE SERVICIO': {
                'Indicador de Temperatura': { 'Lunes': true, 'Martes': false, 'Miercoles': true, 'Jueves': 'null', 'Viernes': 'null', 'Sabado': true, 'Domingo': 'null' },
                'Indicador de Aceite': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': true, 'Jueves': 'null', 'Viernes': true, 'Sabado': 'null', 'Domingo': true },
                'Nivel de Combustible': { 'Lunes': false, 'Martes': false, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': 'null', 'Sabado': true, 'Domingo': true },
                'Aditivos de Radiador (Refrigerante)': { 'Lunes': 'null', 'Martes': true, 'Miercoles': 'null', 'Jueves': 'null', 'Viernes': true, 'Sabado': 'null', 'Domingo': 'null' },
                'Medidor de Combustible': { 'Lunes': true, 'Martes': 'null', 'Miercoles': 'null', 'Jueves': true, 'Viernes': 'null', 'Sabado': true, 'Domingo': true }
            },
            'MOTOR': {
                'Escalera y Pasamanos': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': 'null', 'Jueves': true, 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Bateria y Cables': { 'Lunes': false, 'Martes': 'null', 'Miercoles': true, 'Jueves': true, 'Viernes': true, 'Sabado': false, 'Domingo': 'null' },
                'Tapas de Radiador': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': 'null', 'Jueves': false, 'Viernes': false, 'Sabado': 'null', 'Domingo': 'null' },
                'Tapa de Liquido de Frenos': { 'Lunes': true, 'Martes': 'null', 'Miercoles': 'null', 'Jueves': true, 'Viernes': false, 'Sabado': true, 'Domingo': false },
                'Tapa de Aceite': { 'Lunes': 'null', 'Martes': true, 'Miercoles': 'null', 'Jueves': false, 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Fugas de Aceite': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': true, 'Jueves': true, 'Viernes': true, 'Sabado': false, 'Domingo': true },
                'Filtros de Aire': { 'Lunes': true, 'Martes': 'null', 'Miercoles': false, 'Jueves': false, 'Viernes': 'null', 'Sabado': true, 'Domingo': 'null' }
            },
            'EQUIPO DE CARRETERA': {
                'Gato/Accesorios': { 'Lunes': false, 'Martes': 'null', 'Miercoles': false, 'Jueves': true, 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Equipo de Señalizacion': { 'Lunes': false, 'Martes': true, 'Miercoles': true, 'Jueves': 'null', 'Viernes': false, 'Sabado': true, 'Domingo': false },
                'Herramientas': { 'Lunes': 'null', 'Martes': true, 'Miercoles': false, 'Jueves': true, 'Viernes': true, 'Sabado': true, 'Domingo': false },
                'Linterna': { 'Lunes': false, 'Martes': 'null', 'Miercoles': true, 'Jueves': true, 'Viernes': 'null', 'Sabado': true, 'Domingo': false },
                'Llanta de Repuesto': { 'Lunes': true, 'Martes': 'null', 'Miercoles': false, 'Jueves': false, 'Viernes': true, 'Sabado': false, 'Domingo': false },
                'Botiquin de Primeros Auxilios': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': true, 'Jueves': false, 'Viernes': false, 'Sabado': 'null', 'Domingo': false },
                'Extintor / 20 lbs / 30 Ibs': { 'Lunes': 'null', 'Martes': 'null', 'Miercoles': 'null', 'Jueves': false, 'Viernes': true, 'Sabado': true, 'Domingo': 'null' },
                'Tacos': { 'Lunes': false, 'Martes': false, 'Miercoles': false, 'Jueves': false, 'Viernes': 'null', 'Sabado': true, 'Domingo': true },
                'Otros': { 'Lunes': true, 'Martes': 'null', 'Miercoles': false, 'Jueves': 'null', 'Viernes': true, 'Sabado': true, 'Domingo': false }
            }

        };

        try {
            const response = await fetch('https://llenar-formulario-excel.onrender.com/rellenar_excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (response.ok) {
                // Convierte la respuesta a Blob (archivo binario)
                const blob = await response.blob();
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plantilla_modificada.xlsx'; 
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Error al enviar los datos:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div>
            <h1>Enviar Datos al Backend</h1>
            <Button onClick={sendData} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Datos'}
            </Button>
        </div>
    );
}

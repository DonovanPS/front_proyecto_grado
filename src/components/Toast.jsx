"use client";

import React, { useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';

export default function PrimeReactToast({ message }) {
  const toast = useRef(null);

  useEffect(() => {
    if (message && toast.current) {
      toast.current.show({
        severity: message.severity,
        summary: message.summary,
        detail: message.content,
        life: message.time ? message.time : 3000,
      });
    }
  }, [message]);

  const position = message && message.position ? message.position : 'top-right';


  return (
    <Toast ref={toast} position={position} />
  );
}

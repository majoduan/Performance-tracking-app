import { Docente } from "../types/AfinidadDocente";

export const obtenerHistorialDocentes = async (
  id_docente: number
): Promise<Docente[]> => {
  const url = `https://syncademic-0-1.onrender.com/syncademic/evaluacion-docente/evaluaciones-docente/${id_docente}/`;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data.map((item: any) => ({
        tipo_evaluacion: item.evaluacion.tipo_evaluacion,
        calificacion: item.evaluacion.calificacion,
        periodo: item.evaluacion.periodo,
      }));
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
};
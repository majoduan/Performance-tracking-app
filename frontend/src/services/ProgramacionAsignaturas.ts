import { Asignatura } from "../types/AfinidadDocente";

export const obtenerProgramacionAsignatura = async (): Promise<Asignatura[]> => {
  const url = `https://syncademic-0-1.onrender.com/syncademic/asignatura/`;

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
    .then((data: Asignatura[]) => {
        return data.map(({ id_asignatura, nombre }) => ({ id_asignatura, nombre }));
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
};

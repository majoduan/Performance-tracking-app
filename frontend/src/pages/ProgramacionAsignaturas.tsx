import React, { useEffect, useState } from 'react';
import ListadoAsignatura from '../components/ListadoAsignatura';
import DocentesAfines from './DocentesAfines';
import { obtenerProgramacionAsignatura } from '../services/ProgramacionAsignaturas';
import { Asignatura } from '../types/AfinidadDocente'; 

import '../styles/pages/ProgramacionAsignaturas.css';
import { useContextoGlobal } from '../ContextoGlobal';

const ListadoAsignaturas: React.FC = () => {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const {paginaActual} = useContextoGlobal();

  useEffect(() => {
    const cargarAsignaturas = async () => {
      try {
        const asignaturasData = await obtenerProgramacionAsignatura();
        setAsignaturas(asignaturasData);
      } catch (error) {
        console.error('Error al cargar las asignaturas:', error);
      }
    };

    cargarAsignaturas();
  }, []);


    // Obtener el nombre de la primera asignatura para mostrar cuando paginaActual es "DocentesAfines"
    const asignaturaDocenteAfines = paginaActual === "DocentesAfines" && asignaturas.length > 0 
    ? asignaturas[0].nombre 
    : '';

  return (
    <div className="listado-asignaturas">
      <h1 className='cursos-title'>
        <strong>
          {paginaActual === "DocentesAfines" && asignaturaDocenteAfines 
            ? `Asignatura: ${asignaturaDocenteAfines}` 
            : 'Asignaturas'}
        </strong>
      </h1>
      <div className='container-asignaturas'>
        {!(paginaActual=="DocentesAfines")&&asignaturas.map((asignatura) => (
          <ListadoAsignatura 
            key={asignatura.id_asignatura} 
            course={asignatura.nombre} 
            id_asignatura={asignatura.id_asignatura}
          />
        ))}
        {paginaActual=="DocentesAfines" && 
        <DocentesAfines />
        }
      </div>
    </div>
  );
};

export default ListadoAsignaturas;
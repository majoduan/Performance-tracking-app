import Button from "react-bootstrap/Button";
import { useContextoGlobal } from '../ContextoGlobal';
import ImagenMateria from "../assets/materia.jpg";
import DocentesAfines from "../pages/DocentesAfines"

import '../styles/components/ListadoAsignatura.css';

type MateriasProps = {
  course: string;
  id_asignatura: number;
};

function ListadoAsignatura({course,  id_asignatura }: MateriasProps) {
  const { setPaginaActual, setAsignaturaSeleccionada } = useContextoGlobal()

    const cambiarPagina = (pagina: string) => {
      setAsignaturaSeleccionada(id_asignatura);
      setPaginaActual(pagina);

    }
  
    return (
    <div className="materia">
      <div className="materia-contenido">
        <div className="materia-course">
          <img src={ImagenMateria} alt="course content" />
          <h3>{course}</h3>
          <div className="btn-acceder-materia d-grid">
                    <Button variant="success" onClick={()=> cambiarPagina("DocentesAfines")}>
                        Acceder
                    </Button>
                </div>

        </div>
      </div>
    </div>
  );
}

export default ListadoAsignatura;

import React, { useEffect, useState } from 'react';
import { useContextoGlobal } from '../ContextoGlobal';
import { obtenerDocentes } from '../services/Docentes';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from 'react-bootstrap/Dropdown';
import { Docente } from '../types/AfinidadDocente';

const DocentesAfines: React.FC = () => {
  const { asignaturaSeleccionada, setPaginaActual} = useContextoGlobal();
  const [docentesTotal, setDocentesTotal] = useState<Docente[]>([]);
  const [docentesCoevaluacion, setDocentesCoevaluacion] = useState<Docente[]>([]);
  const [docentesAutoevaluacion, setDocentesAutoevaluacion] = useState<Docente[]>([]);
  const [docentesHeteroevaluacion, setDocentesHeteroevaluacion] = useState<Docente[]>([]);
  const [filtro, setFiltro] = useState<string>('TOTAL');
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);

  useEffect(() => {
    const fetchDocentes = async () => {
      if (asignaturaSeleccionada) {
        try {
          const docentes = await obtenerDocentes(asignaturaSeleccionada);
          setDocentesTotal(docentes);
          setDocentesCoevaluacion(docentes); // Ajustar según sea necesario
          setDocentesAutoevaluacion(docentes); // Ajustar según sea necesario
          setDocentesHeteroevaluacion(docentes); // Ajustar según sea necesario
        } catch (error) {
          console.error('Error obteniendo profesores:', error);
        }
      }
    };

    fetchDocentes();
  }, [asignaturaSeleccionada]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (docente: Docente) => {
    setSelectedDocente(docente);
    setShowModal(true);
  };

  const filtrarDocentes = (tipoEvaluacion: string) => {
    setFiltro(tipoEvaluacion);
  };

  const getDocentesFiltrados = () => {
    switch (filtro) {
      case 'COEVALUACION':
        return docentesCoevaluacion;
      case 'AUTOEVALUACION':
        return docentesAutoevaluacion;
      case 'HETEROEVALUACION':
        return docentesHeteroevaluacion;
      default:
        return docentesTotal;
    }
  };

  const renderEvaluacionesPasadas = (docente: Docente) => {
    if (docente.numPeriodosAcademicos === 0) {
      return <h3>El docente no tiene registros de evaluaciones</h3>;
    } else {
      const periodos = [];
      for (let i = 0; i < docente.numPeriodosAcademicos; i++) {
        periodos.push(
          <div key={i}>
            <h3>Periodo Académico {i + 1}</h3>
            <p>Heteroevaluación: {docente.notas[i * 4]}</p>
            <p>Autoevaluación: {docente.notas[i * 4 + 1]}</p>
            <p>Coevaluación: {docente.notas[i * 4 + 2]}</p>
            <p>Total: {docente.notas[i * 4 + 3]}</p>
          </div>
        );
      }
      return periodos;
    }
  };

  return (
    <div className='docentes-contenedor'>
      <button onClick={() => setPaginaActual("ListadoAsignaturas")}>ATRAS</button>
      <h1>Docentes Afines</h1>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {filtro}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => filtrarDocentes('TOTAL')}>Total</Dropdown.Item>
          <Dropdown.Item onClick={() => filtrarDocentes('COEVALUACION')}>Coevaluación</Dropdown.Item>
          <Dropdown.Item onClick={() => filtrarDocentes('AUTOEVALUACION')}>Autoevaluación</Dropdown.Item>
          <Dropdown.Item onClick={() => filtrarDocentes('HETEROEVALUACION')}>Heteroevaluación</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="tabla-container">
        <Table hover>
          <thead>
            <tr>
              <th className='celda-tabla'>Nombre</th>
              <th className='celda-tabla'>Email</th>
              <th className='celda-tabla'>Nota</th>
              <th className='celda-tabla'>Atributos</th>
              <th className='celda-tabla'>Evaluaciones Pasadas</th>
            </tr>
          </thead>
          <tbody>
            {getDocentesFiltrados().map((docente, index) => (
              <tr key={index}>
                <td>{docente.nombre}</td>
                <td>{docente.correo}</td>
                <td>{docente.promedio}</td>
                <td>{docente.atributos}</td>
                <td className="btn-acceder-materia d-grid">
                  <Button variant="success" onClick={() => handleShowModal(docente)}>
                    Historial
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Historial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDocente && renderEvaluacionesPasadas(selectedDocente)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DocentesAfines;
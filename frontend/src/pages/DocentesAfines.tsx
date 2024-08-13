import React, { useEffect, useState } from 'react';
import { useContextoGlobal } from '../ContextoGlobal';
import { obtenerDocentes } from '../services/Docentes';
import { obtenerHistorialDocentes } from '../services/HistorialDocente';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from 'react-bootstrap/Dropdown';
import { Docente } from '../types/AfinidadDocente';

const DocentesAfines: React.FC = () => {
  const { asignaturaSeleccionada, setPaginaActual} = useContextoGlobal();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [filtro, setFiltro] = useState<number>(1); // 1 para TOTAL por defecto
  const [showModal, setShowModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [historialDocente, setHistorialDocente] = useState<Docente[]>([]);


  useEffect(() => {
    const fetchDocentes = async () => {
      if (asignaturaSeleccionada) {
        try {
          const docentes = await obtenerDocentes(asignaturaSeleccionada, filtro);
          setDocentes(docentes);
        } catch (error) {
          console.error('Error obteniendo profesores:', error);
        }
      }
    };

    fetchDocentes();
  }, [asignaturaSeleccionada, filtro]);

  useEffect(() => {
    const fetchHistorialDocente = async () => {
      if (selectedDocente) {
        try {
          const historial = await obtenerHistorialDocentes(selectedDocente.id_docente);
          setHistorialDocente(historial);
        } catch (error) {
          console.error('Error obteniendo historial del docente:', error);
        }
      }
    };

    fetchHistorialDocente();
  }, [selectedDocente]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (docente: Docente) => {
    setSelectedDocente(docente);
    setShowModal(true);
  };

  const filtrarDocentes = (tipoEvaluacion: number) => {
    setFiltro(tipoEvaluacion);
  };

  const renderEvaluacionesPasadas = (docente: Docente) => {
    if (historialDocente.length === 0) {
      return <h3>El docente no tiene registros de evaluaciones</h3>;
    } else {
      return historialDocente.map((evaluacion, index) => {
        let tipoEvaluacionTexto;
        switch (evaluacion.tipo_evaluacion) {
          case 1: tipoEvaluacionTexto = "Total"; break;
          case 2: tipoEvaluacionTexto = "Coevaluación"; break;
          case 3: tipoEvaluacionTexto = "Autoevaluación"; break;
          case 4: tipoEvaluacionTexto = "Heteroevaluación"; break;
          default: tipoEvaluacionTexto = "Desconocido";
        }

        return (
          <div key={index}>
            <h3>Periodo Académico: {evaluacion.periodo}</h3>
            <p>{tipoEvaluacionTexto}: {evaluacion.calificacion}</p>
          </div>
        );
      });
    }
  };

  return (
    <div className='docentes-contenedor'>
      <div className='btn-regresar'>
      <button onClick={() => setPaginaActual("ListadoAsignaturas")}>ATRAS</button>
      </div>
      <div className='contenedor-mayor'>
        <h1>Docentes Afines</h1>
        <div className='contenedor-dropdown'>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {filtro === 1 ? "TOTAL" : filtro === 2 ? "COEVALUACION" : filtro === 3 ? "AUTOEVALUACION" : "HETEROEVALUACION"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => filtrarDocentes(1)}>Total</Dropdown.Item>
              <Dropdown.Item onClick={() => filtrarDocentes(2)}>Coevaluación</Dropdown.Item>
              <Dropdown.Item onClick={() => filtrarDocentes(3)}>Autoevaluación</Dropdown.Item>
              <Dropdown.Item onClick={() => filtrarDocentes(4)}>Heteroevaluación</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="tabla-container">
          <Table hover>
            <thead>
              <tr>
                <th className='celda-tabla'>Nombre</th>
                <th className='celda-tabla'>Email</th>
                <th className='celda-tabla'>Nota</th>
                <th className='celda-tabla'>Evaluaciones Pasadas</th>
              </tr>
            </thead>
            <tbody>
              {docentes.map((docente, index) => (
                <tr key={index}>
                  <td>{docente.nombre}</td>
                  <td>{docente.correo}</td>
                  <td>{docente.promedio}</td>
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
    </div>
  );
};

export default DocentesAfines;
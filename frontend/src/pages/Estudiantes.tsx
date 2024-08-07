/*
Feature a la que responde esta pantalla:
    F2: Identificación de estudiantes con bajas calificaciones

    Como docente quiero saber quienes son los estudiantes con tendencia a tener un promedio por 
    debajo del mínimo aceptable en base a su perfil e historial académico para comunicarme con ellos
    y agendar una cita de ser necesaria.

Grupo encargado: Grupo 2
    - Alejandra Colcha (Backend)
    - Darío Charro (Documentación)
    - Martín Mendieta (Frontend)

Documentación asociada:
    Mapa navegacional y wireframe (pantalla Estudiantes): https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1
    Tokens de diseño: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=116-2

Entidades backend involucradas: Estudiante, Asignatura

Sección de la feature abordada en esta pantalla:
    Fácil identificación de estudiantes con tendencia a tener un promedio por debajo del mínimo aceptable y
    de estudiantes que ya lo tienen, para que el docente pueda comunicarse con ellos y agendar una cita de ser necesaria.
*/

import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Estudiante } from '../types/Estudiantes';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import Dropdown from 'react-bootstrap/Dropdown';
import { obtenerEstudiantes } from '../services/Estudiantes'; // Función para obtener estudiantes del backend
import { useContextoGlobal } from '../ContextoGlobal';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/pages/Estudiantes.css'

type EstudiantesProps = {
    id: string
}

function Estudiantes({ id }: EstudiantesProps) {

    // Variables de estado
        // Lista de estudiantes obtenida del backend
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])

        // Lista de estudiantes que se muestran en la tabla (para filtrar)
    const [estudiantesVisibles, setEstudiantesVisibles] = useState<Estudiante[]>([])
    
        // Estudiante seleccionado para mostrar en el modal
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null)
    
        // Notificación de estudiante citado con éxito
    const [estudianteCitado, setEstudianteCitado] = useState<boolean>(false)
    
        // Filtro de prioridad de atención
    const [filtro, setFiltro] = useState<string>('Todos')
    
        // Función para actualizar la lista de estudiantes en el contexto global
    const { setListaEstudiantes, asignatura, curso, periodoActivo } = useContextoGlobal()

    // Obtener lista de estudiantes del backend al cargar la página
    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const estudiantesFetch = await obtenerEstudiantes(asignatura, periodoActivo, curso)
                setEstudiantes(estudiantesFetch)
                setEstudiantesVisibles(estudiantesFetch)
                setListaEstudiantes(estudiantesFetch)
            } catch (error) {
                console.error('Error obteniendo estudiantes:', error)
            }
        }
        fetchEstudiantes()
    }, [setListaEstudiantes])

    // Funciones
        // Mostrar modal con información del estudiante seleccionado
    const mostrarModalEstudiante = (estudiante: Estudiante) => {
        setEstudianteSeleccionado(estudiante)
    }

        // Cerrar modal de estudiante
    const cerrarModalEstudiante = () => {
        setEstudianteSeleccionado(null)
    }

        // Filtrar estudiantes según prioridad de atención
    const filtrarEstudiantes = (prioridad: string) => {
        if (prioridad === 'TODOS') {
            setEstudiantesVisibles(estudiantes)
        } else {
            const estudiantesFiltrados = estudiantes.filter(estudiante => estudiante.prioridad === prioridad)
            setEstudiantesVisibles(estudiantesFiltrados)
        }
        setFiltro(prioridad)
    }

    return (
        <div id={id} className='estudiantes-contenedor'>
            <h1>Estudiantes</h1>
            <Dropdown>
                <Dropdown.Toggle
                    variant={
                        filtro === 'TODOS' ? 'primary' :
                            filtro === 'RIESGO' ? 'secondary' :
                                filtro === 'MEDIA' ? 'warning' :
                                    filtro === 'ALTA' ? 'danger' : 'primary'
                    }
                    id="dropdown-basic"
                >
                    {filtro}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => filtrarEstudiantes('TODOS')}>Todos</Dropdown.Item>
                    <Dropdown.Item onClick={() => filtrarEstudiantes('RIESGO')}>En riesgo</Dropdown.Item>
                    <Dropdown.Item onClick={() => filtrarEstudiantes('MEDIA')}>Prioridad media</Dropdown.Item>
                    <Dropdown.Item onClick={() => filtrarEstudiantes('ALTA')}>Prioridad alta</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <div className="contenedor-tabla">
                <Table hover>
                    <thead>
                        <tr>
                            <th className='celda-tabla'>Nombre</th>
                            <th className='celda-tabla'>Incidencias</th>
                            <th className='celda-tabla'>Email</th>
                            <th className='celda-tabla'>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantesVisibles.map((estudiante) => (
                            <tr key={estudiante.id_estudiante} onClick={() => mostrarModalEstudiante(estudiante)}>
                                <td key={`${estudiante.id_estudiante}-1`} className={`celda-tabla ${estudiante.prioridad.toLowerCase()}`}>{estudiante.nombre_estudiante}</td>
                                <td key={`${estudiante.id_estudiante}-1`} className={`celda-tabla ${estudiante.prioridad.toLowerCase()}`}>{estudiante.numero_incidencias}</td>
                                <td key={`${estudiante.id_estudiante}-1`} className={`celda-tabla ${estudiante.prioridad.toLowerCase()}`}>{estudiante.email}</td>
                                <td key={`${estudiante.id_estudiante}-1`} className={`celda-tabla ${estudiante.prioridad.toLowerCase()}`}>{estudiante.promedio}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Modal
                show={estudianteSeleccionado !== null}
                onHide={cerrarModalEstudiante}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Estudiante: {estudianteSeleccionado?.nombre_estudiante}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>Incidencias</b> {estudianteSeleccionado?.numero_incidencias}</p>
                    <p><b>Email</b> {estudianteSeleccionado?.email}</p>
                    <p><b>Promedio</b> {estudianteSeleccionado?.promedio}</p>
                    <p><b>Prioridad de atención </b>
                        {(estudianteSeleccionado?.prioridad === 'ALTA') && <Badge bg="danger">Alta</Badge>}
                        {(estudianteSeleccionado?.prioridad === 'MEDIA') && <Badge bg="warning">Media</Badge>}
                        {(estudianteSeleccionado?.prioridad === 'RIESGO') && <Badge bg="secondary">En riesgo</Badge>}
                        {(estudianteSeleccionado?.prioridad === 'BAJA') && <Badge bg="success">Baja</Badge>}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { setEstudianteSeleccionado(null); setEstudianteCitado(true) }}>Citar alumno</Button>
                </Modal.Footer>
            </Modal>
            <div className="contenedor-notificacion">
                <Alert variant='primary' show={estudianteCitado} onClose={() => setEstudianteCitado(false)} dismissible>
                    Estudiante citado con éxito
                </Alert>
            </div>
        </div>
    )
}

export default Estudiantes

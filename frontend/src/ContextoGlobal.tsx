import { createContext, useState, ReactNode, useContext } from 'react'
import { Estudiante } from './types/RegistroNotas';
import { Profesor } from './types/Capacitaciones';

type contextoType = {
    paginaActual: string;
    setPaginaActual: (paginaActual: string) => void;
    listaEstudiantes: Estudiante[];
    setListaEstudiantes: (listaEstudiantes: Estudiante[]) => void;
    profesor: Profesor | null; 
    setProfesor: (profesor: Profesor | null) => void; 
    rol: string; 
    setRol: (modo: string) => void;
    asignaturaSeleccionada: number | null;
    setAsignaturaSeleccionada: (asignatura: number | null) => void; 
    usuario:string;
    setUsuario: (usuario: string) => void;

}

const ContextoGlobal = createContext<contextoType | undefined>(undefined)

export function ProveedorContextoGlobal({ children }: { children: ReactNode }) {
    const [paginaActual, setPaginaActual] = useState<string>('Asignatura')
    const [listaEstudiantes, setListaEstudiantes] = useState<Estudiante[]>([])
    const [profesor, setProfesor] = useState<Profesor | null>(null);
    const [rol, setRol] = useState<string>('normal');
    const [usuario, setUsuario] = useState<string>('Mario Romero');
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<number | null>(null);

    return (
        <ContextoGlobal.Provider value={{ paginaActual, setPaginaActual, listaEstudiantes, setListaEstudiantes, profesor, 
            setProfesor, rol, setRol, usuario,setUsuario, asignaturaSeleccionada, setAsignaturaSeleccionada }}>
            {children}
        </ContextoGlobal.Provider>
    )
}

export function useContextoGlobal() {
    const contexto = useContext(ContextoGlobal)

    if (contexto === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalContextProvider')
    }

    return contexto
}
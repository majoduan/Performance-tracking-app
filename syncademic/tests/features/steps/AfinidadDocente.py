from behave import *
from faker import Faker
from seguimientoAcademico1.app.modelos import *

fake = Faker()


@step('que existen al menos dos docentes que han impartido la asignatura "{nombre_asignatura}"')
def step_impl(context, nombre_asignatura):
    context.institucion = Institucion("Instituto de Ejemplo")
    context.asignatura = Asignatura(nombre_asignatura)
    docente1 = Docente(fake.name())
    docente2 = Docente(fake.name())
    eval1 = Evaluacion(fake.word(), TipoEvaluacion.Heteroevaluacion, fake.random_int(min=70, max=100),
                       context.asignatura)
    eval2 = Evaluacion(fake.word(), TipoEvaluacion.Heteroevaluacion, fake.random_int(min=70, max=100),
                       context.asignatura)
    docente1.agregar_evaluacion(eval1)
    docente2.agregar_evaluacion(eval2)
    context.institucion.agregar_docente(docente1)
    context.institucion.agregar_docente(docente2)

    assert len(context.institucion.docentes) == 2


@step('se solicita identificar el docente con mayor calificación promedio en "{tipo_evaluacion}"')
def step_impl(context, tipo_evaluacion):
    tipo = TipoEvaluacion[tipo_evaluacion]
    context.resultado = context.institucion.identificar_docentes_por_calificacion(context.asignatura.nombre, tipo)


@step("se presenta el listado de docentes en orden de mayor a menor con respecto a su calificación")
def step_impl(context):
    for docente, calificacion in context.resultado:
        print(f"{docente.nombre}: {calificacion:.2f}")


@step('que se ha identificado la asignatura "{nombre_asignatura}" con bajo rendimiento estudiantil,')
def step_impl(context, nombre_asignatura):
    context.asignatura_bajo_rendimiento = nombre_asignatura


@step('que existe el docente que han impartido las asignaturas "{nombre_asignatura}"')
def step_impl(context, nombre_asignatura):
    context.institucion = Institucion("Instituto de Ejemplo")
    context.asignatura = Asignatura(nombre_asignatura)
    docente = Docente(fake.name())
    eval = Evaluacion(fake.word(), TipoEvaluacion.Coevaluacion, fake.random_int(min=70, max=100), context.asignatura)
    docente.agregar_evaluacion(eval)
    context.institucion.agregar_docente(docente)
    context.docente = docente


@step('se han seleccionado docentes con alta calificación promedio en "{tipo_evaluacion}",')
def step_impl(context, tipo_evaluacion):
    context.institucion = Institucion("Instituto de Ejemplo")
    tipo = TipoEvaluacion[tipo_evaluacion]
    context.docentes_seleccionados = context.institucion.identificar_docentes_por_calificacion(context.asignatura_bajo_rendimiento, tipo)


@step("se realiza el proceso de planificación de la carga académica,")
def step_impl(context):
    context.planificacion = [(docente.nombre, docente.promedio_calificacion(TipoEvaluacion.Total)) for docente, _ in context.docentes_seleccionados]


@step("se sugiere docentes con alta afinidad a la asignatura.")
def step_impl(context):
    for docente, promedio in context.planificacion:
        print(f"Sugerencia: {docente} con promedio {promedio:.2f} para la asignatura {context.asignatura_bajo_rendimiento}")

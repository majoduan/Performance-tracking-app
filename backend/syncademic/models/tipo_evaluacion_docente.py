from django.db import models

# Modelo para TipoEvaluación
# Utilizado por Feature 7
# Creado por Xavier Carpio


class TipoEvaluacion(models.IntegerChoices):
    """ TipoEvaluación
                Representación de los tipos de evaluación integral
                que un docente puede tener
   """
    HETEROEVALUACION = 1, 'Heteroevaluacion'
    AUTOEVALUACION = 2, 'Autoevaluacion'
    COEVALUACION = 3, 'Coevaluacion'
    TOTAL = 4, 'Total'

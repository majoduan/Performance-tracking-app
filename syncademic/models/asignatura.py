from django.db import models
class Asignatura(models.Model):
    id_asignatura = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
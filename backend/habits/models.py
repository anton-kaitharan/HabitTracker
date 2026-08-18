from django.db import models
from django.contrib.auth.models import User


class Habit(models.Model):
    owner = models.ForeignKey(User, related_name='habits', on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.name


class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, related_name='logs', on_delete=models.CASCADE)
    date = models.DateField()
    is_done = models.BooleanField(default=False)

    class Meta:
        unique_together = ('habit', 'date')

    def __str__(self):
        return f'{self.habit.name} - {self.date}'

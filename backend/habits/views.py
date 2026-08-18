from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Habit, HabitLog
from .serializers import HabitSerializer, RegisterSerializer


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer

    def get_queryset(self):
        return Habit.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        habit = self.get_object()
        date = request.data.get('date')
        if not date:
            return Response({'detail': 'date is required'}, status=status.HTTP_400_BAD_REQUEST)

        log, created = HabitLog.objects.get_or_create(habit=habit, date=date)
        if not created:
            log.is_done = not log.is_done
            log.save()
        else:
            log.is_done = True
            log.save()

        return Response(HabitSerializer(habit).data)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

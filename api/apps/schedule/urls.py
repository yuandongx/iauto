
from .views import *
from django.urls import path


urlpatterns = [
    path('', Schedule.as_view()),
    path('<int:t_id>/', HistoryView.as_view()),
    path('run_time/', next_run_time),
]

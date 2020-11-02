
from django.urls import path

from .views import *

urlpatterns = [
    path('statistic/host/', get_host_statistic),
    path('statistic/hostinfo/', get_hostinfo),
    path('statistic/task/', get_task_statistic),
    path('statistic/template/', get_temp_statistic),
    path('statistic/templateinfo/', get_tempinfo),
    path('alarm/', get_alarm),
    path('deploy/', get_deploy),
    path('request/', get_request),
]

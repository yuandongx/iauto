
from django.conf.urls import url

from .views import *

urlpatterns = [
    url(r'template/$', TemplateView.as_view()),
    url(r'import/$', upload_file),
    url(r'do/$', do_task),
]

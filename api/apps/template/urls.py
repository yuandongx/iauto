
from django.conf.urls import url

from .views import *

urlpatterns = [
    url(r'generic/$', GenericView.as_view()),
    url('network/$', NetworkView.as_view()),
    url('upload/$', upload_file),
    url('upload-submit/$', upload_submit),
]
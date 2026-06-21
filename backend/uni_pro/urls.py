from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static



def health_check(request):
    return JsonResponse({
        "status": "ok",
        "service": "university-student-management-api"
    })

urlpatterns = [
    path("api/health/", health_check, name="api-health"),
    path('admin/', admin.site.urls),
    path('api/students/', include('students.urls')),
    path('api/adminpanel/', include('admin_panel.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
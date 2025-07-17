from django.contrib import admin
from .models import UserProfile, Video, Campaign

admin.site.register(UserProfile)
admin.site.register(Video)
admin.site.register(Campaign)
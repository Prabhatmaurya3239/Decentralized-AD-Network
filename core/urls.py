from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('connect_wallet/', views.connect_wallet, name='connect_wallet'),
    path('select_role/', views.select_role, name='select_role'),
    path('publisher_dashboard/', views.publisher_dashboard, name='publisher_dashboard'),
    path('advertiser_dashboard/', views.advertiser_dashboard, name='advertiser_dashboard'),
    path('simulate_ad_view/<int:video_id>/', views.simulate_ad_view, name='simulate_ad_view'),
    path('add_eth/', views.add_eth, name='add_eth'),
    path('create_campaign/', views.create_campaign, name='create_campaign'),
]

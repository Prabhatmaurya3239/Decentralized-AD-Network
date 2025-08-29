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
    path("logout/", views.logout_view, name="logout"),
    path("login/", views.custom_login, name="custom_login"),
    path("api_keys/", views.api_keys_view, name="api_keys"),
    path("create_api_key/", views.create_api_key, name="create_api_key"),
    path("delete_api_key/", views.delete_api_key, name="delete_api_key"),
    path("docs/", views.documentation, name="docs"),

    
]

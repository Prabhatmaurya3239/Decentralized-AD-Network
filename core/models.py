from django.db import models
from django.contrib.auth.models import User
import secrets

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('publisher', 'Publisher'),
        ('advertiser', 'Advertiser'),
    ]
    
    wallet_address = models.CharField(max_length=42, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile", null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    eth_balance = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    token_balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.wallet_address} - {self.role}"

class Video(models.Model):
    publisher = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    video_file = models.FileField(upload_to='videos/')
    impressions = models.IntegerField(default=0)
    earnings_eth = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    earnings_tokens = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Campaign(models.Model):
    advertiser = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    budget_eth = models.DecimalField(max_digits=20, decimal_places=8)
    spent_eth = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Campaign by {self.advertiser.wallet_address} on {self.video.title}"
class APIKey(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="api_keys")
    key = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(32)  # 64 char random key
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.key[:10]}..."
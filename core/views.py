from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from decimal import Decimal
import json
from .models import UserProfile, Video, Campaign

def home(request):
    wallet_address = request.session.get('wallet_address')
    user_profile = None
    
    if wallet_address:
        try:
            user_profile = UserProfile.objects.get(wallet_address=wallet_address)
        except UserProfile.DoesNotExist:
            pass
    
    context = {
        'user_profile': user_profile,
        'wallet_address': wallet_address,
    }
    return render(request, 'core/home.html', context)

@csrf_exempt
@require_POST
def connect_wallet(request):
    data = json.loads(request.body)
    wallet_address = data.get('wallet_address')
    
    if wallet_address:
        request.session['wallet_address'] = wallet_address
        
        try:
            user_profile = UserProfile.objects.get(wallet_address=wallet_address)
            return JsonResponse({
                'success': True,
                'has_profile': True,
                'role': user_profile.role,
                'redirect_url': f'/{user_profile.role}_dashboard/'
            })
        except UserProfile.DoesNotExist:
            return JsonResponse({
                'success': True,
                'has_profile': False,
                'redirect_url': '/select_role/'
            })
    
    return JsonResponse({'success': False, 'error': 'Invalid wallet address'})

def select_role(request):
    wallet_address = request.session.get('wallet_address')
    if not wallet_address:
        return redirect('home')
    
    if request.method == 'POST':
        role = request.POST.get('role')
        if role in ['publisher', 'advertiser']:
            user_profile = UserProfile.objects.create(
                wallet_address=wallet_address,
                role=role
            )
            messages.success(request, f'Welcome! You are now registered as a {role}.')
            return redirect(f'{role}_dashboard')
    
    return render(request, 'core/select_role.html', {'wallet_address': wallet_address})

def publisher_dashboard(request):
    wallet_address = request.session.get('wallet_address')
    if not wallet_address:
        return redirect('home')
    
    try:
        user_profile = UserProfile.objects.get(wallet_address=wallet_address, role='publisher')
    except UserProfile.DoesNotExist:
        return redirect('home')
    videos = Video.objects.all()
    
    
    context = {
        'user_profile': user_profile,
        'videos': videos,
    }
    return render(request, 'core/publisher_dashboard.html', context)

@csrf_exempt
@require_POST
def simulate_ad_view(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    
    # Simulate earnings: 0.01 ETH and 100 tokens per view
    video.impressions += 1
    video.earnings_eth += Decimal('0.01')
    video.earnings_tokens += Decimal('100')
    video.save()
    
    # Update publisher balance
    video.publisher.eth_balance += Decimal('0.01')
    video.publisher.token_balance += Decimal('100')
    video.publisher.save()
    
    return JsonResponse({
        'success': True,
        'impressions': video.impressions,
        'earnings_eth': str(video.earnings_eth),
        'earnings_tokens': str(video.earnings_tokens),
        'publisher_eth_balance': str(video.publisher.eth_balance),
        'publisher_token_balance': str(video.publisher.token_balance),
    })

def advertiser_dashboard(request):
    wallet_address = request.session.get('wallet_address')
    if not wallet_address:
        return redirect('home')
    
    try:
        user_profile = UserProfile.objects.get(wallet_address=wallet_address, role='advertiser')
    except UserProfile.DoesNotExist:
        return redirect('home')
    if request.method == 'POST':
        title = request.POST.get('title')
        video_file = request.FILES.get('video_file')
        
        if title and video_file:
            Video.objects.create(
                publisher=user_profile,
                title=title,
                video_file=video_file
            )
            messages.success(request, 'Video uploaded successfully!')
            return redirect('advertiser_dashboard')
    
    videos = Video.objects.filter(publisher=user_profile)
    campaigns = Campaign.objects.filter(advertiser=user_profile)
    
    context = {
        'user_profile': user_profile,
        'videos': videos,
        'campaigns': campaigns,
    }
    return render(request, 'core/advertiser_dashboard.html', context)

@csrf_exempt
@require_POST
def add_eth(request):
    wallet_address = request.session.get('wallet_address')
    if not wallet_address:
        return JsonResponse({'success': False, 'error': 'Not authenticated'})
    
    data = json.loads(request.body)
    amount = Decimal(str(data.get('amount', 0)))
    
    try:
        user_profile = UserProfile.objects.get(wallet_address=wallet_address)
        user_profile.eth_balance += amount
        user_profile.save()
        
        return JsonResponse({
            'success': True,
            'new_balance': str(user_profile.eth_balance)
        })
    except UserProfile.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'User not found'})

@csrf_exempt
@require_POST
def create_campaign(request):
    wallet_address = request.session.get('wallet_address')
    if not wallet_address:
        return JsonResponse({'success': False, 'error': 'Not authenticated'})
    
    data = json.loads(request.body)
    video_id = data.get('video_id')
    budget = Decimal(str(data.get('budget', 0)))
    
    try:
        user_profile = UserProfile.objects.get(wallet_address=wallet_address, role='advertiser')
        video = Video.objects.get(id=video_id)
        
        if user_profile.eth_balance >= budget:
            campaign = Campaign.objects.create(
                advertiser=user_profile,
                video=video,
                budget_eth=budget
            )
            
            user_profile.eth_balance -= budget
            user_profile.save()
            
            return JsonResponse({
                'success': True,
                'campaign_id': campaign.id,
                'new_balance': str(user_profile.eth_balance)
            })
        else:
            return JsonResponse({'success': False, 'error': 'Insufficient balance'})
            
    except (UserProfile.DoesNotExist, Video.DoesNotExist):
        return JsonResponse({'success': False, 'error': 'Invalid request'})

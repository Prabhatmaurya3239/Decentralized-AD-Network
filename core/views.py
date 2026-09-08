from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from decimal import Decimal
import json
from django.conf import settings
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from .models import UserProfile, Video, Campaign, APIKey
from .forms import CustomLoginForm

try:
    from web3 import Web3
except ImportError:  # pragma: no cover
    Web3 = None

def custom_login(request):
    if request.method == "POST":
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            username_or_email = form.cleaned_data["username_or_email"]
            wallet_address = form.cleaned_data["wallet_address"]
            password = form.cleaned_data["password"]

            print(f"Received - Username/Email: {username_or_email}, Wallet: {wallet_address}")

            # ✅ User ko username ya email se dhundo
            try:
                user = User.objects.get(username=username_or_email)
            except User.DoesNotExist:
                try:
                    user = User.objects.get(email=username_or_email)
                except User.DoesNotExist:
                    user = None

            print(f"User found: {user}")

            if user:
                # ✅ Password verify karo
                auth_user = authenticate(request, username=user.username, password=password)
                if auth_user:
                    try:
                        profile = UserProfile.objects.get(user=user)
                        if profile.wallet_address == wallet_address:
                            login(request, auth_user)
                            request.session["wallet_address"] = wallet_address

                            # ✅ Role ke hisaab se redirect
                            if profile.role == "publisher":
                                return redirect("publisher_dashboard")
                            elif profile.role == "advertiser":
                                return redirect("advertiser_dashboard")
                            else:
                                return redirect("home")
                        else:
                            messages.error(request, "⚠️ Wallet address does not match!")
                    except UserProfile.DoesNotExist:
                        messages.error(request, "⚠️ No profile linked with this account.")
                else:
                    messages.error(request, "⚠️ Invalid password!")
            else:
                messages.error(request, "⚠️ Invalid username or email!")
    else:
        form = CustomLoginForm()

    return render(request, "core/custom_login.html", {"form": form})



def logout_view(request):
    logout(request)  # Django user session clear karega
    if "wallet_address" in request.session:
        del request.session["wallet_address"]  # wallet session bhi clear
    return redirect('home')


def home(request):
    from django.db.models import Sum
    wallet_address = request.session.get('wallet_address')
    user_profile = None
    
    if wallet_address:
        try:
            user_profile = UserProfile.objects.get(wallet_address=wallet_address)
        except UserProfile.DoesNotExist:
            pass
            
    # Calculate real platform stats
    total_publishers = UserProfile.objects.filter(role='publisher').count()
    total_advertisers = UserProfile.objects.filter(role='advertiser').count()
    total_campaigns = Campaign.objects.count()
    total_impressions = Video.objects.aggregate(Sum('impressions'))['impressions__sum'] or 0
    total_earnings_eth = Video.objects.aggregate(Sum('earnings_eth'))['earnings_eth__sum'] or 0
    total_spend_eth = Campaign.objects.aggregate(Sum('spent_eth'))['spent_eth__sum'] or 0
    
    context = {
        'user_profile': user_profile,
        'wallet_address': wallet_address,
        'stats': {
            'total_publishers': total_publishers,
            'total_advertisers': total_advertisers,
            'total_campaigns': total_campaigns,
            'total_impressions': total_impressions,
            'total_earnings_eth': float(total_earnings_eth),
            'total_spend_eth': float(total_spend_eth),
        }
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

    if request.method == "POST":
        role = request.POST.get("role")
        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        username = request.POST.get("username")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        # Password check
        if password != confirm_password:
            messages.error(request, "⚠️ Passwords do not match!")
            return redirect("select_role")

        # Duplicate username check
        if User.objects.filter(username=username).exists():
            messages.error(request, "⚠️ Username already exists!")
            return redirect("select_role")

        # Duplicate wallet check
        if UserProfile.objects.filter(wallet_address=wallet_address).exists():
            messages.warning(request, "⚠️ Wallet already registered!")
            return redirect("home")

        # Create user
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=full_name
        )
        user.save()

        # Create profile
        UserProfile.objects.create(
            user=user,
            wallet_address=wallet_address,
            role=role
        )

        # Auto-login
        login(request, user)

        messages.success(request, f"🎉 Welcome {full_name}, registered as {role.capitalize()}!")
        return redirect(f"{role}_dashboard")

    return render(request, "core/select_role.html", {"wallet_address": wallet_address})
@login_required
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

@login_required
@require_POST
@transaction.atomic
def simulate_ad_view(request, video_id):
    wallet_address = request.session.get('wallet_address')
    video = get_object_or_404(
        Video.objects.select_related('publisher'),
        id=video_id,
        publisher__wallet_address=wallet_address,
        publisher__role='publisher',
    )

    # Demo price mirrors the dynamic-pricing panel until the contract is deployed.
    impression_price = Decimal('0.00005')
    video.impressions += 1
    video.earnings_eth += impression_price
    video.earnings_tokens += Decimal('100')
    video.save()

    video.publisher.eth_balance += impression_price
    video.publisher.token_balance += Decimal('100')
    video.publisher.save()
    
    return JsonResponse({
        'success': True,
        'impressions': video.impressions,
        'earnings_eth': str(video.earnings_eth),
        'earnings_tokens': str(video.earnings_tokens),
        'publisher_eth_balance': str(video.publisher.eth_balance),
        'publisher_token_balance': str(video.publisher.token_balance),
        'impression_price': str(impression_price),
    })
    
@login_required
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
    
    all_videos = Video.objects.all()
    my_videos = Video.objects.filter(publisher=user_profile)
    campaigns = Campaign.objects.filter(advertiser=user_profile)
    
    context = {
        'user_profile': user_profile,
        'videos': all_videos, # Used for placing ads on all publisher videos
        'my_videos': my_videos, # The advertiser's own uploaded assets
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

    try:
        payload = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        payload = {}

    video_id = payload.get('video_id') or request.POST.get('video_id')
    if not video_id:
        return JsonResponse({'success': False, 'error': 'Please select an ad placement.'})

    budget = Decimal(str(payload.get('budget') or request.POST.get('budget') or 0))
    if budget <= 0:
        return JsonResponse({'success': False, 'error': 'Budget must be greater than zero.'})

    publisher_address = (payload.get('publisher_address') or payload.get('publisherWallet') or request.POST.get('publisher_address') or '').strip()
    campaign_name = payload.get('campaign_name') or request.POST.get('campaign_name') or ''

    try:
        user_profile = UserProfile.objects.get(wallet_address=wallet_address, role='advertiser')
        video = Video.objects.get(id=video_id)

        if not publisher_address:
            publisher_address = video.publisher.wallet_address

        contract_address = getattr(settings, 'ADCHAIN_CONTRACT_ADDRESS', '')
        contract_abi = getattr(settings, 'ADCHAIN_ABI', [])
        if contract_address and contract_abi and Web3 is not None:
            try:
                provider = Web3(Web3.HTTPProvider(getattr(settings, 'ADCHAIN_RPC_URL', 'http://127.0.0.1:8545')))
                contract = provider.eth.contract(address=contract_address, abi=contract_abi)
                base_price = (budget / Decimal('1000')).quantize(Decimal('0.00000001'))
                max_impressions = max(1, int((budget * Decimal('1000')).to_integral_value()))
                value_wei = Web3.to_wei(float(budget), 'ether')
                tx_hash = contract.functions.createCampaign(
                    publisher_address,
                    campaign_name or video.title,
                    Web3.to_wei(float(base_price), 'ether'),
                    max_impressions,
                ).transact({
                    'from': wallet_address,
                    'value': value_wei,
                })
                provider.eth.wait_for_transaction_receipt(tx_hash)
                return JsonResponse({
                    'success': True,
                    'campaign_id': None,
                    'contract_tx': tx_hash.hex(),
                    'publisher_address': publisher_address,
                    'new_balance': str(user_profile.eth_balance)
                })
            except Exception as exc:
                # Fall back to the app database flow when the contract is not reachable yet.
                pass

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

@login_required
def api_keys_view(request):
    keys = APIKey.objects.filter(user=request.user)
    return JsonResponse({"keys": [k.key for k in keys]})

@login_required
def create_api_key(request):
    if request.method == "POST":
        key = APIKey.objects.create(user=request.user)
        return JsonResponse({"success": True, "key": key.key})
    return JsonResponse({"success": False})

@login_required
def delete_api_key(request):
    if request.method == "POST":
        key_value = request.POST.get("key")
        APIKey.objects.filter(user=request.user, key=key_value).delete()
        return JsonResponse({"success": True})
    return JsonResponse({"success": False})

def documentation(request):
    return render(request, "core/documentation.html")

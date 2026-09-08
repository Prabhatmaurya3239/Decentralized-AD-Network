from decimal import Decimal

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from .models import UserProfile, Video


class SimulateAdViewTests(TestCase):
    def setUp(self):
        self.publisher_user = User.objects.create_user(
            username="publisher",
            password="test-password",
        )
        self.publisher_profile = UserProfile.objects.create(
            user=self.publisher_user,
            wallet_address="0x1111111111111111111111111111111111111111",
            role="publisher",
        )
        self.other_publisher_user = User.objects.create_user(
            username="other-publisher",
            password="test-password",
        )
        self.other_publisher_profile = UserProfile.objects.create(
            user=self.other_publisher_user,
            wallet_address="0x2222222222222222222222222222222222222222",
            role="publisher",
        )
        self.video = Video.objects.create(
            publisher=self.publisher_profile,
            title="Demo placement",
            video_file=SimpleUploadedFile("placement.mp4", b"demo"),
        )

    def _publisher_session(self, profile):
        self.client.login(username=profile.user.username, password="test-password")
        session = self.client.session
        session["wallet_address"] = profile.wallet_address
        session.save()

    def test_requires_authentication(self):
        response = self.client.post(f"/simulate_ad_view/{self.video.id}/")

        self.assertEqual(response.status_code, 302)
        self.assertEqual(self.video.impressions, 0)

    def test_cannot_record_another_publishers_impression(self):
        self._publisher_session(self.other_publisher_profile)

        response = self.client.post(f"/simulate_ad_view/{self.video.id}/")

        self.assertEqual(response.status_code, 404)
        self.video.refresh_from_db()
        self.assertEqual(self.video.impressions, 0)

    def test_credits_dynamic_demo_impression_price(self):
        self._publisher_session(self.publisher_profile)

        response = self.client.post(f"/simulate_ad_view/{self.video.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["impression_price"], "0.00005")
        self.video.refresh_from_db()
        self.publisher_profile.refresh_from_db()
        self.assertEqual(self.video.impressions, 1)
        self.assertEqual(self.video.earnings_eth, Decimal("0.00005"))
        self.assertEqual(self.publisher_profile.eth_balance, Decimal("0.00005"))

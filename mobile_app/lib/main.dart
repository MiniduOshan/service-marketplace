import 'package:flutter/material.dart';
import 'views/shared/root_widget.dart'; // contains AuthWrapper
import 'controllers/auth_controller.dart';


// Importing existing screens for routes
import 'views/onboarding/welcome_screen.dart';
import 'views/auth/login_screen.dart';
import 'views/auth/signup_screen.dart';
import 'views/auth/phone_login_screen.dart';
import 'views/auth/forgot_password_screen.dart';
import 'views/customer/booking_steps_screen.dart';
import 'views/customer/cancel_booking_screen.dart';
import 'views/chat/chat_list_screen.dart';
import 'views/chat/chat_screen.dart';
import 'views/worker/document_verification_screen.dart';
import 'views/worker/job_requests_screen.dart';
import 'views/customer/my_bookings_screen.dart';
import 'views/customer/user_profile_screen.dart';
import 'views/worker/worker_registration_screen.dart';
import 'views/worker/worker_subscription_screen.dart';
import 'views/worker/worker_wallet_screen.dart';
import 'views/customer/search_results_screen.dart';
import 'views/customer/worker_profile_public_screen.dart';
import 'views/customer/payment_methods_screen.dart';
import 'views/customer/saved_addresses_screen.dart';
import 'views/shared/privacy_policy_screen.dart';
import 'views/worker/worker_dashboard.dart';
import 'views/worker/worker_profile_screen.dart';
import 'views/worker/worker_service_packages_screen.dart';
import 'views/worker/worker_reviews_screen.dart';
import 'views/shared/notifications_screen.dart';
import 'views/worker/worker_notification_settings_screen.dart';
import 'views/worker/worker_payment_settings_screen.dart';
import 'views/shared/language_settings_screen.dart';
import 'views/shared/help_center_screen.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await authController.loadFromDisk();
  runApp(const SkilledLKApp());
}

class SkilledLKApp extends StatelessWidget {
  const SkilledLKApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Primary SkilledLK Green color
    const Color primaryGreen = Color(0xFF006D44);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SkilledLK',
      
      // Global Theme Data from Figma Green (#006D44)
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryGreen,
          primary: primaryGreen,
        ),
        scaffoldBackgroundColor: Colors.white, // Standard white background
      ),

      // NEW FLOW: The app now starts at AuthWrapper
      // This widget dynamically shows Onboarding, Home, or WorkerDashboard
      home: const AuthWrapper(),


      // Standard Route table for explicit screen navigation (pushNamed)
      // Flows like Welcome Screen Role selection are standard routes.
      routes: {
        '/welcome': (context) => const WelcomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/phone-login': (context) => const PhoneLoginScreen(),
        '/forgot-password': (context) => const ForgotPasswordScreen(),
        '/booking-steps': (context) => const BookingStepsScreen(),
        '/cancel-booking': (context) => const CancelBookingScreen(),
        '/chat-list': (context) => const ChatListScreen(),
        '/chat': (context) => const ChatScreen(),
        '/document-verification': (context) => const DocumentVerificationScreen(),
        '/job-requests': (context) => const JobRequestsScreen(),
        '/my-bookings': (context) => const MyBookingsScreen(),
        '/profile': (context) => const UserProfileScreen(),
        '/worker-registration': (context) => const WorkerRegistrationScreen(),
        '/worker-subscription': (context) => const WorkerSubscriptionScreen(),
        '/worker-wallet': (context) => const WorkerWalletScreen(),
        '/search-results': (context) => const SearchResultsScreen(),
        '/worker-profile-public': (context) => const WorkerProfilePublicScreen(),
        '/worker-dashboard': (context) => const WorkerDashboard(),
        '/worker-profile': (context) => const WorkerProfileScreen(),
        '/worker-service-packages': (context) => const WorkerServicePackagesScreen(),
        '/worker-reviews': (context) => const WorkerReviewsScreen(),
        '/notifications': (context) => const NotificationsScreen(),
        '/worker-notification-settings': (context) => const WorkerNotificationSettingsScreen(),
        '/worker-payment-settings': (context) => const WorkerPaymentSettingsScreen(),
        '/language-settings': (context) => const LanguageSettingsScreen(),
        '/help-center': (context) => const HelpCenterScreen(),
        '/payment-methods': (context) => const PaymentMethodsScreen(),
        '/saved-addresses': (context) => const SavedAddressesScreen(),
        '/privacy-policy': (context) => const PrivacyPolicyScreen(),
      },
    );

  }
}
import 'package:flutter/material.dart';
import '../customer/home_screen.dart'; // Path to Home Screen.png
import '../onboarding/onboarding_screen.dart'; // Path to Onboarding flow
import '../worker/worker_dashboard.dart'; // Path to Worker Dashboard.png
import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../worker/worker_registration_screen.dart';


class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<AppUser?>(
      valueListenable: authController.authStateNotifier,

      builder: (context, user, _) {
        
        // 1. User is NOT logged in - Standard Onboarding Flow
        if (user == null) {
          return const OnboardingScreen();
        }

        // 2. User IS logged in - Check Role and redirect accordingly
        if (user.role == UserRole.worker) {
          if (user.isRegistrationComplete) {
            return const WorkerDashboard();
          } else {
            return WorkerRegistrationScreen();
          }
        } else {
          return const HomeScreen();
        }
      },
    );

  }
}
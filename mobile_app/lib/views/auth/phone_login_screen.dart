import 'package:flutter/material.dart';

import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../customer/home_screen.dart';
import '../worker/worker_registration_screen.dart';
import 'otp_screen.dart';

class PhoneLoginScreen extends StatefulWidget {
  const PhoneLoginScreen({super.key});

  @override
  State<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends State<PhoneLoginScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  UserRole _selectedRole = UserRole.customer;
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty || phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter your name and phone number.')),
      );
      return;
    }

    final navigator = Navigator.of(context);
    final messenger = ScaffoldMessenger.of(context);

    setState(() => _isLoading = true);

    try {
      final response = await authController.requestPhoneOtp(name, phone, _selectedRole);

      final verificationPhone = response['data']?['phone']?.toString() ?? phone;
      navigator.push(
        MaterialPageRoute(
          builder: (_) => OTPVerificationScreen(
            verificationTarget: verificationPhone,
            phoneNumber: verificationPhone,
          ),
        ),
      );
    } catch (error) {
      messenger.showSnackBar(
        SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF006D44);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1D2125)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'SkilledLK',
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),
            Center(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFFE8F1EE),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone_android, color: primaryGreen, size: 40),
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Continue with phone number',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: Color(0xFF030D16)),
            ),
            const SizedBox(height: 8),
            const Text(
              'We\'ll send a 6-digit OTP to verify your account.',
              style: TextStyle(fontSize: 16, color: Color(0xFF5D6B78)),
            ),
            const SizedBox(height: 32),
            const Text('Full name', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(
              controller: _nameController,
              textInputAction: TextInputAction.next,
              decoration: InputDecoration(
                hintText: 'Enter your name',
                filled: true,
                fillColor: const Color(0xFFF6F8F9),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Phone number', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                hintText: '77 123 4567',
                filled: true,
                fillColor: const Color(0xFFF6F8F9),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Account type', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Customer'),
                    selected: _selectedRole == UserRole.customer,
                    onSelected: (_) => setState(() => _selectedRole = UserRole.customer),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Worker'),
                    selected: _selectedRole == UserRole.worker,
                    onSelected: (_) => setState(() => _selectedRole = UserRole.worker),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                        final navigator = Navigator.of(context);
                        final messenger = ScaffoldMessenger.of(context);

                        setState(() => _isLoading = true);

                        try {
                          final success = await authController.loginWithGoogle(
                            role: _selectedRole,
                            signupFlow: true,
                          );

                          if (!mounted || !success) return;

                          final nextScreen = authController.currentUserRole == UserRole.worker
                              ? const WorkerRegistrationScreen()
                              : const HomeScreen();

                          navigator.pushAndRemoveUntil(
                            MaterialPageRoute(builder: (_) => nextScreen),
                            (route) => false,
                          );
                        } catch (error) {
                          messenger.showSnackBar(
                            SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
                          );
                        } finally {
                          if (mounted) {
                            setState(() => _isLoading = false);
                          }
                        }
                      },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: primaryGreen),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset('assets/images/google_logo.png', height: 20),
                    const SizedBox(width: 10),
                    const Text('Continue with Google', style: TextStyle(color: primaryGreen, fontSize: 16, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _sendOtp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.4),
                      )
                    : const Text('Send OTP', style: TextStyle(color: Colors.white, fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

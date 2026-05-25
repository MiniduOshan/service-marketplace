import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'phone_login_screen.dart';
import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../customer/home_screen.dart';
import '../worker/worker_registration_screen.dart';


class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  // --- HELPER METHODS ---
  InputDecoration _inputDecoration({required String hintText, required IconData prefixIcon, Widget? suffixIcon}) {
    return InputDecoration(
      hintText: hintText, hintStyle: const TextStyle(color: Color(0xFF8D9CA8), fontSize: 16),
      filled: true, fillColor: const Color(0xFFF6F8F9),
      prefixIcon: Icon(prefixIcon, color: const Color(0xFF8D9CA8)),
      suffixIcon: suffixIcon, contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF006D44), width: 1.5)),
    );
  }

  Widget _buildOrSeparator() {
    return const Row(children: [
        Expanded(child: Divider(color: Color(0xFFC8D1D8))),
        Padding(padding: EdgeInsets.symmetric(horizontal: 16), child: Text("OR", style: TextStyle(color: Color(0xFF8D9CA8), fontWeight: FontWeight.bold))),
        Expanded(child: Divider(color: Color(0xFFC8D1D8))),
    ]);
  }

  Widget _buildSocialButton({required VoidCallback onPressed, String? imageAsset, required String label}) {
    return SizedBox(width: double.infinity, height: 56,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: Color(0xFFC8D1D8)), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            if (imageAsset != null) Image.asset(imageAsset, height: 24),
            const SizedBox(width: 12),
            Text(label, style: const TextStyle(color: Color(0xFF0D1B2A), fontSize: 16, fontWeight: FontWeight.w600)),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF006D44);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Color(0xFF1D2125)), onPressed: () => Navigator.of(context).pop()),
        title: const Text("SkilledLK", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Create an account", style: TextStyle(fontSize: 32, fontWeight: FontWeight.w700, color: Color(0xFF030D16))),
            const SizedBox(height: 32),
            
            // Name Field
            const Text("Full Name", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(controller: _nameController, decoration: _inputDecoration(hintText: "Enter your full name", prefixIcon: Icons.person_outline)),
            const SizedBox(height: 20),

            // Email Field
            const Text("Email Address", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(controller: _emailController, decoration: _inputDecoration(hintText: "Enter your email", prefixIcon: Icons.email_outlined)),
            const SizedBox(height: 20),

            // Password Field
            const Text("Password", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(controller: _passwordController, obscureText: _obscurePassword,
              decoration: _inputDecoration(hintText: "Create a password", prefixIcon: Icons.lock_outline,
                suffixIcon: IconButton(icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword)))),
            
            const SizedBox(height: 32),
            // Sign Up Button (Handles Login Flow redirection)
            SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : () async {
                  setState(() => _isLoading = true);

                  final success = await authController.registerCustomer(
                    _nameController.text,
                    _emailController.text,
                    _passwordController.text,
                  );

                  if (!context.mounted) return;
                  setState(() => _isLoading = false);

                  if (success) {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => const HomeScreen()),
                      (route) => false,
                    );
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28))),
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text("Sign Up", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 24),
            _buildOrSeparator(),
            const SizedBox(height: 24),
            _buildSocialButton(onPressed: () async {
              final navigator = Navigator.of(context);
              final messenger = ScaffoldMessenger.of(context);

              try {
                final success = await authController.loginWithGoogle(
                  role: UserRole.customer,
                  signupFlow: true,
                );

                if (!mounted || !success) return;

                final nextScreen = authController.currentUserRole == UserRole.worker
                    ? const WorkerRegistrationScreen()
                    : const HomeScreen();

                navigator.pushAndRemoveUntil(
                  MaterialPageRoute(builder: (context) => nextScreen),
                  (route) => false,
                );
              } catch (error) {
                messenger.showSnackBar(
                  SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
                );
              }
            }, imageAsset: 'assets/images/google_logo.png', label: "Sign up with Google"),

            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const PhoneLoginScreen()));
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF006D44)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: const Text("Sign up with phone number", style: TextStyle(color: Color(0xFF006D44), fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),

            const SizedBox(height: 32),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Text("Already have an account? "),
                TextButton(onPressed: () => Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen())), child: const Text("Log in", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold))),
            ]),
          ],
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import '../customer/home_screen.dart'; 
import 'signup_screen.dart';
import 'phone_login_screen.dart';
import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../worker/worker_registration_screen.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
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
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Login", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 32),
            const Text("Welcome Back", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 32),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              autofillHints: const [AutofillHints.email],
              decoration: InputDecoration(
                hintText: "Email",
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _passwordController,
              obscureText: true,
              autofillHints: const [AutofillHints.password],
              decoration: InputDecoration(
                hintText: "Password",
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                onPressed: () {
                  authController.loginWithEmail(_emailController.text, _passwordController.text).then((success) {
                    if (!context.mounted || !success) return;

                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => const HomeScreen()),
                      (route) => false,
                    );
                  }).catchError((error) {
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
                    );
                  });
                },
                child: const Text("Sign In", style: TextStyle(color: Colors.white, fontSize: 18)),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton(
                onPressed: () async {
                  final navigator = Navigator.of(context);
                  final messenger = ScaffoldMessenger.of(context);

                  try {
                    final success = await authController.loginWithGoogle(
                      role: UserRole.customer,
                      signupFlow: false,
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
                  }
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF006D44)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset('assets/images/google_logo.png', height: 20),
                    const SizedBox(width: 10),
                    const Text('Continue with Google', style: TextStyle(color: Color(0xFF006D44), fontSize: 16, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const PhoneLoginScreen()));
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF006D44)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                child: const Text("Continue with phone number", style: TextStyle(color: Color(0xFF006D44))),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text("New here? "),
                TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const SignupScreen()));
                  },
                  child: const Text("Create an account", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF006D44))),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
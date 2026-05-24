import 'package:flutter/material.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();

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
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(color: Color(0xFFE8F1EE), shape: BoxShape.circle),
                child: const Icon(Icons.key_outlined, color: primaryGreen, size: 40))),
            const SizedBox(height: 32),
            const Text("Forgot Password?", style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: Color(0xFF030D16))),
            const SizedBox(height: 8),
            const Text("Enter your registered email below to receive password reset instructions", style: TextStyle(fontSize: 16, color: Color(0xFF5D6B78))),
            const SizedBox(height: 40),

            // Email Field (Standard styling)
            const Text("Email Address", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1D2125))),
            const SizedBox(height: 8),
            TextField(controller: _emailController, keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                hintText: "Enter your email", hintStyle: const TextStyle(color: Color(0xFF8D9CA8), fontSize: 16),
                filled: true, fillColor: const Color(0xFFF6F8F9),
                prefixIcon: const Icon(Icons.email_outlined, color: Color(0xFF8D9CA8)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFC8D1D8))),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFC8D1D8))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: primaryGreen, width: 1.5)),
              ),
            ),
            const Spacer(),

            // Send Instructions Button
            SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton(
                onPressed: () {}, // Implement send reset instructions
                style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28))),
                child: const Text("Send Instructions", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
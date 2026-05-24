import 'package:flutter/material.dart';
import '../customer/home_screen.dart';


class PhoneLoginScreen extends StatefulWidget {
  const PhoneLoginScreen({super.key});

  @override
  State<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends State<PhoneLoginScreen> {
  final _phoneController = TextEditingController();
  final String _selectedCountryCode = "+94"; // Hardcoded Sri Lanka default

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
                // Ensure this icon looks similar to image_8.png placeholder
                child: const Icon(Icons.chat_bubble_outline, color: primaryGreen, size: 40))),
            const SizedBox(height: 32),
            const Text("Enter your phone number", style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: Color(0xFF030D16))),
            const SizedBox(height: 8),
            const Text("We'll send a 6-digit OTP to verify your number", style: TextStyle(fontSize: 16, color: Color(0xFF5D6B78))),
            const SizedBox(height: 40),

            // Phone Input Row (Matches image_8.png placeholder layout)
            Row(children: [
                // Country Picker Placeholder
                Container(
                  height: 60, padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(color: const Color(0xFFF6F8F9), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFC8D1D8))),
                  child: Row(children: [
                      const Icon(Icons.flag, color: Colors.amber, size: 20), // Placeholder flag
                      const SizedBox(width: 8),
                      Text(_selectedCountryCode, style: const TextStyle(fontSize: 16, color: Color(0xFF0D1B2A))),
                      const Icon(Icons.arrow_drop_down, color: Color(0xFF8D9CA8)),
                  ]),
                ),
                const SizedBox(width: 12),
                
                // Phone Number Field
                Expanded(
                  child: TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    style: const TextStyle(fontSize: 18, color: Color(0xFF0D1B2A), fontWeight: FontWeight.w600),
                    decoration: InputDecoration(
                      hintText: "77 123 4567",
                      hintStyle: const TextStyle(color: Color(0xFF8D9CA8), fontSize: 16, fontWeight: FontWeight.normal),
                      filled: true, fillColor: const Color(0xFFF6F8F9),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFC8D1D8))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFC8D1D8))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: primaryGreen, width: 1.5)),
                    ),
                  ),
                ),
            ]),
            const Spacer(),

            // Send OTP Button
            SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
                style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28))),
                child: const Text("Send OTP", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
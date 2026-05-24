import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../controllers/auth_controller.dart';
import '../customer/home_screen.dart';


class OTPVerificationScreen extends StatefulWidget {
  final String verificationTarget;
  const OTPVerificationScreen({super.key, required this.verificationTarget});

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  final _otpController = TextEditingController();
  late final PinInputController _pinInputController;

  @override
  void initState() {
    super.initState();
    _pinInputController = PinInputController();
  }

  @override
  void dispose() {
    _otpController.dispose();
    _pinInputController.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF006D44);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.black), onPressed: () => Navigator.pop(context)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Text("Verify Phone", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text("Code sent to ${widget.verificationTarget}"),
            const SizedBox(height: 40),
            MaterialPinField(
              length: 6,
              pinController: _pinInputController,
              onChanged: (value) {
                _otpController.text = value;
              },

              theme: MaterialPinTheme(
                shape: MaterialPinShape.outlined,
                borderRadius: BorderRadius.circular(8),
                cellSize: const Size(40, 50),
                borderColor: Colors.grey[300]!,
                focusedBorderColor: primaryGreen,
                filledBorderColor: primaryGreen,
              ),
            ),

            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                onPressed: () {
                  if (_otpController.text.trim().length != 6) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Enter the 6-digit code to continue.')),
                    );
                    return;
                  }

                  if (!authController.hasPendingLogin()) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('No pending sign-in session found.')),
                    );
                    return;
                  }

                  authController.completePendingLogin();

                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
                child: const Text("Verify", style: TextStyle(color: Colors.white, fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
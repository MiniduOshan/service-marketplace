import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../customer/home_screen.dart';
import '../worker/worker_registration_screen.dart';


class OTPVerificationScreen extends StatefulWidget {
  final String verificationTarget;
  final String phoneNumber;
  const OTPVerificationScreen({super.key, required this.verificationTarget, required this.phoneNumber});

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  final _otpController = TextEditingController();
  late final PinInputController _pinInputController;
  bool _isLoading = false;
  String? _errorMessage;

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

            if (_errorMessage != null) ...[
              const SizedBox(height: 16),
              Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
            ],

            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
                onPressed: () async {
                  if (_otpController.text.trim().length != 6) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Enter the 6-digit code to continue.')),
                    );
                    return;
                  }

                  setState(() {
                    _isLoading = true;
                    _errorMessage = null;
                  });

                  try {
                    await authController.verifyPhoneOtp(widget.phoneNumber, _otpController.text.trim());
                    if (!context.mounted) return;

                    final nextScreen = authController.currentUserRole == UserRole.worker
                      ? const WorkerRegistrationScreen()
                      : const HomeScreen();

                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => nextScreen),
                      (route) => false,
                    );
                  } catch (error) {
                    if (!context.mounted) return;
                    setState(() {
                      _errorMessage = error.toString().replaceFirst('Exception: ', '');
                    });
                  } finally {
                    if (context.mounted) {
                      setState(() => _isLoading = false);
                    }
                  }
                },
                child: _isLoading
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.4),
                      )
                    : const Text("Verify", style: TextStyle(color: Colors.white, fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
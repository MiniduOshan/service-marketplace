import 'package:flutter/material.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF006D44);
    const Color darkGreenBackground = Color(0xFF004D30);
    const Color secondaryText = Color(0xB3FFFFFF); // 70% white

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              darkGreenBackground,
              primaryGreen,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              children: [
                const SizedBox(height: 30),
                const Text('SkilledLK', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                const Spacer(flex: 2),
                
                // Circular Illustration Area
                Container(
                  width: 250, height: 250,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle, color: Colors.white,
                    image: const DecorationImage(
                      // Ensure this image is in assets/images/welcome_illustration.png
                      image: AssetImage('assets/images/welcome_illustration.png'), 
                      fit: BoxFit.cover,
                    ),

                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 5))
                    ],

                  ),
                ),
                const Spacer(flex: 3),
                const Text('Your home deserves the best.', textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w700, height: 1.2)),
                const SizedBox(height: 16),
                const Text('Connect with trusted local experts for every project, from repairs to renovations.', textAlign: TextAlign.center,
                  style: TextStyle(color: secondaryText, fontSize: 16, height: 1.5)),
                
                const Spacer(flex: 4),

                // Find a worker button (CUSTOMER FLOW)
                SizedBox(
                  width: double.infinity, height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      // Users who click "Find a Worker" go to standard login (email/google)
                      Navigator.pushNamed(context, '/login');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Find a worker', style: TextStyle(color: primaryGreen, fontSize: 18, fontWeight: FontWeight.bold)),
                        SizedBox(width: 8), Icon(Icons.arrow_forward, color: primaryGreen),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Join as a worker button (WORKER FLOW)
                SizedBox(
                  width: double.infinity, height: 56,
                  child: OutlinedButton(
                    onPressed: () {
                      // Only Join as Workers need the specialized phone number flow (image_8.png)
                      Navigator.pushNamed(context, '/phone-login');
                    },
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.white, width: 2),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                    child: const Text('Join as a worker', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600)),
                  ),
                ),
                
                const Spacer(flex: 3),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
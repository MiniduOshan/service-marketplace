import 'package:flutter/material.dart';

import '../../models/onboarding_model.dart';


class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int currentIndex = 0;
  late PageController _controller;

  // 2. Data for all slides
  final List<OnboardingData> onboardingContents = [
    OnboardingData(
      title: "Find skilled workers near you",
      description: "Painters, electricians, plumbers and more — verified professionals across Sri Lanka",
      image: "assets/images/onboarding1.png",
    ),

    OnboardingData(
      title: "Every worker is verified",
      description: "ID checked, rated by real customers, and monitored for quality.",
      image: "assets/images/onboarding2.png",
    ),

    OnboardingData(
      title: "Book in minutes",
      description: "Choose a package, pick your date, and pay securely — all in one place.",
      image: "assets/images/onboarding3.png",
    ),

  ];

  @override
  void initState() {
    super.initState();
    _controller = PageController(initialPage: 0);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Pre-cache images to avoid frame skips during slide transitions
    for (var content in onboardingContents) {
      precacheImage(AssetImage(content.image), context);
    }
  }


  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // Helper method for dot indicator
  Container _buildDot(int index) {
    return Container(
      height: 8,
      width: currentIndex == index ? 20 : 8,
      margin: const EdgeInsets.only(right: 5),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: currentIndex == index ? const Color(0xFF006D44) : Colors.grey[300],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryGreen = Color(0xFF006D44);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const Padding(
          padding: EdgeInsets.all(8.0),
          child: Icon(Icons.grid_view_rounded, color: primaryGreen),
        ),
        title: const Text("SkilledLK", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        actions: [
          TextButton(
            onPressed: () {
              // Navigates to the role selection page
              Navigator.pushNamed(context, '/welcome');

            }, 
            child: const Text("Skip", style: TextStyle(color: Colors.grey, fontSize: 16)),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _controller,
              itemCount: onboardingContents.length,
              onPageChanged: (int index) {
                setState(() {
                  currentIndex = index;
                });
              },
              itemBuilder: (_, i) {
                return Padding(
                  padding: const EdgeInsets.all(40),
                  child: Column(
                    children: [
                      Image.asset(onboardingContents[i].image, height: 250),
                      const SizedBox(height: 40),
                      Text(
                        onboardingContents[i].title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0D1B2A)),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        onboardingContents[i].description,
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          
          // Dot Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              onboardingContents.length,
              (index) => _buildDot(index),
            ),
          ),
          
          // Main Button
          Container(
            height: 55,
            margin: const EdgeInsets.all(40),
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryGreen,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                if (currentIndex == onboardingContents.length - 1) {
                  // Final Slide -> Navigate to Role selection
                  Navigator.pushNamed(context, '/welcome');

                } else {
                  // Next Slide
                  _controller.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeIn);
                }
              },
              child: Text(
                currentIndex == onboardingContents.length - 1 ? "Get Started" : "Continue",
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          )
        ],
      ),
    );
  }
}
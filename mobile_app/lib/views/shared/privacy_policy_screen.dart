import 'package:flutter/material.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Terms & Privacy Policy", 
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Last Updated: May 2026", 
              style: TextStyle(color: Colors.grey, fontSize: 13, fontStyle: FontStyle.italic)),
            const SizedBox(height: 25),
            _buildSection("1. Introduction", 
              "Welcome to SkilledLK. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us."),
            _buildSection("2. Information We Collect", 
              "We collect personal information that you voluntarily provide to us when registering at the App, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us."),
            _buildSection("3. How We Use Your Information", 
              "We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations."),
            _buildSection("4. Sharing Your Information", 
              "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations."),
            _buildSection("5. Your Privacy Rights", 
              "In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information."),
            const SizedBox(height: 40),
            Center(
              child: Text("© 2026 SkilledLK Platform. All rights reserved.", 
                style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 25),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryGreen)),
          const SizedBox(height: 12),
          Text(content, 
            style: const TextStyle(fontSize: 14, color: Color(0xFF475569), height: 1.6)),
        ],
      ),
    );
  }
}

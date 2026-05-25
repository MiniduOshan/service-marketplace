import 'package:flutter/material.dart';

class WorkerReviewsScreen extends StatelessWidget {
  const WorkerReviewsScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textLight = Color(0xFF64748B);
  static const Color scaffoldBg = Color(0xFFF8FAFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Reviews",
          style: TextStyle(
            color: primaryGreen,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.rate_review_outlined, size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                "No Reviews Yet",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: textDark,
                ),
              ),
              SizedBox(height: 8),
              Text(
                "Your rating breakdown and customer feedback will show up here once you complete bookings.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: textLight,
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: primaryGreen,
      unselectedItemColor: Colors.grey,
      currentIndex: 3,
      selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
      onTap: (index) {
        if (index == 0) Navigator.pushNamed(context, '/worker-dashboard');
        if (index == 1) Navigator.pushNamed(context, '/job-requests');
        if (index == 2) Navigator.pushNamed(context, '/worker-wallet');
        if (index == 3) Navigator.pushNamed(context, '/worker-profile');
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.grid_view), label: "Dashboard"),
        BottomNavigationBarItem(icon: Icon(Icons.work_outline), label: "Jobs"),
        BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), label: "Earnings"),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
      ],
    );
  }
}

import 'package:flutter/material.dart';

class WorkerPaymentSettingsScreen extends StatelessWidget {
  const WorkerPaymentSettingsScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);
  static const Color scaffoldBg = Color(0xFFF8FAFC);
  static const Color accentBlue = Color(0xFF1E293B);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Payment Details",
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader("PRIMARY PAYOUT METHOD"),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
              child: Text(
                "No bank account linked yet.",
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ),
            const SizedBox(height: 20),
            _buildSectionHeader("ADDITIONAL METHODS"),
            _buildAddMethodTile(context),
            const SizedBox(height: 30),
            _buildSectionHeader("WITHDRAWAL SETTINGS"),
            _buildSettingsTile(
              context,
              Icons. monetization_on_outlined,
              "Minimum Payout",
              "LKR 2,500",
            ),
            _buildSettingsTile(
              context,
              Icons.history_toggle_off,
              "Payout Schedule",
              "Weekly (Friday)",
            ),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: OutlinedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Redirecting to withdrawal history...")),
                  );
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: primaryGreen),
                  minimumSize: const Size(double.infinity, 55),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                ),
                child: const Text(
                  "View Transaction History",
                  style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildBankCard(BuildContext context, String bankName, String accNumber, String type, {bool isPrimary = false}) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: accentBlue,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: accentBlue.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Icon(Icons.account_balance, color: Colors.white70, size: 24),
              if (isPrimary)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: primaryGreen,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    "PRIMARY",
                    style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 25),
          Text(
            accNumber,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 25),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("BANK", style: TextStyle(color: Colors.white54, fontSize: 10)),
                  Text(bankName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text("TYPE", style: TextStyle(color: Colors.white54, fontSize: 10)),
                  Text(type, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAddMethodTile(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: primaryGreen.withValues(alpha: 0.2), style: BorderStyle.solid),
      ),
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Add bank account feature coming soon!")),
          );
        },
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.add_circle_outline, color: primaryGreen),
            SizedBox(width: 10),
            Text(
              "Add New Bank Account",
              style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile(BuildContext context, IconData icon, String title, String value) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      child: ListTile(
        leading: Icon(icon, color: accentBlue),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(value, style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
            const Icon(Icons.chevron_right, color: Colors.grey),
          ],
        ),
        onTap: () {},
      ),
    );
  }
}

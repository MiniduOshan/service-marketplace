import 'package:flutter/material.dart';

class WorkerWalletScreen extends StatelessWidget {
  const WorkerWalletScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          title: const Text("Earnings & Wallet", 
            style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
          centerTitle: true,
          actions: [IconButton(icon: const Icon(Icons.ios_share, color: primaryGreen), onPressed: () {})],
          bottom: const TabBar(
            labelColor: primaryGreen,
            unselectedLabelColor: Colors.grey,
            indicatorColor: primaryGreen,
            tabs: [Tab(text: "This month"), Tab(text: "Last month"), Tab(text: "This year")],
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              _buildMainBalanceCard(context),
              const SizedBox(height: 20),
              _buildQuickStatsRow(),
              const SizedBox(height: 24),
              _buildPlatformFeesCard(),
              const SizedBox(height: 20),
              _buildProPlanBanner(context),
              const SizedBox(height: 24),
              _buildRecentTransactions(context),
              const SizedBox(height: 24),
              _buildWithdrawalSection(context),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMainBalanceCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: primaryGreen,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          const Text("TOTAL EARNED — APRIL 2025", 
            style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text("LKR 42,000", 
            style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
          const Text("+18% vs last month ↑", 
            style: TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 24),
          OutlinedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Withdrawal process initiated!")));
            },
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Colors.white38),
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Withdraw funds", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStatsRow() {
    return Row(
      children: [
        _statBox("12", "JOBS DONE"),
        const SizedBox(width: 12),
        _statBox("2.5k", "FEE PAID"),
        const SizedBox(width: 12),
        _statBox("39k", "NET PAY"),
      ],
    );
  }

  Widget _statBox(String val, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
        child: Column(
          children: [
            Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryGreen)),
            Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildPlatformFeesCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Platform Fees", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _feeRow("Gross earnings", "LKR 42,000"),
          _feeRow("Commission (5%)", "- LKR 2,000", color: Colors.red),
          _feeRow("Lead fees paid", "- LKR 500", color: Colors.red),
          const Divider(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Net payout", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const Text("LKR 39,500", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryGreen)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _feeRow(String label, String val, {Color color = Colors.black}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(val, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildProPlanBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFEF3C7)),
      ),
      child: Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Pro Plan — LKR 2,500/month", style: TextStyle(color: Color(0xFF92400E), fontWeight: FontWeight.bold)),
                Text("Next billing: May 15", style: TextStyle(color: Color(0xFFD97706), fontSize: 12)),
              ],
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pushNamed(context, '/worker-subscription'),
            child: const Text("MANAGE", style: TextStyle(color: Color(0xFF1B434D), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTransactions(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Recent transactions", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            TextButton(onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Full transaction history coming soon!")));
            }, child: const Text("See all", style: TextStyle(color: primaryGreen))),
          ],
        ),
        _transactionTile("Deep Cleaning - Apartment", "+ LKR 4,500", "Apr 12, 2025", "PAID", Colors.green),
        _transactionTile("Service Fee Deduction", "- LKR 250", "Apr 10, 2025", "COMPLETED", Colors.grey),
        _transactionTile("Gardening Service", "+ LKR 3,200", "Apr 09, 2025", "PAID", Colors.green),
      ],
    );
  }

  Widget _transactionTile(String title, String val, String date, String status, Color statusColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(date, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              const SizedBox(height: 4),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(val, style: TextStyle(fontWeight: FontWeight.bold, color: val.contains('+') ? Colors.green : Colors.red)),
              const SizedBox(height: 4),
              Text(status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: statusColor)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWithdrawalSection(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Bank account", style: TextStyle(fontWeight: FontWeight.bold)),
              TextButton(onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Bank settings coming soon!")));
              }, child: const Text("Change", style: TextStyle(color: primaryGreen))),
            ],
          ),
          const Text("****1234 (Sampath Bank)", style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("AVAILABLE TO WITHDRAW", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text("LKR 39,500", style: TextStyle(color: primaryGreen, fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Withdrawal request submitted!"), backgroundColor: primaryGreen));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryGreen,
              minimumSize: const Size(double.infinity, 55),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Withdraw", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ],
      ),
    );
  }
}
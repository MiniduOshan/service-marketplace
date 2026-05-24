import 'package:flutter/material.dart';

class WorkerSubscriptionScreen extends StatelessWidget {
  const WorkerSubscriptionScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: primaryGreen), onPressed: () => Navigator.pop(context)),
        title: const Text("Subscription & Plan", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildActivePlanHeader(context),
            const SizedBox(height: 30),
            const Text("What Pro gives you", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildBenefitsList(),
            const SizedBox(height: 30),
            const Text("Plan comparison", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildPlanComparison(),
            const SizedBox(height: 30),
            _buildPriorityScoreCard(),
            const SizedBox(height: 24),
            _buildPayPerLeadToggle(context),
            const SizedBox(height: 30),
            Center(child: TextButton(onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Payment settings coming soon!")));
            }, child: const Text("Manage payment method", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)))),
            const Center(child: Text("•", style: TextStyle(color: Colors.grey))),
            Center(child: TextButton(onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Support chat coming soon!")));
            }, child: const Text("Contact support", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)))),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildActivePlanHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: primaryGreen,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.stars, color: Colors.white),
              SizedBox(width: 8),
              Text("Pro Plan — Active", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          const Text("Renews 15 May 2025 · LKR 2,500/month", style: TextStyle(color: Colors.white70)),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(30)),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.trending_up, color: Colors.white, size: 16),
                SizedBox(width: 8),
                Text("PRIORITY SCORE BOOST: +25 POINTS", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Cancellation request submitted."), backgroundColor: Colors.red));
            }, child: const Text("Cancel plan", style: TextStyle(color: Colors.white70))),
          ),
        ],
      ),
    );
  }

  Widget _buildBenefitsList() {
    final benefits = [
      "Appear in top 5 search results",
      "\"Featured\" badge on profile",
      "Get job leads before free members",
      "Unlimited bookings per month",
      "Analytics dashboard access",
      "Priority support"
    ];
    return Container(
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
      child: Column(
        children: benefits.map((b) => ListTile(
          leading: const Icon(Icons.check_circle, color: Colors.green),
          title: Text(b, style: const TextStyle(fontSize: 14)),
          visualDensity: VisualDensity.compact,
        )).toList(),
      ),
    );
  }

  Widget _buildPlanComparison() {
    return Row(
      children: [
        _comparisonCard("Free", "LKR 0/month", ["Basic Profile"], ["Featured Badge", "Early Leads"]),
        const SizedBox(width: 16),
        _comparisonCard("Pro", "LKR 2,500/mo", ["Premium Profile", "Featured Badge", "Early Leads"], [], isCurrent: true),
      ],
    );
  }

  Widget _comparisonCard(String title, String price, List<String> pros, List<String> cons, {bool isCurrent = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isCurrent ? const Color(0xFFE8F6F1) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isCurrent ? primaryGreen : Colors.grey.shade200, width: isCurrent ? 2 : 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isCurrent) Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
              decoration: BoxDecoration(color: primaryGreen, borderRadius: BorderRadius.circular(20)),
              child: const Text("CURRENT", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text(price, style: const TextStyle(color: Colors.grey, fontSize: 12)),
            const Divider(height: 24),
            ...pros.map((p) => _row(Icons.check, Colors.green, p)),
            ...cons.map((c) => _row(Icons.close, Colors.red, c)),
            const SizedBox(height: 20),
            Center(child: Text(isCurrent ? "ACTIVE PLAN" : "UPGRADABLE", style: TextStyle(color: isCurrent ? primaryGreen : Colors.grey, fontWeight: FontWeight.bold, fontSize: 12))),
          ],
        ),
      ),
    );
  }

  Widget _row(IconData icon, Color color, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(children: [Icon(icon, size: 14, color: color), const SizedBox(width: 8), Text(text, style: const TextStyle(fontSize: 11))]),
    );
  }

  Widget _buildPriorityScoreCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Your priority score", style: TextStyle(color: Colors.grey)),
              Text("87 /100", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: primaryGreen)),
            ],
          ),
          const SizedBox(height: 16),
          _scoreBreakdownRow("Distance (Live)", "+20"),
          _scoreBreakdownRow("Rating 4.9", "+25"),
          _scoreBreakdownRow("Pro Subscription", "+25", isHighlight: true),
          _scoreBreakdownRow("Activity Level", "+12"),
          _scoreBreakdownRow("Response Rate", "+5"),
        ],
      ),
    );
  }

  Widget _scoreBreakdownRow(String label, String points, {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [CircleAvatar(radius: 4, backgroundColor: isHighlight ? primaryGreen : Colors.grey), const SizedBox(width: 10), Text(label)]),
          Text(points, style: TextStyle(fontWeight: FontWeight.bold, color: isHighlight ? primaryGreen : Colors.black)),
        ],
      ),
    );
  }

  Widget _buildPayPerLeadToggle(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.payments_outlined, color: Colors.grey),
              const SizedBox(width: 12),
              const Expanded(child: Text("Pay-per-lead option", style: TextStyle(fontWeight: FontWeight.bold))),
              Switch(value: false, onChanged: (v) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Switching mode coming soon!")));
              }),
            ],
          ),
          const Padding(
            padding: EdgeInsets.only(top: 8),
            child: Text("LKR 150 per job request. Available if you switch to lead-based mode. Pro features will be disabled.", 
              style: TextStyle(color: Colors.grey, fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
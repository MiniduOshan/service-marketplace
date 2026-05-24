import 'package:flutter/material.dart';

class WorkerProfilePublicScreen extends StatelessWidget {
  const WorkerProfilePublicScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: primaryGreen), onPressed: () => Navigator.pop(context)),
        title: const Text("Worker Profile", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        actions: [IconButton(icon: const Icon(Icons.share_outlined, color: primaryGreen), onPressed: (){})],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(),
            _buildStats(),
            _buildPackages(context),
            _buildAbout(),
            _buildPortfolio(),
            _buildLocation(),
            _buildReviews(),
            const SizedBox(height: 100), // Space for bottom bar
          ],
        ),
      ),
      bottomSheet: _buildBottomActions(context),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        const CircleAvatar(radius: 40, backgroundColor: Color(0xFFE8F6F1), child: Text("KS", style: TextStyle(fontSize: 24, color: primaryGreen, fontWeight: FontWeight.bold))),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Kasun Silva", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(width: 8),
            _tag("VERIFIED", Colors.green),
            const SizedBox(width: 4),
            _tag("FEATURED", Colors.orange),
          ],
        ),
        const Text("Painter • Colombo 5 • 8 years experience", style: TextStyle(color: Colors.grey)),
        const Text("⭐ 4.9 • 127 reviews • 2.1 km away", style: TextStyle(color: Colors.grey)),
      ],
    );
  }

  Widget _tag(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
      child: Text(text, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildStats() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      child: Row(
        children: [
          _statItem("127", "Jobs Done", Colors.blue.shade50),
          const SizedBox(width: 10),
          _statItem("4.9", "Rating", Colors.purple.shade50),
          const SizedBox(width: 10),
          _statItem("94%", "Response", Colors.green.shade50),
        ],
      ),
    );
  }

  Widget _statItem(String val, String label, Color bg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
        child: Column(children: [
          Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ]),
      ),
    );
  }

  Widget _buildPackages(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Service Packages", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                _packageTile(context, "Room painting", "LKR 5,000"),
                const Divider(height: 1),
                _packageTile(context, "Full house (3BR)", "LKR 35,000"),
                const Divider(height: 1),
                _packageTile(context, "Custom quote", "Negotiable", isNegotiable: true),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _packageTile(BuildContext context, String title, String price, {bool isNegotiable = false}) {
    return ListTile(
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(price, style: TextStyle(color: isNegotiable ? Colors.green : Colors.black, fontWeight: FontWeight.bold)),
      trailing: OutlinedButton(
        style: OutlinedButton.styleFrom(side: const BorderSide(color: primaryGreen)),
        onPressed: () => Navigator.pushNamed(context, '/booking-steps'),
        child: const Text("Select", style: TextStyle(color: primaryGreen))
      ),
    );
  }

  Widget _buildAbout() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text("About Kasun", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text("Professional painter with a focus on high-quality finishes and attention to detail...", style: TextStyle(color: Colors.grey)),
        const SizedBox(height: 10),
        Wrap(spacing: 8, children: [
          _chip("Interior Painting"), _chip("Exterior"), _chip("Waterproofing"),
        ]),
      ]),
    );
  }

  Widget _chip(String label) {
    return Chip(label: Text(label, style: const TextStyle(fontSize: 12)), backgroundColor: Colors.grey.shade100, side: BorderSide.none);
  }

  Widget _buildPortfolio() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const Text("Portfolio", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextButton(onPressed: (){}, child: const Text("View all", style: TextStyle(color: primaryGreen))),
        ]),
        Row(children: [
          Expanded(child: Container(height: 150, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(12)))),
          const SizedBox(width: 10),
          Expanded(child: Container(height: 150, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(12)))),
        ]),
      ]),
    );
  }

  Widget _buildLocation() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text("Location", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(height: 150, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)), child: const Center(child: Icon(Icons.map_outlined, size: 40, color: Colors.grey))),
        const SizedBox(height: 8),
        const Text("Serves: Colombo, Gampaha", style: TextStyle(fontWeight: FontWeight.bold)),
      ]),
    );
  }

  Widget _buildReviews() {
    return const Padding(
      padding: EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text("Ratings & Reviews", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        SizedBox(height: 10),
        Row(children: [
          Text("4.9", style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
          SizedBox(width: 20),
          Expanded(child: Text("⭐⭐⭐⭐⭐\n127 reviews")),
        ]),
      ]),
    );
  }

  Widget _buildBottomActions(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0xFFF1F4F9)))),
      child: Row(children: [
        Expanded(child: OutlinedButton(onPressed: () => Navigator.pushNamed(context, '/chat'), child: const Text("Chat first"))),
        const SizedBox(width: 10),
        Expanded(child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: primaryGreen), onPressed: () => Navigator.pushNamed(context, '/booking-steps'), child: const Text("Book now", style: TextStyle(color: Colors.white)))),
      ]),
    );
  }
}
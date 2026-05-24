import 'package:flutter/material.dart';

class JobRequestsScreen extends StatelessWidget {
  const JobRequestsScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);
  static const Color backgroundGrey = Color(0xFFF8FAFC);

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: backgroundGrey,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          title: const Text(
            "Job Requests",
            style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          bottom: TabBar(
            isScrollable: true,
            labelColor: primaryGreen,
            unselectedLabelColor: Colors.grey,
            indicatorColor: primaryGreen,
            indicatorWeight: 3,
            tabs: [
              Tab(child: Row(children: [Text("Pending"), SizedBox(width: 4), _countBadge("3", Colors.red)])),
              Tab(child: Row(children: [Text("Active"), SizedBox(width: 4), _countBadge("2", Colors.blue)])),
              Tab(text: "Completed"),
              Tab(text: "Cancelled"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildPendingList(context),
            _buildActiveList(context),
            const Center(child: Text("Completed Jobs")),
            const Center(child: Text("Cancelled Jobs")),
          ],
        ),
      ),
    );
  }

  static Widget _countBadge(String count, Color color) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
      child: Text(count, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildPendingList(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildNewRequestCard(context),
        const SizedBox(height: 16),
        _buildStandardRequestCard(context),
      ],
    );
  }

  Widget _buildActiveList(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildInProgressCard(context),
      ],
    );
  }

  // 1. Detailed New Request Card
  Widget _buildNewRequestCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _statusLabel("New Request", Colors.green),
              const Text("2 mins ago", style: TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 12),
          const Text("Room Painting —\nBedroom", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, height: 1.2)),
          const SizedBox(height: 16),
          _customerRow("Nimal Karunaratne", "4.8 rating"),
          const SizedBox(height: 16),
          _buildInfoGrid(),
          const SizedBox(height: 16),
          const Text(
            "I need my master bedroom painted. It's roughly 12x14 feet. Wall preparation and...",
            style: TextStyle(color: Colors.grey, fontSize: 14),
          ),
          const SizedBox(height: 12),
          _buildImagePreview(),
          const SizedBox(height: 16),
          _timerBanner("Respond within 45 minutes", Icons.timer_outlined),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _outlinedBtn(context, "Decline", Colors.red, () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Request declined."), backgroundColor: Colors.red));
              })),
              const SizedBox(width: 8),
              Expanded(child: _outlinedBtn(context, "Chat first", Colors.black, () {
                Navigator.pushNamed(context, '/chat');
              })),
            ],
          ),
          const SizedBox(height: 8),
          _fullWidthBtn(context, "Accept Job", primaryGreen, () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Job accepted!"), backgroundColor: primaryGreen));
          }),
        ],
      ),
    );
  }

  // 2. Standard Pending Card
  Widget _buildStandardRequestCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _statusLabel("Pending", Colors.orange),
              const Text("45 mins ago", style: TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 12),
          const Text("Kitchen Sink Repair", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _customerRow("Samantha Perera", "4.5 rating"),
          const SizedBox(height: 16),
          _timerBanner("1 hour left to accept", Icons.warning_amber_rounded),
          const SizedBox(height: 16),
          _fullWidthBtn(context, "Accept Job", primaryGreen, () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Job accepted!"), backgroundColor: primaryGreen));
          }),
        ],
      ),
    );
  }

  // 3. In Progress Card
  Widget _buildInProgressCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF), // Light blue background
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _statusLabel("In Progress", Colors.blue),
          const SizedBox(height: 12),
          const Text("Garden Cleaning", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Row(
            children: [
              const CircleAvatar(radius: 18, backgroundColor: Colors.grey),
              const SizedBox(width: 8),
              const Text("Kamani Silva", style: TextStyle(fontWeight: FontWeight.bold)),
              const Spacer(),
              TextButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Initiating call...")));
                },
                icon: const Icon(Icons.phone, size: 16, color: Color(0xFF1E40AF)),
                label: const Text("Call customer", style: TextStyle(color: Color(0xFF1E40AF), fontWeight: FontWeight.bold)),
              )
            ],
          ),
          const SizedBox(height: 16),
          _fullWidthBtnWithIcon(context, "Mark as Complete", primaryGreen, Icons.check_circle_outline, () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Job marked as complete!"), backgroundColor: primaryGreen));
          }),
        ],
      ),
    );
  }

  // --- COMPONENT HELPERS ---

  Widget _statusLabel(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
      child: Text(text, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }

  Widget _customerRow(String name, String rating) {
    return Row(
      children: [
        const CircleAvatar(radius: 20, backgroundColor: Colors.grey),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Row(children: [const Icon(Icons.star, color: Colors.orange, size: 14), Text(" $rating", style: const TextStyle(color: Colors.grey, fontSize: 12))]),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoGrid() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
      child: GridView.count(
        shrinkWrap: true,
        crossAxisCount: 2,
        childAspectRatio: 4,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _infoItem(Icons.location_on_outlined, "Maharagama"),
          _infoItem(Icons.calendar_today_outlined, "28 April 2025"),
          _infoItem(Icons.access_time, "9:00 AM"),
          _infoItem(Icons.payments_outlined, "LKR 5,000", color: Colors.teal),
        ],
      ),
    );
  }

  Widget _infoItem(IconData icon, String text, {Color color = Colors.black87}) {
    return Row(children: [Icon(icon, size: 16, color: primaryGreen), const SizedBox(width: 8), Text(text, style: TextStyle(fontSize: 13, color: color, fontWeight: FontWeight.w500))]);
  }

  Widget _buildImagePreview() {
    return Row(
      children: [
        Container(width: 100, height: 70, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8))),
        const SizedBox(width: 8),
        Container(width: 100, height: 70, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8))),
      ],
    );
  }

  Widget _timerBanner(String text, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFFEF3C7))),
      child: Row(children: [Icon(icon, size: 18, color: const Color(0xFFD97706)), const SizedBox(width: 8), Text(text, style: const TextStyle(color: Color(0xFFD97706), fontWeight: FontWeight.bold, fontSize: 13))]),
    );
  }

  Widget _outlinedBtn(BuildContext context, String text, Color color, VoidCallback onPressed) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(side: BorderSide(color: color.withValues(alpha: 0.2)), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), minimumSize: const Size(0, 48)),
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
    );
  }

  Widget _fullWidthBtn(BuildContext context, String text, Color color, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(backgroundColor: color, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), elevation: 0),
        child: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _fullWidthBtnWithIcon(BuildContext context, String text, Color color, IconData icon, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(backgroundColor: color, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), elevation: 0),
      ),
    );
  }
}
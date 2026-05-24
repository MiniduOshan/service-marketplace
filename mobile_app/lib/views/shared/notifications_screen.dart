import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

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
          "Notifications",
          style: TextStyle(
            color: primaryGreen,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {},
            child: const Text(
              "Mark all as read",
              style: TextStyle(
                color: primaryGreen,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        children: [
          _buildSectionHeader("TODAY"),
          _buildNotificationCard(
            Icons.calendar_today_outlined,
            "Booking Confirmed",
            "Your professional skill service with Alex has been confirmed for tomorrow at 10 AM.",
            "2h ago",
            iconColor: Colors.teal,
            hasBorder: true,
          ),
          const SizedBox(height: 12),
          BookingReviewCard(workerName: "Alex", bookingId: "#BK-1041", time: "1h ago"),
          const SizedBox(height: 12),
          _buildNotificationCard(
            Icons.chat_bubble_outline,
            "New Message",
            "Sarah sent you a message regarding the logo design project details.",
            "5h ago",
            iconColor: Colors.teal,
            hasBorder: true,
          ),
          const SizedBox(height: 20),
          _buildSectionHeader("YESTERDAY"),
          _buildNotificationCard(
            Icons.account_balance_wallet_outlined,
            "Payment Received",
            "Invoice #8842 has been successfully paid by the client. Funds are now available.",
            "1d ago",
            iconColor: Colors.teal,
          ),
          _buildNotificationCard(
            Icons.star_outline,
            "New Review",
            "Excellent! You received a 5-star rating for your last consultation service.",
            "1d ago",
            iconColor: Colors.teal,
          ),
          const SizedBox(height: 20),
          _buildSectionHeader("EARLIER THIS WEEK"),
          _buildNotificationCard(
            Icons.settings_outlined,
            "Account Update",
            "Your profile information was updated successfully from a new device.",
            "3d ago",
            iconColor: Colors.grey,
          ),
          _buildNotificationCard(
            Icons.notifications_outlined,
            "System Maintenance",
            "The marketplace will be undergoing scheduled maintenance this Sunday.",
            "4d ago",
            iconColor: Colors.grey,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 15),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: textLight,
          letterSpacing: 1,
        ),
      ),
    );
  }

  Widget _buildNotificationCard(
    IconData icon,
    String title,
    String description,
    String time, {
    required Color iconColor,
    bool hasBorder = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: hasBorder ? Border(left: BorderSide(color: Colors.teal.shade400, width: 4)) : Border.all(color: Colors.grey.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: textDark,
                      ),
                    ),
                    Text(
                      time,
                      style: const TextStyle(color: textLight, fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: const TextStyle(
                    color: textLight,
                    fontSize: 14,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BookingReviewCard extends StatefulWidget {
  final String workerName;
  final String bookingId;
  final String time;
  const BookingReviewCard({super.key, required this.workerName, required this.bookingId, required this.time});

  @override
  State<BookingReviewCard> createState() => _BookingReviewCardState();
}

class _BookingReviewCardState extends State<BookingReviewCard> {
  static const Color primaryGreen = Color(0xFF006D44);
  int rating = 0;
  bool submitted = false;
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(children: [
                Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: Colors.teal.withValues(alpha: 0.1), shape: BoxShape.circle), child: const Icon(Icons.check_circle_outline, color: Colors.teal)),
                const SizedBox(width: 8),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text("Booking Complete", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 2),
                  Text("${""}${""}", style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                ])
              ]),
              Text(widget.time, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
            ],
          ),
          const SizedBox(height: 12),
          Text("How was your experience with ${widget.workerName}?", style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Row(children: List.generate(5, (i) {
            final index = i + 1;
            return IconButton(
              onPressed: submitted ? null : () => setState(() => rating = index),
              icon: Icon(index <= rating ? Icons.star : Icons.star_border, color: index <= rating ? primaryGreen : Colors.grey),
            );
          })),
          const SizedBox(height: 8),
          TextField(
            controller: _controller,
            enabled: !submitted,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: "Write a review (optional)",
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: Colors.grey.shade200)),
            ),
          ),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(
              child: ElevatedButton(
                onPressed: submitted ? null : _submitReview,
                style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
                child: Text(submitted ? "Submitted" : "Submit review", style: const TextStyle(color: Colors.white)),
              ),
            ),
          ])
        ],
      ),
    );
  }

  void _submitReview() {
    setState(() => submitted = true);
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Thank you — your review has been submitted"), backgroundColor: Colors.green));
    // TODO: send rating and review to backend
  }
}

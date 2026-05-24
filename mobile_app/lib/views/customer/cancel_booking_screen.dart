import 'package:flutter/material.dart';

class CancelBookingScreen extends StatefulWidget {
  const CancelBookingScreen({super.key});

  @override
  State<CancelBookingScreen> createState() => _CancelBookingScreenState();
}

class _CancelBookingScreenState extends State<CancelBookingScreen> {
  String? selectedReason = "Wrong booking details"; // Default selection from Figma
  final TextEditingController _notesController = TextEditingController();

  static const Color primaryGreen = Color(0xFF006D44);
  static const Color alertRed = Color(0xFFE54343);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Cancel Booking",
          style: TextStyle(color: alertRed, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBookingSummary(),
            const SizedBox(height: 24),
            _buildCancellationPolicy(),
            const SizedBox(height: 24),
            _buildRefundEligibilityCard(),
            const SizedBox(height: 32),
            const Text(
              "Reason for cancellation",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildReasonList(),
            const SizedBox(height: 24),
            _buildAdditionalNotes(),
            const SizedBox(height: 32),
            _buildActionButtons(),
            const SizedBox(height: 16),
            const Center(
              child: Text(
                "This action cannot be undone.",
                style: TextStyle(color: alertRed, fontSize: 14),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingSummary() {
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
              const Text("BOOKING #BK-1041", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
              _statusBadge("Confirmed", Colors.green),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            "Kasun Silva — Room painting",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          const Text("28 April 2025, 9:00 AM · LKR 5,000", style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildCancellationPolicy() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF9EE),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFED7AA)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Color(0xFFC2410C), size: 20),
              SizedBox(width: 8),
              Text("CANCELLATION POLICY", style: TextStyle(color: Color(0xFFC2410C), fontWeight: FontWeight.bold, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 16),
          _policyRow("Before worker accepts", "Full refund — Free", isFree: true),
          _policyRow("After acceptance, 24hrs+ before job", "75% refund — LKR 3,750"),
          _policyRow("Less than 2 hours before job", "50% refund — LKR 2,500"),
          _policyRow("No-show / job started", "No refund", isNoRefund: true),
        ],
      ),
    );
  }

  Widget _policyRow(String timing, String refund, {bool isFree = false, bool isNoRefund = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(timing, style: const TextStyle(fontSize: 13, color: Color(0xFF444444)))),
          Text(
            refund,
            textAlign: TextAlign.end,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: isFree ? Colors.green : (isNoRefund ? alertRed : Colors.black),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRefundEligibilityCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F6F1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "You are eligible for a full refund",
                  style: TextStyle(color: primaryGreen, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text("Worker has not accepted yet", style: TextStyle(color: primaryGreen, fontSize: 14)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text("Refund amount", style: TextStyle(color: Colors.grey, fontSize: 12)),
              const Text("LKR 2,500", style: TextStyle(color: primaryGreen, fontSize: 20, fontWeight: FontWeight.bold)),
              Text("(advance paid)", style: TextStyle(color: Colors.grey.shade600, fontSize: 10)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReasonList() {
    final reasons = ["Found another worker", "Changed my mind", "Wrong booking details", "Emergency", "Other"];
    return Column(
      children: reasons.map((reason) => _reasonTile(reason)).toList(),
    );
  }

  Widget _reasonTile(String reason) {
    bool isSelected = selectedReason == reason;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        border: Border.all(color: isSelected ? primaryGreen : Colors.grey.shade200),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        title: Text(reason, style: TextStyle(color: isSelected ? Colors.black : Colors.grey.shade700, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
        trailing: Icon(isSelected ? Icons.check_circle : Icons.radio_button_unchecked, color: isSelected ? primaryGreen : Colors.grey),
        onTap: () => setState(() => selectedReason = reason),
      ),
    );
  }

  Widget _buildAdditionalNotes() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Additional notes", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text("(optional)", style: TextStyle(color: Colors.grey.shade400, fontSize: 14)),
          ],
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _notesController,
          maxLines: 4,
          decoration: InputDecoration(
            hintText: "Please provide more details if necessary...",
            hintStyle: TextStyle(color: Colors.grey.shade400),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade200)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade200)),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 55,
          child: OutlinedButton(
            onPressed: () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: Colors.grey.shade200),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Keep my booking", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          height: 55,
          child: ElevatedButton(
            onPressed: () {
              // Implementation for confirm cancellation
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: alertRed,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Confirm cancellation", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ),
      ],
    );
  }

  Widget _statusBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(text, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }
}
import 'package:flutter/material.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(context),
      body: Column(
        children: [
          _buildWarningBanner(),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _buildSystemDate("Booking #BK-1041 created · 28 Apr 2025"),
                _buildBubble("Hello! I saw your room painting request. Could you share more details about the room size?", false, "10:22 AM"),
                _buildBubble("Hi Kasun! It's a 12×14 ft bedroom. Currently light yellow walls.", true, "10:24 AM"),
                _buildBubble("Perfect. I can do it for LKR 5,000 including primer and 2 coats. Are you OK with 28th April?", false, "10:25 AM"),
                _buildBubble("Yes that works! Please confirm the booking.", true, "10:26 AM"),
                _buildSystemConfirmation("Booking confirmed ✓ · Worker contact shared"),
                _buildBubble("Great! I'll be there at 9 AM. My number is 077-XXXXXXX", false, "10:27 AM"),
              ],
            ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0.5,
      leading: IconButton(icon: const Icon(Icons.arrow_back, color: primaryGreen), onPressed: () => Navigator.pop(context)),
      title: Row(
        children: [
          const CircleAvatar(radius: 18, backgroundColor: Color(0xFFE8F6F1), child: Text("KS", style: TextStyle(fontSize: 14, color: primaryGreen))),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Kasun Silva", style: TextStyle(color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold)),
              Row(children: [
                Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle)),
                const SizedBox(width: 4),
                const Text("Painter • Online now", style: TextStyle(color: Colors.grey, fontSize: 12)),
              ]),
            ],
          ),
        ],
      ),
      actions: [
        IconButton(icon: const Icon(Icons.phone_in_talk_outlined, color: Colors.grey), onPressed: () {}),
        IconButton(icon: const Icon(Icons.info_outline, color: Colors.grey), onPressed: () {}),
      ],
    );
  }

  Widget _buildWarningBanner() {
    return Container(
      color: const Color(0xFFFFFBEB),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        children: [
          const Icon(Icons.phone_locked, color: Colors.black, size: 20),
          const SizedBox(width: 12),
          const Expanded(
            child: Text.rich(TextSpan(
              text: "Worker's phone number will be shared after booking is confirmed. ",
              style: TextStyle(fontSize: 13),
              children: [TextSpan(text: "Book now", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, decoration: TextDecoration.underline))]
            )),
          ),
        ],
      ),
    );
  }

  Widget _buildBubble(String text, bool isMe, String time) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            constraints: const BoxConstraints(maxWidth: 280),
            decoration: BoxDecoration(
              color: isMe ? primaryGreen : const Color(0xFFF8FAFC),
              border: isMe ? null : Border.all(color: const Color(0xFFE2E8F0)),
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(16),
                topRight: const Radius.circular(16),
                bottomLeft: Radius.circular(isMe ? 16 : 0),
                bottomRight: Radius.circular(isMe ? 0 : 16),
              ),
            ),
            child: Text(text, style: TextStyle(color: isMe ? Colors.white : Colors.black, fontSize: 15, height: 1.4)),
          ),
          const SizedBox(height: 4),
          Text(time, style: const TextStyle(color: Colors.grey, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildSystemDate(String text) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 20),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
        child: Text(text, style: const TextStyle(color: Colors.grey, fontSize: 12)),
      ),
    );
  }

  Widget _buildSystemConfirmation(String text) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 20),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFFE8F6F1), 
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF006D44).withValues(alpha: 0.1))),
        child: Text(text, style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 13)),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0xFFF1F5F9)))),
      child: Row(
        children: [
          const Icon(Icons.image_outlined, color: Colors.grey),
          const SizedBox(width: 15),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(25)),
              child: const TextField(
                decoration: InputDecoration(hintText: "Type a message...", border: InputBorder.none),
              ),
            ),
          ),
          const SizedBox(width: 15),
          const CircleAvatar(backgroundColor: primaryGreen, child: Icon(Icons.send, color: Colors.white, size: 20)),
        ],
      ),
    );
  }
}
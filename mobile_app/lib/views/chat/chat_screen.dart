import 'package:flutter/material.dart';

class ChatScreen extends StatefulWidget {
  final String workerName;
  final String workerTag;

  const ChatScreen({
    super.key,
    this.workerName = 'Kasun Silva',
    this.workerTag = 'PAINTER',
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<Map<String, dynamic>> _messages = [];

  String get initials {
    final parts = widget.workerName.trim().split(RegExp(r'\s+'));
    if (parts.length > 1) {
      return "${parts[0][0]}${parts[1][0]}".toUpperCase();
    }
    if (parts.isNotEmpty && parts[0].isNotEmpty) {
      return parts[0].substring(0, parts[0].length >= 2 ? 2 : parts[0].length).toUpperCase();
    }
    return 'PR';
  }

  String get formattedTag {
    if (widget.workerTag.isEmpty) return 'Pro';
    return widget.workerTag[0].toUpperCase() + widget.workerTag.substring(1).toLowerCase();
  }

  @override
  void initState() {
    super.initState();
    // Start with a clean welcome context message
    _messages.addAll([
      {
        "text": "Hello! I saw your booking request. Could you please share more details about the work required?",
        "isMe": false,
        "time": "10:22 AM"
      }
    ]);
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    final now = DateTime.now();
    final timeStr = "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}";

    setState(() {
      _messages.add({
        "text": text,
        "isMe": true,
        "time": timeStr,
      });
      _messageController.clear();
    });

    // Auto scroll to bottom
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(context),
      body: Column(
        children: [
          _buildWarningBanner(),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildBubble(msg['text'], msg['isMe'], msg['time']);
              },
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
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: primaryGreen), 
        onPressed: () => Navigator.pop(context),
      ),
      title: Row(
        children: [
          CircleAvatar(
            radius: 18, 
            backgroundColor: const Color(0xFFE8F6F1), 
            child: Text(initials, style: const TextStyle(fontSize: 14, color: primaryGreen, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.workerName, 
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Row(children: [
                  Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle)),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      "${widget.workerTag} • Online", 
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                  ),
                ]),
              ],
            ),
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
      child: const Row(
        children: [
          Icon(Icons.phone_locked, color: Colors.black, size: 20),
          SizedBox(width: 12),
          Expanded(
            child: Text.rich(TextSpan(
              text: "Worker's phone number will be shared after booking is confirmed. ",
              style: TextStyle(fontSize: 13),
              children: [
                TextSpan(
                  text: "Book now", 
                  style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                ),
              ],
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
              child: TextField(
                controller: _messageController,
                onSubmitted: (_) => _sendMessage(),
                decoration: const InputDecoration(hintText: "Type a message...", border: InputBorder.none),
              ),
            ),
          ),
          const SizedBox(width: 15),
          GestureDetector(
            onTap: _sendMessage,
            child: const CircleAvatar(
              backgroundColor: primaryGreen, 
              child: Icon(Icons.send, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }
}
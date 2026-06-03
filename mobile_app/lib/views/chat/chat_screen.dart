import 'package:flutter/material.dart';

import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';

class ChatScreen extends StatefulWidget {
  final String bookingId;
  final String workerName;
  final String workerTag;

  const ChatScreen({
    super.key,
    this.bookingId = '',
    this.workerName = 'Conversation',
    this.workerTag = 'Booking',
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  bool _isLoading = true;
  String? _errorMessage;
  final List<Map<String, dynamic>> _messages = [];

  String get initials {
    final parts = widget.workerName.trim().split(RegExp(r'\s+'));
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    if (parts.isNotEmpty && parts[0].isNotEmpty) {
      return parts[0].substring(0, parts[0].length >= 2 ? 2 : parts[0].length).toUpperCase();
    }
    return 'PR';
  }

  @override
  void initState() {
    super.initState();
    _loadMessages();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages() async {
    if (widget.bookingId.isEmpty) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _errorMessage = 'Select a booking to start chatting.';
      });
      return;
    }

    try {
      final messages = await ApiClient.instance.getBookingMessages(
        bookingId: widget.bookingId,
        token: authController.sessionToken,
      );

      if (!mounted) return;

      setState(() {
        _messages
          ..clear()
          ..addAll(messages.map(_mapMessage));
        _isLoading = false;
        _errorMessage = null;
      });

      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  Map<String, dynamic> _mapMessage(Map<String, dynamic> message) {
    final currentUserId = authController.currentUser?.id;
    final sender = message['sender'] as Map<String, dynamic>?;
    final senderId = sender?['id']?.toString() ?? message['sender_id']?.toString();
    final createdAt = message['created_at']?.toString() ?? '';
    final time = createdAt.contains('T') ? createdAt.split('T').last.substring(0, 5) : 'Now';

    return {
      'text': message['body']?.toString() ?? '',
      'isMe': senderId != null && senderId == currentUserId,
      'time': time,
    };
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty || widget.bookingId.isEmpty) return;

    try {
      final response = await ApiClient.instance.sendBookingMessage(
        bookingId: widget.bookingId,
        body: text,
        token: authController.sessionToken,
      );

      if (!mounted) return;

      setState(() {
        _messages.add(_mapMessage(response['data'] as Map<String, dynamic>));
        _messageController.clear();
      });

      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
      );
    }
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
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
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: primaryGreen))
                : _errorMessage != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Text(_errorMessage!, textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey)),
                        ),
                      )
                    : ListView.builder(
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
                      '${widget.workerTag} • Online',
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
      actions: [],
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
              text: 'Contact details will be shared after booking is confirmed. ',
              style: TextStyle(fontSize: 13),
              children: [
                TextSpan(
                  text: 'Book now',
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
                decoration: const InputDecoration(hintText: 'Type a message...', border: InputBorder.none),
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
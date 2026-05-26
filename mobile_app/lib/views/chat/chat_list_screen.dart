import 'package:flutter/material.dart';

import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';
import 'chat_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  bool _isLoading = true;
  String? _errorMessage;
  
  bool _isSearching = false;
  final TextEditingController _searchController = TextEditingController();
  
  final List<Map<String, dynamic>> _allBookings = [];

  late List<Map<String, dynamic>> _filteredBookings;

  @override
  void initState() {
    super.initState();
    _filteredBookings = List.from(_allBookings);
    _loadBookings();
  }

  Future<void> _loadBookings() async {
    try {
      final bookings = await ApiClient.instance.getBookings(token: authController.sessionToken);
      if (!mounted) return;

      setState(() {
        _allBookings
          ..clear()
          ..addAll(bookings);
        _filteredBookings = List.from(_allBookings);
        _isLoading = false;
        _errorMessage = null;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  void _filterChats(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredBookings = List.from(_allBookings);
      } else {
        _filteredBookings = _allBookings
            .where((booking) =>
                _bookingTitle(booking).toLowerCase().contains(query.toLowerCase()) ||
                _bookingSubtitle(booking).toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: _isSearching 
          ? TextField(
              controller: _searchController,
              autofocus: true,
              onChanged: _filterChats,
              decoration: const InputDecoration(
                hintText: "Search chats...",
                border: InputBorder.none,
                hintStyle: TextStyle(color: Colors.grey),
              ),
              style: const TextStyle(color: primaryGreen),
            )
          : const Text("Chats", 
              style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(_isSearching ? Icons.close : Icons.search, color: primaryGreen), 
            onPressed: () {
              setState(() {
                if (_isSearching) {
                  _isSearching = false;
                  _searchController.clear();
                  _filterChats("");
                } else {
                  _isSearching = true;
                }
              });
            }
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
            child: Text(
              _isSearching ? "Search Results (${_filteredBookings.length})" : "All Messages",
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey),
            ),
          ),
          Expanded(child: _buildChatList(context)),
        ],
      ),
    );
  }

  Widget _buildChatList(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: primaryGreen));
    }

    if (_errorMessage != null && _allBookings.isEmpty) {
      return Center(
        child: Text(_errorMessage!, style: const TextStyle(color: Colors.grey)),
      );
    }

    if (_filteredBookings.isEmpty) {
      return const Center(
        child: Text("No bookings found yet.", style: TextStyle(color: Colors.grey)),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.only(top: 10),
      itemCount: _filteredBookings.length,
      separatorBuilder: (context, index) => const Divider(height: 1, indent: 90),
      itemBuilder: (context, index) {
        final booking = _filteredBookings[index];
        return _chatTile(
          context,
          _bookingTitle(booking),
          _bookingTag(),
          _bookingSubtitle(booking),
          _bookingTime(booking),
          bookingId: booking['id']?.toString() ?? '',
        );
      },
    );
  }

  String _bookingTitle(Map<String, dynamic> booking) {
    final currentUser = authController.currentUser;
    final worker = booking['worker'] as Map<String, dynamic>?;
    final customer = booking['customer'] as Map<String, dynamic>?;
    return currentUser?.role == 'worker'
        ? (customer?['name']?.toString() ?? 'Customer')
        : (worker?['name']?.toString() ?? 'Worker');
  }

  String _bookingTag() {
    return authController.currentUser?.role == 'worker' ? 'Customer' : 'Worker';
  }

  String _bookingSubtitle(Map<String, dynamic> booking) {
    final servicePackage = booking['service_package'] as Map<String, dynamic>?;
    final status = booking['status']?.toString() ?? 'pending';
    final title = servicePackage?['title']?.toString() ?? 'Booking';
    final statusLabel = status.isEmpty ? 'Pending' : '${status[0].toUpperCase()}${status.substring(1)}';
    return '$title • $statusLabel';
  }

  String _bookingTime(Map<String, dynamic> booking) {
    final createdAt = booking['created_at']?.toString() ?? '';
    if (createdAt.contains('T')) {
      return createdAt.split('T').first;
    }
    return 'Now';
  }

  Widget _chatTile(BuildContext context, String name, String tag, String msg, String time, {required String bookingId}) {
    return ListTile(
      onTap: () => Navigator.pushNamed(context, '/chat', arguments: {
        'bookingId': bookingId,
        'counterpartName': name,
        'counterpartTag': tag,
      }),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      tileColor: Colors.white,
      leading: const CircleAvatar(radius: 28, backgroundColor: Color(0xFFE2E8F0)),
      title: Row(
        children: [
          Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(width: 10),
          _tag(tag),
        ],
      ),
      subtitle: Text(msg, maxLines: 1, overflow: TextOverflow.ellipsis),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(time, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _tag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(4)),
      child: Text(text, style: const TextStyle(color: Color(0xFF3B82F6), fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }
}

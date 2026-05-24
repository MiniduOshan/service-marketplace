import 'package:flutter/material.dart';
import 'chat_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  
  bool _isSearching = false;
  final TextEditingController _searchController = TextEditingController();
  
  final List<Map<String, dynamic>> _allChats = [
    {"name": "Kasun Silva", "tag": "PAINTER", "msg": "Great! I'll be there at 9 AM...", "time": "10:27 AM", "unread": 2},
    {"name": "Amara Perera", "tag": "CLEANER", "msg": "Can we reschedule for tomorrow?", "time": "Yesterday", "unread": 0},
    {"name": "Nuwan Bandara", "tag": "ELECTRICIAN", "msg": "I've fixed the wiring issues.", "time": "2 days ago", "unread": 0},
    {"name": "Dilini Mendis", "tag": "PLUMBER", "msg": "The tap is working now.", "time": "Mon", "unread": 0},
    {"name": "Saman Kumara", "tag": "CARPENTER", "msg": "Will send the quote by evening.", "time": "Sun", "unread": 1},
  ];

  late List<Map<String, dynamic>> _filteredChats;

  @override
  void initState() {
    super.initState();
    _filteredChats = List.from(_allChats);
  }

  void _filterChats(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredChats = List.from(_allChats);
      } else {
        _filteredChats = _allChats
            .where((chat) => 
                chat['name'].toLowerCase().contains(query.toLowerCase()) ||
                chat['tag'].toLowerCase().contains(query.toLowerCase()))
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
          if (!_isSearching) _buildRecentWorkers(),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
            child: Text(
              _isSearching ? "Search Results (${_filteredChats.length})" : "All Messages",
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey),
            ),
          ),
          Expanded(child: _buildChatList(context)),
        ],
      ),
    );
  }

  Widget _buildRecentWorkers() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Text("Recent Workers", 
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
          ),
          const SizedBox(height: 15),
          SizedBox(
            height: 90,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 15),
              itemCount: 5,
              itemBuilder: (context, index) {
                final names = ["Kasun", "Amara", "Nuwan", "Dilini", "Saman"];
                return _recentWorkerAvatar(names[index % names.length]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _recentWorkerAvatar(String name) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        children: [
          Stack(
            children: [
              const CircleAvatar(radius: 30, backgroundColor: Color(0xFFE2E8F0)),
              Positioned(
                right: 2, bottom: 2,
                child: Container(
                  width: 12, height: 12,
                  decoration: BoxDecoration(
                    color: Colors.green, 
                    shape: BoxShape.circle, 
                    border: Border.all(color: Colors.white, width: 2)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 5),
          Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildChatList(BuildContext context) {
    if (_filteredChats.isEmpty) {
      return const Center(
        child: Text("No conversations found", style: TextStyle(color: Colors.grey)),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.only(top: 10),
      itemCount: _filteredChats.length,
      separatorBuilder: (context, index) => const Divider(height: 1, indent: 90),
      itemBuilder: (context, index) {
        final chat = _filteredChats[index];
        return _chatTile(
          context,
          chat['name'],
          chat['tag'],
          chat['msg'],
          chat['time'],
          unreadCount: chat['unread'],
        );
      },
    );
  }

  Widget _chatTile(BuildContext context, String name, String tag, String msg, String time, {int unreadCount = 0}) {
    return ListTile(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen())),
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
          const SizedBox(height: 5),
          if (unreadCount > 0)
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(color: primaryGreen, shape: BoxShape.circle),
              child: Text("$unreadCount", style: const TextStyle(color: Colors.white, fontSize: 10)),
            ),
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
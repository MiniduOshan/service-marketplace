import 'package:flutter/material.dart';

class WorkerReviewsScreen extends StatelessWidget {
  const WorkerReviewsScreen({super.key});

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
          "Reviews",
          style: TextStyle(
            color: primaryGreen,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildRatingSummary(),
            const SizedBox(height: 20),
            _buildFilters(),
            const SizedBox(height: 20),
            _buildReviewList(),
            const SizedBox(height: 40),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  Widget _buildRatingSummary() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      "4.9",
                      style: TextStyle(
                        fontSize: 64,
                        fontWeight: FontWeight.bold,
                        color: textDark,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.star, color: primaryGreen, size: 48),
                  ],
                ),
                const Text(
                  "127 Reviews",
                  style: TextStyle(
                    fontSize: 18,
                    color: textLight,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            flex: 3,
            child: Column(
              children: [
                _buildStarBar(5, 0.9),
                _buildStarBar(4, 0.15),
                _buildStarBar(3, 0.05),
                _buildStarBar(2, 0.02),
                _buildStarBar(1, 0.01),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStarBar(int star, double percentage) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(
            "$star",
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: textLight,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: percentage,
                backgroundColor: primaryGreen.withValues(alpha: 0.1),
                valueColor: const AlwaysStoppedAnimation<Color>(primaryGreen),
                minHeight: 6,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.only(left: 20),
      child: Row(
        children: [
          _buildFilterChip("All", true),
          _buildFilterChip("Recent", false),
          _buildFilterChip("Highest Rated", false),
          _buildFilterChip("Lowest Rated", false),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: isSelected ? primaryGreen : Colors.grey.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(25),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : textDark,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  Widget _buildReviewList() {
    return ListView(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 20),
      children: [
        _buildReviewCard(
          "Amara Jayasekara",
          "AJ",
          "2 days ago",
          5,
          "Kasun did an excellent job painting our master bedroom. Very punctual and clean work.",
          color: const Color(0xFF008966),
        ),
        _buildReviewCard(
          "Nimal K.",
          "NK",
          "1 week ago",
          5,
          "Highly recommended for any plumbing issues. Fixed the leak in minutes.",
          color: const Color(0xFFC7D2FE),
          initialsColor: const Color(0xFF4338CA),
        ),
        _buildReviewCard(
          "Sanduni P.",
          "SP",
          "2 weeks ago",
          4,
          "Great communication and fair price. Would book again.",
          avatarUrl: "https://i.pravatar.cc/150?u=sanduni",
        ),
      ],
    );
  }

  Widget _buildReviewCard(
    String name,
    String initials,
    String time,
    int rating,
    String comment, {
    Color? color,
    Color? initialsColor,
    String? avatarUrl,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              avatarUrl != null
                  ? CircleAvatar(
                      radius: 24,
                      backgroundImage: NetworkImage(avatarUrl),
                    )
                  : CircleAvatar(
                      radius: 24,
                      backgroundColor: color ?? primaryGreen,
                      child: Text(
                        initials,
                        style: TextStyle(
                          color: initialsColor ?? Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
              const SizedBox(width: 15),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: textDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: List.generate(5, (index) {
                        return Icon(
                          index < rating ? Icons.star : Icons.star_border,
                          color: Colors.teal,
                          size: 16,
                        );
                      }),
                    ),
                  ],
                ),
              ),
              Text(
                time,
                style: const TextStyle(color: textLight, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 15),
          Text(
            comment,
            style: const TextStyle(
              color: textDark,
              fontSize: 15,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 15),
          TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              minimumSize: const Size(0, 0),
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text(
              "Reply",
              style: TextStyle(
                color: primaryGreen,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: primaryGreen,
      unselectedItemColor: Colors.grey,
      currentIndex: 3,
      selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.grid_view), label: "Dashboard"),
        BottomNavigationBarItem(icon: Icon(Icons.work_outline), label: "Jobs"),
        BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), label: "Earnings"),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
      ],
    );
  }
}

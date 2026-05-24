import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';


// lib/screens/worker_dashboard.dart

class WorkerDashboard extends StatefulWidget {
  const WorkerDashboard({super.key});

  @override
  State<WorkerDashboard> createState() => _WorkerDashboardState();
}

class _WorkerDashboardState extends State<WorkerDashboard> {
  // Define main green color based on image_12.png
  static const Color darkDashboardGreen = Color(0xFF006D44);

  
  // Simulation of "Available for bookings" toggle state
  bool _isAvailable = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8F9), // Light background color from image_12.png
      appBar: _buildHeader(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusBadges(),
            const SizedBox(height: 20),
            _buildAvailabilityToggle(),
            const SizedBox(height: 20),
            _buildEarningsCard(),
            const SizedBox(height: 20),
            _buildQuickStats(),
            const SizedBox(height: 28),
            _buildSectionHeader("New Job Requests", badgeCount: 3),
            const SizedBox(height: 16),
            _buildRequestCard(
              title: "Kitchen Sink Repair", 
              location: "Colombo 07 • Today",
              price: "3,500",
              isNew: true,
            ),
            const SizedBox(height: 16),
            _buildRequestCard(
              title: "Garden Lighting Setup", 
              location: "Battaramulla • May 12",
              price: "8,000",
              status: "PENDING",
            ),
            const SizedBox(height: 28),
            _buildSectionHeader("Upcoming Jobs"),
            const SizedBox(height: 16),
            _buildJobTile(title: "Electrical Rewiring", time: "Kottawa • 2:30 PM Today"),
            const SizedBox(height: 16),
            _buildJobTile(title: "A/C Maintenance", time: "Nugegoda • 9:00 AM Tomorrow"),
            const SizedBox(height: 28),
            _buildProPlanCard(),
            const SizedBox(height: 32),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  // --- UI COMPONENT METHODS (Matches image_12.png structure) ---

  // 1. Header (Apache Bar area in Figma)
  PreferredSizeWidget _buildHeader() {
    final currentUser = authController.currentUser;
    final displayName = currentUser?.name?.trim();

    return AppBar(
      backgroundColor: const Color(0xFFF6F8F9),
      elevation: 0,
      automaticallyImplyLeading: false, // Prevents automatic back button
      title: Row(
        children: [
          // Simulated Avatar (needs start.png asset, using color placeholder here)
          const CircleAvatar(
            radius: 20,
            backgroundColor: Colors.grey, // Placeholder
            // backgroundImage: AssetImage('assets/images/nimal_avatar.png'), // Use asset later
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                displayName != null && displayName.isNotEmpty
                    ? 'Good morning, $displayName'
                    : 'Good morning, Worker',
                style: const TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Text(
                "👷", // Emoji from Figma
                style: const TextStyle(fontSize: 14),
              ),
            ],
          ),
        ],
      ),
      actions: [
        // Standard notification icon with simulated red dot indicator
        Stack(
          alignment: Alignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_none_outlined, color: Colors.grey, size: 28),
              onPressed: () => Navigator.pushNamed(context, '/notifications'),
            ),
            Positioned(
              right: 12,
              top: 14,
              child: Container(
                width: 8, height: 8,
                decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
              ),
            ),
          ],
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  // 2. Status Badges and Score area from Figma
  Widget _buildStatusBadges() {
    return Row(
      children: [
        // Active Badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(color: const Color(0xFFE8F6F1), borderRadius: BorderRadius.circular(16)),
          child: Row(children: [
              Container(width: 6, height: 6, decoration: const BoxDecoration(color: Color(0xFF00A381), shape: BoxShape.circle)),
              const SizedBox(width: 6),
              const Text("Active", style: TextStyle(color: Color(0xFF00A381), fontWeight: FontWeight.bold, fontSize: 12)),
          ]),
        ),
        const SizedBox(width: 8),
        // Featured Badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(color: const Color(0xFFFFF7E8), borderRadius: BorderRadius.circular(16)),
          child: const Row(children: [
              Icon(Icons.star, color: Color(0xFFF79009), size: 14),
              SizedBox(width: 6),
              Text("Featured", style: TextStyle(color: Color(0xFFF79009), fontWeight: FontWeight.bold, fontSize: 12)),
          ]),
        ),
        const Spacer(),
        // Priority Score Simulation
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            const Text("Priority Score: 87/100", style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 4),
            Container(width: 100, height: 6,
              decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(3)),
              child: Stack(children: [
                  Container(width: 87, decoration: BoxDecoration(color: const Color(0xFF00A381), borderRadius: BorderRadius.circular(3))),
              ])),
        ]),
      ],
    );
  }

  // 3. Availability Toggle Card from Figma
  Widget _buildAvailabilityToggle() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE9F1EE))),
      child: Row(children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text("Available for bookings", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text("Turn off when you're busy", style: TextStyle(color: Colors.grey, fontSize: 14)),
          ]),
          const Spacer(),
          Switch(
            value: _isAvailable,
            onChanged: (value) { setState(() => _isAvailable = value); },
            activeThumbColor: Colors.white,
            activeTrackColor: const Color(0xFF00A381),
            inactiveThumbColor: Colors.white,
            inactiveTrackColor: Colors.grey[300],
          ),
      ]),
    );
  }

  // 4. Main Earnings Card (Dark green section in Figma)
  Widget _buildEarningsCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: darkDashboardGreen, borderRadius: BorderRadius.circular(20)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text("THIS MONTH", style: TextStyle(color: Colors.white70, fontSize: 12, letterSpacing: 1, fontWeight: FontWeight.bold)),
              TextButton(onPressed: () => Navigator.pushNamed(context, '/worker-wallet'), child: const Text("View earnings →", style: TextStyle(color: Colors.white, fontSize: 14, decoration: TextDecoration.underline))),
          ]),
          const SizedBox(height: 8),
          const Text("LKR 42,000", style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          const Divider(color: Colors.white24),
          const SizedBox(height: 16),
          Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
              _buildEarningStat("12", "Jobs"),
              Container(height: 40, width: 1, color: Colors.white24), // Vertical divider from Figma
              _buildEarningStat("4.9 ★", "Rating"),
              Container(height: 40, width: 1, color: Colors.white24),
              _buildEarningStat("94%", "Response"),
          ]),
        ],
      ),
    );
  }

  // Helper for Earnings Stat section
  Widget _buildEarningStat(String value, String label) {
    return Column(children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
    ]);
  }

  // 5. Grid of Quick Stats from Figma
  Widget _buildQuickStats() {
    return GridView.count(crossAxisCount: 2, shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(), // Important for SingleChildScrollView
      crossAxisSpacing: 16, mainAxisSpacing: 16, childAspectRatio: 2.1, // Adjusted to prevent overflow
      children: [
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/job-requests'),
          child: _buildStatCard("127", "TOTAL JOBS"),
        ),
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/worker-reviews'),
          child: _buildStatCard("4.9", "RATING"),
        ),
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/worker-subscription'),
          child: _buildStatCard("LKR 2,500", "SUBSCRIPTION"),
        ),
        _buildStatCard("87", "PRIORITY SCORE"),
    ]);
  }

  // Helper for Quick Stat card
  Widget _buildStatCard(String value, String label) {
    return Container(padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE9F1EE))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
      ]),
    );
  }

  // Helper for Section Titles and optional badge from Figma
  Widget _buildSectionHeader(String title, {int? badgeCount}) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/job-requests'),
      child: Row(children: [
        Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black)),
        if (badgeCount != null) ...[
          const SizedBox(width: 12),
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: const Color(0xFFFCE4E4), borderRadius: BorderRadius.circular(12)),
            child: Text("$badgeCount new", style: const TextStyle(color: Color(0xFFD32F2F), fontSize: 12, fontWeight: FontWeight.bold))),
        ],
      ]),
    );
  }

  // 6. Job Request Card from Figma
  Widget _buildRequestCard({required String title, required String location, required String price, bool isNew = false, String? status}) {
    return Container(padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE9F1EE))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Row(children: [
                      const Icon(Icons.location_on_outlined, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(location, style: const TextStyle(color: Colors.grey, fontSize: 14)),
                  ]),
              ])),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text("LKR $price", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF00A381))),
                  if (isNew) Container(margin: const EdgeInsets.only(top: 4), padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFE8F6F1), borderRadius: BorderRadius.circular(4)), child: const Text("NEW", style: TextStyle(color: Color(0xFF00A381), fontSize: 10, fontWeight: FontWeight.bold))),
                  if (status != null) Container(margin: const EdgeInsets.only(top: 4), padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFFFF7E8), borderRadius: BorderRadius.circular(4)), child: Text(status, style: const TextStyle(color: Color(0xFFF79009), fontSize: 10, fontWeight: FontWeight.bold))),
              ]),
          ]),
          const SizedBox(height: 16),
          // Accept/Decline Buttons from Figma
          Row(children: [
              Expanded(child: SizedBox(height: 44, child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Job request accepted! Check 'Upcoming Jobs'."), backgroundColor: darkDashboardGreen)
                  );
                }, 
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF006D44), elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), 
                child: const Text("Accept", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))))),
              const SizedBox(width: 12),
              Expanded(child: SizedBox(height: 44, child: OutlinedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Job request declined."), backgroundColor: Colors.red)
                  );
                }, 
                style: OutlinedButton.styleFrom(side: const BorderSide(color: Color(0xFFF6A3A3)), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), 
                child: const Text("Decline", style: TextStyle(color: Color(0xFFD32F2F), fontWeight: FontWeight.bold))))),
          ]),
        ],
      ),
    );
  }

  // 7. Generic Job Tile with 'Mark complete' button from Figma
  Widget _buildJobTile({required String title, required String time}) {
    return Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE9F1EE))),
      child: Column(children: [
          ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            leading: const Icon(Icons.access_time, color: Colors.grey, size: 24),
            title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            subtitle: Text(time, style: const TextStyle(color: Colors.grey, fontSize: 14)),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            onTap: () {},
          ),

          Padding(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: SizedBox(width: double.infinity, height: 44,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Job marked as complete!"), backgroundColor: darkDashboardGreen)
                  );
                }, 
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF006D44), elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                child: const Text("Mark complete", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)))),
          ),
      ]),
    );
  }

  // 8. Subscription Plan Card from Figma
  Widget _buildProPlanCard() {
    return Container(padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFFED7AA))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Row(children: [
                  const Icon(Icons.verified_outlined, color: Color(0xFFF79009), size: 24),
                  const SizedBox(width: 12),
                  const Text("Pro Plan • Active", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ]),
              TextButton(onPressed: () => Navigator.pushNamed(context, '/worker-subscription'), child: const Text("Manage plan", style: TextStyle(color: Color(0xFF1B434D), fontWeight: FontWeight.bold, decoration: TextDecoration.underline))),
          ]),
          const SizedBox(height: 12),
          const Text("Renews May 15 • LKR 2,500/month", style: TextStyle(color: Colors.grey, fontSize: 14)),
          const SizedBox(height: 16),
          // Figma insight banner simulation
          Container(padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(12)),
            child: const Row(children: [
                Icon(Icons.trending_up, color: Color(0xFF00A381), size: 20),
                SizedBox(width: 12),
                Expanded(child: Text("You appear in top 5 results for your category", style: TextStyle(color: Color(0xFF00A381), fontSize: 14, fontWeight: FontWeight.bold))),
            ]),
          ),
        ],
      ),
    );
  }

  // 9. Bottom Navigation Bar from image_12.png
  Widget _buildBottomNavigationBar() {
    return Container(decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0xFFE9F1EE), width: 1))),
      child: BottomNavigationBar(
        currentIndex: 0,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFF006D44),
        unselectedItemColor: Colors.grey,
        elevation: 0,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
        onTap: (index) {
          if (index == 1) Navigator.pushNamed(context, '/job-requests');
          if (index == 2) Navigator.pushNamed(context, '/worker-wallet');
          if (index == 3) Navigator.pushNamed(context, '/worker-profile');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_rounded), label: "Dashboard"),
          BottomNavigationBarItem(icon: Icon(Icons.work_outline_rounded), label: "Jobs"),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), label: "Earnings"),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profile"),
        ],
      ),
    );
  }
}
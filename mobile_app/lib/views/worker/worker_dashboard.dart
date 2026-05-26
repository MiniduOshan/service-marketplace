import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';

class WorkerDashboard extends StatefulWidget {
  const WorkerDashboard({super.key});

  @override
  State<WorkerDashboard> createState() => _WorkerDashboardState();
}

class _WorkerDashboardState extends State<WorkerDashboard> {
  static const Color darkDashboardGreen = Color(0xFF006D44);
  bool _isLoading = true;
  String? _error;
  bool _isAvailable = true;

  Map<String, dynamic> _stats = {
    'total_earnings': 0.0,
    'jobs_done': 0,
    'total_bookings': 0,
    'profile_views': 0,
  };
  List<Map<String, dynamic>> _bookings = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final token = authController.sessionToken;
      final statsRes = await ApiClient.instance.getWorkerStats(token: token);
      final bookingsRes = await ApiClient.instance.getBookings(token: token);
      if (mounted) {
        setState(() {
          _stats = statsRes;
          _bookings = bookingsRes;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceFirst('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  List<Map<String, dynamic>> get _pendingBookings {
    return _bookings.where((b) => b['status']?.toString().toLowerCase() == 'pending').toList();
  }

  List<Map<String, dynamic>> get _upcomingBookings {
    return _bookings.where((b) => 
      ['confirmed', 'assigned', 'in_progress', 'in-progress', 'active'].contains(b['status']?.toString().toLowerCase())
    ).toList();
  }

  Future<void> _acceptJob(String bookingId) async {
    try {
      final token = authController.sessionToken;
      await ApiClient.instance.acceptBooking(bookingId: bookingId, token: token);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Job request accepted! Check 'Upcoming Jobs'."), backgroundColor: darkDashboardGreen)
        );
        _fetchData();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceFirst('Exception: ', '')))
        );
      }
    }
  }

  Future<void> _declineJob(String bookingId) async {
    try {
      final token = authController.sessionToken;
      await ApiClient.instance.cancelBooking(bookingId: bookingId, token: token);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Job request declined."), backgroundColor: Colors.red)
        );
        _fetchData();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceFirst('Exception: ', '')))
        );
      }
    }
  }

  Future<void> _completeJob(String bookingId) async {
    try {
      final token = authController.sessionToken;
      await ApiClient.instance.completeBooking(bookingId: bookingId, token: token);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Job marked as complete!"), backgroundColor: darkDashboardGreen)
        );
        _fetchData();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceFirst('Exception: ', '')))
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final pending = _pendingBookings;
    final upcoming = _upcomingBookings;

    final renewalDate = DateTime.now().add(const Duration(days: 30));
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final renewalStr = "Renews ${months[renewalDate.month - 1]} ${renewalDate.day}";

    return Scaffold(
      backgroundColor: const Color(0xFFF6F8F9),
      appBar: _buildHeader(),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: darkDashboardGreen))
        : RefreshIndicator(
            color: darkDashboardGreen,
            onRefresh: _fetchData,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_error != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(color: Colors.red[50], borderRadius: BorderRadius.circular(12)),
                      child: Row(
                        children: [
                          Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red))),
                          IconButton(icon: const Icon(Icons.refresh, color: Colors.red), onPressed: _fetchData),
                        ],
                      ),
                    ),
                  ],
                  _buildStatusBadges(),
                  const SizedBox(height: 20),
                  _buildAvailabilityToggle(),
                  const SizedBox(height: 20),
                  _buildEarningsCard(),
                  const SizedBox(height: 20),
                  _buildQuickStats(),
                  const SizedBox(height: 28),
                  _buildSectionHeader("New Job Requests", badgeCount: pending.isEmpty ? null : pending.length),
                  const SizedBox(height: 16),
                  if (pending.isEmpty) ...[
                    const Card(
                      color: Colors.white,
                      elevation: 0,
                      child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Center(
                          child: Text("No pending job requests.", style: TextStyle(color: Colors.grey, fontSize: 15)),
                        ),
                      ),
                    ),
                  ] else ...[
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: pending.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 16),
                      itemBuilder: (context, index) {
                        final b = pending[index];
                        final package = b['service_package'] ?? {};
                        final title = package['title']?.toString() ?? 'Service Request';
                        final price = double.tryParse(b['total_price']?.toString() ?? '')?.toStringAsFixed(0) ?? '0';
                        final address = b['address']?.toString() ?? 'No location';
                        final date = b['scheduled_at'] != null 
                          ? b['scheduled_at'].toString().split('T')[0]
                          : 'No Date';

                        return _buildRequestCard(
                          id: b['id']?.toString() ?? '',
                          title: title,
                          location: "$address • $date",
                          price: price,
                          isNew: index == 0,
                        );
                      },
                    ),
                  ],
                  const SizedBox(height: 28),
                  _buildSectionHeader("Upcoming Jobs"),
                  const SizedBox(height: 16),
                  if (upcoming.isEmpty) ...[
                    const Card(
                      color: Colors.white,
                      elevation: 0,
                      child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Center(
                          child: Text("No upcoming jobs scheduled.", style: TextStyle(color: Colors.grey, fontSize: 15)),
                        ),
                      ),
                    ),
                  ] else ...[
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: upcoming.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 16),
                      itemBuilder: (context, index) {
                        final b = upcoming[index];
                        final package = b['service_package'] ?? {};
                        final title = package['title']?.toString() ?? 'Upcoming Service';
                        final address = b['address']?.toString() ?? 'No location';
                        final date = b['scheduled_at'] != null 
                          ? b['scheduled_at'].toString().split('T')[0]
                          : 'No Date';

                        return _buildJobTile(
                          id: b['id']?.toString() ?? '',
                          title: title,
                          time: "$address • $date",
                        );
                      },
                    ),
                  ],
                  const SizedBox(height: 28),
                  _buildProPlanCard(renewalStr),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  PreferredSizeWidget _buildHeader() {
    final currentUser = authController.currentUser;
    final displayName = currentUser?.name?.trim();

    return AppBar(
      backgroundColor: const Color(0xFFF6F8F9),
      elevation: 0,
      automaticallyImplyLeading: false,
      title: Row(
        children: [
          const CircleAvatar(
            radius: 20,
            backgroundColor: Colors.grey,
            child: Icon(Icons.person, color: Colors.white),
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
              const Text(
                "👷",
                style: TextStyle(fontSize: 14),
              ),
            ],
          ),
        ],
      ),
      actions: [
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

  Widget _buildStatusBadges() {
    return Row(
      children: [
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
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            const Text("Priority Score: 100/100", style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 4),
            Container(width: 100, height: 6,
              decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(3)),
              child: Stack(children: [
                  Container(width: 100, decoration: BoxDecoration(color: const Color(0xFF00A381), borderRadius: BorderRadius.circular(3))),
              ])),
        ]),
      ],
    );
  }

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

  Widget _buildEarningsCard() {
    final earnings = double.tryParse(_stats['total_earnings']?.toString() ?? '0.0') ?? 0.0;
    final jobs = _stats['jobs_done']?.toString() ?? '0';

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
          Text("LKR ${earnings.toStringAsFixed(0)}", style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          const Divider(color: Colors.white24),
          const SizedBox(height: 16),
          Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
              _buildEarningStat(jobs, "Jobs"),
              Container(height: 40, width: 1, color: Colors.white24),
              _buildEarningStat("0.0 ★", "Rating"),
              Container(height: 40, width: 1, color: Colors.white24),
              _buildEarningStat("100%", "Response"),
          ]),
        ],
      ),
    );
  }

  Widget _buildEarningStat(String value, String label) {
    return Column(children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
    ]);
  }

  Widget _buildQuickStats() {
    final totalBookings = _stats['total_bookings']?.toString() ?? '0';

    return GridView.count(crossAxisCount: 2, shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 16, mainAxisSpacing: 16, childAspectRatio: 2.1,
      children: [
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/job-requests'),
          child: _buildStatCard(totalBookings, "TOTAL JOBS"),
        ),
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/worker-reviews'),
          child: _buildStatCard("0.0", "RATING"),
        ),
        GestureDetector(
          onTap: () => Navigator.pushNamed(context, '/worker-subscription'),
          child: _buildStatCard("Free Plan", "SUBSCRIPTION"),
        ),
        _buildStatCard("100", "PRIORITY SCORE"),
    ]);
  }

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

  Widget _buildRequestCard({
    required String id,
    required String title,
    required String location,
    required String price,
    bool isNew = false,
  }) {
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
              ]),
          ]),
          const SizedBox(height: 16),
          Row(children: [
              Expanded(child: SizedBox(height: 44, child: ElevatedButton(
                onPressed: () => _acceptJob(id), 
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF006D44), elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), 
                child: const Text("Accept", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))))),
              const SizedBox(width: 12),
              Expanded(child: SizedBox(height: 44, child: OutlinedButton(
                onPressed: () => _declineJob(id), 
                style: OutlinedButton.styleFrom(side: const BorderSide(color: Color(0xFFF6A3A3)), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), 
                child: const Text("Decline", style: TextStyle(color: Color(0xFFD32F2F), fontWeight: FontWeight.bold))))),
          ]),
        ],
      ),
    );
  }

  Widget _buildJobTile({required String id, required String title, required String time}) {
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
                onPressed: () => _completeJob(id), 
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF006D44), elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                child: const Text("Mark complete", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)))),
          ),
      ]),
    );
  }

  Widget _buildProPlanCard(String renewalStr) {
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
          Text("$renewalStr • LKR 2,500/month", style: const TextStyle(color: Colors.grey, fontSize: 14)),
          const SizedBox(height: 16),
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
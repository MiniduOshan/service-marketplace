import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';

class JobRequestsScreen extends StatefulWidget {
  const JobRequestsScreen({super.key});

  @override
  State<JobRequestsScreen> createState() => _JobRequestsScreenState();
}

class _JobRequestsScreenState extends State<JobRequestsScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  static const Color backgroundGrey = Color(0xFFF8FAFC);
  bool _isLoading = true;
  String? _error;
  List<Map<String, dynamic>> _bookings = [];

  @override
  void initState() {
    super.initState();
    _fetchBookings();
  }

  Future<void> _fetchBookings() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final token = authController.sessionToken;
      final bookings = await ApiClient.instance.getBookings(token: token);
      if (mounted) {
        setState(() {
          _bookings = bookings;
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

  List<Map<String, dynamic>> get _pending {
    return _bookings.where((b) => b['status']?.toString().toLowerCase() == 'pending').toList();
  }

  List<Map<String, dynamic>> get _active {
    return _bookings.where((b) => 
      ['confirmed', 'assigned', 'in_progress', 'in-progress', 'active'].contains(b['status']?.toString().toLowerCase())
    ).toList();
  }

  List<Map<String, dynamic>> get _completed {
    return _bookings.where((b) => b['status']?.toString().toLowerCase() == 'completed').toList();
  }

  List<Map<String, dynamic>> get _cancelled {
    return _bookings.where((b) => b['status']?.toString().toLowerCase() == 'cancelled').toList();
  }

  Future<void> _acceptJob(String bookingId) async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Job request accepted!"), backgroundColor: primaryGreen)
    );
    setState(() {
      _bookings = _bookings.map((b) {
        if (b['id']?.toString() == bookingId) {
          final updated = Map<String, dynamic>.from(b);
          updated['status'] = 'confirmed';
          return updated;
        }
        return b;
      }).toList();
    });
  }

  Future<void> _declineJob(String bookingId) async {
    try {
      final token = authController.sessionToken;
      await ApiClient.instance.cancelBooking(bookingId: bookingId, token: token);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Job request declined."), backgroundColor: Colors.red)
        );
        setState(() {
          _bookings = _bookings.map((b) {
            if (b['id']?.toString() == bookingId) {
              final updated = Map<String, dynamic>.from(b);
              updated['status'] = 'cancelled';
              return updated;
            }
            return b;
          }).toList();
        });
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
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Job marked as complete!"), backgroundColor: primaryGreen)
    );
    setState(() {
      _bookings = _bookings.map((b) {
        if (b['id']?.toString() == bookingId) {
          final updated = Map<String, dynamic>.from(b);
          updated['status'] = 'completed';
          return updated;
        }
        return b;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final pendingList = _pending;
    final activeList = _active;
    final completedList = _completed;
    final cancelledList = _cancelled;

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: backgroundGrey,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: primaryGreen),
            onPressed: () => Navigator.pop(context),
          ),
          title: const Text(
            "Job Requests",
            style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          bottom: TabBar(
            isScrollable: true,
            labelColor: primaryGreen,
            unselectedLabelColor: Colors.grey,
            indicatorColor: primaryGreen,
            indicatorWeight: 3,
            tabs: [
              Tab(child: Row(children: [const Text("Pending"), const SizedBox(width: 4), _countBadge(pendingList.length.toString(), Colors.red)])),
              Tab(child: Row(children: [const Text("Active"), const SizedBox(width: 4), _countBadge(activeList.length.toString(), Colors.blue)])),
              Tab(child: Row(children: [const Text("Completed"), const SizedBox(width: 4), _countBadge(completedList.length.toString(), Colors.green)])),
              Tab(child: Row(children: [const Text("Cancelled"), const SizedBox(width: 4), _countBadge(cancelledList.length.toString(), Colors.grey)])),
            ],
          ),
        ),
        body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryGreen))
          : RefreshIndicator(
              color: primaryGreen,
              onRefresh: _fetchBookings,
              child: TabBarView(
                children: [
                  _buildList(pendingList, isPending: true),
                  _buildList(activeList, isActive: true),
                  _buildList(completedList),
                  _buildList(cancelledList),
                ],
              ),
            ),
      ),
    );
  }

  static Widget _countBadge(String count, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
      child: Text(count, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildList(List<Map<String, dynamic>> items, {bool isPending = false, bool isActive = false}) {
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(_error!, style: const TextStyle(color: Colors.red)),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _fetchBookings,
                style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
                child: const Text("Retry", style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      );
    }

    if (items.isEmpty) {
      return const Center(
        child: SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.work_off_outlined, size: 64, color: Colors.grey),
                SizedBox(height: 16),
                Text("No jobs found", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey)),
              ],
            ),
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final b = items[index];
        final package = b['service_package'] ?? {};
        final title = package['title']?.toString() ?? 'Service Booking';
        final price = double.tryParse(b['total_price']?.toString() ?? '')?.toStringAsFixed(0) ?? '0';
        final address = b['address']?.toString() ?? 'No location';
        final date = b['scheduled_at'] != null 
          ? b['scheduled_at'].toString().split('T')[0]
          : 'No Date';
        final customerValue = b['customer'];
        final customerName = (customerValue is Map)
          ? (customerValue['name']?.toString() ?? 'Verified Customer')
          : (customerValue?.name ?? 'Verified Customer');
        final notes = b['notes']?.toString();

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
                  _statusLabel(b['status']?.toString().toUpperCase() ?? 'PENDING', isPending ? Colors.red : (isActive ? Colors.blue : Colors.green)),
                  Text(date, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                ],
              ),
              const SizedBox(height: 12),
              Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, height: 1.2)),
              const SizedBox(height: 16),
              _customerRow(customerName),
              const SizedBox(height: 16),
              _buildInfoGrid(address, date, price),
              if (notes != null && notes.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text(
                  notes,
                  style: const TextStyle(color: Colors.grey, fontSize: 14),
                ),
              ],
              if (isPending) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _outlinedBtn(context, "Decline", Colors.red, () => _declineJob(b['id']?.toString() ?? ''))),
                    const SizedBox(width: 8),
                    Expanded(child: _outlinedBtn(context, "Chat first", Colors.black, () {
                      Navigator.pushNamed(context, '/chat', arguments: {
                        'bookingId': b['id']?.toString() ?? '',
                        'counterpartName': customerName,
                        'counterpartTag': 'Customer',
                      });
                    })),
                  ],
                ),
                const SizedBox(height: 8),
                _fullWidthBtn(context, "Accept Job", primaryGreen, () => _acceptJob(b['id']?.toString() ?? '')),
              ] else if (isActive) ...[
                const SizedBox(height: 16),
                _fullWidthBtnWithIcon(context, "Mark as Complete", primaryGreen, Icons.check_circle_outline, () => _completeJob(b['id']?.toString() ?? '')),
              ]
            ],
          ),
        );
      },
    );
  }

  Widget _statusLabel(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
      child: Text(text, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }

  Widget _customerRow(String name) {
    return Row(
      children: [
        const CircleAvatar(radius: 20, backgroundColor: Colors.grey, child: Icon(Icons.person, color: Colors.white, size: 18)),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const Row(children: [Icon(Icons.star, color: Colors.orange, size: 14), Text(" 5.0 (New Customer)", style: TextStyle(color: Colors.grey, fontSize: 12))]),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoGrid(String address, String date, String price) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
      child: GridView.count(
        shrinkWrap: true,
        crossAxisCount: 2,
        childAspectRatio: 4.5,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _infoItem(Icons.location_on_outlined, address),
          _infoItem(Icons.calendar_today_outlined, date),
          _infoItem(Icons.access_time, "9:00 AM"),
          _infoItem(Icons.payments_outlined, "LKR $price", color: Colors.teal),
        ],
      ),
    );
  }

  Widget _infoItem(IconData icon, String text, {Color color = Colors.black87}) {
    return Row(
      children: [
        Icon(icon, size: 16, color: primaryGreen), 
        const SizedBox(width: 8), 
        Expanded(
          child: Text(
            text, 
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w500)
          )
        )
      ]
    );
  }

  Widget _outlinedBtn(BuildContext context, String text, Color color, VoidCallback onPressed) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(side: BorderSide(color: color.withValues(alpha: 0.2)), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), minimumSize: const Size(0, 48)),
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
    );
  }

  Widget _fullWidthBtn(BuildContext context, String text, Color color, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(backgroundColor: color, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), elevation: 0),
        child: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _fullWidthBtnWithIcon(BuildContext context, String text, Color color, IconData icon, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.white),
        label: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(backgroundColor: color, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)), elevation: 0),
      ),
    );
  }
}
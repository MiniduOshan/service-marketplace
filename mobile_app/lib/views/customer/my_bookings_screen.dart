import 'package:flutter/material.dart';

import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  static const Color backgroundGrey = Color(0xFFF6F8F9);

  bool _isLoading = true;
  String? _errorMessage;
  List<Map<String, dynamic>> _bookings = [];

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  Future<void> _loadBookings() async {
    try {
      final bookings = await ApiClient.instance.getBookings(token: authController.sessionToken);
      if (!mounted) return;

      setState(() {
        _bookings = bookings;
        _isLoading = false;
        _errorMessage = null;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _bookings = [];
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
        _isLoading = false;
      });
    }
  }

  Future<void> _cancelBooking(String bookingId) async {
    try {
      await ApiClient.instance.cancelBooking(
        bookingId: bookingId,
        token: authController.sessionToken,
      );

      if (!mounted) return;
      await _loadBookings();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Booking cancelled.')));
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 6,
      initialIndex: 1,
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
            'My Bookings',
            style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh, color: Colors.grey),
              onPressed: _loadBookings,
            ),
          ],
          bottom: const TabBar(
            isScrollable: true,
            labelColor: primaryGreen,
            unselectedLabelColor: Colors.grey,
            indicatorColor: primaryGreen,
            indicatorWeight: 3,
            labelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            tabs: [
              Tab(text: 'All'),
              Tab(text: 'Active'),
              Tab(text: 'Pending'),
              Tab(text: 'Declined'),
              Tab(text: 'Completed'),
              Tab(text: 'Cancelled'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildBookingsList(null),
            _buildBookingsList(const ['pending', 'confirmed', 'assigned', 'in_progress', 'in progress']),
            _buildBookingsList(const ['pending']),
            _buildBookingsList(const ['declined']),
            _buildBookingsList(const ['completed']),
            _buildBookingsList(const ['cancelled']),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingsList(List<String>? allowedStatuses) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: primaryGreen));
    }

    if (_errorMessage != null && _bookings.isEmpty) {
      return _emptyState(_errorMessage!);
    }

    final visibleBookings = _bookings.where((booking) {
      if (allowedStatuses == null) {
        return true;
      }

      final status = booking['status']?.toString().toLowerCase() ?? '';
      return allowedStatuses.contains(status);
    }).toList();

    if (visibleBookings.isEmpty) {
      return _emptyState('No bookings found yet.');
    }

    return RefreshIndicator(
      onRefresh: _loadBookings,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: visibleBookings.length,
        separatorBuilder: (context, _) => const SizedBox(height: 16),
        itemBuilder: (context, index) => _buildBookingCard(visibleBookings[index]),
      ),
    );
  }

  Widget _emptyState(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Text(message, style: const TextStyle(color: Colors.grey)),
      ),
    );
  }

  Widget _buildBookingCard(Map<String, dynamic> booking) {
    final bookingId = booking['id'].toString();
    final status = booking['status']?.toString().toLowerCase() ?? 'pending';
    final servicePackage = booking['service_package'] as Map<String, dynamic>?;
    final worker = booking['worker'] as Map<String, dynamic>?;

    final serviceTitle = servicePackage?['title']?.toString() ?? 'Service';
    final workerName = worker?['name']?.toString() ?? 'Worker';
    final scheduledAt = booking['scheduled_at']?.toString() ?? '';
    final address = booking['address']?.toString() ?? '';
    final totalPrice = booking['total_price']?.toString() ?? '0';

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
              Text('#BK-$bookingId', style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
              _statusBadge(status),
            ],
          ),
          const SizedBox(height: 12),
          Text(workerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 4),
          Text(serviceTitle, style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 8),
          Text(scheduledAt, style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 8),
          Text(address, style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('LKR $totalPrice', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Row(
                children: [
                  if (status != 'cancelled')
                    TextButton(
                      onPressed: () => Navigator.pushNamed(context, '/chat', arguments: {
                        'bookingId': bookingId,
                        'counterpartName': workerName,
                        'counterpartTag': 'Worker',
                      }),
                      child: const Text('Chat', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                    ),
                  if (status != 'completed' && status != 'cancelled')
                    TextButton(
                      onPressed: () => _cancelBooking(bookingId),
                      child: const Text('Cancel', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                    ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statusBadge(String status) {
    Color bg;
    Color fg;
    String label;

    switch (status) {
      case 'completed':
        bg = Colors.green.shade100;
        fg = Colors.green.shade800;
        label = 'Completed';
        break;
      case 'cancelled':
        bg = Colors.red.shade100;
        fg = Colors.red.shade800;
        label = 'Cancelled';
        break;
      case 'declined':
        bg = Colors.orange.shade100;
        fg = Colors.orange.shade800;
        label = 'Declined';
        break;
      case 'pending':
        bg = Colors.amber.shade100;
        fg = Colors.amber.shade800;
        label = 'Pending';
        break;
      default:
        bg = Colors.green.shade100;
        fg = Colors.green.shade800;
        label = 'Active';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Text(label, style: TextStyle(color: fg, fontWeight: FontWeight.bold, fontSize: 12)),
    );
  }
}

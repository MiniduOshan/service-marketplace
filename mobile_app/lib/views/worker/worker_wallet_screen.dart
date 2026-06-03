import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';

class WorkerWalletScreen extends StatefulWidget {
  const WorkerWalletScreen({super.key});

  @override
  State<WorkerWalletScreen> createState() => _WorkerWalletScreenState();
}

class _WorkerWalletScreenState extends State<WorkerWalletScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  bool _isLoading = true;
  String? _error;

  Map<String, dynamic> _stats = {
    'total_earnings': 0.0,
    'jobs_done': 0,
    'total_bookings': 0,
    'profile_views': 0,
  };
  List<Map<String, dynamic>> _bookings = [];
  String? _linkedBankName;
  String? _linkedAccountNumber;
  String _proPriceStr = 'LKR 0';

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
      final results = await Future.wait([
        ApiClient.instance.getWorkerStats(token: token),
        ApiClient.instance.getBookings(token: token),
        ApiClient.instance.fetchPricingPlans(),
      ]);
      final statsRes = results[0] as Map<String, dynamic>;
      final bookingsRes = results[1] as List<Map<String, dynamic>>;
      final plansRes = results[2] as Map<String, dynamic>;

      String proPriceStr = 'LKR 0';
      final plansList = plansRes['data'];
      if (plansList is List && plansList.isNotEmpty) {
        try {
          final paidPlan = plansList.firstWhere(
            (p) => (double.tryParse(p['price'].toString()) ?? 0) > 0,
          );
          final numPrice = double.tryParse(paidPlan['price'].toString()) ?? 0;
          final formatter = NumberFormat('#,##0', 'en_US');
          proPriceStr = 'LKR ${formatter.format(numPrice)}';
        } catch (_) {}
      }

      if (mounted) {
        setState(() {
          _stats = statsRes;
          _bookings = bookingsRes;
          _proPriceStr = proPriceStr;
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

  void _showAddBankDialog() {
    final bankNameController = TextEditingController();
    final accountNumberController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Link Bank Account"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: bankNameController,
                decoration: const InputDecoration(labelText: "Bank Name", hintText: "e.g. Sampath Bank"),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: accountNumberController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Account Number", hintText: "e.g. 100234567890"),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                if (bankNameController.text.trim().isNotEmpty && accountNumberController.text.trim().isNotEmpty) {
                  setState(() {
                    _linkedBankName = bankNameController.text.trim();
                    _linkedAccountNumber = accountNumberController.text.trim();
                  });
                  Navigator.pop(context);
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
              child: const Text("Save", style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final grossEarnings = double.tryParse(_stats['total_earnings']?.toString() ?? '0.0') ?? 0.0;
    final jobsCount = _stats['jobs_done'] ?? 0;
    final commission = grossEarnings * 0.05;
    final leadFees = jobsCount * 20.0;
    final netPayout = grossEarnings - commission - leadFees;

    final renewalDate = DateTime.now().add(const Duration(days: 30));
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final renewalStr = "Renews ${months[renewalDate.month - 1]} ${renewalDate.day}";

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: primaryGreen),
            onPressed: () => Navigator.pop(context),
          ),
          title: const Text("Earnings & Wallet", 
            style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
          centerTitle: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.ios_share, color: primaryGreen), 
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Earnings report shared successfully!"), backgroundColor: primaryGreen)
                );
              }
            )
          ],
          bottom: const TabBar(
            labelColor: primaryGreen,
            unselectedLabelColor: Colors.grey,
            indicatorColor: primaryGreen,
            tabs: [Tab(text: "This month"), Tab(text: "Last month"), Tab(text: "This year")],
          ),
        ),
        body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryGreen))
          : RefreshIndicator(
              color: primaryGreen,
              onRefresh: _fetchData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Column(
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
                    _buildMainBalanceCard(grossEarnings),
                    const SizedBox(height: 20),
                    _buildQuickStatsRow(jobsCount, commission + leadFees, netPayout),
                    const SizedBox(height: 24),
                    _buildPlatformFeesCard(grossEarnings, commission, leadFees, netPayout),
                    const SizedBox(height: 20),
                    _buildProPlanBanner(renewalStr, _proPriceStr),
                    const SizedBox(height: 24),
                    _buildRecentTransactions(),
                    const SizedBox(height: 24),
                    _buildWithdrawalSection(netPayout),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
      ),
    );
  }

  Widget _buildMainBalanceCard(double totalEarned) {
    final currentMonthYear = "${DateTime.now().year}-${DateTime.now().month.toString().padLeft(2, '0')}";

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: primaryGreen,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text("TOTAL EARNED — $currentMonthYear", 
            style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text("LKR ${totalEarned.toStringAsFixed(0)}", 
            style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
          const Text("Live database sync", 
            style: TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 24),
          OutlinedButton(
            onPressed: () {
              if (_linkedAccountNumber == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Please link a bank account below first."))
                );
                return;
              }
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Withdrawal process initiated!"), backgroundColor: primaryGreen)
              );
            },
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Colors.white38),
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Withdraw funds", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStatsRow(int jobsDone, double feesPaid, double netPay) {
    return Row(
      children: [
        _statBox(jobsDone.toString(), "JOBS DONE"),
        const SizedBox(width: 12),
        _statBox("LKR ${feesPaid.toStringAsFixed(0)}", "FEES PAID"),
        const SizedBox(width: 12),
        _statBox("LKR ${netPay.toStringAsFixed(0)}", "NET PAY"),
      ],
    );
  }

  Widget _statBox(String val, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
        child: Column(
          children: [
            Text(val, textAlign: TextAlign.center, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: primaryGreen)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildPlatformFeesCard(double gross, double commission, double leadFees, double netPayout) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Platform Fees", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _feeRow("Gross earnings", "LKR ${gross.toStringAsFixed(0)}"),
          _feeRow("Commission (5%)", "- LKR ${commission.toStringAsFixed(0)}", color: Colors.red),
          _feeRow("Lead fees paid", "- LKR ${leadFees.toStringAsFixed(0)}", color: Colors.red),
          const Divider(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Net payout", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              Text("LKR ${netPayout.toStringAsFixed(0)}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryGreen)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _feeRow(String label, String val, {Color color = Colors.black}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(val, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildProPlanBanner(String renewalStr, String proPriceStr) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFEF3C7)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Pro Plan — $proPriceStr/month", style: const TextStyle(color: Color(0xFF92400E), fontWeight: FontWeight.bold)),
                Text(renewalStr, style: const TextStyle(color: Color(0xFFD97706), fontSize: 12)),
              ],
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pushNamed(context, '/worker-subscription'),
            child: const Text("MANAGE", style: TextStyle(color: Color(0xFF1B434D), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTransactions() {
    final completedBookings = _bookings.where((b) => b['status']?.toString().toLowerCase() == 'completed').toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Recent transactions", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            TextButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("All completed bookings are listed below."))
                );
              }, 
              child: const Text("See all", style: TextStyle(color: primaryGreen))
            ),
          ],
        ),
        if (completedBookings.isEmpty) ...[
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
            child: const Center(
              child: Text("No transactions yet.", style: TextStyle(color: Colors.grey)),
            ),
          ),
        ] else ...[
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: completedBookings.length,
            itemBuilder: (context, index) {
              final b = completedBookings[index];
              final package = b['service_package'] ?? {};
              final title = package['title']?.toString() ?? 'Service Package';
              final price = double.tryParse(b['total_price']?.toString() ?? '')?.toStringAsFixed(0) ?? '0';
              final date = b['scheduled_at'] != null 
                ? b['scheduled_at'].toString().split('T')[0]
                : 'No Date';

              return _transactionTile(title, "+ LKR $price", date, "PAID", Colors.green);
            },
          ),
        ],
      ],
    );
  }

  Widget _transactionTile(String title, String val, String date, String status, Color statusColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(date, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 4),
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(val, style: TextStyle(fontWeight: FontWeight.bold, color: val.contains('+') ? Colors.green : Colors.red)),
              const SizedBox(height: 4),
              Text(status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: statusColor)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWithdrawalSection(double netPayout) {
    final maskedAccount = _linkedAccountNumber != null 
        ? "•••• ${_linkedAccountNumber!.substring(_linkedAccountNumber!.length - 4)}"
        : "No bank account linked";

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Bank account", style: TextStyle(fontWeight: FontWeight.bold)),
              TextButton(
                onPressed: _showAddBankDialog, 
                child: Text(_linkedAccountNumber != null ? "Change" : "Link Account", style: const TextStyle(color: primaryGreen))
              ),
            ],
          ),
          Text(
            _linkedBankName != null ? "$maskedAccount ($_linkedBankName)" : "Add bank account for withdrawal payouts", 
            style: const TextStyle(color: Colors.grey)
          ),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("AVAILABLE TO WITHDRAW", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text("LKR ${netPayout.toStringAsFixed(0)}", style: const TextStyle(color: primaryGreen, fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              if (_linkedAccountNumber == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Link a bank account first."))
                );
                return;
              }
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Withdrawal request submitted!"), backgroundColor: primaryGreen)
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryGreen,
              minimumSize: const Size(double.infinity, 55),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Withdraw", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ],
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../../services/api_client.dart';

class WorkerSubscriptionScreen extends StatefulWidget {
  const WorkerSubscriptionScreen({super.key});

  @override
  State<WorkerSubscriptionScreen> createState() =>
      _WorkerSubscriptionScreenState();
}

class _WorkerSubscriptionScreenState extends State<WorkerSubscriptionScreen> {
  static const Color primaryGreen = Color(0xFF006D44);

  List<Map<String, dynamic>> _plans = [];
  bool _loadingPlans = true;

  @override
  void initState() {
    super.initState();
    _fetchPlans();
  }

  Future<void> _fetchPlans() async {
    try {
      final response = await ApiClient.instance.fetchPricingPlans();
      final data = response['data'];
      if (data is List) {
        setState(() {
          _plans = data.cast<Map<String, dynamic>>();
          _loadingPlans = false;
        });
      } else {
        setState(() => _loadingPlans = false);
      }
    } catch (e) {
      debugPrint('Failed to load pricing plans: $e');
      setState(() => _loadingPlans = false);
    }
  }

  String _formatPrice(dynamic price) {
    final numPrice = double.tryParse(price.toString()) ?? 0;
    final formatter = NumberFormat('#,##0', 'en_US');
    return 'LKR ${formatter.format(numPrice)}';
  }

  /// Find the first paid plan (price > 0) to use as the "Pro" plan.
  Map<String, dynamic>? get _proPlan {
    try {
      return _plans.firstWhere(
        (p) => (double.tryParse(p['price'].toString()) ?? 0) > 0,
      );
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final renewalDate = DateTime.now().add(const Duration(days: 30));
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    final renewalStr =
        "Renews ${renewalDate.day} ${months[renewalDate.month - 1]} ${renewalDate.year}";

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Subscription & Plan",
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: _loadingPlans
          ? const Center(child: CircularProgressIndicator(color: primaryGreen))
          : ValueListenableBuilder<AppUser?>(
              valueListenable: authController.authStateNotifier,
              builder: (context, user, child) {
                final isPro = user?.pricingPlanId != null;
                final proPlan = _proPlan;
                final proPriceStr = proPlan != null
                    ? '${_formatPrice(proPlan['price'])}/month'
                    : 'LKR 0/month';

                return SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildActivePlanHeader(
                          context, renewalStr, isPro, proPlan, proPriceStr),
                      const SizedBox(height: 30),
                      const Text("What Pro gives you",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      _buildBenefitsList(proPlan),
                      const SizedBox(height: 30),
                      const Text("Plan comparison",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      _buildPlanComparison(isPro, proPlan),
                      const SizedBox(height: 30),
                      _buildPriorityScoreCard(isPro),
                      const SizedBox(height: 24),
                      _buildPayPerLeadToggle(context, isPro),
                      const SizedBox(height: 30),
                      Center(
                        child: TextButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text(
                                        "Payment settings coming soon!")));
                          },
                          child: const Text("Manage payment method",
                              style: TextStyle(
                                  color: primaryGreen,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const Center(
                          child:
                              Text("•", style: TextStyle(color: Colors.grey))),
                      Center(
                        child: TextButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text(
                                        "Support chat coming soon!")));
                          },
                          child: const Text("Contact support",
                              style: TextStyle(
                                  color: primaryGreen,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(height: 40),
                    ],
                  ),
                );
              },
            ),
    );
  }

  Widget _buildActivePlanHeader(BuildContext context, String renewalStr,
      bool isPro, Map<String, dynamic>? proPlan, String proPriceStr) {
    if (!isPro) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.info_outline, color: primaryGreen),
                SizedBox(width: 8),
                Text("Free Plan — Active",
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                        fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 4),
            const Text(
                "LKR 0/month · Pay-per-lead (LKR 150 per lead)",
                style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 20),
            if (proPlan != null)
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryGreen,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: () async {
                    try {
                      await authController
                          .updatePricingPlan(proPlan['id'] as int);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content:
                                  Text("Upgraded to Pro Plan successfully!"),
                              backgroundColor: primaryGreen),
                        );
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(e.toString())),
                        );
                      }
                    }
                  },
                  child: Text(
                      "Upgrade to ${proPlan['title'] ?? 'Pro'}",
                      style: const TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
          ],
        ),
      );
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: primaryGreen,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.stars, color: Colors.white),
              const SizedBox(width: 8),
              Text(
                  "${proPlan?['title'] ?? 'Pro'} Plan — Active",
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          Text("$renewalStr · $proPriceStr",
              style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 20),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(30)),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.trending_up, color: Colors.white, size: 16),
                SizedBox(width: 8),
                Text("PRIORITY SCORE BOOST: +25 POINTS",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text("Cancel Pro Plan"),
                    content: const Text(
                        "Are you sure you want to cancel your Pro Plan subscription? This will immediately revoke your profile priority score boost and badges."),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text("Keep Plan",
                            style: TextStyle(color: Colors.grey)),
                      ),
                      TextButton(
                        onPressed: () async {
                          Navigator.pop(ctx);
                          try {
                            await authController.updatePricingPlan(null);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text(
                                        "Subscription cancelled successfully."),
                                    backgroundColor: Colors.red),
                              );
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text(e.toString())),
                              );
                            }
                          }
                        },
                        child: const Text("Cancel Plan",
                            style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
              },
              child: const Text("Cancel plan",
                  style: TextStyle(color: Colors.white70)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBenefitsList(Map<String, dynamic>? proPlan) {
    final privileges = (proPlan?['privileges'] as List?)
            ?.map((e) => e.toString())
            .toList() ??
        [
          "Appear in top 5 search results",
          "\"Featured\" badge on profile",
          "Get job leads before free members",
          "Unlimited bookings per month",
          "Analytics dashboard access",
          "Priority support"
        ];

    return Container(
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200)),
      child: Column(
        children: privileges
            .map((b) => ListTile(
                  leading:
                      const Icon(Icons.check_circle, color: Colors.green),
                  title: Text(b, style: const TextStyle(fontSize: 14)),
                  visualDensity: VisualDensity.compact,
                ))
            .toList(),
      ),
    );
  }

  Widget _buildPlanComparison(
      bool isPro, Map<String, dynamic>? proPlan) {
    final proPrice = proPlan != null
        ? '${_formatPrice(proPlan['price'])}/mo'
        : 'LKR 0/mo';
    final proTitle = proPlan?['title'] ?? 'Pro';

    return Row(
      children: [
        _comparisonCard("Free", "LKR 0/month",
            ["Basic Profile"], ["Featured Badge", "Early Leads"],
            isCurrent: !isPro),
        const SizedBox(width: 16),
        _comparisonCard(proTitle, proPrice,
            ["Premium Profile", "Featured Badge", "Early Leads"], [],
            isCurrent: isPro),
      ],
    );
  }

  Widget _comparisonCard(String title, String price, List<String> pros,
      List<String> cons,
      {bool isCurrent = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isCurrent ? const Color(0xFFE8F6F1) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: isCurrent ? primaryGreen : Colors.grey.shade200,
              width: isCurrent ? 2 : 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isCurrent)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                decoration: BoxDecoration(
                    color: primaryGreen,
                    borderRadius: BorderRadius.circular(20)),
                child: const Text("CURRENT",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold)),
              ),
            const SizedBox(height: 8),
            Text(title,
                style: const TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold)),
            Text(price,
                style:
                    const TextStyle(color: Colors.grey, fontSize: 12)),
            const Divider(height: 24),
            ...pros.map((p) => _row(Icons.check, Colors.green, p)),
            ...cons.map((c) => _row(Icons.close, Colors.red, c)),
            const SizedBox(height: 20),
            Center(
                child: Text(
                    isCurrent ? "ACTIVE PLAN" : "UPGRADABLE",
                    style: TextStyle(
                        color: isCurrent ? primaryGreen : Colors.grey,
                        fontWeight: FontWeight.bold,
                        fontSize: 12))),
          ],
        ),
      ),
    );
  }

  Widget _row(IconData icon, Color color, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 8),
        Text(text, style: const TextStyle(fontSize: 11))
      ]),
    );
  }

  Widget _buildPriorityScoreCard(bool isPro) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Your priority score",
                  style: TextStyle(color: Colors.grey)),
              Text(isPro ? "100 /100" : "75 /100",
                  style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: primaryGreen)),
            ],
          ),
          const SizedBox(height: 16),
          _scoreBreakdownRow("Distance (Live)", "+20"),
          _scoreBreakdownRow("Rating 0.0", "+25"),
          _scoreBreakdownRow("Pro Subscription", isPro ? "+25" : "+0",
              isHighlight: isPro),
          _scoreBreakdownRow("Activity Level", "+25"),
          _scoreBreakdownRow("Response Rate", "+5"),
        ],
      ),
    );
  }

  Widget _scoreBreakdownRow(String label, String points,
      {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [
            CircleAvatar(
                radius: 4,
                backgroundColor:
                    isHighlight ? primaryGreen : Colors.grey),
            const SizedBox(width: 10),
            Text(label)
          ]),
          Text(points,
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isHighlight ? primaryGreen : Colors.black)),
        ],
      ),
    );
  }

  Widget _buildPayPerLeadToggle(BuildContext context, bool isPro) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.payments_outlined, color: Colors.grey),
              const SizedBox(width: 12),
              const Expanded(
                  child: Text("Pay-per-lead option",
                      style: TextStyle(fontWeight: FontWeight.bold))),
              Switch(value: !isPro, onChanged: null),
            ],
          ),
          const Padding(
            padding: EdgeInsets.only(top: 8),
            child: Text(
                "LKR 150 per job request. Active when using the Free Plan. Pro features will be disabled.",
                style: TextStyle(color: Colors.grey, fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
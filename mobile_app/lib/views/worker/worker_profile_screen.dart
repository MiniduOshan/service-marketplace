import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import '../../models/app_user.dart';
import '../../services/api_client.dart';
import '../auth/otp_screen.dart';
import 'document_verification_screen.dart';
import 'worker_service_packages_screen.dart';

class WorkerProfileScreen extends StatefulWidget {
  const WorkerProfileScreen({super.key});

  @override
  State<WorkerProfileScreen> createState() => _WorkerProfileScreenState();
}

class _WorkerProfileScreenState extends State<WorkerProfileScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  static const Color scaffoldBg = Color(0xFFF8FAFC);
  static const Color accentBlue = Color(0xFF1E293B);

  List<Map<String, dynamic>>? _services;
  Map<String, dynamic>? _stats;
  bool _isLoading = true;
  bool _isIdVerified = false;
  bool _hasCertificate = false;
  final List<String> _portfolioUrls = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final token = authController.sessionToken;
      final services = await ApiClient.instance.getWorkerServices(token: token);
      final stats = await ApiClient.instance.getWorkerStats(token: token);
      if (mounted) {
        setState(() {
          _services = services;
          _stats = stats;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<AppUser?>(
      valueListenable: authController.authStateNotifier,
      builder: (context, currentUser, child) {
        return Scaffold(
          backgroundColor: scaffoldBg,
          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 0.5,
            title: const Text(
              "Profile",
              style: TextStyle(
                color: primaryGreen,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            centerTitle: true,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Column(
              children: [
                _buildProfileHeader(context),
                const SizedBox(height: 25),
                _buildPersonalDetailsSection(context),
                const SizedBox(height: 20),
                _buildStatsSection(),
                const SizedBox(height: 25),
                _buildServicesSection(context),
                const SizedBox(height: 25),
                _buildPortfolioSection(context),
                const SizedBox(height: 25),
                _buildRatingsSection(context),
                const SizedBox(height: 25),
                _buildAccountSettingsSection(context),
                const SizedBox(height: 40),
              ],
            ),
          ),
          bottomNavigationBar: _buildBottomNav(context),
        );
      },
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    final currentUser = authController.currentUser;
    final name = currentUser?.name ?? '';
    final initials = name.isNotEmpty
        ? name
              .trim()
              .split(' ')
              .map((e) => e.isNotEmpty ? e[0] : '')
              .join()
              .toUpperCase()
        : 'WK';
    final displayInitials = initials.length > 2
        ? initials.substring(0, 2)
        : initials;
    final displayName = name.isNotEmpty ? name : 'Worker';

    return Column(
      children: [
        Stack(
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: const BoxDecoration(
                color: primaryGreen,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  displayInitials,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: GestureDetector(
                onTap: () => _showEditProfileBottomSheet(context),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: primaryGreen,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: const Icon(Icons.edit, color: Colors.white, size: 16),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 15),
        Text(
          displayName,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: accentBlue,
          ),
        ),
      ],
    );
  }

  Widget _buildPersonalDetailsSection(BuildContext context) {
    final int verifiedCount =
        (_isIdVerified ? 1 : 0) + (_hasCertificate ? 1 : 0);
    final double completeness = verifiedCount / 2;
    final String completenessPct =
        "${(completeness * 100).toStringAsFixed(0)}%";

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Personal Details",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: accentBlue,
                ),
              ),
              InkWell(
                onTap: () => _showEditProfileBottomSheet(context),
                child: const Text(
                  "Manage",
                  style: TextStyle(
                    color: primaryGreen,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Profile Completeness",
                style: TextStyle(
                  color: Colors.grey,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                completenessPct,
                style: const TextStyle(
                  color: primaryGreen,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: completeness,
              backgroundColor: primaryGreen.withValues(alpha: 0.1),
              valueColor: const AlwaysStoppedAnimation<Color>(primaryGreen),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 15),
          const Text(
            "Complete your profile to earn more trust and attract 3x more clients.",
            style: TextStyle(color: Colors.grey, fontSize: 13),
          ),
          const SizedBox(height: 20),
          _buildChecklistItem(
            "ID Verification",
            _isIdVerified,
            actionText: _isIdVerified ? "DONE" : "VERIFY",
            onTap: _isIdVerified
                ? null
                : () => _startDocumentVerification(context),
          ),
          _buildChecklistItem(
            "Certificates",
            _hasCertificate,
            actionText: _hasCertificate ? "DONE" : "UPLOAD",
            onTap: _hasCertificate
                ? null
                : () {
                    setState(() => _hasCertificate = true);
                  },
          ),
        ],
      ),
    );
  }

  Widget _buildChecklistItem(
    String title,
    bool isDone, {
    String? actionText,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Icon(
              isDone ? Icons.check_circle : Icons.radio_button_unchecked,
              color: isDone ? primaryGreen : Colors.grey,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: isDone ? accentBlue : Colors.grey,
                ),
              ),
            ),
            Text(
              actionText ?? (isDone ? "DONE" : ""),
              style: TextStyle(
                color: isDone ? primaryGreen : primaryGreen,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsSection() {
    final earnings = _stats != null
        ? "Rs. ${(_stats!['total_earnings'] as num).toStringAsFixed(0)}"
        : "--";
    final jobs = _stats != null ? "${_stats!['jobs_done']}" : "--";
    final views = _stats != null ? "${_stats!['profile_views']}" : "--";

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          _buildStatCard("TOTAL EARNINGS", earnings, Colors.teal),
          const SizedBox(width: 12),
          _buildStatCard("JOBS DONE", jobs, Colors.blue),
          const SizedBox(width: 12),
          _buildStatCard("PROFILE VIEWS", views, Colors.orange),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
        ),
        child: Column(
          children: [
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: color.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getCategoryIcon(String? categoryName) {
    if (categoryName == null) return Icons.work_outline;
    switch (categoryName.toLowerCase()) {
      case 'painting':
        return Icons.format_paint;
      case 'electrical':
        return Icons.electrical_services;
      case 'plumbing':
        return Icons.plumbing;
      case 'carpentry':
        return Icons.handyman;
      case 'ac repair':
        return Icons.ac_unit;
      case 'cleaning':
        return Icons.cleaning_services;
      case 'masonry':
        return Icons.construction;
      default:
        return Icons.work_outline;
    }
  }

  Widget _buildServicesSection(BuildContext context) {
    final servicesList = _services;
    final isLoading = _isLoading;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Your Services",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: accentBlue,
                ),
              ),
              InkWell(
                onTap: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          const WorkerServicePackagesScreen(isEditing: true),
                    ),
                  );
                  // Refresh services and stats after returning from manage screen
                  setState(() {
                    _isLoading = true;
                  });
                  _fetchData();
                },
                child: const Text(
                  "Manage",
                  style: TextStyle(
                    color: primaryGreen,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 15),
        if (isLoading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 20),
            child: Center(
              child: CircularProgressIndicator(color: primaryGreen),
            ),
          )
        else if (servicesList == null || servicesList.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
            child: Text(
              "No services added yet. Tap Manage to add services.",
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
          )
        else
          ...servicesList.map((service) {
            final title = service['title']?.toString() ?? 'Unnamed Service';
            final priceNum = service['price'];
            final price = priceNum != null
                ? "Rs. $priceNum / task"
                : "Negotiable";
            final categoryObj = service['category'] as Map<String, dynamic>?;
            final categoryName = categoryObj?['name']?.toString();
            final isActive =
                service['is_active'] == true || service['is_active'] == 1;
            final serviceId = service['id']?.toString() ?? '';

            return _buildServiceTile(
              context,
              serviceId,
              title,
              price,
              _getCategoryIcon(categoryName),
              isActive,
            );
          }),
      ],
    );
  }

  Widget _buildServiceTile(
    BuildContext context,
    String servicePackageId,
    String name,
    String price,
    IconData icon,
    bool isActive,
  ) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: primaryGreen.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: primaryGreen),
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
                    fontSize: 16,
                    color: accentBlue,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  price,
                  style: const TextStyle(color: Colors.grey, fontSize: 14),
                ),
              ],
            ),
          ),
          Switch(
            value: isActive,
            onChanged: (v) async {
              try {
                final token = authController.sessionToken;
                await ApiClient.instance.updateWorkerServicePackage(
                  servicePackageId: servicePackageId,
                  isActive: v,
                  token: token,
                );

                // Refresh local state
                setState(() {
                  if (_services != null) {
                    final index = _services!.indexWhere(
                      (s) => s['id'].toString() == servicePackageId,
                    );
                    if (index != -1) {
                      _services![index]['is_active'] = v;
                    }
                  }
                });

                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text("$name ${v ? 'enabled' : 'disabled'}"),
                    ),
                  );
                }
              } catch (error) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        error.toString().replaceFirst('Exception: ', ''),
                      ),
                    ),
                  );
                }
              }
            },
            activeThumbColor: Colors.white,
            activeTrackColor: primaryGreen,
          ),
        ],
      ),
    );
  }

  Widget _buildPortfolioSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Portfolio",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: accentBlue,
                ),
              ),
              Text(
                "${_portfolioUrls.length} Items",
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ],
          ),
        ),
        const SizedBox(height: 15),
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.only(left: 20),
            children: [
              ..._portfolioUrls.map((url) => _buildPortfolioImage(url)),
              _buildAddWorkButton(context),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPortfolioImage(String url) {
    return Container(
      width: 150,
      margin: const EdgeInsets.only(right: 15),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        image: DecorationImage(image: NetworkImage(url), fit: BoxFit.cover),
      ),
    );
  }

  Widget _buildAddWorkButton(BuildContext context) {
    return InkWell(
      onTap: () {
        setState(() {
          _portfolioUrls.add(
            'https://picsum.photos/200?random=${_portfolioUrls.length}',
          );
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Portfolio item added!")));
      },
      child: Container(
        width: 150,
        margin: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: primaryGreen.withValues(alpha: 0.3),
            style: BorderStyle.solid,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(
              Icons.add_photo_alternate_outlined,
              color: primaryGreen,
              size: 30,
            ),
            SizedBox(height: 8),
            Text(
              "Add New Work",
              style: TextStyle(
                color: primaryGreen,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRatingsSection(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: () => Navigator.pushNamed(context, '/worker-reviews'),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Your Ratings",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: accentBlue,
                  ),
                ),
                Row(
                  children: const [
                    Icon(Icons.star, color: Colors.grey, size: 20),
                    SizedBox(width: 4),
                    Text(
                      "0.0",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      " (0)",
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                    SizedBox(width: 4),
                    Icon(Icons.chevron_right, color: Colors.grey, size: 18),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 20),
              child: Text(
                "No reviews yet. Completed jobs will show customer feedback here.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAccountSettingsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            "ACCOUNT SETTINGS",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
              letterSpacing: 1,
            ),
          ),
        ),
        const SizedBox(height: 15),
        _buildSettingsTile(
          context,
          Icons.notifications_none,
          "Notification Preferences",
          onTap: () =>
              Navigator.pushNamed(context, '/worker-notification-settings'),
        ),
        _buildSettingsTile(
          context,
          Icons.payment,
          "Payment Details",
          onTap: () => Navigator.pushNamed(context, '/worker-payment-settings'),
        ),
        _buildSettingsTile(
          context,
          Icons.language,
          "Language",
          trailingText: "English",
          onTap: () => Navigator.pushNamed(context, '/language-settings'),
        ),
        _buildSettingsTile(
          context,
          Icons.help_outline,
          "Help Center",
          onTap: () => Navigator.pushNamed(context, '/help-center'),
        ),
        const SizedBox(height: 12),
        _buildSettingsTile(
          context,
          Icons.logout,
          "Sign Out",
          onTap: () {
            authController.logOut();
            Navigator.pushNamedAndRemoveUntil(
              context,
              '/welcome',
              (route) => false,
            );
          },
        ),
      ],
    );
  }

  Widget _buildSettingsTile(
    BuildContext context,
    IconData icon,
    String title, {
    String? trailingText,
    VoidCallback? onTap,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      child: ListTile(
        onTap:
            onTap ??
            () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("$title settings coming soon!")),
              );
            },
        leading: Icon(icon, color: accentBlue.withValues(alpha: 0.7)),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 15),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (trailingText != null)
              Text(
                trailingText,
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
            const SizedBox(width: 5),
            const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: primaryGreen,
      unselectedItemColor: Colors.grey,
      currentIndex: 3,
      onTap: (index) {
        if (index == 0)
          Navigator.pushReplacementNamed(context, '/worker-dashboard');
        if (index == 1) Navigator.pushNamed(context, '/job-requests');
        if (index == 2) Navigator.pushNamed(context, '/worker-wallet');
      },
      selectedLabelStyle: const TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 12,
      ),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_outlined),
          label: "Dashboard",
        ),
        BottomNavigationBarItem(icon: Icon(Icons.work_outline), label: "Jobs"),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_balance_wallet_outlined),
          label: "Earnings",
        ),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
      ],
    );
  }

  Future<void> _startPhoneVerification(BuildContext context) async {
    final currentUser = authController.currentUser;
    final phone = currentUser?.phone?.trim() ?? '';
    final messenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);

    if (currentUser == null) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Please sign in again to verify phone.')),
      );
      return;
    }

    if (phone.isEmpty) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Please add your phone number first.')),
      );
      _showEditProfileBottomSheet(context);
      return;
    }

    try {
      final response = await authController.requestPhoneOtp(
        (currentUser.name ?? 'Worker').trim().isNotEmpty
            ? currentUser.name!.trim()
            : 'Worker',
        phone,
        currentUser.role,
      );

      final verificationPhone = response['data']?['phone']?.toString() ?? phone;

      if (!context.mounted) return;

      navigator.push(
        MaterialPageRoute(
          builder: (_) => OTPVerificationScreen(
            verificationTarget: verificationPhone,
            phoneNumber: verificationPhone,
            isFromProfile: true,
          ),
        ),
      );
    } catch (error) {
      messenger.showSnackBar(
        SnackBar(
          content: Text(error.toString().replaceFirst('Exception: ', '')),
        ),
      );
    }
  }

  void _startDocumentVerification(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const DocumentVerificationScreen()),
    );
  }

  void _showEditProfileBottomSheet(BuildContext context) {
    final currentUser = authController.currentUser;
    final nameController = TextEditingController(text: currentUser?.name ?? '');
    final phoneController = TextEditingController(
      text: currentUser?.phone ?? '',
    );
    final formKey = GlobalKey<FormState>();
    bool isLoading = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            padding: const EdgeInsets.all(24),
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 45,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    "Edit Profile Details",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: primaryGreen,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Update your personal information below.",
                    style: TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: nameController,
                    decoration: InputDecoration(
                      labelText: "Full Name",
                      prefixIcon: const Icon(
                        Icons.person_outline,
                        color: primaryGreen,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: primaryGreen,
                          width: 2,
                        ),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your name';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: "Phone Number",
                      prefixIcon: const Icon(
                        Icons.phone_outlined,
                        color: primaryGreen,
                      ),
                      hintText: "+94771234567",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: primaryGreen,
                          width: 2,
                        ),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your phone number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  StatefulBuilder(
                    builder: (modalContext, setModalState) {
                      return SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryGreen,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: isLoading
                              ? null
                              : () async {
                                  if (formKey.currentState!.validate()) {
                                    setModalState(() => isLoading = true);
                                    try {
                                      final newPhone = phoneController.text
                                          .trim();
                                      final oldPhone =
                                          currentUser?.phone?.trim() ?? '';
                                      final isPhoneVerificationNeeded =
                                          newPhone.isNotEmpty &&
                                          (newPhone != oldPhone ||
                                              !(currentUser?.isPhoneVerified ??
                                                  false));

                                      await authController.updateProfile(
                                        name: nameController.text.trim(),
                                        phone: newPhone,
                                      );

                                      if (context.mounted) {
                                        if (isPhoneVerificationNeeded) {
                                          final updatedUser =
                                              authController.currentUser;
                                          if (updatedUser != null) {
                                            final response =
                                                await authController
                                                    .requestPhoneOtp(
                                                      (updatedUser.name ??
                                                                  'Worker')
                                                              .trim()
                                                              .isNotEmpty
                                                          ? updatedUser.name!
                                                                .trim()
                                                          : 'Worker',
                                                      updatedUser.phone!,
                                                      updatedUser.role,
                                                    );
                                            final verificationPhone =
                                                response['data']?['phone']
                                                    ?.toString() ??
                                                updatedUser.phone!;

                                            if (context.mounted) {
                                              final navigator = Navigator.of(
                                                context,
                                              );
                                              navigator.pop();
                                              navigator.push(
                                                MaterialPageRoute(
                                                  builder: (_) =>
                                                      OTPVerificationScreen(
                                                        verificationTarget:
                                                            verificationPhone,
                                                        phoneNumber:
                                                            verificationPhone,
                                                        isFromProfile: true,
                                                      ),
                                                ),
                                              );
                                            }
                                          }
                                        } else {
                                          Navigator.pop(context);
                                          ScaffoldMessenger.of(
                                            context,
                                          ).showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                "Profile updated successfully!",
                                              ),
                                            ),
                                          );
                                        }
                                      }
                                    } catch (e) {
                                      if (context.mounted) {
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              e.toString().replaceFirst(
                                                'Exception: ',
                                                '',
                                              ),
                                            ),
                                          ),
                                        );
                                      }
                                    } finally {
                                      setModalState(() => isLoading = false);
                                    }
                                  }
                                },
                          child: isLoading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2.5,
                                  ),
                                )
                              : const Text(
                                  "Save Changes",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart'; // To handle logout
import '../../models/app_user.dart';
import '../auth/otp_screen.dart';

class UserProfileScreen extends StatelessWidget {
  const UserProfileScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

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
        const SnackBar(
          content: Text('Please add your phone number first.'),
        ),
      );
      _showEditProfileBottomSheet(context);
      return;
    }

    try {
      final response = await authController.requestPhoneOtp(
        (currentUser.name ?? 'Customer').trim().isNotEmpty
            ? currentUser.name!.trim()
            : 'Customer',
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

  void _showEditProfileBottomSheet(BuildContext context) {
    final currentUser = authController.currentUser;
    final nameController = TextEditingController(text: currentUser?.name ?? '');
    final phoneController = TextEditingController(text: currentUser?.phone ?? '');
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
                      prefixIcon: const Icon(Icons.person_outline, color: primaryGreen),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: primaryGreen, width: 2),
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
                      prefixIcon: const Icon(Icons.phone_outlined, color: primaryGreen),
                      hintText: "+94771234567",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: primaryGreen, width: 2),
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
                                      final newPhone = phoneController.text.trim();
                                      final oldPhone = currentUser?.phone?.trim() ?? '';
                                      final isPhoneVerificationNeeded = newPhone.isNotEmpty &&
                                          (newPhone != oldPhone || !(currentUser?.isPhoneVerified ?? false));

                                      await authController.updateProfile(
                                        name: nameController.text.trim(),
                                        phone: newPhone,
                                      );

                                      if (context.mounted) {
                                        if (isPhoneVerificationNeeded) {
                                          final updatedUser = authController.currentUser;
                                          if (updatedUser != null) {
                                            final response = await authController.requestPhoneOtp(
                                              (updatedUser.name ?? 'Customer').trim().isNotEmpty
                                                  ? updatedUser.name!.trim()
                                                  : 'Customer',
                                              updatedUser.phone!,
                                              updatedUser.role,
                                            );
                                            final verificationPhone = response['data']?['phone']?.toString() ?? updatedUser.phone!;
                                            
                                            if (context.mounted) {
                                              final navigator = Navigator.of(context);
                                              navigator.pop(); // Close bottom sheet
                                              navigator.push(
                                                MaterialPageRoute(
                                                  builder: (_) => OTPVerificationScreen(
                                                    verificationTarget: verificationPhone,
                                                    phoneNumber: verificationPhone,
                                                    isFromProfile: true,
                                                  ),
                                                ),
                                              );
                                            }
                                          }
                                        } else {
                                          Navigator.pop(context);
                                          ScaffoldMessenger.of(context).showSnackBar(
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
                                        ScaffoldMessenger.of(context).showSnackBar(
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

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<AppUser?>(
      valueListenable: authController.authStateNotifier,
      builder: (context, currentUser, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF6F8F9),
          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: primaryGreen),
              onPressed: () => Navigator.pop(context),
            ),
            title: const Text(
              "Profile",
              style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold),
            ),
            centerTitle: true,
          ),
          body: SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20),
                _buildProfileHeader(context),
                const SizedBox(height: 30),
                _buildSettingsList(context),
                const SizedBox(height: 20),
                _buildSupportSection(context),
                const SizedBox(height: 30),
                _buildLogoutButton(context),
                const SizedBox(height: 20),
                const Text(
                  "Version 2.4.1 • SkilledLK Platform",
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    final currentUser = authController.currentUser;
    final displayName = currentUser?.name?.trim();
    final displayEmail = currentUser?.email?.trim();
    final isPhoneVerified = currentUser?.isPhoneVerified ?? false;

    return Column(
      children: [
        Stack(
          children: [
            const CircleAvatar(
              radius: 55,
              backgroundColor: primaryGreen,
              child: CircleAvatar(
                radius: 52,
                child: Icon(Icons.person, size: 48, color: primaryGreen),
              ),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: GestureDetector(
                onTap: () => _showEditProfileBottomSheet(context),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: primaryGreen,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.edit_outlined,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          displayName != null && displayName.isNotEmpty
              ? displayName
              : 'Profile',
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          displayEmail != null && displayEmail.isNotEmpty
              ? displayEmail
              : 'Signed in user',
          style: const TextStyle(color: Colors.grey, fontSize: 13),
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isPhoneVerified
                ? Colors.green.shade50
                : Colors.orange.shade50,
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text(
            isPhoneVerified ? 'Phone verified' : 'Phone verification required',
            style: TextStyle(
              color: isPhoneVerified
                  ? Colors.green.shade800
                  : Colors.orange.shade800,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
        ),
        if (!isPhoneVerified) ...[
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () => _startPhoneVerification(context),
            icon: const Icon(Icons.verified_outlined, size: 18),
            label: const Text('Verify phone'),
            style: OutlinedButton.styleFrom(
              foregroundColor: primaryGreen,
              side: const BorderSide(color: primaryGreen),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildSettingsList(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          _settingTile(
            context,
            Icons.calendar_today_outlined,
            "My Bookings",
            Colors.green.shade50,
            Colors.green,
            onTap: () => Navigator.pushNamed(context, '/my-bookings'),
          ),
          _settingTile(
            context,
            Icons.account_balance_wallet_outlined,
            "Payment Methods",
            Colors.teal.shade50,
            Colors.teal,
            subtitle: "Manage saved cards",
            onTap: () => Navigator.pushNamed(context, '/payment-methods'),
          ),
          _settingTile(
            context,
            Icons.bookmark_border,
            "Saved Addresses",
            Colors.blue.shade50,
            Colors.blue,
            onTap: () => Navigator.pushNamed(context, '/saved-addresses'),
          ),
          _settingTile(
            context,
            Icons.notifications_none,
            "Notifications",
            Colors.orange.shade50,
            Colors.orange,
            isSwitch: true,
          ),
          _settingTile(
            context,
            Icons.language,
            "Language",
            Colors.purple.shade50,
            Colors.purple,
            subtitle: "English",
            isLast: true,
            onTap: () => Navigator.pushNamed(context, '/language-settings'),
          ),
        ],
      ),
    );
  }

  Widget _buildSupportSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(left: 30, bottom: 10, top: 10),
          child: Text(
            "SUPPORT",
            style: TextStyle(
              color: Colors.grey,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              _supportTile(
                context,
                "Help Center",
                onTap: () => Navigator.pushNamed(context, '/help-center'),
              ),
              _supportTile(
                context,
                "Contact Support",
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Connecting to support agent..."),
                    ),
                  );
                },
              ),
              _supportTile(
                context,
                "Terms & Privacy Policy",
                isLast: true,
                onTap: () => Navigator.pushNamed(context, '/privacy-policy'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _settingTile(
    BuildContext context,
    IconData icon,
    String title,
    Color bg,
    Color iconColor, {
    String? subtitle,
    bool isSwitch = false,
    bool isLast = false,
    VoidCallback? onTap,
  }) {
    return Column(
      children: [
        ListTile(
          onTap:
              onTap ??
              () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("$title settings coming soon!")),
                );
              },
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor),
          ),
          title: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: subtitle != null ? Text(subtitle) : null,
          trailing: isSwitch
              ? Switch(
                  value: true,
                  onChanged: (v) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Notification toggle coming soon!"),
                      ),
                    );
                  },
                  activeThumbColor: primaryGreen,
                )
              : const Icon(Icons.chevron_right, color: Colors.grey),
        ),
        if (!isLast) const Divider(height: 1, indent: 70),
      ],
    );
  }

  Widget _supportTile(
    BuildContext context,
    String title, {
    bool isLast = false,
    VoidCallback? onTap,
  }) {
    return Column(
      children: [
        ListTile(
          onTap:
              onTap ??
              () {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(SnackBar(content: Text("$title coming soon!")));
              },
          title: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        ),
        if (!isLast) const Divider(height: 1, indent: 20),
      ],
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFFFE9E9),
          foregroundColor: Colors.red,
          elevation: 0,
          minimumSize: const Size(double.infinity, 55),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
        onPressed: () =>
            authController.logOut(), // Clears session and returns to onboarding
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout_rounded),
            SizedBox(width: 10),
            Text(
              "Logout",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}

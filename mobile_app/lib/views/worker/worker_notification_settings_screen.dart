import 'package:flutter/material.dart';

class WorkerNotificationSettingsScreen extends StatefulWidget {
  const WorkerNotificationSettingsScreen({super.key});

  @override
  State<WorkerNotificationSettingsScreen> createState() => _WorkerNotificationSettingsScreenState();
}

class _WorkerNotificationSettingsScreenState extends State<WorkerNotificationSettingsScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  static const Color scaffoldBg = Color(0xFFF8FAFC);
  static const Color accentBlue = Color(0xFF1E293B);

  bool _pushNotifications = true;
  bool _emailNotifications = true;
  bool _jobAlerts = true;
  bool _paymentAlerts = true;
  bool _promotions = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: scaffoldBg,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Notification Settings",
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 20),
        children: [
          _buildSectionHeader("COMMUNICATION"),
          _buildToggleTile(
            "Push Notifications",
            "Get instant alerts on your phone",
            _pushNotifications,
            (v) => setState(() => _pushNotifications = v),
          ),
          _buildToggleTile(
            "Email Notifications",
            "Receive updates via email",
            _emailNotifications,
            (v) => setState(() => _emailNotifications = v),
          ),
          const SizedBox(height: 20),
          _buildSectionHeader("ALERTS & UPDATES"),
          _buildToggleTile(
            "New Job Alerts",
            "Notify when new jobs match your skills",
            _jobAlerts,
            (v) => setState(() => _jobAlerts = v),
          ),
          _buildToggleTile(
            "Payment Updates",
            "Status of your withdrawals and earnings",
            _paymentAlerts,
            (v) => setState(() => _paymentAlerts = v),
          ),
          _buildToggleTile(
            "Promotions & Offers",
            "Exclusive deals and platform updates",
            _promotions,
            (v) => setState(() => _promotions = v),
          ),
          const SizedBox(height: 40),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Settings saved successfully!"), backgroundColor: primaryGreen),
                );
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryGreen,
                minimumSize: const Size(double.infinity, 55),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                elevation: 0,
              ),
              child: const Text(
                "Save Preferences",
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildToggleTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      child: SwitchListTile(
        value: value,
        onChanged: onChanged,
        activeThumbColor: primaryGreen,
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: accentBlue),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: Colors.grey, fontSize: 13),
        ),
      ),
    );
  }
}

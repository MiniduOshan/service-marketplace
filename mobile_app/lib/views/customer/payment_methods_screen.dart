import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';

class PaymentMethodsScreen extends StatelessWidget {
  const PaymentMethodsScreen({super.key});

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Payment Methods", 
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Your Saved Cards", 
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
            const SizedBox(height: 15),
            _buildCreditCard(
              "Visa", 
              "•••• •••• •••• 1234", 
              "08/26", 
              [const Color(0xFF1E293B), const Color(0xFF334155)]
            ),
            const SizedBox(height: 15),
            _buildCreditCard(
              "Mastercard", 
              "•••• •••• •••• 5678", 
              "11/25", 
              [const Color(0xFF006D44), const Color(0xFF008955)]
            ),
            const SizedBox(height: 30),
            _buildAddMethodButton(context),
            const SizedBox(height: 40),
            const Text("Other Payment Methods", 
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
            const SizedBox(height: 15),
            _buildOtherMethod("Pay with Cash", Icons.money),
            _buildOtherMethod("PayPal", Icons.payment),
            _buildOtherMethod("Google Pay", Icons.account_balance_wallet_outlined),
          ],
        ),
      ),
    );
  }

  Widget _buildCreditCard(String type, String number, String expiry, List<Color> colors) {
    final cardholderName = authController.currentUser?.name?.trim();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: colors, begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: colors[0].withValues(alpha: 0.3), blurRadius: 15, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(type, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              const Icon(Icons.contactless, color: Colors.white, size: 24),
            ],
          ),
          const SizedBox(height: 30),
          Text(number, style: const TextStyle(color: Colors.white, fontSize: 20, letterSpacing: 2)),
          const SizedBox(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                cardholderName != null && cardholderName.isNotEmpty
                    ? cardholderName.toUpperCase()
                    : 'CARD HOLDER',
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("EXPIRES", style: TextStyle(color: Colors.white70, fontSize: 8)),
                  Text(expiry, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAddMethodButton(BuildContext context) {
    return OutlinedButton.icon(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(double.infinity, 55),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        side: const BorderSide(color: primaryGreen, width: 1.5),
      ),
      onPressed: () {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Add card functionality coming soon!")));
      },
      icon: const Icon(Icons.add, color: primaryGreen),
      label: const Text("Add New Card", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildOtherMethod(String title, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      child: ListTile(
        leading: Icon(icon, color: primaryGreen),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: () {},
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';

class PaymentMethodsScreen extends StatefulWidget {
  const PaymentMethodsScreen({super.key});

  @override
  State<PaymentMethodsScreen> createState() => _PaymentMethodsScreenState();
}

class _PaymentMethodsScreenState extends State<PaymentMethodsScreen> {
  static const Color primaryGreen = Color(0xFF006D44);

  final List<Map<String, String>> savedCards = [];

  void _showAddCardDialog(BuildContext context) {
    String cardType = 'Visa';
    final numberController = TextEditingController();
    final expiryController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text("Add New Card", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      initialValue: cardType,
                      decoration: const InputDecoration(labelText: 'Card Type'),
                      items: ['Visa', 'Mastercard', 'Amex']
                          .map((type) => DropdownMenuItem(value: type, child: Text(type)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() => cardType = val);
                        }
                      },
                    ),
                    const SizedBox(height: 15),
                    TextField(
                      controller: numberController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Card Number',
                        hintText: '1234 5678 1234 5678',
                      ),
                      maxLength: 19,
                    ),
                    const SizedBox(height: 15),
                    TextField(
                      controller: expiryController,
                      keyboardType: TextInputType.datetime,
                      decoration: const InputDecoration(
                        labelText: 'Expiry Date',
                        hintText: 'MM/YY',
                      ),
                      maxLength: 5,
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Cancel", style: TextStyle(color: Colors.grey)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
                  onPressed: () {
                    final num = numberController.text.trim();
                    final exp = expiryController.text.trim();
                    if (num.isEmpty || exp.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Please fill all fields")),
                      );
                      return;
                    }
                    Navigator.pop(context, {
                      'type': cardType,
                      'number': num,
                      'expiry': exp,
                    });
                  },
                  child: const Text("Add", style: TextStyle(color: Colors.white)),
                ),
              ],
            );
          },
        );
      },
    ).then((result) {
      if (result != null && result is Map<String, String>) {
        setState(() {
          savedCards.add(result);
        });
      }
    });
  }

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
            if (savedCards.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Column(
                    children: [
                      Icon(Icons.credit_card_off_outlined, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        "No saved cards",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.grey),
                      ),
                      SizedBox(height: 8),
                      Text(
                        "Add a credit or debit card for seamless checkout.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              )
            else
              ...savedCards.map((card) {
                final colors = card['type'] == 'Mastercard'
                    ? [const Color(0xFF006D44), const Color(0xFF008955)]
                    : card['type'] == 'Amex'
                        ? [const Color(0xFF1E3A8A), const Color(0xFF3B82F6)]
                        : [const Color(0xFF1E293B), const Color(0xFF334155)];
                final lastFour = card['number']!.replaceAll(RegExp(r'\s+'), '');
                final displayNum = "•••• •••• •••• ${lastFour.length >= 4 ? lastFour.substring(lastFour.length - 4) : lastFour}";
                return Padding(
                  padding: const EdgeInsets.only(bottom: 15),
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildCreditCard(card['type']!, displayNum, card['expiry']!, colors),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, color: Colors.red),
                        onPressed: () {
                          setState(() {
                            savedCards.remove(card);
                          });
                        },
                      ),
                    ],
                  ),
                );
              }),
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
      onPressed: () => _showAddCardDialog(context),
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

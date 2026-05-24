import 'package:flutter/material.dart';

class SavedAddressesScreen extends StatelessWidget {
  const SavedAddressesScreen({super.key});

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
        title: const Text("Saved Addresses", 
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _buildAddressTile(
            "Home", 
            "123/A, Green Path, Maharagama, Colombo", 
            Icons.home_outlined,
            true
          ),
          const SizedBox(height: 15),
          _buildAddressTile(
            "Office", 
            "Level 15, World Trade Center, Colombo 01", 
            Icons.work_outline,
            false
          ),
          const SizedBox(height: 15),
          _buildAddressTile(
            "Parent's House", 
            "45, Temple Road, Kalutara", 
            Icons.favorite_border,
            false
          ),
          const SizedBox(height: 30),
          _buildAddAddressButton(context),
        ],
      ),
    );
  }

  Widget _buildAddressTile(String label, String address, IconData icon, bool isDefault) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: Colors.blue),
        ),
        title: Row(
          children: [
            Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            if (isDefault) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: primaryGreen.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                child: const Text("DEFAULT", style: TextStyle(color: primaryGreen, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ]
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(address, style: const TextStyle(color: Colors.grey, fontSize: 13)),
        ),
        trailing: IconButton(icon: const Icon(Icons.more_vert, color: Colors.grey), onPressed: () {}),
      ),
    );
  }

  Widget _buildAddAddressButton(BuildContext context) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryGreen,
        minimumSize: const Size(double.infinity, 55),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        elevation: 0,
      ),
      onPressed: () {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Add address coming soon!")));
      },
      icon: const Icon(Icons.add, color: Colors.white),
      label: const Text("Add New Address", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
    );
  }
}

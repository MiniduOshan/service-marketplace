import 'package:flutter/material.dart';

class SavedAddressesScreen extends StatefulWidget {
  const SavedAddressesScreen({super.key});

  @override
  State<SavedAddressesScreen> createState() => _SavedAddressesScreenState();
}

class _SavedAddressesScreenState extends State<SavedAddressesScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textLight = Color(0xFF64748B);

  final List<Map<String, dynamic>> savedAddresses = [];

  void _showAddAddressDialog(BuildContext context) {
    String labelType = 'Home';
    final addressController = TextEditingController();
    bool isDefault = false;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text("Add New Address", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      initialValue: labelType,
                      decoration: const InputDecoration(labelText: 'Address Type'),
                      items: ['Home', 'Office', 'Parent\'s House', 'Other']
                          .map((type) => DropdownMenuItem(value: type, child: Text(type)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() => labelType = val);
                        }
                      },
                    ),
                    const SizedBox(height: 15),
                    TextField(
                      controller: addressController,
                      maxLines: 2,
                      decoration: const InputDecoration(
                        labelText: 'Full Address',
                        hintText: '123/A, Green Path, Maharagama, Colombo',
                      ),
                    ),
                    const SizedBox(height: 15),
                    SwitchListTile(
                      title: const Text("Set as Default"),
                      value: isDefault,
                      activeThumbColor: primaryGreen,
                      onChanged: (val) {
                        setDialogState(() => isDefault = val);
                      },
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
                    final addr = addressController.text.trim();
                    if (addr.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Please enter the address")),
                      );
                      return;
                    }
                    Navigator.pop(context, {
                      'label': labelType,
                      'address': addr,
                      'isDefault': isDefault,
                    });
                  },
                  child: const Text("Save", style: TextStyle(color: Colors.white)),
                ),
              ],
            );
          },
        );
      },
    ).then((result) {
      if (result != null && result is Map<String, dynamic>) {
        setState(() {
          if (result['isDefault'] == true) {
            for (var addr in savedAddresses) {
              addr['isDefault'] = false;
            }
          } else if (savedAddresses.isEmpty) {
            result['isDefault'] = true;
          }
          savedAddresses.add(result);
        });
      }
    });
  }

  IconData _getIconForLabel(String label) {
    switch (label) {
      case 'Home':
        return Icons.home_outlined;
      case 'Office':
        return Icons.work_outline;
      case 'Parent\'s House':
        return Icons.favorite_border;
      default:
        return Icons.location_on_outlined;
    }
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
        title: const Text("Saved Addresses", 
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          if (savedAddresses.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.location_off_outlined, size: 80, color: Colors.grey.shade400),
                    const SizedBox(height: 20),
                    const Text(
                      "No Saved Addresses",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textDark),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Add your home or work address for quicker bookings and scheduling.",
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14, color: textLight),
                    ),
                  ],
                ),
              ),
            )
          else
            ...savedAddresses.map((addr) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 15),
                child: _buildAddressTile(
                  addr['label'], 
                  addr['address'], 
                  _getIconForLabel(addr['label']),
                  addr['isDefault'],
                  onDelete: () {
                    setState(() {
                      savedAddresses.remove(addr);
                      if (addr['isDefault'] == true && savedAddresses.isNotEmpty) {
                        savedAddresses.first['isDefault'] = true;
                      }
                    });
                  }
                ),
              );
            }),
          const SizedBox(height: 15),
          _buildAddAddressButton(context),
        ],
      ),
    );
  }

  Widget _buildAddressTile(String label, String address, IconData icon, bool isDefault, {required VoidCallback onDelete}) {
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
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline, color: Colors.red), 
          onPressed: onDelete,
        ),
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
      onPressed: () => _showAddAddressDialog(context),
      icon: const Icon(Icons.add, color: Colors.white),
      label: const Text("Add New Address", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
    );
  }
}

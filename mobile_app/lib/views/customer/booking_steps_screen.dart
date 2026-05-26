import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import '../../services/api_client.dart';

class BookingStepsScreen extends StatefulWidget {
  final String? servicePackageId;
  final String workerName;
  final String serviceTitle;
  final String priceLabel;

  const BookingStepsScreen({
    super.key,
    this.servicePackageId,
    this.workerName = 'Professional',
    this.serviceTitle = 'Service Booking',
    this.priceLabel = 'LKR 0',
  });

  @override
  State<BookingStepsScreen> createState() => _BookingStepsScreenState();
}

class _BookingStepsScreenState extends State<BookingStepsScreen> {
  int currentStep = 2; // Starting at Step 2 based on your "Book Service" image
  static const Color primaryGreen = Color(0xFF006D44);
  late final TextEditingController _dateController;
  late final TextEditingController _addressController;
  late final TextEditingController _notesController;
  String? _servicePackageId;
  bool _isSubmitting = false;
  bool _isLoadingService = true;
  String? _errorMessage;
  String _selectedPaymentMethod = "Credit / Debit Card";

  @override
  void initState() {
    super.initState();
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    final dateStr = "${tomorrow.day} ${months[tomorrow.month - 1]} ${tomorrow.year}";
    _dateController = TextEditingController(text: dateStr);
    _addressController = TextEditingController(text: '');
    _notesController = TextEditingController();
    _servicePackageId = widget.servicePackageId;
    _resolveDefaultService();
  }

  @override
  void dispose() {
    _dateController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _resolveDefaultService() async {
    if (_servicePackageId != null) {
      setState(() => _isLoadingService = false);
      return;
    }

    try {
      final services = await ApiClient.instance.getServices();
      if (!mounted) return;

      setState(() {
        _servicePackageId = services.isNotEmpty ? services.first['id'].toString() : null;
        _isLoadingService = false;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
        _isLoadingService = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: primaryGreen),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        title: Column(
          children: [
            Text(_getStepTitle(), style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
            Text("STEP $currentStep OF 4", style: const TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        ),
      ),
      body: Column(
        children: [
          _buildStepIndicator(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: _isLoadingService ? const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator(color: primaryGreen))) : _buildCurrentStepView(),
            ),
          ),
          _buildBottomActions(),
        ],
      ),
    );
  }

  String _getStepTitle() {
    switch (currentStep) {
      case 2: return "Book Service";
      case 3: return "Review Booking";
      case 4: return "Payment";
      default: return "Booking";
    }
  }

  Widget _buildStepIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 40),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _stepCircle(1, "Worker", isDone: true),
          _stepLine(true),
          _stepCircle(2, "Details", isActive: currentStep == 2, isDone: currentStep > 2),
          _stepLine(currentStep > 2),
          _stepCircle(3, "Confirm", isActive: currentStep == 3, isDone: currentStep > 3),
          _stepLine(currentStep > 3),
          _stepCircle(4, "Pay", isActive: currentStep == 4),
        ],
      ),
    );
  }

  Widget _stepCircle(int step, String label, {bool isActive = false, bool isDone = false}) {
    return Column(
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isDone ? primaryGreen : Colors.white,
            border: Border.all(color: (isActive || isDone) ? primaryGreen : Colors.grey.shade300, width: 2),
          ),
          child: Center(
            child: isDone 
              ? const Icon(Icons.check, color: Colors.white, size: 16) 
              : Text("$step", style: TextStyle(color: isActive ? primaryGreen : Colors.grey, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 10, color: (isActive || isDone) ? primaryGreen : Colors.grey, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _stepLine(bool isDone) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(bottom: 15),
        height: 2,
        color: isDone ? primaryGreen : Colors.grey.shade300,
      ),
    );
  }

  Widget _buildCurrentStepView() {
    if (_errorMessage != null) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
      );
    }

    if (currentStep == 2) return _buildDetailsStep();
    if (currentStep == 3) return _buildReviewStep();
    return _buildPaymentStep();
  }

  // Implementation of Step 2: Book Service (Details)
  Widget _buildDetailsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildWorkerMiniCard(),
        const SizedBox(height: 24),
        const Text("PREFERRED DATE", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 8),
        _buildInputDecoration(controller: _dateController, icon: Icons.calendar_today_outlined),
        const SizedBox(height: 20),
        const Text("FULL ADDRESS", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 8),
        _buildInputDecoration(controller: _addressController, icon: Icons.location_on_outlined),
        const SizedBox(height: 20),
        const Text("JOB DESCRIPTION", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 8),
        TextField(
          controller: _notesController,
          maxLines: 4,
          decoration: InputDecoration(border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        ),
      ],
    );
  }

  // Implementation of Step 3: Review Booking
  Widget _buildReviewStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Check your booking details", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 20),
        _buildReviewCard(Icons.calendar_month, "Schedule", "${_dateController.text}\n9:00 AM - 12:00 PM"),
        _buildReviewCard(Icons.location_on, "Location", _addressController.text),
        _buildPriceSummary(),
      ],
    );
  }

  // Implementation of Step 4: Payment
  Widget _buildPaymentStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildPriceSummaryBox(),
        const SizedBox(height: 24),
        const Text("Payment Method", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        _paymentOption("Credit / Debit Card", Icons.credit_card, _selectedPaymentMethod == "Credit / Debit Card"),
        _paymentOption("Mobile Wallet", Icons.wallet, _selectedPaymentMethod == "Mobile Wallet"),
        _paymentOption("Cash to worker", Icons.payments, _selectedPaymentMethod == "Cash to worker"),
      ],
    );
  }

  Widget _buildWorkerMiniCard() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: CircleAvatar(backgroundColor: Colors.grey.shade200, child: const Icon(Icons.person)),
        title: Text(widget.workerName, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text("${widget.serviceTitle} • ${widget.priceLabel}", style: const TextStyle(color: primaryGreen)),
        trailing: const Text("Change", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildInputDecoration({required TextEditingController controller, required IconData icon}) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.grey),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildReviewCard(IconData icon, String title, String content) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(12)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: primaryGreen),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 4),
              Text(content, style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildPriceSummary() {
    final cleanPrice = widget.priceLabel.replaceAll(RegExp(r'[^\d]'), '');
    final double serviceFee = double.tryParse(cleanPrice) ?? 0.0;
    final double platformFee = serviceFee > 0 ? 250.0 : 0.0;
    final double totalAmount = serviceFee + platformFee;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFFE9F1EE), borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text("Service fee"), Text("LKR ${serviceFee.toStringAsFixed(0)}")]),
          const SizedBox(height: 8),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text("Platform fee"), Text("LKR ${platformFee.toStringAsFixed(0)}")]),
          const Divider(height: 32),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text("Total Amount", style: TextStyle(fontWeight: FontWeight.bold)),
            Text("LKR ${totalAmount.toStringAsFixed(0)}", style: const TextStyle(fontWeight: FontWeight.bold, color: primaryGreen, fontSize: 18)),
          ]),
        ],
      ),
    );
  }

  Widget _buildPriceSummaryBox() {
    final cleanPrice = widget.priceLabel.replaceAll(RegExp(r'[^\d]'), '');
    final double serviceFee = double.tryParse(cleanPrice) ?? 0.0;
    final double platformFee = serviceFee > 0 ? 250.0 : 0.0;
    final double totalAmount = serviceFee + platformFee;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFFE9F1EE), borderRadius: BorderRadius.circular(12)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text("Total Amount", style: TextStyle(fontWeight: FontWeight.bold)),
          Text("LKR ${totalAmount.toStringAsFixed(0)}", style: const TextStyle(fontWeight: FontWeight.bold, color: primaryGreen, fontSize: 18)),
        ],
      ),
    );
  }

  Widget _paymentOption(String title, IconData icon, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        border: Border.all(color: isSelected ? primaryGreen : Colors.grey.shade200),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        onTap: () {
          setState(() {
            _selectedPaymentMethod = title;
          });
        },
        leading: Icon(icon, color: isSelected ? primaryGreen : Colors.grey),
        title: Text(title, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
        trailing: Icon(
          isSelected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
          color: isSelected ? primaryGreen : Colors.grey,
        ),
      ),
    );
  }

  Widget _buildBottomActions() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0xFFF1F4F9)))),
      child: Row(
        children: [
          TextButton(onPressed: () { if(currentStep > 2) setState(() => currentStep--); }, child: const Text("Back", style: TextStyle(color: Colors.grey))),
          const Spacer(),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, minimumSize: const Size(200, 50), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            onPressed: _isSubmitting ? null : () async {
              if (currentStep < 4) {
                setState(() => currentStep++);
                return;
              }

              if (_servicePackageId == null) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("No service selected yet.")));
                return;
              }

              setState(() => _isSubmitting = true);

              try {
                await ApiClient.instance.createBooking(
                  servicePackageId: _servicePackageId!,
                  scheduledAt: DateTime.now().add(const Duration(days: 1)).toIso8601String(),
                  address: _addressController.text,
                  notes: _notesController.text.isEmpty ? null : _notesController.text,
                  token: authController.sessionToken,
                );

                if (!mounted) return;
                setState(() => _isSubmitting = false);
                Navigator.pop(context);
              } catch (error) {
                if (!mounted) return;
                setState(() => _isSubmitting = false);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(error.toString().replaceFirst('Exception: ', ''))),
                );
              }
            },
            child: Text(_isSubmitting ? "Submitting..." : (currentStep == 4 ? "Confirm & Pay" : "Continue"), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
// lib/views/document_verification_screen.dart
import 'package:flutter/material.dart';
import 'worker_service_packages_screen.dart';

class DocumentVerificationScreen extends StatelessWidget {
  const DocumentVerificationScreen({super.key});
  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: primaryGreen), onPressed: () => Navigator.pop(context)),
        title: const Text("Document Verification", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          _buildProgressBar(0.75, "STEP 3 OF 4 — VERIFICATION", "75%"),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Upload your documents", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const Text("Verified workers earn 3× more bookings.", style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 24),
                  _buildAlertBanner(),
                  const SizedBox(height: 24),
                  _buildTrustScoreCard(),
                  const SizedBox(height: 32),
                  _buildUploadCard("National ID Card", "Front and back required", true),
                  const SizedBox(height: 20),
                  _buildUploadCard("Work Certificate", "Optional but recommended", false, isDropzone: true),
                  const SizedBox(height: 30),
                  _buildPortfolioSection(),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
          _buildBottomNav(context),
        ],
      ),
    );
  }

  // Reuse _buildProgressBar logic...
  Widget _buildProgressBar(double progress, String step, String percent) { /* same as above */ return const SizedBox(); }

  Widget _buildAlertBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFFFFF9EE), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFFED7AA))),
      child: const Row(
        children: [
          Icon(Icons.info_outline, color: Color(0xFFC2410C)),
          SizedBox(width: 12),
          Expanded(child: Text("Verification pending — Admin reviews within 24 hours", style: TextStyle(color: Color(0xFFC2410C), fontSize: 13))),
        ],
      ),
    );
  }

  Widget _buildTrustScoreCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: const Color(0xFFE8F6F1), borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          Row(
            children: [
              _scoreCircle(),
              const SizedBox(width: 20),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Trust Score", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  Text("Add certificate to reach 90+", style: TextStyle(color: primaryGreen, fontSize: 13)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 10,
            children: [
              _checkTag("NIC +20"),
              _checkTag("Phone +15"),
              _checkTag("Portfolio +15"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _scoreCircle() {
    return Stack(
      alignment: Alignment.center,
      children: [
        const SizedBox(width: 60, height: 60, child: CircularProgressIndicator(value: 0.72, strokeWidth: 6, color: primaryGreen, backgroundColor: Colors.white)),
        const Column(children: [Text("72", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)), Text("/100", style: TextStyle(fontSize: 10))]),
      ],
    );
  }

  Widget _checkTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.check_circle, size: 14, color: primaryGreen), const SizedBox(width: 4), Text(text, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold))]),
    );
  }

  Widget _buildUploadCard(String title, String sub, bool isUploaded, {bool isDropzone = false}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          Row(
            children: [
              Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: const Color(0xFFE8F6F1), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.badge_outlined, color: primaryGreen)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(fontWeight: FontWeight.bold)), Text(sub, style: const TextStyle(fontSize: 12, color: Colors.grey))])),
              isUploaded ? _uploadedBadge() : _uploadButton(),
            ],
          ),
          if (isUploaded) _buildIdPreview(),
          if (isDropzone) _buildDropzone(),
        ],
      ),
    );
  }

  Widget _uploadedBadge() {
    return Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: const Color(0xFFE8F6F1), borderRadius: BorderRadius.circular(8)), child: const Text("Uploaded ✓", style: TextStyle(color: primaryGreen, fontSize: 12, fontWeight: FontWeight.bold)));
  }

  Widget _uploadButton() {
    return OutlinedButton(onPressed: () {}, style: OutlinedButton.styleFrom(side: const BorderSide(color: primaryGreen), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), child: const Text("Upload", style: TextStyle(color: primaryGreen)));
  }

  Widget _buildIdPreview() {
    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Row(
        children: [
          Expanded(child: Container(height: 80, decoration: BoxDecoration(color: const Color(0xFFE9F1EE), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.check_circle, color: Colors.white))),
          const SizedBox(width: 12),
          Expanded(child: Container(height: 80, decoration: BoxDecoration(color: const Color(0xFFE9F1EE), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.check_circle, color: Colors.white))),
        ],
      ),
    );
  }

  Widget _buildDropzone() {
    return Container(
      width: double.infinity, margin: const EdgeInsets.only(top: 16), padding: const EdgeInsets.symmetric(vertical: 30),
      decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(12)),
      child: const Column(children: [Icon(Icons.cloud_upload_outlined, color: Colors.grey), Text("Drag & drop or click to upload", style: TextStyle(color: Colors.grey, fontSize: 12))]),
    );
  }

  Widget _buildPortfolioSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Portfolio Photos", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const Text("Show your past work — min 3 photos", style: TextStyle(color: Colors.grey, fontSize: 13)),
        const SizedBox(height: 16),
        Row(
          children: [
            _photoBox(), const SizedBox(width: 12), _photoBox(), const SizedBox(width: 12), _addPhotoBox(),
          ],
        ),
      ],
    );
  }

  Widget _photoBox() { return Container(width: 80, height: 80, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8))); }
  Widget _addPhotoBox() { return Container(width: 80, height: 80, decoration: BoxDecoration(border: Border.all(color: primaryGreen), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.add, color: primaryGreen)); }

  Widget _buildBottomNav(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0xFFF1F4F9)))),
      child: Row(
        children: [
          const Text("BACK", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          const Spacer(),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE8F6F1), minimumSize: const Size(180, 50), elevation: 0),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const WorkerServicePackagesScreen()),
              );
            },
            child: const Row(children: [Icon(Icons.check_circle_outline, color: primaryGreen), SizedBox(width: 8), Text("SUBMIT", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold))]),
          ),
        ],
      ),
    );
  }
}
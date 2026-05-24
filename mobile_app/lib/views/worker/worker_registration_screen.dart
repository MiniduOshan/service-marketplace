import 'package:flutter/material.dart';
import 'document_verification_screen.dart';

class WorkerRegistrationScreen extends StatefulWidget {
  final bool isEditing;
  const WorkerRegistrationScreen({super.key, this.isEditing = false});

  @override
  State<WorkerRegistrationScreen> createState() => _WorkerRegistrationScreenState();
}

class _WorkerRegistrationScreenState extends State<WorkerRegistrationScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  int experienceYears = 8;
  bool isGpsActive = true;

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
        title: const Text("Worker Registration", 
          style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          _buildProgressBar(0.25, "Step 2 of 4 — Personal Details", "25% Complete"),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Tell us about yourself", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const Text("This information will appear on your public profile.", style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 30),
                  _buildPhotoUpload(),
                  const SizedBox(height: 30),
                  _buildLabel("FULL NAME"),
                  _buildTextField("Kasun Silva"),
                  const SizedBox(height: 20),
                  _buildLabel("PHONE NUMBER"),
                  _buildPhoneField(),
                  const SizedBox(height: 20),
                  _buildLabelWithOptional("EMAIL ADDRESS", "OPTIONAL"),
                  _buildTextField("kasun.silva@email.com"),
                  const SizedBox(height: 20),
                  _buildLabel("SERVICE CATEGORY"),
                  _buildDropdown("Painter"),
                  const SizedBox(height: 20),
                  _buildLabel("YEARS OF EXPERIENCE"),
                  _buildExperiencePicker(),
                  const SizedBox(height: 20),
                  _buildLabel("BIO"),
                  _buildTextField("Briefly describe your expertise and service style...", maxLines: 4),
                  const SizedBox(height: 20),
                  _buildLabel("SKILLS"),
                  _buildSkillInput(),
                  const SizedBox(height: 30),
                  _buildLocationSection(),
                ],
              ),
            ),
          ),
          _buildBottomNav(),
        ],
      ),
    );
  }

  Widget _buildProgressBar(double progress, String step, String percent) {
    return Column(
      children: [
        LinearProgressIndicator(value: progress, backgroundColor: Colors.grey.shade100, color: primaryGreen, minHeight: 4),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(step, style: const TextStyle(fontSize: 12, color: Colors.grey)),
              Text(percent, style: const TextStyle(fontSize: 12, color: primaryGreen, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        const Divider(height: 1),
      ],
    );
  }

  Widget _buildPhotoUpload() {
    return Center(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(25),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: primaryGreen, style: BorderStyle.none, width: 1.5),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                CustomPaint(
                  size: const Size(80, 80),
                  painter: DashedCirclePainter(color: primaryGreen),
                ),
                const Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.camera_alt_outlined, color: primaryGreen, size: 24),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Text("Upload photo", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildLabelWithOptional(String label, String optional) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1D2125))),
          Text(optional, style: TextStyle(fontSize: 10, color: Colors.grey.shade400, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(text, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1D2125))),
    );
  }

  Widget _buildTextField(String hint, {int maxLines = 1, String? prefix, Widget? suffixIcon}) {
    return TextField(
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        prefixText: prefix,
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade200),
        ),
      ),
    );
  }

  Widget _buildPhoneField() {
    return Row(
      children: [
        Container(
          width: 70,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          alignment: Alignment.center,
          child: const Text("+94", style: TextStyle(color: Colors.grey)),
        ),
        const SizedBox(width: 8),
        Expanded(child: _buildTextField("77 123 4567")),
      ],
    );
  }

  Widget _buildDropdown(String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: DropdownButton<String>(
        value: value,
        isExpanded: true,
        underline: const SizedBox(),
        icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
        items: [value].map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 14, color: Color(0xFF1D2125))))).toList(),
        onChanged: (v) {},
      ),
    );
  }

  Widget _buildExperiencePicker() {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFF),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _counterButton(Icons.remove, () => setState(() => experienceYears--)),
          Expanded(child: Center(child: Text("$experienceYears", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1D2125))))),
          _counterButton(Icons.add, () => setState(() => experienceYears++)),
        ],
      ),
    );
  }

  Widget _counterButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4, offset: const Offset(0, 2)),
          ],
        ),
        child: Icon(icon, color: primaryGreen, size: 20),
      ),
    );
  }

  Widget _buildSkillInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _skillChip("Interior Painting"),
            _skillChip("Exterior"),
            _skillChip("Waterproofing"),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildTextField("Add a skill..."),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: primaryGreen,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.add, color: Colors.white),
            ),
          ],
        ),
      ],
    );
  }

  Widget _skillChip(String label) {
    return Chip(
      label: Text(label, style: const TextStyle(color: primaryGreen, fontSize: 12)),
      backgroundColor: const Color(0xFFE8F6F1),
      onDeleted: () {},
      deleteIcon: const Icon(Icons.close, size: 14, color: primaryGreen),
      side: BorderSide.none,
      shape: StadiumBorder(),
    );
  }

  Widget _buildLocationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Service Location", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            Row(children: [
              Transform.scale(
                scale: 0.8,
                child: Switch(
                  value: isGpsActive, 
                  onChanged: (v) => setState(() => isGpsActive = v), 
                  activeThumbColor: Colors.white,
                  activeTrackColor: primaryGreen,
                ),
              ),
              const Text("GPS Active", style: TextStyle(fontSize: 12, color: primaryGreen, fontWeight: FontWeight.bold)),
            ]),
          ],
        ),
        const SizedBox(height: 8),
        _buildTextField("Colombo", suffixIcon: const Icon(Icons.location_on_outlined, color: Colors.grey, size: 20)),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ["Colombo 01-15", "Nugegoda", "Dehiwala", "Battaramulla"]
              .map((e) => _locationChip(e, e == "Colombo 01-15"))
              .toList(),
        ),
      ],
    );
  }

  Widget _locationChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isSelected ? primaryGreen : Colors.grey.shade200),
      ),
      child: Text(
        label, 
        style: TextStyle(
          color: isSelected ? primaryGreen : Colors.grey.shade600,
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0xFFF1F4F9)))),
      child: Row(
        children: [
          TextButton.icon(
            onPressed: () => Navigator.pop(context), 
            icon: const Icon(Icons.chevron_left, color: Colors.grey),
            label: const Text("Back", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          ),
          const Spacer(),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, minimumSize: const Size(180, 50), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            onPressed: () {
              if (widget.isEditing) {
                // Save logic here
                Navigator.pop(context);
              } else {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const DocumentVerificationScreen()));
              }
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(widget.isEditing ? "Save Changes" : "Next: Documents", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                Icon(widget.isEditing ? Icons.check : Icons.chevron_right, color: Colors.white, size: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class DashedCirclePainter extends CustomPainter {
  final Color color;
  DashedCirclePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    double dashWidth = 5, dashSpace = 5, startRadius = size.width / 2;
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    var angle = 0.0;
    while (angle < 360) {
      canvas.drawArc(
        Rect.fromCircle(center: Offset(size.width / 2, size.height / 2), radius: startRadius),
        angle * 0.0174533,
        dashWidth * 0.0174533,
        false,
        paint,
      );
      angle += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
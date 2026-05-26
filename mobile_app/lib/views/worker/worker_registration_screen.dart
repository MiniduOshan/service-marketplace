import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import 'worker_service_packages_screen.dart';
import '../onboarding/welcome_screen.dart';

class WorkerRegistrationScreen extends StatefulWidget {
  final bool isEditing;
  const WorkerRegistrationScreen({super.key, this.isEditing = false});

  @override
  State<WorkerRegistrationScreen> createState() =>
      _WorkerRegistrationScreenState();
}

class _WorkerRegistrationScreenState extends State<WorkerRegistrationScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  int experienceYears = 1;
  String selectedCategory = 'Painting';
  String selectedCity = 'Colombo';
  final TextEditingController _skillController = TextEditingController();
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;
  late TextEditingController _bioController;

  final List<String> _skills = [];

  @override
  void initState() {
    super.initState();
    final currentUser = authController.currentUser;
    _nameController = TextEditingController(text: currentUser?.name ?? '');
    String displayPhone = currentUser?.phone ?? '';
    if (displayPhone.startsWith('+94')) {
      displayPhone = displayPhone.substring(3);
    }
    _phoneController = TextEditingController(text: displayPhone);
    _emailController = TextEditingController(text: currentUser?.email ?? '');
    _bioController = TextEditingController(text: '');
  }

  static const List<String> categoryOptions = [
    'Painting',
    'Electrical',
    'Plumbing',
    'AC Repair',
    'Carpentry',
    'Cleaning',
    'Masonry',
    'Gardening',
    'Appliance Repair',
    'Pest Control',
    'Auto Repair',
    'Car Detailing',
    'Tech Support',
    'Graphic Design',
    'Photography',
    'Catering',
    'Personal Training',
    'Academic Tutoring',
    'Moving & Packing',
    'Translation',
  ];

  static const List<String> cityOptions = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
  ];

  @override
  void dispose() {
    _skillController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _bioController.dispose();
    super.dispose();
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
          onPressed: _handleBack,
        ),
        title: const Text(
          "Worker Registration",
          style: TextStyle(
            color: primaryGreen,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          _buildProgressBar(
            0.25,
            "Step 2 of 4 — Personal Details",
            "25% Complete",
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Tell us about yourself",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const Text(
                    "This information will appear on your public profile.",
                    style: TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 30),
                  _buildPhotoUpload(),
                  const SizedBox(height: 30),
                  _buildLabel("FULL NAME"),
                  _buildTextField(
                    "Your Full Name",
                    controller: _nameController,
                  ),
                  const SizedBox(height: 20),
                  _buildLabel("PHONE NUMBER"),
                  _buildPhoneField(),
                  const SizedBox(height: 20),
                  _buildLabelWithOptional("EMAIL ADDRESS", "OPTIONAL"),
                  _buildTextField(
                    "name@example.com",
                    controller: _emailController,
                  ),
                  const SizedBox(height: 20),
                  _buildLabel("SERVICE CATEGORY"),
                  _buildDropdown(
                    value: selectedCategory,
                    options: categoryOptions,
                    onChanged: (value) {
                      if (value == null) return;
                      setState(() => selectedCategory = value);
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildLabel("YEARS OF EXPERIENCE"),
                  _buildExperiencePicker(),
                  const SizedBox(height: 20),
                  _buildLabel("BIO"),
                  _buildTextField(
                    "Briefly describe your expertise and service style...",
                    maxLines: 4,
                    controller: _bioController,
                  ),
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

  void _handleBack() {
    final navigator = Navigator.of(context);
    if (navigator.canPop()) {
      navigator.pop();
      return;
    }

    navigator.pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const WelcomeScreen()),
      (route) => false,
    );
  }

  Widget _buildProgressBar(double progress, String step, String percent) {
    return Column(
      children: [
        LinearProgressIndicator(
          value: progress,
          backgroundColor: Colors.grey.shade100,
          color: primaryGreen,
          minHeight: 4,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                step,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
              Text(
                percent,
                style: const TextStyle(
                  fontSize: 12,
                  color: primaryGreen,
                  fontWeight: FontWeight.bold,
                ),
              ),
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
              border: Border.all(
                color: primaryGreen,
                style: BorderStyle.none,
                width: 1.5,
              ),
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
                    Icon(
                      Icons.camera_alt_outlined,
                      color: primaryGreen,
                      size: 24,
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "Upload photo",
            style: TextStyle(
              color: primaryGreen,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
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
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1D2125),
            ),
          ),
          Text(
            optional,
            style: TextStyle(
              fontSize: 10,
              color: Colors.grey.shade400,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1D2125),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String hint, {
    int maxLines = 1,
    String? prefix,
    Widget? suffixIcon,
    TextEditingController? controller,
    ValueChanged<String>? onSubmitted,
  }) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      onSubmitted: onSubmitted,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        prefixText: prefix,
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
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
        Expanded(
          child: _buildTextField("771234567", controller: _phoneController),
        ),
      ],
    );
  }

  Widget _buildDropdown({
    required String value,
    required List<String> options,
    required ValueChanged<String?> onChanged,
  }) {
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
        items: options
            .map(
              (e) => DropdownMenuItem(
                value: e,
                child: Text(
                  e,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF1D2125),
                  ),
                ),
              ),
            )
            .toList(),
        onChanged: onChanged,
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
          Expanded(
            child: Center(
              child: Text(
                "$experienceYears",
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1D2125),
                ),
              ),
            ),
          ),
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
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(icon, color: primaryGreen, size: 20),
      ),
    );
  }

  Widget _buildSkillInput() {
    void addSkill() {
      final skill = _skillController.text.trim();
      if (skill.isEmpty) return;

      setState(() {
        if (!_skills.contains(skill)) {
          _skills.add(skill);
        }
        _skillController.clear();
      });
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ..._skills.map(
              (skill) => _skillChip(
                skill,
                onDeleted: () {
                  setState(() => _skills.remove(skill));
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildTextField(
                "Add a skill...",
                controller: _skillController,
                onSubmitted: (_) => addSkill(),
              ),
            ),
            const SizedBox(width: 12),
            InkWell(
              onTap: addSkill,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: primaryGreen,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.add, color: Colors.white),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _skillChip(String label, {VoidCallback? onDeleted}) {
    return Chip(
      label: Text(
        label,
        style: const TextStyle(color: primaryGreen, fontSize: 12),
      ),
      backgroundColor: const Color(0xFFE8F6F1),
      onDeleted: onDeleted,
      deleteIcon: const Icon(Icons.close, size: 14, color: primaryGreen),
      side: BorderSide.none,
      shape: StadiumBorder(),
    );
  }

  Widget _buildLocationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Service Location",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: DropdownButton<String>(
            value: selectedCity,
            isExpanded: true,
            underline: const SizedBox(),
            icon: const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
            items: cityOptions
                .map(
                  (city) => DropdownMenuItem(
                    value: city,
                    child: Text(
                      city,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Color(0xFF1D2125),
                      ),
                    ),
                  ),
                )
                .toList(),
            onChanged: (value) {
              if (value == null) return;
              setState(() => selectedCity = value);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBottomNav() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: Color(0xFFF1F4F9))),
      ),
      child: Row(
        children: [
          TextButton.icon(
            onPressed: _handleBack,
            icon: const Icon(Icons.chevron_left, color: Colors.grey),
            label: const Text(
              "Back",
              style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
            ),
          ),
          const Spacer(),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryGreen,
              minimumSize: const Size(180, 50),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: () {
              if (widget.isEditing) {
                // Save logic here
                Navigator.pop(context);
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const WorkerServicePackagesScreen(),
                  ),
                );
              }
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  widget.isEditing ? "Save Changes" : "Next: Packages",
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  widget.isEditing ? Icons.check : Icons.chevron_right,
                  color: Colors.white,
                  size: 20,
                ),
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
        Rect.fromCircle(
          center: Offset(size.width / 2, size.height / 2),
          radius: startRadius,
        ),
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

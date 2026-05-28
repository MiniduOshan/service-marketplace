import 'package:flutter/material.dart';
import '../../models/worker_models.dart';
import '../../services/api_client.dart';
import 'booking_steps_screen.dart';

class WorkerProfilePublicScreen extends StatefulWidget {
  const WorkerProfilePublicScreen({super.key});

  @override
  State<WorkerProfilePublicScreen> createState() => _WorkerProfilePublicScreenState();
}

class _WorkerProfilePublicScreenState extends State<WorkerProfilePublicScreen> {
  static const Color primaryGreen = Color(0xFF006D44);
  List<Map<String, dynamic>> _services = [];
  List<Map<String, dynamic>> _reviews = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchData();
    });
  }

  Future<void> _fetchData() async {
    final worker = ModalRoute.of(context)!.settings.arguments as Worker?;
    if (worker == null) {
      setState(() => _isLoading = false);
      return;
    }

    try {
      final services = await ApiClient.instance.getServices(workerId: worker.id);
      final reviews = await ApiClient.instance.getWorkerReviews(worker.id);
      if (mounted) {
        setState(() {
          _services = services;
          _reviews = reviews;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceFirst('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final worker = ModalRoute.of(context)!.settings.arguments as Worker? ?? Worker(
      id: "1",
      name: "Kasun Silva",
      specialty: "Painter",
      location: "Colombo 5",
      rating: 4.9,
      reviewCount: 127,
      experience: 8,
      distance: 2.1,
      startingPrice: "5,000",
      priceUnit: "room",
      initial: "KS",
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: primaryGreen), onPressed: () => Navigator.pop(context)),
        title: const Text("Worker Profile", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        actions: [IconButton(icon: const Icon(Icons.share_outlined, color: primaryGreen), onPressed: (){})],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(worker),
            _buildStats(worker),
            _buildPackages(context, worker),
            _buildAbout(worker),
            _buildPortfolio(),
            _buildLocation(),
            _buildReviews(worker),
            const SizedBox(height: 100), // Space for bottom bar
          ],
        ),
      ),
      bottomSheet: _buildBottomActions(context, worker),
    );
  }

  Widget _buildHeader(Worker worker) {
    return Column(
      children: [
        CircleAvatar(
          radius: 40,
          backgroundColor: const Color(0xFFE8F6F1),
          child: Text(
            worker.initial,
            style: const TextStyle(fontSize: 24, color: primaryGreen, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(worker.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(width: 8),
            if (worker.isVerified) _tag("VERIFIED", Colors.green),
            if (worker.isFeatured) ...[
              const SizedBox(width: 4),
              _tag("FEATURED", Colors.orange),
            ],
          ],
        ),
        Text("${worker.specialty} • ${worker.location} • ${worker.experience} years experience", style: const TextStyle(color: Colors.grey)),
        Text("⭐ ${worker.rating} • ${worker.reviewCount} reviews • ${worker.distance} km away", style: const TextStyle(color: Colors.grey)),
      ],
    );
  }

  Widget _tag(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
      child: Text(text, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildStats(Worker worker) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      child: Row(
        children: [
          _statItem("${worker.reviewCount}", "Jobs Done", Colors.blue.shade50),
          const SizedBox(width: 10),
          _statItem("${worker.rating}", "Rating", Colors.purple.shade50),
          const SizedBox(width: 10),
          _statItem("94%", "Response", Colors.green.shade50),
        ],
      ),
    );
  }

  Widget _statItem(String val, String label, Color bg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
        child: Column(children: [
          Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ]),
      ),
    );
  }

  Widget _buildPackages(BuildContext context, Worker worker) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Service Packages", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade200), borderRadius: BorderRadius.circular(16)),
            child: _isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: CircularProgressIndicator(color: primaryGreen),
                    ),
                  )
                : Column(
                    children: [
                      if (_errorMessage != null)
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
                        ),
                      if (_services.isEmpty)
                        const Padding(
                          padding: EdgeInsets.all(20),
                          child: Text("No packages available for this worker."),
                        )
                      else
                        ..._services.map((service) {
                          final title = service['title']?.toString() ?? 'Unnamed Package';
                          final priceNum = service['price'];
                          final priceLabel = priceNum != null ? "LKR $priceNum" : "Negotiable";
                          final serviceId = service['id'].toString();

                          return Column(
                            children: [
                              _packageTile(context, worker, serviceId, title, priceLabel),
                              const Divider(height: 1),
                            ],
                          );
                        }),
                      _packageTile(context, worker, null, "Custom quote", "Negotiable", isNegotiable: true),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  Widget _packageTile(BuildContext context, Worker worker, String? serviceId, String title, String price, {bool isNegotiable = false}) {
    return ListTile(
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(price, style: TextStyle(color: isNegotiable ? Colors.green : Colors.black, fontWeight: FontWeight.bold)),
      trailing: OutlinedButton(
        style: OutlinedButton.styleFrom(side: const BorderSide(color: primaryGreen)),
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => BookingStepsScreen(
              servicePackageId: serviceId,
              workerName: worker.name,
              serviceTitle: title,
              priceLabel: price,
            ),
          ),
        ),
        child: const Text("Select", style: TextStyle(color: primaryGreen))
      ),
    );
  }

  Widget _buildAbout(Worker worker) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text("About ${worker.name.split(' ').first}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text("Professional ${worker.specialty.toLowerCase()} with a focus on high-quality finishes and attention to detail. Available for onsite jobs.", style: const TextStyle(color: Colors.grey)),
        const SizedBox(height: 10),
        Wrap(spacing: 8, children: [
          _chip(worker.specialty),
          _chip("Expert"),
          _chip("Local Pro"),
        ]),
      ]),
    );
  }

  Widget _chip(String label) {
    return Chip(label: Text(label, style: const TextStyle(fontSize: 12)), backgroundColor: Colors.grey.shade100, side: BorderSide.none);
  }

  Widget _buildPortfolio() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const Text("Portfolio", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextButton(onPressed: (){}, child: const Text("View all", style: TextStyle(color: primaryGreen))),
        ]),
        Row(children: [
          Expanded(child: Container(height: 150, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(12)))),
          const SizedBox(width: 10),
          Expanded(child: Container(height: 150, decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(12)))),
        ]),
      ]),
    );
  }

  Widget _buildLocation() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text("Location", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(height: 150, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(12)), child: const Center(child: Icon(Icons.map_outlined, size: 40, color: Colors.grey))),
        const SizedBox(height: 8),
        const Text("Serves: Colombo, Gampaha", style: TextStyle(fontWeight: FontWeight.bold)),
      ]),
    );
  }

  Widget _buildReviews(Worker worker) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Ratings & Reviews", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Row(
            children: [
              Text(
                worker.rating.toStringAsFixed(1),
                style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: List.generate(5, (index) => Icon(
                        index < worker.rating.round() ? Icons.star : Icons.star_border,
                        color: Colors.amber,
                        size: 20,
                      )),
                    ),
                    const SizedBox(height: 4),
                    Text("${worker.reviewCount} reviews"),
                  ],
                ),
              ),
            ],
          ),
          if (_reviews.isNotEmpty) ...[
            const SizedBox(height: 20),
            const Divider(),
            const SizedBox(height: 10),
            const Text("Latest Reviews", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _reviews.length,
              separatorBuilder: (context, index) => const Divider(height: 24),
              itemBuilder: (context, index) {
                final r = _reviews[index];
                final rating = r['rating'] as int? ?? 5;
                final comment = r['comment']?.toString() ?? '';
                final customerName = r['customer']?['name']?.toString() ?? 'Customer';

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(customerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                        Row(
                          children: List.generate(5, (starIdx) => Icon(
                            starIdx < rating ? Icons.star : Icons.star_border,
                            color: Colors.amber,
                            size: 14,
                          )),
                        ),
                      ],
                    ),
                    if (comment.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        comment,
                        style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                      ),
                    ],
                  ],
                );
              },
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildBottomActions(BuildContext context, Worker worker) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Color(0xFFF1F4F9)))),
      child: Row(children: [
        Expanded(child: OutlinedButton(onPressed: () => Navigator.pushNamed(context, '/chat'), child: const Text("Chat first"))),
        const SizedBox(width: 10),
        Expanded(child: ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => BookingStepsScreen(
                servicePackageId: _services.isNotEmpty ? _services.first['id'].toString() : null,
                workerName: worker.name,
                serviceTitle: _services.isNotEmpty ? _services.first['title']?.toString() ?? 'Room painting' : 'Room painting',
                priceLabel: _services.isNotEmpty ? 'LKR ${_services.first['price']}' : 'Negotiable',
              ),
            ),
          ),
          child: const Text("Book now", style: TextStyle(color: Colors.white)),
        )),
      ]),
    );
  }
}
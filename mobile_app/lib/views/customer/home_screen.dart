import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import '../../models/worker_models.dart';
import '../../services/api_client.dart';
import 'booking_steps_screen.dart';
import 'search_results_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String get _customerName => authController.currentUser?.name?.trim() ?? '';

  final String currentLocation = "Maharagama, Colombo";

  final List<Category> _fallbackCategories = [
    Category(
      name: "Painting",
      iconData: Icons.format_paint_outlined,
      color: const Color(0xFF006D44),
    ),
    Category(
      name: "Electrical",
      iconData: Icons.electrical_services_outlined,
      color: const Color(0xFFE67E22),
    ),
    Category(
      name: "Plumbing",
      iconData: Icons.plumbing_outlined,
      color: const Color(0xFF2980B9),
    ),
    Category(
      name: "Carpentry",
      iconData: Icons.architecture_outlined,
      color: const Color(0xFFE91E63),
    ),
    Category(
      name: "AC Repair",
      iconData: Icons.ac_unit_outlined,
      color: const Color(0xFF9B59B6),
    ),
    Category(
      name: "Cleaning",
      iconData: Icons.cleaning_services_outlined,
      color: const Color(0xFF1ABC9C),
    ),
    Category(
      name: "Masonry",
      iconData: Icons.foundation_outlined,
      color: const Color(0xFF34495E),
    ),
    Category(name: "More", iconData: Icons.add, color: primaryGreen),
  ];

  late List<Category> categories = List.of(_fallbackCategories);

  late List<Worker> topRatedWorkers = [];
  late List<Worker> featuredWorkers = [];
  bool isLoadingWorkers = true;

  static const Color primaryGreen = Color(0xFF006D44);
  static const Color placeholderBg = Color(0xFFF1F4F9);

  @override
  void initState() {
    super.initState();
    _loadCategories();
    _loadWorkers();
  }

  Future<void> _loadCategories() async {
    try {
      final payload = await ApiClient.instance.getCategories();
      if (!mounted) return;

      final themeByName = <String, Category>{
        'Painting': Category(
          name: 'Painting',
          iconData: Icons.format_paint_outlined,
          color: const Color(0xFF006D44),
        ),
        'Electrical': Category(
          name: 'Electrical',
          iconData: Icons.electrical_services_outlined,
          color: const Color(0xFFE67E22),
        ),
        'Plumbing': Category(
          name: 'Plumbing',
          iconData: Icons.plumbing_outlined,
          color: const Color(0xFF2980B9),
        ),
        'Carpentry': Category(
          name: 'Carpentry',
          iconData: Icons.architecture_outlined,
          color: const Color(0xFFE91E63),
        ),
        'AC Repair': Category(
          name: 'AC Repair',
          iconData: Icons.ac_unit_outlined,
          color: const Color(0xFF9B59B6),
        ),
        'Cleaning': Category(
          name: 'Cleaning',
          iconData: Icons.cleaning_services_outlined,
          color: const Color(0xFF1ABC9C),
        ),
        'Masonry': Category(
          name: 'Masonry',
          iconData: Icons.foundation_outlined,
          color: const Color(0xFF34495E),
        ),
      };

      setState(() {
        categories = payload.map((category) {
          return themeByName[category['name']?.toString() ?? ''] ??
              Category(
                name: category['name']?.toString() ?? 'More',
                iconData: Icons.miscellaneous_services_outlined,
                color: primaryGreen,
              );
        }).toList();

        categories.add(
          Category(name: "More", iconData: Icons.add, color: primaryGreen),
        );
      });
    } catch (_) {
      // Keep fallback categories if the backend is unavailable.
    }
  }

  Future<void> _loadWorkers() async {
    try {
      final services = await ApiClient.instance.getServices();
      if (!mounted) return;

      final loadedWorkers = services.map((service) {
        final categoryName = service['category'] is Map<String, dynamic>
            ? service['category']['name']?.toString() ?? 'All'
            : 'All';
        final workerName = service['worker'] is Map<String, dynamic>
            ? service['worker']['name']?.toString() ?? 'Verified Pro'
            : 'Verified Pro';
        final workerId = service['worker'] is Map<String, dynamic>
            ? service['worker']['id']?.toString() ??
                  service['user_id']?.toString() ??
                  '1'
            : service['user_id']?.toString() ?? '1';

        return Worker(
          id: workerId,
          servicePackageId: service['id'].toString(),
          name: workerName,
          specialty: service['title']?.toString() ?? 'Service',
          category: categoryName,
          location: 'Colombo',
          rating: 4.8,
          reviewCount: 120,
          experience: 6,
          distance: 4.0,
          startingPrice: service['price']?.toString() ?? '0',
          priceUnit: 'service',
          initial: workerName.isNotEmpty ? workerName[0].toUpperCase() : 'S',
          isVerified: service['worker'] is Map<String, dynamic> && service['worker']['phone_verified_at'] != null,
          isPro: service['worker'] is Map<String, dynamic> && service['worker']['phone_verified_at'] != null,
        );
      }).toList();

      setState(() {
        topRatedWorkers = loadedWorkers.take(3).toList();
        featuredWorkers = loadedWorkers.skip(3).take(3).toList();
        isLoadingWorkers = false;
      });
    } catch (_) {
      if (mounted) {
        setState(() {
          topRatedWorkers = [];
          featuredWorkers = [];
          isLoadingWorkers = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildHeader(),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildLocationSelector(),
              _buildSearchBarTrigger(),
              _buildCategorySection(),
              const SizedBox(height: 16),
              _buildHorizontalWorkerList("Top Rated Near You", topRatedWorkers),
              const SizedBox(height: 24),
              _buildFeaturedSection(),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  // 1. Header (AppBar)
  PreferredSizeWidget _buildHeader() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      automaticallyImplyLeading: false,
      title: Row(
        children: [
          const CircleAvatar(
            radius: 20,
            backgroundColor: placeholderBg,
            child: Icon(Icons.person, color: Colors.grey),
          ),
          const SizedBox(width: 12),
          Text(
            _customerName.isNotEmpty
                ? "Good morning, $_customerName 👋"
                : "Good morning 👋",
            style: const TextStyle(
              color: Colors.black,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(
            Icons.notifications_none_outlined,
            color: Colors.grey,
            size: 28,
          ),
          onPressed: () => Navigator.pushNamed(context, '/notifications'),
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  // 2. Location Selector
  Widget _buildLocationSelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFE9F1EE),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            const Icon(Icons.location_on, color: primaryGreen, size: 20),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                currentLocation,
                style: const TextStyle(fontSize: 16),
              ),
            ),
            const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
            const Spacer(),
            TextButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Location selection coming soon!"),
                  ),
                );
              },
              child: const Text(
                "Change",
                style: TextStyle(
                  color: primaryGreen,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 3. Search Bar Trigger
  Widget _buildSearchBarTrigger() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: InkWell(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SearchResultsScreen()),
        ),
        child: IgnorePointer(
          child: TextField(
            decoration: InputDecoration(
              hintText: "Search painters, electricians...",
              filled: true,
              fillColor: placeholderBg,
              prefixIcon: const Icon(Icons.search, color: Colors.grey),
              suffixIcon: const Icon(Icons.tune, color: Color(0xFF1B434D)),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(28),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // 4. Categories Grid
  Widget _buildCategorySection() {
    final visibleCategories = categories.take(12).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader("Categories"),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            childAspectRatio: 0.8,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
          ),
          itemCount: visibleCategories.length,
          itemBuilder: (context, index) {
            final category = visibleCategories[index];

            return InkWell(
              onTap: () => Navigator.pushNamed(
                context,
                '/search-results',
                arguments: {'category': category.name},
              ),
              child: Column(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: category.name == "More"
                            ? category.color
                            : category.color.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Center(
                        child: Icon(
                          category.iconData,
                          color: category.name == "More"
                              ? Colors.white
                              : category.color,
                          size: 30,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    category.name,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF475569),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // 5. Top Rated Horizontal List
  Widget _buildHorizontalWorkerList(String title, List<Worker> workers) {
    return Column(
      children: [
        _buildSectionHeader(title),
        SizedBox(
          height: 240,
          child: workers.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.people_outline, size: 48, color: Colors.grey),
                      SizedBox(height: 8),
                      Text(
                        "No professionals near you",
                        style: TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                    ],
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  scrollDirection: Axis.horizontal,
                  itemCount: workers.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 16),
                  itemBuilder: (context, index) =>
                      _buildTopRatedCard(workers[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildTopRatedCard(Worker worker) {
    return InkWell(
      onTap: () => Navigator.pushNamed(
        context,
        '/worker-profile-public',
        arguments: worker,
      ),
      child: Container(
        width: 170,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE9F1EE)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CircleAvatar(
                  backgroundColor: const Color(0xFFE8F6F1),
                  child: Text(
                    worker.initial,
                    style: const TextStyle(color: primaryGreen),
                  ),
                ),
                worker.isVerified
                    ? _buildBadge("Verified", Colors.green)
                    : _buildBadge("Unverified Worker", Colors.red),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              worker.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              maxLines: 1,
            ),
            Text(
              worker.specialty,
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ),
            const Spacer(),
            Row(
              children: [
                const Icon(Icons.star, color: Colors.amber, size: 16),
                Text(
                  " ${worker.rating}",
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Text(
                  "${worker.distance}km",
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              "LKR ${worker.startingPrice}",
              style: const TextStyle(
                color: primaryGreen,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 32,
              child: ElevatedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => BookingStepsScreen(
                      servicePackageId: worker.servicePackageId.isNotEmpty
                          ? worker.servicePackageId
                          : null,
                      workerName: worker.name,
                      serviceTitle: worker.specialty,
                      priceLabel:
                          'LKR ${worker.startingPrice} / ${worker.priceUnit}',
                    ),
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  shape: const StadiumBorder(),
                ),
                child: const Text(
                  "Book",
                  style: TextStyle(color: Colors.white, fontSize: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 6. Featured Vertical List
  Widget _buildFeaturedSection() {
    return Column(
      children: [
        _buildSectionHeader("Featured Workers"),
        featuredWorkers.isEmpty
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: Column(
                    children: [
                      Icon(
                        Icons.engineering_outlined,
                        size: 48,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 8),
                      Text(
                        "No featured workers yet",
                        style: TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              )
            : ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                itemCount: featuredWorkers.length,
                separatorBuilder: (_, _) => const SizedBox(height: 16),
                itemBuilder: (context, index) =>
                    _buildFeaturedTile(featuredWorkers[index]),
              ),
      ],
    );
  }

  Widget _buildFeaturedTile(Worker worker) {
    return InkWell(
      onTap: () => Navigator.pushNamed(
        context,
        '/worker-profile-public',
        arguments: worker,
      ),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE9F1EE)),
        ),
        child: Row(
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                color: placeholderBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.engineering_outlined, color: Colors.grey),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    worker.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    "${worker.specialty} • ${worker.experience} yrs",
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                  Text(
                    "LKR ${worker.startingPrice}/${worker.priceUnit}",
                    style: const TextStyle(
                      color: primaryGreen,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 16),
                    Text(" ${worker.rating}"),
                  ],
                ),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(
                    context,
                    '/worker-profile-public',
                    arguments: worker,
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: primaryGreen),
                    shape: const StadiumBorder(),
                  ),
                  child: const Text(
                    "View",
                    style: TextStyle(color: primaryGreen),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Helpers
  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          TextButton(
            onPressed: () => Navigator.pushNamed(
              context,
              '/search-results',
              arguments: {
                'category': title.contains("Rated") ? "Top Rated" : "All",
              },
            ),
            child: const Text("See all", style: TextStyle(color: primaryGreen)),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return BottomNavigationBar(
      currentIndex: 0,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: primaryGreen,
      onTap: (index) {
        if (index == 1) Navigator.pushNamed(context, '/my-bookings');
        if (index == 2) Navigator.pushNamed(context, '/chat-list');
        if (index == 3) Navigator.pushNamed(context, '/profile');
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
        BottomNavigationBarItem(
          icon: Icon(Icons.calendar_today),
          label: "Bookings",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_bubble_outline),
          label: "Chat",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          label: "Profile",
        ),
      ],
    );
  }
}

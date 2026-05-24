import 'package:flutter/material.dart';
import '../../controllers/auth_controller.dart';
import '../../models/worker_models.dart';
import '../../services/api_client.dart';
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
    Category(name: "Painting", iconData: Icons.format_paint_outlined, color: const Color(0xFF006D44)),
    Category(name: "Electrical", iconData: Icons.electrical_services_outlined, color: const Color(0xFFE67E22)),
    Category(name: "Plumbing", iconData: Icons.plumbing_outlined, color: const Color(0xFF2980B9)),
    Category(name: "Carpentry", iconData: Icons.architecture_outlined, color: const Color(0xFFE91E63)),
    Category(name: "AC Repair", iconData: Icons.ac_unit_outlined, color: const Color(0xFF9B59B6)),
    Category(name: "Cleaning", iconData: Icons.cleaning_services_outlined, color: const Color(0xFF1ABC9C)),
    Category(name: "Masonry", iconData: Icons.foundation_outlined, color: const Color(0xFF34495E)),
    Category(name: "More", iconData: Icons.add, color: primaryGreen),
  ];

  late List<Category> categories = List.of(_fallbackCategories);

  final List<Worker> topRatedWorkers = [
    Worker(
      id: "1", name: "Aruna Kumara", specialty: "Electrician", location: "Maharagama",
      rating: 4.9, reviewCount: 120, experience: 8, distance: 2.1,
      startingPrice: "5,000", priceUnit: "day", initial: "AK",
    ),
    Worker(
      id: "2", name: "Sunil Perera", specialty: "Plumber", location: "Pannipitiya",
      rating: 4.8, reviewCount: 95, experience: 6, distance: 1.8,
      startingPrice: "4,500", priceUnit: "day", initial: "SP",
    ),
  ];

  final List<Worker> featuredWorkers = [
    Worker(
      id: "3", name: "Nimal Bandara", specialty: "Master Painter", location: "Colombo 07",
      rating: 4.9, reviewCount: 210, experience: 12, distance: 0.8,
      startingPrice: "3,500", priceUnit: "day", initial: "NB", isFeatured: true,
    ),
    Worker(
      id: "4", name: "Kasun Rajapaksha", specialty: "AC Technician", location: "Nugegoda",
      rating: 4.7, reviewCount: 88, experience: 5, distance: 1.5,
      startingPrice: "2,500", priceUnit: "service", initial: "KR", isPro: true,
    ),
  ];

  static const Color primaryGreen = Color(0xFF006D44);
  static const Color placeholderBg = Color(0xFFF1F4F9);

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    try {
      final payload = await ApiClient.instance.getCategories();
      if (!mounted) return;

      final themeByName = <String, Category>{
        'Painting': Category(name: 'Painting', iconData: Icons.format_paint_outlined, color: const Color(0xFF006D44)),
        'Electrical': Category(name: 'Electrical', iconData: Icons.electrical_services_outlined, color: const Color(0xFFE67E22)),
        'Plumbing': Category(name: 'Plumbing', iconData: Icons.plumbing_outlined, color: const Color(0xFF2980B9)),
        'Carpentry': Category(name: 'Carpentry', iconData: Icons.architecture_outlined, color: const Color(0xFFE91E63)),
        'AC Repair': Category(name: 'AC Repair', iconData: Icons.ac_unit_outlined, color: const Color(0xFF9B59B6)),
        'Cleaning': Category(name: 'Cleaning', iconData: Icons.cleaning_services_outlined, color: const Color(0xFF1ABC9C)),
        'Masonry': Category(name: 'Masonry', iconData: Icons.foundation_outlined, color: const Color(0xFF34495E)),
      };

      setState(() {
        categories = payload.map((category) {
          return themeByName[category['name']?.toString() ?? ''] ?? Category(
            name: category['name']?.toString() ?? 'More',
            iconData: Icons.miscellaneous_services_outlined,
            color: primaryGreen,
          );
        }).toList();

        categories.add(Category(name: "More", iconData: Icons.add, color: primaryGreen));
      });
    } catch (_) {
      // Keep fallback categories if the backend is unavailable.
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
            style: const TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_none_outlined, color: Colors.grey, size: 28),
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
        decoration: BoxDecoration(color: const Color(0xFFE9F1EE), borderRadius: BorderRadius.circular(16)),
        child: Row(
          children: [
            const Icon(Icons.location_on, color: primaryGreen, size: 20),
            const SizedBox(width: 8),
            Expanded(child: Text(currentLocation, style: const TextStyle(fontSize: 16))),
            const Icon(Icons.keyboard_arrow_down, color: Colors.grey),
            const Spacer(),
            TextButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Location selection coming soon!")));
              },
              child: const Text("Change", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
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
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none),
            ),
          ),
        ),
      ),
    );
  }

  // 4. Categories Grid
  Widget _buildCategorySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader("Categories"),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4, childAspectRatio: 0.8, mainAxisSpacing: 16, crossAxisSpacing: 16,
          ),
          itemCount: categories.length,
          itemBuilder: (context, index) {
            return InkWell(
              onTap: () => Navigator.pushNamed(
                context, 
                '/search-results', 
                arguments: {'category': categories[index].name}
              ),
              child: Column(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: categories[index].name == "More" 
                            ? categories[index].color 
                            : categories[index].color.withValues(alpha: 0.1), 
                        borderRadius: BorderRadius.circular(20)
                      ),
                      child: Center(
                        child: Icon(
                          categories[index].iconData, 
                          color: categories[index].name == "More" ? Colors.white : categories[index].color, 
                          size: 30
                        )
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(categories[index].name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
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
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            scrollDirection: Axis.horizontal,
            itemCount: workers.length,
            separatorBuilder: (_, _) => const SizedBox(width: 16),
            itemBuilder: (context, index) => _buildTopRatedCard(workers[index]),
          ),
        ),
      ],
    );
  }

  Widget _buildTopRatedCard(Worker worker) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/worker-profile-public'),
      child: Container(
        width: 170,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE9F1EE)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CircleAvatar(backgroundColor: const Color(0xFFE8F6F1), child: Text(worker.initial, style: const TextStyle(color: primaryGreen))),
                _buildBadge("Verified", Colors.green),
              ],
            ),
            const SizedBox(height: 12),
            Text(worker.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), maxLines: 1),
            Text(worker.specialty, style: const TextStyle(color: Colors.grey, fontSize: 13)),
            const Spacer(),
            Row(
              children: [
                const Icon(Icons.star, color: Colors.amber, size: 16),
                Text(" ${worker.rating}", style: const TextStyle(fontWeight: FontWeight.bold)),
                const Spacer(),
                Text("${worker.distance}km", style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 8),
            Text("LKR ${worker.startingPrice}", style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity, height: 32,
              child: ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, '/booking-steps'),
                style: ElevatedButton.styleFrom(backgroundColor: primaryGreen, shape: const StadiumBorder()),
                child: const Text("Book", style: TextStyle(color: Colors.white, fontSize: 12)),
              ),
            )
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
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          itemCount: featuredWorkers.length,
          separatorBuilder: (_, _) => const SizedBox(height: 16),
          itemBuilder: (context, index) => _buildFeaturedTile(featuredWorkers[index]),
        ),
      ],
    );
  }

  Widget _buildFeaturedTile(Worker worker) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/worker-profile-public'),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE9F1EE)),
        ),
        child: Row(
          children: [
            Container(
              width: 70, height: 70,
              decoration: BoxDecoration(color: placeholderBg, borderRadius: BorderRadius.circular(12)),
              child: const Icon(Icons.engineering_outlined, color: Colors.grey),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(worker.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text("${worker.specialty} • ${worker.experience} yrs", style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  Text("LKR ${worker.startingPrice}/${worker.priceUnit}", style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(children: [const Icon(Icons.star, color: Colors.amber, size: 16), Text(" ${worker.rating}")]),
                const SizedBox(height: 12),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, '/worker-profile-public'),
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: primaryGreen), shape: const StadiumBorder()),
                  child: const Text("View", style: TextStyle(color: primaryGreen)),
                )
              ],
            )
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
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          TextButton(
            onPressed: () => Navigator.pushNamed(
              context, 
              '/search-results',
              arguments: {'category': title.contains("Rated") ? "Top Rated" : "All"}
            ), 
            child: const Text("See all", style: TextStyle(color: primaryGreen))
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(text, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
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
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: "Bookings"),
        BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: "Chat"),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profile"),
      ],
    );
  }
}
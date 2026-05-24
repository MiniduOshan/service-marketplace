// lib/views/search_results_screen.dart
import 'package:flutter/material.dart';
import 'booking_steps_screen.dart';
import '../../models/worker_models.dart';
import '../../services/api_client.dart';

class SearchResultsScreen extends StatefulWidget {
  const SearchResultsScreen({super.key});

  @override
  State<SearchResultsScreen> createState() => _SearchResultsScreenState();
}

class _SearchResultsScreenState extends State<SearchResultsScreen> {
  late String activeCategory;
  String activeFilter = "All";
  late List<Worker> filteredResults;
  bool isListView = true;
  late TextEditingController _searchController;
  bool _isLoading = true;
  String? _errorMessage;

  final List<Worker> _fallbackWorkers = [
    Worker(
      id: "1", name: "Kamal Ariyaratne", specialty: "Painting", location: "Colombo 5",
      rating: 4.9, reviewCount: 127, experience: 8, distance: 2.1,
      startingPrice: "5,000", priceUnit: "room", initial: "KA",
      isFeatured: true, isPro: true,
    ),
    Worker(
      id: "2", name: "Nuwan Mahesh", specialty: "Painting", location: "Colombo 3",
      rating: 4.8, reviewCount: 94, experience: 12, distance: 3.5,
      startingPrice: "4,500", priceUnit: "room", initial: "NM",
    ),
    Worker(
      id: "3", name: "Saman De Silva", specialty: "Electrical", location: "Dehiwala",
      rating: 4.7, reviewCount: 42, experience: 5, distance: 5.2,
      startingPrice: "6,200", priceUnit: "room", initial: "SD",
    ),
    Worker(
      id: "4", name: "Janaka Perera", specialty: "Plumbing", location: "Nugegoda",
      rating: 4.6, reviewCount: 55, experience: 7, distance: 4.8,
      startingPrice: "3,800", priceUnit: "task", initial: "JP",
    ),
    Worker(
      id: "5", name: "Roshan Silva", specialty: "Carpentry", location: "Kottawa",
      rating: 4.9, reviewCount: 110, experience: 10, distance: 6.1,
      startingPrice: "7,500", priceUnit: "day", initial: "RS", isPro: true,
    ),
  ];

  late List<Worker> allWorkers;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    allWorkers = List.of(_fallbackWorkers);
    _loadWorkers();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;
    activeCategory = args?['category'] ?? "All";
    _searchController.text = activeCategory == "All" ? "" : activeCategory;
    if (!_isLoading) {
      _applyFilter();
    }
  }

  Future<void> _loadWorkers() async {
    try {
      final services = await ApiClient.instance.getServices();
      if (!mounted) return;

      setState(() {
        allWorkers = services.map((service) {
          final categoryName = service['category'] is Map<String, dynamic>
              ? service['category']['name']?.toString() ?? 'All'
              : 'All';
          final workerName = service['worker'] is Map<String, dynamic>
              ? service['worker']['name']?.toString() ?? 'Verified Pro'
              : 'Verified Pro';

          return Worker(
            id: service['id'].toString(),
            name: workerName,
            specialty: service['title']?.toString() ?? 'Service',
            category: categoryName,
            location: 'Colombo',
            rating: 4.8,
            reviewCount: 120,
            experience: 6,
            distance: 4.0,
            startingPrice: service['price']?.toString() ?? '0',
            priceUnit: '/ service',
            initial: workerName.isNotEmpty ? workerName[0].toUpperCase() : 'S',
            isVerified: true,
            isPro: true,
          );
        }).toList();

        _isLoading = false;
        _errorMessage = null;
        _applyFilter();
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        allWorkers = List.of(_fallbackWorkers);
        _isLoading = false;
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
        _applyFilter();
      });
    }
  }

  void _applyFilter() {
    List<Worker> results = List.from(allWorkers);

    // 1. Category Filter
    if (activeCategory != "All" && activeCategory != "More") {
      results = results.where((w) => 
        w.specialty.toLowerCase().contains(activeCategory.toLowerCase())
      ).toList();
    }

    // 2. Secondary Filter (Near Me, Top Rated, Verified)
    if (activeFilter == "Near Me") {
      results = results.where((w) => w.distance <= 3.0).toList(); // Simple near me logic
      results.sort((a, b) => a.distance.compareTo(b.distance));
    } else if (activeFilter == "Top Rated") {
      results = results.where((w) => w.rating >= 4.8).toList();
      results.sort((a, b) => b.rating.compareTo(a.rating));
    } else if (activeFilter == "Verified") {
      results = results.where((w) => w.isVerified).toList();
    }

    setState(() {
      filteredResults = results;
    });
  }

  static const Color primaryGreen = Color(0xFF006D44);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildSearchAppBar(),
      body: Column(
        children: [
          _buildFilters(),
          _buildListMapToggle(),
          Expanded(
            child: isListView 
              ? _buildWorkerList()
              : _buildMapView(),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  PreferredSizeWidget _buildSearchAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: primaryGreen),
        onPressed: () => Navigator.pop(context),
      ),
      title: Container(
        height: 45,
        decoration: BoxDecoration(
          color: const Color(0xFFF1F4F9),
          borderRadius: BorderRadius.circular(12),
        ),
        child: TextField(
          controller: _searchController,
          onChanged: (val) {
            setState(() {
              activeCategory = val.isEmpty ? "All" : val;
              _applyFilter();
            });
          },
          decoration: InputDecoration(
            hintText: "Search workers...",
            prefixIcon: const Icon(Icons.search, color: Colors.grey),
            suffixIcon: activeCategory != "All" && activeCategory.isNotEmpty 
              ? IconButton(
                  icon: const Icon(Icons.clear, size: 18),
                  onPressed: () {
                    setState(() {
                      activeCategory = "All";
                      _searchController.clear();
                      _applyFilter();
                    });
                  },
                )
              : null,
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 10),
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.tune, color: primaryGreen),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Advanced filters coming soon!")));
          },
        ),
      ],
    );
  }

  Widget _buildFilters() {
    final filters = ["All", "Near Me", "Top Rated", "Verified"];
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: filters.length,
        itemBuilder: (context, index) {
          bool isSelected = activeFilter == filters[index];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(filters[index]),
              selected: isSelected,
              onSelected: (val) {
                setState(() {
                  activeFilter = filters[index];
                  _applyFilter();
                });
              },
              backgroundColor: Colors.white,
              selectedColor: primaryGreen,
              labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black),
              shape: StadiumBorder(side: BorderSide(color: Colors.grey.shade300)),
            ),
          );
        },
      ),
    );
  }

  Widget _buildWorkerList() {
    if (_isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: CircularProgressIndicator(color: primaryGreen),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (_errorMessage != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red, fontSize: 13),
            ),
          ),
        Text("Showing ${filteredResults.length} workers for \"$activeCategory\"${activeFilter != "All" ? " ($activeFilter)" : ""}", 
          style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const SizedBox(height: 16),
        if (filteredResults.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.only(top: 50),
              child: Text("No workers found in this category yet."),
            ),
          )
        else
          ...filteredResults.map((worker) => _buildWorkerCard(worker)),
        _buildLoadMore(),
        _buildFooter(),
      ],
    );
  }

  Widget _buildMapView() {
    return Container(
      width: double.infinity,
      color: Colors.grey.shade100,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.map_outlined, size: 80, color: primaryGreen.withValues(alpha: 0.3)),
          const SizedBox(height: 16),
          const Text("Map View", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Text("Displaying ${filteredResults.length} workers on the map based on your location.", 
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.grey)),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
            onPressed: () => setState(() => isListView = true), 
            icon: const Icon(Icons.list, color: Colors.white),
            label: const Text("Switch to List", style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }

  Widget _buildListMapToggle() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF1F4F9),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                _toggleButton("List", isListView),
                _toggleButton("Map", !isListView),
              ],
            ),
          ),
          DropdownButton<String>(
            value: "Nearest",
            underline: const SizedBox(),
            items: ["Nearest", "Price", "Rating"].map((String value) {
              return DropdownMenuItem<String>(value: value, child: Text("Sort by: $value"));
            }).toList(),
            onChanged: (val) {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Sorted by $val")));
            },
          ),
        ],
      ),
    );
  }

  Widget _toggleButton(String text, bool active) {
    return GestureDetector(
      onTap: () {
        setState(() {
          isListView = (text == "List");
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        decoration: BoxDecoration(
          color: active ? primaryGreen : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(text, style: TextStyle(color: active ? Colors.white : Colors.black)),
      ),
    );
  }

  Widget _buildWorkerCard(Worker worker) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/worker-profile-public'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 35,
                    backgroundColor: primaryGreen,
                    child: Text(worker.initial, style: const TextStyle(color: Colors.white, fontSize: 24)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(worker.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            _badge("Verified", Colors.green, Icons.check_circle),
                            if (worker.isFeatured) const SizedBox(width: 8),
                            if (worker.isFeatured) _badge("Featured", Colors.orange, Icons.star),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text("${worker.specialty} · ${worker.location} · ${worker.experience} yrs exp",
                          style: const TextStyle(color: Colors.grey, fontSize: 13)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.star, color: Colors.amber, size: 18),
                            const SizedBox(width: 4),
                            Text("${worker.rating} (${worker.reviewCount} reviews)", 
                              style: const TextStyle(fontWeight: FontWeight.bold)),
                            const Spacer(),
                            Text("${worker.distance} km away", style: const TextStyle(color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text("From LKR ${worker.startingPrice} / ${worker.priceUnit}",
                          style: const TextStyle(color: primaryGreen, fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(child: OutlinedButton(onPressed: () => Navigator.pushNamed(context, '/chat'), child: const Text("Chat first"))),
                            const SizedBox(width: 12),
                            Expanded(child: ElevatedButton(
                              style: ElevatedButton.styleFrom(backgroundColor: primaryGreen),
                              onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => BookingStepsScreen(
                                    servicePackageId: worker.id,
                                    workerName: worker.name,
                                    serviceTitle: worker.specialty,
                                    priceLabel: 'LKR ${worker.startingPrice} / ${worker.priceUnit}',
                                  ),
                                ),
                              ),
                              child: const Text("Book now", style: TextStyle(color: Colors.white)))),
                          ],
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
            if (worker.isPro) ...[
              const Divider(height: 1),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                child: Row(
                  children: [
                    Icon(Icons.circle, size: 8, color: Colors.amber.shade700),
                    const SizedBox(width: 8),
                    Text("PRO MEMBER", style: TextStyle(color: Colors.amber.shade900, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              )
            ]
          ],
        ),
      ),
    );
  }

  Widget _badge(String text, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(text, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildLoadMore() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 45)),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Loading more workers...")));
        }, 
        child: const Text("Load more")
      ),
    );
  }

  Widget _buildFooter() {
    return Column(
      children: [
        const Text("No more workers nearby — expand search area?", 
          textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
        TextButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Distance radius settings coming soon!")));
          },
          child: const Text("Change distance radius", 
            style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold)),
        )
      ],
    );
  }

  Widget _buildBottomNavBar() {
    return BottomNavigationBar(
      currentIndex: 0,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: primaryGreen,
      onTap: (index) {
        if (index == 0) Navigator.pushNamed(context, '/welcome'); // Home/Welcome
        if (index == 1) Navigator.pushNamed(context, '/my-bookings');
        if (index == 2) Navigator.pushNamed(context, '/chat-list');
        if (index == 3) Navigator.pushNamed(context, '/profile');
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_month), label: "Bookings"),
        BottomNavigationBarItem(icon: Icon(Icons.chat), label: "Chat"),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
      ],
    );
  }
}
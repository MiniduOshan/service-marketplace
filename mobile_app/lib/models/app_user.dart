enum UserRole { worker, customer }

class AppUser {
  final String id;
  final String? name;
  final String? email;
  final String? phone;
  final String? token;
  final UserRole role;
  final bool isRegistrationComplete;
  final DateTime? phoneVerifiedAt;
  final int? pricingPlanId;
  final String? city;
  final String? bio;
  final List<String>? skills;
  final String? primaryServiceCategoryId;

  AppUser({
    required this.id, 
    this.name,
    this.email,
    this.phone,
    this.token,
    required this.role, 
    this.isRegistrationComplete = false,
    this.phoneVerifiedAt,
    this.pricingPlanId,
    this.city,
    this.bio,
    this.skills,
    this.primaryServiceCategoryId,
  });

  bool get isPhoneVerified => phoneVerifiedAt != null;
}

enum UserRole { worker, customer }

class AppUser {
  final String id;
  final String? name;
  final String? email;
  final String? token;
  final UserRole role;
  final bool isRegistrationComplete;

  AppUser({
    required this.id, 
    this.name,
    this.email,
    this.token,
    required this.role, 
    this.isRegistrationComplete = false,
  });
}

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../models/app_user.dart';
import '../services/api_client.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/google_auth_config.dart';

class AuthController {
  static final AuthController _instance = AuthController._internal();
  factory AuthController() => _instance;
  AuthController._internal();

  final _authStateNotifier = ValueNotifier<AppUser?>(null);
  ValueNotifier<AppUser?> get authStateNotifier => _authStateNotifier;
  
  late final Stream<AppUser?> _authStream = _authStateNotifier.asStream();
  Stream<AppUser?> get onAuthStateChanged => _authStream;

  UserRole? _currentUserRole;
  UserRole? get currentUserRole => _currentUserRole;

  AppUser? get currentUser => _authStateNotifier.value;
  String? _sessionToken;
  String? get sessionToken => _sessionToken;

  static const _prefsTokenKey = 'skilledlk_token';
  static const _prefsUserKey = 'skilledlk_user';
  static Future<void>? _googleSignInInitializationFuture;

  void _setSession(AppUser user, {String? token}) {
    _currentUserRole = user.role;
    _sessionToken = token;
    _authStateNotifier.value = user;
    _saveSessionToDisk(user, token: token);
  }

  Future<void> _saveSessionToDisk(AppUser user, {String? token}) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      if (token != null) {
        await prefs.setString(_prefsTokenKey, token);
      }
      final userMap = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'phoneVerifiedAt': user.phoneVerifiedAt?.toIso8601String(),
        'role': user.role.toString().split('.').last,
        'isRegistrationComplete': user.isRegistrationComplete,
      };
      await prefs.setString(_prefsUserKey, jsonEncode(userMap));
    } catch (_) {}
  }

  Future<void> loadFromDisk() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(_prefsTokenKey);
      final userJson = prefs.getString(_prefsUserKey);
      if (token == null || userJson == null) return;

      final map = jsonDecode(userJson) as Map<String, dynamic>;
      final role = map['role']?.toString() == 'worker' ? UserRole.worker : UserRole.customer;

      _sessionToken = token;
      _currentUserRole = role;
      _authStateNotifier.value = AppUser(
        id: map['id'].toString(),
        name: map['name']?.toString(),
        email: map['email']?.toString(),
        phone: map['phone']?.toString(),
        token: token,
        role: role,
        isRegistrationComplete: map['isRegistrationComplete'] == true,
        phoneVerifiedAt: map['phoneVerifiedAt'] != null
            ? DateTime.tryParse(map['phoneVerifiedAt'].toString())
            : null,
      );
    } catch (_) {}
  }

  void completeRegistration() {
    if (_authStateNotifier.value != null) {
      _authStateNotifier.value = AppUser(
        id: _authStateNotifier.value!.id,
        name: _authStateNotifier.value!.name,
        email: _authStateNotifier.value!.email,
        phone: _authStateNotifier.value!.phone,
        token: _authStateNotifier.value!.token,
        role: _authStateNotifier.value!.role,
        isRegistrationComplete: true,
        phoneVerifiedAt: _authStateNotifier.value!.phoneVerifiedAt,
      );
    }
  }


  Future<bool> loginWithEmail(String email, String password) async {
    final response = await ApiClient.instance.login(email: email, password: password);
    final data = response['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;
    final token = data['token'] as String?;
    final role = user['role']?.toString() == 'worker' ? UserRole.worker : UserRole.customer;

    _setSession(
      AppUser(
        id: user['id'].toString(),
        name: user['name']?.toString(),
        email: user['email']?.toString(),
        phone: user['phone']?.toString(),
        token: token,
        role: role,
        isRegistrationComplete: role != UserRole.worker,
        phoneVerifiedAt: user['phone_verified_at'] != null
            ? DateTime.tryParse(user['phone_verified_at'].toString())
            : null,
      ),
      token: token,
    );

    return true;
  }

  Future<bool> registerCustomer(String name, String email, String password) async {
    final response = await ApiClient.instance.registerCustomer(name: name, email: email, password: password);
    final data = response['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;
    final token = data['token'] as String?;

    _setSession(
      AppUser(
        id: user['id'].toString(),
        name: user['name']?.toString(),
        email: user['email']?.toString(),
        phone: user['phone']?.toString(),
        token: token,
        role: UserRole.customer,
        isRegistrationComplete: true,
        phoneVerifiedAt: user['phone_verified_at'] != null
            ? DateTime.tryParse(user['phone_verified_at'].toString())
            : null,
      ),
      token: token,
    );

    return true;
  }

  Future<bool> registerWorker(String name, String email, String password) async {
    final response = await ApiClient.instance.registerWorker(name: name, email: email, password: password);
    final data = response['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;
    final token = data['token'] as String?;

    _setSession(
      AppUser(
        id: user['id'].toString(),
        name: user['name']?.toString(),
        email: user['email']?.toString(),
        phone: user['phone']?.toString(),
        token: token,
        role: UserRole.worker,
        isRegistrationComplete: false,
        phoneVerifiedAt: user['phone_verified_at'] != null
            ? DateTime.tryParse(user['phone_verified_at'].toString())
            : null,
      ),
      token: token,
    );

    return true;
  }

  Future<Map<String, dynamic>> requestPhoneOtp(String name, String phone, UserRole role) {
    return ApiClient.instance.requestPhoneOtp(
      name: name,
      phone: phone,
      role: role.toString().split('.').last,
    );
  }

  Future<bool> verifyPhoneOtp(String phone, String otp) async {
    final response = await ApiClient.instance.verifyPhoneOtp(phone: phone, otp: otp);
    final data = response['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;
    final token = data['token'] as String?;
    final role = user['role']?.toString() == 'worker' ? UserRole.worker : UserRole.customer;

    _setSession(
      AppUser(
        id: user['id'].toString(),
        name: user['name']?.toString(),
        email: user['email']?.toString(),
        phone: user['phone']?.toString(),
        token: token,
        role: role,
        isRegistrationComplete: role != UserRole.worker,
        phoneVerifiedAt: user['phone_verified_at'] != null
            ? DateTime.tryParse(user['phone_verified_at'].toString())
            : null,
      ),
      token: token,
    );

    return true;
  }

  GoogleSignIn _createGoogleSignIn() {
    if (googleClientId.isEmpty) {
      throw StateError('Google sign-in is not configured.');
    }

    return GoogleSignIn.instance;
  }

  Future<void> _ensureGoogleSignInInitialized() {
    _googleSignInInitializationFuture ??= GoogleSignIn.instance.initialize(
      clientId: kIsWeb ? googleClientId : null,
      serverClientId: googleClientId,
    );

    return _googleSignInInitializationFuture!;
  }

  Future<bool> loginWithGoogle({required UserRole role, required bool signupFlow}) async {
    _createGoogleSignIn();
    await _ensureGoogleSignInInitialized();
    final account = await GoogleSignIn.instance.authenticate(scopeHint: const ['email']);

    final credential = account.authentication.idToken;

    if (credential == null || credential.isEmpty) {
      throw Exception('Unable to read the Google credential.');
    }

    final response = await ApiClient.instance.googleAuth(
      credential: credential,
      flow: signupFlow ? 'signup' : 'signin',
      role: role.toString().split('.').last,
    );

    final data = response['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;
    final token = data['token'] as String?;
    final resolvedRole = user['role']?.toString() == 'worker' ? UserRole.worker : UserRole.customer;

    _setSession(
      AppUser(
        id: user['id'].toString(),
        name: user['name']?.toString(),
        email: user['email']?.toString(),
        phone: user['phone']?.toString(),
        token: token,
        role: resolvedRole,
        isRegistrationComplete: resolvedRole != UserRole.worker,
        phoneVerifiedAt: user['phone_verified_at'] != null
            ? DateTime.tryParse(user['phone_verified_at'].toString())
            : null,
      ),
      token: token,
    );

    return true;
  }

  Future<bool> updateProfile({String? name, String? phone}) async {
    final response = await ApiClient.instance.updateProfile(
      name: name,
      phone: phone,
      token: _sessionToken,
    );
    final data = response['data'] as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;
    final role = user['role']?.toString() == 'worker' ? UserRole.worker : UserRole.customer;

    _setSession(
      AppUser(
        id: user['id'].toString(),
        name: user['name']?.toString(),
        email: user['email']?.toString(),
        phone: user['phone']?.toString(),
        token: _sessionToken,
        role: role,
        isRegistrationComplete: _authStateNotifier.value?.isRegistrationComplete ?? (role != UserRole.worker),
        phoneVerifiedAt: user['phone_verified_at'] != null
            ? DateTime.tryParse(user['phone_verified_at'].toString())
            : null,
      ),
      token: _sessionToken,
    );

    return true;
  }

  void logOut() {
    _currentUserRole = null;
    _sessionToken = null;
    _authStateNotifier.value = null;
    SharedPreferences.getInstance().then((prefs) {
      prefs.remove(_prefsTokenKey);
      prefs.remove(_prefsUserKey);
    });
  }
}

// Extension to allow ValueNotifier to behave like a stream for the existing StreamBuilder
extension ValueNotifierExtension<T> on ValueNotifier<T> {
  Stream<T> asStream() {
    final controller = StreamController<T>();
    controller.add(value);
    void listener() => controller.add(value);
    addListener(listener);
    controller.onCancel = () => removeListener(listener);
    return controller.stream;
  }
}

final AuthController authController = AuthController();



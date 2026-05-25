import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiClient {
  ApiClient._();

  static final ApiClient instance = ApiClient._();

  final String baseUrl = kIsWeb
      ? 'http://localhost:8000/api'
      : 'http://10.0.2.2:8000/api';

  Future<Map<String, dynamic>> postJson(
    String path, {
    Map<String, dynamic>? body,
    String? token,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body ?? const {}),
    );

    return _decodeResponse(response);
  }

  Future<Map<String, dynamic>> getJson(String path, {String? token}) async {
    final response = await http.get(
      Uri.parse('$baseUrl$path'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );

    return _decodeResponse(response);
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) {
    return postJson(
      '/auth/login',
      body: {'email': email, 'password': password},
    );
  }

  Future<Map<String, dynamic>> googleAuth({
    required String credential,
    required String flow,
    required String role,
  }) {
    return postJson(
      '/auth/google',
      body: {
        'credential': credential,
        'flow': flow,
        'role': role,
      },
    );
  }

  Future<Map<String, dynamic>> requestPhoneOtp({
    required String name,
    required String phone,
    required String role,
  }) {
    return postJson(
      '/auth/phone/request-otp',
      body: {
        'name': name,
        'phone': phone,
        'role': role,
      },
    );
  }

  Future<Map<String, dynamic>> verifyPhoneOtp({
    required String phone,
    required String otp,
  }) {
    return postJson(
      '/auth/phone/verify-otp',
      body: {
        'phone': phone,
        'otp': otp,
      },
    );
  }

  Future<Map<String, dynamic>> registerCustomer({
    required String name,
    required String email,
    required String password,
  }) {
    return postJson(
      '/auth/register',
      body: {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': password,
      },
    );
  }

  Future<Map<String, dynamic>> registerWorker({
    required String name,
    required String email,
    required String password,
  }) {
    return postJson(
      '/auth/register-worker',
      body: {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': password,
      },
    );
  }

  Future<List<Map<String, dynamic>>> getCategories() async {
    final payload = await getJson('/categories');
    return List<Map<String, dynamic>>.from(payload['data'] as List<dynamic>);
  }

  Future<List<Map<String, dynamic>>> getServices() async {
    final payload = await getJson('/services');
    final data = payload['data'] as Map<String, dynamic>;
    return List<Map<String, dynamic>>.from(data['data'] as List<dynamic>);
  }

  Future<Map<String, dynamic>> createBooking({
    required String servicePackageId,
    required String scheduledAt,
    required String address,
    String? notes,
    String? token,
  }) {
    return postJson(
      '/auth/bookings',
      token: token,
      body: {
        'service_package_id': servicePackageId,
        'scheduled_at': scheduledAt,
        'address': address,
        'notes': notes,
      },
    );
  }

  Future<List<Map<String, dynamic>>> getBookings({String? token}) async {
    final payload = await getJson('/auth/bookings', token: token);
    final data = payload['data'] as Map<String, dynamic>;
    return List<Map<String, dynamic>>.from(data['data'] as List<dynamic>);
  }

  Future<Map<String, dynamic>> cancelBooking({
    required String bookingId,
    String? token,
  }) {
    return postJson('/auth/bookings/$bookingId/cancel', token: token);
  }

  Future<Map<String, dynamic>> createWorkerServicePackage({
    required String serviceCategoryId,
    required String title,
    required String description,
    required String price,
    String? durationMinutes,
    String? locationType,
    String? token,
  }) {
    return postJson(
      '/auth/worker/services',
      token: token,
      body: {
        'service_category_id': serviceCategoryId,
        'title': title,
        'description': description,
        'price': price,
        'duration_minutes': durationMinutes,
        'location_type': locationType,
      },
    );
  }

  Map<String, dynamic> _decodeResponse(http.Response response) {
    final responseBody = response.body.trim();
    final isJsonResponse =
        responseBody.startsWith('{') || responseBody.startsWith('[');
    final decoded = responseBody.isEmpty || !isJsonResponse
        ? responseBody
        : jsonDecode(responseBody);

    if (response.statusCode >= 400) {
      final message = decoded is Map<String, dynamic>
          ? decoded['message']?.toString() ?? 'Request failed.'
          : decoded is String && decoded.isNotEmpty
          ? decoded
          : 'Request failed.';
      throw Exception(message);
    }

    if (decoded is Map<String, dynamic>) {
      return decoded;
    }

    return <String, dynamic>{'data': decoded};
  }
}

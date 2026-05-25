import 'package:flutter/material.dart';

class Category {
  final String name;
  final IconData iconData; 
  final Color color;
  Category({required this.name, required this.iconData, required this.color});
}

class Worker {
  final String id;
  final String servicePackageId;
  final String name;
  final String specialty;
  final String category;
  final String location;
  final double rating;
  final int reviewCount;
  final int experience;
  final double distance;
  final String startingPrice;
  final String priceUnit; 
  final String imageUrl;
  final bool isVerified;
  final String initial; 
  final bool isFeatured;
  final bool isPro;

  Worker({
    required this.id,
    this.servicePackageId = '',
    required this.name,
    required this.specialty,
    this.category = '',
    required this.location,
    required this.rating,
    required this.reviewCount,
    required this.experience,
    required this.distance,
    required this.startingPrice,
    required this.priceUnit,
    this.imageUrl = "", 
    this.isVerified = true,
    required this.initial,
    this.isFeatured = false,
    this.isPro = false,
  });
}

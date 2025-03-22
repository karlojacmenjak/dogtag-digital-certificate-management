import 'package:csr_app/pages/create_csr_page.dart';
import 'package:csr_app/pages/create_key_page.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AppNavigation extends StatefulWidget {
  const AppNavigation({super.key});

  @override
  State<AppNavigation> createState() => _AppNavigationState();
}

class _AppNavigationState extends State<AppNavigation> {
  List<Widget> pages = const [
    CreateCsrPage(),
    CreateKeyPage(),
  ];

  int selectedPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[selectedPage],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: selectedPage,
        onTap: (value) => setState(() => selectedPage = value),
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: FaIcon(FontAwesomeIcons.fileSignature),
            label: 'Certificate signing request',
          ),
          BottomNavigationBarItem(
            icon: FaIcon(FontAwesomeIcons.key),
            label: 'Keys',
          ),
        ],
      ),
    );
  }
}

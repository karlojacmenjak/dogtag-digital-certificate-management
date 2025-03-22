import 'package:flutter/material.dart';

class Dialogs {
  static void showShortSnackBar(State state, String message) {
    showSnackBar(state, 2, message);
  }

  static void showLongSnackBar(State state, String message) {
    showSnackBar(state, 8, message);
  }

  static void showSnackBar(State state, int durationInSeconds, String message) {
    if (!state.mounted) return;

    ScaffoldMessenger.of(state.context).removeCurrentSnackBar();

    var snackbar = SnackBar(
      showCloseIcon: true,
      behavior: SnackBarBehavior.floating,
      duration: Duration(seconds: durationInSeconds),
      content: Text(message),
    );

    ScaffoldMessenger.of(state.context).showSnackBar(snackbar);
  }

  static void showMessage(State state, String title, String message) {
    if (!state.mounted) return;
    showDialog(
      context: state.context,
      builder: (context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Ok'),
            ),
          ],
        );
      },
    );
  }
}

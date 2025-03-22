import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:path/path.dart' as p;
import 'package:file_selector/file_selector.dart' as fs;

enum FileSelectorMode {
  saveFile,
  openFile,
}

class FileSelectorWidget extends StatelessWidget {
  final String? selectedPath;
  final FileSelectorMode mode;
  final bool enabled;

  final List<fs.XTypeGroup> acceptedTypeGroups;
  final String? initialDirectory;
  final String? suggestedName;
  final String? confirmButtonText;

  final void Function(String? path) onSelect;

  const FileSelectorWidget({
    super.key,
    this.selectedPath,
    this.enabled = true,
    required this.mode,
    required this.onSelect,
    this.acceptedTypeGroups = const <fs.XTypeGroup>[],
    this.initialDirectory,
    this.suggestedName,
    this.confirmButtonText,
  });

  void openFile() async {
    var result = await fs.openFile(
      acceptedTypeGroups: acceptedTypeGroups,
      initialDirectory: initialDirectory,
      confirmButtonText: confirmButtonText,
    );

    if (result == null) return;

    var path = result.path;
    onSelect(path);
  }

  void saveFile() async {
    var result = await fs.getSaveLocation(
      acceptedTypeGroups: acceptedTypeGroups,
      initialDirectory: initialDirectory,
      suggestedName: suggestedName,
      confirmButtonText: confirmButtonText,
    );

    if (result == null) return;

    var path = updatePathExtension(result);
    onSelect(path);
  }

  void onTap() {
    switch (mode) {
      case FileSelectorMode.openFile:
        openFile();
        break;

      case FileSelectorMode.saveFile:
        saveFile();
        break;
    }
  }

  String updatePathExtension(fs.FileSaveLocation result) {
    var path = result.path;
    var activeFilter = result.activeFilter;

    if (activeFilter != null) {
      var extension = p.extension(path).replaceFirst('.', '');

      if (activeFilter.extensions!.contains(extension) == false) {
        path = '$path.${activeFilter.extensions!.first}';
      }
    }

    return path;
  }

  @override
  Widget build(BuildContext context) {
    if (selectedPath == null) {
      return ListTile(
        enabled: enabled,
        leading: const FaIcon(FontAwesomeIcons.folder),
        title: const Text('Select file'),
        onTap: onTap,
      );
    }

    var filename = p.basename(selectedPath!);
    var folder = p.dirname(selectedPath!);

    return ListTile(
      enabled: enabled,
      leading: const FaIcon(FontAwesomeIcons.folder),
      title: Text(filename),
      subtitle: Text(folder),
      trailing: IconButton(
        onPressed: enabled ? () => onSelect(null) : null,
        icon: const FaIcon(FontAwesomeIcons.xmark),
      ),
      onTap: onTap,
    );
  }
}

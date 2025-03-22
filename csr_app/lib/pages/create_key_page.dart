import 'dart:io';
import 'dart:isolate';

import 'package:basic_utils/basic_utils.dart';
import 'package:csr_app/logic/certificate_service.dart';
import 'package:csr_app/widgets/dialogs.dart';
import 'package:csr_app/widgets/file_selector.dart';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';

class CreateKeyPage extends StatefulWidget {
  const CreateKeyPage({super.key});

  @override
  State<CreateKeyPage> createState() => _CreateKeyPageState();
}

class _CreateKeyPageState extends State<CreateKeyPage> {
  var tecKeySize = TextEditingController(text: '4096');

  String? privateKeyPath;
  bool isLoading = false;

  void generatePrivateKey() async {
    setState(() => isLoading = true);
    try {
      String keySizeText = tecKeySize.text.trim();

      if (keySizeText.isEmpty) {
        throw Exception('Key size is required.');
      }

      int keySize = int.parse(keySizeText);

      if (keySize < 2048) {
        throw Exception('Key size must be greater than or equal to 2048.');
      }

      if (keySize > 8192) {
        throw Exception('Key size must be less than or equal to 8192.');
      }

      var certService = CertificateService();
      var keyPair = await generateRSAKeyPair(keySize);
      var pem = certService.encodeRSAPrivateKeyToPem(keyPair.privateKey);

      var file = File(privateKeyPath!);
      await file.writeAsString(pem);

      Dialogs.showShortSnackBar(this, 'Certificate private key is generated.');
    } catch (e) {
      Dialogs.showMessage(this, 'Error', e.toString());
    }

    setState(() => isLoading = false);
  }

  Future<AsymmetricKeyPair<RSAPublicKey, RSAPrivateKey>> generateRSAKeyPair(int keySize) {
    return Isolate.run(() {
      var certService = CertificateService();
      var keyPair = certService.generateRSAKeyPair(keySize: keySize);

      return keyPair;
    });
  }

  @override
  Widget build(BuildContext context) {
    bool enableGenerateButton = !isLoading && privateKeyPath != null;
    var textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Create certificate private key', style: textTheme.titleLarge),
          const SizedBox(height: 20),
          //
          Text('Key size (bits)', style: textTheme.bodyLarge),
          TextField(
            controller: tecKeySize,
            enabled: !isLoading,
            decoration: InputDecoration(
              isDense: true,
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 10),
          //
          Text('Output file', style: textTheme.bodyLarge),
          FileSelectorWidget(
            selectedPath: privateKeyPath,
            mode: FileSelectorMode.saveFile,
            enabled: !isLoading,
            acceptedTypeGroups: [
              XTypeGroup(label: 'PEM file', extensions: ['pem'])
            ],
            onSelect: (path) => setState(() => privateKeyPath = path),
          ),
          const SizedBox(height: 20),
          //
          Row(
            children: [
              if (isLoading) const CircularProgressIndicator(),
              if (isLoading) const SizedBox(width: 10),
              FilledButton(
                onPressed: enableGenerateButton ? () => generatePrivateKey() : null,
                child: const Text('Generate private key'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    tecKeySize.dispose();
    super.dispose();
  }
}

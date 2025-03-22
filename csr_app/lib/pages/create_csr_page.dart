import 'dart:io';

import 'package:csr_app/logic/certificate_service.dart';
import 'package:csr_app/models/csr_info.dart';
import 'package:csr_app/widgets/dialogs.dart';
import 'package:csr_app/widgets/file_selector.dart';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';

class CreateCsrPage extends StatefulWidget {
  const CreateCsrPage({super.key});

  @override
  State<CreateCsrPage> createState() => _CreateCsrPageState();
}

class _CreateCsrPageState extends State<CreateCsrPage> {
  var tecCommonName = TextEditingController();
  var tecOrganization = TextEditingController();
  var tecOrganizationalUnit = TextEditingController();
  var tecLocality = TextEditingController();
  var tecState = TextEditingController();
  var tecCountry = TextEditingController();

  String? privateKeyPath;
  String? csrPath;

  late List<TextEditingController> tecs;

  @override
  void initState() {
    super.initState();
    tecs = [tecCommonName, tecOrganization, tecOrganizationalUnit, tecLocality, tecState, tecCountry];
  }

  void generateCSR() async {
    try {
      var certService = CertificateService();

      var keyFile = File(privateKeyPath!);
      var keyPem = await keyFile.readAsString();

      var info = CSRInfo(
        commonName: tecCommonName.text.trim(),
        organization: tecOrganization.text.trim(),
        organizationalUnit: tecOrganizationalUnit.text.trim(),
        locality: tecLocality.text.trim(),
        state: tecState.text.trim(),
        country: tecCountry.text.trim(),
        keyPair: certService.decodeRSAKeyPairFromPem(keyPem),
      );

      var csr = certService.generateCSR(info);

      var file = File(privateKeyPath!);
      await file.writeAsString(csr);

      Dialogs.showShortSnackBar(this, 'Certificate signing request is generated.');
    } catch (e) {
      Dialogs.showMessage(this, 'Error', e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    bool enableGenerateButton = privateKeyPath != null && csrPath != null;
    var textTheme = Theme.of(context).textTheme;

    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Create certificate signing request', style: textTheme.titleLarge),
            const SizedBox(height: 20),
            //
            TextField(
              controller: tecCommonName,
              decoration: InputDecoration(
                isDense: true,
                label: Text('Common name'),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            //
            TextField(
              controller: tecOrganization,
              decoration: InputDecoration(
                isDense: true,
                label: Text('Organization'),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            //
            TextField(
              controller: tecOrganizationalUnit,
              decoration: InputDecoration(
                isDense: true,
                label: Text('Organizational unit'),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            //
            TextField(
              controller: tecLocality,
              decoration: InputDecoration(
                isDense: true,
                label: Text('Locality'),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            //
            TextField(
              controller: tecState,
              decoration: InputDecoration(
                isDense: true,
                label: Text('State'),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            //
            TextField(
              controller: tecCountry,
              decoration: InputDecoration(
                isDense: true,
                label: Text('Country code (ISO 3166-1)'),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            //
            Text('Private key file', style: textTheme.bodyLarge),
            FileSelectorWidget(
              selectedPath: privateKeyPath,
              mode: FileSelectorMode.openFile,
              acceptedTypeGroups: [
                XTypeGroup(label: 'PEM file', extensions: ['pem'])
              ],
              onSelect: (path) => setState(() => privateKeyPath = path),
            ),
            const SizedBox(height: 20),
            //
            Text('Output CSR file', style: textTheme.bodyLarge),
            FileSelectorWidget(
              selectedPath: csrPath,
              mode: FileSelectorMode.saveFile,
              acceptedTypeGroups: [
                XTypeGroup(label: 'CSR file', extensions: ['csr'])
              ],
              onSelect: (path) => setState(() => csrPath = path),
            ),
            const SizedBox(height: 20),
            //
            FilledButton(
              onPressed: enableGenerateButton ? () => generateCSR() : null,
              child: const Text('Generate certificate signing request'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    for (var e in tecs) {
      e.dispose();
    }
    super.dispose();
  }
}

import 'package:basic_utils/basic_utils.dart';

class CSRInfo {
  String commonName;
  String organization;
  String organizationalUnit;
  String locality;
  String state;
  String country;

  AsymmetricKeyPair<RSAPublicKey, RSAPrivateKey> keyPair;

  CSRInfo({
    required this.commonName,
    required this.organization,
    required this.organizationalUnit,
    required this.locality,
    required this.state,
    required this.country,
    required this.keyPair,
  });
}

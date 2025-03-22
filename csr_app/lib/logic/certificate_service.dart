import 'package:basic_utils/basic_utils.dart';

class CertificateService {
  AsymmetricKeyPair<RSAPublicKey, RSAPrivateKey> generateRSAKeyPair({required int keySize}) {
    var keyPair = CryptoUtils.generateRSAKeyPair(keySize: keySize);

    return AsymmetricKeyPair(
      keyPair.publicKey as RSAPublicKey,
      keyPair.privateKey as RSAPrivateKey,
    );
  }

  String encodeRSAPrivateKeyToPem(RSAPrivateKey key) {
    return CryptoUtils.encodeRSAPrivateKeyToPem(key);
  }
}

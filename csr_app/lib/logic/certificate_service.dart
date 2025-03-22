import 'package:basic_utils/basic_utils.dart';
import 'package:csr_app/models/csr_info.dart';

class CertificateService {
  AsymmetricKeyPair<RSAPublicKey, RSAPrivateKey> generateRSAKeyPair({required int keySize}) {
    var keyPair = CryptoUtils.generateRSAKeyPair(keySize: keySize);

    return AsymmetricKeyPair(
      keyPair.publicKey as RSAPublicKey,
      keyPair.privateKey as RSAPrivateKey,
    );
  }

  String generateCSR(CSRInfo info) {
    var keyPair = info.keyPair;
    var attributes = <String, String>{
      'CN': info.commonName,
      'O': info.organization,
      'OU': info.organizationalUnit,
      'L': info.locality,
      'ST': info.state,
      'C': info.country,
    };

    var csr = X509Utils.generateRsaCsrPem(
      attributes,
      keyPair.privateKey,
      keyPair.publicKey,
      signingAlgorithm: 'SHA-512',
    );

    return csr;
  }

  String encodeRSAPrivateKeyToPem(RSAPrivateKey key) {
    return CryptoUtils.encodeRSAPrivateKeyToPem(key);
  }

  AsymmetricKeyPair<RSAPublicKey, RSAPrivateKey> decodeRSAKeyPairFromPem(String pem) {
    var privateKey = CryptoUtils.rsaPrivateKeyFromPem(pem);
    var publicKey = RSAPublicKey(privateKey.modulus!, privateKey.publicExponent!);

    return AsymmetricKeyPair(publicKey, privateKey);
  }
}

podman run \
    --name ca \
    --hostname ca.example.com \
    --network example \
    --network-alias ca.example.com \
    -v $PWD/certs:/certs \
    -v $PWD/conf:/conf \
    -v $PWD/logs:/logs \
    -e PKI_DS_URL=ldap://ds.example.com:3389 \
    -e PKI_DS_PASSWORD=Secret.123 \
    -d \
    quay.io/dogtagpki/pki-ca:latest
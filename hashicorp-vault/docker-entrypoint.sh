#!/bin/sh
set -e

# Start Vault in the background
vault server -config=/vault/config/local.json &
VAULT_PID=$!

# Wait for Vault to start
echo "Waiting for Vault to start..."
sleep 5

# Export vault address
export VAULT_ADDR='http://127.0.0.1:8200'

# Check if already initialized
if vault status | grep -q 'Initialized.*true'; then
  echo "Vault is already initialized."
else
  echo "Initializing Vault..."
  vault operator init -key-shares=1 -key-threshold=1 > /vault/config/init-keys.txt
fi

# Extract unseal key and root token
UNSEAL_KEY=$(grep 'Unseal Key 1:' /vault/config/init-keys.txt | awk '{print $NF}')
ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/config/init-keys.txt | awk '{print $NF}')

# Unseal
vault operator unseal "$UNSEAL_KEY"

# Optional: Login (e.g. for scripting further setup)
vault login "$ROOT_TOKEN"

# Set environment variables from Docker
VAULT_USERNAME=${VAULT_USERNAME:-vaultuser}
VAULT_PASSWORD=${VAULT_PASSWORD:-changeme}

# Enable PKI
vault secrets enable -path=pki pki || echo "PKI already enabled"

# Set max TTL
vault secrets tune -max-lease-ttl=87600h pki

# Generate root certificate
vault write pki/root/generate/internal \
    common_name="example.com" \
    ttl=87600h > /vault/config/root-cert.json

# Configure URLs
vault write pki/config/urls \
    issuing_certificates="$VAULT_ADDR/v1/pki/ca" \
    crl_distribution_points="$VAULT_ADDR/v1/pki/crl"

# Enable userpass auth method
vault auth enable userpass || echo "userpass already enabled"

# Create a user
vault write auth/userpass/users/$VAULT_USERNAME \
    password="$VAULT_PASSWORD" \
    policies=default


# Bring Vault process back to foreground
wait $VAULT_PID

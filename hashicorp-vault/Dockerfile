FROM hashicorp/vault

COPY local.json /vault/config/local.json
COPY admin-policy.hcl /vault/config/admin-policy.hcl
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY .env /vault/config/.env

RUN apk add --no-cache jq curl \
 && chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

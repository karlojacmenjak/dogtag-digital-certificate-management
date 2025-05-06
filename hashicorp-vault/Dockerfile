FROM hashicorp/vault

COPY local.json /vault/config/local.json
COPY admin-policy.hcl /vault/config/admin-policy.hcl

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

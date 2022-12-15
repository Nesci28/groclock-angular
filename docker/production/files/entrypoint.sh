if [[ ! -z ${CLOUDFLARE_AUTHORIZATION} ]] && [[ ! -z ${CLOUDFLARE_ZONEID} ]]; then
  curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONEID}/purge_cache" \
    -H "Authorization: Bearer ${CLOUDFLARE_AUTHORIZATION}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
fi

nginx -g "daemon off;"
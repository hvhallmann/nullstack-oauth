export default {
  grants: ['authorization_code', 'refresh_token'],
  accessTokenLifetime: 60 * 60 * 4, // 4 hours
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
}
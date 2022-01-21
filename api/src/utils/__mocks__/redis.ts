/**
 * Redis connection utility mocks.
 *
 * When testing functions that use redis, make use of Jest module mocks.
 * https://jestjs.io/docs/mock-functions#mocking-modules
 */

// Export a mock.
export const redis = jest.fn()

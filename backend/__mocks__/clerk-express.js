// Mock for @clerk/express used in tests.
// By default, all requests are authenticated with a test user ID.
// Call setMockUserId(id) / clearMockUserId() to control auth state per test.

let _mockUserId = 'test_clerk_user_123';

export function setMockUserId(userId) {
    _mockUserId = userId;
}

export function clearMockUserId() {
    _mockUserId = null;
}

export function clerkMiddleware() {
    return (req, res, next) => {
        if (_mockUserId) {
            req.auth = { userId: _mockUserId };
        }
        next();
    };
}

export function requireAuth() {
    return (req, res, next) => {
        if (!req.auth?.userId) {
            return res.status(401).json('Unauthenticated');
        }
        next();
    };
}

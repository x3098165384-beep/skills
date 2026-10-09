# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer test DB)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

## Designing for Mockability

Use replacement points that production already needs, following [Testing and verification](TESTING-POLICY.md). Passing a client into a function is appropriate when actual callers own or select that client. Keep client creation inside the responsible production code when callers do not need to supply it.

When the application needs a shared client interface, give its operations the names and arguments production callers use:

```typescript
// Each operation names the behavior its callers need.
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// Callers must know how every endpoint works.
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

Choose between these shapes from production usage, not the convenience of a mock. Keep fake responses and test setup in test code. If no production replacement point exists, use an available integration check or report what remains unverified.

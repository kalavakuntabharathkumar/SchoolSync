# Query review notes

- Dashboard data is fetched through a single GraphQL operation.
- Resolver context creates request-scoped DataLoader instances to batch related entity lookups.
- Apollo Client uses its normalized in-memory cache and `cache-first` for dashboard reads.
- Query-count claims must be validated against a populated database and logged SQL statements; the README documents the measurement boundary.

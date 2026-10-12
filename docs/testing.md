# Testing and performance checks

Run `npm test` from the repository root. Extend the resolver tests with integration tests against a temporary SQLite database before production use.

For a query-count benchmark, enable SQL statement logging around the database adapter, execute the dashboard operation with a representative class roster, and count statements per request. Compare a cold-cache request with a repeated Apollo Client navigation to observe cache behavior.

# Ignore globs

List the tracked files that are generated, vendored, or built:

```bash
git ls-files | grep -iE \
  -e '(^|/)(generated|__generated__|vendor|vendored|third_party)/' \
  -e '\.(min\.js|min\.css|pb\.go|pb\.ts|g\.dart|generated\.[a-z]+)$'
```

Record one glob per folder or extension found, such as `**/generated/**` or
`**/*.pb.go`. Add one per folder that the project's lint or coverage
configuration lists as generated. Join them by commas with no space as
`<globs>`.

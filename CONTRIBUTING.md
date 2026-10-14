# Contributing

Thanks for helping improve the EKKE Slidev presentation starter.

## Development

Use Node.js 22.12 or newer and pnpm 11. Install the locked dependencies and check your changes with:

```sh
pnpm install --frozen-lockfile
pnpm build --base /slidev-template-check/
```

Keep the sample deck generic: do not add personal student data, private presentations, or institution artwork without permission. If a change updates dependencies, include the corresponding `pnpm-lock.yaml` changes.

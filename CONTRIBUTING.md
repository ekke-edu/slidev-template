# Contributing

Thanks for helping improve the EKKE Slidev presentation starter.

## Development

Use Node.js 22.12 or newer and pnpm 11. Install the locked dependencies and check your changes with:

```sh
pnpm install --frozen-lockfile
pnpm build --base /slidev-template-check/
```

Keep the sample deck free of personal student data and private presentations. The EKKE logo files are included as the template's default branding; for other artwork, include it only when its use is authorized. If a change updates dependencies, update both `pnpm-lock.yaml` and `generator-pnpm-lock.yaml`. The second file is included in the npm package so projects created by the CLI receive a frozen lockfile.

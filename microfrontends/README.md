# Archived microfrontend experiments

These three Create React App copies are retained only as historical Module Federation experiments. They are not part of GitScope's supported runtime, workspace, CI, or deployment:

- `chart-mfe` contains an early remote configuration.
- `graph-mfe` is an unintegrated placeholder.
- `shell-app` does not consume either remote.

The experiments intentionally remain outside the root npm workspace because they have independent lockfiles, duplicate build tooling, and React/toolchain versions that differ from the supported root application. Do not deploy them as GitScope.

If this architecture is revived, first write an integration contract, align all packages on one React/toolchain version, expose both remotes, configure the shell to consume them, add cross-package tests, and add explicit build jobs. Until then, develop and deploy the root `src/` application documented in the project README.

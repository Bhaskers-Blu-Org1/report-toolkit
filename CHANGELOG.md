# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.2](https://github.com/ibm/report-toolkit/compare/v0.1.1...v0.1.2) (2019-10-17)

**Note:** Version bump only for package report-toolkit-monorepo

## [0.1.1](https://github.com/ibm/report-toolkit/compare/v0.1.0...v0.1.1) (2019-10-17)

**Note:** Version bump only for package report-toolkit-monorepo

# 0.1.0 (2019-10-17)

### Bug Fixes

- **dev:** fix broken jsconfig.json ([390e568](https://github.com/ibm/report-toolkit/commit/390e5687e87674522ed57e7064a3938d8bc3e6f3))
- use nightly typescript ([6f1ff2e](https://github.com/ibm/report-toolkit/commit/6f1ff2ec07550954dcc919a19af532e99eb85478))
- **core:** refactor some stuff into an 'internal' module; closes [#32](https://github.com/ibm/report-toolkit/issues/32) ([90d0dea](https://github.com/ibm/report-toolkit/commit/90d0deafe1cb2e5e1d70dcf2859a64f137d67474))
- support third-party rules ([2d68eaf](https://github.com/ibm/report-toolkit/commit/2d68eafb302eff8dd506d562bca3762bba4c91c3)), closes [#32](https://github.com/ibm/report-toolkit/issues/32)
- **ci:** disable mirror for now ([43f6175](https://github.com/ibm/report-toolkit/commit/43f617522186e594fb0aafa53fb4b1710127b4c5))
- **ci:** fix another bad prop ([8a3e8bf](https://github.com/ibm/report-toolkit/commit/8a3e8bff38ca82dc5c16ba72fdf9de7564727a79))
- **ci:** fix another bad prop, again ([b835ee1](https://github.com/ibm/report-toolkit/commit/b835ee1743a90520b9920073f36dd6f12334b452))
- **ci:** fix bad prop ([fde8f4f](https://github.com/ibm/report-toolkit/commit/fde8f4f457fd057d789c7fa29b057217e06257af))
- **ci:** fix yet another bad prop ([895f7d5](https://github.com/ibm/report-toolkit/commit/895f7d58f32eb185158d6b79eacd37ec62d186ce))
- **ci:** try to run workflow mirror-action fork directly ([cb91414](https://github.com/ibm/report-toolkit/commit/cb91414cfa6af64e66c9617e874fe6e7c0008a66))
- fix config loading pipeline; closes [#27](https://github.com/ibm/report-toolkit/issues/27) ([2bca4a2](https://github.com/ibm/report-toolkit/commit/2bca4a21eef9d2343bee1c7eb3e28ddc7f44603a))
- **cli:** ensure stack-hash transformer works on CLI ([6f950ef](https://github.com/ibm/report-toolkit/commit/6f950efed160e67b32a01e77f9dc529b0739e656))
- **cli:** remove errant chars in table formatter; closes [#1](https://github.com/ibm/report-toolkit/issues/1) ([26919ea](https://github.com/ibm/report-toolkit/commit/26919ea9d289b1b55af114a58b64fb174563ba1a))
- **cli:** use proper exports from transform ([6c1fcaf](https://github.com/ibm/report-toolkit/commit/6c1fcafd90c1def74f38d586671f7bc13793d5b6))
- **common:** debug was memoizing too much ([b336561](https://github.com/ibm/report-toolkit/commit/b3365614e73e35db7229cf785c0de4b87cb0bf8d))
- **common:** fix bug introduced by cab080aa9377d4e86e3076a627f413eb18f4499e ([7301ed5](https://github.com/ibm/report-toolkit/commit/7301ed58a22a9ebe2053a3b911ba82526dccc29a))
- **common:** rename GnosticError to RTkError; closes [#20](https://github.com/ibm/report-toolkit/issues/20) ([6d7b952](https://github.com/ibm/report-toolkit/commit/6d7b95292aece55bd6cc4ace4e0a34f167db6d47))
- **inspector:** correct filepath cross-references in aggregate messages; closes [#18](https://github.com/ibm/report-toolkit/issues/18) ([dd81537](https://github.com/ibm/report-toolkit/commit/dd815375b2b4b7062039401caed4f124249fbcb5)), closes [#19](https://github.com/ibm/report-toolkit/issues/19)
- **pkg:** linting/tests were broken ([9dc9ec6](https://github.com/ibm/report-toolkit/commit/9dc9ec662f4c688cf4eb7fb53839a3267f037539))
- **pkg:** move resolve-pkg out of fs and into to devDeps of root ([abaea50](https://github.com/ibm/report-toolkit/commit/abaea506a7d3142eadb5319242a0883ba8bacf8f))
- **rules:** fix rules-helper ([ba5b3ec](https://github.com/ibm/report-toolkit/commit/ba5b3ecb08925a5bbd22dfdab3ec0763e5fa6ff6))
- **transformers:** fix cli test ([9510451](https://github.com/ibm/report-toolkit/commit/9510451de7dbe53cf151af209b061922e160b5b1))
- export RC_FILENAME, RC_NAMESPACE ([9710c0e](https://github.com/ibm/report-toolkit/commit/9710c0e923b1c29ad8ca052307abc40650c214ca))
- rename config files; refs [#20](https://github.com/ibm/report-toolkit/issues/20) ([ff67024](https://github.com/ibm/report-toolkit/commit/ff6702495bdae5a20b51ab48a9fa32dd5154e61a))
- rename packages/gnostic to packages/report-toolkit ([da6ec8a](https://github.com/ibm/report-toolkit/commit/da6ec8a31d520346b29b34ddd0c8da5512915b19))
- **redact:** add 'whitelist' option to redact; closes [#15](https://github.com/ibm/report-toolkit/issues/15) ([40c7ee8](https://github.com/ibm/report-toolkit/commit/40c7ee8691c1ccff40be789e42d00fa867ec7744))

### Features

- **docs:** add Breadcrumbs, Metadata & EmbedCode components for mdx ([a469109](https://github.com/ibm/report-toolkit/commit/a469109355105c341364295714c192c67fd0e173))
- **redact:** add --replace. needs tests bad ([0618fae](https://github.com/ibm/report-toolkit/commit/0618fae9bd2338ca9651315b91b4f70c7497bf9f))
- external plugin and rule-loading (WIP) ([d47df0a](https://github.com/ibm/report-toolkit/commit/d47df0a8dfef1419b5e019d74ec4019dca53e4ac)), closes [#32](https://github.com/ibm/report-toolkit/issues/32)
- **transformer:** add filter transformer ([458b585](https://github.com/ibm/report-toolkit/commit/458b5859cd065cd0859d0b89f49dcae7432c29ce))
- **transformers:** add stack-hash transformer; closes [#2](https://github.com/ibm/report-toolkit/issues/2) ([82e7332](https://github.com/ibm/report-toolkit/commit/82e73328551a8408dbe2963a3bb6d55b21ecf8ce))

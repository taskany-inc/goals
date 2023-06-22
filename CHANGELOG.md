# Changelog

All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit guidelines.

## [1.11.0](https://github.com/taskany-inc/issues/compare/v1.10.0...v1.11.0) (2023-06-22)


### Features

* **GoalPage:** redesign header, add criteria progress bar ([8f45cd4](https://github.com/taskany-inc/issues/commit/8f45cd4136f288b7c68d8074479485566534f6da))
* **GoalPreview:** redesign header, add criteria progress bar ([abc07cc](https://github.com/taskany-inc/issues/commit/abc07ccee057281c6f021b46d82d6ad295bd84a5))
* **ProjectListItemCollapsible:** add goals button ([0630b3f](https://github.com/taskany-inc/issues/commit/0630b3fd99704f135a71d6b118e4c578e2ece28d))
* **ProjectListItemCollapsible:** codereview changes ([eeb5b06](https://github.com/taskany-inc/issues/commit/eeb5b06c16f58025e4c88a6005650a18fe0e40fd))
* **ProjectListItemCollapsible:** component composition step 1 ([f29104d](https://github.com/taskany-inc/issues/commit/f29104dec22456ffde8a40f290ebf38aa9103f28))
* **ProjectListItemCollapsible:** fix css important style ([412f43f](https://github.com/taskany-inc/issues/commit/412f43f4002e0bfd91cc8de1b283082ba450e5bb))
* **ProjectListItemCollapsible:** fix toggle blinking ([e2f9386](https://github.com/taskany-inc/issues/commit/e2f938647a9c0f878796743ce0ca31ea21d3770f))
* **ProjectListItemCollapsible:** new components ([c46a735](https://github.com/taskany-inc/issues/commit/c46a735868f4aac2a807504687e5e4014f580ccd))
* **ProjectListItemCollapsible:** prisma project.getByIds endpoint ([a0634f8](https://github.com/taskany-inc/issues/commit/a0634f891d204a40e95b2524c0165757c3c72484))
* **ProjectListItemCollapsible:** remove props spread ([7b6eb2b](https://github.com/taskany-inc/issues/commit/7b6eb2b1a529bb097f3ba4ae85f89fec2bbb72ef))
* **ProjectListItemCollapsible:** support goals loading on click ([b9e0281](https://github.com/taskany-inc/issues/commit/b9e02812865657ff83db172ef3c7cecc134a8825))
* **ProjectListItemCollapsible:** support project loading status ([7c2dcb3](https://github.com/taskany-inc/issues/commit/7c2dcb37cd019a3be87af951a3e65d0abbe35aae))
* **RelativeTime:** no hover for unclickable timestamps ([afc0367](https://github.com/taskany-inc/issues/commit/afc03673d77c867d5387926f82c7d965779ce44b))
* **State:** add basic types ([f720922](https://github.com/taskany-inc/issues/commit/f720922cbc3a2104453f01783d96f6f203c17505))


### Bug Fixes

* **GoalHistory:** check prev and next estimate before push ([2dbf15d](https://github.com/taskany-inc/issues/commit/2dbf15dcbd0a16f3ab9e23a431fde2dbb956e5c6))
* **Goal:** unique constraint for scopeId ([ca34b45](https://github.com/taskany-inc/issues/commit/ca34b4544bfbb764ffbd30b536512dd86118ff87))
* **i18n:** exact pattern match in getLangClient ([fbca1b0](https://github.com/taskany-inc/issues/commit/fbca1b08ecae89c41ac41790e98f16d78749ab47))
* **package-lock.json:** fix dependency problem ([aa02327](https://github.com/taskany-inc/issues/commit/aa02327d1064de149cb0c37336bffb671b4dd357))
* **StateComment:** synchroniosly update goal and create comment next ([99acc58](https://github.com/taskany-inc/issues/commit/99acc5865163b91ecc80e16ef0b3e9cb903359c9))

## [1.10.0](https://github.com/taskany-inc/issues/compare/v1.9.0...v1.10.0) (2023-06-20)


### Features

* **GoalCreateForm:** goal button improvements ([e550f89](https://github.com/taskany-inc/issues/commit/e550f89393a97089426d80c24f8e47abccdca959))


### Bug Fixes

* **goal:** use max operator for new goal scopeId ([69975d1](https://github.com/taskany-inc/issues/commit/69975d1387b37b27933324d7a2634086c7b0cbdc))
* **PriorityDropdown:** use value not text ([c73e738](https://github.com/taskany-inc/issues/commit/c73e7383261f873318d3023ab8078b2d678cbfdd))

## [1.9.0](https://github.com/taskany-inc/issues/compare/v1.8.0...v1.9.0) (2023-06-19)


### Features

* **ColorizedMenuItem:** remove Dot ([8425003](https://github.com/taskany-inc/issues/commit/8425003b9f5af23444603e60c16cfe59a03fc6ba))
* **Dashboard:** move to / page ([d6db983](https://github.com/taskany-inc/issues/commit/d6db9831e6d1e3a6d106bd13585418f407c40e40))
* **EstimateComboBox:** added the ability to select the annual quarter ([d598801](https://github.com/taskany-inc/issues/commit/d598801bc6e5e097c52a4cd5f83e2f5837e580b1))
* **GoalAchievement:** add remove criteria action ([95e73f5](https://github.com/taskany-inc/issues/commit/95e73f5f48b395ec08b32011c0949addd74fd6e3))
* **GoalAchievement:** add title unique validate ([166eae5](https://github.com/taskany-inc/issues/commit/166eae5aa58ad6e2982a26f73b15cb8bc2e3ca05))
* **GoalAchievement:** new components CriteriaForm and GoalCriteria ([ed28037](https://github.com/taskany-inc/issues/commit/ed2803759f138ef8dba8c3ca728484c3ac8b6e20))
* **GoalAchievement:** new schema, validate, routes ([3c67ab9](https://github.com/taskany-inc/issues/commit/3c67ab9920bc9b2230aa427d6d7e3462a06c94c3))
* **GoalAchievement:** only owner or issuer can update state of criteria ([5bce0e0](https://github.com/taskany-inc/issues/commit/5bce0e0dc1d9d7b264d02681d2a71320a4c5e341))
* **GoalAchievement:** use new components in goal's preview and page ([d47fe6e](https://github.com/taskany-inc/issues/commit/d47fe6ea4d45205df31d3ec836328ccbe49c6c8e))
* **GoalListItem:** changed text style ([498b214](https://github.com/taskany-inc/issues/commit/498b214b68dad202384e9c4dc1590eb6cb6230f9))
* **GoalPage:** remove Dot ([6dffdd0](https://github.com/taskany-inc/issues/commit/6dffdd04d9566514888162f98534039a08a53dc6))
* introduce goals page with lazy load ([edf59c9](https://github.com/taskany-inc/issues/commit/edf59c937ff5d13d08c2fe0e07437adf548e38a1))
* **PriorityDropdown:** remove Dot ([e5c859f](https://github.com/taskany-inc/issues/commit/e5c859f2e33d775182acac56d80342cc97547075))


### Bug Fixes

* **GoalAchievement:** used components improvements ([b98a2c9](https://github.com/taskany-inc/issues/commit/b98a2c9c85a2de07d79b5cb2c9ce9c85820f5026))
* **GoalCriteria:** fix typo in TickCircleIcon ([0ca8d23](https://github.com/taskany-inc/issues/commit/0ca8d23b9f407844088cfdfdd36184d6344682d9))
* **GoalEditForm:** inferred types of update ([4eb932d](https://github.com/taskany-inc/issues/commit/4eb932d374b47a4ddc6d1e90036585934382485e))
* **GoalListItem:** accept nullable props ([9a41e61](https://github.com/taskany-inc/issues/commit/9a41e61dc93c2dc8c28fc03c3810cf76d9e49bd7))
* use MenuItem for PriorityFilter and PriorityDropdown ([51e16a3](https://github.com/taskany-inc/issues/commit/51e16a37ef4b5fa9d089f1d376b1f9abe8cd4aa1))
* **useHotkey:** use helper to not run hotkeys in editable fields ([407a0a6](https://github.com/taskany-inc/issues/commit/407a0a6f848919909b31ad4e07be6f754f8bb7ea))

## [1.8.0](https://github.com/taskany-inc/issues/compare/v1.7.0...v1.8.0) (2023-06-12)


### Features

* **CommentForm:** form redesign ([5bad2f0](https://github.com/taskany-inc/issues/commit/5bad2f0b04597fb73589825576a6bf72aaf8264d))
* **Goal:** create/edit forms redesign ([083b3a8](https://github.com/taskany-inc/issues/commit/083b3a809c011964fad4543f09938715ab47a7fa))
* **ProjectCreateForm:** reorder form components ([8bb15f4](https://github.com/taskany-inc/issues/commit/8bb15f477149bdc666341b482ac85978ccfad7f4))
* **State:** no hover if not clickable ([505457f](https://github.com/taskany-inc/issues/commit/505457ff8399f48f96335ceeea75197ea04a4568))


### Bug Fixes

* **HotkeysModal:** use ModalContent as container ([3814ac1](https://github.com/taskany-inc/issues/commit/3814ac19796f0aeaaecf36b02b3dac00502a6853))
* **search:** limit results for 5 items ([0dbc2a9](https://github.com/taskany-inc/issues/commit/0dbc2a90339209c29258348d826171ae322d070c))

## [1.7.0](https://github.com/taskany-inc/issues/compare/v1.6.0...v1.7.0) (2023-06-08)


### Features

* **EstimateComboBox:** shows current Q first and others in future ([a527a18](https://github.com/taskany-inc/issues/commit/a527a18e71035be6c75aedadee39fdd401ceb262))
* **GoalHistory:** new goal feed combined history and comments ([a60b960](https://github.com/taskany-inc/issues/commit/a60b9606100353624d5b55e9a41ee2a164ac9a50))
* **PageHeader:** add GlobalSearch ([fd52558](https://github.com/taskany-inc/issues/commit/fd52558ca45a4625e5ae076c6aa295702c6ab080))


### Bug Fixes

* **ActivityFeed:** pass comment state ([b23bfa5](https://github.com/taskany-inc/issues/commit/b23bfa5cea7daede41974598e8642e2bceaf1d24))
* **GoalHistory:** fix tags change record ([4881d7f](https://github.com/taskany-inc/issues/commit/4881d7f21ef3fc4cba41d021b1b742e972ad3eae))

## [1.6.0](https://github.com/taskany-inc/issues/compare/v1.5.1...v1.6.0) (2023-06-05)


### Features

* **Estimate:** change relation between `Goal` and `Estimate` ([b531f61](https://github.com/taskany-inc/issues/commit/b531f6143e5c3c6de8342ac628fdcada3d26f3be))
* **FiltersPanel:** add Issuer filter, [#1019](https://github.com/taskany-inc/issues/issues/1019) ([d596d9b](https://github.com/taskany-inc/issues/commit/d596d9b50682ba775d64ebe72d7aadbbd1e05956))
* **FiltersPanel:** add Participant filter, [#1020](https://github.com/taskany-inc/issues/issues/1020) ([0154ef6](https://github.com/taskany-inc/issues/commit/0154ef6678db265fef524301d44822acab06a3b7))
* **FiltersPanel:** add Starred and Watching filters ([f0093d0](https://github.com/taskany-inc/issues/commit/f0093d084981fe709fd33582aff593c226dd14e1))
* **FiltersPanelApplied:** show applied sort props ([197c4c8](https://github.com/taskany-inc/issues/commit/197c4c8cdbd383a68258a397f90dca2f182fb79d))
* **Goal:** comment with push state ([daa9ce5](https://github.com/taskany-inc/issues/commit/daa9ce51f616a40910c04ea2eb92f16da5402936))
* **GoalCreateForm:** added Dropdown near the button ([d6d28e3](https://github.com/taskany-inc/issues/commit/d6d28e38bb704ad1309f1d1c0cbeb28361091d99))
* **GoalListItem:** show starred and watching status ([124f3da](https://github.com/taskany-inc/issues/commit/124f3da7324fc149cafe98eba2bccc2ca250b12e))
* **GoalsGroup:** css grids ([88e202d](https://github.com/taskany-inc/issues/commit/88e202db3ae77b47cafb7f6e532c3bf6b19d49ac))
* **PageTitle:** show preset author ([2f2ed41](https://github.com/taskany-inc/issues/commit/2f2ed41e1093869c7c65812a69489d55e27476f7))
* **ProjectCreateForm:** added the ability to enter vowels in the project key ([832587d](https://github.com/taskany-inc/issues/commit/832587d788acc803ee893b81c2c3762cd58b852b))
* **ProjectListItem:** add new makup and fields ([c47696c](https://github.com/taskany-inc/issues/commit/c47696c8f2995bb07de8fd07b6fcc6d7efacf7a1))
* **ProjectListItem:** add new ProjectListItem to goals page ([7214d3c](https://github.com/taskany-inc/issues/commit/7214d3c6158da759c6137e10595da6eb071a12ae))
* **ProjectListItem:** fix types error ([d6370bb](https://github.com/taskany-inc/issues/commit/d6370bbd2a9eb819c3fdc90b1fd539139b3c9408))
* **RelativeTime:** added switching of date display type ([34e2dc6](https://github.com/taskany-inc/issues/commit/34e2dc6efe8a911e6861b1c114b987d8c685fdb4))
* **trpc:** provide starred and watching filters data ([dcf58dc](https://github.com/taskany-inc/issues/commit/dcf58dcae52440195344cfedd6043470ac8f11b2))
* **UserFilter:** current user is always first ([9778b98](https://github.com/taskany-inc/issues/commit/9778b98938fdcbe8ba6973a0caa8bd6ff36a5a82))


### Bug Fixes

* **CommentView:** date type does not change when clicking on child elements ([6217103](https://github.com/taskany-inc/issues/commit/6217103457eefc631b0b15b63e168b9f834f55e7))
* **Estimate:** change field name `createadAt` -> `createdAt` ([c34b895](https://github.com/taskany-inc/issues/commit/c34b895fad109a5888f8ff7f7b761859c4c4b21e))
* **FiltersPanelApplied:** do not show sort if no values ([4cff2ab](https://github.com/taskany-inc/issues/commit/4cff2abf60207dec081df80e12e533608f839a81))
* **GoalCreateForm:** use outline button in all cases ([23284b1](https://github.com/taskany-inc/issues/commit/23284b168d561431cdebac7e671810d0a886c55e))
* **GoalListItem:** remove unused keyset ([bd77251](https://github.com/taskany-inc/issues/commit/bd77251f07e2503fe630d0397f9ce74c261d744b))
* **GoalsPage:** view preset author if you are not author of it ([42936b9](https://github.com/taskany-inc/issues/commit/42936b9d7325f6afd8c237ad670d3f5ca044c929))
* **useUrlFilterParams:** reset preset w/o empty param, [#804](https://github.com/taskany-inc/issues/issues/804) ([d24463f](https://github.com/taskany-inc/issues/commit/d24463f2d1ed99bb0df1448501fd94ab20353f5e))

## [1.5.1](https://github.com/taskany-inc/issues/compare/v1.5.0...v1.5.1) (2023-05-30)


### Bug Fixes

* **GoalListItem:** bigger paddings for row ([4f3349c](https://github.com/taskany-inc/issues/commit/4f3349c4cde217228352c9953c35c738c0befe37))

## [1.5.0](https://github.com/taskany-inc/issues/compare/v1.4.0...v1.5.0) (2023-05-30)


### Features

* **GoalListItem:** new GoalListItem design ([2ada2bb](https://github.com/taskany-inc/issues/commit/2ada2bba31aee1f8d79836f28cc0374653a8a692))
* **GoalListItem:** paddings smaller ([6afab2c](https://github.com/taskany-inc/issues/commit/6afab2ca607edae8deaed72a8f07e455a66222ea))
* **GoalListItem:** state component instead of DotState ([3679f04](https://github.com/taskany-inc/issues/commit/3679f04a5890fe35ad85e8caf22d719e803d64da))


### Bug Fixes

* autofocus now works ([2cd1539](https://github.com/taskany-inc/issues/commit/2cd1539a1292f644006c44c2684d71e3326190f8))
* **GoalEditForm:** estimate is optional ([0ca3291](https://github.com/taskany-inc/issues/commit/0ca329177a31d066e0b5a38525f0c7e5309b73cb))
* **GoalHistory:** use strict type for records ([86a7455](https://github.com/taskany-inc/issues/commit/86a745527dd7c4aa8e3d8f78e718c0ff8e9d673f))
* **goal:** move goal to new project in update ([241562b](https://github.com/taskany-inc/issues/commit/241562b1ec4c919ee983b1dc8b6ca733ac0e48b0))
* **GoalsGroup:** common table for Goals groups ([7d6a30c](https://github.com/taskany-inc/issues/commit/7d6a30c6693e6232e873fa9c2e7beefc3017e64f))
* **project:** pass only id to connect property ([774582b](https://github.com/taskany-inc/issues/commit/774582b1754d11fa04a411ec6072dd40633a3823))
* shrink text ([3e5654b](https://github.com/taskany-inc/issues/commit/3e5654b27e266025435a54433e99fb83ac979864))

## [1.4.0](https://github.com/taskany-inc/issues/compare/v1.3.0...v1.4.0) (2023-05-29)


### Features

* **GoalHistory:** db schema and seed data ([1630024](https://github.com/taskany-inc/issues/commit/1630024c373e1be5d8bcaf3565a950062780b2c5))
* **GoalHistory:** recordings changes ([d81dc71](https://github.com/taskany-inc/issues/commit/d81dc71766c9cd4bc993676f7b48c9d6bd9c25dc))
* **GoalHistory:** recordings changes of state, participants and deps ([dac32ee](https://github.com/taskany-inc/issues/commit/dac32eed6d6dd2dfa5ac747aa28c33d124329569))
* **GoalHistory:** recordings ids as changed values ([6ab2ce5](https://github.com/taskany-inc/issues/commit/6ab2ce5683ea50a20a408a2f4a4013bf2d2f3c53))
* **GoalHistory:** rewrite seeding GoalHistory data ([19cab4d](https://github.com/taskany-inc/issues/commit/19cab4d25a13187b7abd5d5482edd61d62f7d8db))


### Bug Fixes

* **GoalHistory:** calculate typings of history ([c4780c1](https://github.com/taskany-inc/issues/commit/c4780c1aba0c693fcd87fd66034e8fd7d1dbd943))
* **GoalHistory:** query for history, drop unreachable code ([23bf3a7](https://github.com/taskany-inc/issues/commit/23bf3a718e3fddd1da41cfd79d693ff55a54ed39))
* **Goal:** use count instead of max ([faefb5b](https://github.com/taskany-inc/issues/commit/faefb5bc489a783350717b929a61f7a45157a186))
* **worker:** incorrect path to runner ([8137345](https://github.com/taskany-inc/issues/commit/8137345cbf9cdb11920d92887b7cade2d28e76e3))

## [1.3.0](https://github.com/taskany-inc/issues/compare/v1.2.0...v1.3.0) (2023-05-25)


### Features

* **FiltersPanel:** support sort filter ([6e0dd45](https://github.com/taskany-inc/issues/commit/6e0dd453da093dd4295dac51a4b01535d3bbceb6))
* **Goal:** sort by updatedAt by default ([fbfd6a6](https://github.com/taskany-inc/issues/commit/fbfd6a6e43339cb7158ba9e50355a7b3837cd51b))


### Bug Fixes

* **Goal:** use shortId to confirm deleting ([f58a01a](https://github.com/taskany-inc/issues/commit/f58a01a0c6194c30db0b85b7e0c4d989f005cfc6))
* **IssueDependenciesForm:** scopedId in input field ([6bfb74e](https://github.com/taskany-inc/issues/commit/6bfb74e44f28c36d856ca692b46922df4fe68142))

## [1.2.0](https://github.com/taskany-inc/issues/compare/v1.1.0...v1.2.0) (2023-05-23)


### Features

* **Goal:** change project with scope id ([eb81fdd](https://github.com/taskany-inc/issues/commit/eb81fdd7f1477e5a442160d276c0c0ef2bf67088))
* **Goal:** create id in project scope ([2825ded](https://github.com/taskany-inc/issues/commit/2825ded06c301a2b5f2d2c6632e4982c4c21c13c))


### Bug Fixes

* **FiltersPanelApplied:** incorrect space position ([57c5658](https://github.com/taskany-inc/issues/commit/57c5658d1e8cceedc7aa66899b2b3347210b0c8d))

## [1.1.0](https://github.com/taskany-inc/issues/compare/v1.0.0...v1.1.0) (2023-05-22)


### Features

* add background queue ([b658eef](https://github.com/taskany-inc/issues/commit/b658eefde49fd1e076c292ac7271ceb52829bd1a))
* bricks component filterPanel ([cda5426](https://github.com/taskany-inc/issues/commit/cda54267b92452780a2fef60b471b7c28127f069))
* **Goal:** goal project parents owners can edit goal ([b7319af](https://github.com/taskany-inc/issues/commit/b7319af3b161b72f90de4b66837545f2cae260e5))
* react and react-dom are externals by default ([36a8552](https://github.com/taskany-inc/issues/commit/36a855278d3d0579927fae0645307724b88020ed))
* **trpc:** filter router ([7f49408](https://github.com/taskany-inc/issues/commit/7f49408b38c28fcb8dd8b18958175584a41aa2b6))


### Bug Fixes

* do not show empty values in applied filters ([eff70c8](https://github.com/taskany-inc/issues/commit/eff70c8380e613d30305b1b02c79fbbe0d726d23))
* **GoalPage:** wrap content in dropdown items ([9597243](https://github.com/taskany-inc/issues/commit/95972432780b7460af92bb94cb8e1cce1efafef2))
* **GoalPreview:** automatically open early opened GoalEditForm modal ([a522646](https://github.com/taskany-inc/issues/commit/a52264644ac63911253914e86c691a8e403954bb))
* **GoalsPage:** check query params ([7d7a3bf](https://github.com/taskany-inc/issues/commit/7d7a3bf2e3dcc248e0a43ad4b0a9032e92bdd4aa))
* **GoalsPage:** hook call without condition ([303dfde](https://github.com/taskany-inc/issues/commit/303dfdeb75423d2b1880dd6e6959daa5f3ca7a74))
* **GoalsPage:** restore gql ssr data ([39e4a4f](https://github.com/taskany-inc/issues/commit/39e4a4fecc334c145f699c9ac3df448a2375b2d7))
* **i18n:** unused translations keys ([cdbf82d](https://github.com/taskany-inc/issues/commit/cdbf82d9a0a5d970867b11707c157d38134b821f))
* invalidate goal and project cache after clicks by watch or star buttons ([bd1a611](https://github.com/taskany-inc/issues/commit/bd1a611ef1e5cfb36837069b085dbbf23f05bfc1))
* move prod modules to prod section ([25e58c1](https://github.com/taskany-inc/issues/commit/25e58c10fa91d284fad9108e786e68e536f6c51b))
* **next:** adapt config to work with prod modules only ([3db0934](https://github.com/taskany-inc/issues/commit/3db0934633d843774d70d5771d5601e165be0fa0))
* **NotificationsHub:** migrate all request ([f761ef3](https://github.com/taskany-inc/issues/commit/f761ef3656a7d865f6188d16f4866328a2d5beeb))
* **ProjectPage:** restore gql ssr data ([340cc21](https://github.com/taskany-inc/issues/commit/340cc21e29dc68544122458aa0f2907413c2e970))
* run publish if new release notes ([83ce8bf](https://github.com/taskany-inc/issues/commit/83ce8bfe0c354216b948a6845573868b3f1bec87))
* **sentry:** correct Sentry plugin usage ([5cdcc52](https://github.com/taskany-inc/issues/commit/5cdcc52cb6747889ef393da2836ec936462ea657))
* **Sentry:** up to date configs ([3d2ec7a](https://github.com/taskany-inc/issues/commit/3d2ec7a65f394c63e064ae7c8c12f6e8d7a0e5a0))
* **trpc:** add transformer to ssr helper ([e25ce14](https://github.com/taskany-inc/issues/commit/e25ce14320ca24c500c785189721e63eab08054a))
* vulnerabilities audit ([fd282d1](https://github.com/taskany-inc/issues/commit/fd282d1fdce960d59c0be8fca7ac006af5cd86fe))

## 1.0.0 (2023-04-27)


### ⚠ BREAKING CHANGES

* drop team table
* remove teams from gql resolvers
* remove teams docs
* remove teams support
* drop other part of teams components
* replace teams explore with projects in Header menu
* drop useless routes
* drop teams pages and components
* disable e2e in GH workflows

### Features

* [@bricks](https://github.com/bricks) form elements integration ([d85ae14](https://github.com/taskany-inc/issues/commit/d85ae147e41a6d915622d3e6191a379c2c50e2a6))
* @taskany/colors integration ([8c34dc1](https://github.com/taskany-inc/issues/commit/8c34dc1690c4b1e40e1fc999d6870cda17718379))
* <Md> from @taskany/bricks ([f511c06](https://github.com/taskany-inc/issues/commit/f511c06108eda393e8b19baf4da9d8264e723c05))
* add PageTitle ([8988050](https://github.com/taskany-inc/issues/commit/89880501920b244efda7002aa6a98c0017771c56))
* add PresetFilterDropdown ([f14944c](https://github.com/taskany-inc/issues/commit/f14944cf2bab7c67d4c842328c6ddf2d30719989))
* add PriorityFilterDropdown ([e4ade97](https://github.com/taskany-inc/issues/commit/e4ade97b1655b2da1b61db98409d5824ec54d86d))
* Add PriorityText component ([d4e56cf](https://github.com/taskany-inc/issues/commit/d4e56cfd42839bf1241204bc315a6afad2493765))
* add routing progress ([9a09043](https://github.com/taskany-inc/issues/commit/9a09043f4109a4305815971645557db2101bae53))
* Badge, Button, Card, CleanButton, ComboBox, Dot from bricks ([618d9b0](https://github.com/taskany-inc/issues/commit/618d9b02820ac314946b91a0d7943fde3aa5d5b3))
* **ComboBox:** support groups ([04b3826](https://github.com/taskany-inc/issues/commit/04b38261577086ae7115311af79c34c230d71b8a))
* connect npm package @taskany/bricks ([5dcbb1b](https://github.com/taskany-inc/issues/commit/5dcbb1b8b25aafde8484406d93fe51062ca74d75))
* Dropdown, Fieldset, Footer, Input, InputContainer, Link, SheepLogo integration ([76c302d](https://github.com/taskany-inc/issues/commit/76c302dcc6aec3ffe3c1ad92cc98296d9441e9bf))
* **EstimateFilterDropdown:** user can filter goals via estimates ([a9e044b](https://github.com/taskany-inc/issues/commit/a9e044bb5c026e488f901b4fedc02d05341bf5f5))
* fetch, create, delete custom filters ([1b9182c](https://github.com/taskany-inc/issues/commit/1b9182c9ea817503d39dc6bddf2b68a2a5edc346))
* **Filter:** add model and resolver ([9c10e53](https://github.com/taskany-inc/issues/commit/9c10e530a0bdc3399950af22d0f99b30ef65e095))
* **FiltersPanel:** add projects filter ([6ad298e](https://github.com/taskany-inc/issues/commit/6ad298e6d87aa59053e420e2c1c64ad774d3f931))
* **FiltersPanel:** reset button ([0cff0b8](https://github.com/taskany-inc/issues/commit/0cff0b8ab0c18f34ca44fe51b5ecca7a57a988af))
* **Filter:** star/unstar not owned filters ([ff51e2f](https://github.com/taskany-inc/issues/commit/ff51e2f9653f7e37c42fad01af424141ca9b2d59))
* FormEditor translations ([22b0d1e](https://github.com/taskany-inc/issues/commit/22b0d1ea850685384693465b21f050c4fded787e))
* FormMultiImport component ([83cd385](https://github.com/taskany-inc/issues/commit/83cd385c3d5c434c6b8b807f0f7302c30e25702f))
* global create button ([99ac5f8](https://github.com/taskany-inc/issues/commit/99ac5f8846eb15ec282a76a5c45ede7f8148e8ab))
* **Goal:** add archived field to model and filters ([c29c567](https://github.com/taskany-inc/issues/commit/c29c5673609981222dc93dea15cffe8df3ac5cc9))
* **Goal:** allow user to delete goals ([da13117](https://github.com/taskany-inc/issues/commit/da131174ada892ede371633d4af25326ead9266c))
* **GoalEditForm:** allow move goal btw project and team ([641e728](https://github.com/taskany-inc/issues/commit/641e728cb6ae46b7d43bb50e80446add952e23b8))
* **GoalEditForm:** move goal btw projects ([5b67642](https://github.com/taskany-inc/issues/commit/5b6764267ffeba33e789be0bd1b9bcab12cd28ef))
* **GoalList:** click on tag adds it to filter ([1dfe44f](https://github.com/taskany-inc/issues/commit/1dfe44fb61a4d20c2e4a50bfadd56738f973b6d5))
* **GoalListItem:** show priority ([f11a0f5](https://github.com/taskany-inc/issues/commit/f11a0f50b0a96cb245e9843b7e699eb7b8b48c89))
* **GoalPreview:** allow edit goal from preview ([94b11f5](https://github.com/taskany-inc/issues/commit/94b11f56a5ea3f675c92b53e830f4bdbc6c7353b))
* **Goal:** show team goals on dashboard ([3b38b73](https://github.com/taskany-inc/issues/commit/3b38b7392132a54e60f104de910d4e48c28239c9))
* **Goal:** show team info on goal page ([ae0c2c7](https://github.com/taskany-inc/issues/commit/ae0c2c770c88f1b0ed73f5e64ab091acca803d76))
* **Goal:** show teams of goal project ([a70850b](https://github.com/taskany-inc/issues/commit/a70850b71d3ac7f2c85e498334114e53f9bccf94))
* **Goal:** support creating goals for Team ([8555e54](https://github.com/taskany-inc/issues/commit/8555e54d587c61dba6adc1a2df92fa247df43a4a))
* helper string with current filter values ([245e613](https://github.com/taskany-inc/issues/commit/245e6130609a799cb1e93539e16d44a74288beac))
* hooks from @taskany/bricks ([b2bd415](https://github.com/taskany-inc/issues/commit/b2bd415fe76fd5d505bcf0fd0b1279b383e1d4c6))
* Icon, Modal and depended ([c3778ba](https://github.com/taskany-inc/issues/commit/c3778bab61947a25cca9479d22aff48b7d1d4f1e))
* include project/team title/desctiprion to search fields ([cd43264](https://github.com/taskany-inc/issues/commit/cd43264dacb64d4e870889166445dfc7ffb3ec79))
* integrate custom filters on dashboard ([3d54b03](https://github.com/taskany-inc/issues/commit/3d54b03c81a48cb54c76cc53b55d7102f0d868f0))
* integrate custom filters on project page ([c1f5460](https://github.com/taskany-inc/issues/commit/c1f5460af0988b2f75b3d208cc408d5408159e43))
* integrate StateDot, MarkedListItem from [@bricks](https://github.com/bricks) ([8b623e4](https://github.com/taskany-inc/issues/commit/8b623e4b4390237050f6493a3e352718c782ca78))
* migrate to easy-typed-intl (Comments components) ([8bc0434](https://github.com/taskany-inc/issues/commit/8bc04349c6cb3680bf6c8e64d5a3fcde23196c41))
* migrate to easy-typed-intl (Common components) ([90b7a53](https://github.com/taskany-inc/issues/commit/90b7a53bc5a4e428c8af922de121e9f2703a7b8f))
* migrate to easy-typed-intl (drop next-intl) ([8d0f0e7](https://github.com/taskany-inc/issues/commit/8d0f0e765335af23a53c7fa3730b7ef81dedc0f3))
* migrate to easy-typed-intl (fix merge conflicts) ([a463239](https://github.com/taskany-inc/issues/commit/a4632392b1ca9bf330a503946628ac438074e09f))
* migrate to easy-typed-intl (Goals components) ([478300b](https://github.com/taskany-inc/issues/commit/478300b903492b724b5898914d876a1ddd2d5b7e))
* migrate to easy-typed-intl (Issues components) ([f507bdf](https://github.com/taskany-inc/issues/commit/f507bdfe3032bed3eb15370ee9e53d21a88d4a7d))
* migrate to easy-typed-intl (Projects components) ([4d730e9](https://github.com/taskany-inc/issues/commit/4d730e9d905695c997b00ed6025feb09c64989cc))
* **NotificationsHub:** one way to notify users ([e9cd83a](https://github.com/taskany-inc/issues/commit/e9cd83abeb91a602d0fe234637a8728955dd1d7e))
* PageHeader blocks from @taskany/bricks ([4c56ed4](https://github.com/taskany-inc/issues/commit/4c56ed4cb1721d92cc664b339c6b2ae2d97784b9))
* **Project:** add teams editing on project settings ([0c3e11d](https://github.com/taskany-inc/issues/commit/0c3e11db6ec6a882428ffd8cafd1cb341a4e4bc0))
* **Project:** show teams on project page ([31f5c6c](https://github.com/taskany-inc/issues/commit/31f5c6cea5fcaa3286912af5060dc151a820802b))
* **Project:** user can transfer ownership ([56591bb](https://github.com/taskany-inc/issues/commit/56591bb541f6c04338e7e06e3b2cbcf5e890e325))
* support priority filter in resolvers ([95fa077](https://github.com/taskany-inc/issues/commit/95fa077f0f513ddf7f7be161d67393f5f21880a5))
* **Team:** add flow field ([1f91cd8](https://github.com/taskany-inc/issues/commit/1f91cd8f16a6e3731e333cf2a0d0a27015863f1e))
* **Team:** add projects on team settings ([35735d3](https://github.com/taskany-inc/issues/commit/35735d37063c88693a8a9d96daabcf62a9fd8d0c))
* **TeamCreateForm:** add flow field ([82e89ed](https://github.com/taskany-inc/issues/commit/82e89edc01a603af4835c58ccccc5873a73a7323))
* **TeamCreateForm:** add key field ([7fb88e0](https://github.com/taskany-inc/issues/commit/7fb88e0133f8aaccd43e4d1b345afa0cc6158b98))
* **Team:** show team goals on team page ([da0c10b](https://github.com/taskany-inc/issues/commit/da0c10b1a1c6fcadfa565fbaa6a224df5b88283a))
* **Team:** user can delete team ([93af986](https://github.com/taskany-inc/issues/commit/93af986879913c6f1edc6d6d6057770bad7395aa))
* **Team:** user can transfer ownership ([cbe05f9](https://github.com/taskany-inc/issues/commit/cbe05f93b89ecc36329bbb934c67992f69d10eaa))
* Text, Popup from bricks ([beefe4b](https://github.com/taskany-inc/issues/commit/beefe4b29175ce72cecfad396ef603d895fc4b89))
* top level projects in explore ([a5c5a38](https://github.com/taskany-inc/issues/commit/a5c5a38c42f88d25b99a3be1206a367e015ac19e))
* universal WatchButton and StarButton ([943f5d1](https://github.com/taskany-inc/issues/commit/943f5d13fb17bc0ea2ca6674310b567d148fb382))
* Update bricks, remove extra dependencies ([9d70e2d](https://github.com/taskany-inc/issues/commit/9d70e2d290e1f122dc91a2d865425caf98f777fa))
* **User:** clear local storage from settings page ([b28d430](https://github.com/taskany-inc/issues/commit/b28d4309ce1e7d3f0dbcaa2a87ce3bc20e5f11dd))


### Bug Fixes

* **auth:** keykloak extra field ([9339e9f](https://github.com/taskany-inc/issues/commit/9339e9f12b8158c26d8ecd54089b3a6198dd3869))
* **auth:** return rest params ([6233b97](https://github.com/taskany-inc/issues/commit/6233b978445d334b3892dcc8283f98d3b1d886b4))
* **Button:** pointer if onClick provided only ([3de2663](https://github.com/taskany-inc/issues/commit/3de2663e9b3033cdc37fd2e86c70fd586e45749f))
* Buttons markup error ([ae98de2](https://github.com/taskany-inc/issues/commit/ae98de2e61958068e989da27eea7a35c141c1bfa))
* **Button:** use bkg color as text color in focus mode ([2e19882](https://github.com/taskany-inc/issues/commit/2e19882670c620d64ccb29447dfbc11cfd713f28))
* Comment should be reset after submit ([ebfa1ec](https://github.com/taskany-inc/issues/commit/ebfa1ec6d407a2e1da91df17c2cac5a77f86a18f))
* **CommentCreateForm:** incorrect goalId ([489521d](https://github.com/taskany-inc/issues/commit/489521d4d9f27a40b5c957fc5d2485c527404857))
* **Comment:** do not sent activityId with comment data ([a0dcad2](https://github.com/taskany-inc/issues/commit/a0dcad2ffc366cda6ceeecb9383fe54c6ce983b1))
* **Comment:** find activity not user ([d89ad35](https://github.com/taskany-inc/issues/commit/d89ad3577155d8cde0a205a04b66f663d086add2))
* **CommentView:** remove double comment description in edit mode ([cc2ab31](https://github.com/taskany-inc/issues/commit/cc2ab316c0d683dfe0e332bd1785726dbcb7a2cb))
* **CommentView:** remove user-select: none ([421112e](https://github.com/taskany-inc/issues/commit/421112e075a0a89c9adac36e773f8d33d6ed0871))
* **CommonHeader:** allow multiline title ([58eca91](https://github.com/taskany-inc/issues/commit/58eca91b8fb84058b34eb1f318b288522ad9389b))
* **CommonHeader:** do not show title attr for header ([64eeb53](https://github.com/taskany-inc/issues/commit/64eeb53d9d9e36a9a094d025eaabd5b614f3ddf0))
* **Dashboard:** get recommended flow from db ([eeb5a09](https://github.com/taskany-inc/issues/commit/eeb5a094d2cc447f8342d76da92db1cf9a08aaf0))
* **Dashboard:** incorrect projects map ([756a8e1](https://github.com/taskany-inc/issues/commit/756a8e135de2fc985c5f9f11589490ce2962f301))
* **dateTime:** list of available years for this year ([afca1d5](https://github.com/taskany-inc/issues/commit/afca1d5057a1ddbe3509ca2cdae8eda5137e3224))
* **FiltersPanel:** clean url if no filters ([131d330](https://github.com/taskany-inc/issues/commit/131d3300f9609dee0ea3a44d005b6256adcff328))
* **FiltersPanel:** debounce search input ([274a3ea](https://github.com/taskany-inc/issues/commit/274a3ea1d4e22117f9b671fb15fe333af7de3f1c))
* **FiltersPanel:** get/set right search params ([aa35082](https://github.com/taskany-inc/issues/commit/aa350821ceb5028781acd8117b418c72064767fb))
* **FiltersPanel:** show zero count ([4c8c012](https://github.com/taskany-inc/issues/commit/4c8c012f8e351cd0ec0c3f789f3413b83e582818))
* get goal comments count in same way ([24d420b](https://github.com/taskany-inc/issues/commit/24d420bf32e9ae776cb75675cbf4717e991c81a3))
* **Goal:** check projectId in transfer branch ([bc4d7fc](https://github.com/taskany-inc/issues/commit/bc4d7fc16acb4da2eae278586d5650a8f1d0188d))
* **Goal:** correct userGoals compilation ([f49707b](https://github.com/taskany-inc/issues/commit/f49707be9d2a428bd002a5861180541aeccfb935))
* **GoalEditForm:** update i18n ([de63bd6](https://github.com/taskany-inc/issues/commit/de63bd657e4ff1d4e5afae40af030b1f8adb5004))
* **GoalForm:** button positions via priority ([607b6a8](https://github.com/taskany-inc/issues/commit/607b6a8eab4734e67e1553ebabc22af7d86689fd))
* **GoalForm:** correct tags container position ([f8f9c16](https://github.com/taskany-inc/issues/commit/f8f9c162b03551e3ae0509460f21d1422d16f6eb))
* **GoalForm:** pass key for team and project to cache ([b13f348](https://github.com/taskany-inc/issues/commit/b13f348738faaa083cdb1c58dd348fbd74964dbf))
* **GoalForm:** sync tags container background ([5c0f17c](https://github.com/taskany-inc/issues/commit/5c0f17cc3d7c6d3dfb4c95f820da1df2cfb688a2))
* **Goal:** incorrect btw projects move logic ([47e8bff](https://github.com/taskany-inc/issues/commit/47e8bff1f0bb4aff2dd6f7e7aa2051f3e026f11d))
* **Goal:** incorrect filters order ([fff83cc](https://github.com/taskany-inc/issues/commit/fff83cc9fe20fa933b1f23fdc2b188ba721157d3))
* **GoalParentComboBox:** check value to get right button text ([f28fcdc](https://github.com/taskany-inc/issues/commit/f28fcdc216b086ae038df4b17838bb06ae0fb15c))
* **GoalPreview:** adapt height for long goal titles ([19c333c](https://github.com/taskany-inc/issues/commit/19c333c77dec53ac86f470c2d44436ba34240ab5))
* **GoalPreview:** clean state after deleting ([8bfa6da](https://github.com/taskany-inc/issues/commit/8bfa6da25ffb976b084d48846fd22b07c4bf1eca))
* **GoalPreview:** not show dot in header if no teams ([f00a4be](https://github.com/taskany-inc/issues/commit/f00a4bed16a01c1c8bc36f2a2d3077674925542f))
* **Gravatar:** pass classname and default src props ([9f55ac0](https://github.com/taskany-inc/issues/commit/9f55ac031a731c901a30155968a41e98566a8225))
* **Gravatar:** set image src after mount ([1cb0bf4](https://github.com/taskany-inc/issues/commit/1cb0bf40c7d54836c5f764360c79d85f6e37fb69))
* **Header:** rename Goals to Dashboard ([b67ed5c](https://github.com/taskany-inc/issues/commit/b67ed5c759f27ea3749f3be11a8908d97fe7b4e4))
* hydration errors by rendering ([e1fc159](https://github.com/taskany-inc/issues/commit/e1fc1595f1bde3534730d6b3ca8e8dc86786aa2d))
* hydration errors by rendering ([d8245af](https://github.com/taskany-inc/issues/commit/d8245af1d57d91ba5e192ada71be20c8909b36f8))
* **i18n:** tag successfully created message ([44f2524](https://github.com/taskany-inc/issues/commit/44f2524baa6e044486ad9ce1ff3f12a362e95020))
* **IssueListItem:** remove incorrect flex style ([33f5588](https://github.com/taskany-inc/issues/commit/33f55882f9939cd12a5fd1a3e1abc0065e8a70f2))
* **IssueListItem:** wrap StateDot ([4acb23e](https://github.com/taskany-inc/issues/commit/4acb23e15719cf44729a7a6c3e3db0003513c9e4))
* **IssueParent:** correct parent hierarchy ([6b42deb](https://github.com/taskany-inc/issues/commit/6b42deb10ed02b903919b934e7c8baec6018e88a))
* **IssueParticipants:** use Modal layout components ([eebc40a](https://github.com/taskany-inc/issues/commit/eebc40a3d381f3eb09bde0b76cb7ca11851f028b))
* key validation in team and project creating forms ([4696e2e](https://github.com/taskany-inc/issues/commit/4696e2eaebf7cd579394501dc5e6452c6211fd90))
* **keyPredictor:** remove unicode symbols ([2ff1c7f](https://github.com/taskany-inc/issues/commit/2ff1c7f6cbd63b05e73854d15afa3fe0ff48ea41))
* **keyPredictor:** support ru lang ([c178825](https://github.com/taskany-inc/issues/commit/c17882526fb32a5cd5384e9007a923ca7e8609e9))
* **LimitFilter:** default 100 ([c9ed40d](https://github.com/taskany-inc/issues/commit/c9ed40df959eb14775a249cc536c1e7e6ada6810))
* **LimitFilterDropdown:** remove default value ([30cbaba](https://github.com/taskany-inc/issues/commit/30cbaba9f729532516b367491c55c3e22edb7131))
* **LimitFilterDropdown:** remove dublicated item ([c3aae34](https://github.com/taskany-inc/issues/commit/c3aae346d9fd0a40138bd1af6719017266c92a8c))
* **NotificationsHub:** no carry ([e75093d](https://github.com/taskany-inc/issues/commit/e75093def5d120f893bc4e797c7bb914058b0d67))
* **notifyPromise:** strict type for result ([b1e2dc9](https://github.com/taskany-inc/issues/commit/b1e2dc9019c15a3a7ee462d116cd26d394a49cc1))
* **Page:** remove padding from PageContent ([49d2b8e](https://github.com/taskany-inc/issues/commit/49d2b8e545a864b0c0f429652ef977ca5a2f3d6d))
* **PageTitle:** pointer if onClick passed only ([1aacb16](https://github.com/taskany-inc/issues/commit/1aacb16b1b0fa658746301fd5b0307f8b906617e))
* priority types ([939d27a](https://github.com/taskany-inc/issues/commit/939d27a7e0fc3cdd8b7f360317bf5ae0b1f3a676))
* **prisma:** skip ghost logic for users without invite ([5e6a17e](https://github.com/taskany-inc/issues/commit/5e6a17e0148a03c0b1e3c9dd16771bbf90bccf77))
* **Project:** do not cast id to number ([966d4c3](https://github.com/taskany-inc/issues/commit/966d4c3bae2280bf06edf7643cd0634895bf3ac3))
* **ProjectHeader:** wrap but not ellipsis ([9012e50](https://github.com/taskany-inc/issues/commit/9012e5093317c9598b37ffabc96f3ae42016a326))
* **ProjectPageLayout:** add comma btw teams in title ([1997c72](https://github.com/taskany-inc/issues/commit/1997c722f036a07daa714ba834982ddc3ed94007))
* **ProjectPageLayout:** add right key for links in TabsMenu ([63a7d67](https://github.com/taskany-inc/issues/commit/63a7d672b9efa94dd44987efe232ec488d23474f))
* **ProjectPageLayout:** compare paths without query string ([3263769](https://github.com/taskany-inc/issues/commit/32637691fc6426838a2ac58f487167f7354a1bcb))
* **ProjectPageLayout:** do not show watch/star actions on settings page ([d74e9cc](https://github.com/taskany-inc/issues/commit/d74e9ccf4987ead2da0978d66be1c6e089857917))
* **ProjectPage:** pass flowId to LS cache ([25275f5](https://github.com/taskany-inc/issues/commit/25275f54d10a344fcbbb3522d13052869032090e))
* **Project:** pass search query to resolvers ([87b162f](https://github.com/taskany-inc/issues/commit/87b162f45f0cd4199f15b87bf66614c657967427))
* **Project:** remove slug fields from fetcher ([e6e16b5](https://github.com/taskany-inc/issues/commit/e6e16b5cf403eb7d6924206a830bd9f8316bcc23))
* **ProjectSettingsPage:** add title to layout ([3f59bec](https://github.com/taskany-inc/issues/commit/3f59beceae21fb40f6f925b2dc705ef5ee224f27))
* **Reaction:** check current user reactions only ([3c55747](https://github.com/taskany-inc/issues/commit/3c55747a5d84ad0855837d68e173195051313603))
* **RelativeTime:** update relative time every 1 min ([ac2deee](https://github.com/taskany-inc/issues/commit/ac2deee32ec6f676908d75391395c1df36028a83))
* remove ghost prop for form elements, [#641](https://github.com/taskany-inc/issues/issues/641) ([e844f84](https://github.com/taskany-inc/issues/commit/e844f842d4ebeef3e7922ad793fc525220fa05dc))
* remove useState and useEffect from filters dropdowns ([a340f1f](https://github.com/taskany-inc/issues/commit/a340f1f24af1e61c993edfce54858d816584e96e))
* **seed:** connect existing tags ([c2c00cd](https://github.com/taskany-inc/issues/commit/c2c00cd68a8ca95e87d0590a622856fd42ee9878))
* smooth and right scroll to comments ([62d6d30](https://github.com/taskany-inc/issues/commit/62d6d304cf3ae9019daa32a0808b5cb685841a9f))
* StateDot styles ssr error ([7587a68](https://github.com/taskany-inc/issues/commit/7587a68d369c4a2bfdb50bb01df092e9824f4b7a))
* **TagsFilterDropdown:** remove extra void in callback ([6b217bd](https://github.com/taskany-inc/issues/commit/6b217bd7b7f91bae3e457a5b9f7c6adf8776717c))
* **UserFilterDropdown:** remove extra void in callback ([19e4663](https://github.com/taskany-inc/issues/commit/19e4663d573f6aad935c780a6cbd485223878086))
* **UserMenuItem:** provide email for gravatar ([7655f39](https://github.com/taskany-inc/issues/commit/7655f3924478aa107df175ef62bea5c0e9a9700f))
* **useUrlFilterParams:** shallow eq for presets ([7c31300](https://github.com/taskany-inc/issues/commit/7c313006c8441ebf2b86b28285ba7c58a1cd563a))


### Reverts

* Revert "chore(Tag): title must be unique" ([0feb6f8](https://github.com/taskany-inc/issues/commit/0feb6f8bfb87c49fce83d23f111d995340553d47))


### Miscellaneous Chores

* disable e2e in GH workflows ([779ab4d](https://github.com/taskany-inc/issues/commit/779ab4dd4f9a86843d5a8a0a6ef7734cc3b82590))
* drop other part of teams components ([780901f](https://github.com/taskany-inc/issues/commit/780901fdb6f5836f45a3dfc8ba6d1c8c505683ee))
* drop team table ([24bdf98](https://github.com/taskany-inc/issues/commit/24bdf980a9da423bf33a316e46bab6115f29f54a))
* drop teams pages and components ([feeff90](https://github.com/taskany-inc/issues/commit/feeff900fef4ed9f72b6c1c8f3c97f66ac52e5a0))
* drop useless routes ([57c4360](https://github.com/taskany-inc/issues/commit/57c436053aee1a04374aae659dc4771075e186ec))
* remove teams docs ([3dca600](https://github.com/taskany-inc/issues/commit/3dca60025db5d55a94a08f1cfb8edddf6dce87a8))
* remove teams from gql resolvers ([c20b735](https://github.com/taskany-inc/issues/commit/c20b735f66c0633fd525cb9513be6902e1b575ca))
* remove teams support ([2c3a212](https://github.com/taskany-inc/issues/commit/2c3a2122c9fe321d2027fef36ce640d5ddace0a2))
* replace teams explore with projects in Header menu ([a734dcb](https://github.com/taskany-inc/issues/commit/a734dcbdd8d388b5f4c24bb68446e9a8d8ebfff0))

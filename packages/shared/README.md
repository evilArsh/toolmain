# @toolmain/shared

convient and utility toolkit collections base on vue or element-plus.

## Install

```shell
pnpm add @toolmain/shared
```

## 📚 Usage

```ts
import { px, localImg, msg } from "@toolmain/shared"
```

or if you want to overview all tools, just use like following:

```ts
import * as tool from "@toolmain/shared"
const pixel = tool.px(10)
```

## 🔎 Overview

clone the core monorepo

```shell
git clone https://github.com/evilArsh/toolmain.git
```

install dependencies

```shell
pnpm i
```

start playground overview project

```shell
pnpm run dev
```

to test all hooks,functions and other components, just enter `playground/` diectory and use !

### directory structure

```plaintext
root/
├── element/
│   ├── element-plus toolkit collections
├── hooks/
│   ├── vue hooks collections
├── misc/
│   ├── miscellaneous convient functions collections
├── type/
│   ├── common types definitions
├── README.md
└── package.json
```

## 👏 Contributing

Pull requests are welcome

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

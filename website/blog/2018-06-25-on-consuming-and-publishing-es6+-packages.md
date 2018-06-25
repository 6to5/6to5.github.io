---
layout: post
title:  "On Consuming (and Publishing) ES2015+ Packages"
author: Henry Zhu
authorURL: https://twitter.com/left_pad
date:   2018-06-25 12:00:00
categories: announcements
share_text: "On Consuming (and Publishing) ES2015+ Packages"
---

How can we make compiling dependencies not just possible, but normal?

<!--truncate-->

Being able to compile dependencies is an enabling feature request for the whole ecosystem. With some of the changes we made in Babel v7, hopefully it can be made more standard moving forward.

## Assumptions

- You can ship to modern browsers (don't have to support IE) or are able to send multiple types of bundles (one way being [checking for script`type=module`](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)).
- Your dependencies actually publish ES2015+ instead of ES5/ES3.

## Why

Why is compiling your dependencies desirable in the first place (vs. your own code)?

- You can ship less code to users, since JavaScript has a [cost](https://medium.com/dev-channel/the-cost-of-javascript-84009f51e99e).
- You get the freedom to make the tradeoffs of where your code is able to run (vs. the library).

## The Ephemeral JavaScript Runtime

When thinking about Babel's role not just in moving the language itself forward, we saw that developers would eventually want to move past only compiling to ES5. 

Thus, the argument for why compiling dependencies would be helpful is the same for why we eventually introduced `@babel/preset-env`.

Babel used to be `6to5`, since it only converted from ES2015 to ES5. Back then, the browser support for ES2015 was almost non-existent, so the idea of a JavaScript compiler was both novel and useful: you could write modern code and have it work for all of your users. But what about the browser runtimes themselves?

Browsers will eventually catch up to the standard (and have with ES2015). Creating `preset-env` helps us align with the browsers since if we only compiled to ES5, no one would ever run native code in the browsers.

The real difference is realizing that there will _always_ be a sliding window of support:

- Application code (your supported environments)
- Browsers (Chrome, Firefox, Edge, Safari)
- Babel (the abstraction layer)
- TC39/ECMAScript Proposals (and Babel implementations)

Thus the need isn't just for `6to5` to be renamed to Babel because it compiles to `7to5`, but for Babel to change the implicit assumption it only targets ES5. With `@babel/preset-env`, you are able to write the latest JavaScript and target whichever browser (environment) you want!

Using Babel and `preset-env` helps you keep up with that sliding window. However, even if you use it, it's mainly for *your application code* and not what your code depends upon.

## Who's Problem is It?

You have control over your own code to be able to take advantage of `preset-env`: by writing in ES2015+ and targeting ES2015+ browsers.

Even though this isn't necessarily the case for your dependencies, you'll want to think about it in order to get the same benefits as compiling your application code.

Is it as straightforward as just running Babel over `node_modules` with the same configuration for your application?

## Complexities in Compiling Dependencies

### Compiler Complexity

Every compiler has bugs, although the risk is lower if there are so many users and sufficient tests. We should just be aware that compiling dependencies does increase the surface area of potential bugs, but I don't believe that should deter us from making this a common practice.

- Babel v6 assumed everything that it compiled was a module and thus in strict mode (one could argue this is actually a good thing). Thus if you tried to run Babel on all your `node_modules` and it encountered something that was a `script` like a jQuery plugin it might cause a lot of issues. This is changed in v7 so that it won't always auto inject the `"use strict"` directive unless it actually is a module.
- React Native has always compiled `node_modules` by default and has probably learned a lot from issues like ^.
- `preset-env` could have its own bugs because we use `compat-table` vs. test262.
- Browsers themselves can have issues with running native ES2015+ code vs. ES5.
- Question of how do we determine what is "supported": https://github.com/babel/babel-preset-env/issues/54 example of edge case.
- It was never in Babel's scope to compile dependencies: we actually got issue reports that people would actually accidently do it, making the build slower.

### Using Non-Standard Syntax

There are many issues with *shipping* uncompiled proposal syntax. (This post was inspired by [Dan's concern](https://twitter.com/dan_abramov/status/1009179550134296577) about this)

#### Staging Process

- The [TC39 staging process](https://tc39.github.io/process-document/) does not always move forward: there is the possibility for a proposal to move to any point in the process: even moving backwards from Stage 3 to Stage 2 as the case with Numeric Separators (`1_000`) or dropped entirely (`Object.observe()`, and others you may have forgotten)
- It can be hard to differentitate between the stages if you aren't involved: most people would advise that Stage 0-2 is unstable though.
- Summary: Stage 0 has no criteria and is just an idea, Stage 1 is accepting that the problem is worth solving, Stage 2 is about describing a solution in spec text, Stage 3 means the specific solution is thought out, and Stage 4 means that it is ready for inclusion with tests, multiple browser implementations, and in-the-field experience.

#### Using Proposals

<blockquote class="twitter-tweet" data-lang="en"><p lang="und" dir="ltr"><a href="https://t.co/femUb4vgxh">pic.twitter.com/femUb4vgxh</a></p>&mdash; Rach Smith 🌈 (@rachsmithtweets) <a href="https://twitter.com/rachsmithtweets/status/892478598765887488?ref_src=twsrc%5Etfw">August 1, 2017</a></blockquote>

We already recommend that people should be careful when using proposals lower than Stage 3, let alone publishing them.

But telling people not to use Stage X goes against the whole purpose of Babel in the first place. A big reason why proposals gain improvements and move forward are because of the feedback the committee gets from real-world usage (whether in production or not) based on using it via Babel.

There is certainly a balance to be had here. We don't want to scare people away from using new syntax (that is a hard sell 😂), but we also don't want people to get the idea that "once it's in Babel, the syntax is official or immutable". Ideally people look into the purpose of a proposal and make the tradeoffs for their use case.

#### Removing the Stage Presets in v7

One of the most common things people do is use the Stage 0 or Stage 2 presets. We plan to remove the stage presets in v7. We thought at first it would be convienent, that people would make their own unofficial ones anyway, or it might help with "JavaScript fatigue". We find now that it just causes more of an issue: people continue to copy/paste configs with out understanding what goes into a preset in the first place. After all, seeing `"stage-0"` says nothing. My hope is that in making the decision to use proposal plugins explicit, people will have to learn what non-standard syntax they are opting into.

### Publishing Non-standard Syntax

Publishing non-standard syntax in a library is setting your users up for possible inconsistencies, refactoring, and breakage of their projects. Because a TC39 proposal (even at Stage 3) has a possibility of changing, it means you will inevitability have to change the code.

At least if you ship the compiled version, it will still work and the library maintainer can change the output so that it works the same as before. Shipping the uncompiled version means that anyone consuming a package will necessarily have to have a build step to use it, and will have to have the same configuration of Babel as you. This is in the same bucket as using TS/JSX/Flow: you wouldn't expect consumers to configure the same compiler environment just because you used them.

TODO: Or a proposal might just stall because people are busy, etc. Decorators are a great example of this.

### Conflating ESM and ES2015+

When you do `import foo from "foo"` or `require("foo")` and `foo` doesn't have an `index.js`, it will resolve to the `main` field in the `package.json` of the module.

Some tools like Rollup/Webpack will also read from another field called `module` (previously `jsnext:main`). It uses this to instead resolve to the ESM file.

- An example with [`redux`](https://github.com/reactjs/redux)

```js
// redux package.json
{
  ...
  "main": "lib/redux.js", // ES5 + CJS
  "module": "es/redux.js", // ES5 + ESM
}
```

This was introduced so that users could consume ES2015 modules (ESM).

However, the sole intention of this field is ESM, not anything else. The [Rollup docs](https://github.com/rollup/rollup/wiki/pkg.module#wait-it-just-means-import-and-export--not-other-future-javascript-features) make it clear that it's not intended for future JavaScript syntax.

Despite this warning, package authors invariably conflate the use of ES modules with the JavaScript language level they authored it in.
As such, we may need another way to signal the language level.

#### Non-scalable Solutions?

A yearly `package.json` key: a common suggestion is for libraries to start publishing ES2015 under another field like `es2015`, e.g. `"es2015": "es2015/redux.js"`.

```js
// @angular/core package.json
{
  "main": "./bundles/core.umd.js",
  "module": "./fesm5/core.js",
  "es2015": "./fesm2015/core.js",
  "esm5": "./esm5/core.js",
  "esm2015": "./esm2015/core.js",
  "fesm5": "./fesm5/core.js",
  "fesm2015": "./fesm2015/core.js",
}
```

This works for ES2015 but the question next is what about ES2016? Are we supposed to create a new folder for each year and a new field in `package.json`? That seems unsustainable, and will continue to produce larger `node_modules`.

This was an issue with Babel itself: we had intended to continue to publish yearly presets (`preset-es2015`, `preset-es2016`..) until `preset-env` removed that need.

Publishing it based on specific environments/syntax would seem to be even worse as the amount of combinations only increases.

What about providing just the source? That may have similar problems if you used non-standard syntax as mentioned earlier.

Having a `esnext` field may not be helpful either. The "latest" version of JavaScript changes depending on the point in time you authored the code.

One suggestion is to provide an ES5 version but also publish a version that includes the latest standard syntax so it can be compiled with `preset-env`.

### Dependencies May Not Publish ES2015+

TODO:

- Due to complexity and tooling, it may be difficult for projects to publish ES2015/ESM without more setup. This is probably the biggest issue to get right, even docs aren't enough. We should add some feature requests to `@babel/cli` to make this easier, and maybe make the `babel` package do this by default? Tools like @developit's [microbundle](https://github.com/developit/microbundle) may help a lot with this.
- How do we deal with polyfills? This could be it's own post (I never finished it). Mention `preset-env` + polyfills. What would it look like for a library author not to have to think about polyfills (or the user).

With that said, how does Babel help with all this?

## How Babel v7 Helps

As I've discussed, compiling dependencies in Babel v6 can be pretty painful. Babel v7 will address some of these pain points. 

One issue (which we have fixed in v7) is around config lookup. Babel currently runs per file so when compiling a file, it tries to find the closest config to know what to compile against. If it doesn't find it in the same directory, it keeps looking up directories (this is why if you don't specify a config but have one in your home directory it might try to load that instead).

```
project
└── .babelrc // closest config for a.js
└── a.js
└── node_modules
    └── package
        └── .babelrc // closest config for b.js
        └── b.js
```

We made a [few changes](https://github.com/babel/babel/pull/7358):

- One is to stop lookup at the package boundary (stop when you find a `package.json`). This makes sure Babel won't try to load a config file outside.
- If you use a monorepo, you'll may want to have a `.babelrc` per-package that extends some other central config.
- Babel itself is a monorepo, so instead we are using the new `babel.config.js` which allows you to resolve all files to that config (no more lookup).
- We added an [`"overrides"`](https://github.com/babel/babel/pull/7091) option which allows you to basically create a new config for any set of paths.

This allows you to have a single config for your whole app: maybe you want to compile your server JavaScript code differently than the client code as well as compile something in `node_modules`.

```js
// babel.config.js
module.exports = {
  presets: [
    ['env', { 
      targets: { node: 'current' },
    }],
  ],
  overrides: [{
    test: "./client",
    presets: [
      ['env', { 
        targets: { browsers: ["last 2 versions"] },
      }],
    ],
  }, {
    test: "./node_modules/",
    presets: [
      ['env', { 
        targets: { browsers: ["last 2 versions"] },
      }],
    ],
  }],
}
```

## Proposals to Discuss

Potential recommendation: package authors should also publish a version compiled down to latest syntax (no experimental proposals) under a new key we can standardize on (I don't believe `module` should be that key) but continue to publish ES5 under `main`. Consumers can use `preset-env` and opt-in into running on `node_modules`.

Maybe we should decide on another key in `package.json`, maybe `"es"`? Reminds me of the poll I made for [babel-preset-latest](https://twitter.com/left_pad/status/758429846594850816).

## Let's Do This!

Hopefully this is an encouraging call to action for looking into moving forward to make compiling dependencies more first class. It's not just about the specific ES2015/ES5 distinction.

Babel v7 should be out soon. This post goes into some of the ways it should help with this effort but we'll need everyone's help to change the ecosystem: more education, published packages that do this, and better tooling and sustainability.

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
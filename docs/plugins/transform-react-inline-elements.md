---
layout: docs
title: React inline elements transform
description:
permalink: /docs/plugins/transform-react-inline-elements/
package: babel-plugin-transform-react-inline-elements
---

Converts JSX elements to object literals like `{type: 'div', props: ...}` instead of calls to `React.createElement`.

This transform **should be enabled only in production** (e.g., just before minifying your code) because although they improve runtime performance, they make warning messages more cryptic and skip important checks that happen in development mode, including propTypes.

## Example

**In**

```javascript
<Baz foo="bar"></Baz>;
```

**Out**

```javascript
({
  $$typeof: babelHelpers.typeofReactElement,
  type: Baz,
  key: null,
  ref: null,
  props: babelHelpers.defaultProps(Baz.defaultProps, {
    foo: "bar"
  }),
  _owner: null
});
```

## Installation

```sh
$ npm install babel-plugin-transform-react-inline-elements
```

## Usage

Add the following line to your `.babelrc`:

```json
{
  "plugins": ["transform-react-inline-elements"]
}
``

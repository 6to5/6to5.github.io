// @flow

import generate from "babel-generator";
import type { Transition } from "./types";

type Parent = {
  isProgram: () => boolean,
  parentPath: Parent,
  node: {
    type: string,
  },
};

export default class Transitions {
  _transitions: Array<Transition> = [];

  _getProgramParent = (path: Parent) => {
    let parent = path;
    do {
      if (parent.isProgram()) return parent;
    } while ((parent = parent.parentPath));
  };

  getValue = () => {
    return this._transitions.length ? this._transitions : undefined;
  };

  addExitTransition = (code: string) => {
    this._transitions.push({
      code,
      pluginAlias: "output",
      visitorType: "exit",
    });
  };

  wrapPluginVisitorMethod = (
    pluginAlias: any,
    visitorType: any,
    callback: any
  ) => {
    return (...args: any) => {
      // $FlowFixMe
      const { code } = generate(this._getProgramParent(args[0]).node);
      console.log(code);
      console.log(pluginAlias);
      console.log(visitorType);

      if (
        this._transitions.length === 0 ||
        this._transitions[this._transitions.length - 1].code !== code
      ) {
        this._transitions.push({
          code,
          pluginAlias,
          visitorType,
          currentNode: args[0].node.type,
        });
      }
      callback.call(this, ...args);
    };
  };
}

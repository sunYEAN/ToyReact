import {isArray} from "./utils";

export class Component {
    constructor() {
        this.props = Object.create(null); // 存放自定义组件得props
        this.children = []; // 存放自定义组件得子节点
        this._range = null;
    }

    baseAppendChild(component) {
        this.children.push(component);
    }

    baseSetAttribute(name, value) {
        this.props[name] = value;
    }

    // 渲染到Dom
    _baseRenderToDom(range) {
        this._range = range;
        this.render()._renderToDom(range);
    }

    // 渲染到dom上
    rerender() {
        // 重新渲染
        this._range.deleteContents();
        this._baseRenderToDom(this._range);
    }

    setState(newState) {
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState;
            this.rerender();
            return;
        }
        let merge = (oldState, newState) => {
            Object.keys(newState).forEach(key => {
                // 普通类型
                if (oldState[key] === null || typeof oldState[key] !== "object") {
                    oldState[key] = newState[key];
                } else return merge(oldState[key], newState[key]);
            })
        };
        merge(this.state, newState);
        this.rerender();
    }
}

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    appendChild(component) {
        // 如果是ElementWrapper和TextWrapper直接获取他们的root属性（真实dom），如果是一个Component实例，这里会触发get root方法，会返回这个自定义组件render方法生成的dom

        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);

        if (component instanceof Component) {
            component._baseRenderToDom(range);
        } else {
            component._renderToDom(range);
        }
    }

    setAttribute(name, value) {
        if (name.match(/^on([\s\S]*)/)) {
            const eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
            this.root.addEventListener(eventName, value);
        } else this.root.setAttribute(name, value);
    }

    _renderToDom(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper {
    constructor(text) {
        this.root = document.createTextNode(text);
    }

    _renderToDom(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}


export function createElement(type, options, ...children) {

    let dom = typeof type === "string" ? new ElementWrapper(type) : new type();

    Object.keys(options || {}).forEach(i => {
        if (dom instanceof Component) {
            dom.baseSetAttribute(i === 'className' ? 'class' : i, options[i]);
        } else dom.setAttribute(i === 'className' ? 'class' : i, options[i]);
    });

    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                child = new TextWrapper(child);
            }

            if (child === null) continue;

            if (isArray(child)) {
                return insertChildren(child);
            }

            if (dom instanceof Component) {
                dom.baseAppendChild(child);
            } else dom.appendChild(child);
        }
    };

    insertChildren(children);
    return dom;
}

export function render(component, parentNode) {
    // 触发Component的get root，调用render方法

    let range = document.createRange();
    range.setStart(parentNode, 0);
    range.setEnd(parentNode, parentNode.childNodes.length);
    range.deleteContents();
    component._baseRenderToDom(range);
}


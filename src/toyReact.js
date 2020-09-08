class ElementWrapper{
    constructor (type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(component) {
        this.root.appendChild(component.root);
    }
}

class TextWrapper{
    constructor (text) {
        this.root = document.createTextNode(text);
    }
}

export class Component {
    constructor () {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }

    setAttribute (name, value) {
        this.props[name] = value;
    }

    appendChild (component) {
        this.children.push(component);
    }

    get root () {
        if (!this._root) {
            this._root = this.render().root;
        }
        return this._root;
    }

}



export function createElement (type, options, ...children) {


    let dom;

    if (typeof type === "string") {
        dom = new ElementWrapper(type);
    } else {
        dom = new type; // 自定义组件
    }


    Object.keys(options || {}).forEach(i => {
        dom.setAttribute(i === 'className' ? 'class' : i, options[i]);
    });


    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                child = new TextWrapper(child);
            }
            if (Array.isArray(child)) {
                return insertChildren(child);
            }
            dom.appendChild(child);
        }

    };
    insertChildren(children);

    return dom;
}


export function render(component, parentNode) {
    parentNode.appendChild(component.root)
}

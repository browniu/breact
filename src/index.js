function createElement(tag, attrs, ...children) {
    return {
        tag,
        attrs,
        children
    }
}

// 渲染虚拟DOM
function render(vdom, container, dom) {
    if (dom) {
        diff(dom, vdom, container);
        return
    }
    const vdomType = Object.prototype.toString.call(vdom);
    if (!vdomType.match(/String|Object|Number/)) vdom = 'hello breact';
    // 渲染文本节点
    if (vdomType.match(/String|Number/)) {
        const textNode = document.createTextNode(vdom);
        return container.appendChild(textNode)
    }
    // 渲染DOM节点
    const {tag, attrs} = vdom;
    const tagType = typeof tag === 'function' ? 'Component' : 'Dom';
    if (tagType === 'Dom') {
        const dom = renderDom(vdom);
        return container.appendChild(dom)
    }
    // 渲染组件
    if (tagType === 'Component') {
        const funcType = (tag && vdom.tag.prototype && vdom.tag.prototype.render) ? 'class' : 'function';
        if (funcType === 'function') { //无状态组件
            const dom = renderDom(tag(attrs));
            return container.appendChild(dom)
        } else { // 有状态组件
            const instance = new vdom.tag(vdom.attrs);
            renderComponent(instance, container);
            if (instance.componentDidMount) instance.componentDidMount();
            return container.appendChild(instance.dom)
        }
    }

}

// 创建DOM节点
function renderDom({tag, attrs, children}) {
    const dom = document.createElement(tag);
    // 处理属性
    if (attrs) {
        Object.keys(attrs).forEach(key => {
            let value = attrs[key];
            // 处理className
            if (key === 'className') key = 'class';
            // 处理事件绑定
            if (/on\w+/.test(key)) {
                key = key.toLowerCase();
                dom[key] = value;
                return;
            }
            // 处理内联样式
            if (key === 'style') {
                if (!value || typeof value === 'string') {
                    dom.style.cssText = value;
                    return
                } else if (value && typeof value === 'object') {
                    throw new Error('暂不支持对象样式')
                }
            }
            dom.setAttribute(key, value)
        })
    }
    // 递归渲染子元素
    if (children && Object.prototype.toString.call(children).match(/Array/))
        children.forEach(child => render(child, dom));
    return dom
}

// 渲染有状态组件
function renderComponent(instance) {
    let component = instance.render();
    const dom = renderDom(component);
    if (instance.dom && instance.dom.parentNode) {
        instance.dom.parentNode.replaceChild(dom, instance.dom);
    }
    instance.dom = dom;
}

// 原型类
class Component {
    constructor(props) {
        this.state = {}
    }

    setState(state) {
        // 更新状态
        // Object.assign(this.state, state);
        // // 重新渲染
        // this.componentDidUpdate();
        // renderComponent(this)
        const queue = [];
        const queueSetState = (state, component) => {
            queue.push({state, component})
        };
        const flash = (queue) => {
            let item;
            while (item === queue.shift()) {
                const {state, component} = item;
                if (!component.prevState) component.prevState = Object.assign({}, component.state)
                if (typeof state === 'function') {

                }
            }
        }
    }

    componentDidUpdate() {
    }

    componentDidMount() {
    }
}

// diff算法
function diff(dom, vdom, container) {
    const diffDom = () => {
        const vdomType = Object.prototype.toString.call(vdom);
        if (!vdomType.match(/String|Object|Number/)) vdom = 'hello breact';
        // 对比/渲染文本节点
        if (vdomType.match(/String|Number/)) {
            if (dom && dom.nodeType === 3 && dom.textContent === vdom) {
                console.log('无需更新')
            } else {
                const textNode = document.createTextNode(vdom);
                return container.appendChild(textNode)
            }
        }
        // 对比/渲染非文本节点
        console.log(vdomType);
        if (vdomType.match(/Object/)) {
            // 对比/渲染JXS节点
            if (typeof vdom.tag !== 'function') {

            }
        }
    };
    const result = diffDom(dom, vdom);
    if (container) container.appendChild(result);
    return result
}

export const React = {
    createElement,
    Component
};
export const ReactDom = {
    render
};



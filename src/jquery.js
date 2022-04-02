window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {//两个=在同一句，先执行右边的=。
    let elements;
    if (typeof selectorOrArrayOrTemplate === 'string') {
        if (selectorOrArrayOrTemplate[0] === '<') {
            elements = [createElement(selectorOrArrayOrTemplate)]//创建div
        } else {
            elements = document.querySelectorAll(selectorOrArrayOrTemplate)//查找div
        }
    } else if (selectorOrArray instanceof Array) {
        elements = selectorOrArrayOrTemplate;
    }

    function createElement(string) {
        const container = document.createElement('template');
        container.innerHTML = string.trim();
        return container.content.firstChild;
    }
    function on(eventType, element, selector, fn) {//事件监听函数
        if (!(element instanceof Element)) {
            element = document.querySelector(element)
        }
        element.addEventListener(eventType, (e) => {
            const t = e.target
            if (t.matches(selector)) {
                fn(e)
            }
        })
    }

    return {
        jquery: true,
        elements: elements,
        get(index) {
            return elements[index];
        },
        appendTo(node) {
            if (node instanceof Element) {
                this.ench(el => { node.appendChild(el) })//遍历elements，对每个el进行appendChild操作。
            } else if (node.jquery === true) {
                this.each(el => { node.get(0).appendChild(el) })
            }
        },
        append(children) {
            if (children instanceof Element) {
                this.get(0).appendChild(children)
            } else if (children instanceof HTMLCollection) {
                for (let i = 0; i < children.length; i++) {
                    this.get(0).appendChild(children[i])
                }
            } else if (children.jquery === true) {
                children.each(node => this.get(0).appendChild(node))
            }
        },
        addClass(className) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                elements.classList.add(className)
            }
            return this;
        },
        find(selector) {
            let array = [];
            for (let i = 0; i < elements.length; i++) {
                const elements2 = Array.from(elements[i].querySelectorAll(selector));
                array = array.concat(elements2);
            }
            array.oldApi = this
            return jQuery(array)//返回一个新的API
        },
        each(fn) {
            for (let i = 0; i < elements.length; i++) {
                fn.call(null, elements[i], i)
            }
            return this
        },
        parent() {
            const array = [];
            this.each((node) => {
                if (array.indexOf(node.parentNode) === -1) {
                    array.push(node.parentNode)
                }
            })
            return jQuery(array)
        },
        children() {
            const array = []
            this.each((node) => {
                array.push(...node.children)//...是展开操作符，将数组展开，每个单独push进去.
            })
            return jQuery(array)
        },
        print() {
            console.log(elements)
        },
        oldApi: selectorOrArray.oldApi,
        end() {
            return this.oldApi
        },
    }

}

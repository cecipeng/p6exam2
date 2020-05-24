export default class EventBus {
    listeners;

    constructor() {
        this.listeners = {};
    }

    addEventListener(name, callback, scope = window) {
        let listeners = this.listeners[name] || (this.listeners[name] = []);
        listeners.push({
            scope: scope,
            callback: callback
        });
    }

    /**
     * 移除特定事件监听器
     * @param name 监听事件的名称
     * @param callback 回调函数
     * @param scope 回到上下文
     */
    removeEventListener(name, callback, scope = window) {
        if (typeof this.listeners[name] === 'undefined') {
            return false;
        }

        let newArray = [];
        for (let index = 0, len = this.listeners[name].length; index < len; index++) {
            let listener = this.listeners[name][index];
            if (!(listener.scope === scope && listener.callback === callback)) {
                newArray.push(listener);
            }
        }
        this.listeners[name] = newArray;
    }

    /**
     * 检查是否存在指定的事件监听器
     * @param name 监听器名称
     * @param callback 回调函数
     * @param scope 执行上下文
     * @returns {boolean} 监听器的存在性
     */
    hasEventListener(name, callback, scope = window) {
        if (typeof this.listeners[name] === 'undefined') {
            return false;
        }
        for (let index = 0, len = this.listeners[name].length; index < len; index++) {
            let listener = this.listeners[name][index];
            if ((scope ? listener.scope === scope : true) && listener.callback === callback) {
                return true;
            }
        }
        return false;
    }

    /**
     * 分发事件
     * @param name 事件名称
     * @param params 事件参数
     */
    dispatch(name, params = {}) {
        if (this.listeners && this.listeners[name]) {
            this.listeners[name].forEach(listener => {
                listener.callback.call(listener.scope || window, params);
            });
        }
    }
}

export default class NotificationMessage {
    static lastShownComponent;
    element;
    timer;

    constructor(msg = '', { type = 'success', duration = 1500 } = {}) {
        this.msg = msg;
        this.type = type;
        this.duration = duration;

        this.element = this.createElement(this.createNotificationTemplate());
    }

    show(target = document.body) {
        if (NotificationMessage.lastShownComponent) {
            NotificationMessage.lastShownComponent.destroy();
        }
        
        NotificationMessage.lastShownComponent = this;
        this.timer = setTimeout(() => {
            this.destroy();
        }, this.duration);
        target.append(this.element);
    }

    createElement(template) {
        const element = document.createElement('div');
        element.innerHTML = template;
        return element.firstElementChild;
    }

    createNotificationTemplate() {
        return `
            <div class="notification ${this.type}" style="--value:${this.duration}ms">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">${this.msg}</div>
                </div>
            </div>
        `
    }

    remove() {
        clearTimeout(this.timer);
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}

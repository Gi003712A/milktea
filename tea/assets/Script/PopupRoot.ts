const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupRoot extends cc.Component {

    @property
    private closeDuration: number = 0.25;

    @property
    private destroyAfterClose: boolean = false;

    @property
    private closeButtonPath: string = "popup_container/close";

    private _closeButton: cc.Node = null;
    private _isClosing: boolean = false;
    private _isShowing: boolean = false;
    private _popupContainer: cc.Node = null;
    private _popupBg: cc.Node = null;

    protected onLoad(): void {
        this._resetTransform();
        this._initNodes();
        this._resetOpacityCascade();
        this._setupCloseButton();
    }

    private _resetTransform(): void {
        this.node.setPosition(0, 0, 0);
        this.node.scale = 1;
        this.node.rotation = 0;
    }

    private _initNodes(): void {
        this._popupContainer = this.node.getChildByName("popup_container");
        if (this._popupContainer) {
            this._popupBg = this._popupContainer.getChildByName("popup_bg");
        }
    }

    private _resetOpacityCascade(): void {
        this.node.opacity = 255;
        if (this._popupContainer) {
            this._resetNodeTreeOpacity(this._popupContainer, 255);
        }
    }

    private _resetNodeTreeOpacity(rootNode: cc.Node, opacity: number): void {
        rootNode.opacity = opacity;
        for (let i = 0; i < rootNode.childrenCount; i++) {
            const child = rootNode.children[i];
            if (child) {
                this._resetNodeTreeOpacity(child, opacity);
            }
        }
    }

    private _ensureFullOpacity(): void {
        if (!this._popupContainer) return;
        this.node.opacity = 255;
        this._popupContainer.opacity = 255;
        this._popupContainer.scale = 1;
        if (this._popupBg) {
            this._popupBg.opacity = 255;
        }
    }

    private _setupCloseButton(): void {
        let closeNode: cc.Node = null;

        const pathParts = this.closeButtonPath.split("/");
        let currentNode: cc.Node = this.node;
        for (const part of pathParts) {
            if (!currentNode) break;
            currentNode = currentNode.getChildByName(part);
        }
        if (currentNode) {
            closeNode = currentNode;
        }

        if (!closeNode && this._popupContainer) {
            closeNode = this._popupContainer.getChildByName("close");
        }

        if (!closeNode) {
            closeNode = this.node.getChildByName("close");
        }

        if (!closeNode) {
            cc.warn(`PopupRoot: 未找到 close 按钮节点`);
            return;
        }

        this._closeButton = closeNode;

        const button = this._closeButton.getComponent(cc.Button);
        if (!button) {
            cc.warn("PopupRoot: close按钮上未找到Button组件");
            return;
        }

        const clickHandler = new cc.Component.EventHandler();
        clickHandler.target = this.node;
        clickHandler.component = "PopupRoot";
        clickHandler.handler = "onCloseClicked";

        button.clickEvents.push(clickHandler);
    }

    private onCloseClicked(event: cc.Event.EventTouch): void {
        if (this._isClosing) return;
        this._closePopup();
    }

    private _closePopup(): void {
        this._isClosing = true;
        this._isShowing = false;
        this._stopAllTweens();

        if (this._popupContainer) {
            cc.tween(this._popupContainer)
                .to(this.closeDuration, { scale: 0.8, opacity: 0 }, { easing: "quartOut" })
                .start();
        }

        this.scheduleOnce(() => {
            this._onCloseComplete();
        }, this.closeDuration);
    }

    private _onCloseComplete(): void {
        this.node.active = false;
        if (this.destroyAfterClose) {
            this.node.destroy();
        }
        cc.log("PopupRoot: 弹窗已关闭");
    }

    private _stopAllTweens(): void {
        if (this._popupContainer) {
            cc.Tween.stopAllByTarget(this._popupContainer);
        }
    }

    public show(): void {
        if (this._isShowing) return;
        this._isShowing = true;
        this._isClosing = false;
        this._resetTransform();
        this._resetOpacityCascade();
        this._stopAllTweens();
        this.node.active = true;

        if (this._popupContainer) {
            this._popupContainer.opacity = 0;
            this._popupContainer.scale = 0.8;
            cc.tween(this._popupContainer)
                .to(this.closeDuration, { scale: 1, opacity: 255 }, { easing: "quartOut" })
                .call(() => {
                    this._ensureFullOpacity();
                    this._isShowing = false;
                })
                .start();
        }

        this.scheduleOnce(() => {
            this._ensureFullOpacity();
        }, this.closeDuration + 0.05);
    }

    public hide(): void {
        if (this._isClosing) return;
        this._closePopup();
    }

    protected onDestroy(): void {
        this._stopAllTweens();
        this.unscheduleAllCallbacks();
        this._clearClickEvents();
    }

    private _clearClickEvents(): void {
        if (this._closeButton) {
            const button = this._closeButton.getComponent(cc.Button);
            if (button && button.clickEvents) {
                button.clickEvents.length = 0;
            }
        }
    }
}

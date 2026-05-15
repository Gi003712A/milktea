const {ccclass, property} = cc._decorator;

@ccclass
export default class BottomBarCtrl extends cc.Component {

    private _buttonNode: cc.Node = null;
    private _mainViewLoader = null;

    protected onLoad(): void {
        this._initButtonNode();
        this._addClickEvent();
    }

    private _initButtonNode(): void {
        const leftArea = this.node.getChildByName("leftArea");
        if (!leftArea) {
            cc.warn("BottomBarCtrl: 未找到 leftArea 节点");
            return;
        }

        let buttonNode = leftArea.getChildByName("Updata");
        if (!buttonNode) {
            buttonNode = leftArea.getChildByName("New Button");
        }
        if (!buttonNode) {
            cc.warn("BottomBarCtrl: leftArea 中未找到升级按钮（Updata / New Button）");
            return;
        }

        this._buttonNode = buttonNode;
    }

    private _addClickEvent(): void {
        if (!this._buttonNode) {
            cc.warn("BottomBarCtrl: 按钮节点为空，无法添加点击事件");
            return;
        }

        const button = this._buttonNode.getComponent(cc.Button);
        if (!button) {
            cc.warn("BottomBarCtrl: 按钮节点上未找到Button组件");
            return;
        }

        const clickHandler = new cc.Component.EventHandler();
        clickHandler.target = this.node;
        clickHandler.component = "BottomBarCtrl";
        clickHandler.handler = "onButtonClicked";

        button.clickEvents.push(clickHandler);
    }

    private onButtonClicked(event: cc.Event.EventTouch): void {
        this._showPopupRoot();
    }

    private _getMainViewLoader() {
        if (!this._mainViewLoader) {
            const canvas = cc.find("Canvas");
            if (canvas) {
                this._mainViewLoader = canvas.getComponent("MainViewLoader");
            }
        }
        return this._mainViewLoader;
    }

    private _showPopupRoot(): void {
        const loader = this._getMainViewLoader();
        if (loader && typeof loader.showPopup === "function") {
            loader.showPopup();
            cc.log("BottomBarCtrl: 已通过 MainViewLoader 显示弹窗");
        } else {
            const canvas = cc.find("Canvas");
            const popup = canvas?.getChildByName("popup_root");
            if (popup) {
                const popupRoot = popup.getComponent("PopupRoot");
                if (popupRoot) {
                    popupRoot.show();
                    cc.log("BottomBarCtrl: 直接通过 PopupRoot 显示弹窗");
                } else {
                    popup.active = true;
                    cc.log("BottomBarCtrl: 直接激活 popup_root");
                }
            }
        }
    }
}

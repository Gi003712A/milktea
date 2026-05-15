const {ccclass, property} = cc._decorator;

import { UnlockPopupData } from "./DrinkData";

@ccclass('UnlockPopup')
export class UnlockPopup extends cc.Component {

    @property(cc.Sprite)
    private drinkIcon: cc.Sprite = null;

    @property(cc.Label)
    private drinkNameLabel: cc.Label = null;

    @property(cc.Label)
    private priceLabel: cc.Label = null;

    @property(cc.Label)
    private conditionLabel: cc.Label = null;

    @property(cc.Button)
    private confirmButton: cc.Button = null;

    @property(cc.Button)
    private closeButton: cc.Button = null;

    public onUnlockConfirm: ((data: UnlockPopupData) => void) | null = null;
    public onPopupClosed: (() => void) | null = null;

    private _currentData: UnlockPopupData = null;
    private _popupContainer: cc.Node = null;
    private _isShowing: boolean = false;

    protected onLoad(): void {
        this._resetTransform();
        this._initNodes();
        this._resetOpacityCascade();
        this._initButtons();
    }

    private _resetTransform(): void {
        this.node.setPosition(0, 0, 0);
        this.node.scale = 1;
        this.node.rotation = 0;
    }

    private _initNodes(): void {
        this._popupContainer = this.node.getChildByName("popup_container");
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
        const popupContainer = this._popupContainer || this.node.getChildByName("popup_container");
        if (!popupContainer) return;
        this.node.opacity = 255;
        popupContainer.opacity = 255;
        popupContainer.scale = 1;
    }

    private _initButtons(): void {
        if (this.confirmButton) {
            const confirmHandler = new cc.Component.EventHandler();
            confirmHandler.target = this.node;
            confirmHandler.component = "UnlockPopup";
            confirmHandler.handler = "_onConfirmClicked";
            this.confirmButton.clickEvents.push(confirmHandler);
        }

        if (this.closeButton) {
            const closeHandler = new cc.Component.EventHandler();
            closeHandler.target = this.node;
            closeHandler.component = "UnlockPopup";
            closeHandler.handler = "_onCloseClicked";
            this.closeButton.clickEvents.push(closeHandler);
        }
    }

    public show(data: UnlockPopupData): void {
        if (!data) {
            cc.warn('[UnlockPopup] 显示数据不能为空');
            return;
        }
        if (this._isShowing) return;
        this._isShowing = true;

        this._currentData = data;
        this._updateUI();

        this._resetTransform();
        this._resetOpacityCascade();
        this.node.active = true;
        this._stopAllTweens();

        const popupContainer = this._popupContainer || this.node.getChildByName("popup_container");

        if (popupContainer) {
            popupContainer.opacity = 0;
            popupContainer.scale = 0.8;
            cc.tween(popupContainer)
                .to(0.3, { scale: 1, opacity: 255 }, { easing: "quartOut" })
                .call(() => {
                    this._ensureFullOpacity();
                    this._isShowing = false;
                })
                .start();
        }

        this.scheduleOnce(() => {
            this._ensureFullOpacity();
            this._isShowing = false;
        }, 0.35);
    }

    public hide(): void {
        this._closePopup();
    }

    public getCurrentData(): UnlockPopupData {
        return this._currentData;
    }

    private _updateUI(): void {
        if (!this._currentData) return;

        if (this.drinkNameLabel) {
            this.drinkNameLabel.string = this._currentData.drinkName;
        }

        if (this.priceLabel) {
            this.priceLabel.string = String(this._currentData.unlockPrice);
        }

        if (this.confirmButton) {
            const labelNode = this.confirmButton.node.getChildByName("Background").getChildByName("Label");
            if (labelNode) {
                const label = labelNode.getComponent(cc.Label);
                if (label) {
                    label.string = this._currentData.confirmText || "解锁";
                }
            }
        }

        if (this.conditionLabel) {
            this.conditionLabel.string = `需要 ${this._currentData.unlockPrice} 金币解锁`;
        }
    }

    private _closePopup(): void {
        this._isShowing = false;
        const popupContainer = this._popupContainer || this.node.getChildByName("popup_container");
        if (popupContainer) {
            cc.tween(popupContainer)
                .to(0.2, { scale: 0.8, opacity: 0 }, { easing: "quartOut" })
                .call(() => {
                    this.node.active = false;
                    if (this.onPopupClosed) {
                        this.onPopupClosed();
                    }
                })
                .start();
        } else {
            this.node.active = false;
            if (this.onPopupClosed) {
                this.onPopupClosed();
            }
        }
    }

    private _onConfirmClicked(event: cc.Event.EventTouch): void {
        if (!this._currentData) return;

        cc.log(`[UnlockPopup] 确认解锁: ${this._currentData.drinkName}, 价格: ${this._currentData.unlockPrice}`);

        if (this.onUnlockConfirm) {
            this.onUnlockConfirm(this._currentData);
        }

        this._closePopup();
    }

    private _onCloseClicked(event: cc.Event.EventTouch): void {
        cc.log('[UnlockPopup] 取消解锁');
        this._closePopup();
    }

    private _stopAllTweens(): void {
        const popupContainer = this._popupContainer || this.node.getChildByName("popup_container");
        if (popupContainer) {
            cc.Tween.stopAllByTarget(popupContainer);
        }
    }

    protected onDestroy(): void {
        this._stopAllTweens();
        this.unscheduleAllCallbacks();
    }
}

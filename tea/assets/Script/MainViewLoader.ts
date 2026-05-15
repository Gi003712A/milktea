const {ccclass, property} = cc._decorator;

@ccclass
export default class MainViewLoader extends cc.Component {

    @property(cc.Prefab)
    private popupRootPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private topAreaPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private bottomAreaPrefab: cc.Prefab = null;

    protected onLoad(): void {
        this._loadPrefabs();
        this.scheduleOnce(() => {
            this._initDrinkItemCallbacks();
        }, 0.1);
    }

    private _loadPrefabs(): void {
        if (this.popupRootPrefab) {
            let node = cc.instantiate(this.popupRootPrefab);
            node.parent = this.node;
            node.setPosition(0, 0, 0);
            node.active = false;
        }

        if (this.topAreaPrefab) {
            let topArea = cc.instantiate(this.topAreaPrefab);
            topArea.parent = this.node;
            topArea.setPosition(0, 543.484, 0);
        }

        if (this.bottomAreaPrefab) {
            let bottomArea = cc.instantiate(this.bottomAreaPrefab);
            bottomArea.parent = this.node;
            bottomArea.setPosition(0, -587.996, 0);
        }
    }

    private _initDrinkItemCallbacks(): void {
        const popupNode = this.node.getChildByName("popup_root");
        if (!popupNode) return;

        const drinkGrid = popupNode.getChildByName("popup_container")?.getChildByName("content_item")?.getChildByName("drink_grid");
        if (!drinkGrid) return;

        for (const child of drinkGrid.children) {
            const drinkItem = child.getComponent("DrinkItem") as any;
            if (!drinkItem || !drinkItem.onRequestUnlockPopup) continue;

            drinkItem.onRequestUnlockPopup = (drinkData: any): void => {
                const unlockPopup = this._getUnlockPopup();
                if (unlockPopup && typeof unlockPopup.show === "function") {
                    unlockPopup.show({
                        drinkName: drinkData.drinkName,
                        drinkIcon: drinkData.drinkIcon,
                        unlockPrice: drinkData.unlockPrice,
                        confirmText: "立即解锁"
                    });
                    unlockPopup.onUnlockConfirm = (data: any): void => {
                        cc.log(`[MainView] 解锁确认: ${data.drinkName}, 扣除 ${data.unlockPrice} 金币`);
                        drinkItem.unlock(true);
                    };
                }
            };
        }

        cc.log(`MainViewLoader: 已初始化 ${drinkGrid.children.length} 个 DrinkItem 的回调`);
    }

    private _getUnlockPopup(): any {
        const canvas = cc.find("Canvas");
        const unlockPopupNode = canvas?.getChildByName("unlockPopup");
        if (unlockPopupNode) {
            return unlockPopupNode.getComponent("UnlockPopup");
        }
        return null;
    }

    public showPopup(): void {
        let popup = this.node.getChildByName("popup_root");
        if (popup) {
            const popupRoot = popup.getComponent("PopupRoot");
            if (popupRoot && typeof popupRoot.show === "function") {
                popupRoot.show();
            } else {
                popup.active = true;
            }
        }
    }

    public hidePopup(): void {
        let popup = this.node.getChildByName("popup_root");
        if (popup) {
            const popupRoot = popup.getComponent("PopupRoot");
            if (popupRoot && typeof popupRoot.hide === "function") {
                popupRoot.hide();
            } else {
                popup.active = false;
            }
        }
    }
}

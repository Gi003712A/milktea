const {ccclass, property} = cc._decorator;

@ccclass
export default class MainViewLoader extends cc.Component {

    @property(cc.Prefab)
    private popupRootPrefab: cc.Prefab = null;

    protected onLoad(): void {
        this._loadPrefabs();
    }

    private _loadPrefabs(): void {
        if (this.popupRootPrefab) {
            let node = cc.instantiate(this.popupRootPrefab);
            node.parent = this.node;
            node.active = false;
        }
    }

    public showPopup(): void {
        let popup = this.node.getChildByName("popup_root");
        if (popup) {
            popup.active = true;
        }
    }

    public hidePopup(): void {
        let popup = this.node.getChildByName("popup_root");
        if (popup) {
            popup.active = false;
        }
    }
}
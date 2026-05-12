const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginViewLoader extends cc.Component {

    @property(cc.Prefab)
    private topAreaPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private bottomAreaPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private healthNoticePrefab: cc.Prefab = null;

    protected onLoad(): void {
        this._loadPrefabs();
    }

    private _loadPrefabs(): void {
        if (this.topAreaPrefab) {
            let node = cc.instantiate(this.topAreaPrefab);
            node.parent = this.node;
        }
        if (this.bottomAreaPrefab) {
            let node = cc.instantiate(this.bottomAreaPrefab);
            node.parent = this.node;
        }
        if (this.healthNoticePrefab) {
            let node = cc.instantiate(this.healthNoticePrefab);
            node.parent = this.node;
        }
    }
}
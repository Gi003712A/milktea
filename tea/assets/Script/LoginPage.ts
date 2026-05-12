const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginPage extends cc.Component {

    @property(cc.Button)
    private button: cc.Button = null;

    @property(cc.Sprite)
    private bgSprite: cc.Sprite = null;

    @property(cc.Sprite)
    private barSprite: cc.Sprite = null;

    @property(cc.Node)
    private loadingBar: cc.Node = null;

    @property
    private darkIntensity: number = 80;

    @property
    private scaleRatio: number = 0.95;

    @property
    private loadDuration: number = 2;

    private _originalColor: cc.Color = null;
    private _originalScale: number = 1;

    protected start(): void {
        this._originalColor = new cc.Color();
        if (this.loadingBar) {
            this.loadingBar.active = false;
        }
        if (this.barSprite) {
            this.barSprite.fillRange = 0;
        }
        if (this.bgSprite) {
            this._originalColor.set(this.bgSprite.node.color);
            this._originalScale = this.bgSprite.node.scale;
            this.button.node.on('mouseenter', this._onMouseEnter, this);
            this.button.node.on('mouseleave', this._onMouseLeave, this);
            this.button.node.on('click', this._onClick, this);
        }
    }

    private _getDarkColor(): cc.Color {
        let r = this._originalColor.r - this.darkIntensity;
        let g = this._originalColor.g - this.darkIntensity;
        let b = this._originalColor.b - this.darkIntensity;
        r = r < 0 ? 0 : r;
        g = g < 0 ? 0 : g;
        b = b < 0 ? 0 : b;
        return new cc.Color(r, g, b);
    }

    private _onMouseEnter(): void {
        if (this.bgSprite) {
            this.bgSprite.node.color = this._getDarkColor();
        }
    }

    private _onMouseLeave(): void {
        if (this.bgSprite) {
            this.bgSprite.node.color = this._originalColor;
        }
    }

    private _onClick(): void {
        if (this.bgSprite) {
            this.bgSprite.node.setScale(this._originalScale * this.scaleRatio);
            this.scheduleOnce(this._restoreScale, 0.1);
        }
        this._startLoading();
    }

    private _startLoading(): void {
        this.button.node.active = false;
        if (this.loadingBar) {
            this.loadingBar.active = true;
        }
        if (this.barSprite) {
            this.barSprite.fillRange = 0;
        }
        this._loadStep = 0;
        this.schedule(this._updateProgress, 0.1);
    }

    private _loadStep: number = 0;

    private _updateProgress(): void {
        this._loadStep++;
        let progress = (this._loadStep * 0.1) / this.loadDuration;
        if (this.barSprite) {
            this.barSprite.fillRange = progress;
        }
        if (this._loadStep * 0.1 >= this.loadDuration) {
            this.unschedule(this._updateProgress);
            cc.director.loadScene("MainView");
        }
    }

    private _restoreScale(): void {
        if (this.bgSprite) {
            this.bgSprite.node.setScale(this._originalScale);
        }
    }
}
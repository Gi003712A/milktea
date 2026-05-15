const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonEffect extends cc.Component {

    @property(cc.Color)
    private normalColor: cc.Color = new cc.Color(255, 255, 255, 255);

    @property(cc.Color)
    private hoverColor: cc.Color = new cc.Color(200, 200, 200, 255);

    @property(cc.Color)
    private pressedColor: cc.Color = new cc.Color(180, 180, 180, 255);

    @property
    private hoverDuration: number = 0.3;

    @property
    private clickScale: number = 0.95;

    @property
    private clickDuration: number = 0.2;

    @property
    private enableColorEffect: boolean = true;

    @property
    private enableScaleEffect: boolean = true;

    @property
    private autoFindBackground: boolean = true;

    private _backgroundNode: cc.Node = null;
    private _originalScale: number = 1.0;
    private _isHovering: boolean = false;
    private _buttonComp: cc.Button = null;

    protected onLoad(): void {
        this._initNodes();
        this._setupEvents();
    }

    private _initNodes(): void {
        this._buttonComp = this.node.getComponent(cc.Button);

        if (this.autoFindBackground) {
            const background = this.node.getChildByName("Background");
            if (background) {
                this._backgroundNode = background;
            }
        }

        if (!this._backgroundNode) {
            this._backgroundNode = this.node;
        }

        const spriteComp = this._backgroundNode.getComponent(cc.Sprite);
        if (spriteComp) {
            this.normalColor = spriteComp.node.color.clone();
        }

        this._originalScale = this.node.scaleX;
    }

    private _setupEvents(): void {
        if (cc.sys.isMobile) {
            this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        } else {
            this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseEnter, this);
            this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this);
        }
    }

    private _onMouseEnter(event: cc.Event.EventMouse): void {
        if (this._isHovering) return;
        this._isHovering = true;

        if (this.enableColorEffect) {
            this._stopAllTweens();
            cc.tween(this._backgroundNode)
                .to(this.hoverDuration, { color: this.hoverColor })
                .start();
        }
    }

    private _onMouseLeave(event: cc.Event.EventMouse): void {
        if (!this._isHovering) return;
        this._isHovering = false;

        if (this.enableColorEffect) {
            this._stopAllTweens();
            cc.tween(this._backgroundNode)
                .to(this.hoverDuration, { color: this.normalColor })
                .start();
        }
    }

    private _onTouchStart(event: cc.Event.EventTouch): void {
        if (this.enableColorEffect) {
            this._stopAllTweens();
            cc.tween(this._backgroundNode)
                .to(0.1, { color: this.pressedColor })
                .start();
        }

        if (this.enableScaleEffect) {
            this._stopAllTweens();
            cc.tween(this.node)
                .to(this.clickDuration, { scale: this._originalScale * this.clickScale }, { easing: "quartOut" })
                .start();
        }
    }

    private _onTouchEnd(event: cc.Event.EventTouch): void {
        this._onTouchCancel(event);
    }

    private _onTouchCancel(event: cc.Event.EventTouch): void {
        if (this.enableColorEffect) {
            this._stopAllTweens();
            const targetColor = this._isHovering ? this.hoverColor : this.normalColor;
            cc.tween(this._backgroundNode)
                .to(this.hoverDuration, { color: targetColor })
                .start();
        }

        if (this.enableScaleEffect) {
            this._stopAllTweens();
            cc.tween(this.node)
                .to(this.clickDuration, { scale: this._originalScale }, { easing: "quartOut" })
                .start();
        }
    }

    private _stopAllTweens(): void {
        if (this._backgroundNode) {
            cc.Tween.stopAllByTarget(this._backgroundNode);
        }
        if (this.node) {
            cc.Tween.stopAllByTarget(this.node);
        }
    }

    protected onDestroy(): void {
        if (cc.sys.isMobile) {
            this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        } else {
            this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseEnter, this);
            this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this);
        }
    }

    public setNormalColor(color: cc.Color): void {
        this.normalColor = color;
    }

    public setHoverColor(color: cc.Color): void {
        this.hoverColor = color;
    }

    public setPressedColor(color: cc.Color): void {
        this.pressedColor = color;
    }
}

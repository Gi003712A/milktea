const {ccclass, property} = cc._decorator;

import { DrinkData, DrinkLockState } from "./DrinkData";

/**
 * 饮品项组件
 * 负责单个饮品项的锁定/解锁状态管理及UI交互
 */
@ccclass('DrinkItem')
export class DrinkItem extends cc.Component {

    // ==================== 节点引用 ====================

    /** 锁定遮罩层节点 */
    @property(cc.Node)
    private lockMask: cc.Node = null;

    /** 锁图标节点（带 Button 组件，点击直接解锁） */
    @property(cc.Node)
    private lockIcon: cc.Node = null;

    // ==================== 可配置属性 ====================

    /** 饮品数据 */
    @property
    private _drinkData: DrinkData = null;

    @property
    public get drinkData(): DrinkData {
        return this._drinkData;
    }

    public set drinkData(value: DrinkData) {
        this._drinkData = value;
        if (value) {
            this._lockState = value.isUnlocked ? DrinkLockState.UNLOCKED : DrinkLockState.LOCKED;
        }
        this._updateUI();
    }

    /** 当前锁定状态 */
    private _lockState: DrinkLockState = DrinkLockState.LOCKED;

    public get lockState(): DrinkLockState {
        return this._lockState;
    }

    // ==================== 回调 ====================

    /** 饮品选中回调（解锁后点击触发） */
    public onDrinkSelected: ((drinkData: DrinkData) => void) | null = null;

    /** 请求解锁弹窗回调（点击锁图标时触发） */
    public onRequestUnlockPopup: ((drinkData: DrinkData) => void) | null = null;

    // ==================== 生命周期 ====================

    protected onLoad(): void {
        this._initEvent();
        this._updateUI();
    }

    /**
     * 初始化事件监听
     */
    private _initEvent(): void {
        // 监听锁图标的点击事件
        if (this.lockIcon) {
            const button = this.lockIcon.getComponent(cc.Button);
            if (button) {
                this.lockIcon.on('click', this._onLockIconClick, this);
            }
        }
    }

    /**
     * 组件被销毁时
     */
    protected onDestroy(): void {
        // 移除事件监听
        if (this.lockIcon) {
            this.lockIcon.off('click', this._onLockIconClick, this);
        }
    }

    // ==================== 公开方法 ====================

    /**
     * 初始化饮品数据
     * @param data 饮品数据
     */
    public initWithData(data: DrinkData): void {
        if (!data) {
            cc.warn('[DrinkItem] 饮品数据不能为空');
            return;
        }
        this.drinkData = data;
    }

    /**
     * 获取饮品ID
     */
    public getDrinkId(): number | string {
        return this._drinkData?.drinkId ?? null;
    }

    /**
     * 获取饮品名称
     */
    public getDrinkName(): string {
        return this._drinkData?.drinkName ?? '';
    }

    /**
     * 获取解锁价格
     */
    public getUnlockPrice(): number {
        return this._drinkData?.unlockPrice ?? 0;
    }

    /**
     * 检查是否已解锁
     */
    public isUnlocked(): boolean {
        return this._lockState === DrinkLockState.UNLOCKED;
    }

    /**
     * 执行解锁
     * @param saveToStorage 是否保存到本地存储
     */
    public unlock(saveToStorage: boolean = true): void {
        if (this._lockState === DrinkLockState.UNLOCKED) {
            return;
        }

        this._lockState = DrinkLockState.UNLOCKED;
        if (this._drinkData) {
            this._drinkData.isUnlocked = true;
        }

        this._updateUI();

        // 保存解锁状态
        if (saveToStorage && this._drinkData?.drinkId != null) {
            this._saveUnlockState(this._drinkData.drinkId);
        }

        // 播放解锁动画
        this._playUnlockEffect();
    }

    /**
     * 重新锁定（用于测试）
     */
    public relock(): void {
        if (this._lockState === DrinkLockState.LOCKED) {
            return;
        }

        this._lockState = DrinkLockState.LOCKED;
        if (this._drinkData) {
            this._drinkData.isUnlocked = false;
        }

        this._updateUI();
    }

    // ==================== 私有方法 ====================

    /**
     * 处理锁图标点击（打开解锁弹窗）
     */
    private _onLockIconClick(): void {
        if (this._lockState === DrinkLockState.UNLOCKED) {
            return;
        }

        if (!this._drinkData) {
            cc.warn('[DrinkItem] 饮品数据未设置');
            return;
        }

        // 播放点击反馈动画
        this._playClickFeedback();

        // 触发解锁弹窗请求（由外部 PopupRoot 或 GameManager 处理）
        if (this.onRequestUnlockPopup) {
            this.onRequestUnlockPopup(this._drinkData);
        }

        // 发送事件（供外部监听）
        this.node.emit('request-unlock-popup', this._drinkData);
    }

    /**
     * 处理饮品点击（解锁后触发选择）
     */
    private _onDrinkClick(): void {
        if (this._lockState === DrinkLockState.LOCKED) {
            return;
        }

        if (!this._drinkData) {
            return;
        }

        // 触发选中回调
        if (this.onDrinkSelected) {
            this.onDrinkSelected(this._drinkData);
        }

        // 发送选中事件
        this.node.emit('drink-selected', this._drinkData);
    }

    /**
     * 更新UI状态
     */
    private _updateUI(): void {
        const isLocked = this._lockState === DrinkLockState.LOCKED;

        if (this.lockMask) {
            this.lockMask.active = isLocked;
        }

        if (this.lockIcon) {
            this.lockIcon.active = isLocked;
        }

        this.node.opacity = 255;

        const sprite = this.node.getComponent(cc.Sprite);
        if (sprite) {
            if (isLocked) {
                sprite.setState(cc.Sprite.State.GRAY);
            } else {
                sprite.setState(cc.Sprite.State.NORMAL);
            }
        }
    }

    /**
     * 播放点击反馈动画
     */
    private _playClickFeedback(): void {
        if (this.lockIcon) {
            const originalScaleX = this.lockIcon.scaleX;
            const originalScaleY = this.lockIcon.scaleY;
            const smallScaleX = originalScaleX * 0.9;
            const smallScaleY = originalScaleY * 0.9;

            this.lockIcon.scaleX = smallScaleX;
            this.lockIcon.scaleY = smallScaleY;

            this.scheduleOnce(() => {
                if (this.lockIcon) {
                    this.lockIcon.scaleX = originalScaleX;
                    this.lockIcon.scaleY = originalScaleY;
                }
            }, 0.1);
        }
    }

    /**
     * 播放解锁动画
     */
    private _playUnlockEffect(): void {
        // 隐藏锁图标和遮罩
        if (this.lockIcon) {
            this.lockIcon.active = false;
        }
        if (this.lockMask) {
            this.lockMask.active = false;
        }

        // 节点放大反馈
        const originalScaleX = this.node.scaleX;
        const originalScaleY = this.node.scaleY;
        const bigScaleX = originalScaleX * 1.1;
        const bigScaleY = originalScaleY * 1.1;

        this.node.scaleX = bigScaleX;
        this.node.scaleY = bigScaleY;

        this.scheduleOnce(() => {
            this.node.scaleX = originalScaleX;
            this.node.scaleY = originalScaleY;
        }, 0.15);
    }

    // ==================== 本地存储 ====================

    private static readonly STORAGE_KEY: string = 'tea_unlocked_drinks';

    /**
     * 保存解锁状态到本地存储
     */
    private _saveUnlockState(drinkId: number | string): void {
        try {
            const unlockedList = this._getUnlockedList();
            const idStr = String(drinkId);
            if (!unlockedList.includes(idStr)) {
                unlockedList.push(idStr);
                cc.sys.localStorage.setItem(DrinkItem.STORAGE_KEY, JSON.stringify(unlockedList));
            }
        } catch (error) {
            cc.error('[DrinkItem] 保存解锁状态失败:', error);
        }
    }

    /**
     * 获取已解锁列表
     */
    private _getUnlockedList(): string[] {
        try {
            const data = cc.sys.localStorage.getItem(DrinkItem.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * 从本地存储加载解锁状态
     */
    public static loadUnlockState(drinkId: number | string): boolean {
        try {
            const data = cc.sys.localStorage.getItem(DrinkItem.STORAGE_KEY);
            if (data) {
                const list: string[] = JSON.parse(data);
                return list.includes(String(drinkId));
            }
        } catch {
            // ignore
        }
        return false;
    }
}

// ============================================================
// 使用示例
// ============================================================

/*
【节点结构】
tea-16 (Sprite - 饮品图标，挂载 DrinkItem)
├── lockMask (遮罩层)
└── lockIcon (锁图标，带 Button 组件)

【在编辑器中配置】
1. 将 DrinkItem 组件挂载到 tea-16 节点
2. 设置节点引用：
   - lockMask: 拖入 lockMask 子节点
   - lockIcon: 拖入 lockIcon 子节点

【代码初始化】
const drinkItem = node.getComponent(DrinkItem);
drinkItem.initWithData({
    drinkId: 1001,
    drinkName: '珍珠奶茶',
    unlockPrice: 1500,  // 从1500起依次递增
    isUnlocked: false
});

【监听饮品选中（解锁后点击触发）】
drinkItem.onDrinkSelected = (drinkData) => {
    console.log('选择了:', drinkData.drinkName);
};

【监听解锁弹窗请求（点击锁图标触发）】
drinkItem.onRequestUnlockPopup = (drinkData) => {
    // 显示解锁弹窗
    const unlockPopup = cc.find("Canvas/unlockPopup").getComponent("UnlockPopup");
    unlockPopup.show({
        drinkName: drinkData.drinkName,
        unlockPrice: drinkData.unlockPrice,
        confirmText: "立即解锁"
    });
};

【监听事件方式】
drinkItem.node.on('request-unlock-popup', (event) => {
    const drinkData: DrinkData = event.detail;
    console.log('请求解锁弹窗:', drinkData.drinkName);
});

【批量加载解锁状态】
for (const itemNode of drinkItemNodes) {
    const drinkItem = itemNode.getComponent(DrinkItem);
    if (DrinkItem.loadUnlockState(drinkItem.getDrinkId())) {
        drinkItem.unlock(false);
    }
}

【与 UnlockPopup 配合使用】
1. 在 PopupRoot 或 GameManager 中初始化所有 DrinkItem
2. 给每个 DrinkItem 设置 onRequestUnlockPopup 回调
3. 回调中调用 UnlockPopup.show() 显示弹窗
4. 在弹窗的 onUnlockConfirm 回调中：
   - 扣除金币
   - 调用 DrinkItem.unlock() 解锁
示例：
unlockPopup.onUnlockConfirm = (data) => {
    const drinkItem = this._getDrinkItemByName(data.drinkName);
    if (drinkItem) {
        CoinManager.consumeCoins(data.unlockPrice);
        drinkItem.unlock();
    }
};
*/

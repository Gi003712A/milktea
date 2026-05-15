/**
 * 饮品数据结构定义
 */

/**
 * 饮品项锁定/解锁状态
 */
export enum DrinkLockState {
    LOCKED = 0,      // 锁定状态
    UNLOCKED = 1,    // 已解锁状态
}

/**
 * 饮品项数据接口
 */
export interface DrinkData {
    drinkId: number | string;   // 饮品ID（唯一标识）
    drinkName: string;          // 饮品名称
    drinkIcon: string;          // 饮品图标资源路径（可选）
    unlockPrice: number;        // 解锁价格
    isUnlocked: boolean;        // 是否已解锁
    unlockCondition?: string;   // 解锁条件描述（可选）
}

/**
 * 解锁弹窗数据类型
 */
export interface UnlockPopupData {
    drinkName: string;         // 饮品名称
    drinkIcon: string;         // 饮品图标资源路径（可选）
    unlockPrice: number;        // 解锁价格
    confirmText?: string;      // 确认按钮文字（可选，默认"解锁"）
}

/**
 * 饮品价格配置
 */
export const DrinkPriceConfig = {
    BASE_PRICE: 1500,          // 基础价格
    PRICE_STEP: 300,            // 每个饮品递增金额
};

/**
 * 根据索引计算饮品解锁价格
 * @param index 饮品索引（从0开始）
 * @returns 解锁价格
 */
export function calculateDrinkPrice(index: number): number {
    return DrinkPriceConfig.BASE_PRICE + index * DrinkPriceConfig.PRICE_STEP;
}

/**
 * 预设饮品数据列表（共16种）
 */
export const DRINK_LIST: DrinkData[] = [
    {
        drinkId: 1,
        drinkName: "珍珠奶茶",
        drinkIcon: "drink/bubble_milk_tea",
        unlockPrice: calculateDrinkPrice(0),  // 1500
        isUnlocked: false,
        unlockCondition: "首次通关解锁"
    },
    {
        drinkId: 2,
        drinkName: "椰果奶茶",
        drinkIcon: "drink/coconut_milk_tea",
        unlockPrice: calculateDrinkPrice(1),  // 1800
        isUnlocked: false,
        unlockCondition: "收集5种食材解锁"
    },
    {
        drinkId: 3,
        drinkName: "芋泥波波",
        drinkIcon: "drink/taro_bobo",
        unlockPrice: calculateDrinkPrice(2),  // 2100
        isUnlocked: false,
        unlockCondition: "达到10级解锁"
    },
    {
        drinkId: 4,
        drinkName: "杨枝甘露",
        drinkIcon: "drink/mango_grapefruit",
        unlockPrice: calculateDrinkPrice(3),  // 2400
        isUnlocked: false,
        unlockCondition: "完成日常任务解锁"
    },
    {
        drinkId: 5,
        drinkName: "烧仙草奶茶",
        drinkIcon: "drink/grass_jelly_tea",
        unlockPrice: calculateDrinkPrice(4),  // 2700
        isUnlocked: false,
        unlockCondition: "累计消费5000金币解锁"
    },
    {
        drinkId: 6,
        drinkName: "茉莉奶绿",
        drinkIcon: "drink/jasmine_milk_green",
        unlockPrice: calculateDrinkPrice(5),  // 3000
        isUnlocked: false,
        unlockCondition: "邀请好友解锁"
    },
    {
        drinkId: 7,
        drinkName: "多肉葡萄",
        drinkIcon: "drink/rich_grape",
        unlockPrice: calculateDrinkPrice(6),  // 3300
        isUnlocked: false,
        unlockCondition: "连续登录7天解锁"
    },
    {
        drinkId: 8,
        drinkName: "生椰拿铁",
        drinkIcon: "drink/coconut_latte",
        unlockPrice: calculateDrinkPrice(7),  // 3600
        isUnlocked: false,
        unlockCondition: "单日收入突破1000解锁"
    },
    {
        drinkId: 9,
        drinkName: "柠檬绿茶",
        drinkIcon: "drink/lemon_green_tea",
        unlockPrice: calculateDrinkPrice(8),  // 3900
        isUnlocked: false,
        unlockCondition: "解锁全部配料后解锁"
    },
    {
        drinkId: 10,
        drinkName: "满杯西柚",
        drinkIcon: "drink/pomelo_full",
        unlockPrice: calculateDrinkPrice(9),  // 4200
        isUnlocked: false,
        unlockCondition: "累计充值100元解锁"
    },
    {
        drinkId: 11,
        drinkName: "芒果冰沙",
        drinkIcon: "drink/mango_smoothie",
        unlockPrice: calculateDrinkPrice(10),  // 4500
        isUnlocked: false,
        unlockCondition: "通关第5关解锁"
    },
    {
        drinkId: 12,
        drinkName: "草莓奶盖",
        drinkIcon: "drink/strawberry_cheese",
        unlockPrice: calculateDrinkPrice(11),  // 4800
        isUnlocked: false,
        unlockCondition: "收集10种配料解锁"
    },
    {
        drinkId: 13,
        drinkName: "奥利奥奶茶",
        drinkIcon: "drink/oreo_milk_tea",
        unlockPrice: calculateDrinkPrice(12),  // 5100
        isUnlocked: false,
        unlockCondition: "累计制作100杯解锁"
    },
    {
        drinkId: 14,
        drinkName: "抹茶拿铁",
        drinkIcon: "drink/matcha_latte",
        unlockPrice: calculateDrinkPrice(13),  // 5400
        isUnlocked: false,
        unlockCondition: "达到20级解锁"
    },
    {
        drinkId: 15,
        drinkName: "芋泥啵啵",
        drinkIcon: "drink/taro_bobo",
        unlockPrice: calculateDrinkPrice(14),  // 5700
        isUnlocked: false,
        unlockCondition: "单日制作50杯解锁"
    },
    {
        drinkId: 16,
        drinkName: "桂花乌龙",
        drinkIcon: "drink/osmanthus_oolong",
        unlockPrice: calculateDrinkPrice(15),  // 6000
        isUnlocked: false,
        unlockCondition: "成为VIP解锁"
    },
];
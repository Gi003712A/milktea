const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneJump extends cc.Component {

    @property
    private sceneName: string = "MainView";

    public jump(): void {
        cc.director.loadScene(this.sceneName);
    }
    
}
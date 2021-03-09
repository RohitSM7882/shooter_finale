const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    target: cc.Prefab = null;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    @property(cc.Label)
    display: cc.Label = null;

    @property
    tarobjects = new Array(10);
    tarlist = new Array(10);
    count: number = 0;
    angleD = new Array(10);
    randomlocs = new Array(10);

    getRandomLocs(){
        var i = 0;
        var j = 0;
        for(i=0;i<10;i++){
            if(i<3){
                this.randomlocs[i] = [this.getRandom(-600,600),this.getRandom(-100,-50)];
                if(i==0)
                    this.randomlocs[i][0] = this.getRandom(-600,-250);
                if(i==1)
                    this.randomlocs[i][0] = this.getRandom(-200,150);
                if(i==2)
                    this.randomlocs[i][0] = this.getRandom(200,600);
            }
            else if(i<5){
                this.randomlocs[i] = [this.getRandom(-600,600),this.getRandom(0,50)];
                if(i==3)
                    this.randomlocs[i][0] = this.getRandom(-600,-50);
                if(i==4)
                    this.randomlocs[i][0] = this.getRandom(50,600);
            }
            else if(i<7){
                this.randomlocs[i] = [this.getRandom(-600,600),this.getRandom(150,200)];
                if(i==5)
                    this.randomlocs[i][0] = this.getRandom(-600,-50);
                if(i==6)
                    this.randomlocs[i][0] = this.getRandom(50,600);
            }    
            else
                this.randomlocs[i] = [this.getRandom(-600,600),this.getRandom(250,300)];
                if(i==7)
                    this.randomlocs[i][0] = this.getRandom(-600,-250);
                if(i==8)
                    this.randomlocs[i][0] = this.getRandom(-200,150);
                if(i==9)
                    this.randomlocs[i][0] = this.getRandom(200,600);
        }
       
    }

    spawnTargets(i:number){
            var newTarget = cc.instantiate(this.target);

            var targetx = this.randomlocs[i][0]; 
            var targety = this.randomlocs[i][1];
            
            newTarget.setPosition(targetx,targety);
            this.node.addChild(newTarget);
            var playerx = this.node.getChildByName('Player').position.x;
            var playery = this.node.getChildByName('Player').position.y;

            //Euclidean distance is used to find the nearest point wrt player
            var res = Math.sqrt(((targetx-playerx)*(targetx-playerx)) + ((playery-targety)*(playery-targety)));
            var arr = [targetx,targety,newTarget,res];
            return arr;
    }

    getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
        
    }

    convert(x,y){
        var playerx = this.node.getChildByName('Player').position.x;
        var playery = this.node.getChildByName('Player').position.y;

        var theta = Math.atan2(y-playery,x-playerx);
        theta *= 180 / Math.PI;
        if(theta < 0) 
            theta = 360 + theta;
        return theta-90;
    }

    killTarget(){
        if(this.count >= 10)
            return;

        var player = this.node.getChildByName('Player');
        player.angle = this.angleD[this.count];

        var newBullet = cc.instantiate(this.bullet);
        newBullet.setPosition(this.node.getChildByName('Player').position.x,this.node.getChildByName('Player').position.y);
        this.node.addChild(newBullet);

        var actionBy = cc.moveTo(0.2, cc.v2(this.tarlist[this.count][0],this.tarlist[this.count][1]));
        var destruction = cc.callFunc(function(){
                newBullet.destroy();
                this.tarobjects[this.count].destroy();
                this.count = this.count+1;
                if(this.count == 10){
                    this.display.string = "CONGRATULATIONS!!!";
                }
        },this);

        var sequence = cc.sequence(actionBy,destruction);
        newBullet.runAction(sequence);

    }

    resetGame(){
        cc.director.loadScene("Game");
    }
    
    onLoad () {
        var i:number = 0;
        var temp = new Array(10);
        this.getRandomLocs();

        for(i=0;i<10;i++){
            temp[i] = this.spawnTargets(i);
        }
        
        temp.sort(function (a,b) {
            return a[3] - b[3];
        });

        for(i=0;i<10;i++){    
            this.tarlist[i] = [temp[i][0],temp[i][1]];
            this.tarobjects[i] = temp[i][2];
        }

        for(i=0;i<10;i++){
            this.angleD[i] = this.convert(this.tarlist[i][0],this.tarlist[i][1]);
            // console.log(this.angleD[i]);
        }

    }

    start () {

    }

    // update (dt) {}
}

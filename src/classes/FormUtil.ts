/*
PURPOSE:
* To scale and place in Phaser scene, 
* use the following code in the scene's create() method

? CODE START
  this.formUtil.scaleToGameW("btnSend", .25);
  this.formUtil.placeElementAt(101, "btnSend");

  this.formUtil.scaleToGameW("btnCancel", .25);
  this.formUtil.placeElementAt(107, "btnCancel");
? END CODE
*/

import Phaser from 'phaser';
import AlignGrid from './AlignGrid';
import { AlignGridConfig } from './AlignGrid';

export default class FormUtil {

  scene: Phaser.Scene;
  gameWidth: string | number;
  gameHeight: string | number;
  alignGrid: AlignGrid;
  formUtil: FormUtil;

    constructor(config) {
        //super();
        this.scene = config.scene;
        //get the game height and width
        this.gameWidth = this.scene.game.config.width;
        this.gameHeight = this.scene.game.config.height;
        this.alignGrid = new AlignGrid({
            scene: this.scene,
            rows: config.rows,
            cols: config.cols
        });
    }
    showNumbers() {
        this.alignGrid.showNumbers();
    }
    scaleToGameW(elName, per) {
        const el = document.getElementById(elName);
        const w: any = this.gameWidth as number * per;
        el!.style.width = w + "px";
    }
    scaleToGameH(elName, per) {
        const el = document.getElementById(elName);
        const h = this.gameHeight as number * per;
        el!.style.height = h + "px";
    }
    placeElementAt(index, elName, centerX = true, centerY = false) {
        //get the position from the grid
        const pos = this.alignGrid.getPosByIndex(index);
        //extract to local consts
        let x = pos.x;
        let y = pos.y;
        //get the element
        const el = document.getElementById(elName);
        //set the position to absolute
        el!.style.position = "absolute";
        //get the width of the element
        let w: any = el!.style.width;
        //convert to a number
        w = this.toNum(w);
        //
        //
        //center horizontal in square if needed
        if (centerX == true) {
            x -= w / 2;
        }
        //
        //get the height
        //        
        let h: any = el!.style.height;
        //convert to a number
        h = this.toNum(h);
        //
        //center verticaly in square if needed
        //
        if (centerY == true) {
            y -= h / 2;
        }
        //set the positions
        el!.style.top = y + "px";
        el!.style.left = x + "px";
    }
    //changes 100px to 100
    toNum(s) {
        s = s.replace("px", "");
        s = parseInt(s);
        return s;
    }
    //add a change callback
    addChangeCallback(elName, fun, scope = null) {
        const el = document.getElementById(elName);
        if (scope == null) {
            el!.onchange = fun;
        } else {
            el!.onchange = fun.bind(scope);
        }
    }
    getTextAreaValue(elName) {
        const el = document.getElementById(elName) as HTMLTextAreaElement;
        return el!.value;
    }
    getTextValue(elName) {
        const el = document.getElementById(elName);
        return el!.innerText;
    }
    hideElement(elName) {
        const el = document.getElementById(elName);
        el!.style.display = "none";
    }
    showElement(elName) {
        const el = document.getElementById(elName);
        el!.style.display = "block";
    }

    addOption(dropDown, text, item) {
        const select = document.getElementById(dropDown) as HTMLSelectElement;
        const option = document.createElement('option');
        option.text = text;
        option.setAttribute('data-item', JSON.stringify(item));
        select!.add(option, 0);
    }

    getSelectedItem(dropDown) {
        const e = document.getElementById(dropDown) as HTMLSelectElement;
        return JSON.parse(e.options[e.selectedIndex].getAttribute('data-item') || '{}');
    }

    getSelectedIndex(dropDown) {
        const el = document.getElementById(dropDown) as HTMLSelectElement;
        return el.selectedIndex;
    }

    getSelectedText(dropDown) {
        const e = document.getElementById(dropDown) as HTMLSelectElement;
        return e.options[e.selectedIndex].text;
    }

    optListChanged() {
        console.log("optListChanged");
        const obj=this.formUtil.getSelectedItem('optList');
        console.log(obj);

    }

    addClickCallback(elName, fun, scope = null) {
        const el = document.getElementById(elName);
        if (scope == null) {
            el!.onclick = fun;
        } else {
            el!.onclick = fun.bind(scope);
        }
    }
}

/*
INFO
* The addClickCallback function takes an element id that is passed as a string. 
* It gets the element from the document based on the id and then adds a click event linking to the function to that element. 
* If a scope is passed then it binds the scope to the function. 
* Here is how we can use it in sceneMain (bottom of create function):

? CODE START
  this.formUtil.addClickCallback("btnSend", this.sendForm, this);
  this.formUtil.addClickCallback("btnCancel", this.cancelForm, this);
? CODE END

* And then the functions we will be calling

? CODE START
  sendForm() {
    console.log("sendForm");
  }
  cancelForm() {
    console.log("cancelForm");
  }
? CODE END
*/
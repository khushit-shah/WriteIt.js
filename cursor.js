/**
 * TODO: Documentation
 */

/**
 * @license MIT
 * @author KhushitShah
 */
class Cursor {
  /**
   * Creates new CursorJS class handles starting of animation of nodes and SEO.
   */
  constructor() {
    this.CURSOR_ANIMATE = "cursor-animate";
    this.CURSOR_AUTO_START = "cursor-auto-start";
    this.CURSOR_CHAR = "cursor-char";
    this.CURSOR_REPLACE_NEXT = "cursor-replace-next";
    this.CURSOR_SPEED = "cursor-speed";
    this.CURSOR_SPEED_FIXED = "cursor-speed-fixed";
    this.CURSOR_HAS_PREV = "cursor-has-prev";
    this.CURSOR_START_DELAY = "cursor-start-delay";
    this.CURSOR_LOOP = "cursor-loop";
    this.CURSOR_NEXT = "cursor-next";
    this.CURSOR_HIDDEN = "cursor-hidden";
    this.CURSOR_NO_BLINKING_CURSOR = "cursor-no-blink";

    /**
     * @type HTMLElement[]
     */
    this.nodes = [];

    this.init();
    /**  }

     * @type CursorNode[]
     */
    this.cursorNodes = [];
  }

  /**
   * Starts animating whole page.
   */
  startAnimation() {
    this.nodes.forEach(element => {
      let c = new CursorNode(element);
      this.cursorNodes.push(c);
      c.startAnimation();
    });
  }

  init() {
    this.nodes = Array.from(
      document.querySelectorAll("*[" + this.CURSOR_ANIMATE + "]")
    );

    //// Make inner Text to change to CURSOR_REPLACE_NEXT attribute.


    // Make the nodes declared with CURSOR_HIDDEN hidden.
    document.querySelectorAll("*[" + this.CURSOR_HIDDEN + "]").forEach(element => {
      element.style.pdisp = element.style.display;
      element.style.display = "none";
    });
    this.seo();

    // Automatically start Animation if cursor-auto-start attribute is present,
    // this is not related with the animation of node
    // but, it starts parsing each node which has "cursor-animate"

    if (document.querySelector("*[" + this.CURSOR_AUTO_START + "]")) {
      this.startAnimation();
    }
  }

  /**
   * Adds a Cloned Hidden Node to html for SEO optimization, as
   * The original node text is going to change.
   */
  seo() {
    this.nodes.forEach(element => {
      const newELement = element.cloneNode(true);
      newELement.style.display = "none";
      element.parentNode.appendChild(newELement);
    });
  }
}

class CursorNode {
  /**
   * Creates A Node to Animate.
   * @param {HTMLElement} node
   * @param {boolean} _fromAnotherNode
   */
  constructor(node, _fromAnotherNode) {
    /**
     * @type RegExp
     * Looks for a comma after any character.
     */
    this.commaSepReg = /,(?!\\)/;
    if (node == undefined || node == null) {
      throw new Error("Node must be a valid HTML tag");
    }
    this.node = node;
    this.fromAnotherNode = _fromAnotherNode;
    this.waitIndex = [];
    this.writeAllTextAtOnceIndex = [];
    this.wait = false;
    this.init();

  }

  init() {
    if (this.node.hasAttribute(CursorJS.CURSOR_CHAR)) {
      this.cursorChar = this.node.getAttribute(CursorJS.CURSOR_CHAR);
    } else {
      this.cursorChar = "|";
    }
    if (this.node.hasAttribute(CursorJS.CURSOR_REPLACE_NEXT)) {
      this.texts = this.node
        .getAttribute(CursorJS.CURSOR_REPLACE_NEXT)
        .split("")
        .reverse()
        .join("")
        .split(this.commaSepReg)
        .map(s =>
          s
            .split("")
            .reverse()
            .join("")
            .replace("\\,", ",")
        )
        .reverse();
      this.text = this.texts[0];
      this.textsIndex = 0;
    } else {
      this.text = this.node.innerHTML;
    }
    // set waits Indexes.
    let temp = 0;
    let i;
    while ((i = this.text.indexOf('${', temp)) > 0) {
      let secToWait = this.text.substring(i + 2, this.text.indexOf('}', i));
      this.waitIndex[i] = secToWait;
      this.text = this.text.replace(this.text.substring(i, this.text.indexOf("}", i) + 1), "");
      console.log(this.text, this.text[i]);
      temp += 2;
    }

    temp = 0;
    while ((i = this.text.indexOf('$`', temp)) > 0) {
      console.log("here");
      let endIndex = this.text.indexOf("`", i + 2);
      this.writeAllTextAtOnceIndex[i] = endIndex;
      this.text = this.text.replace(this.text.substring(i, endIndex + 1), this.text.substring(i + 2, endIndex));
      temp += endIndex + 1;
    }
    console.log(this.waitIndex);
    console.log(this.writeAllTextAtOnceIndex);

    // remove all ${30} and $`a`
    // this.text = this.text.replace(/\$\{[0-9.]+\}/g, "", );
    // this.text = this.text.replace(/\$`*`/g, "");
    this.text = this.text.trim();
    this.speed = 0;
    this.index = 0;
    this.reverse = false;

    this.setSpeed();
  }

  /**
   * Sets a speed for the animation.
   * If cursor-speed-* is present than it uses that,
   * otherwise uses default speed of "6.5±1" letters/second.
   */
  setSpeed() {
    this.speed = 1000 / (Math.random() * (7.5 - 5.5) + 5.5); // Time in millis to write one letter.
    if (this.node.hasAttribute(CursorJS.CURSOR_SPEED_FIXED)) {
      this.speed =
        1000 / parseFloat(this.node.getAttribute(CursorJS.CURSOR_SPEED_FIXED));
    } else if (this.node.hasAttribute(CursorJS.CURSOR_SPEED)) {
      this.speed =
        1000 /
        (Math.random() * 3 +
          (parseFloat(this.node.getAttribute(CursorJS.CURSOR_SPEED)) - 1));
    }
  }

  /**
   * Starts Animation according to factors like delay, before element etc.
   */
  startAnimation() {
    let delay = 0;
    if (
      this.fromAnotherNode ||
      !this.node.hasAttribute(CursorJS.CURSOR_HAS_PREV)
    ) {
      this.node.innerHTML = this.cursorChar;
      if (this.node.hasAttribute(CursorJS.CURSOR_START_DELAY)) {
        delay =
          1000 *
          parseFloat(this.node.getAttribute(CursorJS.CURSOR_START_DELAY));
      }
    } else {
      // Element has "cursor-has-prev" attribute So, Don't start animating.
      return;
    }
    if (this.node.hasAttribute(CursorJS.CURSOR_HIDDEN)) {
      this.node.style.display = this.node.style.pdisp;
    }
    this.setTimeout(this.animate, delay);
  }

  /**
   * Adds/Removes a letter from "html";
   */
  animate() {
    if (this.waitIndex[this.index] != undefined && this.wait == false) {
      let waitingTime = this.waitIndex[this.index];
      this.wait = true;
      this.node.innerHTML = this.text.substring(0, this.index + 1) + this.cursorChar;
      this.index++;
      this.timeout = this.setTimeout(() => { this.wait = false; this.animate(); }, waitingTime * 1000);
      return;
    } else if (this.wait == true) {
      return;
    }
    if (this.writeAllTextAtOnceIndex[this.index] != undefined) {
      this.node.innerHTML = this.text.substring(0, this.writeAllTextAtOnceIndex[this.index] - 1);
      this.index = this.node.innerHTML.length;
      this.node.innerHTML += this.cursorChar;
    }

    // Browser may have added ending tag so ignore it.
    let str = this.node.innerHTML.substring(0, this.index);

    // Remove the cursorChar.
    str = str.substr(0, str.length - this.cursorChar.length);

    // Add HTML without cursor.
    this.node.innerHTML = str;

    // If reverse remove a character from last.
    if (this.reverse) {
      // We are at start of  the string.
      if (str.length <= 0) {
        this.handleIterationEnd();
        return;
      }
      let chrToRemove = str.substr(str.length - 1, 1);
      if (chrToRemove == ">") {
        // Go back until next < is found.
        chrToRemove = this.text.substring(
          str.length,
          str.lastIndexOf("<", str.length)
        );
        str = str.substr(0, str.length - chrToRemove.length);
        this.index -= chrToRemove.length;
      } else if (chrToRemove == ";") {
        // Go back until next & is found.
        chrToRemove = this.text.substring(
          str.length,
          str.lastIndexOf("&", str.length)
        );
        str = str.substr(0, str.length - chrToRemove.length);
        this.index -= chrToRemove.length;
      } else {
        str = str.substring(0, str.length - 1);
        this.index--;
      }
    } else {
      if (str.length >= this.text.length) {
        // We are at End in the string.
        this.handleIterationEnd();
        return;
      }
      // Add a letter to the last.
      let chrToAdd = this.text.substr(str.length, 1);

      if (chrToAdd == "<") {
        // Take everything until ">".
        chrToAdd = this.text.substring(
          str.length,
          this.text.indexOf(">", str.length) + 1
        );
      } else if (chrToAdd == "&") {
        // handle &...;
        chrToAdd = this.text.substring(
          str.length,
          this.text.indexOf(";", str.length) + 1
        );
      }

      this.index += chrToAdd.length;

      str = str + chrToAdd;
    }

    // Add cursor at the end.
    str += this.cursorChar;

    // Update the InnerHTML
    this.node.innerHTML = str;
    this.nextIteration();
  }

  /**
   * Gets Executed after animation is over,
   * It decides whether to rerun or reverse or call animation of another element.
   */
  handleIterationEnd() {
    if (this.reverse) {
      // Check if it has CURSOR_REPLACE_NEXT, then replace text with next text.
      if (this.node.hasAttribute(CursorJS.CURSOR_REPLACE_NEXT)) {
        // If we are already at the last position.
        if (this.textsIndex >= this.texts.length) {
          // Start from first if it has cursor-loop.
          if (this.node.hasAttribute(CursorJS.CURSOR_LOOP)) {
            this.node.innerHTML = this.cursorChar;
            this.text = this.texts[0];
            this.textsIndex = 0;
            this.reverse = false; // Now we are going forward.
            this.setTimeout(this.animate, this.speed);
          }
        } else {
          // Just increment the textsIndex.
          this.text = this.texts[++this.textsIndex];
          this.trigerNextAnimation(false, 0, true);
        }
      }
    } else {
      if (this.node.hasAttribute(CursorJS.CURSOR_REPLACE_NEXT)) {
        // Current Text has been writtern, Start reverse.
        // if this is last text and node don't conatains cursor-loop then stop.
        if (
          this.textsIndex == this.texts.length - 1 &&
          !this.node.hasAttribute(CursorJS.CURSOR_LOOP)
        ) {
          this.animationEnd();
          return;
        } else {
          this.trigerNextAnimation(true);
        }
      } else if (this.node.hasAttribute(CursorJS.CURSOR_LOOP)) {
        this.trigerNextAnimation(false, 0, true);
      } else {
        // Add Simple Blinking cursor animation.
        this.animationEnd();
      }
    }
  }

  /**
   * Handles end of the animation of element, starts last blinking cursor or trigers animation of another elements.
   */
  animationEnd() {
    if (this.node.hasAttribute(CursorJS.CURSOR_NEXT)) {
      // Go through all of them and start them.
      let elem = this.node.getAttribute(CursorJS.CURSOR_NEXT).split(",");
      elem.forEach(e => {
        let node = document.querySelector(e);
        new CursorNode(node, true).startAnimation();
      });
    } else {
      if (!this.node.hasAttribute(CursorJS.CURSOR_NO_BLINKING_CURSOR))
        this.lastCursorBlinkAnimation();
    }
  }
  /**
   * @param {boolean} reverse wether animation is reverse or forward.
   * @param {integer} _index (optional) decides wether to set index.
   * @param {boolean} _reInitNode (optional) decides wether to set node.innerHTML with cursorChar.
   */
  trigerNextAnimation(reverse, _index, _reInitNode) {
    this.reverse = reverse;
    this.index = _index != undefined ? _index : this.index;
    this.node.innerHTML = _reInitNode ? this.cursorChar : this.node.innerHTML;
    this.setTimeout(this.animate, this.speed);
  }

  /**
   * Keeps blinking cursor for infinity.
   */
  lastCursorBlinkAnimation() {
    this.setInterval(() => {
      if (this.node.innerHTML != this.text + this.cursorChar) {
        this.node.innerHTML = this.text + this.cursorChar;
      } else {
        this.node.innerHTML = this.text;
        for (let i = 0; i < this.cursorChar.length; i++) {
          this.node.innerHTML += "&nbsp;";
        }
      }
    }, 500);
  }

  /**
   * Resets the speed and calls the animate function as per delay
   */
  nextIteration() {
    this.setSpeed();
    this.setTimeout(this.animate, this.speed);
  }
  setInterval(method, delay) {
    return setInterval(method.bind(this), delay);
  }
  setTimeout(method, delay) {
    return setTimeout(method.bind(this), delay);
  }
}
const CursorJS = new Cursor();
console.log("Cursor.js v2,0 loaded!👍, visit https://github.com/khushit-shah/Cursor.js");
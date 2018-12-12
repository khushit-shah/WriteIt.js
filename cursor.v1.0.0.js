class Cursor {
    constructor() {
        this.nodes = [];
        this.texts = [];
        this.init();
        this.seo();
        this.startAnimation();
    }
    init() {
        this.nodes = Array.from(document.querySelectorAll("*[cursor-animate]"));
        this.nodes.forEach(node => {
            this.texts.push(node.innerHTML);
        });
    }
    seo() {
        for (const i in this.nodes) {
            if (this.nodes.hasOwnProperty(i)) {
                const element = this.nodes[i];
                const newElem = element.cloneNode(true);
                element.style.display = "none";
                this.nodes[i] = newElem;
                element.parentNode.appendChild(newElem);
            }
        }
    }
    startAnimation() {
        for (const i in this.nodes) {
            if (this.nodes.hasOwnProperty(i)) {
                if (!this.nodes[i].hasAttribute("cursor-before"))
                    new Node(this.nodes[i], this.texts[i]);
            }
        }
    }
}
class Node {
    /**
     *
     * @param {Node} node 
     * @param {string} text
     * @memberof node
     */
    constructor(_node, _text) {
        if (_node == undefined || _node == null) {
            throw new Error("Node Must be a valid HTML Element");
        }
        this.node = _node;
        this.text = _text;
        this.texts = [];
        this.reverse = false;
        this.index = 0;
        this.speed = 0;
        this.nodeInnerHTML = "";
        this.setSpeed();
        if (this.node.hasAttribute("cursor-replace-next")) {
            this.texts = this.node.getAttribute("cursor-replace-next").split(",");
        }
        this.animate();
    }
    animate() {
        /* Empty Node innerHTML; */

        this.node.innerHTML = "";
        this.nodeInnerHTML = "";
        if (!this.reverse) {
            for (let j = 0; j < this.index; j++) {
                if (this.text[j] == "<") {
                    while (this.text[j] != ">") {
                        this.nodeInnerHTML += this.text[j];
                        j++;
                    }
                    this.nodeInnerHTML += this.text[j];
                } else {
                    this.nodeInnerHTML += this.text[j];
                }
            }
            this.nodeInnerHTML += "|";
            if (this.text[this.index] == "<") {
                while (this.text[this.index] != ">") {
                    this.index++;
                }
                this.index++;
            }
        } else {
            if (this.text[this.index] == ">") {
                while (this.text[this.index] != "<") {
                    this.nodeInnerHTML += this.text[this.index];
                    this.index--;
                }
                this.nodeInnerHTML += this.text[this.index];
                this.index--;
            }

            for (let j = this.index; j >= 0; j--) {
                if (this.text[j] == ">") {
                    while (this.text[j] != "<") {
                        this.nodeInnerHTML += this.text[j];
                        j--;
                    }
                    this.nodeInnerHTML += this.text[j];
                } else {
                    this.nodeInnerHTML += this.text[j];
                }
            }
            this.nodeInnerHTML = this.nodeInnerHTML.split("").reverse().join("");
            this.nodeInnerHTML += "|";
        }
        this.node.innerHTML = this.nodeInnerHTML;
        this.setSpeed();
        this.handle();
    }

    handle() {
        if (this.reverse) {
            this.index--;
            if (this.index < 0) {
                if (this.node.hasAttribute("cursor-replace-next")) {
                    let j = 0;
                    for (; j < this.texts.length; j++) {
                        if (text[j] == text) {
                            this.index = 0;
                            this.reverse = false;
                            if (j + 1 == this.texts.length) {
                                this.text = this.text[0];
                            } else {
                                this.text = this.texts[j + 1];
                            }
                            this.setTimeout(this.speed);
                            return;
                        }
                    }
                    if (j == this.texts.length) {
                        this.text = this.texts[0];
                        this.index = 0;
                        this.reverse = false;
                        this.setTimeout(this.speeed);
                    }

                } else {
                    this.index = 0;
                    this.reverse = false;
                    this.setTimeout(this.speed);
                    return;
                }

            } else {
                this.reverse = true;
                this.setTimeout(this.speed);
            }
        } else {
            this.index++;
            if (this.index > this.text.length) {
                if (this.node.hasAttribute("cursor-after")) {
                    try {
                        let next = document.querySelector(this.node.getAttribute("cursor-after"));
                        new Node(next, next.innerHTML);
                        this.node.removeAttribute("cursor-after");
                    } catch (error) {
                        console.log(error);
                    }
                }

                if (this.node.hasAttribute("cursor-replace-next")) {
                    this.index = this.text.length - 1;
                    this.reverse = true;
                    this.setTimeout(this.speed);
                } else if (this.node.hasAttribute("cursor-loop")) {
                    this.index = 0;
                    this.setTimeout(this.speed);
                } else if (this.node.hasAttribute("cursor-loop-reverse")) {
                    this.index = this.text.length - 1;
                    this.reverse = true;
                    this.setTimeout(this.speed);
                } else {
                    let that = this;
                    setInterval(function () {
                        if (that.node.innerHTML == that.text) {
                            that.node.innerHTML += "|";
                        } else {
                            that.node.innerHTML = that.text;
                        }
                    }, 500);
                }
            } else {
                this.setTimeout(this.speed);
            }
        }
    }
    /**
     *
     *
     * @param {function} call
     * @param {int} time
     * @memberof node
     */
    setTimeout(time) {
        setTimeout(this.animate.bind(this), time);
    }

    setSpeed() {
        if (this.node.hasAttribute("cursor-speed-fixed")) {
            this.speed = 1000 / this.node.getAttribute("cursor-speed-fixed");
        } else if (this.node.hasAttribute("cursor-speed")) {
            let baseSpeed = 1000 / this.node.getAttribute("cursor-speed");
            this.speed = Math.random() * ((baseSpeed + 100) - (baseSpeed - 100)) + (baseSpeed - 100);
        } else {
            this.speed = Math.random() * (300 - 150) + 150;
        }
    }
}
window.onload = function () {
    new Cursor();
};
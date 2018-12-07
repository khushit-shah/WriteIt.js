window.onload = (
    function () {
        console.log("Loaded Cursor.js");
        let elem = [];
        let tempelem = document.querySelectorAll("*[cursor-animate]");
        let elemText = [];
        for (const key in tempelem) {
            if (tempelem.hasOwnProperty(key)) {
                const element = tempelem[key];
                elem[key] = element;
            }
        }
        for (let i = 0; i < elem.length; i++) {
            elemText[i] = elem[i].innerHTML;
            elem[i].innerHTML = "";
        }

        /**
         *  Animates the node with TEXT_EFFECT.
         *
         * @param {*} _node node(Element) to be animated
         * @param {*} _text text of the element.
         */
        function animate(_node, _text) {
            let node = _node;
            let text = _text;
            console.log(text.length);
            node.innerHTML = "|";
            let c;
            if (node.hasAttribute("cursor-speed") || node.hasAttribute("cursor-speed-fixed")) {
                c = 1000 / (node.hasAttribute("cursor-speed") ? node.getAttribute("cursor-speed") : node.getAttribute("cursor-speed"));
            } else {
                c = Math.random() * (200 - 150) + 110 - 10; /** Calculate Random Speed */
            }
            setTimeout(() => {
                //call the change//
                change(node, text, c, 0, false);
            }, c);
        }
        /**
         *  writes a letter from text + "|".
         *
         * @param {*} node node(element) to be animated.
         * @param {*} text text of element.
         * @param {*} c the time difference between animation.
         * @param {*} i the number of letters to write.
         */
        function change(node, text, c, i, rev) {
            if (!i) {
                i = 0;
            }
            let hasTags = false;
            nodeInnerHTML = ""; /** Empty the node. */
            if(!rev){
                for (let j = 0; j < i; j++) {
                    if(text[j] == "<"){
                        hasTags = true;
                        while(text[j] != ">"){
                            nodeInnerHTML += text[j];
                            j++;
                        }
                        nodeInnerHTML += text[j];
                    }else{
                        nodeInnerHTML += text[j]; /** Add letters */
                    }
                }
                nodeInnerHTML += "|"; /** Add cursor "|" at last. */
                if(text[i] == "<"){
                    while(text[i]!=">"){
                        i++;
                    }
                    i++;
                }
            }else{
                console.log(i);
                // Going  in reverse...
                
                if(text[i] == ">"){
                    console.log(">>",i - 1,text[i - 1]);
                    while(text[i]!="<"){
                        nodeInnerHTML += text[i];
                        i--;
                    }
                    nodeInnerHTML += text[i];
                    i--;
                    console.log(i);
                }

                for (let j = i; j >= 0; j--) {
                    if(text[j] == ">"){
                        console.log("J :",j);
                        hasTags = true;
                        while(text[j] != "<"){
                            nodeInnerHTML += text[j];
                            j--;
                        }
                        nodeInnerHTML += text[j];                       
                        console.log("J became: ",j,"and inner html is",nodeInnerHTML.split("").reverse().join(""));
                    }else{
                        nodeInnerHTML += text[j]; /** Add letters */
                    }
                }
                console.log(nodeInnerHTML.split("").reverse().join(""));
                
                console.log("nodeInnerHTML Became",nodeInnerHTML.split("").reverse().join(""));
                nodeInnerHTML = nodeInnerHTML.split("");
                nodeInnerHTML = nodeInnerHTML.reverse();
                nodeInnerHTML = nodeInnerHTML.join("");
                nodeInnerHTML += "|"; /** Add cursor "|" at last. */
                node.innerHTML = nodeInnerHTML;                
                console.log(node.innerHTML.length,nodeInnerHTML.length);
                if(i == 32){
                    console.log(nodeInnerHTML,node.innerHTML);
                }
            }
            
            if (node.hasAttribute("cursor-speed-fixed")) {
                c = 1000 / node.getAttribute("cursor-speed-fixed");
            } else if (node.hasAttribute("cursor-speed")) {
                c = 1000 / node.getAttribute("cursor-speed");
                c = Math.random() * ((c + 100) - (c - 100)) + (c - 100);
            } else {
                c = Math.random() * (200 - 150) + 110 - 10; /** Calculate Random Speed */
            }
            if (rev) {
                i--;
                if (i < 0) {
                    if(node.hasAttribute("cursor-replace-next")){
                        var texts = node.getAttribute("cursor-replace-next").split(",");
                        let j;
                        for( j = 0; j < texts.length ; j++){
                            if(texts[j] == text){
                                i = 0;
                                text = texts[j+1];
                                
                            rev = false;
                        setTimeout(() => {
                        change(node, text, c, i, rev);
                        }, c);
                        break;
                            }
                        }
                        if(j == texts.length){
                            text = texts[0];
                            i = 0;
                            rev = false;
                            setTimeout(() => {
                                change(node, text, c, i, rev);
                                }, c);
                                
                        }
                    }else{
                        i = 0;
                        rev = false;
                        setTimeout(() => {
                        change(node, text, c, i, rev);
                        }, c);
                        return;
                    }
                }
            } else {
                i++;
            }
            node.innerHTML = nodeInnerHTML;
            if (i > text.length) {
                console.log(i,text.length);
                /** Animation of text has been completed. if element contains "cursor-after" attribute,
                 * then animate the element specified in the value.  */
                if (node.hasAttribute("cursor-after")) {
                    try {
                        let next = document.querySelector(node.getAttribute("cursor-after"));
                        animate(next, elemText[elem.indexOf(next)]);
                        node.removeAttribute("cursor-after");
                    } catch (error) {
                        console.log(error);
                    }
                }
                /** If element has cursor-loop attribute then animate the element again..... */
                if(node.hasAttribute("cursor-replace-next")){
                    i = text.length - 1;
                    setTimeout(() => {
                        change(node, text, c, i, true);
                    }, c);
                }else if (node.hasAttribute("cursor-loop")) {
                    i = 0;
                    setTimeout(() => {
                        change(node, text, c, i, rev);
                    }, 1000);
                } else if (node.hasAttribute("cursor-loop-reverse")) {
                    i = text.length - 1;
                    setTimeout(() => {
                        change(node, text, c, i, true);
                    }, c);
                } else {
                    setInterval(function () {

                        if (node.innerHTML == text) {
                            node.innerHTML += "|";
                        } else {
                            node.innerHTML = text;
                        }

                    }, 500);
                }
            } else {
                setTimeout(() => {
                    change(node, text, c, i, rev);
                }, c);
            }
        }

        /* Start animation for each element.. expect element with attribute "cursor-before" */
        function start(i) {
            if (!i)
                i = 0

            if (!elem[i].hasAttribute("cursor-before")) {
                animate(elem[i], elemText[i]);
            }
            i++;
            if (i < elem.length) {
                setTimeout(() => start(i), 100);
            }
        }
        start();
    }
); 
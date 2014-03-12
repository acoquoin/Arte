/*!
 * Arte (Another Rich Text Editor)
 * base on work by Michael Leigeber (http://www.scriptiny.com/2010/02/javascript-wysiwyg-editor/)
 *
 * @license The MIT License
 * Copyright (c) 2013-* Alban COQUOIN acoquoin@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function(w, d) {

    // Validator (JSHint - http://www.jshint.com/)
    /*jshint loopfunc:true */
    'use strict';

    // Stacking
    var Arte = function(settings) {
        if(null === d.getElementById(settings.id)) {
            throw new Error('Unavailable selector ID');

        } else if('TEXTAREA' !== d.getElementById(settings.id).tagName) {
            throw new Error('Selector should be an textarea tag');
        
        }

        this.init(settings);
    };

    // Default Settings
    Arte.settings = {

        // Element ID to make editable (must be an textarea)
        id: null,

        // Active buttons
        // Empty array display all buttons
        // ['bold', 'insertimage', ...] : Display selected buttons
        display: [],

        // Default content
        content: null,

        // Buttons configuration set
        controls: {
            bold: 'Insert bold text',
            italic: 'Insert italic text',
            underline: 'Insert underline text',
            strikethrough: 'Insert strikethrough text',
            insertorderedlist: 'Insert ordered list',
            insertunorderedlist: 'Insert unordered list',
            outdent: 'Outdent',
            indent: 'Indent',
            justifyleft: 'Left align',
            justifycenter: 'Center align',
            justifyright: 'Right align',
            justifyfull: 'Justify text',
            insertimage: {
                label: 'Insert image',
                prompt: ['Enter image URL:', 'http://'],
                pattern: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            },
            createlink: {
                label: 'Insert hyperlink',
                prompt: ['Enter URL:', 'http://'],
                pattern: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            },
            inserthorizontalrule: 'Insert horizontal rule',
            blockquote: 'Insert Code'
        }
    };

    /**
     * Arte.prototype
     * Arte main code
     * @core
     */
    Arte.prototype = {

        /**
         * 
         * 
         */
        init: function(settings) {

            var self = this;

            // Extend settings by default settings
            self.settings = self.extendObject(Arte.settings, settings);

            // Main container
            self.containerElt = d.createElement('div');
            self.containerElt.className = 'arte';

            // Control container
            self.controlsElt = d.createElement('div');
            self.controlsElt.className = 'arte-controls';

            // Editor container
            self.editElt = d.createElement('div');
            self.editElt.className = 'arte-edit';
            self.editElt.contentEditable = true; 
            self.editElt.designMode = 'On';

            // Get textarea element ID
            self.textareaElt = d.getElementById(settings.id);

            // Hide textarea
            self.textareaElt.style.display = 'none';

            // Display in document
            self.textareaElt.parentNode.insertBefore(self.containerElt, self.textareaElt);

            // Assign content
            self.editElt.innerHTML = settings.content || self.textareaElt.value;
            
            // onChange event
            self.editElt.addEventListener('input', function() {
                self.textareaElt.value = this.innerHTML;
            }, false);

            // Assign controls and editable content on container element
            self.containerElt.appendChild(self.textareaElt);
            self.containerElt.appendChild(self.controlsElt);
            self.containerElt.appendChild(self.editElt);

            // XHTML compatibility
            var isMSIE = /*@cc_on!@*/false;
            if(false === isMSIE) {
                d.execCommand('styleWithCSS', false, 0);
            }

            // Loading controls
            for(var i in this.settings.controls) {

                if (this.settings.controls.hasOwnProperty(i)) {
                    if(0 < this.settings.display.length && -1 === this.settings.display.indexOf(i)) {
                        continue;
                    }

                    var buttonElt = document.createElement('i');
                    buttonElt.className = 'arte-control sprite-images-ac-' + i;
                    buttonElt.title = this.settings.controls[i].label || this.settings.controls[i];
                    buttonElt.command = i;
                   buttonElt.onmousedown = function() {
                        self.execute(this);
                    };

                    this.controlsElt.appendChild(buttonElt);
                }
            }
        },

        execute: function(elt) {
            var value,
                command = elt.command,
                datas = this.settings.controls[elt.command];

            if('object' === typeof datas.prompt) {
                value = w.prompt(datas.prompt[0], datas.prompt[1]);
                if(null === value || 0 === value.length || datas.prompt[1] === value || ('object' === typeof datas.pattern && null === value.match(datas.pattern))) {
                    return;
                }
            }
            if(true === d.queryCommandSupported(command)) {
                d.execCommand(command, false, value);
            } else {
                d.execCommand('formatBlock', 0, command);
            }
        },

        extendObject: function(from, to) {
            for (var i in to) {
                if (to.hasOwnProperty(i)) {
                    try {
                        // Property in destination object set; update its value.
                        from[i] = 'object' === typeof to[i].constructor ? this.extendObject(from[i], to[i]) : to[i];
                    } catch(e) {
                        // Property in destination object not set; create it and set its value.
                        from[i] = to[i];
                    }
                }
            }
            return from;
        }
    };


    // Assign Arte
    window.Arte = Arte;

})(window, document);

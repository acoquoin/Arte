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

(function() {

    // Validator (JSHint - http://www.jshint.com/)
    /*jshint browser:true, jquery:true */
    'use strict';

    // Stacking
    var Arte = function(settings) {
        this.init(settings);
    };

    // Default Settings
    Arte.settings = {

        // Element ID to make editable (must be an textarea)
        id: null,

        // Active buttons
        // null : Display all buttons
        // ['bold, 'insertimage', ...] : Display selected buttons
        display: null,

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
                prompt: ['Enter image URL:', 'http://']
            },
            createlink: {
                label: 'Insert hyperlink',
                prompt: ['Enter URL:', 'http://']
            },
            inserthorizontalrule: 'Insert horizontal rule',
            blockquote: 'Code'
        }
    };

    /**
     * Arte.prototype
     * Arte main code
     * @core
     */
    Arte.prototype = {

        // Elements instance
        textareaElt: null,
        containerElt: null,
        controlsElt: null,
        editElt: null,

        /**
         * 
         * 
         */
        init: function(settings) {

            // Extend settings by default settings
            settings = this.extendObject(Arte.settings, settings);

            console.log(settings);

            // Main container
            this.containerElt = document.createElement('div');
            this.containerElt.className = 'arte';

            // Control container
            this.controlsElt = document.createElement('div');
            this.controlsElt.className = 'arte-controls';

            // Editor container
            this.editElt = document.createElement('div');
            this.editElt.className = 'arte-edit';
            this.editElt.contentEditable = true; 
            this.editElt.designMode = 'On';

            // Get textarea element ID
            this.textareaElt = document.getElementById(settings.id);

            // Hide textarea
            this.textareaElt.style.display = 'none';

            // Display in document
            this.textareaElt.parentNode.insertBefore(this.containerElt, this.textareaElt);

            // Assign content
            this.editElt.innerHTML = settings.content || this.textareaElt.value;

            // Assign controls and editable content on container element
            this.containerElt.appendChild(this.textareaElt);
            this.containerElt.appendChild(this.controlsElt);
            this.containerElt.appendChild(this.editElt);

            // XHTML compatibility
            document.execCommand('styleWithCSS', false, 0);

            console.log(settings.controls);
            // Loading controls
            for(var i in settings.controls) {
                console.log(i);
                var buttonElt = document.createElement('i');
                buttonElt.className = 'arte-control ac-' + i;
                buttonElt.title = settings.controls[i].label || settings.controls[i];
                this.controlsElt.appendChild(buttonElt);
            }
        },

        /**
         * 
         * 
         */
        extendObject: function(from, to) {
            for (var i in to) {
                try {
                    // Property in destination object set; update its value.
                    from[i] = 'object' === typeof to[i].constructor ? this.extendObject(from[i], to[i]) : to[i];
                } catch(e) {
                    // Property in destination object not set; create it and set its value.
                    from[i] = to[i];
                }
            }
            return from;
        }
    };


    // Assign Albox
    window.Arte = Arte;

})();

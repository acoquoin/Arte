var ARTE = ARTE || {},
T$ = T$ || function(i) {return document.getElementById(i)},
T$$$ = T$$$ || function() {return document.all?1 : 0};

ARTE.editor = function() {
  var c = [], offset = -30;
	c['bold'] = [4, 'Bold', 'a', 'strong'];
	c['italic'] = [5, 'Italic', 'a', 'italic'];
	c['underline'] = [6, 'Underline', 'a', 'underline'];
	c['strikethrough'] = [7, 'Strikethrough', 'a', 'strikethrough'];
	c['orderedlist'] = [10, 'Insert Ordered List', 'a', 'insertorderedlist'];
	c['unorderedlist'] = [11, 'Insert Unordered List', 'a', 'insertunorderedlist'];
	c['outdent'] = [12, 'Outdent', 'a', 'outdent'];
	c['indent'] = [13, 'Indent', 'a', 'indent'];
	c['leftalign'] = [14, 'Left Align', 'a', 'justifyleft'];
	c['centeralign'] = [15, 'Center Align', 'a', 'justifycenter'];
	c['rightalign'] = [16, 'Right Align', 'a', 'justifyright'];
	c['blockjustify'] = [17, 'Block Justify', 'a', 'justifyfull'];
	c['image'] = [20, 'Insert Image', 'i', 'insertimage', 'Enter Image URL:', 'http://'];
	c['hr'] = [21, 'Insert Horizontal Rule', 'a', 'inserthorizontalrule'];
	c['link'] = [22, 'Insert Hyperlink', 'i', 'createlink', 'Enter URL:', 'http://'];
	c['unlink'] = [23, 'Remove Hyperlink', 'a', 'unlink'];
	function edit(n, obj) {
		this.n = n; window[n] = this; this.t = T$(obj.id); this.obj = obj;
		var p = document.createElement('div'), w = document.createElement('div'), h = document.createElement('div'),
		l = obj.controls.length, i = 0;
		this.i = document.createElement('div');
		this.i.className = 'tinyeditor-edit';
        this.i.contentEditable = true; 
        this.i.designMode = 'On'; 
		this.i.style.width = '100%';
        this.i.style.height = '175px';
        this.ie = T$$$();
		h.className = 'tinyeditor-header';
        p.className = 'tinyeditor';
        p.style.width = this.i.style.width + 'px';
        p.appendChild(h);
		for(i; i < l; i++) {
			var id = obj.controls[i];
			if(id == 'n') {
				h = document.createElement('div'); h.className = 'tinyeditor-header'; p.appendChild(h);
			} else if(id == '|') {
				var d = document.createElement('div'); d.className = 'tinyeditor-divider'; h.appendChild(d);
			} else if(c[id]) {
				var div = document.createElement('div'), x = c[id], func = x[2], ex, pos = x[0] * offset;
				div.className = 'tinyeditor-control';
				div.unselectable = 'on';
				div.style.backgroundPosition = '0px ' + pos + 'px';
				div.title = x[1];
				ex = func == 'a'?'.action("' + x[3] + '", 0, ' + (x[4] || 0) + ')' : '.insert("' + x[4] + '", "' + x[5] + '", "' + x[3] + '")';
				div.onmousedown = new Function(this.n + ex);
				div.onmouseover = new Function(this.n + '.hover(this, ' + pos + ', 1)');
				div.onmouseout = new Function(this.n + '.hover(this, ' + pos + ', 0)');
				h.appendChild(div);
				if(this.ie) {div.unselectable = 'on'}
			}
		}
		this.t.parentNode.insertBefore(p, this.t); this.t.style.width = this.i.style.width + 'px';
		w.appendChild(this.t); w.appendChild(this.i); p.appendChild(w); this.t.style.display = 'none';
		if(obj.footer) {
			var f = document.createElement('div'); f.className = 'tinyeditor-footer';
			if(obj.resize) {
				var ro = obj.resize, rs = document.createElement('div'); rs.className = 'resize';
				rs.onmousedown = new Function('event', this.n + '.resize(event);return false');
				rs.onselectstart = function() {return false};
				f.appendChild(rs);
			}
			p.appendChild(f);
		}
		this.i.innerHTML = (obj.content || this.t.value);
		this.d = 1;
	};
	edit.prototype.hover = function(div, pos, dir) {
		this.getSelection();
		div.style.backgroundPosition = (dir ? '34px ' : '0px ') + (pos) + 'px';
	};
	edit.prototype.getSelection = function() {
		if(this.ie && this.i.getSelection) {
			this.sel = this.i.getSelection();
			if(this.sel.getRangeAt && this.sel.rangeCount) {
				this.range = this.sel.getRangeAt(0);
			}
		}
	};
	edit.prototype.restoreSelection = function() {
		if (this.range && this.ie) {
			if (this.i.getSelection) {
				this.sel = this.i.getSelection();
				this.sel.removeAllRanges();
				this.sel.addRange(this.range);
			}
		}
	};
	edit.prototype.ddaction = function(dd, a) {
		var i = dd.selectedIndex, v = dd.options[i].value;
		this.action(a, v);
	};
	edit.prototype.action = function(cmd, val, ie) {
		if(ie && !this.ie) {
			alert('Your browser does not support this function.')
		} else{
			this.restoreSelection();
			document.execCommand(cmd, 0, val || null);
            console.log(cmd, val);
            //document.execCommand('formatblock', true, '<'+cmd+'>');
		}
	};
	edit.prototype.insert = function(pro, msg, cmd) {
		var val = prompt(pro, msg);
		if(val!= null && val!= '') {document.execCommand(cmd, 0, val)}
	};
	edit.prototype.resize = function(e) {
		if(this.mv) {this.freeze()}
		this.i.bcs = ARTE.cursor.top(e);
		this.mv = new Function('event', this.n + '.move(event)');
		this.sr = new Function(this.n + '.freeze()');
		if(this.ie) {
			document.attachEvent('onmousemove', this.mv); document.attachEvent('onmouseup', this.sr);
		} else{
			document.addEventListener('mousemove', this.mv, 1); document.addEventListener('mouseup', this.sr, 1);
		}
	};
	edit.prototype.move = function(e) {
		var pos = ARTE.cursor.top(e);
		this.i.style.height = parseInt(this.i.style.height) + pos-this.i.bcs;
		this.i.bcs = pos;
	};
	edit.prototype.freeze = function() {
		if(this.ie) {
			document.detachEvent('onmousemove', this.mv); document.detachEvent('onmouseup', this.sr);
		} else{
			document.removeEventListener('mousemove', this.mv, 1); document.removeEventListener('mouseup', this.sr, 1);
		}
	};
	edit.prototype.post = function() {
		if(this.d) {
			console.log('toggle');
		}
	};
	return { edit : edit }
}();

ARTE.cursor = function() {
	return {
		top : function(e) {
			return T$$$()?window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop : e.clientY + window.scrollY;
		}
	}
}();

/*
var nicUploadButton = nicEditorAdvancedButton.extend({	
	nicURI : 'http://api.imgur.com/2/upload.json',
  errorText : 'Failed to upload image',

	addPane : function() {
    if(typeof window.FormData === "undefined") {
      return this.onError("Image uploads are not supported in this browser, use Chrome, Firefox, or Safari instead.");
    }
    this.im = this.ne.selectedInstance.selElm().parentTag('IMG');

    var container = new bkElement('div')
      .setStyle({ padding: '10px' })
      .appendTo(this.pane.pane);

		new bkElement('div')
      .setStyle({ fontSize: '14px', fontWeight : 'bold', paddingBottom: '5px' })
      .setContent('Insert an Image')
      .appendTo(container);

    this.fileInput = new bkElement('input')
      .setAttributes({ 'type' : 'file' })
      .appendTo(container);

    this.progress = new bkElement('progress')
      .setStyle({ width : '100%', display: 'none' })
      .setAttributes('max', 100)
      .appendTo(container);

    this.fileInput.onchange = this.uploadFile.closure(this);
	},

  onError : function(msg) {
    this.removePane();
    alert(msg || "Failed to upload image");
  },

  uploadFile : function() {
    var file = this.fileInput.files[0];*/
//    if (!file || !file.type.match(/image.*/)) {
/*      this.onError("Only image files can be uploaded");
      return;
    }
    this.fileInput.setStyle({ display: 'none' });
    this.setProgress(0);

    var fd = new FormData(); // https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    fd.append("image", file);
    fd.append("key", "b7ea18a4ecbda8e92203fa4968d10660");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.ne.options.uploadURI || this.nicURI);

    xhr.onload = function() {
      try {
        var res = JSON.parse(xhr.responseText);
      } catch(e) {
        return this.onError();
      }
      this.onUploaded(res.upload);
    }.closure(this);
    xhr.onerror = this.onError.closure(this);
    xhr.upload.onprogress = function(e) {
      this.setProgress(e.loaded / e.total);
    }.closure(this);
    xhr.send(fd);
  },

  setProgress : function(percent) {
    this.progress.setStyle({ display: 'block' });
    if(percent < .98) {
      this.progress.value = percent;
    } else {
      this.progress.removeAttribute('value');
    }
  },

  onUploaded : function(options) {
    this.removePane();
    var src = options.links.original;
    if(!this.im) {
      this.ne.selectedInstance.restoreRng();
      var tmp = 'javascript:nicImTemp();';
      this.ne.nicCommand("insertImage", src);
      this.im = this.findElm('IMG','src', src);
    }
    var w = parseInt(this.ne.selectedInstance.elm.getStyle('width'));
    if(this.im) {
      this.im.setAttributes({
        src : src,
        width : (w && options.image.width) ? Math.min(w, options.image.width) : ''
      });
    }
  }
});

nicEditors.registerPlugin(nicPlugin,nicUploadOptions);
*/

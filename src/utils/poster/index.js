let QSCanvas = (function () {
  const platform = getPlatform(),
    isUni = platform == "uni",
    isNode = platform == "node",
    isWeb = platform == "web",
    imgCache = {},
    vmCache = {},
    asyncDrawWhiteList = Object.freeze([
      "init",
      "initAsyncDrawMode",
      "initArgs",
      "initCanvas",
      "handleCtx",
      "initData",
      "draw",
      "toImage",
      "updateCanvasWH",
      "clear",
      "restoreAsyncDrawMode",
    ]),
    calcMethods = Object.freeze([
      "setPaintbrush",
      "setPaintbrushProp",
      "resetPaintbrush",
      "savePaintbrush",
      "restorePaintbrush",
      "calcText",
      "calcImg",
      "measureText",
      "loadImage",
    ]),
    asyncDrawMethods = Object.freeze([
      "setPaintbrush",
      "setPaintbrushProp",
      "resetPaintbrush",
      "savePaintbrush",
      "restorePaintbrush",
      "drawText",
      "drawStraightLine",
      "drawDoubleStraightLine",
      "drawDotted",
      "drawDottedStraightLine",
      "drawLine",
      "drawTextDecoration",
      "drawImg",
      "drawQrCode",
      "setCircle",
      "setRect",
    ]),
    allSelfMethods = Object.freeze([
      "setPaintbrush",
      "setPaintbrushProp",
      "resetPaintbrush",
      "savePaintbrush",
      "restorePaintbrush",
      "drawText",
      "drawStraightLine",
      "drawDoubleStraightLine",
      "drawDotted",
      "drawDottedStraightLine",
      "drawLine",
      "drawTextDecoration",
      "drawImg",
      "drawQrCode",
      "setCircle",
      "setRect",
      "calcText",
      "calcImg",
      "measureText",
      "loadImage",
      "drawArray",
      "drawItem",
    ]),
    needReturnMethods = Object.freeze(["drawText", "drawImg"]),
    commonMethods = Object.freeze([
      "drawImage",
      "putImageData",
      "getImageData",
      "createImageData",
      "addPage",
      "save",
      "restore",
      "rotate",
      "translate",
      "transform",
      "getTransform",
      "resetTransform",
      "setTransform",
      "isPointInPath",
      "scale",
      "clip",
      "fill",
      "stroke",
      "fillText",
      "strokeText",
      "fillRect",
      "strokeRect",
      "clearRect",
      "rect",
      "measureText",
      "moveTo",
      "lineTo",
      "bezierCurveTo",
      "quadraticCurveTo",
      "beginPath",
      "closePath",
      "arc",
      "arcTo",
      "ellipse",
      "setLineDash",
      "getLineDash",
      "createPattern",
      "createLinearGradient",
      "createRadialGradient",
    ]);

  let nodeCanvas,
    id = 1;
  // #ifndef APP-PLUS
  // #ifndef H5
  // #ifndef MP
  // #ifndef QUICKAPP-WEBVIEW
  // #ifndef QUICKAPP-WEBVIEW-UNION
  // #ifndef QUICKAPP-WEBVIEW-HUAWEI
  if (isNode) {
    try {
      nodeCanvas = require("canvas");
    } catch (e) {
      if (isNode) throw new Error("node环境依赖node-canvas!");
    }
  }
  // #endif
  // #endif
  // #endif
  // #endif
  // #endif
  // #endif

  /**
   * 判断是否是undefined, uni中的undefined不是字符串
   */
  function notUnd(t) {
    return String(t) != "undefined";
  }
  function isNull(a) {
    return !((a || a == 0) && !["undefined", "null"].includes(String(a)));
  }

  /**
   * 判断环境
   */
  function getPlatform() {
    if (notUnd(typeof uni)) return "uni";
    if (notUnd(typeof window) && notUnd(typeof document)) return "web";
    return "node";
  }

  /**
   * 获取实例
   */
  function getCtx(vm, args) {
    if (isUni) {
      if (!args.canvasId) {
        throw new Error("canvasId 不能为空");
      }
    }
    let canvas,
      obj = {};
    switch (platform) {
      case "uni":
        canvas = uni.createCanvasContext(args.canvasId, vm);
        obj.canvas = canvas;
        obj.ctx = canvas;
        break;
      case "web":
        canvas = args?.canvasId
          ? document.getElementById(args?.canvasId)
          : document.createElement("canvas");
        canvas.width = args?.width || 10;
        canvas.height = args?.height || 10;
        obj.canvas = canvas;
        obj.ctx = canvas.getContext("2d");
        break;
      case "node":
        canvas = nodeCanvas.createCanvas(args?.width || 10, args?.height || 10);
        obj.canvas = canvas;
        obj.ctx = canvas.getContext("2d");
        break;
    }

    return obj;
  }

  class QSCanvas {
    #nc;
    constructor(obj, vm) {
      this._id = id++;
      vmCache[this._id] = vm;
      if (obj) {
        this.init(obj);
      }
    }

    init(obj = {}) {
      this.initArgs(obj).initData().initCanvas().handleCtx().resetPaintbrush();
      if (this._data.asyncDrawMode === true) {
        this.#nc = new QSCanvas({ asyncDrawMode: false });
        this.initAsyncDrawMode();
      }
    }

    initAsyncDrawMode() {
      if (isUni) return;
      const ctxMethods = this._data.ctxMethods;
      const arr = [...new Set([...allSelfMethods, ...ctxMethods])];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        this.handleAsyncDrawModeItem(item);
      }
    }

    handleAsyncDrawModeItem(i) {
      if (isUni) return;
      if (asyncDrawWhiteList.includes(i)) {
        console.log("白名单跳过");
        return;
      }
      if (typeof this[i] == "function") {
        if (!this._data.nMethods[i]) this._data.nMethods[i] = this[i];
        let _this = this;
        this[i] = function () {
          let r;
          if (calcMethods.includes(i)) {
            r = _this.#nc[i](...arguments);
          }
          if (r && r !== _this && r !== _this.#nc) return r;
          if (
            asyncDrawMethods.includes(i) ||
            _this._data.ctxMethods.includes(i)
          ) {
            _this._data.asyncDrawQueue.push({ method: i, args: arguments });
          }
          if (needReturnMethods.includes(i)) {
            return _this.#nc[i](...arguments);
          }
        };
      }
    }

    restoreAsyncDrawMode() {
      if (isUni) return;
      const nMethods = this._data.nMethods;
      for (const i in nMethods) {
        this[i] = nMethods[i];
      }
    }

    initArgs(obj = {}) {
      this._args = obj;
      return this;
    }

    initCanvas() {
      const canvasObj = getCtx(vmCache[this._id], this._args);
      this.canvas = canvasObj.canvas;
      this.ctx = canvasObj.ctx;
      return this;
    }

    /**
     * 使QSCanvas拥有原有方法
     */
    handleCtx() {
      const ctx = this.ctx;
      const active = (i) => {
        this._data.ctxMethods.push(i);
        this[i] = ctx[i].bind(ctx);
        return;
        function a() {
          return ctx[i](...arguments);
        }
      };
      for (const i in ctx) {
        if (typeof ctx[i] == "function") {
          if (!this[i]) {
            active(i);
          }
        }
      }

      for (let k = 0; k < commonMethods.length; k++) {
        const i = commonMethods[k];
        if (typeof ctx[i] == "function") {
          if (!this[i]) {
            active(i);
          }
        }
      }
      return this;
    }

    initData() {
      this._data = {
        oldPaintbrushProps: {},
        savedPaintbrushProps: [],
        font: {
          fontStyle: "normal",
          fontVariant: "normal",
          fontWeight: "normal",
          fontSize: 10,
          fontFamily: "sans-serif",
        },
        height: this._args.height || 10,
        width: this._args.width || 10,
        whChange: false,
        asyncDrawQueue: [],
        nMethods: {},
        asyncDrawMode:
          isNode || isWeb ? this._args.asyncDrawMode !== false : false,
        ctxMethods: [],
      };
      return this;
    }

    /**
     * 设置画笔
     */
    setPaintbrush(obj = {}) {
      filterPaintbrushProps(obj);
      for (const k in obj) {
        this.setPaintbrushProp(k, obj[k]);
      }
      return this;
    }

    /**
     * 设置画笔操作兼容uni
     */
    setPaintbrushProp(prop, data) {
      if (isNull(prop) || isNull(data)) return;
      prop = hyphen2Hump(prop);
      const ctx = this.ctx;
      if (prop == "font") {
        if (data) {
          if (typeof data != "object") {
            console.warn("font属性需Object格式");
            return;
          }
          for (const k in data) if (isNull(data[k])) delete data[k];
          const font = { ...this._data.font, ...data };
          if (isUni) font.fontSize = Math.round(font.fontSize);
          this._data.font = font;
          const f = this._data.font;
          this._data.oldPaintbrushProps[prop] = f;
          const setFont = () => {
            let fontStyle = f.fontStyle || 'normal';
            let fontVariant = f.fontVariant || 'normal';
            let fontWeight = f.fontWeight || 'normal';
            let fontSize = (f.fontSize || 10) + 'px';
            let fontFamily = f.fontFamily || 'sans-serif';
            ctx.font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily
          };
          if (isUni) {
            // #ifdef MP-TOUTIAO
            ctx.setFontSize(f.fontSize);
            // #endif
            // #ifndef MP-TOUTIAO
            setFont();
            // #endif
          } else setFont();
        }
      } else {
        this._data.oldPaintbrushProps[prop] = data;
        const fnn = "set" + prop[0].toUpperCase() + prop.slice(1);
        if (typeof ctx?.[fnn] == "function") {
          ctx[fnn](data);
        } else {
          ctx[prop] = data;
        }
      }
      return this;
    }

    /**
     * 重置画笔
     */
    resetPaintbrush(obj = {}) {
      this.setPaintbrush({
        fillStyle: "#000000",
        strokeStyle: "#000000",
        shadowColor: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        lineCap: "butt",
        lineJoin: "miter",
        lineWidth: 1,
        miterLimit: 10,
        font: this._data.font,
        textAlign: "start",
        textBaseline: "top",
        globalAlpha: 1.0,
        globalCompositeOperation: "source-over",
        ...obj,
      });
      return this;
    }

    saveAndSetPaintbrush(paintbrushProps = {}) {
      this.savePaintbrush();
      this.setPaintbrush(paintbrushProps);
      return this;
    }

    /**
     * 保存画笔设置
     */
    savePaintbrush() {
      this._data.savedPaintbrushProps.unshift({
        ...this._data.oldPaintbrushProps,
      });
      return this;
    }

    /**
     * 恢复上次保存的画笔设置
     */
    restorePaintbrush() {
      const savedProps = this._data.savedPaintbrushProps.shift();
      if (savedProps)
        this._data.oldPaintbrushProps = {
          ...this._data.oldPaintbrushProps,
          ...savedProps,
        };
      this.resetPaintbrush({ ...this._data.oldPaintbrushProps });
      return this;
    }

    /**
     * 更新画布宽高
     */
    updateCanvasWH(obj = {}) {
      let { width, height, delay } = obj,
        setCanvasWH = this._args?.setCanvasWH;
      width = width || this._data?.width || 10;
      height = height || this._data?.height || 10;
      return new Promise((rs, rj) => {
        if (isUni) {
          if (!setCanvasWH || typeof setCanvasWH != "function") {
            rj("setCanvasWH异常, uni-app 请在初始化时传入setCanvasWH函数");
            return;
          }
          setCanvasWH({ height, width });
          setTimeout(() => {
            rs();
          }, delay ?? 50);
        } else {
          this.canvas.height = height;
          this.canvas.width = width;
          rs();
        }
      }).then((r) => {
        if (this._data.width != width || this._data.height != height) {
          this._data.whChange = true;
        }
        this._data.width = width;
        this._data.height = height;
        if (!this._data.asyncDrawMode)
          this.resetPaintbrush(this._data.oldPaintbrushProps);
      });
    }

    /**
     * 清除画布内容
     */
    clear() {
      this.ctx.clearRect(
        0,
        0,
        this._data.width || 999999,
        this._data.height || 999999
      );
      return this;
    }

    /**
     * 兼容uni draw
     */
    draw(obj = {}) {
      const { reserve } = obj;
      return new Promise((rs, rj) => {
        if (isUni) {
          let done = false;
          const settimeoutkey = setTimeout(() => {
            if (!done) {
              rs();
            } else {
              clearTimeout(settimeoutkey);
            }
          }, 3000);
          this.ctx.draw(reserve ?? false, () => {
            done = true;
            clearTimeout(settimeoutkey);
            rs();
          });
        } else {
          if (this._data.asyncDrawMode) {
            if (reserve !== true) this.clear();
            this.restoreAsyncDrawMode();
            this.resetPaintbrush();
            const arr = this._data.asyncDrawQueue;
            new Promise(async (resolve, reject) => {
              for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                try {
                  const r = this[item.method].call(this, ...item.args);
                  if (typeof r?.then == "function") await r;
                } catch (error) {
                  reject(error);
                  return;
                }
              }
              resolve();
            })
              .then(() => {
                this._data.asyncDrawQueue = [];
                this.initAsyncDrawMode();
                rs();
              })
              .catch((err) => {
                this.initAsyncDrawMode();
                rj(err);
              });
          } else {
            rs();
          }
        }
      });
    }

    /**
     * canvas2image
     */
    toImage(obj = {}) {
      return new Promise((rs, rj) => {
        if (isUni) {
          const canvasId = this._args.canvasId;
          if (!canvasId) {
            rj("canvasId不存在");
            return;
          }
          uni.canvasToTempFilePath(
            {
              ...obj,
              canvasId: canvasId,
              success: (r) => {
                obj.success?.(r);
                rs(r.tempFilePath);
              },
              fail: (err) => {
                obj.fail?.(err);
                rj(err);
              },
            },
            vmCache[this._id]
          );
        } else {
          rs(
            this.canvas.toDataURL(
              `image/${
                ["jpg", "jpeg"].includes(obj.fileType) ? "jpeg" : "png"
              }`,
              obj.quality ?? 1
            )
          );
        }
      });
    }

    /**
     * 计算文字多行
     */
    calcText(obj = {}) {
      const line = obj.line || -1;
      return new Promise((rs, rj) => {
        try {
          this.saveAndSetPaintbrush({
            ...(obj.paintbrushProps || {}),
          });
          const mt = this.measureText;
          let splitTexts = [],
            str = obj.val,
            width = 0;
          function run(text, endLine) {
            let endLineWidth = 0;
            const textWidth = mt(text).width;
            if (endLine) {
              if (textWidth < obj.maxWidth || text.length < 2) {
                return {
                  index: text.length,
                  ellipsis: false,
                  width: textWidth,
                };
              } else {
                endLineWidth = mt("...").width;
              }
            }
            const textWidthEndLineWidth = textWidth + endLineWidth;
            if (textWidthEndLineWidth < obj.maxWidth || text.length < 2) {
              return {
                index: text.length,
                ellipsis: false,
                width: textWidthEndLineWidth,
              };
            }
            let loop = true,
              mid = Math.floor((text.length + 1) / 2),
              oldMid = 1,
              mode = "",
              tw;
            while (loop) {
              if (mid <= 1) {
                loop = false;
                break;
              }
              if (mid > text.length) {
                mid = text.length;
                loop = false;
                break;
              }
              const t = text.substr(0, mid);
              tw = mt(t).width + endLineWidth;
              if (tw > obj.maxWidth) {
                text = t;
                if (mode == "xy" && Math.abs(oldMid - mid) < 1) {
                  loop = false;
                } else {
                  mode = "dy";
                  oldMid = mid;
                  mid = Math.floor((t.length + 1) / 2);
                }
              } else if (tw == obj.maxWidth) {
                loop = false;
              } else {
                if (mid <= 1 || Math.abs(oldMid - mid) < 1) {
                  loop = false;
                } else {
                  mode = "xy";
                  oldMid = mid;
                  mid += Math.floor((text.length - mid) / 2);
                }
              }
            }
            return { index: mid, ellipsis: endLine, width: tw };
          }
          const font = { ...this._data.font };
          if (obj.maxWidth) {
            let i = 0;
            while (str.length) {
              const endLine = line > 0 && splitTexts.length + 1 >= line,
                { index: len, ellipsis, width } = run(str, endLine);
              const txt = str.substr(0, len);
              splitTexts.push({
                ...obj,
                val: txt,
                y: i
                  ? obj.y + (font.fontSize + (obj.lineHeight || 0)) * i
                  : obj.y,
                width,
              });
              if (endLine) {
                if (ellipsis) splitTexts[splitTexts.length - 1].val += "...";
                str = "";
              } else str = str.slice(len);

              i++;
            }
            width =
              splitTexts.length == 1
                ? splitTexts[0].width
                : splitTexts.length > 1
                ? obj.maxWidth
                : 0;
          } else {
            splitTexts = [obj];
            width = mt(obj.val).width;
          }
          this.restorePaintbrush();
          rs({
            ...obj,
            calcTexts: splitTexts,
            _calc: true,
            left: obj.x,
            top: obj.y,
            right: obj.x + width,
            bottom: splitTexts[splitTexts.length - 1].y + font.fontSize,
            width: width,
            height: splitTexts[splitTexts.length - 1].y + font.fontSize - obj.y,
            fontSize: font.fontSize,
          });
        } catch (error) {
          rj(error);
        }
      });
    }

    /* 绘制 */

    /**
     * 绘制文本
     */
    drawText(obj = {}) {
      return new Promise(async (rs, rj) => {
        try {
          if (!obj.val) {
            console.warn("需绘制的文本为空");
            rs();
            return;
          }
          this.saveAndSetPaintbrush({
            ...(obj.paintbrushProps || {}),
          });
          const ft = (obj) => {
              this.fillText(obj.val, obj.x, obj.y);
            },
            ftItem = (item) => {
              ft(item);
              if (item.textDecoration) this.drawTextDecoration(item);
            };

          const calcR = obj._calc ? obj : await this.calcText(obj);
          for (let i = 0; i < calcR.calcTexts.length; i++) {
            ftItem(calcR.calcTexts[i]);
          }
          this.restorePaintbrush();
          rs(calcR);
        } catch (error) {
          rj(error);
        }
      });
    }

    drawStraightLine(obj = {}) {
      const { x1, y1, x2, y2, paintbrushProps } = obj,
        ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      this.saveAndSetPaintbrush(paintbrushProps || {});
      ctx.stroke();
      this.restorePaintbrush();
    }

    drawDoubleStraightLine(obj = {}) {
      let { gap } = obj;
      gap = gap ?? 1;
      this.drawStraightLine(obj);
      this.drawStraightLine({ ...obj, y1: obj.y1 + gap, y2: obj.y2 + gap });
    }

    drawDotted(obj = {}) {
      this.setCircle(obj);
      if (obj.clip) obj.clip = false;
      this.saveAndSetPaintbrush(obj.paintbrushProps || {});
      this.ctx.fill();
      this.restorePaintbrush();
    }

    drawDottedStraightLine(obj = {}) {
      let { x1, x2, y1, y2, gap, width, paintbrushProps } = obj;
      x2 = x2 - width;
      gap = gap || 1;
      const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      const points = getPoints(
        x1,
        y1,
        x2,
        y2,
        Math.floor((len - gap) / (width + gap)),
        9999999999
      );
      this.saveAndSetPaintbrush(paintbrushProps);
      this.drawDotted({ x: x1, y: y1, d: width });
      for (let i = 0; i < points.length; i++)
        this.drawDotted({ x: points[i][0], y: points[i][1], d: width });

      this.drawDotted({ x: x2, y: y2, d: width });
      this.restorePaintbrush();
    }

    drawLine(obj = {}) {
      const { style } = obj;
      switch (style) {
        case "double":
          obj.gap = (obj.width || 1) * 1.5;
          this.drawDoubleStraightLine(obj);
          break;
        case "solide":
          this.drawStraightLine(obj);
          break;
        case "dotted":
          obj.gap = (obj.gap || 1) * 1.5;
          obj.paintbrushProps = { fillStyle: obj.color };
          this.drawDottedStraightLine(obj);
          break;
      }
    }

    /**
		 * {
			...(drawText属性),
			textDecoration: {
				line, //类型 同css text-decoration-line
				color, //线颜色
				width, //线宽度
		 *  }
		 * }
		 */
    drawTextDecoration(obj = {}) {
      this.savePaintbrush();
      const oldProps = this._data.oldPaintbrushProps,
        tw = this.measureText(obj.val).width,
        tD = obj.textDecoration,
        line = tD.line || "line-through",
        color = tD.color || obj.color || oldProps.fillStyle || "#000000",
        width =
          tD.thickness ||
          tD.width ||
          (obj.fontSize ? obj.fontSize * 0.1 : false) ||
          1,
        style = tD.style || "solide",
        offset = tD.offset || 0,
        gap = tD.gap ?? 1,
        fontSize = obj.fontSize || this._data.font.fontSize;
      this.setPaintbrush({ lineWidth: width, strokeStyle: color });
      let y = 0;
      switch (line) {
        case "line-through":
          y = obj.y + fontSize / 2 - width / 2;
          break;
        case "underline":
          y = obj.y + fontSize;
          break;
        case "overline":
          y = obj.y;
          break;
      }
      switch (oldProps.textBaseline) {
        case "top":
          y += width / 2;
          break;
        case "bottom":
          y -= fontSize;
          break;
        case "center":
          y -= fontSize / 2;
          break;
      }
      y += offset;
      switch (line) {
        case "line-through":
        case "underline":
        case "overline":
          this.drawLine({
            x1: obj.x,
            y1: y,
            x2: obj.x + tw,
            y2: y,
            style,
            gap,
            width,
            color,
          });
          break;
      }
      this.restorePaintbrush();
    }

    /**
     * 绘制图片
     */
    drawImg(obj = {}) {
      return new Promise(async (rs, rj) => {
        try {
          if (!obj.val) {
            console.warn("需绘制的图片为空");
            rs();
            return;
          }
          const calcR = obj._calc ? obj : await this.calcImg(obj);
          if (calcR?.drawImageArgs && Array.isArray(calcR.drawImageArgs))
            this.ctx.drawImage(...(calcR?.drawImageArgs || []));
          rs(calcR);
        } catch (error) {
          rj(error);
        }
      });
    }

    calcImg(obj = {}) {
      return new Promise(async (rs, rj) => {
        try {
          if (!obj.val) {
            console.warn("需绘制的图片为空");
            rs();
            return;
          }
          const img = await this.loadImage(obj.val),
            mode = obj.mode || "scaleToFill";
          let arr,
            x = obj.x || 0,
            y = obj.y || 0,
            w = obj.width || 0,
            h = obj.height || 0,
            sw = img.width,
            sh = img.height,
            sx = 0,
            sy = 0;
          const get_6 = () => {
            if (isUni) {
              // #ifdef MP-BAIDU
              return [x, y, w, h, sx, sy, sw, sh];
              // #endif
            }
            return [sx, sy, sw, sh, x, y, w, h];
          };
          switch (mode) {
            case "aspectFit":
              h = (img.height / img.width) * w;
              if (h < obj.height) {
                y = Number(obj.y) + obj.height / 2 - h / 2;
              } else {
                h = obj.height;
                w = (img.width / img.height) * h;
                x = Number(obj.x) + obj.width / 2 - w / 2;
              }
              arr = get_6();
              break;
            case "aspectFill":
              h = (img.height / img.width) * w;
              if (h < obj.height) {
                h = obj.height;
                sx = (img.width / img.height) * obj.height;
                sx = (((sx - obj.width) / sx) * img.width) / 2;
                sw = img.width - sx * 2;
              } else {
                sy = (((h - obj.height) / h) * img.height) / 2;
                sh = img.height - sy * 2;
              }
              w = obj.width;
              h = obj.height;
              arr = get_6();
              break;
            case "widthFix":
              h = obj.height = (img.height / img.width) * obj.width;
              arr = [x, y, w, h];
              break;
            case "heightFix":
              w = obj.width = (img.width / img.height) * obj.height;
              arr = [x, y, w, h];
              break;
            default:
              arr = [x, y, w, h];
          }
          arr.unshift(isUni ? img.toString() : img);
          rs({
            ...obj,
            drawImageArgs: [...arr],
            img,
            left: obj.x,
            top: obj.y,
            right: obj.x + obj.width,
            bottom: obj.y + obj.height,
            _calc: true,
          });
        } catch (error) {
          rj(error);
        }
      });
    }

    /**
     * 绘制二维码
     * 诗小柒 的二维码生成器代码
     */
    drawQrCode(obj = {}) {
      return new Promise((rs, rj) => {
        if (!obj?.val) {
          console.warn("绘制二维码val为空");
          rs();
          return;
        }
        this.savePaintbrush();
        let qrcodeAlgObjCache = [];
        let options = {
          text: String(obj.val || "") || "", // 生成内容
          size: Number(obj.size || 0) || 200, // 二维码大小
          background: String(obj.background || "") || "#ffffff", // 背景色
          foreground: String(obj.foreground || "") || "#000000", // 前景色
          pdground: String(obj.pdground || "") || "#000000", // 定位角点颜色
          correctLevel: Number(obj.correctLevel || 0) || 3, // 容错级别
          dx: Number(obj.x || 0) || 0, // x轴距离
          dy: Number(obj.y || 0) || 0, // y轴距离
        };
        let qrCodeAlg = null;
        let d = 0;
        for (var i = 0, l = qrcodeAlgObjCache.length; i < l; i++) {
          d = i;
          if (
            qrcodeAlgObjCache[i].text == options.text &&
            qrcodeAlgObjCache[i].text.correctLevel == options.correctLevel
          ) {
            qrCodeAlg = qrcodeAlgObjCache[i].obj;
            break;
          }
        }
        if (d == l) {
          qrCodeAlg = new QRCodeAlg(options.text, options.correctLevel);
          qrcodeAlgObjCache.push({
            text: options.text,
            correctLevel: options.correctLevel,
            obj: qrCodeAlg,
          });
        }
        let getForeGround = function (config) {
          let options = config.options;
          if (
            options.pdground &&
            ((config.row > 1 &&
              config.row < 5 &&
              config.col > 1 &&
              config.col < 5) ||
              (config.row > config.count - 6 &&
                config.row < config.count - 2 &&
                config.col > 1 &&
                config.col < 5) ||
              (config.row > 1 &&
                config.row < 5 &&
                config.col > config.count - 6 &&
                config.col < config.count - 2))
          ) {
            return options.pdground;
          }
          return options.foreground;
        };
        let count = qrCodeAlg.getModuleCount();
        let ratioSize = options.size;
        let tileW = ratioSize / count;
        let tileH = ratioSize / count;
        for (let row = 0; row < count; row++) {
          for (let col = 0; col < count; col++) {
            let w = (col + 1) * tileW - col * tileW;
            let h = (row + 1) * tileW - row * tileW;
            let foreground = getForeGround({
              row: row,
              col: col,
              count: count,
              options: options,
            });
            this.setPaintbrush({
              fillStyle: qrCodeAlg.modules[row][col]
                ? foreground
                : options.background,
            });
            this.ctx.fillRect(
              options.dx + col * tileW,
              options.dy + row * tileH,
              w,
              h
            );
          }
        }
        this.restorePaintbrush();

        rs({
          ...obj,
          height: obj.size,
          width: obj.size,
          left: obj.x,
          top: obj.y,
          right: obj.x + obj.width,
          bottom: obj.y + obj.size,
        });
      });
    }

    /**
     * 圆形
     */
    setCircle(obj = {}) {
      const ctx = this.ctx;
      let { x, y, d, mode } = obj;
      mode = mode || "leftTop";
      const r = d / 2;
      if (obj.clip) ctx.save();
      ctx.beginPath();
      switch (mode) {
        case "leftTop":
          ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
          break;
        case "center":
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          break;
      }
      ctx.closePath();
      if (obj.clip) ctx.clip();
      return this;
    }

    /**
     * 矩形
     */
    setRect(obj = {}) {
      const ctx = this.ctx;
      const { x, y, r, height, width } = obj;
      if (obj.clip) ctx.save();
      ctx.beginPath();
      if (r && r > 0) {
        ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI);
        ctx.lineTo(x + width - r, y);
        ctx.arc(x + width - r, y + r, r, 1.5 * Math.PI, 0);
        ctx.lineTo(x + width, y + height - r);
        ctx.arc(x + width - r, y + height - r, r, 0, 0.5 * Math.PI);
        ctx.lineTo(x + r, y + height);
        ctx.arc(x + r, y + height - r, r, 0.5 * Math.PI, 1 * Math.PI);
        ctx.lineTo(x, y + r);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (obj.clip) ctx.clip();
      return this;
    }

    /**
     * 加载图片
     */
    loadImage(url) {
      return new Promise(async (resolve, reject) => {
        if (!url) {
          console.warn("加载图片url为空");
          resolve();
          return;
        }
        if (imgCache[url]) {
          resolve(imgCache[url]);
          return;
        }
        let img;
        try {
          switch (platform) {
            case "uni":
              img = await new Promise((rs, rj) => {
                if (url._loaded) {
                  rs(url);
                  return;
                }
                if (~url.indexOf("data:image")) {
                  let tempFilePath = url,
                    imageInfoR = {};
                  // #ifndef MP-ALIPAY
                  imgTools
                    .base64ToPath(url)
                    .then((t) => {
                      tempFilePath = t;
                      // #ifndef MP-BAIDU
                      uni.getImageInfo({
                        src: tempFilePath,
                        success: (imgInfo) => {
                          imageInfoR = imgInfo;
                          // #endif
                          // #endif
                          const uniImg = new String(tempFilePath);
                          for (const i in imageInfoR) uniImg[i] = imageInfoR[i];
                          uniImg._loaded = true;
                          rs(uniImg);
                          // #ifndef MP-ALIPAY
                          // #ifndef MP-BAIDU
                        },
                        fail: (err) => rj(err),
                      });
                      // #endif
                    })
                    .catch((err) => {
                      rj(err);
                    });
                  // #endif
                } else if (url.substr(0, 4) == "http") {
                  uni.downloadFile({
                    url: url,
                    success: ({ tempFilePath }) => {
                      uni.getImageInfo({
                        src: tempFilePath,
                        success: (imageInfoR) => {
                          const uniImg = new String(tempFilePath);
                          for (const i in imageInfoR) uniImg[i] = imageInfoR[i];
                          uniImg._loaded = true;
                          rs(uniImg);
                        },
                        fail: (err) => rj(err),
                      });
                    },
                    fail: (error) => rj(error),
                  });
                } else {
                  uni.getImageInfo({
                    src: url,
                    success: (imageInfoR) => {
                      const uniImg = new String(url);
                      for (const i in imageInfoR) uniImg[i] = imageInfoR[i];
                      uniImg._loaded = true;
                      rs(uniImg);
                    },
                    fail: (err) => rj(err),
                  });
                }
              });
              break;
            case "web":
              img = await new Promise((rs, rj) => {
                /* url instanceof Image */
                if (typeof url != "string") {
                  rs(url);
                  return;
                }
                // node 也可以用这种方式
                const imgObj = new Image();
                imgObj.onload = () => {
                  rs(imgObj);
                };
                imgObj.onerror = (err) => {
                  rj(err);
                };
                imgObj.src = url;
              });
              break;
            case "node":
              img = await new Promise((rs, rj) => {
                /* url instanceof nodeCanvas.Image */
                if (typeof url != "string") {
                  rs(url);
                  return;
                }
                nodeCanvas
                  .loadImage(url)
                  .then((res) => {
                    rs(res);
                  })
                  .catch((err) => {
                    rj(err);
                  });
              });
              break;
          }
        } catch (error) {
          reject(error);
        }
        imgCache[url] = img;
        resolve(img);
      });
    }

    drawArray(data) {
      return new Promise(async (rs, rj) => {
        try {
          if (!data) {
            rj("drawArray需绘制参数不存在");
            return;
          }
          if (!Array.isArray(data)) {
            rj("drawArray参数需要是Array");
            return;
          }

          data = [...data].sort((a, b) => (a?.zIndex ?? 0) - (b?.zIndex ?? 0));
          const arr = [];
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let r;
            switch (typeof item) {
              case "function":
                r = item();
                if (typeof r?.then == "function") r = await r;
                break;
              case "object":
                if (Array.isArray(item)) r = await this.drawArray(item);
                else r = await this.drawItem(item);
                break;
            }
            arr.push({ item: item, result: r });
          }
          rs(arr);
        } catch (error) {
          rj(error);
        }
      });
    }

    drawItem(obj = {}) {
      return new Promise(async (rs, rj) => {
        try {
          let r;
          switch (obj.type) {
            case "text":
              r = await this.drawText(obj);
              break;
            case "image":
              r = await this.drawImg(obj);
              break;
            case "qrcode":
              r = await this.drawQrCode(obj);
              break;
            case "method":
              r = this[obj.name]?.(
                ...(obj.data
                  ? Array.isArray(obj.data)
                    ? obj.data
                    : [obj.data]
                  : [])
              );
              if (typeof r?.then == "function") r = await r;
              break;
            case "function":
              r = obj.val?.();
              if (typeof r?.then == "function") r = await r;
              break;
          }
          rs(r);
        } catch (error) {
          rj(error);
        }
      });
    }

    drawRichText(html) {
      return new Promise(async (rs, rj) => {
        if (!html) {
          rj("drawRichText需绘制参数不存在");
          return;
        }
        if (typeof html == "string") html = htmlParse(html);
        const result = [];
        function run(arr, parent) {
          return new Promise(async (res, rej) => {
            for (let i = 0; i < arr.length; i++) {
              const item = arr[i];

              if (item.type == "text") {
              } else {
                switch (item.name) {
                  case "img":
                    break;
                }
              }

              result.push(item);

              if (item.children?.length) {
                item.__handle = function (obj) {};
                try {
                  await run(item.children, item);
                } catch (error) {
                  rej(error);
                  return;
                }
              }
            }
            res(result);
          });
        }

        try {
          rs({ html: html, htmlParses: await run(html) });
        } catch (error) {
          rj(error);
        }
      });
    }
  }

  function filterPaintbrushProps(obj) {
    switch (obj?.textBaseline) {
      case "normal":
        if (isUni) obj.textBaseline = "alphabetic";
        break;
      case "hanging":
        if (isUni) obj.textBaseline = "top";
        break;
      case "ideographic":
        if (isUni) obj.textBaseline = "bottom";
        break;
    }

    switch (obj?.textAlign) {
      case "start":
        obj.textAlign = "left";
        break;
      case "end":
        obj.textAlign = "right";
        break;
    }
  }

  /**
   * 驼峰转连字符
   */
  function hump2Hyphen(s) {
    return s.replace(/([A-Z])/g, "-$1").toLowerCase();
  }

  /**
   * 连字符转驼峰
   */
  function hyphen2Hump(s) {
    if (!s) return "";
    const arr = s.split("-");
    for (let i = 1; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
    }
    return arr.join("");
  }

  /**
   * 原文链接：https://blog.csdn.net/kingviewer/article/details/120346353
   * 获取指定两点间圆弧上的点
   * @param x1 起点经度
   * @param y1 起点纬度
   * @param x2 终点经度
   * @param y2 终点纬度
   * @param pointCount 要获取的点的数量
   * @param level 弧度大小标定值，0~∞ 0为半圆，越大越接近直线
   * @returns {*[x, y]} 从起点到终点的顺序排列的结果点经纬度数组
   */
  function getPoints(x1, y1, x2, y2, pointCount, level) {
    let a,
      b,
      rSquare,
      k,
      kv,
      points = [];
    if (x1 === x2) {
      a = x1 + (y2 - y1) * level;
      b = y1 + (y2 - y1) / 2;
      rSquare = (x1 - a) ** 2 + (y1 - b) ** 2;
    } else if (y1 === y2) {
      a = x1 + (x2 - x1) / 2;
      b = y1 - (x2 - x1) * level;
      rSquare = (x1 - a) ** 2 + (y1 - b) ** 2;
    } else {
      let xc = (x1 + x2) / 2,
        yc = (y1 + y2) / 2,
        lenSquare = ((x2 - x1) ** 2 + (y2 - y1) ** 2) * level ** 2;
      k = (x2 - x1) / (y1 - y2);
      let l = yc - k * xc;
      let a1 = 1 + k ** 2,
        b1 = 2 * k * (l - yc) - 2 * xc,
        c1 = xc ** 2 + (l - yc) ** 2 - lenSquare;
      kv = -1 / k;
      a =
        (-b1 +
          Math.sqrt(b1 ** 2 - 4 * a1 * c1) *
            ((kv > 0 && x2 > x1) || (kv < 0 && x2 < x1) ? 1 : -1)) /
        (2 * a1);
      b = k * a + l;
      rSquare = (x1 - a) ** 2 + (y1 - b) ** 2;
    }

    if (x1 === x2 || Math.abs(kv) > 1) {
      let yDistance = y2 - y1;
      let yDis = yDistance / (pointCount + 1);
      for (let i = 0; i < pointCount; i++) {
        let y = y1 + yDis * (i + 1);
        let x = Math.sqrt(rSquare - (y - b) ** 2) * (y2 > y1 ? -1 : 1) + a;
        points.push([x, y]);
      }
    } else {
      let xDistance = x2 - x1;
      let xDis = xDistance / (pointCount + 1);
      for (let i = 0; i < pointCount; i++) {
        let x = x1 + xDis * (i + 1);
        let y = Math.sqrt(rSquare - (x - a) ** 2) * (x2 > x1 ? 1 : -1) + b;
        points.push([x, y]);
      }
    }

    return points;
  }

  var QRCodeAlg = (function () {
    function unicodeFormat8(code) {
      let c0, c1, c2;
      if (code < 128) {
        return [code];
      } else if (code < 2048) {
        c0 = 192 + (code >> 6);
        c1 = 128 + (code & 63);
        return [c0, c1];
      } else {
        c0 = 224 + (code >> 12);
        c1 = 128 + ((code >> 6) & 63);
        c2 = 128 + (code & 63);
        return [c0, c1, c2];
      }
    }
    function getUTF8Bytes(string) {
      let utf8codes = [];
      for (let i = 0; i < string.length; i++) {
        let code = string.charCodeAt(i);
        let utf8 = unicodeFormat8(code);
        for (let j = 0; j < utf8.length; j++) {
          utf8codes.push(utf8[j]);
        }
      }
      return utf8codes;
    }
    function QRCodeAlg(data, errorCorrectLevel) {
      this.typeNumber = -1;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.rsBlocks = null;
      this.totalDataCount = -1;
      this.data = data;
      this.utf8bytes = getUTF8Bytes(data);
      this.make();
    }
    QRCodeAlg.prototype = {
      constructor: QRCodeAlg,
      getModuleCount: function () {
        return this.moduleCount;
      },
      make: function () {
        this.getRightType();
        this.dataCache = this.createData();
        this.createQrcode();
      },
      makeImpl: function (maskPattern) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (let row = 0; row < this.moduleCount; row++) {
          this.modules[row] = new Array(this.moduleCount);
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(true, maskPattern);
        if (this.typeNumber >= 7) {
          this.setupTypeNumber(true);
        }
        this.mapData(this.dataCache, maskPattern);
      },
      setupPositionProbePattern: function (row, col) {
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || this.moduleCount <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || this.moduleCount <= col + c) continue;
            if (
              (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
              (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)
            ) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      },
      createQrcode: function () {
        let minLostPoint = 0;
        let pattern = 0;
        let bestModules = null;
        for (let i = 0; i < 8; i++) {
          this.makeImpl(i);
          let lostPoint = QRUtil.getLostPoint(this);
          if (i == 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
            bestModules = this.modules;
          }
        }
        this.modules = bestModules;
        this.setupTypeInfo(false, pattern);
        if (this.typeNumber >= 7) {
          this.setupTypeNumber(false);
        }
      },
      setupTimingPattern: function () {
        for (let r = 8; r < this.moduleCount - 8; r++) {
          if (this.modules[r][6] != null) {
            continue;
          }
          this.modules[r][6] = r % 2 == 0;
          if (this.modules[6][r] != null) {
            continue;
          }
          this.modules[6][r] = r % 2 == 0;
        }
      },
      setupPositionAdjustPattern: function () {
        let pos = QRUtil.getPatternPosition(this.typeNumber);
        for (let i = 0; i < pos.length; i++) {
          for (let j = 0; j < pos.length; j++) {
            let row = pos[i];
            let col = pos[j];
            if (this.modules[row][col] != null) {
              continue;
            }
            for (let r = -2; r <= 2; r++) {
              for (let c = -2; c <= 2; c++) {
                if (
                  r == -2 ||
                  r == 2 ||
                  c == -2 ||
                  c == 2 ||
                  (r == 0 && c == 0)
                ) {
                  this.modules[row + r][col + c] = true;
                } else {
                  this.modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      },
      setupTypeNumber: function (test) {
        let bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        for (let i = 0; i < 18; i++) {
          let mod = !test && ((bits >> i) & 1) == 1;
          this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] =
            mod;
          this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] =
            mod;
        }
      },
      setupTypeInfo: function (test, maskPattern) {
        let data =
          (QRErrorCorrectLevel[this.errorCorrectLevel] << 3) | maskPattern;
        let bits = QRUtil.getBCHTypeInfo(data);
        for (let i = 0; i < 15; i++) {
          var mod = !test && ((bits >> i) & 1) == 1;
          if (i < 6) {
            this.modules[i][8] = mod;
          } else if (i < 8) {
            this.modules[i + 1][8] = mod;
          } else {
            this.modules[this.moduleCount - 15 + i][8] = mod;
          }
          var mod = !test && ((bits >> i) & 1) == 1;
          if (i < 8) {
            this.modules[8][this.moduleCount - i - 1] = mod;
          } else if (i < 9) {
            this.modules[8][15 - i - 1 + 1] = mod;
          } else {
            this.modules[8][15 - i - 1] = mod;
          }
        }
        this.modules[this.moduleCount - 8][8] = !test;
      },
      createData: function () {
        let buffer = new QRBitBuffer();
        let lengthBits = this.typeNumber > 9 ? 16 : 8;
        buffer.put(4, 4);
        buffer.put(this.utf8bytes.length, lengthBits);
        for (let i = 0, l = this.utf8bytes.length; i < l; i++) {
          buffer.put(this.utf8bytes[i], 8);
        }
        if (buffer.length + 4 <= this.totalDataCount * 8) {
          buffer.put(0, 4);
        }
        while (buffer.length % 8 != 0) {
          buffer.putBit(false);
        }
        while (true) {
          if (buffer.length >= this.totalDataCount * 8) {
            break;
          }
          buffer.put(QRCodeAlg.PAD0, 8);
          if (buffer.length >= this.totalDataCount * 8) {
            break;
          }
          buffer.put(QRCodeAlg.PAD1, 8);
        }
        return this.createBytes(buffer);
      },
      createBytes: function (buffer) {
        let offset = 0;
        let maxDcCount = 0;
        let maxEcCount = 0;
        let length = this.rsBlock.length / 3;
        let rsBlocks = [];
        for (var i = 0; i < length; i++) {
          let count = this.rsBlock[i * 3 + 0];
          let totalCount = this.rsBlock[i * 3 + 1];
          let dataCount = this.rsBlock[i * 3 + 2];
          for (let j = 0; j < count; j++) {
            rsBlocks.push([dataCount, totalCount]);
          }
        }
        let dcdata = new Array(rsBlocks.length);
        let ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
          let dcCount = rsBlocks[r][0];
          let ecCount = rsBlocks[r][1] - dcCount;
          maxDcCount = Math.max(maxDcCount, dcCount);
          maxEcCount = Math.max(maxEcCount, ecCount);
          dcdata[r] = new Array(dcCount);
          for (var i = 0; i < dcdata[r].length; i++) {
            dcdata[r][i] = 0xff & buffer.buffer[i + offset];
          }
          offset += dcCount;
          let rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
          let rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
          let modPoly = rawPoly.mod(rsPoly);
          ecdata[r] = new Array(rsPoly.getLength() - 1);
          for (var i = 0; i < ecdata[r].length; i++) {
            let modIndex = i + modPoly.getLength() - ecdata[r].length;
            ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
          }
        }
        let data = new Array(this.totalDataCount);
        let index = 0;
        for (var i = 0; i < maxDcCount; i++) {
          for (var r = 0; r < rsBlocks.length; r++) {
            if (i < dcdata[r].length) {
              data[index++] = dcdata[r][i];
            }
          }
        }
        for (var i = 0; i < maxEcCount; i++) {
          for (var r = 0; r < rsBlocks.length; r++) {
            if (i < ecdata[r].length) {
              data[index++] = ecdata[r][i];
            }
          }
        }
        return data;
      },
      mapData: function (data, maskPattern) {
        let inc = -1;
        let row = this.moduleCount - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = this.moduleCount - 1; col > 0; col -= 2) {
          if (col == 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (this.modules[row][col - c] == null) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = ((data[byteIndex] >>> bitIndex) & 1) == 1;
                }
                let mask = QRUtil.getMask(maskPattern, row, col - c);
                if (mask) {
                  dark = !dark;
                }
                this.modules[row][col - c] = dark;
                bitIndex--;
                if (bitIndex == -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      },
    };
    QRCodeAlg.PAD0 = 0xec;
    QRCodeAlg.PAD1 = 0x11;
    var QRErrorCorrectLevel = [1, 0, 3, 2];
    let QRMaskPattern = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7,
    };
    var QRUtil = {
      PATTERN_POSITION_TABLE: [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170],
      ],
      G15:
        (1 << 10) |
        (1 << 8) |
        (1 << 5) |
        (1 << 4) |
        (1 << 2) |
        (1 << 1) |
        (1 << 0),
      G18:
        (1 << 12) |
        (1 << 11) |
        (1 << 10) |
        (1 << 9) |
        (1 << 8) |
        (1 << 5) |
        (1 << 2) |
        (1 << 0),
      G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
      getBCHTypeInfo: function (data) {
        let d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
          d ^=
            QRUtil.G15 <<
            (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15));
        }
        return ((data << 10) | d) ^ QRUtil.G15_MASK;
      },
      getBCHTypeNumber: function (data) {
        let d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
          d ^=
            QRUtil.G18 <<
            (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18));
        }
        return (data << 12) | d;
      },
      getBCHDigit: function (data) {
        let digit = 0;
        while (data != 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      },
      getPatternPosition: function (typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      },
      getMask: function (maskPattern, i, j) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000:
            return (i + j) % 2 == 0;
          case QRMaskPattern.PATTERN001:
            return i % 2 == 0;
          case QRMaskPattern.PATTERN010:
            return j % 3 == 0;
          case QRMaskPattern.PATTERN011:
            return (i + j) % 3 == 0;
          case QRMaskPattern.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
          case QRMaskPattern.PATTERN101:
            return ((i * j) % 2) + ((i * j) % 3) == 0;
          case QRMaskPattern.PATTERN110:
            return (((i * j) % 2) + ((i * j) % 3)) % 2 == 0;
          case QRMaskPattern.PATTERN111:
            return (((i * j) % 3) + ((i + j) % 2)) % 2 == 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      },
      getErrorCorrectPolynomial: function (errorCorrectLength) {
        let a = new QRPolynomial([1], 0);
        for (let i = 0; i < errorCorrectLength; i++) {
          a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      },
      getLostPoint: function (qrCode) {
        let moduleCount = qrCode.getModuleCount(),
          lostPoint = 0,
          darkCount = 0;
        for (var row = 0; row < moduleCount; row++) {
          var sameCount = 0;
          var head = qrCode.modules[row][0];
          for (var col = 0; col < moduleCount; col++) {
            var current = qrCode.modules[row][col];
            if (col < moduleCount - 6) {
              if (
                current &&
                !qrCode.modules[row][col + 1] &&
                qrCode.modules[row][col + 2] &&
                qrCode.modules[row][col + 3] &&
                qrCode.modules[row][col + 4] &&
                !qrCode.modules[row][col + 5] &&
                qrCode.modules[row][col + 6]
              ) {
                if (col < moduleCount - 10) {
                  if (
                    qrCode.modules[row][col + 7] &&
                    qrCode.modules[row][col + 8] &&
                    qrCode.modules[row][col + 9] &&
                    qrCode.modules[row][col + 10]
                  ) {
                    lostPoint += 40;
                  }
                } else if (col > 3) {
                  if (
                    qrCode.modules[row][col - 1] &&
                    qrCode.modules[row][col - 2] &&
                    qrCode.modules[row][col - 3] &&
                    qrCode.modules[row][col - 4]
                  ) {
                    lostPoint += 40;
                  }
                }
              }
            }
            if (row < moduleCount - 1 && col < moduleCount - 1) {
              let count = 0;
              if (current) count++;
              if (qrCode.modules[row + 1][col]) count++;
              if (qrCode.modules[row][col + 1]) count++;
              if (qrCode.modules[row + 1][col + 1]) count++;
              if (count == 0 || count == 4) {
                lostPoint += 3;
              }
            }
            if (head ^ current) {
              sameCount++;
            } else {
              head = current;
              if (sameCount >= 5) {
                lostPoint += 3 + sameCount - 5;
              }
              sameCount = 1;
            }
            if (current) {
              darkCount++;
            }
          }
        }
        for (var col = 0; col < moduleCount; col++) {
          var sameCount = 0;
          var head = qrCode.modules[0][col];
          for (var row = 0; row < moduleCount; row++) {
            var current = qrCode.modules[row][col];
            if (row < moduleCount - 6) {
              if (
                current &&
                !qrCode.modules[row + 1][col] &&
                qrCode.modules[row + 2][col] &&
                qrCode.modules[row + 3][col] &&
                qrCode.modules[row + 4][col] &&
                !qrCode.modules[row + 5][col] &&
                qrCode.modules[row + 6][col]
              ) {
                if (row < moduleCount - 10) {
                  if (
                    qrCode.modules[row + 7][col] &&
                    qrCode.modules[row + 8][col] &&
                    qrCode.modules[row + 9][col] &&
                    qrCode.modules[row + 10][col]
                  ) {
                    lostPoint += 40;
                  }
                } else if (row > 3) {
                  if (
                    qrCode.modules[row - 1][col] &&
                    qrCode.modules[row - 2][col] &&
                    qrCode.modules[row - 3][col] &&
                    qrCode.modules[row - 4][col]
                  ) {
                    lostPoint += 40;
                  }
                }
              }
            }
            if (head ^ current) {
              sameCount++;
            } else {
              head = current;
              if (sameCount >= 5) {
                lostPoint += 3 + sameCount - 5;
              }
              sameCount = 1;
            }
          }
        }
        let ratio =
          Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      },
    };
    var QRMath = {
      glog: function (n) {
        if (n < 1) {
          throw new Error("glog(" + n + ")");
        }
        return QRMath.LOG_TABLE[n];
      },
      gexp: function (n) {
        while (n < 0) {
          n += 255;
        }
        while (n >= 256) {
          n -= 255;
        }
        return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256),
    };
    for (var i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] =
        QRMath.EXP_TABLE[i - 4] ^
        QRMath.EXP_TABLE[i - 5] ^
        QRMath.EXP_TABLE[i - 6] ^
        QRMath.EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    function QRPolynomial(num, shift) {
      if (num.length == undefined) {
        throw new Error(num.length + "/" + shift);
      }
      let offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset++;
      }
      this.num = new Array(num.length - offset + shift);
      for (let i = 0; i < num.length - offset; i++) {
        this.num[i] = num[i + offset];
      }
    }
    QRPolynomial.prototype = {
      get: function (index) {
        return this.num[index];
      },
      getLength: function () {
        return this.num.length;
      },
      multiply: function (e) {
        let num = new Array(this.getLength() + e.getLength() - 1);
        for (let i = 0; i < this.getLength(); i++) {
          for (let j = 0; j < e.getLength(); j++) {
            num[i + j] ^= QRMath.gexp(
              QRMath.glog(this.get(i)) + QRMath.glog(e.get(j))
            );
          }
        }
        return new QRPolynomial(num, 0);
      },
      mod: function (e) {
        let tl = this.getLength(),
          el = e.getLength();
        if (tl - el < 0) {
          return this;
        }
        let num = new Array(tl);
        for (var i = 0; i < tl; i++) {
          num[i] = this.get(i);
        }
        while (num.length >= el) {
          let ratio = QRMath.glog(num[0]) - QRMath.glog(e.get(0));
          for (var i = 0; i < e.getLength(); i++) {
            num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
          }
          while (num[0] == 0) {
            num.shift();
          }
        }
        return new QRPolynomial(num, 0);
      },
    };
    let RS_BLOCK_TABLE = [
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12],
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16],
    ];
    QRCodeAlg.prototype.getRightType = function () {
      for (let typeNumber = 1; typeNumber < 41; typeNumber++) {
        let rsBlock =
          RS_BLOCK_TABLE[(typeNumber - 1) * 4 + this.errorCorrectLevel];
        if (rsBlock == undefined) {
          throw new Error(
            "bad rs block @ typeNumber:" +
              typeNumber +
              "/errorCorrectLevel:" +
              this.errorCorrectLevel
          );
        }
        let length = rsBlock.length / 3;
        let totalDataCount = 0;
        for (let i = 0; i < length; i++) {
          let count = rsBlock[i * 3 + 0];
          let dataCount = rsBlock[i * 3 + 2];
          totalDataCount += dataCount * count;
        }
        let lengthBytes = typeNumber > 9 ? 2 : 1;
        if (
          this.utf8bytes.length + lengthBytes < totalDataCount ||
          typeNumber == 40
        ) {
          this.typeNumber = typeNumber;
          this.rsBlock = rsBlock;
          this.totalDataCount = totalDataCount;
          break;
        }
      }
    };
    function QRBitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    QRBitBuffer.prototype = {
      get: function (index) {
        let bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> (7 - (index % 8))) & 1;
      },
      put: function (num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> (length - i - 1)) & 1);
        }
      },
      putBit: function (bit) {
        let bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
        }
        this.length++;
      },
    };

    return QRCodeAlg;
  })();

  var htmlParse = (function () {
    let startTag =
      /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
    let endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
    let attr =
      /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
    let empty = makeMap(
      "area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"
    );
    let block = makeMap(
      "a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"
    );
    let inline = makeMap(
      "abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"
    );
    let closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
    let fillAttrs = makeMap(
      "checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"
    );
    let special = makeMap("script,style");
    function HTMLParser(html, handler) {
      let index;
      let chars;
      let match;
      let stack = [];
      let last = html;
      stack.last = function () {
        return this[this.length - 1];
      };
      while (html) {
        chars = true;
        if (!stack.last() || !special[stack.last()]) {
          if (html.indexOf("<!--") == 0) {
            index = html.indexOf("-->");
            if (index >= 0) {
              if (handler.comment) {
                handler.comment(html.substring(4, index));
              }
              html = html.substring(index + 3);
              chars = false;
            }
          } else if (html.indexOf("</") == 0) {
            match = html.match(endTag);
            if (match) {
              html = html.substring(match[0].length);
              match[0].replace(endTag, parseEndTag);
              chars = false;
            }
          } else if (html.indexOf("<") == 0) {
            match = html.match(startTag);
            if (match) {
              html = html.substring(match[0].length);
              match[0].replace(startTag, parseStartTag);
              chars = false;
            }
          }
          if (chars) {
            index = html.indexOf("<");
            let text = index < 0 ? html : html.substring(0, index);
            html = index < 0 ? "" : html.substring(index);
            if (handler.chars) {
              handler.chars(text);
            }
          }
        } else {
          html = html.replace(
            new RegExp("([\\s\\S]*?)</" + stack.last() + "[^>]*>"),
            function (all, text) {
              text = text.replace(
                /<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g,
                "$1$2"
              );
              if (handler.chars) {
                handler.chars(text);
              }
              return "";
            }
          );
          parseEndTag("", stack.last());
        }
        if (html == last) {
          throw "Parse Error: " + html;
        }
        last = html;
      }
      parseEndTag();
      function parseStartTag(tag, tagName, rest, unary) {
        tagName = tagName.toLowerCase();
        if (block[tagName]) {
          while (stack.last() && inline[stack.last()]) {
            parseEndTag("", stack.last());
          }
        }
        if (closeSelf[tagName] && stack.last() == tagName) {
          parseEndTag("", tagName);
        }
        unary = empty[tagName] || !!unary;
        if (!unary) {
          stack.push(tagName);
        }
        if (handler.start) {
          let attrs = [];
          rest.replace(attr, function (match, name) {
            let value = arguments[2]
              ? arguments[2]
              : arguments[3]
              ? arguments[3]
              : arguments[4]
              ? arguments[4]
              : fillAttrs[name]
              ? name
              : "";
            attrs.push({
              name: name,
              value: value,
              escaped: value.replace(/(^|[^\\])"/g, '$1\\"'),
            });
          });
          if (handler.start) {
            handler.start(tagName, attrs, unary);
          }
        }
      }
      function parseEndTag(tag, tagName) {
        if (!tagName) {
          var pos = 0;
        } else {
          for (var pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos] == tagName) {
              break;
            }
          }
        }
        if (pos >= 0) {
          for (let i = stack.length - 1; i >= pos; i--) {
            if (handler.end) {
              handler.end(stack[i]);
            }
          }
          stack.length = pos;
        }
      }
    }
    function makeMap(str) {
      let obj = {};
      let items = str.split(",");
      for (let i = 0; i < items.length; i++) {
        obj[items[i]] = true;
      }
      return obj;
    }
    function removeDOCTYPE(html) {
      return html
        .replace(/<\?xml.*\?>\n/, "")
        .replace(/<!doctype.*>\n/, "")
        .replace(/<!DOCTYPE.*>\n/, "");
    }
    function parseAttrs(attrs) {
      return attrs.reduce(function (pre, attr) {
        let value = attr.value;
        let name = attr.name;
        if (pre[name]) {
          pre[name] = pre[name] + " " + value;
        } else {
          pre[name] = value;
        }
        return pre;
      }, {});
    }
    function parseHtml(html) {
      html = removeDOCTYPE(html);
      let stacks = [];
      let results = { node: "root", children: [] };
      HTMLParser(html, {
        start: function start(tag, attrs, unary) {
          let node = { name: tag };
          if (attrs.length !== 0) {
            node.attrs = parseAttrs(attrs);
          }
          if (unary) {
            let parent = stacks[0] || results;
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(node);
          } else {
            stacks.unshift(node);
          }
        },
        end: function end(tag) {
          let node = stacks.shift();
          if (node.name !== tag)
            console.error("invalid state: mismatch end tag");
          if (stacks.length === 0) {
            results.children.push(node);
          } else {
            let parent = stacks[0];
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(node);
          }
        },
        chars: function chars(text) {
          let node = { type: "text", text: text };
          if (stacks.length === 0) {
            results.children.push(node);
          } else {
            let parent = stacks[0];
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(node);
          }
        },
        comment: function comment(text) {
          let node = { node: "comment", text: text };
          let parent = stacks[0];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        },
      });
      return results.children;
    }
    return parseHtml;
  })();

  var imgTools = (function () {
    function getLocalFilePath(path) {
      if (
        path.indexOf("_www") === 0 ||
        path.indexOf("_doc") === 0 ||
        path.indexOf("_documents") === 0 ||
        path.indexOf("_downloads") === 0
      ) {
        return path;
      }
      if (path.indexOf("file://") === 0) {
        return path;
      }
      if (path.indexOf("/storage/emulated/0/") === 0) {
        return path;
      }
      if (path.indexOf("/") === 0) {
        let localFilePath = plus.io.convertAbsoluteFileSystem(path);
        if (localFilePath !== path) {
          return localFilePath;
        } else {
          path = path.substr(1);
        }
      }
      return "_www/" + path;
    }

    function dataUrlToBase64(str) {
      let array = str.split(",");
      return array[array.length - 1];
    }

    let index = 0;
    function getNewFileId() {
      return Date.now() + String(index++);
    }

    function biggerThan(v1, v2) {
      let v1Array = v1.split(".");
      let v2Array = v2.split(".");
      let update = false;
      for (let index = 0; index < v2Array.length; index++) {
        let diff = v1Array[index] - v2Array[index];
        if (diff !== 0) {
          update = diff > 0;
          break;
        }
      }
      return update;
    }

    function pathToBase64(path) {
      return new Promise(function (resolve, reject) {
        if (typeof window === "object" && "document" in window) {
          if (typeof FileReader === "function") {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", path, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
              if (this.status === 200) {
                let fileReader = new FileReader();
                fileReader.onload = function (e) {
                  resolve(e.target.result);
                };
                fileReader.onerror = reject;
                fileReader.readAsDataURL(this.response);
              }
            };
            xhr.onerror = reject;
            xhr.send();
            return;
          }
          let canvas = document.createElement("canvas");
          let c2x = canvas.getContext("2d");
          let img = new Image();
          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            c2x.drawImage(img, 0, 0);
            resolve(canvas.toDataURL());
            canvas.height = canvas.width = 0;
          };
          img.onerror = reject;
          img.src = path;
          return;
        }
        if (typeof plus === "object") {
          plus.io.resolveLocalFileSystemURL(
            getLocalFilePath(path),
            function (entry) {
              entry.file(
                function (file) {
                  let fileReader = new plus.io.FileReader();
                  fileReader.onload = function (data) {
                    resolve(data.target.result);
                  };
                  fileReader.onerror = function (error) {
                    reject(error);
                  };
                  fileReader.readAsDataURL(file);
                },
                function (error) {
                  reject(error);
                }
              );
            },
            function (error) {
              reject(error);
            }
          );
          return;
        }
        if (typeof wx === "object" && wx.canIUse("getFileSystemManager")) {
          wx.getFileSystemManager().readFile({
            filePath: path,
            encoding: "base64",
            success: function (res) {
              resolve("data:image/png;base64," + res.data);
            },
            fail: function (error) {
              reject(error);
            },
          });
          return;
        }
        reject(new Error("not support"));
      });
    }

    function base64ToPath(base64) {
      return new Promise(function (resolve, reject) {
        if (typeof window === "object" && "document" in window) {
          base64 = base64.split(",");
          let type = base64[0].match(/:(.*?);/)[1];
          let str = atob(base64[1]);
          let n = str.length;
          let array = new Uint8Array(n);
          while (n--) {
            array[n] = str.charCodeAt(n);
          }
          return resolve(
            (window.URL || window.webkitURL).createObjectURL(
              new Blob([array], { type: type })
            )
          );
        }
        let extName = base64.split(",")[0].match(/data\:\S+\/(\S+);/);
        if (extName) {
          extName = extName[1];
        } else {
          reject(new Error("base64 error"));
        }
        let fileName = getNewFileId() + "." + extName;
        if (typeof plus === "object") {
          let basePath = "_doc";
          let dirPath = "uniapp_temp";
          var filePath = basePath + "/" + dirPath + "/" + fileName;
          if (
            !biggerThan(
              plus.os.name === "Android" ? "1.9.9.80627" : "1.9.9.80472",
              plus.runtime.innerVersion
            )
          ) {
            plus.io.resolveLocalFileSystemURL(
              basePath,
              function (entry) {
                entry.getDirectory(
                  dirPath,
                  {
                    create: true,
                    exclusive: false,
                  },
                  function (entry) {
                    entry.getFile(
                      fileName,
                      {
                        create: true,
                        exclusive: false,
                      },
                      function (entry) {
                        entry.createWriter(function (writer) {
                          writer.onwrite = function () {
                            resolve(filePath);
                          };
                          writer.onerror = reject;
                          writer.seek(0);
                          writer.writeAsBinary(dataUrlToBase64(base64));
                        }, reject);
                      },
                      reject
                    );
                  },
                  reject
                );
              },
              reject
            );
            return;
          }
          let bitmap = new plus.nativeObj.Bitmap(fileName);
          bitmap.loadBase64Data(
            base64,
            function () {
              bitmap.save(
                filePath,
                {},
                function () {
                  bitmap.clear();
                  resolve(filePath);
                },
                function (error) {
                  bitmap.clear();
                  reject(error);
                }
              );
            },
            function (error) {
              bitmap.clear();
              reject(error);
            }
          );
          return;
        }

        function getEnvPath() {
          if (typeof my === "object" && my?.env?.USER_DATA_PATH) {
            // console.log('my')
            return my.env.USER_DATA_PATH;
          }
          if (typeof swan === "object" && swan?.env?.USER_DATA_PATH) {
            // console.log('swan')
            return swan.env.USER_DATA_PATH;
          }
          if (typeof tt === "object" && tt?.env?.USER_DATA_PATH) {
            // console.log('tt')
            return tt.env.USER_DATA_PATH;
          }
          if (typeof qq === "object" && qq?.env?.USER_DATA_PATH) {
            // console.log('qq')
            return qq.env.USER_DATA_PATH;
          }
          if (typeof qh === "object" && qh?.env?.USER_DATA_PATH) {
            // console.log('qh')
            return qh.env.USER_DATA_PATH;
          }
          if (typeof wx === "object" && wx?.env?.USER_DATA_PATH) {
            // console.log('wx')
            return wx.env.USER_DATA_PATH;
          }
          return "https://user";
        }

        try {
          var filePath = getEnvPath() + "/" + fileName;
          uni.getFileSystemManager().writeFile({
            filePath: filePath,
            data: dataUrlToBase64(base64),
            encoding: "base64",
            success: function () {
              resolve(filePath);
            },
            fail: function (error) {
              reject(error);
            },
          });
        } catch (e) {
          //TODO handle the exception
          reject(new Error("not support"));
        }
      });
    }

    return { pathToBase64, base64ToPath };
  })();

  if (notUnd(typeof module)) {
    module.exports = QSCanvas;
  }

  return QSCanvas;
})();

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_image_crop_1 = require("react-image-crop");
require("react-image-crop/dist/ReactCrop.css");
var antd_1 = require("antd");
/** 可以进行裁剪的图片格式 */
var ImageTypeReg = /.(jpg|jpeg|png|gif)$/i;
/** base64 转 blob */
var base64ToBlob = function (urlData, type) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mime
    });
};
var AntdImageCropUpload = /** @class */ (function (_super) {
    __extends(AntdImageCropUpload, _super);
    function AntdImageCropUpload(props) {
        var _this = _super.call(this, props) || this;
        /** 用于判断使用怎么的修改方式，1. 使用Form更新，2. 在组件内更新 */
        _this.triggerChange = function (changedValue) {
            // 1. 非控制组件，直接赋值
            if (!('fileList' in _this.props)) {
                var fileList = changedValue.fileList;
                _this.setState({ fileList: fileList });
            }
            // 2. 有onChange不一定是控制组件
            var onChange = _this.props.onChange;
            if (onChange) {
                onChange(changedValue);
            }
        };
        _this.handleChange = function (info) {
            // console.log('crop compnent handleChange', info);
            _this.triggerChange(info);
        };
        /** 在上传前对文件进行裁剪， 使用返回 Promise 的方式 */
        _this.handleBeforeUpload = function (file, fileList) {
            console.log('init beforeupload', file, fileList);
            var _a = _this.props, imageOnly = _a.imageOnly, beforeUpload = _a.beforeUpload;
            // 是否只允许上传图片-可实现在上传的文件为图片的时候才打开裁剪
            if (!imageOnly) {
                // 当前不是可裁剪的图片文件
                if (!ImageTypeReg.test(file.name)) {
                    if (beforeUpload) {
                        return beforeUpload(file, fileList);
                    }
                    return true;
                }
            }
            // 是可裁剪的图片文件
            return new Promise(function (resolve, reject) {
                _this.resolve = resolve;
                _this.reject = reject;
                // console.log('======handleBeforeUpload', file, fileList);
                /** 上传了不允许裁剪的图片 */
                if (!ImageTypeReg.test(file.name)) {
                    antd_1.notification.error({ message: '错误', description: '该文件不允许裁剪' });
                    _this.reject();
                    return;
                }
                /**
                 * 裁剪前校验图片
                 * 1. 返回的是 false， 则不进行裁剪，
                 * 2. 同时 beforeCrop 中应该在 fileList 进行剔除，或相应的 file.status = 'error' 的赋值
                 */
                var beforeCrop = _this.props.beforeCrop;
                if (beforeCrop && beforeCrop(file, fileList) === false) {
                    _this.reject();
                    return;
                }
                /**
                 * 读取条件的图片，然后给 react-image-crop
                 * 1. setState previewDataUrl 后触发 onImageLoaded
                 * 2. 最终在 handleModal 中 执行 this.resolve()
                 */
                var reader = new FileReader();
                reader.onload = function (e) {
                    _this.setState({
                        oldFile: file,
                        oldFileList: fileList,
                        previewDataUrl: e.target['result'],
                        modalVisible: true
                    });
                };
                reader.readAsDataURL(file);
            });
        };
        _this.handleCancel = function () {
            _this.reject = undefined;
            _this.resolve = undefined;
            _this.setState({
                modalVisible: false,
                crop: _this.state.initialCrop,
                previewDataUrl: '',
                pixelCrop: {},
                oldFile: [],
                oldFileList: []
            });
        };
        _this.handleOk = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, oldFile, oldFileList, croppedImageUrl, blob, name, type, uid, croppedFile, beforeUpload, newFileList, result, resolvedFile, fileType, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, oldFile = _a.oldFile, oldFileList = _a.oldFileList, croppedImageUrl = _a.croppedImageUrl;
                        blob = base64ToBlob(croppedImageUrl, oldFile.type);
                        name = oldFile.name, type = oldFile.type, uid = oldFile.uid;
                        croppedFile = new File([blob], name, { type: type, lastModified: Date.now() });
                        croppedFile['uid'] = uid;
                        beforeUpload = this.props.beforeUpload;
                        if (!beforeUpload) {
                            this.resolve(croppedFile);
                            this.handleCancel();
                            return [2 /*return*/];
                        }
                        newFileList = oldFileList.reduce(function (pre, cur) {
                            pre.push(cur.uid === uid ? croppedFile : cur);
                        }, []);
                        result = beforeUpload(croppedFile, newFileList);
                        if (result === false) {
                            this.reject();
                            this.handleCancel();
                            return [2 /*return*/];
                        }
                        // Upload 组件中 undefined 与 true 返回的是一样的效果
                        if (result === undefined || result) {
                            this.resolve(croppedFile);
                            this.handleCancel();
                            return [2 /*return*/];
                        }
                        // promise 具有 then 方式
                        if (!result.then) {
                            this.resolve(croppedFile);
                            this.handleCancel();
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, result];
                    case 2:
                        resolvedFile = _b.sent();
                        fileType = Object.prototype.toString.call(resolvedFile);
                        if (fileType === '[object File]' || fileType === '[object Blob]') {
                            this.resolve(resolvedFile);
                        }
                        else {
                            this.resolve(croppedFile);
                        }
                        this.handleCancel();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        this.reject(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /* ******************* 裁剪组件相关 start **************** */
        /**
         * 1. 图片加载完成时，自动执行
         * @param image 渲染出来的 img 标签元素
         * @param pixelCrop 根据 this.state.crop 计算出来的 真实图片的物理位置
         */
        _this.onImageLoaded = function (image, pixelCrop) {
            // console.log('======onImageLoaded', this.state.crop, pixelCrop);
            _this.setState({
                imageRef: image,
                pixelCrop: pixelCrop,
                previewLoading: true
            }, function () {
                _this.makeClientCrop(_this.state.crop, pixelCrop);
            });
        };
        /**
         * 2. 裁剪框变化时，自动执行
         * 需要不动更新crop，用于匹配当前的裁剪框位置
         */
        _this.onCropChange = function (crop) {
            // 如果在裁剪范围内点击一下，得到的裁剪 width height 都为 0，不允许这种情况
            if (!crop.width || !crop.height)
                return;
            _this.setState({ crop: crop });
        };
        // 3. 根据拖拽框的位置crop计算出，最终图片需要裁剪的位置 pixelCrop，
        /**
         * 3. 停止 onCropChange后，自动执行
         * 根据传入的 crop 自动计算新的 pixelCrop
         */
        _this.onCropComplete = function (crop, pixelCrop) {
            // 因为 onCropChange 已经控制了不可为 0 ，所以这里是不需要的。避免初始化时为 0 
            if (!crop.width || !crop.height)
                return;
            // console.log('======onCropComplete', crop, pixelCrop);
            _this.setState({
                crop: crop,
                pixelCrop: pixelCrop,
                previewLoading: true
            }, function () {
                _this.makeClientCrop(crop, pixelCrop);
            });
        };
        var initCrop = props.initCrop, targetImage = props.targetImage;
        var initialCrop = __assign({}, initCrop);
        if (targetImage && targetImage.width && targetImage.height) {
            initialCrop['aspect'] = targetImage.width / targetImage.height;
        }
        _this.state = {
            initialCrop: initialCrop,
            fileList: [],
            oldFile: undefined,
            oldFileList: [],
            previewDataUrl: '',
            crop: initialCrop,
            modalVisible: false,
            pixelCrop: undefined,
            imageRef: undefined,
            croppedImageUrl: undefined,
            previewLoading: false
        };
        return _this;
    }
    AntdImageCropUpload.getDerivedStateFromProps = function (nextProps) {
        if ('fileList' in nextProps) {
            return {
                fileList: nextProps.fileList || []
            };
        }
        return null;
    };
    // onDragStart = () => {
    //   console.log('onDragStart');
    // }
    // onDragEnd = () => {
    //   console.log('onDragEnd');
    // }
    /**
     * 生成裁剪后的效果图，进行预览
     * @param crop
     * @param pixelCrop
     */
    AntdImageCropUpload.prototype.makeClientCrop = function (crop, pixelCrop) {
        return __awaiter(this, void 0, void 0, function () {
            var targetImage, _a, imageRef, oldFile, croppedImageUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        targetImage = this.props.targetImage;
                        _a = this.state, imageRef = _a.imageRef, oldFile = _a.oldFile;
                        if (!(imageRef && crop.width && crop.height)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getCroppedImg(imageRef, pixelCrop, targetImage, oldFile.type)];
                    case 1:
                        croppedImageUrl = _b.sent();
                        this.setState({ croppedImageUrl: croppedImageUrl, previewLoading: false });
                        return [2 /*return*/];
                    case 2:
                        this.setState({ croppedImageUrl: '', previewLoading: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 根据入参，生成图片，用于预览小图
     */
    AntdImageCropUpload.prototype.getCroppedImg = function (image, pixelCrop, targetImage, mimeType) {
        // 1. 计算画布的大小-targetImage 存在，说明有控制 裁剪裁剪后的文件的 w&h
        var targetWidth = pixelCrop.width;
        var targetHeight = pixelCrop.height;
        if (targetImage && targetImage.width && targetImage.height) {
            targetWidth = targetImage.width;
            targetHeight = targetImage.height;
        }
        var canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, targetWidth, targetHeight);
        // As Base64 string
        var base64Image = canvas.toDataURL(mimeType || 'image/jpeg');
        return base64Image;
    };
    ;
    /* ******************* 裁剪组件相关 end  **************** */
    AntdImageCropUpload.prototype.render = function () {
        var _a = this.props, children = _a.children, beforeUpload = _a.beforeUpload, imageOnly = _a.imageOnly, onChange = _a.onChange, initCrop = _a.initCrop, targetImage = _a.targetImage, modalProps = _a.modalProps, restProps = __rest(_a, ["children", "beforeUpload", "imageOnly", "onChange", "initCrop", "targetImage", "modalProps"]);
        var onCancel = modalProps.onCancel, onOk = modalProps.onOk, okButtonProps = modalProps.okButtonProps, resModalProps = __rest(modalProps, ["onCancel", "onOk", "okButtonProps"]);
        var _b = this.state, modalVisible = _b.modalVisible, crop = _b.crop, previewDataUrl = _b.previewDataUrl, fileList = _b.fileList, croppedImageUrl = _b.croppedImageUrl, _c = _b.imageRef, imageRef = _c === void 0 ? {} : _c, _d = _b.pixelCrop, pixelCrop = _d === void 0 ? {} : _d, previewLoading = _b.previewLoading;
        return (React.createElement(React.Fragment, null,
            React.createElement(antd_1.Upload, __assign({ accept: imageOnly ? 'image/*' : undefined }, restProps, { beforeUpload: this.handleBeforeUpload, fileList: fileList, onChange: this.handleChange, multiple: false }), children),
            React.createElement(antd_1.Modal, __assign({}, resModalProps, { visible: modalVisible, title: "\u88C1\u526A\u7167\u7247", width: 600, maskClosable: false, onCancel: this.handleCancel, onOk: this.handleOk, okButtonProps: __assign({}, okButtonProps, { loading: previewLoading, disabled: !croppedImageUrl }) }), previewDataUrl &&
                React.createElement(React.Fragment, null,
                    React.createElement(antd_1.Row, { type: "flex", gutter: 8, align: "top", justify: "space-between" },
                        React.createElement(antd_1.Col, { span: 18 },
                            React.createElement("div", null, "\u539F\u56FE\uFF1A"),
                            React.createElement(react_image_crop_1.default, { style: { maxHeight: '40vh' }, crop: crop, src: previewDataUrl, onImageLoaded: this.onImageLoaded, onComplete: this.onCropComplete, onChange: this.onCropChange }),
                            React.createElement("div", null, "X:" + imageRef.naturalWidth + " Y:" + imageRef.naturalHeight)),
                        React.createElement(antd_1.Col, { span: 6 },
                            React.createElement(antd_1.Spin, { spinning: previewLoading },
                                React.createElement("div", null, "\u9884\u89C8\uFF1A"),
                                croppedImageUrl && React.createElement("img", { src: croppedImageUrl, width: "100%", style: { border: '1px solid #888' } }),
                                React.createElement("div", null, targetImage && targetImage.width && targetImage.height ?
                                    "X:" + targetImage.width + " Y:" + targetImage.height :
                                    "X:" + pixelCrop.width + " Y:" + pixelCrop.height))))))));
    };
    AntdImageCropUpload.defaultProps = {
        modalProps: {},
        imageOnly: true,
        initCrop: {
            x: 0, y: 0, width: 50, height: 50
        }
    };
    return AntdImageCropUpload;
}(React.Component));
exports.default = AntdImageCropUpload;

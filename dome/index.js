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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var antd_1 = require("antd");
var index_1 = require("../index");
var Header = antd_1.Layout.Header, Content = antd_1.Layout.Content, Footer = antd_1.Layout.Footer;
// import 'antd/dist/antd.less'
// import './index.less';
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { fileList: [] };
        _this.handleChange = function (info) {
            console.log('info', info);
        };
        _this.handleBeforeUpload = function (file, fileList) {
            console.log('file', file, fileList);
            // this.setState({ fileList: [...this.state.fileList, file] });
            return false;
        };
        return _this;
    }
    App.prototype.render = function () {
        return (React.createElement(antd_1.Layout, null,
            React.createElement(Header, null, "header"),
            React.createElement(Content, null,
                React.createElement(index_1.default, { action: "//jsonplaceholder.typicode.com/posts/", 
                    // fileList={this.state.fileList || []}
                    imageOnly: false, onChange: this.handleChange, beforeUpload: this.handleBeforeUpload, listType: "picture-card" }, " add ")),
            React.createElement(Footer, null,
                React.createElement(antd_1.Upload, { action: "//jsonplaceholder.typicode.com/posts/", 
                    // fileList={this.state.fileList || []}
                    onChange: this.handleChange, beforeUpload: this.handleBeforeUpload, listType: "picture-card" }, " add 2 "))));
    };
    return App;
}(React.PureComponent));
ReactDOM.render(React.createElement(App, null), document.querySelector('#app'));

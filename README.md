###  AntdImageCropUpload
- 结合了 antd 的 Upload 组件和 react-image-crop

```js
    <!--使用方式和antd的Upload一致，仅在上传是增加图片的裁剪功能-->
    <AntdImageCropUpload> add </AntdImageCropUpload>
```
---
- 入参在Upload的基础上增加了一些

```js
export interface AntdImageCropUploadProps extends UploadProps {
  /** 裁剪前校验文件, 返回 false 则停止裁剪，不上传 */
  beforeCrop?: (file: RcFile, FileList: RcFile[]) => boolean;

  /** 裁剪框的初始参数 aspect: 是否固定裁剪框的比例 */
  initCrop?: {
    x: number; // 裁剪框坐标点
    y: number; 
    width?: number; // 裁剪框的大小 - （单位：%）
    height?: number;
    aspect?: number; // 宽高的比例 w / h (例如：320 / 280 )
  }
  
  /** 
   * 裁剪后的图片的物理宽高设置
   * 如果不设置则按原始尺寸的比例获取
   * 如果设置则裁剪后的图片将被拉伸为设置值
   * 注意，initCropp.aspect 会以targetImage设置的 w/h 为准
   */
  targetImage?: {
    width: number;
    height: number;
  }

  /** 
   * 是否只允许上传图片格式的文件
   * 默认为true，即只接受图片文件
   * 为false 时， 文件不经过裁剪，直接使用Upload的默认上传
   */
  imageOnly: boolean;

  /** 
   * 裁剪弹窗的props
   * props 中：visible， onOk， onCancel，okButtonProps 将受到控制
   */
  modalProps?: ModalProps;
}
```
---
### 注意！！！
- 组件不支持自定义上传！
> 如果 beforeUpload 返回 false，其效果跟返回 Promise.reject() 是一样的


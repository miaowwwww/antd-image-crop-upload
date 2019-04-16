import * as React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Upload,
  Modal,
  Row,
  Col,
  notification,
  Spin
} from 'antd';
import { AntdImageCropUploadProps, AntdImageCropUploadState } from './index.d';

/** 可以进行裁剪的图片格式 */ 
const ImageTypeReg = /.(jpg|jpeg|png|gif)$/i;
/** base64 转 blob */
const base64ToBlob = (urlData, type) => {
  let arr = urlData.split(',');
  let mime = arr[0].match(/:(.*?);/)[1] || type;
  // 去掉url的头，并转化为byte
  let bytes = window.atob(arr[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mime
  });
}
export default class AntdImageCropUpload extends React.Component<AntdImageCropUploadProps, AntdImageCropUploadState> {
  static defaultProps = {
    modalProps: {},
    imageOnly: true,
    initCrop: {
      x: 0, y: 0, width: 50, height: 50
    }
  };
  static getDerivedStateFromProps(nextProps) {
    if ('fileList' in nextProps) {
      return {
        fileList: nextProps.fileList || []
      };
    }
    return null;
  }
  resolve: any;
  reject: any;

  constructor(props) {
    super(props);
    const { initCrop, targetImage } = props;
    const initialCrop = { ...initCrop }
    if (targetImage && targetImage.width && targetImage.height) {
      initialCrop['aspect'] = targetImage.width / targetImage.height;
    }

    this.state = {
      initialCrop: initialCrop,
      fileList: [],
      oldFile: undefined,
      oldFileList: [],
      previewDataUrl: '',
      crop: initialCrop,
      modalVisible: false,
      pixelCrop: undefined,
      imageRef: undefined,  // 渲染后的img元素
      croppedImageUrl: undefined, // 裁剪后的文件的预览图
      previewLoading: false
    }
  }

  /** 用于判断使用怎么的修改方式，1. 使用Form更新，2. 在组件内更新 */
  triggerChange = (changedValue: any) => {
    // 1. 非控制组件，直接赋值
    if (!('fileList' in this.props)) {
      const { fileList } = changedValue;
      this.setState({ fileList });
    }
    // 2. 有onChange不一定是控制组件
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  handleChange = info => {
    // console.log('crop compnent handleChange', info);
    this.triggerChange(info);
  }

  /** 在上传前对文件进行裁剪， 使用返回 Promise 的方式 */
  handleBeforeUpload = (file, fileList) => {
    console.log('init beforeupload', file, fileList);
    const { imageOnly, beforeUpload } = this.props;
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
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      // console.log('======handleBeforeUpload', file, fileList);

      /** 上传了不允许裁剪的图片 */
      if (!ImageTypeReg.test(file.name)) {
        notification.error({message: '错误', description: '该文件不允许裁剪'})
        this.reject();
        return;
      }

      /**
       * 裁剪前校验图片
       * 1. 返回的是 false， 则不进行裁剪，
       * 2. 同时 beforeCrop 中应该在 fileList 进行剔除，或相应的 file.status = 'error' 的赋值
       */
      const { beforeCrop } = this.props;
      if (beforeCrop && beforeCrop(file, fileList) === false) {
        this.reject();
        return;
      }

      /** 
       * 读取条件的图片，然后给 react-image-crop
       * 1. setState previewDataUrl 后触发 onImageLoaded
       * 2. 最终在 handleModal 中 执行 this.resolve()
       */
      const reader = new FileReader();
      reader.onload = e => {
        this.setState({
          oldFile: file,
          oldFileList: fileList,
          previewDataUrl: e.target['result'],
          modalVisible: true
        });
      };
      reader.readAsDataURL(file);
    })
  }

  handleCancel = () => {
    this.reject = undefined;
    this.resolve = undefined;
    this.setState({
      modalVisible: false,
      crop: this.state.initialCrop,
      previewDataUrl: '',
      pixelCrop: {},
      oldFile: [],
      oldFileList: []
    });
  }

  handleOk = async () => {
    const {
      oldFile,
      oldFileList,
      croppedImageUrl
    } = this.state;

    // 1. base64 转成 blob -- 为什么一开始不是blob，因为blob不能直接预览
    const blob: any = base64ToBlob(croppedImageUrl, oldFile.type);
    // 2. 生成新的图片文件
    const { name, type, uid } = oldFile;
    const croppedFile: any = new File([blob], name, { type, lastModified: Date.now() });
    croppedFile['uid'] = uid;

    // 3. 回归Upload组件，开始上传
    // 3.1 beforeUpload - 为空， 返回 boolean，返回undefined， 返回 Promise
    const { beforeUpload } = this.props;
    if (!beforeUpload) {
      this.resolve(croppedFile);
      this.handleCancel();
      return;
    }

    const newFileList = oldFileList.reduce((pre, cur) => {
      pre.push(cur.uid === uid ? croppedFile : cur);
    }, []);
    const result: any = beforeUpload(croppedFile, newFileList);
    if (result === false) {
      this.reject();
      this.handleCancel();
      return;
    }

    // Upload 组件中 undefined 与 true 返回的是一样的效果
    if (result === undefined || result) {
      this.resolve(croppedFile);
      this.handleCancel();
      return;
    }

    // promise 具有 then 方式
    if (!result.then) {
      this.resolve(croppedFile);
      this.handleCancel();
      return;
    }

    try {
      const resolvedFile = await result;
      const fileType = Object.prototype.toString.call(resolvedFile);
      if (fileType === '[object File]' || fileType === '[object Blob]') {
        this.resolve(resolvedFile);
      } else {
        this.resolve(croppedFile);
      }
      this.handleCancel();
    } catch (err) {
      this.reject(err);
    }
  }

  /* ******************* 裁剪组件相关 start **************** */
  /**
   * 1. 图片加载完成时，自动执行
   * @param image 渲染出来的 img 标签元素
   * @param pixelCrop 根据 this.state.crop 计算出来的 真实图片的物理位置
   */
  onImageLoaded = (image, pixelCrop) => {
    // console.log('======onImageLoaded', this.state.crop, pixelCrop);
    this.setState({
      imageRef: image,
      pixelCrop,
      previewLoading: true
    }, () => {
      this.makeClientCrop(this.state.crop, pixelCrop);
    });
  }

  /**
   * 2. 裁剪框变化时，自动执行
   * 需要不动更新crop，用于匹配当前的裁剪框位置
   */
  onCropChange = crop => {
    // 如果在裁剪范围内点击一下，得到的裁剪 width height 都为 0，不允许这种情况
    if (!crop.width || !crop.height) return;
    this.setState({ crop });
  }

  // 3. 根据拖拽框的位置crop计算出，最终图片需要裁剪的位置 pixelCrop，
  /**
   * 3. 停止 onCropChange后，自动执行
   * 根据传入的 crop 自动计算新的 pixelCrop 
   */
  onCropComplete = (crop, pixelCrop) => {
    // 因为 onCropChange 已经控制了不可为 0 ，所以这里是不需要的。避免初始化时为 0 
    if (!crop.width || !crop.height) return;
    // console.log('======onCropComplete', crop, pixelCrop);
    this.setState({
      crop,
      pixelCrop,
      previewLoading: true
    }, () => {
      this.makeClientCrop(crop, pixelCrop);
    });
  }

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
  async makeClientCrop(crop, pixelCrop) {
    const { targetImage } = this.props;
    const { imageRef, oldFile } = this.state;
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl: any = await this.getCroppedImg(
        imageRef,
        pixelCrop,
        targetImage,
        oldFile.type
      );
      this.setState({ croppedImageUrl, previewLoading: false });
      return;
    }
    this.setState({ croppedImageUrl: '', previewLoading: false });
    return;
  }

  /**
   * 根据入参，生成图片，用于预览小图
   */
  getCroppedImg(image, pixelCrop, targetImage, mimeType) {
    // 1. 计算画布的大小-targetImage 存在，说明有控制 裁剪裁剪后的文件的 w&h
    let targetWidth = pixelCrop.width;
    let targetHeight = pixelCrop.height;
    if (targetImage && targetImage.width && targetImage.height) {
      targetWidth = targetImage.width;
      targetHeight = targetImage.height;
    }
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // As Base64 string
    const base64Image = canvas.toDataURL(mimeType || 'image/jpeg');
    return base64Image;
  };
  /* ******************* 裁剪组件相关 end  **************** */

  public render() {
    const { children, beforeUpload, imageOnly, onChange, initCrop, targetImage, modalProps, ...restProps } = this.props;
    const { onCancel, onOk, okButtonProps, ...resModalProps } = modalProps;
    const {
      modalVisible, crop,
      previewDataUrl,
      fileList, croppedImageUrl, imageRef = {}, pixelCrop = {},
      previewLoading
    } = this.state;
    return (
      <React.Fragment>
        <Upload
          accept={imageOnly ? 'image/*' : undefined}
          {...restProps}
          beforeUpload={this.handleBeforeUpload}
          fileList={fileList}
          onChange={this.handleChange}
          multiple={false}
        >
          {children}
        </Upload>
        <Modal
          {...resModalProps}
          visible={modalVisible}
          title="裁剪照片"
          width={600}
          maskClosable={false}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          okButtonProps={{
            ...okButtonProps,
            loading: previewLoading,
            disabled: !croppedImageUrl
          }}
        >
          {
            previewDataUrl &&
            <React.Fragment>
              <Row type="flex" gutter={8} align="top" justify="space-between" >
                <Col span={18}>
                  <div>原图：</div>
                  <ReactCrop
                    style={{ maxHeight: '40vh' }}
                    crop={crop}
                    src={previewDataUrl}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  // onDragStart={this.onDragStart}
                  // onDragEnd={this.onDragEnd}
                  />
                  <div>{`X:${imageRef.naturalWidth} Y:${imageRef.naturalHeight}`}</div>
                </Col>
                <Col span={6}>
                  <Spin spinning={previewLoading}>
                    <div>预览：</div>
                    {croppedImageUrl && <img src={croppedImageUrl} width="100%" style={{ border: '1px solid #888' }} />}
                    <div>
                      {
                        targetImage && targetImage.width && targetImage.height ?
                          `X:${targetImage.width} Y:${targetImage.height}` :
                          `X:${pixelCrop.width} Y:${pixelCrop.height}`
                      }
                    </div>
                  </Spin>
                </Col>
              </Row>
            </React.Fragment>
          }
        </Modal>
      </React.Fragment>
    );
  }
}

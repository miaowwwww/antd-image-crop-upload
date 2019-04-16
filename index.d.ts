import * as React from 'react';
import { AntdImageCropUploadProps, AntdImageCropUploadState } from './src/index.d';
import { UploadProps, RcFile, UploadFile } from 'antd/lib/upload/interface.d';
import { ModalProps } from 'antd/lib/modal';
declare class AntdImageCropUpload extends React.Component<AntdImageCropUploadProps, AntdImageCropUploadState> {
  static defaultProps: {
    modalProps: ModalProps;
    imageOnly: boolean;
    initCrop: any;
};
  resolve: Promise<any>;
  reject: Promise<any>;
  render(): JSX.Element;
}
export default AntdImageCropUpload;
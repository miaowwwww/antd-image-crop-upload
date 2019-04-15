import { UploadProps, RcFile, UploadFile } from 'antd/lib/upload/interface.d';
import { ModalProps } from 'antd/lib/modal';
export interface AntdImageCropUpload extends UploadProps {
  /** 裁剪前校验文件, 返回 false 则停止裁剪，不上传 */
  beforeCrop?: (file: RcFile, FileList: RcFile[]) => boolean;
  /** 裁剪框的初始参数 aspect: 是否固定裁剪框的比例 */
  initCrop?: {
    x: number; y: number; width?: number; height?: number; aspect?: number;
  }
  /** 
   * 如果存在targetImage, 则。自动重新计算 initCrop.aspect
   * 同时导出的图片的物理宽高被拉伸为 targetImage 设置的值
   */
  targetImage?: {
    width: number;
    height: number;
  }
  /** 是否值允许上传图片格式的文件 */
  imageOnly: boolean;
  /** antd modal 的 props
   * props 中：visible， onOk， onCancel，okButtonProps 将受到控制
   */
  modalProps?: ModalProps;
}
export default AntdImageCropUpload;
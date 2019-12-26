import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout, Upload } from 'antd';

import AntdImageCropUpload from '../index';

const { Header, Content, Footer } = Layout;
// import 'antd/dist/antd.less'

// import './index.less';
class App extends React.PureComponent {
  state = { fileList: []};
  handleChange = info => {
    console.log('info', info);
  }
  handleBeforeUpload = (file, fileList) => {
    console.log('file', file, fileList);
    // this.setState({ fileList: [...this.state.fileList, file] });
    return false;
  }

  render() {
    return (
      <Layout>
        <Header>header</Header>
        <Content>
          <AntdImageCropUpload
            action="//jsonplaceholder.typicode.com/posts/"
            // fileList={this.state.fileList || []}
            imageOnly={false}
            onChange={this.handleChange}
            beforeUpload={this.handleBeforeUpload}
            listType="picture-card"
          > add </AntdImageCropUpload>
        </Content>
        <Footer>
          <Upload
           action="//jsonplaceholder.typicode.com/posts/"
            // fileList={this.state.fileList || []}
            onChange={this.handleChange}
            beforeUpload={this.handleBeforeUpload}
            listType="picture-card"
          > add 2 </Upload>
        </Footer>
      </Layout>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
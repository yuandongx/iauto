/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { Layout, Icon } from 'antd';
import styles from './layout.module.css';


export default class extends React.Component {
  render() {
    return (
      <Layout.Footer style={{padding: 0}}>
        <div className={styles.footerZone}>
          <div className={styles.linksZone}>
            <a className={styles.links} title="Github" href="https://github.com/yuandongx/iauto"  target="_blank"
               rel="noopener noreferrer"><Icon type="github" /></a>
          </div>
          <div style={{color: 'rgba(0, 0, 0, .45)'}}>
            Copyright <Icon type="copyright"/> 2020 By Iauto
          </div>
        </div>
      </Layout.Footer>
    )
  }
}

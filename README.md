<h1 align="center">Iauto</h1>

<div align="center">

I-auto是面向中小型企业设计的轻量级无Agent的自动化运维平台，整合了主机管理、主机批量执行、主机在线终端、应用发布部署、在线任务计划、配置中心、监控、报警等一系列功能。

</div>



## 特性

- **批量执行**: 主机命令在线批量执行
- **在线终端**: 主机支持浏览器在线终端登录
- **文件管理**: 主机文件在线上传下载
- **任务计划**: 灵活的在线任务计划
- **发布部署**: 支持自定义发布部署流程
- **配置中心**: 支持KV、文本、json等格式的配置
- **监控中心**: 支持站点、端口、进程、自定义等监控
- **报警中心**: 支持短信、邮件、钉钉、微信等报警方式
- **优雅美观**: 基于 Ant Design 的UI界面
- **开源免费**: 前后端代码完全开源


## 环境

* Python 3.6+
* Django 3.0+
* Node 12.14
* React 16.11
* Redis 6.0+

## 服务安装运行 (二选一)
### docker-compose up 一键启动服务
* 首先安装dokcer,请参考[docker安装](https://docs.docker.com/engine/install/)；
* 安装python3、pip；
* pip install docker-compose；
* cd到源码中docker-compose.yml文件所在的路径下， 执行命令：docker-compose [-d] up；
* 等待服务起来即可访问`http://127.0.0.1:3000`，默认端口是3000，可在docker-compose中修改。

### 手动一步步安装
* [首先安装Nodejs](https://github.com/nodejs/help/wiki/Installation)；
* 安装python3、pip；
* 安装Django `pip install django`；
* [安装Redis](https://redis.io/)；
* cd 到`./iauto/api/`路径下，`pip install -r requirements.txt`安装python包依赖；
* cd 到`./iauto/web/`路径下，`npm install`安装js依赖包；
* cd 到`.iauto/api/tools/`路径下，后台执行每一个shell脚本，启动相关服务；
* cd 到`./iauto/web/`路径下，`npm start`，启动前端服务。
* 等待服务起来即可访问`http://127.0.0.1:3000`，默认端口是3000，可在docker-compose中修改。
##### 推荐docker-compose up 一键启动服务，省时省心，操作简单，方便管理，灵活便捷。
## RF 商城 3.0 - 前端

### 前言

基于 [RageFrame3](https://github.com/jianyan74/rageframe3) 的一款免费开源的基础销售功能的商城，前端基于 uni-app，一端发布多端通用, 使用了 `vue3`, `vite4`, `typescript`, `javascript` 等主流开发技术。
### 项目地址

前端开源地址: [https://github.com/jianyan74/TinyShop-UniApp](https://github.com/jianyan74/TinyShop-UniApp)

后端开源地址: [https://github.com/jianyan74/TinyShop](https://github.com/jianyan74/TinyShop)

Uni-App插件地址: [https://ext.dcloud.net.cn/plugin?id=13865](https://ext.dcloud.net.cn/plugin?id=13865)

### B2C-Demo

H5 预览: http://v3.h5.b2c.rageframe.com/  
后台预览: https://v3.b2c.rageframe.com/backend/    
账号: test   
密码: 123456

### B2B2C-Demo

【总后台】  
H5 预览: http://v3.h5.b2b2c.rageframe.com/  
后台预览: https://v3.b2b2c.rageframe.com/backend/   
账号: test   
密码: 123456

【商家端】  
后台预览: https://v3.b2b2c.rageframe.com/merchant/  
账号: test  
密码: 123456

### 小程序 Demo

![image](https://s1.ax1x.com/2023/08/01/pP9v98e.jpg)

### 安装说明

1、安装相关依赖, 默认已拥有node环境

```
// 安装yarn命令
npm i -g yarn
// 安装依赖
yarn
```

2. 运行到指定平台

```
// 运行到H5
yarn serve
// 运行至对应的小程序平台
yarn dev:PLATFORM
```

值 | 平台
---|---
h5 | H5
mp-weixin | 微信小程序
mp-alipay | 支付宝小程序
mp-baidu | 百度小程序
mp-toutiao | 头条小程序
mp-qq | qq 小程序


3. 打包至线上部署
```
// H5打包
yarn build
yarn build:PLATFORM // 平台信息同上
```
使用对应的小程序客户端进行发布。

4、发布uni-app(打包为原生App云端)

配合HBuilderX使用

> 注： H5 除主页外刷新页面会出现 404 需配置 nginx 伪静态

```
location / {
    try_files $uri $uri/ /index.html;
}
```

### 官网

http://www.rageframe.com

### 问题反馈

在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我们交流

QQ群1：[655084090](https://jq.qq.com/?_wv=1027&k=4BeVA2r) (2000人快满)  
QQ群2：[1148015133](https://jq.qq.com/?_wv=1027&k=Wk663e9N) (新群)

### 特别鸣谢

感谢以下的项目，排名不分先后

Vuejs： https://github.com/vuejs/vue

uni-app： https://uniapp.dcloud.io/

...

### 版权信息

RF商城 遵循 [Apache2](LICENSE.md) 开源协议并 [附加使用协议](LICENSE-SUPPLEMENTAL.md) 发布，并提供商用免费使用。

本项目包含的第三方源码和二进制文件之版权信息另行标注。

版权所有Copyright © 2016-2023 by RageFrame [www.rageframe.com](http://www.rageframe.com)

All rights reserved。

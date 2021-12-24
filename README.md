# ICE WebSDK 前后端一体 demo

## 1. 安装打包前端资源

```bash
cd fe
npm install
npm run build
```

## 2. 选择一个服务端并运行

### 2.1 使用 Java 服务端
先使用软链接将前端打包后的资源链接到 java 目录下

```bash
ln -s "$(pwd)/fe" java/application/src/main/resources
```

在 java/application/src/main/java/demo/controller/OpenApiController.java 中填写自己的 AK、SK

将工程导入 eclipse 或者 idea 等IDE后，直接执行包含 main 方法的类 `demo.Application`

注意：不要将整个 ICE_WEBSDK_demos 文件夹导入IDE，仅需导入 ICE_WEBSDK_demos/java 文件夹

浏览器打开 http://localhost:7001/ 

具体使用说明请参考 java/README.md

### 2.2 使用 Node.js 服务端
先使用软链接将前端打包后的资源链接到 nodejs 目录下，然后安装依赖

```bash
ln -s "$(pwd)/fe" nodejs
cd nodejs
npm install
```

在 nodejs/config/config.default.js 中填写自己的 AK、SK

使用 `npm run dev` 运行应用

浏览器打开 http://localhost:7001/ 即可
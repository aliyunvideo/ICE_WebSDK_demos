## Websdk Demo Page 使用说明及限制
* 本 demo 使用 spring-boot
* 本地测试网址: http://localhost:7001/，首页为工程列表页，用户可选择对应工程进行在线剪辑.
* 使用者需在OpenApiController中填写自己的ak，sk，全局搜索 "Todo modify" 进行更改.


## 目录结构
* application，包含启动类`demo.Application`。日志配置文件为`src/main/resources`目录下的logback-spring.xml。
velocity模板在`/src/main/resources/velocity/templates`目录中。

## 使用方式
### 在开发工具中执行
将工程导入eclipse或者idea后，直接执行包含main方法的类`demo.Application`。

### 使用java -jar的方式
首先执行下列命令打包
   
```sh
mvn package
```

然后进入`application/target`目录，执行以下命令

```sh
java -jar target/application-1.0-SNAPSHOT.jar
```

### 通过mvn命令直接启动
第一次调用前先要执行

```sh
mvn install
```

如果maven工程的Artifact，group id，version等都未变化，只需执行一次即可。

然后直接通过mvn命令启动工程

```sh
mvn spring-boot:run
```
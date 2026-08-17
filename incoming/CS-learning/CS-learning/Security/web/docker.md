## 一、 基本概念与架构

Docker 采用 C/S（客户端-服务端）架构。

- **Docker Daemon（守护进程）：** 运行在宿主机上，负责构建、运行和分发 Docker 容器。
    
- **Docker Client（客户端）：** 用户与 Docker 交互的命令行工具（CLI），将指令发送给 Daemon。
    
- **Image（镜像）：** 静态的、只读的文件和环境配置模板。包含运行应用所需的代码、运行库、环境变量和配置文件。
    
- **Container（容器）：** 镜像的运行实例。带有可写层，可以被启动、开始、停止、删除。容器之间相互隔离。
    
- **Registry（仓库）：** 存放镜像的场所。最著名的是官方的 Docker Hub。
    

## 二、 镜像管理命令 (Image)

- **搜索镜像：** `docker search <image_name>`
    
- **拉取镜像：** `docker pull <image_name>:<tag>` (不加 tag 默认拉取 `latest` 最新版)
    
- **查看本地镜像：** `docker images` 或 `docker image ls`
    
- **删除镜像：** `docker rmi <image_id>` 或 `docker rmi <image_name>:<tag>`
    
- **导出镜像为压缩包：** `docker save -o <file.tar> <image_name>`
    
- **从压缩包加载镜像：** `docker load -i <file.tar>`
    
- **打标签：** `docker tag <source_image>:<tag> <target_image>:<tag>`
    

## 三、 容器管理命令 (Container)

### 1. 运行容器

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

**常用参数（OPTIONS）：**

- `-d`: 后台运行容器并返回容器 ID (Detached)。
    
- `-it`: `-i` 保持标准输入打开，`-t` 分配一个伪终端。常用于进入交互式容器。
    
- `--name`: 为容器指定一个自定义名称。
    
- `-p`: 端口映射。格式为 `宿主机端口:容器内部端口` (例如 `-p 8080:80`)。
    
- `-v`: 挂载数据卷。格式为 `宿主机目录:容器目录` (例如 `-v /host/data:/container/data`)。
    
- `--rm`: 容器停止后自动删除，常用于测试。
    

### 2. 生命周期与运维

- **查看运行中的容器：** `docker ps`
    
- **查看所有容器（含停止的）：** `docker ps -a`
    
- **启动/停止/重启容器：** `docker start|stop|restart <container_id>`
    
- **删除容器：** `docker rm <container_id>` (加 `-f` 强制删除运行中的容器)
    
- **进入运行中的容器：** `docker exec -it <container_id> /bin/bash` (或 `sh`)
    
- **查看容器日志：** `docker logs -f <container_id>` (`-f` 表示实时跟踪)
    
- **查看容器内部详情：** `docker inspect <container_id>`
    

## 四、 数据持久化 (Data Management)

容器内部的数据是临时的，容器删除后数据会丢失。Docker 提供两种主要的数据持久化方式：

1. **Volumes（数据卷）**
    
    - 由 Docker 完全管理的宿主机文件系统的一部分（通常在 `/var/lib/docker/volumes/` 下）。
        
    - 创建卷：`docker volume create <volume_name>`
        
    - 使用卷：`docker run -v <volume_name>:/container/path ...`
        
2. **Bind Mounts（绑定挂载）**
    
    - 将宿主机上的绝对路径直接映射到容器内。依赖宿主机的特定目录结构。
        
    - 使用挂载：`docker run -v /absolute/path/on/host:/container/path ...`
        

## 五、 网络模式 (Networking)

- **Bridge（桥接模式 - 默认）：** 为容器分配独立 IP，连接到 `docker0` 虚拟网桥。容器与宿主机、容器与容器之间可以通过 IP 通信。
    
- **Host（主机模式）：** 容器与宿主机共享 Network Namespace，容器不分配独立 IP 和端口，直接使用宿主机的网络。性能极高，但端口容易冲突。
    
- **None（无网络模式）：** 容器有独立的 Network Namespace，但不进行任何网络配置，处于断网状态。
    
- **自定义网络：** 推荐用于容器间通信，支持通过**容器名称**直接解析 IP。
    
    - 创建网络：`docker network create <network_name>`
        
    - 使用网络：`docker run --network <network_name> ...`
        

## 六、 Dockerfile (镜像构建)

Dockerfile 是用于自动化构建镜像的文本文件。

### 核心指令集

| **指令**       | **说明**    | **注意事项**                                                                        |
| ------------ | --------- | ------------------------------------------------------------------------------- |
| `FROM`       | 指定基础镜像    | 必须是 Dockerfile 的第一条非注释指令。                                                       |
| `WORKDIR`    | 指定工作目录    | 类似 `cd`，后续的 RUN, CMD 等都在此目录下执行。                                                 |
| `COPY`       | 复制文件      | 将宿主机文件复制到容器内。                                                                   |
| `ADD`        | 复制文件并自动解压 | 包含 COPY 功能，且支持解压 `.tar` 文件和拉取 URL 文件（不推荐拉取URL）。                                 |
| `RUN`        | 构建时执行命令   | 用于安装软件、修改配置等。**建议多个命令用 `&&` 合并为一层，减少镜像体积。**                                     |
| `ENV`        | 设置环境变量    | 构建期和运行期都有效。                                                                     |
| `EXPOSE`     | 声明暴露端口    | 仅做声明，方便运维人员阅读，不会真正自动映射端口。                                                       |
| `CMD`        | 容器启动时默认命令 | 可被 `docker run` 后面的命令行参数**覆盖**。在结合 ENTRYPOINT 使用时，CMD 定义的内容会作为参数传递给 ENTRYPOINT。 |
| `ENTRYPOINT` | 容器启动时的入口点 | 不会被覆盖。常用于指定初始化环境的入口脚本，脚本执行完前置逻辑后，通常使用 `exec "$@"` 接收 CMD 传来的参数并启动主服务。           |

**构建命令：** `docker build -t <image_name>:<tag> .` (注意最后的 `.` 代表当前上下文目录)

## 七、 Docker Compose (多容器编排)

**基础模板 (`docker-compose.yml` 独立构建模式)：**

```yaml
services:
  web:
    build: . # 不直接使用线上 Image，而是基于当前目录的 Dockerfile 实时构建
    environment:
      GZCTF_FLAG: flag{test} # 向容器注入环境变量，CTF 中常用于动态 Flag 的下发
    ports:
      - "8080:80" # 宿主机端口:容器内端口映射
```

**常用命令 (基于新版 Docker Compose v2 语法)：**

- **构建并后台启动所有服务：** `docker compose up -d --build` （带上 `--build` 参数，以确保修改本地源码、Dockerfile 或权限配置后，能够强制重新打包镜像生效）。
    
- **停止并彻底清理环境：** `docker compose down` （停止容器并自动删除对应的虚拟网络，保持宿主机环境整洁）。
    
- **查看服务实时日志：** `docker compose logs -f`
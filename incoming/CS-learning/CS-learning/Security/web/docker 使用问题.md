**原生网络下代理漏穿导致持续超时**

- **现象：** `Head "[https://registry-1.docker.io](https://registry-1.docker.io)... i/o timeout"`。
    
- **根因分析：** 即使开启了全局/镜像代理，WSL2 环境下的 systemd 后台服务（Docker Daemon）在执行 DNS 解析与路由时，仍可能发生代理漏穿，尝试直连被墙的官方源。
    
- **解决方案：** 绕过直连，强制配置国内镜像加速策略。
    
    ```bash
    sudo mkdir -p /etc/docker
	
	cat <<EOF | sudo tee /etc/docker/daemon.json
	{
	  "registry-mirrors": [
	    "https://docker.m.daocloud.io",
	    "https://dockerpull.com",
	    "https://docker.nju.edu.cn"
	  ]
	}
	EOF
	
	sudo systemctl restart docker
    ```


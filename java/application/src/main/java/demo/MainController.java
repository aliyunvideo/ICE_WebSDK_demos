package demo;

import com.alibaba.boot.velocity.annotation.VelocityLayout;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Spring Mvc的根路径、健康检查等。
 * <p>
 * 其中使用了velocity，@VelocityLayout声明了页面使用的layout。
 * 
 * @author chengxu
 */
@Controller
public class MainController {

    @GetMapping("/")
    @VelocityLayout("/fe/build/index.html")
    public String root() {
        return "index";
    }

    @GetMapping("/security")
    public String displaySecurity() {
        return "security/security";
    }

    /**
     * 健康检查，系统部署需要
     * 请不要删除！！
     */
    @GetMapping("/checkpreload.htm")
    public @ResponseBody String checkPreload() {
        return "success";
    }
}

package demo.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import com.aliyun.ice20201109.Client;
import com.aliyun.tea.TeaConverter;
import com.aliyun.tea.TeaPair;
import com.aliyun.teaopenapi.models.Config;
import com.aliyun.teaopenapi.models.OpenApiRequest;
import com.aliyun.teautil.models.RuntimeOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 处理前端对于openAPI的调用
 * @author yangzixuan
 * @date 2021/6/16
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class OpenApiController {

    private static final Logger logger = LoggerFactory.getLogger(OpenApiController.class);

    private Client iceClient;

    @PostConstruct
    public void init() {

        Config config = new Config();
        // Todo Modify
        config.accessKeyId = "<your access key>";
        config.accessKeySecret = "<your secret key>";
        config.endpoint = "ice.cn-shanghai.aliyuncs.com";
        config.regionId = "cn-shanghai";

        try {
            iceClient = new Client(config);
        } catch (Exception e) {
            e.printStackTrace();
        }

        logger.info("Initialize client for Service: ice, endpoint: ice.cn-shanghai.aliyuncs.com");

    }

    /**
     * 处理前端发送的post请求
     * @param httpRequest
     * @return
     * @throws Exception
     */
    @RequestMapping("/openApiPost")
    public @ResponseBody
    Object handlerPostOpenApiRequest(@RequestBody Map<String, String> httpRequest) throws Exception {
        String action = (String)httpRequest.get("Action");
        httpRequest.remove("Action");

        RuntimeOptions runtime = new RuntimeOptions();
        OpenApiRequest req = OpenApiRequest.build(TeaConverter.buildMap(new TeaPair[]{new TeaPair("body", httpRequest)}));
        Map<String, ?> response = iceClient.doRPCRequest(action, "2020-11-09", "HTTPS", "POST", "AK", "json", req,
            runtime);
        return response.get("body");
    }

    /**
     * 处理前端发送的get请求
     * @param httpRequest
     * @return
     * @throws Exception
     */
    @RequestMapping("/openApi")
    public @ResponseBody Object handlerOpenApiRequest(HttpServletRequest httpRequest) throws Exception {

        String action = httpRequest.getParameter("Action");

        Map<String, String[]> paramMap = httpRequest.getParameterMap();

        Map<String, String> queryMap = new HashMap<>();
        for (String key : paramMap.keySet()) {
            queryMap.put(key, httpRequest.getParameter(key));
        }
        queryMap.remove("Action");
        RuntimeOptions runtime = new RuntimeOptions();
        OpenApiRequest req = OpenApiRequest.build(TeaConverter.buildMap(new TeaPair[]{new TeaPair("query", queryMap)}));
        Map<String, ?> response2 = iceClient.doRPCRequest(action, "2020-11-09", "HTTPS", "GET", "AK",
            "json",req, runtime);

        return response2.get("body");

    }
}

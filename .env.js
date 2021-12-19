var EnvChannel  = {
    DEVELOPMENT:0, //开发环境
    TEST:1,//测试环境
    PRODUCTION:2//生产环境
}

//设置环境
const ENV_CHANNEL = EnvChannel.PRODUCTION;

if(ENV_CHANNEL == EnvChannel.DEVELOPMENT){
    //开发环境
    ENV_CONFIG = require('.env.dev.js');
}else if(ENV_CHANNEL == EnvChannel.TEST){
    //测试环境
    // ENV_CONFIG = require('.env.test.js');
}else if(ENV_CHANNEL == EnvChannel.PRODUCTION){
    //生产环境
    ENV_CONFIG = require('.env.prod.js');
}
 
//给环境变量process.uniEnv赋值
if (ENV_CONFIG) {
    process.uniEnv = {};
    for (let key in ENV_CONFIG) {
        process.uniEnv[key] = ENV_CONFIG[key];
    }
}
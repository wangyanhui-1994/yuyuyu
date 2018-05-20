import RestTemplate from '../../middlewares/RestTemplate';

class FishIdentifyModel{

    // 获取鱼儿乐信息
    postFishIdentify (data, callback){
        RestTemplate.post(
            'userInfo/yu2le',
            {},
            {},
            data,
            callback
        );
    }
}

const fishIdentifyModel = new FishIdentifyModel();
export default fishIdentifyModel;

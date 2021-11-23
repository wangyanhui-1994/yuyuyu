import nativeEvent from '../utils/nativeEvent';

const configs = {
    debug: false,
    /*
     *release branch change the api url to http://api.yudada.com
     */
    url: nativeEvent['getAPi']() || 'https://api.t.yudada.com/',
    // url: 'https://10.228.17.28:8080/',
    backgroundImgUrl: './img/app_icon_108.png',
    timeout: 15000, // api timeout, unit: ms
    pageSize: 20,
    cacheMaxLen: 80,
    voiceCodeWaitTime: 60, // unit: m
    cacheUserInfoKey: 'userInfo',
    cacheHistoryKey: 'serachHistory',
    shareUrl: 'https://m.t.yudada.com/demandInfo/',
    cancelInvitationNumberKey: 'cancelInvitationNumber',
    inviteInfoKey: 'inviteInfo',
    waitAddPointerKey: 'waitAddPointer',
    infoNumberKey: 'infoNumber',
    cacheClassKey: 'classHistory',
    cacheStudyInfoKey: 'studyInfo',
    cacheMedalInfoKey: 'medalInfo',
    getMedalKey: 'getMedal',
    newsModalKey: 'guaranteeModel',
    fishCacheObj: {
        fishCacheKey: 'selectFishCache',
        maxLength: 10
    },
    /*
     *release branch change the url to http://m.yudada.com
     */
    mWebUrl: 'https://m.t.yudada.com/',
    imgPath: (num) => {
        return `@1e_1c_2o_0l_${num * 10}h_${num * 10}w_90q.src`;
    },

    identity: {
        individual: '@70h_107w_1e_1c_2o',
        company: '@90h_345w_1e_1c_2o',
        catCompany: '@190h_345w_1e_1c_2o'
    },
    servicePhoneNumber: '18115381185',
    demandInfo: {
        'list': [
            'fishTypeId',
            'cityId',
            'type',
            'fuzzyFishTypeName',
            'pageSize',
            'pageNo',
            'member',
            'fishTagId'
        ],
        'listFiltered': ['userId', 'pageSize', 'pageNo', 'type', 'state'],
        'getFishTypeList/100': ['keyvalue'],
        'getDemandInfo': ['id'],
        'userAddDemandInfo': [],
        'getMyDemandInfoList': ['userId', 'pageSize', 'pageNo', 'type'],
        'deleteDemandInfo': ['id'],
        'dealList': ['pageNo', 'pageSize'],
        'refreshLog': ['demandInfoId', 'action'],
        'mine': ['pageSize', 'pageNo', 'type'],
        'personalHome': ['userId']
    },
    fishType: {
        'getChildrenFishTypeList': ['id', 'release', 'type', 'keyvalue'],
        'tags': []
    },
    userLogin: {
        'subUserPass': ['phone_code', 'key'],
        'login': ['loginName', 'loginPass']
    },
    userInfo: {
        'getUserInfo': ['login_token'],
        // 'getUserCertificate': ['id'],
        'updateEnterpriseUserInfo': ['businessLicenseUrl'],
        'updatePersonalUserInfo': ['positiveIdUrl', 'otherSideIdUrl', 'holdIdUrl'],
        'updateUserInfo': ['id', 'nickname', 'imgUrl', 'address', 'provinceId', 'cityId', 'provinceName', 'cityName'],
        'getUserCertificate': ['userId'],
        'cancelPersonalAuthentication': [],
        'cancelEnterpriseAuthentication': [],
        'getUserFishCertificateList': [],
        'addUserFishCertificate': ['path', 'fishTypeName', 'fileSize'],
        'deleteUserFishCertificate': ['id']
    },
    auth: ['token'],
    inviteter: ['code'],
    demandInfoAdd: [],
    phoneCode: ['phone', 'type'],
    invite: {
        'users': ['pageSize', 'pageNo', 'userId']
    },
    favorite: {
        demandInfoList: ['token', 'pageSize', 'pageNo', 'demandType'],
        demandInfo: []
    },
    /*
     * 解绑微信号
     * */
    thirdPlatform: {
        'weChat': []
    },
    initPage: ['key', 'v'],
    /*
     * 获取第三方账号信息列表
     * */
    thirdPlatforms: {
        mine: []
    },
    /**
     * 鱼车相关
     * */
    fishCars: ['provinceId', 'pageSize', 'pageNo'],
    fishCarDriverDemands: ['destinationProvinceId', 'pageSize', 'pageNo'],
    postFishCars: [],
    fishCarDemands: ['departureProvinceId', 'pageSize', 'pageNo'],
    fishCarDrivers: ['driverId']
};
export default configs;

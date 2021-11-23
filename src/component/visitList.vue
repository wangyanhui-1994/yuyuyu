<template>
<div class="list-block visit-info">
    <div class="pull-to-refresh-layer ">
        <div class="preloader "></div>
        <div class="pull-to-refresh-arrow"></div>
    </div>
    <div class="list-box" v-if="visitList && visitList.length">
        <a :href="'views/otherIndex.html?id=' + item.userId + '&currentUserId=' + item.userId" v-for="item in visitList" class="item-content">
            <div class="item-media">
                <img :src="headUrl(item.imgUrl)" alt="头像" class="lazy">
            </div>
            <div class="item-inner">
                <div class="inner-content">               
                        <div class="rec-user-name">
                            <div class="user-name-box" :class="'name-padding-'+item.level">
                                <span class="user-name-title">{{item.nickname||'匿名用户'}}</span>
                                <span class="level-box">
                                    <span class="user-level-star">
                                        <i class="iconfont icon-collection-active" v-if="item.level>0" v-for="it in levelArray(item.level)"></i> 
                                    </span>
                                </span>
                            </div>
                            <div class="user-visit-time">{{timeDiff(item.scanTime)}}</div>   
                        </div>
                        <div class="rec-user-memo row">
                            <div class="col-70">发布信息 <span>{{item.publishedDemandsCount}}</span>条
                                <i>|</i>
                                成交 <span>{{item.tradesCount}}</span>笔
                            </div>
                            <div class="col-30">
                                <span v-if="1===item.personalAuthenticationState">实名</span>
                            </div>
                            
                        </div>             
                </div>
            </div>
        </a>
    </div>
    <p class="load-all" v-if="!isLoading">已显示全部</p>
    <div v-if="isLoading" class="infinite-scroll-preloader">
        <div class="preloader "></div>
    </div>
</div>
</template>
<style >

</style>

<script>
import {timeDiff} from '../utils/time';
	export default {
		data: function() {
			return {

			};
		},
        props: [ 'visitList','isLoading' ],
		methods: {
            timeDiff:timeDiff,
            headUrl(url) {
                let res = '';
                if(url){
                    res = url + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,png';
                }else{
                    res = 'img/defimg.png'
                }
                return res
            },
            levelArray (level){
                let levelArray = [];
                for(let i = 0;i < level;i++){
                    levelArray.push(1);
                }
                return levelArray;

            }
		},
        computed: {
           
        }

	}
</script>
<template>
    <div class="invite-share-tab">
        <div @click="weixinShareFriend" class="invite-share-items weixin-friends">
            <img src="../build/img/icon_weixin.png" alt="微信好友">
            <p>微信好友</p>
        </div>
        <div @click="weixinShareCircle" class="invite-share-items weixin-friends-circle">
            <img src="../build/img/circleFriends.png" alt="微信朋友圈">
            <p>朋友圈</p>
        </div>
        <div @click="qqShareFriend" class="invite-share-items qq-friends">
            <span class="iconfont icon-qq"></span>
            <p>QQ</p>
        </div>
        <!--<div class="invite-share-items qq-zone">-->
            <!--<span class="iconfont icon-msg"></span>-->
            <!--<p>短信</p>-->
        <!--</div>-->
    </div>
</template>
<style lang="less">
    .invite-share-tab{
        overflow: hidden;
        min-height: 8rem;
    }
    .invite-share-items{
        width: 33.33%;
        float: left;
    }
    .invite-share-items img{
        display: block;
        width: 4.5rem;
        margin: 0 auto;
    }
    .weixin-friends-circle img, .weixin-friends img{
        padding-top: 1rem;
    }
    .weixin-friends-circle img{
        width: 4rem;
        padding-bottom: 0.5rem;
    }
    .invite-share-items span.icon-qq{
        font-size: 4.6rem;
        color: #02A6E3;
    }
    .invite-share-items span.icon-msg{
        font-size: 4.6rem;
        color: #22DE7E;
    }
    .qq-zone p, .qq-friends p{
        margin-top: 0.3rem;
    }
    @media screen and (max-width: 330px) {
        .invite-share-items{
            margin-bottom: 0;
            margin-top: 0;
        }
        .invite-share > p{
            margin: 0.5rem 0 0;
        }
        .invite-share{
            padding: 0.5rem 3rem;
        }
        .invite-share-items>p,
        .share-trip-share>p{
            margin-bottom: 0;
        }
    }
</style>

<script>
    export default{
        data: function () {
            return {};
        },
        methods: {
            weixinShareCircle (){
                this.$emit('weixin_share_circle')
            },
            weixinShareFriend (){
                this.$emit('weixin_share_friend')
            },
            qqShareFriend (){
                this.$emit('qq_share_friend')
            }
        }
    };
</script>

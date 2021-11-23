<template>
    <div class="component-rank-item" @click="goToShop">
    	<span>{{item.rank}}</span>
    	<div class="item-content">
    		<img :src="item.headImg ? (item.headImg +'?x-oss-process=image/resize,m_fill,h_100,w_100/format,png'):'http://img.yudada.com/img/default_%20avatar.png?x-oss-process=image/resize,m_fill,h_100,w_100/format,png'" alt="">
    		<p :class="{'mine': item.mine}">{{item.nickname || '匿名用户'}}</p>
    	</div>
    	<i>{{studyTime}}</i>
    </div>
</template>

<script>
	/**
	 * author: zhongliang.he
	 * create time: 11/17 2017 
	 * props: 
	 * item: 排行数据
	 */
	export default {
		name: 'classroom-rank-item',
		data: function() {
			return {};
		},
		props: {
			item: {
				type: Object,
				default: () => {
					return {
						headImg: 'string',
					    mine: true,
					    nickname: 'string',
					    rank: 0,
					    studySeconds: 0,
					    userId: 0
					}
				}
			}
		},
		methods:{
			goToShop() {
				var vm = this
				window.f7 && window.f7.showIndicator();
				window.mainView && window.mainView.router.load({
				    url: 'views/otherIndex.html?id='+vm.item.userId+'&currentUserId=' + vm.item.userId
				});
			}
		},
		computed:{
			studyTime() {
				var vm = this
				var res = ''
				if(vm.item.studySeconds > 60 * 60){
					res =Math.floor(vm.item.studySeconds / 60 /60 ) + "小时" + Math.floor((vm.item.studySeconds % 3600)/60) + "分钟" 
				}else{
					res = vm.item.studySeconds ?  (vm.item.studySeconds /60).toFixed(1) + '分钟' : 0
				}
				return vm.item.studySeconds ? res : 0 
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../less/core/base.less';
	.component-rank-item{
		display: block;
		background: @bg-fff;
		padding: 15px 70px 15px 40px;
		overflow: hidden;
		font-size: 1.4rem;
		color: fade(@text-333 / 3 * 5, 50);
		position: relative;
		span{
			position: absolute;
			display: block;
			width: 40px;
			text-align: center;	
			color: @themeColor;
			left: 0;
			top: 50%;
			margin-top: -8px;
		}
		i{
			display: block;
			right: 10px;
			top: 50%;
			margin-top: -8px;
			width: 100px;
			.text-hidden;
			position: absolute;
			text-align: right;
		}
		.item-content{
			.text-hidden;
			height: 30px;
			padding-left: 40px;
			vertical-align: middle;
			img{
				width: 30px;
				left: 0;
				top: 50%;
				margin-top: -15px;
				border-radius: 15px;
				position: absolute;
			}
			p{
				margin: 0;
				.text-hidden;
				position: absolute;
				left: 0;
				top: 50%;
				margin-top: -8px;
				padding-left: 40px;
				width: 80%;
				&.mine{
					color: @themeColor;
				}
			}
		}
		&:after{
			display: block;
			position: absolute;
			content: ' ';
			width: 100%;
			left: 35px;
			border-bottom: 1px solid @border-da;
			bottom: 0;
		}
	}
</style>

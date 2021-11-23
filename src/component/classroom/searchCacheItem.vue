<template>
    <div @click="redirect" class="component-search-cache-item">
    	<!-- <img src="../../build/img/ic_search_label.png" alt=""> -->
    	<img :src="item ? 'img/ic_search_label.png':'img/book.png'" alt="">
    	<div class="item-content">
    		<p :class="item ? 'title':'empty-title'">{{item ? item: '未搜索到相关课程'}}</p>
    		<p>{{item ? '搜索所有相关课程' : '试试别的关键字' }}</p>
    	</div>
    	<div class="item-clear" @click="clearSeachCache" v-if="!clear && item">清除</div>
    </div>
</template>

<script>
	/**
	 * author: zhongliang.he
	 * create time: 11/20 2017 
	 * 在线课堂搜索缓存item组件
	 * props: 
	 * href: 跳转的链接
	 * seach: 搜索的文章内容
	 */
	import store from '../../utils/localStorage'
	export default {
		name: 'classroom-search-cache-item',
		data: function() {
			return {};
		},
		props: {
			href: {
				type: String,
				default: ''
			},
			clear: {
				type: Boolean,
				default: false
			},
			item: {
				type: String,
				default: ''
			}
		},
		methods: {
			redirect(e) {
				const ele = $$(e.target)
				if (ele.hasClass('item-clear')){
					return;
				}
				var vm = this
				if(vm.clear){
					return;
				}
				window.f7 && window.f7.showIndicator();
				window.mainView && window.mainView.router.load({
				    url: `views/aquaticSearch.html?search=${vm.item}`
				});
			},
			clearSeachCache() {
				var vm = this
				this.$emit('clearsearch')
			}
		},
		computed: {
			
		}
	}
</script>

<style lang="less" scoped>
@import '../../less/core/base.less';
	.component-search-cache-item{
		display: block;
		padding: 10px 45px;
		overflow: hidden;
		font-size: 1.4rem;
		color: fade(@text-333 / 3 * 5, 50);
		position: relative;
		img{
			position: absolute;
			left: 15px;
			top: 50%;
			margin-top: -9px;	
			width: 17px;
			display: block;
		}
		.item-content{
			p{
				margin: 0;
				.text-hidden;
				&.title{
					color: @themeColor;
				}
				&.empty-title{
					color: @bg-555;
					font-size: 1.6rem;
				}
			}
		}
		.item-clear{
			position: absolute;
			right: 0;
			top: 0;
			vertical-align: middle;
			width: 45px;
			color: @text-clear;
			text-align: left;
			top: 50%;
			margin-top: -8px;	
		}
		&:after{
			display: block;
			position: absolute;
			content: ' ';
			width: 100%;
			left: 40px;
			border-bottom: 1px solid @border-da;
			bottom: 0;
		}
	}
</style>

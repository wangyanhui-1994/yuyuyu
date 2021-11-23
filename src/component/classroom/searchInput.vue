<template>
    <a :href="href" class="component-search">
    	<span>
    		<img src="../../build/img/ic_blue_search.png" alt="">
    		{{value}}
    	</span>
    </a>
</template>

<script>
	/**
	 * author: zhongliang.he
	 * create time: 11/17 2017 
	 * props: 
	 * href: 跳转的链接
	 * value: 默认显示的内容
	 */
	export default {
		name: 'classroom-search',
		data: function() {
			return {};
		},
		props: {
			href: {
				type: String,
				default: 'views/aquaticSearch.html'
			},
			value: {
				type: String,
				default: '输入相关课程的关键字，如：机械'
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../less/core/base.less';
	.component-search{
		display: block;
		background: @bg-fff;
		padding: 12px 5% 12px 12.5%;
		overflow: hidden;
		font-size: 1.4rem;
		color: fade(@text-333 / 3 * 5, 50);
		border-radius: 2.5px;
		span{
			display: block;
			padding-left: 25px;
			position: relative;
			img{
				position: absolute;
				display: block;
				width: 16px;
				top: 1px;
				left: 0;	
			}
		}
	}
	@media screen and (min-width: 310px) and (max-width: 330px) {
    .component-search {
        padding: 12px 8%;
    }
}
</style>
<template>
    <div class="save-article-confirm-modal" v-if="isShow" @click="closed" @touchmove="pretouch">
    	<div class="modal-content">
    		<img src="../../build/img/ic_article_zan.png" alt="">
    		<p class="title">想保存有用的文章？</p>
    		<p>登录后就可以保存文章啦</p>
    		<div @click="loginAction" class="btn">现在就登录</div>
    	</div>
    </div>
</template>

<script>
	/**
	 * author: zhongliang.he
	 * create time: 11/22 2017 
	 * props: 
	 * login: 点击登录按扭所执行的方法
	 * isShow: 是否显示modal
	 */
	export default {
		name: 'classroom-save-article-confirm-modal',
		data: function() {
			return {};
		},
		props: {
			isShow: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			closed(e) {
				const ele = $$(e.target)
				ele.hasClass('save-article-confirm-modal') && this.$emit('closemodal')
			},
			loginAction() {
				this.$emit('closemodal')
				this.$emit('login')
			},
			pretouch(e) {
				e.preventDefault();
        		e.stopPropagation();
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../less/core/base.less';
	.save-article-confirm-modal{
		display: flex;
		position: fixed;
		width: 100%;
		height: 100%;
		background: fade(@bg-black, 60);
		z-index: 999999;
		left: 0;
		top: 0;
		align-items: center;
		padding: 0 17%;
		z-index: 9999999;
		box-sizing: border-box;
		.modal-content{
			width: 100%;
			box-sizing: border-box;
			background: @bg-fff;
			box-shadow: 0 3px 8px 0 fade(@bg-black, 20);
			border-radius: 5px;
			text-align: center;
			padding: 35px 10% 30px;
			img{
				width: 36%;
			}
			p{
				margin: 0;
				margin-bottom: 30px;
				color: @text-333 / 3 * 5;
				text-align: center;
				font-size: 1.6rem;
				&.title{
					margin-bottom: 5px;
					margin-top: 18px;
					font-size: 1.8rem;
					font-weight: bold;
				}
			}
			.btn{
				display: block;
				line-height: 0;
				padding: 2rem 0;
				color: @text-fff;
				font-size: 1.6rem;
				border-radius: 2rem;
				background: @text-clear;
				font-weight: bold;
			}
		}
	}
</style>

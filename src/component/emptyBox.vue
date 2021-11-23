<template>
    <div class="component-empty-box">
	    <div class="iconfont icon-copy"></div>
	    <p>{{text}}</p>
    </div>
</template>

<script>
export default {
	name: 'empty-box',
	data: function() {
		return {};
	},
	props: ['text']
}
</script>

<style scoped>
	.component-empty-box{
		padding-top: 7rem;
		text-align: center;
	}
	.component-empty-box .iconfont{
		font-size: 5rem;
		width: 10rem;
		height: 10rem;
		border-radius: 5rem;
		text-align: center;
		display: inline-block;
		background: #dbdbdb;
		color: #fff;
	}
	.component-empty-box .iconfont:before{
		position: relative;
		top: 1rem;
	}
	.component-empty-box p{
		font-size: 1.6rem;
		padding-top: 2rem;
		color: #747474;
	}
</style>
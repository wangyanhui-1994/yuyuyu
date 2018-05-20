<template>
    <div @click="redirect" class="component-article-item">
    	<div class="item-content">
    		<img :src="item.img + '?x-oss-process=image/resize,m_fill,h_132,w_200'" alt="">
    		<div class="item-content-text">
    			<p class="title" v-html="listItem.title"></p>
    			<p>
    				<!-- 推荐：<span>细菌性肠炎</span> -->
    				<span v-html="heightText"></span>
    				<i>阅读    {{addViews(listItem.views)}}</i>
    			</p>
    		</div>
    	</div>
    </div>
</template>

<script>
	/**
	 * author: zhongliang.he
	 * create time: 11/17 2017 
	 * 在线课堂列表item组件
	 * props: 
	 * lineHeightStr: 搜索高亮字段
	 * item: 列表item信息
	 */
	import ClassroomModel from '../../js/model/ClassroomModel';
	export default {
		name: 'classroom-article-item',
		data: function() {
			return {};
		},
		props: {
			lineHeightStr: {
				type: String,
				default: ''
			},
			item: {
				type: Object,
				default: () => {
					return {
					}
				}
			}
		},
		methods: {
			redirect() {
				var vm = this
				ClassroomModel.putViews(vm.item.id,{
                		id:vm.item.id
            		},(res) => {
            			const {code,message} = res;
            			if(code == 1){
            				vm.item.views++;
            			}else{
            				console.log(message);
            			}
            		}
        		);
				window.f7 && window.f7.showIndicator();
				window.mainView && window.mainView.router.load({
				    url: `views/articalInfo.html?id=${vm.item.id}&url=${vm.item.link}&title=${vm.item.title}`
				});
			},
			addViews(views){
				if (!views) {
			        return 0
			    }
			    let res = Number(views)
			    res >= 10000 && res < 100000 && (res = (res / 10000).toFixed(1))
			    res > 100000 && (res = (res / 10000).toFixed(0))
			    if (`${res + ''}`.split('.').length > 1) {
			        !Number(`${res + ''}`.split('.')[1]) ? (res = `${(res + '').split('.')[0]}万`) : (res += '万')
			    }
			    res >= 10 && (res += '万')
			    Number(views) < 10000 && (res = views)
			    return res
			}
		},
		computed: {
			listItem() {
				var vm = this
				let res = JSON.parse(JSON.stringify(vm.item))
				if (vm.lineHeightStr && res.title && res.title.indexOf(vm.lineHeightStr) > -1){
					let titleArr = res.title.split(vm.lineHeightStr)
					res.title = titleArr.join(`<b>${vm.lineHeightStr}</b>`)
				}
				return res
			},
			heightText() {
          		const vm = this
	            let res = vm.item.secondCategoryName || vm.item.tags
	            vm.lineHeightStr && vm.item.tags.split(vm.lineHeightStr).length > 1 && (res = vm.item.tags.split(vm.lineHeightStr).join(`<i>${vm.lineHeightStr}</i>`))
	            vm.lineHeightStr && vm.item.secondCategoryName.split(vm.lineHeightStr).length > 1 && (res = vm.item.secondCategoryName.split(vm.lineHeightStr).join(`<i>${vm.lineHeightStr}</i>`))
	            !(window.mainView.activePage.url.indexOf('aquaticSearch.html') > -1) && (res = `<i>${res}</i>`)
	            return res
          }
		}
	}
</script>

<style lang="less">
@import '../../less/core/base.less';
	.component-article-item{
		display: block;
		color: fade(@text-333 / 3 * 5, 50);
		font-size: 1.3rem;
		padding: 15px 4% 0;
		
		.item-content{
			padding-left: 110px;
			position: relative;
			height: 80px;
			padding-bottom: 15px;
			border-bottom: 1px solid @border-da;
			box-sizing: border-box;
			& > img{
				display: block;
				width: 100px;
				position: absolute;
				left: 0;
				top: 0;
				border-radius: 3px;
			}

			&-text{
				p{
					margin: 0;
					height: 18px;
					position: relative;
					overflow: hidden;
					&.title{
						color: @text-333 / 3 * 5;
						height: 40px;
						margin-bottom: 8px;
						font-size: 1.5rem;
						line-height: 20px;
						width: 100%;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						// text-align-last:justify;
					}

					span, b{
						display: block;
						max-width: 70%;
						.text-hidden;
						i{
   							font-style: normal;
                       		color: @themeColor;
                        	position: static;
                        	display: inline;
                    	}
					}
					b{
						display: inline;
						color: @themeColor
					}
					i{
						position: absolute;
						right: 0;
						top: 0;
						display: block;
						background: @bg-fff;
					}
				}
			}
		}
	}
</style>

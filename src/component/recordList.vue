<template>
    <div class="record-list list-block media-list">
	    <div class="pull-to-refresh-layer ">
            <div class="preloader "></div>
            <div class="pull-to-refresh-arrow"></div>
	    </div> 
	    <a class="item-content" href="#" v-for="item in recordList">
	        <div class="item-inner">
	          <div class="item-title-row">
	            <div class="item-title">{{item.fishTypeName}}</div>
	            <div class="item-after">{{timeDiff(item.tradeDate)}}</div>
	          </div>
	          <div class="item-text">{{item.quantity}}<span v-if="item.quantity">|</span> {{item.provinceName}}{{item.cityName}} </div>
	        </div>
	    </a>
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
		props: [ 'recordList','isLoading'],
		methods: {
            timeDiff:timeDiff
		}

	}
</script>
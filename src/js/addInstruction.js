import { isEmailStr, getTagInfo } from '../utils/string';
import Vue from 'vue';
import nativeEvent from '../utils/nativeEvent';
import ObjectUtil from '../utils/ObjectUtils';

function addInstructionInit (f7, view, page){
    f7.hideIndicator();
    const {fishParentTypeName, type} = page.query;
    const currentPage = $$($$('.view-main .page-add-instruction')[$$('.view-main .page-add-instruction').length - 1]);
    const currentNav = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    if(1 == type){
        currentNav.find('.center').text('具体要求');
    }
    window.selectDescription = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            description: window.releaseVue ? window.releaseVue.subInfo.description : '',
            descriptionTags: window.releaseVue && window.releaseVue.descriptionTagsBak.length ? ObjectUtil.clone(window.releaseVue.descriptionTagsBak) : getTagInfo().discriptionList,
            descriptionTagsSelect: window.releaseVue ? ObjectUtil.clone(window.releaseVue.subInfo.descriptionTags) : [],
            fishParentTypeName
        },
        methods: {
            checkText (){
                this.description = isEmailStr(this.description);
            },
            getIndex (obj, arr){
                let res = '';
                $$.each(arr, (item, index) => {
                    obj.id == item.id && (res = index);
                });
                return res;
            },
            select (item, index){
                let num = 0;

                this.descriptionTags[index].selected = !this.descriptionTags[index].selected;
                $$.each(this.descriptionTags, (index, item) => {
                    item.selected && num++;
                });
                if(4 == num){
                    nativeEvent.nativeToast(0, '最多只能选择三个标签！');
                    this.descriptionTags[index].selected = !this.descriptionTags[index].selected;
                }
                this.$set(this.descriptionTags, index, item);
                if(4 !== num){
                    if(this.descriptionTags[index].selected){
                        this.descriptionTagsSelect.push(this.descriptionTags[index]);
                    }else{
                        if(this.getIndex(item, this.descriptionTagsSelect) > -1){
                            this.descriptionTagsSelect.splice(this.getIndex(item, this.descriptionTagsSelect), 1);
                        }
                    }
                }
            },
            saveEdit (){
                if(window.releaseVue){
                    window.releaseVue.subInfo.description = this.description;
                    window.releaseVue.subInfo.descriptionTags = this.descriptionTagsSelect;
                    window.releaseVue.descriptionTagsBak = this.descriptionTags;
                }
                view.router.back();
            }
        }
    });
    setTimeout(() => {
        currentPage.find('textarea')[0].focus();
    }, 600);
}

export{
  addInstructionInit
};

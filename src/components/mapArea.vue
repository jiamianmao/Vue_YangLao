<template>
    <el-row>
        <el-form-item :label="this.title" v-if="userInfo.type === 0 || userInfo.type === 2">
            <el-col :span="5">
                <!-- 平台 -->
                <el-select v-if="userInfo.type === 0" v-model="areaData.provinceId" :disabled="ifEdit" placeholder="请选择">
                    <el-option label="无" value="-1"></el-option>
                    <el-option
                      v-for="item in provinces"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
                <!-- 政府-->
                <el-select v-if="userInfo.type === 2" v-model="userInfo.provinceId" placeholder="请选择" disabled>
                    <el-option
                      :label="userInfo.provinceName"
                      :value="userInfo.provinceId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4" class="marl">
                <!-- 平台 -->
                <el-select v-if="userInfo.type === 0" v-model="areaData.cityId" :disabled="ifEdit" placeholder="请选择" >
                    <el-option label="无" value="-1"></el-option>
                    <el-option
                      v-for="item in cities"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
                <!-- 政府 -->
                <el-select v-if="userInfo.type === 2" v-model="userInfo.countryId" placeholder="请选择" disabled>
                    <el-option
                      :label="userInfo.cityName"
                      :value="userInfo.countryId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4" class="marl">
                <el-select v-model="areaData.areaId" :disabled="ifEdit" placeholder="请选择" >
                    <el-option label="无" value="-1"></el-option>
                    <el-option
                      v-for="item in areas"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4" class="marl">
                <el-select v-model="areaData.streetId" :disabled="ifEdit" placeholder="请选择"  @change="selectChange">
                    <el-option label="无" value="-1"></el-option>
                    <el-option
                      v-for="item in streets"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
    </el-row>
</template>
<script>
import { UMS } from '@/common/config'
export default {
  name: "cityArea",
  props: ["curNum", "ifEdit", "area", "title", "check"],
  data() {
    return {
      areaData: {
        provinceId: "", //被选中的省
        provinceName: "",
        cityId: "", //被选中的市
        cityName: "",
        areaId: "", //被选中的区域
        areaName: "",
        streetId: "", //被选中的街道
        streetName: ""
      },
      provinces: [], //省级信息
      cities: [], //市信息
      areas: [], //区域信息
      streets: [], //街道信息
      ruls: [],
      userInfo: null
    };
  },
  created() {
    this.userInfo = window._dataInfo
    // 若是政府权限  直接拉取市级以下的区、县
    if (this.userInfo.type === 0 || this.userInfo.type === 1) {
      this.getProvinces() 
    } else {
      this.getCountys()
    }
  },
  methods: {
    getProvinces () {
      // 获取所有省份信息
      this.$http
        .get(`${UMS}/city/getAllProvince.do`, {
          withCredentials: true
        })
        .then(data => {
          this.provinces = data.data.data.list;
        })
        .catch(e => alert(e));
    },
    getCountys () {
      // 获取所有县、区信息
      this.$http
      .get(`${UMS}/city/getCityByPid.do?pid=${this.userInfo.cityId}`, {
        withCredentials: true
      })
      .then(data => {
        this.areas = data.data.data.list
        // this.selectChange()
      })
      .catch(e => alert(e))
    },
    selectChange() {
      //                获取省名称
      let _this = this;
      if (this.areaData.provinceId) {
        let tempArr = this.provinces.filter(
          v => v.id === _this.areaData.provinceId
        );
        if (tempArr.length > 0 && tempArr[0].name) {
          this.areaData.provinceName = tempArr[0].name;
        }
      }
      //市
      if (this.areaData.cityId) {
        let tempArr = this.cities.filter(v => v.id === _this.areaData.cityId);
        if (tempArr.length > 0 && tempArr[0].name) {
          this.areaData.cityName = tempArr[0].name;
        }
      }
      //区
      if (this.areaData.areaId) {
        let tempArr = this.areas.filter(v => v.id === _this.areaData.areaId);
        if (tempArr.length > 0 && tempArr[0].name) {
          this.areaData.areaName = tempArr[0].name;
        }
      }
      //街道
      if (this.areaData.streetId) {
        let tempArr = this.streets.filter(
          v => v.id === _this.areaData.streetId
        );
        if (tempArr.length > 0 && tempArr[0].name) {
          this.areaData.streetName = tempArr[0].name;
        }
      }

      if (this.areaData.provinceId === "-1") {
        this.areaData.provinceId = "";
        this.areaData.provinceName = "";
      }

      if (this.areaData.cityId === "-1") {
        this.areaData.cityId = "";
        this.areaData.cityName = "";
      }

      if (this.areaData.areaId === "-1") {
        this.areaData.areaId = "";
        this.areaData.areaName = "";
      }

      if (this.areaData.streetId === "-1") {
        this.areaData.streetId = "";
        this.areaData.streetName = "";
      }

      //
      this.$emit("select-change", this.areaData, this.curNum);
    },
    reSet() {
      this.areaData = {
        provinceId: "", //被选中的省
        provinceName: "",
        cityId: "", //被选中的市
        cityName: "",
        areaId: "", //被选中的区域
        areaName: "",
        streetId: "", //被选中的街道
        streetName: ""
      };
    }
  },
  watch: {
    area: function() {
      this.areaData = this.serviceArea;
    },
    "areaData.provinceId": function() {
      //如果省改变 则表示重新选择，清空市  区  街道
      this.areaData.cityId = "";
      this.areaData.cityName = "";
      this.areaData.areaId = "";
      this.areaData.areaName = "";
      this.areaData.streetId = "";
      this.areaData.streetName = "";
      if (!this.areaData.provinceId) {
        return false;
      }
      //拉取市级信息
      this.$http
        .get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.provinceId}`, {
          withCredentials: true
        })
        .then(data => {
          this.cities = data.data.data.list;
          this.selectChange();
        })
        .catch(e => {
          console.log(e);
        });
    },
    "areaData.cityId": function() {
      this.areaData.areaId = "";
      this.areaData.areaName = "";
      this.areaData.streetId = "";
      this.areaData.streetName = "";
      if (!this.areaData.cityId) {
        return false;
      }
      this.$http
      .get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.cityId}`, {
        withCredentials: true
      })
      .then(data => {
        this.areas = data.data.data.list;
        this.selectChange();
      })
      .catch(e => alert(e));
    },
    "areaData.areaId": function() {
      this.areaData.streetId = "";
      this.areaData.streetName = "";
      if (!this.areaData.areaId) {
        return false;
      }
      //拉取街道级信息
      this.$http
        .get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.areaId}`, {
          withCredentials: true
        })
        .then(data => {
          this.streets = data.data.data.list;
          this.selectChange();
        })
        .catch(e => alert(e));
    }
  }
};
</script>
<style lang="scss" scoped>
.marl {
  margin-left: 10px;
}
</style>

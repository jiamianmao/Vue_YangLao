<template>
    <page-container title="服务人员列表">
        <div class="info-container">
            <el-form :model="userForm" inline label-width="100px" label-position="left">
                <el-row class="area">
                    <cityArea ref="area"
                              title="服务区域"
                              @select-change="selectChange"
                              curNum="0"
                              v-if="isPf"></cityArea>
                    <limitArea ref="area" @select-change="selectChange" v-if="isGover"></limitArea>
                </el-row>
                <el-row v-if="!isOrg">
                    <el-form-item label="服务机构">
                        {{orgName}}
                        <el-button class="button" type="primary" @click="chooseOrg">选择服务机构</el-button>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="服务人员姓名">
                        <el-input v-model="userForm.condition.workerName"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="userForm.condition.mobile"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="性别">
                        <el-select v-model="userForm.condition.sex" placeholder="请选择机构状态">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务人员状态">
                        <el-select v-model="userForm.condition.state" placeholder="请选择机构状态">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="失效" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="创建时间">
                        <el-date-picker
                                v-model="time"
                                type="datetimerange"
                                start-placeholder="选择时间范围">
                        </el-date-picker>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item>
                        <el-button type="primary" @click="sift">筛选</el-button>
                        <el-button type="primary" @click="reSet">重置</el-button>
                        <el-button type="primary">
                            <a download="test"
                               class="download"
                               :href="`http://mp.17link.cc/worker/export?${getParams(getQuery(this.userForm))}`">导出</a>
                        </el-button>
                        <el-button v-if="isOrg" icon="plus" class="button" type="primary" @click="add">添加服务人员
                        </el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="list">
            <el-table :data="tableData" stripe border class="list"
                      v-loading="pending"
                      element-loading-text="正在请求数据...">
                <el-table-column prop="control" label="服务人员姓名"
                                 align="center"
                                 width="100">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="linkTo(tableData[scope.$index])"
                                type="text"
                                size="small">
                            {{tableData[scope.$index].name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="orgName"
                        label="所属机构"
                        width="120"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="provinceName"
                        label="省"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="cityName"
                        label="市"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="districtName"
                        label="区县"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="streetName"
                        label="街道"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="联系电话"
                        align="center"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                        :formatter="trans4display"
                        align="center"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="post"
                        label="职位"
                        align="center"
                        :formatter="trans4display"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        align="center"
                        :formatter="trans4display"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="state"
                        label="服务人员状态"
                        align="center"
                        :formatter="trans4display"
                        width="100">
                </el-table-column>
                <el-table-column prop="control" label="操作" v-if="!isGover"
                                 align="center"
                                 width="100">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="changeStatus(tableData[scope.$index])"
                                type="text"
                                size="small">
                            {{ tableData[scope.$index].state === 2 ? '启用' : '停用' }}
                        </el-button>
                        <el-button @click.native.prevent="linkTo(tableData[scope.$index],true)"
                                   type="text"
                                   size="small"
                                   v-if="tableData[scope.$index].state === 1 ">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-row type="flex" justify="center">
                <el-pagination @current-change="pageChange"
                               :page-size="10"
                               layout="total, prev, pager, next"
                               :total="totleNum">
                </el-pagination>
            </el-row>
        </div>
        <org-choose v-if="showOrg"
                    @pop-click="setOrgInfo"
                    :areaData="userForm.condition.serviceArea">
        </org-choose>
    </page-container>
</template>
<script>
  import PageContainer from '@/components/PageContainer.vue';
  import cityArea from '@/components/ServiceArea.vue';
  import limitArea from '@/components/limitArea.vue';
  import orgChoose from '@/components/OrgChoose.vue';
  import { format } from 'date-fns';
  import { MP } from '@/common/config'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        orgName: '',
        userForm: {
          pageNum: 1,
          pageSize: 10,
          condition: {
            createDateFrom: '',
            createDateTo: '',
            mobile: '',
            orgId: '',
            sex: '',
            state: '',
            workerName: "",
            serviceArea: {
              provinceId: '',
              provinceName: '',
              cityId: '',
              cityName: '',
              zoneId: '',
              zoneName: '',
              streetId: '',
              streetName: ''
            }
          },
        },
        tableData: [],
        showOrg: false,
        time: [],
        totleNum: 0,
        pending: false,
      }
    },
    components: {
      cityArea,
      limitArea,
      orgChoose,
      PageContainer,
    },
    computed: {
      ...mapState(['userInfo']),
      ...mapGetters(['isPf', 'isGover', 'isOrg', 'post']),
    },
    created() {
      this.getLists();
      // 为了优化子页面的职位
      this.$http.get(`${MP}/worker/postDict`).then(res => {
          this.SET_POST(res.data.data.list)
      })
    },
    methods: {
      sift() {
        this.userForm.pageSize = 10;
        this.getLists();
      },
      async changeStatus(worker) {
        const { id, state } = worker;
        const nextState = state % 2 + 1;
        try {
          await this.$http.post(`${MP}/worker/update`, {
            worker:
              {
                id: id,
                state: nextState
              }
          });
          worker.state = nextState;
        } catch (e) {
          console.log(e);
        }
      },
      getAdverseStatus(status) {
        if (!status || !status.trim) {
          return '停用'
        }
        if (status.trim() === '正常') {
          return '停用';
        }
        return '启用';
      },
      selectChange(areaData) {
        let serviceArea = this.userForm.condition.serviceArea;
        serviceArea.provinceId = areaData.provinceId;
        serviceArea.provinceName = areaData.provinceName;
        serviceArea.cityId = areaData.cityId;
        serviceArea.cityName = areaData.cityName;
        serviceArea.zoneId = areaData.zoneId;
        serviceArea.zoneName = areaData.zoneName;
        serviceArea.streetId = areaData.streetId;
        serviceArea.streetName = areaData.streetName;
      },
      //选择机构弹框
      chooseOrg() {
        this.showOrg = true;
      },
      //获取选中机构信息
      setOrgInfo(org) {
        if (org) {
          this.userForm.condition.orgId = org.id;
          this.orgName = org.name;
        }
        this.showOrg = false;
      },
      pageChange(page) {
        this.userForm.pageNum = page;
        this.userForm.pageSize = 10;
        this.getLists();
      },
      reSet() {
        //
        this.userForm.condition.orgId = "";
        this.orgName = "";
        if(this.isPf){
          this.$refs.area && this.$refs.area.reSet()
        }
        this.time = [];
        this.userForm.condition = {
            createDateFrom: '',
            createDateTo: '',
            mobile: '',
            orgId: '',
            sex: '',
            state: '',
            workerName: "",
            serviceArea: {
              provinceId: '',
              provinceName: '',
              cityId: '',
              cityName: '',
              zoneId: '',
              zoneName: '',
              streetId: '',
              streetName: ''
            }
        }
      },
      trans4display(row, { property }) {
        let v = row[property];

        if (property.endsWith('Time')) {
          return format(v, 'YYYY-MM-DD HH:mm:SS');
        }

        switch (property) {
          case 'state':
            v = ['正常', '失效'][v - 1];
            break;
          case 'sex' :
            v = ['男', '女'][v - 1];
            break;
          case 'post':
            const post = this.post.find(p => p.id === v);
            v = post ? post.text : null;
            break;
          default:
            v = '/';
        }

        return v || '异常数据'
      },
      async getLists() {
        try {
            this.userForm.condition.createDateFrom  = '';
            this.userForm.condition.createDateTo  = '';

          if (this.time.length > 0 && this.time[0] && this.time[1]) {
            this.userForm.condition.createDateFrom = this.time[0].getTime();
            this.userForm.condition.createDateTo = this.time[1].getTime();
          }
          this.pending = true;
          let res = await this.$http.post(`${MP}/worker/loadWorkers`, this.userForm);
          let data = res.data.data
          this.totleNum = data.count
          this.tableData = data.list
        } catch (e) {
          console.log(e);
        }
        this.pending = false;
      },
      linkTo({ id }, isEdit) {
        let url =  isEdit ? `/integratedMana/worker/${id}/edit` : `/integratedMana/worker/${id}`
        this.$router.push(url)
      },
      add() {
        this.$router.push({
          name: 'WorkerAdd',
          params: {
            id: 0
          }
        });
      },
      getQuery(data) {
        let dataStr = ''
        for (let key in data) {
          if (typeof data[key] === 'object') dataStr += this.getQuery(data[key]);
          else {
            if (data[key]) {
              dataStr += key + '=' + data[key] + '&'
            } else {
              dataStr += key + '=' + '' + '&'
            }
          }
        }
        return dataStr;
      },
      getParams(data) {
        return data.slice(0, -1);
      },
      ...mapMutations(['SET_POST'])
    }
  }
</script>

<style lang="scss">
    .add {
        margin-left: 50px;
    }

    .download {
        width: 100%;
        color: #fff;
    }
</style>

import axios from 'axios';
import { Notification } from 'element-ui';
import { MP, UMS } from '@/common/config'

const cscReqIns = axios.create({
  baseURL: MP,
});

const umsReqIns = axios.create({
  baseURL: UMS,
  withCredentials: true,
  headers: { 'x-requested-with': 'XMLHttpRequest' }
});

const prevHandler = ({ data }) => {
  if (data && data.errCode > 0) {
    Notification.error({
      title: '操作失败',
      message: data.errMessage,
      duration: 0
    });
    throw new Error(data.errMessage);
  }
  return data.data;
};
const prevErrHandler = ({ response: { status } }) => {
  switch (status) {
    case 404:
      break;
    case 401:
      // 此处存有疑义, 暂且直接操作外层 window 对象.
      // window.top.postMessage({
      //   type: status,
      // }, 'http:ums.17link.cc');
      // window.top.location.href = 'http://ums.17link.cc';
      window.top.location.href = 'http://ums.17link.cc'
      break;
    case 500:
      break;
    default:

  }
  Notification.error({
    title: '系统异常',
    message: '请稍后重试'
  });
  throw new Error('系统异常');
};
cscReqIns.interceptors.response.use(prevHandler, prevErrHandler);
umsReqIns.interceptors.response.use(prevHandler, prevErrHandler);

const cscService = {
  /*获取城市列表*/
  getPostDict() {
    return cscReqIns.get('/worker/postDict');
  },
  getServiceAreaByCompId(id) {
    return cscReqIns.get(`/worker/org/address?id=${id}`);
  },
  getServiceCates() {
    return cscReqIns.get('/manage/category/query');
  },
  saveWorker(p) {
    return cscReqIns.post('/worker/addWorker', p);
  },
  updateWorker(p) {
    return cscReqIns.post('/worker/update', p);
  },
  getServicePersonById(id) {
    return cscReqIns.get(`/worker/info?workerID=${id}`);
  },
  addTrain(data) {
    return cscReqIns.post('/worker/addTrain', data);
  },
  updateTrain(data) {
    return cscReqIns.post('/worker/editTrain', data);
  },
  deleteTrain(id) {
    return cscReqIns.get(`/worker/deleteTrain?id=${id}`);
  }
};

const umsService = {
  getProvinces() {
    return umsReqIns.get('/city/getAllProvince.do');
  },
  getCityByPid(pid) {
    return umsReqIns.get(`/city/getCityByPid.do?pid=${pid}`);
  }
};

export { cscService, umsService };

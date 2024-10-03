import { Toast } from 'antd-mobile';

export const JsBridge = {
  setNavigationBar: (data?: any) => {
    if (messageMethodIsSupport('setNavigationBar')) {
      window.setNavigationBar?.postMessage(data);
    }
  },
  openAlbumAndUpload: (data?: any) => {
    if (messageMethodIsSupport('openAlbumAndUpload')) {
      window.openAlbumAndUpload?.postMessage(data);
    }
  },
  // 打开文件选择
  openFileAndUpload: (data?: any) => {
    if (messageMethodIsSupport('openFileAndUpload')) {
      window.openFileAndUpload?.postMessage(data);
    }
  },

  // 获取用户信息
  getUserInfo: (data?: any) => {
    if (messageMethodIsSupport('getUserInfo')) {
      window.getUserInfo?.postMessage(data);
    }
  },

  // 跳转到登录页面
  gotoLogin: (data?: any) => {
    if (messageMethodIsSupport('gotoLogin')) {
      window.gotoLogin?.postMessage(data);
    }
  },

  // 关闭webview
  closeWebview: (data?: any) => {
    if (messageMethodIsSupport('closeWebview')) {
      window.closeWebview?.postMessage(data);
    }
  },

  // 设置全局函数，用户手势或者物理按键回退后的回调
  setClickBackCallback: (fun: any) => {
    window['clickBack'] = fun;
  },

  // native 解密接口返参
  nativeDecrypt: (data: string, callback: (args: string) => void) => {
    function getDecryptData(decryptData: string) {
      callback(decryptData);
      return decryptData;
    }

    window.getDecryptData = getDecryptData;
    if (messageMethodIsSupport('nativeDecrypt')) {
      window.nativeDecrypt?.postMessage(data);
    } else {
      Toast.show({
        content: '请升级APP到最新版本',
      });
    }
  },
};

// message 类的方法，直接挂在widow上, 只能调用APP方法，无法获取返回值
export function messageMethodIsSupport(methodName: string) {
  return typeof window !== 'undefined' && window?.[methodName as keyof Window];
}

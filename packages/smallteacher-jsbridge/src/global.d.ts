declare interface Window {
  setNavigationBar: {
    postMessage: (args) => void;
  };
  openAlbumAndUpload: {
    postMessage: (args) => void;
  };
  openFileAndUpload: {
    postMessage: (args) => void;
  };
  getUserInfo: {
    postMessage: (args) => void;
  };
  gotoLogin: {
    postMessage: (args) => void;
  };
  closeWebview: {
    postMessage: (args) => void;
  };
  nativeDecrypt: {
    postMessage: (args) => void;
  };
  clickBack: () => void;
  getDecryptData: (args, func) => void;
}

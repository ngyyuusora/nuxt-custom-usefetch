// import type { AxiosRequestConfig } from '~/types/axios';
// import isFunction from 'lodash/isFunction';

// let pendingMap = new Map<string, AbortController>();

// export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

// export class UseFetchCanceler {
//   addPending(config: AxiosRequestConfig) {
//     this.removePending(config);
//     const url = getPendingUrl(config);
//     const controller = new AbortController();
//     config.signal = controller.signal;

//     if (!pendingMap.has(url)) {
//       pendingMap.set(url, controller);
//     }
//   }

//   removeAllPending() {
//     pendingMap.forEach((controller) => {
//       if (controller && isFunction(controller.abort)) controller.abort();
//     });
//     pendingMap.clear();
//   }

//   removePending(config: AxiosRequestConfig) {
//     const url = getPendingUrl(config);

//     if (pendingMap.has(url)) {
//       const controller = pendingMap.get(url);
//       if (controller && isFunction(controller.abort)) controller.abort();
//       pendingMap.delete(url);
//     }
//   }

//   reset() {
//     pendingMap = new Map<string, AbortController>();
//   }
// }

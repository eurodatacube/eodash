import EventEmitter from 'eventemitter3';
import io from 'socket.io-client';

class CustomDashboardApi extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;

    this.socket.on('connect_error', console.error);

    this.socket.on('edit', (dto) => {
      this.emit('edit', dto);
    });
  }

  listen(id, editKey) {
    return new Promise((resolve, reject) => {
      this.socket.emit('listen', {
        id,
        ...(editKey && {
          editKey
        })
      }, (response) => {
        if (response.error) 
          return reject(response);
        


        return resolve(response);
      });
    });
  }

  create(title, features) {
    return new Promise((resolve, reject) => {
      this.socket.emit('create', {
        title,
        features
      }, (response) => {
        if (response.error) 
          return reject(response);
        


        return resolve(response);
      });
    });
  }

  changeTitle(title) {
    return new Promise((resolve, reject) => {
      this.socket.emit('change-title', title, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  addFeature(feature) {
    return new Promise((resolve, reject) => {
      this.socket.emit('add-feature', feature, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  removeFeature(featureId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('remove-feature', featureId, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  moveFeatureDown(featureId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('feature-move-down', featureId, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  moveFeatureUp(featureId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('feature-move-up', featureId, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  shrinkFeature(featureId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('feature-resize-shrink', featureId, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  expandFeature(featureId) {
    return new Promise((resolve, reject) => {
      this.socket.emit('feature-resize-expand', featureId, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  addMarketingInfo(info) {
    return new Promise((resolve, reject) => {
      this.socket.emit('add-marketing-info', info, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  changeFeatureTitle(featureId, newTitle) {
    return new Promise((resolve, reject) => {
      this.socket.emit('feature-change-title', {
        id: featureId,
        newTitle
      }, (response) => {
        if (response ?. error) 
          return reject(response);
        


        return resolve();
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const customDashboardApiFactory = () => new CustomDashboardApi(io('wss://dev-eodash-dashboard-api.f77a4d8a-acde-4ddd-b1cd-b2b6afe83d7a.hub.eox.at/'));

export default customDashboardApiFactory;

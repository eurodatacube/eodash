/* eslint-disable */
// source: https://gist.github.com/tamirvs/d1a584f3fc9c494cf75d3ca76c54fb1b

export default function (props) {
  let initialValues = {};

  return {
    created () {
      for (let prop of props) {
        initialValues[prop] = this[prop];
      }
      
      const unregisterRouterGuard = this.$router.beforeEach((to, from, next) => {
        for (let prop of props) {
          if (this[prop] !== initialValues[prop]) {
            this[prop] = initialValues[prop];
            next(false);
            return;
          }
        }

        next();
      });

      this.$once('hook:destroyed', () => {
        unregisterRouterGuard()
      });
    },
  }
}
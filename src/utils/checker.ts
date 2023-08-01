/**
 *@des 表单验证
 *@author stav stavyan@qq.com
 *@blog https://stavtop.club
 *@date 2019/11/15 10:55:56
 */
const checker = {
  error: '',
  check: function (data:any, rule:any) {
    for (let i = 0; i < rule.length; i++) {
      if (!rule[i].checkType) {
        return true;
      }
      if (!rule[i].name) {
        return true;
      }
      if (!rule[i].errorMsg) {
        return true;
      }
      if (!data[rule[i].name]) {
        this.error = rule[i].errorMsg;
        return false;
      }
      let reg;
      switch (rule[i].checkType) {
        case 'string':
          // eslint-disable-next-line no-case-declarations
          reg = new RegExp('^.{' + rule[i].checkRule + '}$');
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'int':
          reg = new RegExp(
            '^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$'
          );
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'between':
          if (!this.isNumber(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          // eslint-disable-next-line no-case-declarations
          let minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (
            data[rule[i].name] > minMax[1] ||
						data[rule[i].name] < minMax[0]
          ) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'betweenD':
          reg = /^-?[1-9][0-9]?$/;
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (
            data[rule[i].name] > minMax[1] ||
						data[rule[i].name] < minMax[0]
          ) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'betweenF':
          reg = /^-?[0-9][0-9]?.+[0-9]+$/;
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          minMax = rule[i].checkRule.split(',');
          minMax[0] = Number(minMax[0]);
          minMax[1] = Number(minMax[1]);
          if (
            data[rule[i].name] > minMax[1] ||
						data[rule[i].name] < minMax[0]
          ) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'same':
          if (data[rule[i].name] != rule[i].checkRule) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'notsame':
          if (data[rule[i].name] == rule[i].checkRule) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'email':
          reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'phoneno':
          reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'idcardno':
          reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'zipcode':
          reg = /^[0-9]{6}$/;
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'reg':
          reg = new RegExp(rule[i].checkRule);
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'in':
          if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
        case 'notnull':
          if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
            this.error = rule[i].errorMsg;
            return false;
          }
          break;
      }
    }
    return true;
  },
  isNumber: function (checkVal:string) {
    const reg = /^-?[1-9][0-9]?.?[0-9]*$/;
    return reg.test(checkVal);
  }
};

export default checker;

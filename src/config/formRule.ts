/*
 * 应用表单校验相关配置
 * 依赖：checker.js 进行校验
 *
 * 使用：引入该js到页面，let res = checker.checker({phoneNo:"",code:""},formRule.loginRule)
 */

export default {
  /* 用户密码登录 */
  loginByPassRule: [
    {
      name: "mobile",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "手机号不能为空",
    },
    {
      name: "mobile",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "手机号格式不正确",
    },
    {
      name: "password",
      checkType: "string",
      checkRule: "6,18",
      errorMsg: "请输入6-18位密码",
    },
  ],

  /* 用户验证码登录 */
  loginByCodeRule: [
    {
      name: "mobile",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "手机号不能为空",
    },
    {
      name: "mobile",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "手机号格式不正确",
    },
    {
      name: "code",
      checkType: "string",
      checkRule: "4",
      errorMsg: "请输入4位验证码",
    },
  ],

  /* 发送验证码验证手机号 */
  sendCodeRule: [
    {
      name: "mobile",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "手机号不能为空",
    },
    {
      name: "mobile",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "手机号格式不正确",
    },
  ],

  /* 编辑新增个人发票 */
  pInvoiceRule: [
    {
      name: "title",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "发票抬头不能为空",
    },
  ],

  /* 编辑新增公司发票 */
  cInvoiceRule: [
    {
      name: "title",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "发票抬头不能为空",
    },
    {
      name: "duty_paragraph",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "发票税号不能为空",
    },
  ],

  /* 用户注册 */
  registerRule: [
    {
      name: "mobile",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "手机号不能为空",
    },
    {
      name: "mobile",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "手机号格式不正确",
    },
    {
      name: "code",
      checkType: "string",
      checkRule: "4",
      errorMsg: "请输入4位验证码",
    },
    {
      name: "password",
      checkType: "string",
      checkRule: "6,18",
      errorMsg: "请输入6-18位密码",
    },
  ],

  /* 修改用户信息 */
  updateUserInfoRule: [
    {
      name: "nickname",
      checkType: "string",
      checkRule: "2,12",
      errorMsg: "请输入2-12位昵称",
    },
  ],

  /* 密码重置 */
  resetPasswordRule: [
    {
      name: "mobile",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "手机号不能为空",
    },
    {
      name: "mobile",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "手机号格式不正确",
    },
    {
      name: "code",
      checkType: "string",
      checkRule: "4",
      errorMsg: "请输入4位验证码",
    },
    {
      name: "password",
      checkType: "string",
      checkRule: "6,18",
      errorMsg: "请输入6-18位密码",
    },
  ],

  /* 密码重置 */
  promoterApplyRule: [
    {
      name: "mobile",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "手机号不能为空",
    },
    {
      name: "mobile",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "手机号格式不正确",
    },
    {
      name: "realname",
      checkType: "string",
      checkRule: "2,12",
      errorMsg: "请输入2-12位真实姓名",
    } /* , {
		name: 'identity_card',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '身份证号不能为空'
	}, {
		name: 'identity_card',
		checkType: 'idcardno',
		checkRule: '',
		errorMsg: '身份证格式不正确'
	} */,
  ],
};

<template>
	<view>
		<uni-card class="example-body" :isFull="true">
			<text style="font-weight:blod">说明：\n\n</text>
			<text>1. 输入分享链接、或完整视频链接即可。多个视频，链接间换行即可。\n\n</text>
			<text>2. 任务完成后，会有服务通知提醒。由于长度限制，需要进入公众号回复【音频】两字获取下载链接。点击服务通知即可进入公众号。\n\n</text>
			<text>3. 长时间未完成，更多需求或意见，直接在公众号内留言。</text>
			<br></br>
			<el-input type="textarea" :autosize="{ minRows: 16, maxRows: 40}" placeholder="这是个🌰 有其他内容都能解析到~
			
【【竹笛】左手指月 来了，挑战笛子音域极限 《香蜜沉沉烬如霜》片尾曲 不好听。。。 UP主去跳兔子舞！-哔哩哔哩】 https://b23.tv/W3i97LU

第二个视频👇👇👇
https://www.bilibili.com/video/BV19T4y1c7op?from=search&seid=12490260815654528041
 
一次最多五个视频!" v-model="value">
			</el-input>
			
			<div style="text-align:center; padding-top: 30px; padding-bottom: 200px;">
			<wx-open-subscribe template="fz7qD2rvdF8-NVCKDyetJkga2zJC4APH1PnY7lZKD9Y" v-pre id="subscribe-btn">
				<script type="text/wxtag-template" slot="style">
					<style>
					  .subscribe-btn {
						width:300px;
						height: 45px;
						border-radius: 4px;
						margin:0 auto;
						color: #fff;
					    text-align: center;
					    border: none;
						background-color: #07c160;
					  }
					</style>
				</script>
				<script type="text/wxtag-template">
					<!-- <el-button type="primary" class="subscribe-btn">提交心愿单</el-button> -->
					<button class="subscribe-btn">提交心愿单</button>
				</script>
			</wx-open-subscribe>
			</div>



		</uni-card>


	</view>
</template>

<script>
	var jweixin = require('jweixin-module')

	export default {
		data() {
			return {
				value: '',
				code: ''
			}
		},
		mounted() {
			var btn = document.getElementById('subscribe-btn');
			btn.addEventListener('success', this.submita);
			btn.addEventListener('error', function(e) {
				console.log('失败了 ', e.detail);
			});
		},

		onLoad() {

			let url = window.encodeURIComponent(location.href.split('#')[0])

			var requestUrl =
				`wx/${process.uniEnv.VUE_APP_WX_APPID}/user/jsapiSignature?url=${url}`
			this.$ajax.get(requestUrl).then((response) => {
				jweixin.config({
					debug: false, //是否开启debug
					appId: process.uniEnv.VUE_APP_WX_APPID, //必填，公众号的唯一标识
					timestamp: response.data.timestamp, // 必填，生成签名的时间戳
					nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
					signature: response.data.signature, // 必填，签名
					jsApiList: ['wx-open-subscribe', 'wx-open-launch-app', 'launchAppLication'],
					openTagList: ['wx-open-subscribe', 'wx-open-launch-app', 'wx-open-subscribe-dialog']
				});
			}).catch((e) => {

			})

			jweixin.ready(() => {
				console.log("ready");
				//config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
			});
			jweixin.error(res => {
				console.info("开始error", res);
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
			});




			var token = this.$cookies.get("token")
			if (token != null) {
				return;
			}

			this.code = this.getUrlParam("code")
			if (this.code == null) {
				this.jumpAuthUrl()
			} else {
				this.login()
			}


		},
		methods: {
			submita(e) {
				let subscribeDetails = JSON.parse(e.detail.subscribeDetails); // 全部的模板
							
				console.log(e.detail)
				let subKey = subscribeDetails['fz7qD2rvdF8-NVCKDyetJkga2zJC4APH1PnY7lZKD9Y']; // 获取每个模板的状态
				console.log('subkey')
				console.log(subKey)
				let status = JSON.parse(subKey);
				console.log(`status: ${status}`)
				if(status.status == 'accept') {
					this.$message.info({message: '正在解析任务中，请稍后！', duration:8000});
					this.$ajax.post({url: 'bilibili/audio', data: {"data": this.value}}).then((response) => {
						console.log("请求任务", response)
						if (response.data != null) {
							this.value = ''
							this.$message.success({message: `解析到${response.data}个视频，开始处理！请关注服务通知`, duration:8000});
						} else {
							this.$message.error(response.msg);
						}
					}).catch((e) => {
					
					})

				}
			},
			jumpAuthUrl() {
				
				console.log(window.location.href)
				var url =
					`wx/${process.uniEnv.VUE_APP_WX_APPID}/user/authorizationUrl?scope=snsapi_userinfo&redirectUri=${window.location.href}`
					
				console.log(url)
				this.$ajax.get(url).then((response) => {
					console.log("获取授权链接", response)
					if (response.data != null) {
						window.location.href = response.data
					} else {
						this.$message.error('服务器开小差了，请在公众号联系开发者');
					}
				}).catch((e) => {

				})
			},
			login() {
				this.$ajax.post(
					`wx/${process.uniEnv.VUE_APP_WX_APPID}/user/login?code=${this.code}`
				).then((response) => {
					this.$cookies.set("token", response.data, '7d')
				})
			},
			getUrlParam(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return decodeURIComponent(r[2]);
				}
				return null; //返回参数值
			},
		}
	}
</script>
<style>
	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url("~@/static/uni.ttf") format("truetype");
	}

	/* #endif */
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}



	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #007AFF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
	}

	.example-box {
		margin: 12px 0;
	}

	.image-box {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		height: 350rpx;
		overflow: hidden;
	}

	.image {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		flex: 1;
	}

	.content-box {
		padding-top: 20rpx;
	}

	.content-box-text {
		font-size: 12px;
		line-height: 22px;
	}

	.footer-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
		flex-direction: row;
	}

	.footer-box__item {
		align-items: center;
		padding: 2px 0;
		font-size: 12px;
		color: #666;
	}
</style>

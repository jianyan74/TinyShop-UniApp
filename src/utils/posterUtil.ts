// 海报生成
const mPosterUtil = {
    async productPoster(qsc, params) {
        const {
            avatar,
            nickname,
            typeName,
            productPosterTitle,
            cover,
            price,
            productTitle,
            themeColor,
            thirdPartyWechatMiniQrCodeImg,
            currentUrl,
        } = params;
        const width = 750,
            height = 1260;
        // 设置默认字体大小
        //绘制整体背景
        qsc.setRect({x: 0, y: 0, height, width});
        //保存画笔 再重新设置为白色
        qsc.saveAndSetPaintbrush({
            fillStyle: "#fff",
        });
        //填充 白色
        qsc.fill();
        //恢复为默认
        qsc.restorePaintbrush();
        //批量绘制
        await qsc.drawArray([
            {
                type: "text",
                val: nickname,
                x: width * 0.26,
                y: width * 0.1,
                paintbrushProps: {font: {fontSize: uni.upx2px(72)}},
            },
            {
                type: "text",
                val: productPosterTitle || "",
                x: width * 0.26,
                y: width * 0.17,
                paintbrushProps: {
                    fillStyle: "#666",
                    font: {fontSize: uni.upx2px(64)},
                },
            },
            {
                type: "text",
                val: typeName === "普通商品" ? "" : typeName,
                x: width * 0.75,
                y: width * 0.13,
                paintbrushProps: {
                    fillStyle: themeColor,
                    font: {fontSize: uni.upx2px(64)},
                },
            },
            {
                type: "image",
                val: cover,
                x: width * 0.04,
                y: width * 0.32,
                height: width * 0.92,
                width: width * 0.92,
                mode: "aspectFill",
            },
            {
                type: "text",
                val: price,
                x: width * 0.04,
                y: height * 0.82,
                paintbrushProps: {
                    font: {
                        fontSize: uni.upx2px(76),
                        fontWeight: 700,
                    },
                    fillStyle: themeColor,
                },
            },
            {
                type: "text",
                val: productTitle,
                x: width * 0.05,
                y: height * 0.88,
                maxWidth: width * 0.6,
                line: 1,
                paintbrushProps: {
                    font: {fontSize: uni.upx2px(72), fontWeight: 700},
                },
            },
            {
                type: "text",
                val: productTitle,
                x: width * 0.05,
                y: height * 0.88,
                maxWidth: width * 0.6,
                line: 1,
                paintbrushProps: {
                    font: {fontSize: uni.upx2px(72), fontWeight: 700},
                },
            },
        ]);
        // 绘制头像
        qsc.setCircle({
            x: width * 0.04,
            y: width * 0.07,
            d: width * 0.18,
            clip: true,
        });
        await qsc.drawImg({
            val: avatar,
            x: width * 0.04,
            y: width * 0.07,
            height: width * 0.18,
            width: width * 0.18,
        });
        //重置状态
        qsc.restore();
        //绘制二维码 微信二维码或普通二维码
        if (thirdPartyWechatMiniQrCodeImg) {
            await qsc.drawImg({
                val: thirdPartyWechatMiniQrCodeImg,
                x: width * 0.7,
                y: height - width * 0.35,
                height: width * 0.26,
                width: width * 0.26,
            });
        } else {
            // 绘制二维码
            await qsc.drawQrCode({
                val: currentUrl,
                x: width * 0.7,
                y: height - width * 0.35,
                size: width * 0.26,
            });
        }
        //变更画布宽高
        await qsc.updateCanvasWH({
            width,
            height,
        });
        await qsc.draw();
        return await qsc.toImage();
    },
    async promotePoster(qsc, params) {
        const {
            bgWidth,
            bgHeight,
            backgroundColor,
            avatar,
            bgUrl,
            config,
            qrCodeUrl,
            nickname,
        } = params;
        const width = bgWidth,
            height = bgHeight;
        // 设置默认字体大小
        qsc.setPaintbrush({
            font: {
                fontSize: uni.upx2px(30),
            },
        });
        qsc.setRect({x: 0, y: 0, height, width});
        qsc.saveAndSetPaintbrush({
            fillStyle: backgroundColor,
        });
        qsc.fill();
        qsc.restorePaintbrush();
        // 绘制图片
        await qsc.drawImg({
            val: bgUrl,
            x: 0,
            y: 0,
            height: bgHeight,
            width: bgWidth,
        });
        qsc.restore();
        if (config[1]?.dx) {
            await qsc.drawArray([
                {
                    type: "text",
                    val: nickname,
                    x: config[1].dx,
                    y: config[1].dy,
                    paintbrushProps: {
                        fillStyle: "#fff",
                        font: {fontSize: uni.upx2px(config[1].size * 2)},
                    },
                }
            ]);
        }
        await qsc.updateCanvasWH({
            width,
            height,
        });
        if (config[0]?.dx) {
            // 绘制图片
            qsc.setCircle({
                x: config[0].dx,
                y: config[0].dy,
                d: config[0].size,
                clip: true,
            });
            await qsc.drawImg({
                val: avatar,
                x: config[0].dx,
                y: config[0].dy,
                height: config[0].size,
                width: config[0].size,
            });
            qsc.restore();
        }
        if (config[2].size) {
            // 绘制二维码
            await qsc.drawQrCode({
                val: qrCodeUrl,
                x: config[2].dx,
                y: config[2].dy,
                size: config[2].size,
            });
        }
        await qsc.draw();
        return await qsc.toImage();
    },
    async mpMarketingPricePoster(qsc, params) {
        try {
            const {nickname, avatar, cover} = params;
            // 设置默认字体大小
            qsc.setPaintbrush({
                font: {
                    fontSize: uni.upx2px(30),
                },
            });
            const width = 750,
                height = 1260;
            qsc.setRect({x: 0, y: 0, height, width});
            qsc.saveAndSetPaintbrush({
                fillStyle: "#fff",
            });
            qsc.fill();
            qsc.restorePaintbrush();
            //
            // qsc.setCircle({
            //     x: width * 0.04,
            //     y: width * 0.07,
            //     d: width * 0.18,
            //     clip: true,
            // });
            // // 绘制图片
            // await qsc.drawImg({
            //     val: avatar,
            //     x: width * 0.04,
            //     y: width * 0.07,
            //     height: width * 0.18,
            //     width: width * 0.18,
            // });
            // qsc.restore();
            // await qsc.drawText({
            //     val: nickname,
            //     x: width * 0.26,
            //     y: width * 0.07,
            //     paintbrushProps: {
            //         fillStyle: "#f60",
            //         font: {fontSize: uni.upx2px(64)},
            //     },
            // });
            await qsc.drawImg({
                val: cover,
                x: 0,
                y: width * 0.32,
                height: width * 0.99,
                width: width * 0.99,
                mode: "aspectFill",
            })

            await qsc.updateCanvasWH({
                width,
                height,
            });
            await qsc.draw();
            return await qsc.toImage();
        } catch (e) {
            //
            console.log("e = " + JSON.stringify(e));
        }
    },
};
export default mPosterUtil;

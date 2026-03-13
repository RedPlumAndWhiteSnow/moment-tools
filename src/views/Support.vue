<template>
  <div class="support-page">
    <div class="support-container">
      <!-- 头部 -->
      <div class="hero-card">
        <div class="heart-icon">❤️</div>
        <h1 class="hero-title">支持片刻</h1>
        <p class="hero-subtitle">
          片刻是一个免费的在线工具集<br>
          如果你喜欢我们的工具，欢迎支持我们继续维护
        </p>
      </div>

      <!-- 收款码 -->
      <div class="qr-row">
        <div class="qr-card">
          <img :src="wechatQr" alt="微信" class="qr-image wechat">
          <h3 class="qr-title wechat">微信</h3>
          <p class="qr-desc">扫码支持我们</p>
        </div>
        <div class="qr-card">
          <img :src="alipayQr" alt="支付宝" class="qr-image alipay">
          <h3 class="qr-title alipay">支付宝</h3>
          <p class="qr-desc">扫码支持我们</p>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="contact-card">
        <h3 class="contact-title">📧 联系我们</h3>
        <p class="contact-text">有任何问题或建议？欢迎通过邮件联系我们</p>
        <a href="mailto:support@aiyun1.cloud" class="contact-email">support@aiyun1.cloud</a>
      </div>
    </div>
  </div>
</template>

<script setup>
// 使用绝对路径引用 public 目录下的图片
const wechatQr = '/qrcode/wechat.png'
const alipayQr = '/qrcode/alipay.png'
</script>

<style scoped>
.support-page {
  padding: 32px 32px 32px 40px;
  background: var(--bg-light);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.support-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hero-card .heart-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--brand-primary);
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.qr-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 32px;
}

.qr-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.qr-card:hover {
  transform: translateY(-4px);
}

.qr-image {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  margin-bottom: 16px;
  object-fit: cover;
}

.qr-image.wechat {
  border: 5px solid #07c160;
  box-shadow: 0 6px 20px rgba(7, 193, 96, 0.3);
}

.qr-image.alipay {
  border: 5px solid #00d2ff;
  box-shadow: 0 6px 20px rgba(0, 210, 255, 0.3);
}

.qr-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.qr-title.wechat {
  color: #07c160;
}

.qr-title.alipay {
  color: #00d2ff;
}

.qr-desc {
  font-size: 13px;
  color: #999;
}

.contact-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.contact-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.contact-text {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.contact-email {
  display: inline-block;
  font-size: 16px;
  color: var(--brand-primary);
  font-weight: 600;
  text-decoration: none;
  padding: 12px 24px;
  background: #f5f3ff;
  border-radius: 8px;
  transition: all 0.2s;
}

.contact-email:hover {
  background: var(--brand-primary);
  color: #fff;
}

@media (max-width: 767px) {
  .support-page {
    padding: 80px 16px 16px;
  }

  .qr-row {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .hero-card {
    padding: 24px 16px;
  }

  .heart-icon {
    font-size: 48px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .qr-card {
    padding: 24px 16px;
  }

  .qr-image {
    width: 200px;
    height: 200px;
  }
}
</style>

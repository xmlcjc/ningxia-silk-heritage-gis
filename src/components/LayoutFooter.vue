<template>
  <footer class="layout-footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <!-- 品牌区 -->
          <div class="footer-brand">
            <router-link to="/" class="brand-link" aria-label="宁夏丝路非遗地理志 · 返回首页">
              <span class="brand-mark" aria-hidden="true">
                <img src="/logo-gold.svg" alt="" />
              </span>
              <span class="brand-copy">
                <span class="brand-name">宁夏丝路非遗地理志</span>
                <span class="brand-en">Ningxia Silk Road Heritage GIS</span>
              </span>
            </router-link>

            <p class="brand-desc">
              基于GIS与WebGIS的宁夏丝路非遗数字化保护、时空可视化与传播展示平台，
              探索“非遗保护+乡村振兴+文旅融合”的协同发展路径。
            </p>

            <div class="brand-tags">
              <span class="tag tag-gold">丝路文化</span>
              <span class="tag tag-gold">黄河文明</span>
              <span class="tag tag-green">数字人文</span>
              <span class="tag tag-green">GIS应用</span>
            </div>
          </div>

          <!-- 项目入口 -->
          <nav class="footer-nav" aria-label="页脚导航">
            <div class="nav-group">
              <h3 class="nav-title">探索</h3>
              <ul class="nav-list">
                <li><router-link to="/">首页</router-link></li>
                <li><router-link to="/map">GIS地图</router-link></li>
                <li><router-link to="/screen">3D大屏</router-link></li>
                <li><router-link to="/archive">数字档案</router-link></li>
              </ul>
            </div>

            <div class="nav-group">
              <h3 class="nav-title">项目</h3>
              <ul class="nav-list">
                <li><router-link to="/project">项目概况</router-link></li>
                <li><router-link to="/protection">保护路径</router-link></li>
                <li><router-link to="/about">关于我们</router-link></li>
              </ul>
            </div>

            <div class="nav-group">
              <h3 class="nav-title">联系</h3>
              <ul v-if="contactVerified && hasContact" class="contact-list">
                <li v-if="contact.address">
                  <Icon class="contact-icon" icon="gis:poi" width="16" height="16" />
                  <span>{{ contact.address }}</span>
                </li>
                <li v-if="contact.email">
                  <Icon class="contact-icon" icon="gis:map-send" width="16" height="16" />
                  <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
                </li>
                <li v-if="contact.phone">
                  <Icon class="contact-icon" icon="gis:phone-map" width="16" height="16" />
                  <a :href="'tel:' + contact.phone">{{ contact.phone }}</a>
                </li>
                <li v-if="contact.officeHours">
                  <Icon class="contact-icon" icon="gis:map-time" width="16" height="16" />
                  <span>{{ contact.officeHours }}</span>
                </li>
              </ul>
              <p v-else class="contact-empty">
                公开联系渠道暂未开放。
                <router-link to="/about">了解项目说明</router-link>
              </p>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- 版权与数据来源：沿用项目现有真实信息 -->
    <div class="footer-bottom">
      <div class="container footer-bottom__inner">
        <div class="footer-legal">
          <p class="copyright">© 2024 宁夏丝路非遗地理志 · 保留所有权利</p>
          <p class="source">
            <span>数据来源：宁夏丝路非遗地理志项目档案</span>
            <span class="source-divider" aria-hidden="true">·</span>
            <span>底图：天地图 / 高德地图</span>
          </p>
          <p class="credit">
            地图图标
            <a href="https://github.com/viglino/font-gis" target="_blank" rel="noopener noreferrer">Font-GIS</a>
            by Jean-Marc Viglino ·
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
          </p>
        </div>

        <div class="footer-end">
          <p class="project-note">
            <Icon icon="gis:map-book" width="15" height="15" />
            大学生创新创业训练计划项目
          </p>
          <button type="button" class="back-to-top" @click="backToTop">
            返回顶部
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { contact } from '@/data/project'

// 联系方式仅在字段存在且整体状态为已核验时展示
const contactVerified = contact.verificationStatus === 'VERIFIED'
const hasContact = Boolean(contact.address || contact.email || contact.phone || contact.officeHours)

const backToTop = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}
</script>

<style lang="scss" scoped>
// ============================================
// 品牌型页脚
// ============================================

.layout-footer {
  position: relative;
  background: linear-gradient(180deg, var(--color-dark-surface) 0%, var(--color-dark-surface-deep) 100%);
  border-top: 1px solid var(--color-gold-refined-line);
  color: var(--color-on-dark);
}

.footer-main {
  padding: var(--space-16) 0 var(--space-12);
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
  gap: var(--space-16);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-12);
  }
}

// ============================================
// 品牌区
// ============================================

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: 4px;
  margin-left: -4px;
  border-radius: var(--radius-control);
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--ease-out);

  &:hover {
    background: var(--color-on-dark-gold-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 50%;
  background: var(--color-gold-refined-soft);
  border: 1px solid var(--color-gold-refined-line);

  img {
    display: block;
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-name {
  font-family: var(--font-sub);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--color-on-dark-strong);
}

.brand-en {
  margin-top: 4px;
  font-family: var(--font-en);
  font-size: 0.625rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-on-dark-muted);
}

.brand-desc {
  max-width: 460px;
  margin-bottom: var(--space-6);
  color: var(--color-on-dark);
  font-size: var(--text-body-sm);
  line-height: var(--leading-relaxed);
}

.brand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);

  .tag {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: var(--radius-pill);
    font-size: var(--text-caption);
    line-height: 1.4;
  }

  .tag-gold {
    background: var(--color-on-dark-gold-soft);
    border: 1px solid var(--color-gold-refined-line);
    color: var(--color-on-dark-gold);
  }

  .tag-green {
    background: var(--color-on-dark-success-soft);
    border: 1px solid var(--color-on-dark-success-border);
    color: var(--color-on-dark-success);
  }
}

// ============================================
// 页脚导航
// ============================================

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-8);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-8) var(--space-6);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.nav-title {
  position: relative;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  font-family: var(--font-ui);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: var(--tracking-wider);
  color: var(--color-gold-refined);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 24px;
    height: 1px;
    background: var(--color-gold-refined-line);
  }
}

.nav-list,
.contact-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li + li {
    margin-top: 2px;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    color: var(--color-on-dark);
    font-size: var(--text-body-sm);
    text-decoration: none;
    transition:
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);

    &:hover {
      color: var(--color-secondary);
      transform: translateX(3px);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: var(--radius-sm);
    }
  }
}

.contact-list {
  li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: 6px 0;
    color: var(--color-on-dark);
    font-size: var(--text-body-sm);
    line-height: var(--leading-snug);
  }

  a {
    // 联系方式是普通文本链接，不使用导航项的最小触控高度
    min-height: 0;
  }

  .contact-icon {
    flex: none;
    margin-top: 2px;
    color: var(--color-gold-refined);
  }
}

.contact-empty {
  margin: 0;
  color: var(--color-on-dark-muted);
  font-size: var(--text-body-sm);
  line-height: var(--leading-relaxed);

  a {
    display: inline-block;
    margin-top: var(--space-2);
    color: var(--color-gold-refined);
    text-decoration: none;

    &:hover {
      color: var(--color-secondary);
      text-decoration: underline;
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: var(--radius-sm);
    }
  }
}

// ============================================
// 底部版权区
// ============================================

.footer-bottom {
  border-top: 1px solid var(--color-on-dark-divider);
  background: var(--color-dark-surface-sunken);
  padding: var(--space-6) 0;
}

.footer-bottom__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-6);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.footer-legal {
  display: flex;
  flex-direction: column;
  gap: 4px;

  p {
    margin: 0;
  }

  .copyright {
    color: var(--color-on-dark-soft);
    font-size: var(--text-body-sm);
  }

  .source,
  .credit {
    color: var(--color-on-dark-faint);
    font-size: var(--text-caption);
    line-height: var(--leading-snug);
  }

  .source-divider {
    margin: 0 4px;
  }

  @media (max-width: 768px) {
    .source {
      span {
        display: block;

        &.source-divider {
          display: none;
        }
      }
    }
  }

  a {
    color: var(--color-on-dark-gold);
    text-decoration: none;

    &:hover {
      color: var(--color-secondary-light);
      text-decoration: underline;
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: var(--radius-sm);
    }
  }
}

.footer-end {
  display: flex;
  align-items: center;
  gap: var(--space-4);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-3);
  }
}

.project-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--color-on-dark-gold);
  font-size: var(--text-caption);
  white-space: nowrap;
}

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-gold-refined-line);
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-on-dark-gold);
  font-family: var(--font-ui);
  font-size: var(--text-caption);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);

  &:hover {
    background: var(--color-on-dark-gold-soft);
    border-color: var(--color-gold-refined);
    color: var(--color-secondary-light);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

// 深色 Footer：焦点统一使用金色环，避免全局赭石环在深底上对比不足
.layout-footer a:focus-visible,
.layout-footer button:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}
</style>

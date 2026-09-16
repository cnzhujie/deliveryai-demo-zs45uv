---
spec_id: SPEC-DARK-MODE-001
title: 夜间模式（深色主题）
status: confirmed
template_id: req-spec-v1
schema_version: 1
product_area: deliveryai-demo-zs45uv / 全局界面
baseline_spec: N/A（首次需求）
depends_on_specs: []
supersedes_specs: []
source_documents:
  - 需求澄清.md
  - repos/cnzhujie_deliveryai-demo-zs45uv/AGENTS.md
  - repos/cnzhujie_deliveryai-demo-zs45uv/src/hooks/useElderlyMode.ts
created_at: 2026-09-17
updated_at: 2026-09-17
---

# Spec: 夜间模式（深色主题）

# 0. 文档元信息

## 0.1 基本信息

- **文档类型**: ☒ 新增需求
- **适用产品范围**: deliveryai-demo-zs45uv 全部页面（绑定餐桌、欢迎页、菜单点餐、订单履约、结账支付）
- **版本基线说明**: 基于当前 `main` 分支 `7746788`（Initial commit），单一浅色主题

## 0.2 证据来源

| 来源 | 用途 | 可信度 | 备注 |
|------|------|--------|------|
| 用户需求描述 | 需求原始输入 | 高 | 一句话概述、背景目标、验收标准 |
| AGENTS.md | 技术约定、约束限制、验证方式 | 高 | 仓库根目录 |
| src/hooks/useElderlyMode.ts | localStorage 持久化模式参考 | 高 | 现有代码 |
| src/components/TopBar.tsx | 切换入口位置参考 | 高 | 现有代码 |
| tailwind.config.js | 色板定义、darkMode 配置参考 | 高 | 现有代码 |
| src/index.css | 全局样式、过渡动画 | 高 | 现有代码 |
| src/i18n.ts | 文案添加位置参考 | 高 | 现有代码 |

---

# 1. 需求背景

- **需求类型**: ☒ 用户反馈
- **背景 / 驱动**: 当前界面仅提供浅色主题，暗光环境下亮度过高、视觉疲劳明显。用户期望能切换为深色主题以减少亮度刺激。
- **用户价值**: 为暗光环境使用者提供舒适的视觉体验，减少屏幕亮度刺激。
- **关联重点特性**: 老人模式（useElderlyMode）、语言切换（i18next），均已有 localStorage 持久化先例。

| 用户角色 | 核心场景 | 痛点 | 相关 SA |
|----------|----------|------|---------|
| 门店点单用户 | 夜间或暗光环境访问点单界面 | 界面亮度过高，视觉疲劳 | N/A |

---

# 2. 目标与边界

## 2.1 目标

| 目标 ID | 类目 | 目标描述 | 可度量指标 | 目标值 |
|---------|------|----------|------------|--------|
| GOAL-001 | 用户 | 用户可显式切换浅色/深色主题 | 切换后配色立即变化 | ≤ 250ms 过渡完成 |
| GOAL-002 | 用户 | 深色主题下主要页面可正常阅读与操作 | 对比度满足 WCAG AA | 正文 ≥ 4.5:1, 大文字 ≥ 3:1 |
| GOAL-003 | 技术 | 主题偏好持久化 | 刷新后保持选择 | localStorage 持久化 |
| GOAL-004 | 技术 | 现有功能不受影响 | 浅色模式行为不变 | 功能回归无异常 |

## 2.2 非目标

| 非目标 ID | 不做的内容 | 原因 / 后续规划 |
|-----------|------------|------------------|
| NG-001 | 多套自定义配色或主题编辑器 | 初版仅提供浅色/深色两套 |
| NG-002 | 后端接口与业务逻辑改造 | 项目为纯前端 SPA |
| NG-003 | 第三方嵌入内容覆盖 | 本项目无第三方嵌入内容 |
| NG-004 | 引入额外 UI 库或设计系统框架 | 遵循 AGENTS.md 约定 |
| NG-005 | 使用 CSS Modules 或 styled-components | 遵循 AGENTS.md 约定 |

---

# 3. 核心概念

| 概念 / 术语 | 描述 | 备注 |
|-------------|------|------|
| 夜间模式 / 深色主题 | 以深色背景、浅色文字为主的界面配色方案 | 与浅色主题（暖白/米色背景）对应 |
| 主题偏好持久化 | 用户选择的主题通过 localStorage 保存 | 参照 `elderly-mode` key 模式，key 为 `dark-mode` |
| darkMode: class | Tailwind CSS 的 class 模式暗色主题 | 通过在 `<html>` 上添加 `dark` class 控制 |

---

# 4. 页面与信息架构

## 4.1 入口路径

| 入口 ID | 入口位置 | 目标页面 | 权限 / 前置条件 | 备注 |
|---------|----------|----------|------------------|------|
| ENTRY-001 | TopBar 老人模式按钮旁 | 主题切换（全局） | 无 | Moon/Sun 图标按钮，与老人模式按钮并列 |

## 4.2 页面清单

| 页面 ID | 页面名称 | 页面用途 | 主要操作 | 关联 REQ |
|---------|----------|----------|----------|----------|
| PAGE-001 | 绑定餐桌（BindTable） | 绑定桌台进入流程 | 选择桌台 | REQ-002 |
| PAGE-002 | 欢迎页（WelcomeView） | 欢迎用户进入点餐 | 点击进入菜单 | REQ-002 |
| PAGE-003 | 菜单点餐（MenuView） | 浏览菜品、加购 | 选择菜品、配置规格、加入购物车 | REQ-002 |
| PAGE-004 | 订单履约（OrderView） | 查看订单制作进度 | 取消菜品、前往结账 | REQ-002 |
| PAGE-005 | 结账支付（CheckoutView） | 模拟支付 | 点击支付 | REQ-002 |
| PAGE-006 | 顶部导航栏（TopBar） | 全局导航与功能切换 | 主题切换入口 | REQ-001 |
| PAGE-007 | 桌边服务（ServiceSheet） | 呼叫服务 | 呼叫加汤等 | REQ-002 |
| PAGE-008 | 演示控制台（DemoConsole） | 演示状态控制 | 切换阶段等 | REQ-002 |

## 4.3 页面关系

| 起点 | 用户动作 | 终点 | 说明 |
|------|----------|------|------|
| 任意页面 | 点击 TopBar 主题切换入口 | 同一页面（主题切换） | 切换不改变当前视图 |
| BindTable | 选择桌台 | WelcomeView | 首次进入流程 |
| WelcomeView | 点击进入点餐 | MenuView | 进入主流程 |

---

# 5. 功能需求

## REQ-001: 主题切换入口与交互

**User Story**
> As a 门店点单用户, I want 在界面中切换浅色/深色主题, so that 在暗光环境下能减少亮度刺激、舒适使用界面。

**Priority**: P0

**需求描述**
用户在任意含 TopBar 的页面中，可通过顶部导航栏中老人模式按钮旁的主题切换图标按钮（Moon/Sun 图标）一键切换浅色/深色主题。切换即时生效，利用现有全局 CSS transition（250ms ease）实现平滑过渡。切换入口始终可见，不因视图状态变化而隐藏。浅色模式下显示 Moon 图标提示切换为深色，深色模式下显示 Sun 图标提示切换为浅色。

**Acceptance Requirements**
- **REQ-001.1**: The system **shall** 在 TopBar 中老人模式按钮旁提供主题切换图标按钮，入口始终可见。
- **REQ-001.2**: **When** 当前为浅色主题时, the system **shall** 显示 Moon 图标作为切换入口。
- **REQ-001.3**: **When** 当前为深色主题时, the system **shall** 显示 Sun 图标作为切换入口。
- **REQ-001.4**: **When** 用户点击主题切换入口时, the system **shall** 立即将当前主题切换为另一主题，配色在 250ms 内平滑过渡。
- **REQ-001.5**: **When** 用户切换主题时, the system **shall** 在页面顶部短暂显示切换提示消息（参照现有老人模式消息格式）。
- **REQ-001.6**: The system **shall** 不因主题切换而改变当前页面状态（视图路由、购物车内容、订单状态等）。
- **REQ-001.7**: **If** localStorage 不可用时, the system **shall** 降级为内存态，当前会话内主题切换正常工作，不报错不阻塞。

**用户交互**

| 步骤 | 用户动作 | 产品响应 |
|------|----------|----------|
| 1 | 点击 TopBar 老人模式旁的主题切换图标按钮 | 界面配色在 250ms 内切换为另一主题，图标由 Moon 变 Sun（或反之） |
| 2 | 继续操作 | 当前页面状态不丢失 |
| 3 | 刷新页面 | 主题偏好保持一致 |

**关联埋点**: N/A
**实现映射**: Design §6, Tasks T-001

---

## REQ-002: 深色主题覆盖全部核心页面

**User Story**
> As a 门店点单用户, I want 深色主题覆盖所有页面, so that 在任意页面都能获得一致的深色体验，不出现浅色残留区域。

**Priority**: P0

**需求描述**
深色主题需覆盖全部核心页面（绑定餐桌、欢迎页、菜单点餐、订单履约、结账支付）及其组件（TopBar、CartPanel、ServiceSheet、DemoConsole、Dialog 弹窗等）。所有 UI 元素（背景、文字、边框、按钮、卡片、弹窗）在深色主题下均适配深色配色，不出现浅色残留区域。绑定餐桌页和欢迎页虽不含 TopBar，也需应用深色主题配色。

**Acceptance Requirements**
- **REQ-002.1**: The system **shall** 在深色主题下，将全部核心页面的背景、文字、边框、按钮、卡片、弹窗配色适配为深色方案。
- **REQ-002.2**: **When** 用户在深色主题下浏览绑定餐桌页时, the system **shall** 显示深色背景和浅色文字，包括标题、描述、桌台列表、按钮。
- **REQ-002.3**: **When** 用户在深色主题下浏览欢迎页时, the system **shall** 显示深色背景和适配的配色。
- **REQ-002.4**: **When** 用户在深色主题下浏览菜单点餐页时, the system **shall** 显示深色背景和适配的配色，包括分类标签、菜品卡片、规格弹窗、超级辣风险提示弹窗。
- **REQ-002.5**: The system **shall** 确保深色主题下正文文字与背景对比度 ≥ 4.5:1，大文字（≥ 18px 或 14px bold）对比度 ≥ 3:1。
- **REQ-002.6**: The system **shall** 确保图标（lucide-react）通过 `currentColor` 继承自动适配深色主题。

**用户交互**

| 步骤 | 用户动作 | 产品响应 |
|------|----------|----------|
| 1 | 切换为深色主题 | 所有页面 UI 元素变为深色配色 |
| 2 | 在各页面间导航 | 每个页面均以深色主题呈现 |
| 3 | 打开弹窗（规格弹窗、服务面板等） | 弹窗内也为深色配色 |

**关联埋点**: N/A
**实现映射**: Design §7, Tasks T-002

---

## REQ-003: 主题偏好持久化

**User Story**
> As a 门店点单用户, I want 我选择的主题在刷新后保持一致, so that 不需要每次进入都重新设置。

**Priority**: P0

**需求描述**
用户选择的主题偏好通过 localStorage 持久化（key: `dark-mode`，value: `true`/`false`）。在 React 挂载前，通过 `index.html` 内联脚本读取 localStorage 并设置 `<html>` 元素的 `dark` class，避免页面加载时出现主题闪烁（FOUC）。localStorage 不可用时降级为内存态。首次访问（无 localStorage 记录）时默认显示浅色主题（不跟随系统偏好）。

**Acceptance Requirements**
- **REQ-003.1**: The system **shall** 将用户选择的主题偏好保存到 localStorage（key: `dark-mode`，value: `true`/`false`）。
- **REQ-003.2**: **When** 页面加载时, the system **shall** 在 React 挂载前从 localStorage 读取主题偏好并在 `<html>` 上设置 `dark` class，避免主题闪烁。
- **REQ-003.3**: **If** localStorage 不可用时, the system **shall** 降级为内存态，不报错不阻塞。
- **REQ-003.4**: The system **shall** 在首次访问（无 localStorage 记录）时默认显示浅色主题（不跟随系统偏好）。

**用户交互**

| 步骤 | 用户动作 | 产品响应 |
|------|----------|----------|
| 1 | 选择深色主题 | localStorage 保存 `dark-mode: true` |
| 2 | 刷新页面 | 页面直接以深色主题加载，无闪烁 |
| 3 | 选择浅色主题 | localStorage 保存 `dark-mode: false` |
| 4 | 刷新页面 | 页面直接以浅色主题加载 |

**关联埋点**: N/A
**实现映射**: Design §8, Tasks T-003

---

## REQ-004: 主题切换与现有功能独立共存

**User Story**
> As a 门店点单用户, I want 主题切换与老人模式、语言切换互不影响, so that 可以同时使用多种辅助功能。

**Priority**: P1

**需求描述**
主题切换与老人模式（`useElderlyMode`）、语言切换（i18next）相互独立。三种功能可同时开启，互不影响对方的行为和持久化状态。

**Acceptance Requirements**
- **REQ-004.1**: The system **shall** 确保主题切换与老人模式可同时开启，两者互不影响。
- **REQ-004.2**: The system **shall** 确保主题切换与语言切换可同时使用，两者互不影响。
- **REQ-004.3**: The system **shall** 使用独立的 localStorage key（`dark-mode`），不与 `elderly-mode` 或 `i18nextLng` 冲突。

**关联埋点**: N/A
**实现映射**: Design §8, Tasks T-004

---

# 6. 字段与校验

| 字段 ID | 字段名称 | 类型 | 必填 | 默认值 | 约束 / 校验 | 使用页面 / 展示位置 | 关联 REQ |
|---------|----------|------|------|--------|-------------|----------------------|----------|
| FIELD-001 | dark-mode | string (localStorage) | 否 | `false` | 值为 `true` 或 `false` | localStorage | REQ-003 |
| FIELD-002 | aria-dark-mode | string (i18n key) | 是 | — | 中: `切换至夜间模式`/`切换至浅色模式`；英: `Switch to dark mode`/`Switch to light mode` | TopBar 主题切换按钮 aria-label | REQ-001 |
| FIELD-003 | message-dark-mode | string (i18n key) | 是 | — | 中: `已切换为夜间模式`/`已切换为浅色模式`；英: `Switched to dark mode`/`Switched to light mode` | 顶部消息提示 | REQ-001 |

---

# 7. 状态与流转

## 7.1 状态定义

| 状态 ID | 状态名称 | 含义 | 进入条件 | 退出条件 |
|---------|----------|------|----------|----------|
| STATE-001 | light | 浅色主题（默认） | 初始状态 / 用户选择浅色 | 用户选择深色 |
| STATE-002 | dark | 深色主题 | 用户选择深色 | 用户选择浅色 |

## 7.2 操作流转

| 操作 ID | 用户动作 | 前置状态 | 目标状态 | 生效时机 | 失败处理 | 关联 REQ |
|---------|----------|----------|----------|----------|----------|----------|
| ACTION-001 | 点击主题切换入口 | light | dark | 立即 | localStorage 写入失败时降级为内存态 | REQ-001 |
| ACTION-002 | 点击主题切换入口 | dark | light | 立即 | localStorage 写入失败时降级为内存态 | REQ-001 |

---

# 8. API 设计

> 本次无 API 变更。项目为纯前端 SPA，所有业务逻辑在浏览器中运行，不依赖后端 API。

---

# 9. 非功能性需求

| NFR ID | 类别 | 要求 | 验收方法 |
|--------|------|------|----------|
| NFR-001 | 性能 | 主题切换在 250ms 内完成过渡（利用现有 CSS transition），不引入额外 JS 计算开销 | 切换后检查 computed style 变化时序 |
| NFR-002 | 可用性 | 深色主题下正文对比度 ≥ 4.5:1，大文字 ≥ 3:1（WCAG AA） | 使用对比度检查工具验证 |
| NFR-003 | 兼容 | localStorage 不可用时降级为内存态，不报错不阻塞 | 模拟 localStorage 不可用场景验证 |
| NFR-004 | 可观测 | 主题切换不产生控制台错误或警告 | 浏览器 DevTools Console 检查 |
| NFR-005 | 构建 | `npm run build` 和 `npm run lint` 通过，无新增警告 | 执行构建和 lint 命令 |

---

# 10. 追溯矩阵

| REQ / NFR ID | 设计章节 | Task ID | QA 用例 | API / 埋点 / 迁移 | 证据来源 |
|--------------|----------|---------|---------|-------------------|----------|
| REQ-001 | §5 REQ-001, Design §6 | T-001 | QA-DARK-001~003 | localStorage: dark-mode | 需求澄清.md, TopBar.tsx |
| REQ-002 | §5 REQ-002, Design §7 | T-002 | QA-DARK-004~008 | — | AGENTS.md 色板定义 |
| REQ-003 | §5 REQ-003, Design §8 | T-003 | QA-DARK-009~010 | localStorage: dark-mode, index.html | useElderlyMode.ts |
| REQ-004 | §5 REQ-004, Design §8 | T-004 | QA-DARK-011 | — | useElderlyMode.ts, i18n.ts |
| NFR-001 | §9 | T-001 | QA-DARK-001 | — | src/index.css |
| NFR-002 | §9 | T-002 | QA-DARK-004~008 | — | WCAG AA 标准 |
| NFR-003 | §9 | T-003 | QA-DARK-010 | — | useElderlyMode.ts 降级模式 |
| NFR-005 | §9 | — | — | — | AGENTS.md 验证命令 |

---

# 11. 已确认决策

| 编号 | 决策事项 | 确认结果 | 确认时间 |
|------|---------|----------|----------|
| TC-001 | 是否跟随系统偏好 | 不跟随系统偏好，默认浅色主题，用户手动切换 | 2026-09-17 |
| TC-002 | 主题切换入口位置 | 放在 TopBar 老人模式按钮旁，使用 Moon/Sun 图标按钮 | 2026-09-17 |
| TC-003 | 覆盖范围 | 覆盖全部页面，包括绑定餐桌页和欢迎页 | 2026-09-17 |

---

# 12. 产物说明

## 引用的共享产物

- `artifacts/_manifest.json`：当前无上游历史产物（items 为空）。
- `repos/manifest.yaml`：仓库 `cnzhujie/deliveryai-demo-zs45uv`，base branch `main`，work branch `feat/dark-mode-v8ty`。
- `knowledge/template/需求澄清规范.md`：需求澄清文档结构规范。
- `knowledge/template/需求Spec模板.md`：Spec 文档结构模板。
- `repos/cnzhujie_deliveryai-demo-zs45uv/AGENTS.md`：仓库技术约定与验证方式。

## 本次产出

| 产物 | 位置 | 说明 |
|------|------|------|
| 需求澄清.md | deliverables/ | 需求澄清文档，包含背景、目标、需求详情、约束、验收标准、已确认事项 |
| Spec.md | deliverables/ | 需求 Spec 文档，包含功能需求（REQ-001~004）、非功能性需求、追溯矩阵、已确认决策 |

## 后续节点消费方式

- **代码开发节点**：以 Spec.md 中 REQ-001~004 和 NFR-001~005 为开发依据，参照需求澄清.md 中的产品规则和约束限制。关键实现要点：
  - 新增 `src/hooks/useDarkMode.ts`（参照 `useElderlyMode.ts`）
  - 在 `tailwind.config.js` 配置 `darkMode: 'class'`
  - 在 `index.html` 内联脚本中添加防闪烁初始化
  - 在 `src/components/TopBar.tsx` 老人模式按钮旁新增 Moon/Sun 图标按钮
  - 在 `src/App.tsx` 集成 `useDarkMode` hook
  - 在 `src/i18n.ts` 添加中英文文案
  - 在 `src/index.css` 添加深色主题全局样式
  - 为各组件添加 `dark:` Tailwind 变体
- **自动化测试节点**：以 Spec.md 中验收标准为测试用例编写依据，参照追溯矩阵中 QA 用例编号。
- **代码 Review 节点**：以需求澄清.md 中"不做"清单和约束限制为 Review 检查点。

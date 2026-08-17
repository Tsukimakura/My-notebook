# Coding Agent 安全调研记录

> 访问日期：2026-07-28。本文将资料分为三类：官方安全公告、研究者复盘、产品文档/社区 Issue。只有官方安全公告可以直接表述为“已确认漏洞”；社区 Issue 仅作为待验证线索。

## 来源

链接：[Gemini CLI 与 run-gemini-cli 信任模型更新（GHSA-wpqr-6v78-jr5g）](https://github.com/google-github-actions/run-gemini-cli/security/advisories/GHSA-wpqr-6v78-jr5g)

日期：2026-04-24

产品 / 版本：`@google/gemini-cli` `< 0.39.1`（以及 `< 0.40.0-preview.3`）；`google-github-actions/run-gemini-cli` `< 0.1.22`。修复版本分别为 `0.39.1` / `0.40.0-preview.3` 与 `0.1.22`。

## 攻击面

旧版 Gemini CLI 在 GitHub Actions 等无交互（headless）环境中，会自动信任工作区，从而加载工作区内的 `.gemini/` 配置和环境变量。若工作流处理的是外部用户提交的 PR、Issue 或其检出的目录，攻击者便可能借由恶意 `.gemini/` 目录或不可信文本影响 Agent 的行为。

公告还特别指出：当 Agent 在 `--yolo` 模式下处理不可信内容时，例如自动分流公开 Issue，攻击者可通过提示词注入诱导 Agent 调用工具。

## 权限

风险并不来自 Issue 文本本身，而来自其进入了具备工具能力的 Agent 上下文。旧行为中，headless 模式会处理工作区配置和环境变量；并且 `--yolo` 模式曾忽略 `settings.json` 中的细粒度工具白名单。于是本来只想允许少数安全命令的 CI 工作流，可能实际授予了更宽的 shell/文件访问能力。

## 根因

这是信任边界和授权策略共同失效的问题：

1. 将不可信工作区在无人工确认的 CI 中自动设为可信，导致配置与环境变量被加载；
2. `--yolo` 的自动批准语义覆盖了细粒度工具白名单，使“配置上限制工具”的安全假设不成立；
3. 当不可信输入、可访问的敏感数据、可执行或可写出的工具同时存在时，提示词注入就能从模型行为问题升级为代码执行或秘密泄露问题。

这是本次调研中证据最强、最适合作为题目原型的案例：它是官方披露且已修复的历史漏洞，而不是尚未验证的网络传言。

---

## 来源

链接：[Pillar Security：My Agentic Trust Issues: From Prompt Injection to Supply-Chain Compromise on gemini-cli](https://www.pillar.security/blog/my-agentic-trust-issues-from-prompt-injection-to-supply-chain-compromise-on-gemini-cli)

日期：2026-05-05

产品 / 版本：Gemini CLI 与 `run-gemini-cli` GitHub Action；文章讨论的缺陷已由上述 GHSA 修复。本文属于研究团队复盘，关键版本和修复信息可由官方 GHSA 交叉验证。

## 攻击面

研究者关注的是“公开 Issue 自动分流”工作流：任意 GitHub 用户能创建 Issue，Issue 正文被直接交给 AI Agent 阅读和处理。攻击者不需要仓库写权限，只需把恶意指令放入公开文本，便拥有一个影响 Agent 决策的输入入口。

## 权限

文章提出了 **lethal trifecta（致命三要素）**：

1. Agent 可读取私密数据，例如 CI 环境、工作区文件或持久化到 `.git/config` 的 Git 凭据；
2. Agent 会处理外部攻击者可控的 Issue/PR 文本；
3. Agent 具有外发或写出能力，例如执行命令、修改 Issue、写公开日志或触发工作流。

三者同时存在时，即使工作流没有把 Token 直接放进 Agent 的环境变量，工作区或父进程中仍可能存在可读凭据，造成秘密泄露和后续权限升级。

## 根因

根因不是“模型没有正确拒绝恶意句子”这么简单，而是把提示词当作安全边界。系统提示词无法替代最小权限、凭据隔离和输出通道控制。文章还指出，清空子进程的 `GITHUB_TOKEN` 并不能保护已经被 checkout 步骤写入 `.git/config` 的凭据。

该材料适合用于报告的威胁建模部分：重点应落在输入可信度、Agent 权限、秘密可达性和外发通道，而不应只讨论某一句 jailbreak prompt。

---

## 来源

链接：[Claude Code Action 安全文档](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)

日期：持续更新的官方文档；访问于 2026-07-28

产品 / 版本：`anthropics/claude-code-action`。该文档是安全使用指南，并非某个已确认漏洞公告。

## 攻击面

公开仓库中的 Issue、评论、PR 描述和 PR 文件都可能是外部攻击者可控内容。文档特别警告：允许任意 bot 或非写权限用户触发 Action，会使攻击者能够以其控制的 prompt 激活 Agent。`pull_request_target` 或 `workflow_run` 若在 Agent 启动前把不可信 PR checkout 到工作区根目录，也会把不可信文件带进 Agent 的工作环境。

## 权限

Claude Code Action 可能拥有仓库内容、Issue、PR 等读写权限。文档建议将 GitHub Actions 的 `permissions:` 限制到最小范围，使用短生命周期的工作流 Token，并限制 Agent 允许使用的工具。即使有环境变量清理和 Linux 隔离，官方也明确说明这只能降低、不能消除提示词注入风险。

## 根因

这里揭示的是通用的 Agentic CI/CD 配置风险：不可信输入可以触发拥有仓库写入或秘密访问能力的 Agent；如果权限过大或工具范围过宽，模型是否“听话”就变成了唯一防线。官方建议不要在高权限 `pull_request_target` 环境中直接 checkout 不可信 PR，并且应保留人工创建 PR 的步骤。

这份材料可以用于横向证明：不同厂商的 Coding Agent 都将“外部文本进入 Agent 上下文”视为安全边界，而不是普通输入校验问题。

---

## 来源

链接：[Claude Code Issue #28812：PreToolUse hook 的 `allow` 会跳过原生权限提示](https://github.com/anthropics/claude-code/issues/28812)

日期：2026 年发布的社区 Issue；访问于 2026-07-28

产品 / 版本：Claude Code，Issue 报告者称其在 Claude Code `v2.1.59`、macOS 上复现。该 Issue 尚不是官方安全公告，应标记为待验证线索。

## 攻击面

开发者可能编写 `PreToolUse` hook，意图是“发现危险命令就拒绝，其他命令继续走原有审批流程”。但如果 hook 在非危险分支返回显式的 `permissionDecision: allow`，据报告会直接批准工具调用，原本的 Allow/Deny 审批框不再出现。

## 权限

该问题影响 Agent 对 Bash、编辑等工具的审批流程。原本用户期待由原生权限系统继续确认的操作，可能因 hook 的默认 `allow` 分支而自动执行。Issue 中的建议做法是：安全过滤型 hook 只在命中危险模式时输出拒绝结果，未命中时不输出权限决定。

## 根因

根因是 API 语义容易被误解：显式 `allow` 的含义是“由 hook 直接批准”，而不是“允许进入下一层权限检查”。这属于安全控制组合时的 fail-open 风险。

报告写作时应使用谨慎措辞，例如“社区报告指出”“据 Issue 描述”，不要写成 Anthropic 已确认的漏洞。它适合作为本题的备选彩蛋：让选手审计一个看似安全、实际默认放行的 hook。

---

## 来源

链接：[Gemini CLI Custom Commands 文档](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/custom-commands.md)

日期：持续更新的官方文档；访问于 2026-07-28

产品 / 版本：Gemini CLI 当前 Custom Commands 功能；不是漏洞公告。

## 攻击面

Custom Command 的 prompt 可使用 `@{path}` 将文件或目录内容插入最终 prompt，也可使用 `!{command}` 执行 shell 命令，并把输出插回 prompt。`{{args}}` 则用于插入用户参数。也就是说，文件、目录、用户参数和命令输出都可能汇入模型上下文。

## 权限

文档说明 `!{...}` 触发 shell 命令时会展示最终命令并请求用户确认；`{{args}}` 在 shell 上下文中会被转义；文件路径仅允许位于工作区内。这些都是为了缩小“文本拼接后变为命令或敏感上下文”的风险。

## 根因

此处没有披露漏洞，而是展示 Agent 系统中常见的数据流：先注入文件内容，再执行命令替换，最后进行参数替换并把结果交给模型。若命令模板、工作区信任或审批机制配置不当，原本的数据注入可能升级为 prompt injection 或命令执行风险。

该文档适合用来解释一个重要区别：`@{...}` 是“把数据放进 prompt”，`!{...}` 是“执行命令”；二者都必须由独立的权限与信任边界保护。

---

## 来源

链接：[OpenCode Agents 与 Permissions 文档](https://opencode.ai/docs/agents)

日期：持续更新的官方文档；访问于 2026-07-28

产品 / 版本：OpenCode Agents；不是漏洞公告。

## 攻击面

OpenCode 支持项目级和全局 Agent 定义。Agent 的 Markdown 提示词、项目中的 Agent 配置、以及 Agent 读取的仓库文件都可能影响其行为。对来自他人的仓库而言，这些项目内说明和文档应视为不可信输入，而不能天然视作开发者本人的可信意图。

## 权限

OpenCode 将 `read`、`edit`、`bash`、`webfetch`、`external_directory`、`task` 等能力单独配置为 `ask`、`allow` 或 `deny`，并允许按 Agent 覆盖全局策略、按命令模式细分 Bash 权限。这说明真正可强制执行的安全边界是工具权限，而不是 Agent Markdown 中写的“请勿执行危险操作”。

## 根因

这不是已披露漏洞，而是权限设计带来的常见误配风险：若一个用于审计不可信项目的 Agent 被赋予 `bash: allow`、`webfetch: allow` 或项目外目录访问能力，仓库文档中的提示词注入可能获得实际影响。反之，`edit: deny`、`bash: deny` 一类工具级限制可以在模型被误导后仍阻止敏感操作。

该资料可用于报告中的产品对比：提示词描述的是软约束，`ask/allow/deny` 才是硬约束；安全题应该考察两者是否被错误地混淆。

---

## 来源

链接：[Codex：Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)

日期：持续更新的官方文档；访问于 2026-07-28

产品 / 版本：OpenAI Codex 当前安全与审批配置文档；不是漏洞公告。

## 攻击面

Codex 文档明确将网页搜索结果和经网络获取的内容视为不可信，并警告 prompt injection 可诱使 Agent 继续抓取或遵从外部指令。启用 live web search、命令网络访问、代理或更宽的 Unix socket 访问，会扩大 Agent 可接触的攻击者内容与可通信范围。

## 权限

文档提供沙箱、审批策略、网络域名 allowlist、Unix socket allowlist、管理端 `requirements.toml` 等控制。网络代理默认关闭；域名规则中 deny 优先于 allow。管理员还可以限制允许的 sandbox 模式、Web Search 模式、MCP Server、插件及敏感文件读取。

## 根因

这同样不是已披露漏洞，而是对 Agent 安全模型的官方说明：外部内容不应被当作可信指令；网络、文件和工具权限越大，提示词注入后的影响范围越大。因此安全配置的目标是即使模型受到误导，也无法越过文件、网络、审批和管理策略的硬边界。

该资料适合用于本题的防护章节，并可与 Gemini CLI 的历史漏洞形成对比：前者说明当前防护原则，后者展示信任和白名单未被强制执行时的后果。

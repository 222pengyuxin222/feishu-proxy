import express from 'express';
const app = express();

// 允许跨域（前端可以访问）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 飞书配置（请替换为你的真实信息）
const CONFIG = {
  appId: 'cli_a94b60fef0badbd9',           // 替换这里
    appSecret: 'eQZayMAoGikbE9HgK9uwcf2C2DvJnvpo',   // 替换这里
    appToken: 'JZXJbkOrKabNiKsh4zZc62Funzf',     // 替换这里
    tableId: 'tblKvXLv7g2yXMJM'        // 替换这里
};

// 定义代理接口 /api/proxy
app.get('/api/proxy', async (req, res) => {
  try {
    // 1. 获取 tenant_access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: CONFIG.appId, app_secret: CONFIG.appSecret })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.tenant_access_token) {
      throw new Error(tokenData.msg || '获取token失败');
    }
    const token = tokenData.tenant_access_token;

    // 2. 获取多维表格数据
    const recordsRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${CONFIG.appToken}/tables/${CONFIG.tableId}/records?page_size=100`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const recordsData = await recordsRes.json();

    // 返回数据
    res.json(recordsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器，监听 3000 端口
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 代理服务已启动，访问 http://localhost:${PORT}/api/proxy`);
});